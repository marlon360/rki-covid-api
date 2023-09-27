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

interface Status {
  districts: {
    withLegend: boolean;
    withoutLegend: boolean;
  };
  states: {
    withLegend: boolean;
    withoutLegend: boolean;
  };
}

function ffmpegSync(
  framesNameSearch: string,
  mp4FileName: string,
  frameRate: string,
  startFrame: string
) {
  return new Promise<{ filename: string }>((resolve, reject) => {
    ffmpeg()
      .input(framesNameSearch)
      .inputOptions("-framerate", frameRate)
      .inputOptions("-start_number", startFrame)
      .videoCodec("libx264")
      .outputOptions("-pix_fmt", "yuv420p")
      .saveToFile(mp4FileName)
      .on("end", () => {
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
  return incidencesPerDay;
}

export async function VideoResponse(
  region: Region,
  mapType: mapTypes = mapTypes.map,
  days?: number
): Promise<{ filename: string }> {
  const metaData = await getMetaData();
  // cleanUp ./video directory
  const allVideoFiles = fs.readdirSync("./videos");
  allVideoFiles.forEach((filename) => {
    if (
      !filename.includes(getDateBeforeDate(metaData.version, 1)) &&
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
  const framesPath = `./dayPics/${mapType}/`;
  const incidenceDataPath = "./dayPics/";
  // check if requested video exist, if yes return the path
  let mp4FileName = mp4FileNameDummy.replace(
    "0000-00-00",
    getDateBeforeDate(metaData.version, 1)
  );
  if (fs.existsSync(mp4FileName)) {
    return { filename: mp4FileName };
  }
  // check if the lockfile for the requestd video exist, witch meens that the video is calculating now by a other process
  // wait for unlinking the lockFile and the return the mp4FileName
  const lockFileDummy = `${framesPath}lock-${region}_0000-00-00`;
  const lockFile = lockFileDummy.replace(
    "0000-00-00",
    getDateBeforeDate(metaData.version, 1)
  );
  // wait for the other prozess to finish check every 5 seconds
  if (fs.existsSync(lockFile)) {
    while (fs.existsSync(lockFile)) {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(5000);
    }
    // if the other prozess calculates the same video return the name
    if (fs.existsSync(mp4FileName)) {
      return { filename: mp4FileName };
    }
  }
  // read status
  const status: Status = JSON.parse(
    fs.readFileSync(`${incidenceDataPath}status.json`).toString()
  );
  let incidencesPerDay: IncidencesPerDay = {};
  const framesFullPath = `${framesPath}${region}_F-0000.png`;

  //check if incidencesPerDay_date.json exists
  const jsonFileName = `${incidenceDataPath}${region}-incidencesPerDay_${getDateBeforeDate(
    metaData.version,
    1
  )}.json`;
  if (fs.existsSync(jsonFileName)) {
    incidencesPerDay = JSON.parse(fs.readFileSync(jsonFileName).toString());
  } else {
    incidencesPerDay = await IncidencePerDayHistory(metaData, region);
    const jsonData = JSON.stringify(incidencesPerDay);
    fs.writeFileSync(jsonFileName, jsonData);
    // new incidencesPerDay , change status
    status[region][mapType] = false;
  }
  const firstPossibleDate = new Date(
    Object.keys(incidencesPerDay).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )[0]
  ).getTime();
  // create lockfile and start prozessing this mp4 file
  fs.writeFileSync(lockFile, "");
  // calculate the new pictures only if no other prozess has done this
  if (!status[region][mapType]) {
    const mapData = region == Region.districts ? DistrictsMap : StatesMap;
    // check witch day is changed
    //find the last stored incidencePerDay file witch is the basis of the stored pict files
    const allincidenceFiles = fs.readdirSync(incidenceDataPath);
    const allRegionIncidencePerDayFiles = allincidenceFiles
      .filter((file) => file.includes(region))
      .sort((a, b) => (a > b ? -1 : 1));
    const jsonFileBevor = `${incidenceDataPath}${allRegionIncidencePerDayFiles[1]}`;
    let oldIncidencesPerDay: IncidencesPerDay = {};
    function isDifferend(obj1, obj2) {
      return JSON.stringify(obj1) !== JSON.stringify(obj2);
    }
    let allDiffs = [];
    if (fs.existsSync(jsonFileBevor)) {
      oldIncidencesPerDay = JSON.parse(
        fs.readFileSync(jsonFileBevor).toString()
      );
    }
    for (const dateKey of Object.keys(incidencesPerDay)) {
      if (!oldIncidencesPerDay[dateKey]) {
        allDiffs.push(dateKey);
      } else if (
        isDifferend(incidencesPerDay[dateKey], oldIncidencesPerDay[dateKey])
      ) {
        allDiffs.push(dateKey);
      }
    }

    // re-/calculate all new or changed days as promise
    if (allDiffs.length > 0) {
      const promises = [];
      allDiffs.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      allDiffs.forEach((dateString) => {
        const frameName = framesFullPath.replace(
          "F-0000",
          `F-${(
            (new Date(dateString).getTime() - firstPossibleDate) / 86400000 +
            1
          )
            .toString()
            .padStart(4, "0")}`
        );
        const frameDate = new Date(dateString).getTime();
        // add fill color to every region
        for (const regionPathElement of mapData.children) {
          const idAttribute = regionPathElement.attributes.id;
          const id = idAttribute.split("-")[1];
          const regionIncidence = incidencesPerDay[dateString][id].incidence;
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
                new Date(dateString),
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
                new Date(dateString),
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
      });

      await Promise.all(promises);
    }
    status[region][mapType] = true;
    fs.writeFileSync(`${incidenceDataPath}status.json`, JSON.stringify(status));
  }
  const framesNameSearch = framesFullPath.replace("F-0000", "F-%04d");
  const incidencePerDayKeys = Object.keys(incidencesPerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const lastFrameDateTime = new Date(
    incidencePerDayKeys[incidencePerDayKeys.length - 1]
  ).getTime();
  const numberOfFrames = days ? oldDays : incidencePerDayKeys.length - 1;
  const firstFrameNumber = days
    ? ((lastFrameDateTime - firstPossibleDate) / 86400000 - oldDays + 2)
        .toString()
        .padStart(4, "0")
    : "0001";
  // minimum FrameRate = 5; maximum Framrate = 25; max Videoduration ~ 60 Seconds
  const frameRate =
    Math.floor(numberOfFrames / 60) < 5
      ? 5
      : Math.floor(numberOfFrames / 60) > 25
      ? 25
      : Math.floor(numberOfFrames / 60);
  // Tell fluent-ffmpeg where it can find FFmpeg
  ffmpeg.setFfmpegPath(ffmpegStatic);
  const mp4Out = await ffmpegSync(
    framesNameSearch,
    mp4FileName,
    frameRate.toString(),
    firstFrameNumber
  );

  // all done remove lockfile
  fs.rmSync(lockFile);
  // cleanup .json files
  let allJsonFiles = fs.readdirSync(incidenceDataPath);
  allJsonFiles = allJsonFiles.filter((file) => file.includes(region));
  // keep the last 2 files
  if (allJsonFiles.length > 2) {
    allJsonFiles.sort((a, b) => (a > b ? -1 : 1));
    for (let index = 2; index <= allJsonFiles.length; index++) {
      fs.rmSync(allJsonFiles[index]);
    }
  }

  return mp4Out;
}
