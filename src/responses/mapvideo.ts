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
      color: string;
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
          [keyToUse]: {
            color: getColorForValue(
              (sum / regionData.population) * 100000,
              weekIncidenceColorRanges
            ),
          },
        };
      } else {
        incidencesPerDay[date.toISOString()][keyToUse] = {
          color: getColorForValue(
            (sum / regionData.population) * 100000,
            weekIncidenceColorRanges
          ),
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
  const refDate = getDateBeforeDate(metaData.version, 1);
  // cleanUp ./video directory
  const allVideoFiles = fs.readdirSync("./videos");
  allVideoFiles.forEach((filename) => {
    if (!filename.includes(refDate) && filename !== "Readme.md") {
      fs.rmSync(`./videos/${filename}`);
    }
  });
  const incidenceDataPath = "./dayPics/";
  // read status
  const status: Status = JSON.parse(
    fs.readFileSync(`${incidenceDataPath}status.json`).toString()
  );
  //check if incidencesPerDay_date.json exists
  let incidencesPerDay: IncidencesPerDay = {};
  const jsonFileName = `${incidenceDataPath}${region}-incidencesPerDay_${refDate}.json`;
  if (fs.existsSync(jsonFileName)) {
    incidencesPerDay = JSON.parse(fs.readFileSync(jsonFileName).toString());
  } else {
    incidencesPerDay = await IncidencePerDayHistory(metaData, region);
    const jsonData = JSON.stringify(incidencesPerDay);
    fs.writeFileSync(jsonFileName, jsonData);
    // new incidencesPerDay , change status
    status[region][mapTypes.legendMap] = false;
    status[region][mapTypes.map] = false;
  }
  const incidencesPerDayKeys = Object.keys(incidencesPerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  let oldDays: number;
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    } else if (days > incidencesPerDayKeys.length) {
      throw new TypeError(
        `':days' parameter must be <= '${incidencesPerDayKeys.length}'`
      );
    } else if (days == incidencesPerDayKeys.length) {
      days = null;
    }
  }
  if (days) {
    oldDays = days;
    days += 6;
  }
  const daysString = days ? oldDays.toString().padStart(4, "0") : null;
  const mp4FileName = daysString
    ? `./videos/${region}-${mapType}_${refDate}_D${daysString}.mp4`
    : `./videos/${region}-${mapType}_${refDate}.mp4`;
  const dayPicsPath = "./dayPics/";

  // check if requested video exist, if yes return the path
  if (fs.existsSync(mp4FileName)) {
    return { filename: mp4FileName };
  }
  // check if the lockfile for the requestd video exist, witch meens that the video is calculating now by a other process
  // wait for unlinking the lockFile and the return the mp4FileName
  const lockFile = `${dayPicsPath}lock-${region}_${refDate}`;
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
  const framesFullPathLegend = `${dayPicsPath}${mapTypes.legendMap}/${region}_F-0000.png`;
  const framesFullPath = `${dayPicsPath}${mapTypes.map}/${region}_F-0000.png`;
  const firstPossibleDate = new Date(incidencesPerDayKeys[0]).getTime();
  // create lockfile and start prozessing this mp4 file
  fs.writeFileSync(lockFile, "");
  // calculate the new pictures only if no other prozess has done this
  if (!status[region][mapType]) {
    const mapData = region == Region.districts ? DistrictsMap : StatesMap;
    // check witch day is changed
    //find the last stored incidencePerDay file witch is the basis of the stored pict files
    const allincidenceFiles = fs.readdirSync(incidenceDataPath);
    const allRegionIncidencePerDayFiles = allincidenceFiles
      .filter((file) => file.includes(`${region}-incidencesPerDay_`))
      .sort((a, b) => (a > b ? -1 : 1));
    const jsonFileBevor =
      allRegionIncidencePerDayFiles.length > 1
        ? `${incidenceDataPath}${allRegionIncidencePerDayFiles[1]}`
        : "dummy";
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
    for (const dateKey of incidencesPerDayKeys) {
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
        const frameNameLegend = framesFullPathLegend.replace(
          "F-0000",
          `F-${(
            (new Date(dateString).getTime() - firstPossibleDate) / 86400000 +
            1
          )
            .toString()
            .padStart(4, "0")}`
        );
        // add fill color to every region
        for (const regionPathElement of mapData.children) {
          const idAttribute = regionPathElement.attributes.id;
          const id = idAttribute.split("-")[1];
          regionPathElement.attributes["fill"] =
            incidencesPerDay[dateString][id].color;
          if (region == Region.states) {
            regionPathElement.attributes["stroke"] = "#DBDBDB";
            regionPathElement.attributes["stroke-width"] = "0.9";
          }
        }
        const svgBuffer = Buffer.from(stringify(mapData));
        if (region == Region.districts) {
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
              .toFile(frameNameLegend)
          );
        } else if (region == Region.states) {
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
              .toFile(frameNameLegend)
          );
        }
        promises.push(
          sharp(getSimpleMapBackground(new Date(dateString)))
            .composite([{ input: svgBuffer, top: 6, left: 22 }])
            .png({ quality: 100 })
            .toFile(frameName)
        );
      });

      await Promise.all(promises);
    }
    status[region][mapTypes.legendMap] = true;
    status[region][mapTypes.map] = true;
    fs.writeFileSync(`${incidenceDataPath}status.json`, JSON.stringify(status));
  }
  const framesNameVideo = `${dayPicsPath}${mapType}/${region}_F-%04d.png`;

  const lastFrameDateTime = new Date(
    incidencesPerDayKeys[incidencesPerDayKeys.length - 1]
  ).getTime();
  const numberOfFrames = days ? oldDays : incidencesPerDayKeys.length - 1;
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
    framesNameVideo,
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
    for (let index = 2; index < allJsonFiles.length; index++) {
      fs.rmSync(`${incidenceDataPath + allJsonFiles[index]}`);
    }
  }

  return mp4Out;
}

function getSimpleMapBackground(lastUpdate: Date): Buffer {
  const lastUpdateLocaleString = lastUpdate.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // localized lastUpdate string
  // the first part of svg
  let svg = `
    <svg width="700px" height="900px" viewBox="0 0 700 900" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect fill="#F4F8FB" x="0" y="0" width="700" height="900"></rect>
        <text id="Stand:-22.11.2021" font-family="Arial" font-size="22" font-weight="normal" fill="#010501">
          <tspan x="350" y="40">Stand: ${lastUpdateLocaleString}</tspan>
        </text>
      </g>
    </svg>`;
  return Buffer.from(svg);
}
