import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { weekIncidenceColorRanges as IColorRanges } from "../configuration/colors";
import sharp from "sharp";
import { getMapBackground } from "./map";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs, { cp } from "fs";
import {
  getMetaData,
  getDateBeforeDate,
  MetaData,
  getData,
  Files,
} from "../utils";

interface Status {
  districts: boolean;
  states: boolean;
  videos: {
    districts: {
      filename: string;
      created: number;
    }[];
    states: {
      filename: string;
      created: number;
    }[];
  };
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

interface CperDay {
  [date: string]: {
    [idkey: string]: number;
  };
}

export interface MAMGrouped {
  [cind: number]: {
    rInd: number;
    name: string;
    nCol: string;
  }[];
}

interface FileNames {
  [date: string]: {
    oldFileName: string;
    newFileName: string;
  };
}
export async function ColorsPerDay(
  metaData: MetaData,
  region: Region
): Promise<CperDay> {
  let cPerDay: CperDay = {};
  // request the data depending on region
  if (region == Region.districts) {
    cPerDay = (await getData(metaData, Files.D_IncidenceHistory)).data.reduce(
      (newObj, entry) => {
        const dateStr = new Date(entry.m).toISOString().split("T").shift();
        const cInd = IColorRanges.findIndex((range) => {
          if (range.compareFn) {
            return range.compareFn(entry.i7, range);
          } else {
            return entry.i7 > range.min && entry.i7 <= range.max;
          }
        });
        let min: number;
        let max: number;
        let sum: number;
        let count: number;
        if (newObj[dateStr]) {
          min = Math.min(newObj[dateStr].min, cInd);
          max = Math.max(newObj[dateStr].max, cInd);
          sum = newObj[dateStr].sum + entry.i7;
          count = newObj[dateStr].count + 1;
        } else {
          min = cInd;
          max = cInd;
          sum = entry.i7;
          count = 1;
        }
        const avg = sum / count;
        const avgInd = IColorRanges.findIndex((range) => {
          if (range.compareFn) {
            return range.compareFn(avg, range);
          } else {
            return avg > range.min && avg <= range.max;
          }
        });
        if (newObj[dateStr]) {
          newObj[dateStr][entry.i] = cInd;
        } else {
          newObj[dateStr] = {
            ...(newObj[dateStr] || {}),
            [entry.i]: cInd,
          };
        }
        newObj[dateStr].min = min;
        newObj[dateStr].max = max;
        newObj[dateStr].avg = avgInd;
        newObj[dateStr].sum = sum;
        newObj[dateStr].count = count;
        return newObj;
      },
      {}
    );
  } else if (region == Region.states) {
    cPerDay = (await getData(metaData, Files.S_IncidenceHistory)).data
      .filter((entry) => entry.i != "00")
      .reduce((newObj, entry) => {
        const dateStr = new Date(entry.m).toISOString().split("T").shift();
        const cInd = IColorRanges.findIndex((range) => {
          if (range.compareFn) {
            return range.compareFn(entry.i7, range);
          } else {
            return entry.i7 > range.min && entry.i7 <= range.max;
          }
        });
        let min: number;
        let max: number;
        let sum: number;
        let count: number;
        if (newObj[dateStr]) {
          min = Math.min(newObj[dateStr].min, cInd);
          max = Math.max(newObj[dateStr].max, cInd);
          sum = newObj[dateStr].sum + entry.i7;
          count = newObj[dateStr].count + 1;
        } else {
          min = cInd;
          max = cInd;
          sum = entry.i7;
          count = 1;
        }
        const avg = sum / count;
        const avgInd = IColorRanges.findIndex((range) => {
          if (range.compareFn) {
            return range.compareFn(avg, range);
          } else {
            return avg > range.min && avg <= range.max;
          }
        });
        const id = parseInt(entry.i).toString();
        if (newObj[dateStr]) {
          newObj[dateStr][id] = cInd;
        } else {
          newObj[dateStr] = {
            ...(newObj[dateStr] || {}),
            [id]: cInd,
          };
        }
        newObj[dateStr].min = min;
        newObj[dateStr].max = max;
        newObj[dateStr].avg = avgInd;
        newObj[dateStr].sum = sum;
        newObj[dateStr].count = count;
        return newObj;
      }, {});
  }
  for (const dateKey of Object.keys(cPerDay)) {
    delete cPerDay[dateKey].sum;
    delete cPerDay[dateKey].count;
  }
  return cPerDay;
}

// ################################################################
export async function VideoResponse(
  region: Region,
  videoduration: number,
  days?: number
): Promise<{ filename: string }> {
  // get the actual meta data
  const metaData = await getMetaData();
  // set the reference date
  const refDate = getDateBeforeDate(metaData.version, 1);
  // the path to stored incidence per day files and status
  const incidenceDataPath = "./dayPics/";
  if (!fs.existsSync(incidenceDataPath)) {
    fs.mkdirSync(incidenceDataPath);
  }
  // path and filename for status.json
  const statusFileName = `${incidenceDataPath}status.json`;
  // path and filename for status lockfile
  const statusLockFile = `${incidenceDataPath}status.lock`;
  // init status
  let status: Status;

  // wait for unlocked status file
  if (fs.existsSync(statusLockFile)) {
    while (fs.existsSync(statusLockFile)) {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(50); //wait 50 ms
    }
  }
  // if no status.json file exists write a initial one
  if (!fs.existsSync(statusFileName)) {
    const initialStatus: Status = {
      states: false,
      districts: false,
      videos: {
        districts: [],
        states: [],
      },
    };
    fs.writeFileSync(statusFileName, JSON.stringify(initialStatus));
  }
  //check if incidencesPerDay_date.json exists
  const cPerDayStart = new Date().getTime();
  let cPerDay: CperDay = {};
  const jsonFileName = `${incidenceDataPath}${region}-cPerDay_${refDate}.json`;
  if (fs.existsSync(jsonFileName)) {
    cPerDay = JSON.parse(fs.readFileSync(jsonFileName).toString());
    const cPerDayEnd = new Date().getTime();
    console.log(
      `${region}: get cPerDay from redis or file: ${
        (cPerDayEnd - cPerDayStart) / 1000
      } seconds`
    );
  } else {
    // if region incidence per day data file not exists requst the data
    cPerDay = await ColorsPerDay(metaData, region);
    // store to disc
    const jsonData = JSON.stringify(cPerDay);
    fs.writeFileSync(jsonFileName, jsonData);
    const cPerDayEnd = new Date().getTime();
    console.log(
      `${region}: get cPerDay calculated from incidenceFile: ${
        (cPerDayEnd - cPerDayStart) / 1000
      } seconds`
    );
    // new incidencesPerDay , change status
    // wait for ulocked status.json file
    if (fs.existsSync(statusLockFile)) {
      while (fs.existsSync(statusLockFile)) {
        function delay(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await delay(50); //wait 50 ms
      }
    }
    //set status lockfile
    fs.writeFileSync(statusLockFile, "");
    // read status
    status = JSON.parse(fs.readFileSync(statusFileName).toString());
    // change status
    status[region] = false;
    // write status to disc
    fs.writeFileSync(statusFileName, JSON.stringify(status));
    //unset status lockfile
    fs.rmSync(statusLockFile);
  }

  // get a sorted list of incidencePerDay keys
  const cPerDayKeys = Object.keys(cPerDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // save days to oldDays
  let oldDays = days;

  // some checks for :days
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days > cPerDayKeys.length || days < 100) {
      throw new RangeError(
        `':days' parameter must be between '100' and '${cPerDayKeys.length}'`
      );
    }
  } else {
    days = cPerDayKeys.length;
  }
  const numberOfFrames = days;

  // some checks for :duration
  if (isNaN(videoduration)) {
    throw new TypeError(
      "Wrong format for ':duration' parameter! This is not a number."
    );
  } else if (
    Math.floor(numberOfFrames / videoduration) < 5 ||
    Math.floor(numberOfFrames / videoduration) > 25
  ) {
    throw new RangeError(
      `':duration' parameter must be between '${
        Math.floor(numberOfFrames / 25) + 1
      }' and '${Math.floor(numberOfFrames / 5)}' seconds if 'days:' is '${
        oldDays ? oldDays.toString() : "unlimited"
      }'`
    );
  }

  // calculate the frame rate
  // minimum frameRate = 5; maximum framrate = 25; max videoduration ~ 60 Seconds
  const frameRate =
    Math.floor(numberOfFrames / videoduration) < 5
      ? 5
      : Math.floor(numberOfFrames / videoduration) > 25
      ? 25
      : Math.floor(numberOfFrames / videoduration);
  // video file name that is requested
  const videoPath = "./videos";
  if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath);
  }
  const daysStr = days.toString().padStart(4, "0");
  const durationStr = videoduration.toString().padStart(4, "0");
  const nowTimeOnly = new Date().toISOString().split("T")[1];
  const created = new Date(`${refDate}T${nowTimeOnly}`).getTime();
  const mp4FileName = `${videoPath}/${region}_${refDate}_Days${daysStr}_Duration${durationStr}.mp4`;
  // path where the differend frames are stored
  const dayPicsPath = `./dayPics/${region}/`;
  if (!fs.existsSync(dayPicsPath)) {
    fs.mkdirSync(dayPicsPath);
  }
  // check if requested video exist, if yes return the path
  if (fs.existsSync(mp4FileName)) {
    return { filename: mp4FileName };
  }

  // lockfilename
  const lockFile = `./dayPics/${region}.lock`;

  // check if the lockfile exist,
  // witch meens that the single frames (region) or one video (region) is calculating now by a other process
  // wait for the other prozess to finish check every 5 seconds
  if (fs.existsSync(lockFile)) {
    while (fs.existsSync(lockFile)) {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(2500);
    }
    // maybe the other prozess calculates the same video return the name
    if (fs.existsSync(mp4FileName)) {
      return { filename: mp4FileName };
    }
  }

  // create lockfile and start prozessing single frames and/or mp4 file
  fs.writeFileSync(lockFile, "");

  // set basic full path for frames with legend and frames without legend
  const framesFullPath = `${dayPicsPath}/${region}_F-0000.png`;

  // calculate the new pictures only if no other prozess has done this. read the status file
  // no other region thread is running, because of region lockfile! locking status file is not nesessary!

  // read status
  status = JSON.parse(
    fs.readFileSync(`${incidenceDataPath}status.json`).toString()
  );

  if (!status[region]) {
    //load the region mapfile
    const mapData = region == Region.districts ? DistrictsMap : StatesMap;
    // find the last stored incidencePerDay file witch is the basis of the stored pict files
    let allRegionsColorsPerDayFiles = fs.readdirSync(incidenceDataPath);
    allRegionsColorsPerDayFiles = allRegionsColorsPerDayFiles
      .filter((file) => file.includes(`${region}-incidenceColorsPerDay_`))
      .sort((a, b) => (a > b ? -1 : 1));
    const oldRegionsColorsPerDayFile =
      allRegionsColorsPerDayFiles.length > 1
        ? `${incidenceDataPath}${allRegionsColorsPerDayFiles[1]}`
        : "dummy";
    // load the old incidences (if exists)
    let oldCPerDay: CperDay = {};
    if (fs.existsSync(oldRegionsColorsPerDayFile)) {
      oldCPerDay = JSON.parse(
        fs.readFileSync(oldRegionsColorsPerDayFile).toString()
      );
    }
    // get a sorted list of old incidencePerDay keys
    const oldCPerDayKeys = Object.keys(oldCPerDay).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    // toDo build renaming file and rename frames on disk if start date change!

    let fileNames: FileNames = {};
    if (oldCPerDayKeys[0] != cPerDayKeys[0]) {
      cPerDayKeys.forEach((date, index) => {
        const newFrmNmbrStr = (index + 1).toString().padStart(4, "0");
        const newFileName = framesFullPath.replace(
          "F-0000",
          `F-${newFrmNmbrStr}`
        );
        const oldIndex = oldCPerDayKeys.indexOf(date);
        const oldFrmNmbrStr = (oldIndex + 1).toString().padStart(4, "0");
        const oldFileName =
          oldIndex == -1
            ? null
            : framesFullPath.replace("F-0000", `F-${oldFrmNmbrStr}`);
        fileNames[date] = { oldFileName, newFileName };
      });
      cPerDayKeys.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      cPerDayKeys.forEach((date) => {
        const oldName = fileNames[date].oldFileName;
        const newName = fileNames[date].newFileName;
        if (oldName) {
          fs.renameSync(oldName, newName);
        }
      });
      cPerDayKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }

    // find all days that changed one or more colors, and store this key to allDiffs
    const findDiffsStart = new Date().getTime();
    let allDiffs = [];
    for (const date of cPerDayKeys) {
      // if datekey is not present in old incidences file always calculate this date, push key to allDiffs[]
      if (!oldCPerDay[date]) {
        allDiffs.push(date);
      } else {
        // else test every regionKey for changed color indexes,
        for (const rgnKy of Object.keys(cPerDay[date])) {
          const newCindex = cPerDay[date][rgnKy];
          const oldCindex = oldCPerDay[date][rgnKy];
          if (newCindex != oldCindex) {
            // push datekey to allDiffs[] if one color is differend,
            allDiffs.push(date);
            // and break this "for loop"
            break;
          }
        }
      }
    }
    const findDiffsEnd = new Date().getTime();
    console.log(
      `${region}: find all diffs: ${
        (findDiffsEnd - findDiffsStart) / 1000
      } seconds. ${allDiffs.length} changes.`
    );
    const createPromisesStart = new Date().getTime();
    // if length allDiffs[] > 0
    // re-/calculate all new or changed days as promises
    if (allDiffs.length > 0) {
      const firstDate = new Date(cPerDayKeys[0]).getTime();
      const promises = [];
      allDiffs.forEach((date) => {
        // calculate the frameNumber
        const frmNmbrStr = (
          (new Date(date).getTime() - firstDate) / 86400000 +
          1
        )
          .toString()
          .padStart(4, "0");
        // frameName
        const frameName = framesFullPath.replace("F-0000", `F-${frmNmbrStr}`);

        // add fill color to every region
        for (const regionPathElement of mapData.children) {
          const idAttribute = regionPathElement.attributes.id;
          const id = idAttribute.split("-")[1];
          regionPathElement.attributes["fill"] =
            IColorRanges[cPerDay[date][id]].color;
          if (region == Region.states) {
            regionPathElement.attributes["stroke"] = "#DBDBDB";
            regionPathElement.attributes["stroke-width"] = "0.9";
          }
        }
        const svgBuffer = Buffer.from(stringify(mapData));

        // define headline depending on region
        enum HDL {
          "districts" = "Landkreise",
          "states" = "Bundesländer",
        }
        const hdl = `7-Tage-Inzidenz der ${HDL[region]}`;

        // define mAMG (MinAvgMaxGrouped)
        let mAMG: MAMGrouped = {
          [cPerDay[date]["min"]]: [
            { name: "min", nCol: "green", rInd: cPerDay[date]["min"] },
          ],
        };
        if (mAMG[cPerDay[date]["avg"]]) {
          mAMG[cPerDay[date]["avg"]].push({
            name: "avg",
            nCol: "orange",
            rInd: cPerDay[date]["avg"],
          });
        } else {
          mAMG[cPerDay[date]["avg"]] = [
            { name: "avg", nCol: "orange", rInd: cPerDay[date]["avg"] },
          ];
        }
        if (mAMG[cPerDay[date]["max"]]) {
          mAMG[cPerDay[date]["max"]].push({
            name: "max",
            nCol: "red",
            rInd: cPerDay[date]["max"],
          });
        } else {
          mAMG[cPerDay[date]["max"]] = [
            { name: "max", nCol: "red", rInd: cPerDay[date]["max"] },
          ];
        }

        // push new promise for frames with legend
        promises.push(
          sharp(getMapBackground(hdl, new Date(date), IColorRanges, mAMG))
            .composite([{ input: svgBuffer, top: 100, left: 180 }])
            .png({ quality: 100 })
            .toFile(frameName)
        );
      });
      const createPromisesEnd = new Date().getTime();
      console.log(
        `${region}: create Promises ${
          (createPromisesEnd - createPromisesStart) / 1000
        } seconds`
      );
      // await all frames promises
      await Promise.all(promises);
      const executePromisesEnd = new Date().getTime();
      console.log(
        `${region}: execute Promises ${
          (executePromisesEnd - createPromisesEnd) / 1000
        } seconds`
      );
    }
    // wait for unlocked status.json
    if (fs.existsSync(statusLockFile)) {
      while (fs.existsSync(statusLockFile)) {
        function delay(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await delay(50); //wait 50 ms
      }
    }
    //set status lockfile
    fs.writeFileSync(statusLockFile, "");
    // read status
    status = JSON.parse(fs.readFileSync(statusFileName).toString());
    // set status for region to true (all frames are processed)
    status[region] = true;
    // write status to disc
    fs.writeFileSync(statusFileName, JSON.stringify(status));
    //unset status lockfile
    fs.rmSync(statusLockFile);
  }

  // set searchpath for frames
  const framesNameVideo = `${dayPicsPath}${region}_F-%04d.png`;

  // set first frame number for video as a four digit string if :days is set, otherwise it is 0001
  const firstFrameNumber = (cPerDayKeys.length - days + 1)
    .toString()
    .padStart(4, "0");

  // Tell fluent-ffmpeg where it can find FFmpeg
  ffmpeg.setFfmpegPath(ffmpegStatic);

  // calculate the requested video
  const createVideoStart = new Date().getTime();
  const mp4out = await ffmpegSync(
    framesNameVideo,
    mp4FileName,
    frameRate.toString(),
    firstFrameNumber,
    lockFile
  );
  const createVideoEnd = new Date().getTime();
  console.log(
    `${region}: video rendering time ${
      (createVideoEnd - createVideoStart) / 1000
    } seconds`
  );
  // wait for unlocked status.json
  if (fs.existsSync(statusLockFile)) {
    while (fs.existsSync(statusLockFile)) {
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(50); //wait 50 ms
    }
  }
  //set status lockfile
  fs.writeFileSync(statusLockFile, "");
  // read status
  status = JSON.parse(fs.readFileSync(statusFileName).toString());
  // push video data filename and crationtime to status
  status.videos[region].push({ filename: mp4FileName, created: created });
  // find region video files not from refData
  const oldVideoFiles = status.videos[region].filter(
    (video) => !video.filename.includes(refDate)
  );
  // clean region video files in status.videos[region]
  status.videos[region] = status.videos[region].filter((video) =>
    video.filename.includes(refDate)
  );
  // delete old region video files
  oldVideoFiles.forEach((video) => fs.rmSync(video.filename));
  // cleanup region videofiles, store only the 5 last created entrys, delete the oldest entry(s)
  status.videos[region].sort((a, b) => b.created - a.created);
  while (status.videos[region].length > 5) {
    const removed = status.videos[region].pop();
    fs.rmSync(removed.filename);
  }
  // write status to disc
  fs.writeFileSync(statusFileName, JSON.stringify(status));
  //unset status lockfile
  fs.rmSync(statusLockFile);

  // cleanup region incidences .json files
  let allJsonFiles = fs.readdirSync(incidenceDataPath);
  allJsonFiles = allJsonFiles.filter((file) =>
    file.includes(`${region}-incidence`)
  );
  // keep the last 2 files only
  if (allJsonFiles.length > 2) {
    allJsonFiles.sort((a, b) => (a > b ? -1 : 1));
    for (let index = 2; index < allJsonFiles.length; index++) {
      fs.rmSync(`${incidenceDataPath + allJsonFiles[index]}`);
    }
  }
  // all done, remove region lockfile
  fs.rmSync(lockFile);
  // return mp4filename
  return mp4out;
}
