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
  districts: boolean;
  states: boolean;
}

function ffmpegSync(
  framesNameSearch: string,
  mp4FileName: string,
  frameRate: string,
  startFrame: string,
  lockFileName: string
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
      .on("error", (err, stdout, stderr) => {
        fs.rmSync(lockFileName);
        console.log("ffmpeg stdout:\n" + stdout);
        console.log("ffmpeg stderr:\n" + stderr);
        return reject(new Error(err));
      });
  });
}

export enum Region {
  districts = "districts",
  states = "states",
}

interface IncidenceColorsPerDay {
  [dateString: string]: {
    [key: string]: {
      color: string;
    };
  };
}

export async function IncidenceColorsPerDay(
  metaData: MetaData,
  region: Region
): Promise<IncidenceColorsPerDay> {
  // initialize history and regions data variable
  let regionCasesHistory;
  let regionsData;
  // request the data depending on region
  if (region == Region.districts) {
    regionCasesHistory = await DistrictsCasesHistoryResponse(
      null,
      null,
      metaData
    );
    regionsData = await getDistrictsData(metaData);
  } else if (region == Region.states) {
    regionCasesHistory = await StatesCasesHistoryResponse(null, null, metaData);
    regionsData = await getStatesData(metaData);
  }
  const incidenceColorsPerDay: IncidenceColorsPerDay = {};
  // build region incidence color history
  for (const key of Object.keys(regionCasesHistory.data)) {
    const regionHistory = regionCasesHistory.data[key].history;
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
      if (!incidenceColorsPerDay[date.toISOString()]) {
        incidenceColorsPerDay[date.toISOString()] = {
          [keyToUse]: {
            color: getColorForValue(
              (sum / regionData.population) * 100000,
              weekIncidenceColorRanges
            ),
          },
        };
      } else {
        incidenceColorsPerDay[date.toISOString()][keyToUse] = {
          color: getColorForValue(
            (sum / regionData.population) * 100000,
            weekIncidenceColorRanges
          ),
        };
      }
    }
  }
  return incidenceColorsPerDay;
}

