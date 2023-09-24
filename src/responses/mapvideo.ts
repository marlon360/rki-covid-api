import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { weekIncidenceColorRanges } from "../configuration/colors";
import sharp from "sharp";
import { mapTypes, getColorForValue, getMapBackground } from "./map";
import { getDistrictByAGS, DistrictsCasesHistoryResponse } from "./districts";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import {
  getMetaData,
  getDateBeforeDate,
  MetaData,
  getStateIdByAbbreviation,
} from "../utils";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import { StatesCasesHistoryResponse, getStateById } from "./states";
import si from "systeminformation";

function ffmpegSync(
  framesNameSearch: string,
  mp4FileName: string,
  frameRate: string,
  pictNumber: number
) {
  return new Promise<{ filename: string }>((resolve, reject) => {
    ffmpeg()
      .input(framesNameSearch)
      .inputOptions("-framerate", frameRate)
      .videoCodec("libx264")
      .outputOptions("-pix_fmt", "yuv420p")
      .saveToFile(mp4FileName)
      .on("end", () => {
        for (let x = 1; x < pictNumber; x++) {
          const xString = x.toString().padStart(4, "0");
          const delstring = framesNameSearch.replace("%04d", xString);
          fs.rmSync(delstring);
        }
        resolve({ filename: mp4FileName });
      })
      .on("error", (err) => {
        return reject(new Error(err));
      });
  });
}

export enum Region {
  districts = "districts",
  states = "states",
}

interface IncidencesPerDay {
  [dateString: string]: {
    [key: string]: {
      incidence: number;
    };
  };
}

export async function IncidencePerDayHistory(
  metaData: MetaData,
  region: Region,
  days?: number
): Promise<IncidencesPerDay> {
  let regionHistoryData;
  let regionsData;
  if (region == Region.districts) {
    regionHistoryData = await DistrictsCasesHistoryResponse(
      days,
      null,
      metaData
    );
    regionsData = await getDistrictsData(metaData);
  } else if (region == Region.states) {
    regionHistoryData = await StatesCasesHistoryResponse(days, null, metaData);
    regionsData = await getStatesData(metaData);
  }
  const incidencesPerDay: IncidencesPerDay = {};

  for (const key of Object.keys(regionHistoryData.data)) {
    const regionHistory = regionHistoryData.data[key].history;
    const keyToUse =
      region == Region.districts
        ? key
        : getStateIdByAbbreviation(key).toString();
    const regionData =
      region == Region.districts
        ? getDistrictByAGS(regionsData, keyToUse)
        : getStateById(regionsData, parseInt(keyToUse));
    for (let i = 6; i < regionHistory.length; i++) {
      const date = regionHistory[i].date;
      let sum = 0;
      for (let dayOffset = i; dayOffset > i - 7; dayOffset--) {
        sum += regionHistory[dayOffset].cases;
      }
      if (!incidencesPerDay[date.toISOString()]) {
        incidencesPerDay[date.toISOString()] = {
          [keyToUse]: { incidence: (sum / regionData.population) * 100000 },
        };
      } else {
        incidencesPerDay[date.toISOString()][keyToUse] = {
          incidence: (sum / regionData.population) * 100000,
        };
      }
    }
  }
  // store this to redis

  return incidencesPerDay;
}