export async function VideoResponse(
  region: Region,
  mapType: mapTypes = mapTypes.map,
  days?: number
): Promise<{ filename: string }> {
  // get the actual meta data
  const metaData = await getMetaData();
  // set the reference date
  const refDate = getDateBeforeDate(metaData.version, 1);
  // cleanUp ./video directory
  // delete all video files witch dont include the reference date
  const allVideoFiles = fs.readdirSync("./videos");
  allVideoFiles.forEach((filename) => {
    if (!filename.includes(refDate) && filename !== "Readme.md") {
      fs.rmSync(`./videos/${filename}`);
    }
  });
  // the path to stored incidence per day files
  const incidenceDataPath = "./dayPics/";
  // if no status.json file exists write a initial one
  if (!fs.existsSync(`${incidenceDataPath}status.json`)) {
    const initialStatus: Status = { states: false, districts: false };
    fs.writeFileSync(
      `${incidenceDataPath}status.json`,
      JSON.stringify(initialStatus)
    );
  }
  // read status
  const status: Status = JSON.parse(
    fs.readFileSync(`${incidenceDataPath}status.json`).toString()
  );
  //check if incidencesPerDay_date.json exists
  let incidenceColorsPerDay: IncidenceColorsPerDay = {};
  const jsonFileName = `${incidenceDataPath}${region}-incidenceColorsPerDay_${refDate}.json`;
  if (fs.existsSync(jsonFileName)) {
    incidenceColorsPerDay = JSON.parse(
      fs.readFileSync(jsonFileName).toString()
    );
  } else {
    // if region incidence per day data file not exists requst the data
    incidenceColorsPerDay = await IncidenceColorsPerDay(metaData, region);
    // store to disc
    const jsonData = JSON.stringify(incidenceColorsPerDay);
    fs.writeFileSync(jsonFileName, jsonData);
    // new incidencesPerDay , change status
    status[region] = false;
  }
  // get a sorted list of incidencePerDay keys
  const incidenceColorsPerDayKeys = Object.keys(incidenceColorsPerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // some checks for :days
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days > incidenceColorsPerDayKeys.length || days < 100) {
      throw new RangeError(
        `':days' parameter must be between '100' and '${incidenceColorsPerDayKeys.length}'`
      );
    } else if (days == incidenceColorsPerDayKeys.length) {
      days = null;
    }
  }
  // video file name that is requested
  const daysString = days ? days.toString().padStart(4, "0") : null;
  const mp4FileName = daysString
    ? `./videos/${region}-${mapType}_${refDate}_D${daysString}.mp4`
    : `./videos/${region}-${mapType}_${refDate}.mp4`;
  // path where the differend frames are stored
  const dayPicsPath = `./dayPics/${region}/`;
  // check if requested video exist, if yes return the path
  if (fs.existsSync(mp4FileName)) {
    return { filename: mp4FileName };
  }
  // lockfilename
  const lockFile = `./dayPics/lock-${region}_${refDate}`;
  // check if the lockfile exist,
  // witch meens that the single frames (region) or one video (region) is calculating now by a other process
  // wait for the other prozess to finish check every 5 seconds
  if (fs.existsSync(lockFile)) {
    while (fs.existsSync(lockFile)) {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(5000);
    }
    // maybe the other prozess calculates the same video return the name
    if (fs.existsSync(mp4FileName)) {
      return { filename: mp4FileName };
    }
  }
  // create lockfile and start prozessing single frames and/or mp4 file
  fs.writeFileSync(lockFile, "");
  // set basic full path for frames with legend and frames without legend
  const framesFullPathLegend = `${dayPicsPath}${mapTypes.legendMap}/${region}_F-0000.png`;
  const framesFullPath = `${dayPicsPath}${mapTypes.map}/${region}_F-0000.png`;
  // calculate the new pictures only if no other prozess has done this. check the status file
  if (!status[region]) {
    //load the region mapfile
    const mapData = region == Region.districts ? DistrictsMap : StatesMap;
    // find the last stored incidencePerDay file witch is the basis of the stored pict files
    let allIncidenceFiles = fs.readdirSync(incidenceDataPath);
    allIncidenceFiles = allIncidenceFiles
      .filter((file) => file.includes(`${region}-incidenceColorsPerDay_`))
      .sort((a, b) => (a > b ? -1 : 1));
    const jsonFileBevor =
      allIncidenceFiles.length > 1
        ? `${incidenceDataPath}${allIncidenceFiles[1]}`
        : "dummy";
    // load the old incidences (if exists)
    let oldIncidenceColorsPerDay: IncidenceColorsPerDay = {};
    if (fs.existsSync(jsonFileBevor)) {
      oldIncidenceColorsPerDay = JSON.parse(
        fs.readFileSync(jsonFileBevor).toString()
      );
    }
    // function to compare two Objects
    function isDifferend(obj1, obj2) {
      return JSON.stringify(obj1) !== JSON.stringify(obj2);
    }
    // find all days that changed one ore more colors, and store this key to allDiffs
    let allDiffs = [];
    for (const dateKey of incidenceColorsPerDayKeys) {
      // if key is not present in old incidences file always calculate this date, push key to allDiffs[]
      if (!oldIncidenceColorsPerDay[dateKey]) {
        allDiffs.push(dateKey);
        // if newData[key] differend to oldData[key], push key to allDiffs[]
      } else if (
        isDifferend(
          incidenceColorsPerDay[dateKey],
          oldIncidenceColorsPerDay[dateKey]
        )
      ) {
        allDiffs.push(dateKey);
      }
    }
    // if length allDiffs[] > 0
    // re-/calculate all new or changed days as promises
    if (allDiffs.length > 0) {
      const firstPossibleDate = new Date(
        incidenceColorsPerDayKeys[0]
      ).getTime();
      const promises = [];
      allDiffs.forEach((dateString) => {
        // calculate the frameNumber
        const frameNumberString = (
          (new Date(dateString).getTime() - firstPossibleDate) / 86400000 +
          1
        )
          .toString()
          .padStart(4, "0");
        // frameName without legend
        const frameName = framesFullPath.replace(
          "F-0000",
          `F-${frameNumberString}`
        );
        // frameName with legend
        const frameNameLegend = framesFullPathLegend.replace(
          "F-0000",
          `F-${frameNumberString}`
        );
        // add fill color to every region
        for (const regionPathElement of mapData.children) {
          const idAttribute = regionPathElement.attributes.id;
          const id = idAttribute.split("-")[1];
          regionPathElement.attributes["fill"] =
            incidenceColorsPerDay[dateString][id].color;
          if (region == Region.states) {
            regionPathElement.attributes["stroke"] = "#DBDBDB";
            regionPathElement.attributes["stroke-width"] = "0.9";
          }
        }
        const svgBuffer = Buffer.from(stringify(mapData));
        // define headline depending on region
        const headline =
          region == Region.districts
            ? "7-Tage-Inzidenz der Landkreise"
            : "7-Tage-Inzidenz der Bundesländer";
        // push new promise for frames with legend
        promises.push(
          sharp(
            getMapBackground(
              headline,
              new Date(dateString),
              weekIncidenceColorRanges
            )
          )
            .composite([{ input: svgBuffer, top: 100, left: 180 }])
            .png({ quality: 100 })
            .toFile(frameNameLegend)
        );
        // push new promise for frames without legend
        promises.push(
          sharp(getSimpleMapBackground(new Date(dateString)))
            .composite([{ input: svgBuffer, top: 6, left: 22 }])
            .png({ quality: 100 })
            .toFile(frameName)
        );
      });
      // await all frames promises
      await Promise.all(promises);
    }
    // set status for region to true (all frames are processed)
    status[region] = true;
    // write status to disc
    fs.writeFileSync(`${incidenceDataPath}status.json`, JSON.stringify(status));
  }
  // set searchpath for frames
  const framesNameVideo = `${dayPicsPath}${mapType}/${region}_F-%04d.png`;
  // set first frame number for video as a four digit string if :days is set, otherwise it is 0001
  const firstFrameNumber = days
    ? (incidenceColorsPerDayKeys.length - days + 1).toString().padStart(4, "0")
    : "0001";
  // calculate the frame rate
  // minimum frameRate = 5; maximum framrate = 25; max videoduration ~ 60 Seconds
  const numberOfFrames = days ? days : incidenceColorsPerDayKeys.length - 1;
  const frameRate =
    Math.floor(numberOfFrames / 60) < 5
      ? 5
      : Math.floor(numberOfFrames / 60) > 25
      ? 25
      : Math.floor(numberOfFrames / 60);
  // Tell fluent-ffmpeg where it can find FFmpeg
  ffmpeg.setFfmpegPath(ffmpegStatic);
  // calculate the requested video
  const mp4out = await ffmpegSync(
    framesNameVideo,
    mp4FileName,
    frameRate.toString(),
    firstFrameNumber,
    lockFile
  );
  // all done, remove lockfile
  fs.rmSync(lockFile);
  // cleanup region incidences .json files
  let allJsonFiles = fs.readdirSync(incidenceDataPath);
  allJsonFiles = allJsonFiles.filter((file) => file.includes(`${region}-incidence`));
  // keep the actual file only
  if (allJsonFiles.length > 1) {
    allJsonFiles.sort((a, b) => (a > b ? -1 : 1));
    for (let index = 1; index < allJsonFiles.length; index++) {
      fs.rmSync(`${incidenceDataPath + allJsonFiles[index]}`);
    }
  }

  return mp4out;
}
// function for a simple map back ground with date only
function getSimpleMapBackground(lastUpdate: Date): Buffer {
  const lastUpdateLocaleString = lastUpdate.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // localized lastUpdate string
  // the first part of svg
  const svg = `
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