export async function VideoResponse(
  region: Region,
  mapType: mapTypes = mapTypes.map,
  CPUcheck: boolean,
  days?: number
): Promise<{ filename: string }> {
  if (CPUcheck) {
    const cpuInfo = await si.cpu();
    if (cpuInfo.physicalCores < 4 && cpuInfo.speedMax < 2) {
      throw new Error(
        "The CPU of this Server is not powerful enough to calculate this request in a reasonable time! If you are sure, you can overwrite this check with “nocpucheck” bevor the link. e.g. https://server:port/nocpucheck/states/legend"
      );
    }
  }
  const metaData = await getMetaData();
  // cleanUp ./video directory
  const allFiles = fs.readdirSync("./videos");
  allFiles.forEach((filename) => {
    if (
      !filename.includes(getDateBeforeDate(metaData.version)) &&
      filename !== "Readme.md"
    ) {
      fs.rmSync(`./videos/${filename}`);
    }
  });
  let oldDays: number;
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
    oldDays = days;
    days += 6;
  }
  const daysString = days ? oldDays.toString().padStart(4, "0") : null;
  const mp4FileNameDummy = daysString
    ? `./videos/${region}-${mapType}_0000-00-00_D${daysString}.mp4`
    : `./videos/${region}-${mapType}_0000-00-00.mp4`;
  const framesPath = "./temp/";
  // check if requested video exist, if yes return the path
  let mp4FileName = mp4FileNameDummy.replace(
    "0000-00-00",
    getDateBeforeDate(metaData.version)
  );
  if (fs.existsSync(mp4FileName)) {
    return { filename: mp4FileName };
  }
  // check if the lockfile for the requestd video exist, witch meens that the video is calculating now by a other process
  // wait for unlinking the lockFile and the return the mp4FileName
  const lockFileDummy = daysString
    ? `${framesPath}lock-${region}-${mapType}_0000-00-00_D${daysString}`
    : `${framesPath}lock-${region}-${mapType}_0000-00-00`;
  const lockFile = lockFileDummy.replace(
    "0000-00-00",
    getDateBeforeDate(metaData.version)
  );
  if (fs.existsSync(lockFile)) {
    while (fs.existsSync(lockFile)) {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(5000);
    }
    return { filename: mp4FileName };
  }

  // mp4FileName does not exists and no other prozess ist calculating this mp4File
  // start prozessing this file
  fs.writeFileSync(lockFile, "");
  const mapData = region == Region.districts ? DistrictsMap : StatesMap;
  const incidencesPerDay = await IncidencePerDayHistory(metaData, region, days);

  // store png per day files
  let numberOfFrame = 1;
  let lastDate = new Date("1970-01-01").getTime();
  const promises = [];
  const framesFullPath = daysString
    ? `${framesPath}${region}-${mapType}_F-0000_D${daysString}.png`
    : `${framesPath}${region}-${mapType}-F-0000.png`;
  const framesNameSearch = framesFullPath.replace("F-0000", "F-%04d");
  for (const date of Object.keys(incidencesPerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )) {
    const frameName = framesFullPath.replace(
      "F-0000",
      `F-${numberOfFrame.toString().padStart(4, "0")}`
    );
    const frameDate = new Date(date).getTime();
    lastDate = frameDate > lastDate ? frameDate : lastDate;
    // add fill color to every region
    for (const regionPathElement of mapData.children) {
      const idAttribute = regionPathElement.attributes.id;
      const id = idAttribute.split("-")[1];
      const regionIncidence = incidencesPerDay[date][id].incidence;
      regionPathElement.attributes["fill"] = getColorForValue(
        regionIncidence,
        weekIncidenceColorRanges
      );
      if (region == Region.states) {
        regionPathElement.attributes["stroke"] = "#DBDBDB";
        regionPathElement.attributes["stroke-width"] = "0.9";
      }
    }
    const svgBuffer = Buffer.from(stringify(mapData));
    if (mapType == mapTypes.legendMap && region == Region.districts) {
      promises.push(
        sharp(
          getMapBackground(
            "7-Tage-Inzidenz der Landkreise",
            new Date(date),
            weekIncidenceColorRanges
          )
        )
          .composite([{ input: svgBuffer, top: 100, left: 180 }])
          .png({ quality: 100 })
          .toFile(frameName)
      );
    } else if (mapType == mapTypes.legendMap && region == Region.states) {
      promises.push(
        sharp(
          getMapBackground(
            "7-Tage-Inzidenz der Bundesländer",
            new Date(date),
            weekIncidenceColorRanges
          )
        )
          .composite([{ input: svgBuffer, top: 100, left: 180 }])
          .png({ quality: 100 })
          .toFile(frameName)
      );
    } else {
      promises.push(sharp(svgBuffer).png({ quality: 100 }).toFile(frameName));
    }
    numberOfFrame += 1;
  }
  await Promise.all(promises);
  // minimum FrameRate = 5; maximum Framrate = 25; max Videoduration ~ 60 Seconds
  const frameRate =
    Math.floor(numberOfFrame / 60) < 5
      ? 5
      : Math.floor(numberOfFrame / 60) > 25
      ? 25
      : Math.floor(numberOfFrame / 60);
  // Tell fluent-ffmpeg where it can find FFmpeg
  ffmpeg.setFfmpegPath(ffmpegStatic);
  mp4FileName = mp4FileNameDummy.replace(
    "0000-00-00",
    new Date(lastDate).toISOString().split("T").shift()
  );
  const mp4Out = await ffmpegSync(
    framesNameSearch,
    mp4FileName,
    frameRate.toString(),
    numberOfFrame
  );
  fs.rmSync(lockFile);

  return mp4Out;
}
