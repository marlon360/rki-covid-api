import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { weekIncidenceColorRanges as wkIClrRngs } from "../configuration/colors";
import sharp from "sharp";
import {
  getColorForValue as gtClrFrVl,
  getMapBackground as gtMpBckgrnd,
} from "./map";
import {
  getDistrictByAGS as gtDByAGS,
  DistrictsCasesHistoryResponse as DCHRspns,
} from "./districts";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import {
  getMetaData,
  getDateBeforeDate as gtDtBfrDt,
  MetaData,
  getStateIdByAbbreviation as gtSIdByAbb,
} from "../utils";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import {
  StatesCasesHistoryResponse as SCHRspns,
  getStateById as gtSById,
} from "./states";

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

interface ClrsPrDy {
  [dateString: string]: {
    [key: string]: {
      color: string;
    };
  };
}

interface MAMDyEty {
  sum: number;
  count: number;
  avg: number;
  aColor: string;
  min: number;
  minColor: string;
  max: number;
  maxColor: string;
}

interface MAMPrDy {
  [dateString: string]: MAMDyEty;
}

export interface MAM {
  iCol: string;
  name: string;
  nCol: string;
}

export interface MAMGrpd {
  [incidenceColor: string]: {
    rInd: number;
    name: string;
    nCol: string;
  }[];
}

export async function ClrsPrDy(
  metaData: MetaData,
  region: Region
): Promise<ClrsPrDy> {
  // initialize history and regions data variable
  let rgnCssHstry;
  let rgnsDt;
  // request the data depending on region
  if (region == Region.districts) {
    rgnCssHstry = await DCHRspns(null, null, metaData);
    rgnsDt = await getDistrictsData(metaData);
  } else if (region == Region.states) {
    rgnCssHstry = await SCHRspns(null, null, metaData);
    rgnsDt = await getStatesData(metaData);
  }
  const clrsPrDy: ClrsPrDy = {};
  const mAMPrDy: MAMPrDy = {};
  // build region incidence color history
  for (const key of Object.keys(rgnCssHstry.data)) {
    const rgnHstry = rgnCssHstry.data[key].history;
    const kyTUs = region == Region.districts ? key : gtSIdByAbb(key).toString();
    const rgnDt =
      region == Region.districts
        ? gtDByAGS(rgnsDt, kyTUs)
        : gtSById(rgnsDt, parseInt(kyTUs));
    for (let i = 6; i < rgnHstry.length; i++) {
      const date = rgnHstry[i].date;
      let sum = 0;
      for (let dayOffset = i; dayOffset > i - 7; dayOffset--) {
        sum += rgnHstry[dayOffset].cases;
      }
      if (!clrsPrDy[date.toISOString()]) {
        clrsPrDy[date.toISOString()] = {
          [kyTUs]: {
            color: gtClrFrVl((sum / rgnDt.population) * 100000, wkIClrRngs),
          },
        };
      } else {
        clrsPrDy[date.toISOString()][kyTUs] = {
          color: gtClrFrVl((sum / rgnDt.population) * 100000, wkIClrRngs),
        };
      }
      if (!mAMPrDy[date.toISOString()]) {
        const incdnc = (sum / rgnDt.population) * 100000;
        const incdncClr = gtClrFrVl(incdnc, wkIClrRngs);
        mAMPrDy[date.toISOString()] = {
          sum: incdnc,
          count: 1,
          avg: incdnc,
          aColor: incdncClr,
          min: incdnc,
          minColor: incdncClr,
          max: incdnc,
          maxColor: incdncClr,
        };
      } else {
        const temp: MAMDyEty = JSON.parse(
          JSON.stringify(mAMPrDy[date.toISOString()])
        ); //independent copy!
        const incdnc = (sum / rgnDt.population) * 100000;
        const incdncClr = gtClrFrVl(incdnc, wkIClrRngs);
        temp.sum += incdnc;
        temp.count += 1;
        temp.avg = temp.sum / temp.count;
        temp.aColor = gtClrFrVl(temp.avg, wkIClrRngs);
        if (incdnc > temp.max) {
          temp.max = incdnc;
          temp.maxColor = incdncClr;
        }
        if (incdnc < temp.min) {
          temp.min = incdnc;
          temp.minColor = incdncClr;
        }
        mAMPrDy[date.toISOString()] = temp;
      }
    }
  }
  for (const date of Object.keys(mAMPrDy)) {
    clrsPrDy[date].min = { color: mAMPrDy[date].minColor };
    clrsPrDy[date].avg = { color: mAMPrDy[date].aColor };
    clrsPrDy[date].max = { color: mAMPrDy[date].maxColor };
  }
  return clrsPrDy;
}

export async function VideoResponse(
  region: Region,
  videoduration: number,
  days?: number
): Promise<{ filename: string }> {
  // get the actual meta data
  const metaData = await getMetaData();

  // set the reference date
  const refDate = gtDtBfrDt(metaData.version, 1);
  // the path to stored incidence per day files and status
  const incidenceDataPath = "./dayPics/";
  // path and filename for status.json
  const statusFileName = `${incidenceDataPath}status.json`;
  // path and filename for status lockfile
  const statusLockFile = `${incidenceDataPath}status.lockfile`;
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
  let clrsPrDy: ClrsPrDy = {};
  const jsonFileName = `${incidenceDataPath}${region}-incidenceColorsPerDay_${refDate}.json`;
  if (fs.existsSync(jsonFileName)) {
    clrsPrDy = JSON.parse(fs.readFileSync(jsonFileName).toString());
  } else {
    // if region incidence per day data file not exists requst the data
    clrsPrDy = await ClrsPrDy(metaData, region);
    // store to disc
    const jsonData = JSON.stringify(clrsPrDy);
    fs.writeFileSync(jsonFileName, jsonData);
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
  const clrsPrDyKys = Object.keys(clrsPrDy).sort(
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
    } else if (days > clrsPrDyKys.length || days < 100) {
      throw new RangeError(
        `':days' parameter must be between '100' and '${clrsPrDyKys.length}'`
      );
    }
  } else {
    days = clrsPrDyKys.length;
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
  const daysStr = days.toString().padStart(4, "0");
  const durationStr = videoduration.toString().padStart(4, "0");
  const nowTimeOnly = new Date().toISOString().split("T")[1];
  const created = new Date(`${refDate}T${nowTimeOnly}`).getTime();
  const mp4FileName = `./videos/${region}_${refDate}_Days${daysStr}_Duration${durationStr}.mp4`;
  // path where the differend frames are stored
  const dayPicsPath = `./dayPics/${region}/`;
  // check if requested video exist, if yes return the path
  if (fs.existsSync(mp4FileName)) {
    return { filename: mp4FileName };
  }

  // lockfilename
  const lockFile = `./dayPics/${region}.lockfile`;

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
    let allIFls = fs.readdirSync(incidenceDataPath);
    allIFls = allIFls
      .filter((file) => file.includes(`${region}-incidenceColorsPerDay_`))
      .sort((a, b) => (a > b ? -1 : 1));
    const iFlOld =
      allIFls.length > 1 ? `${incidenceDataPath}${allIFls[1]}` : "dummy";
    // load the old incidences (if exists)
    let oldClrsPrDy: ClrsPrDy = {};
    if (fs.existsSync(iFlOld)) {
      oldClrsPrDy = JSON.parse(fs.readFileSync(iFlOld).toString());
    }

    // function to compare two Objects
    function isDffrnd(obj1, obj2) {
      return JSON.stringify(obj1) !== JSON.stringify(obj2);
    }

    // find all days that changed one or more colors, and store this key to allDiffs
    let allDiffs = [];
    for (const date of clrsPrDyKys) {
      // if datekey is not present in old incidences file always calculate this date, push key to allDiffs[]
      if (!oldClrsPrDy[date]) {
        allDiffs.push(date);
      } else {
        // else test every regionKey for changed colors,
        for (const rgnKy of Object.keys(clrsPrDy[date])) {
          if (isDffrnd(clrsPrDy[date][rgnKy], oldClrsPrDy[date][rgnKy])) {
            // push datekey to allDiffs[] if one color is differend,
            allDiffs.push(date);
            // and break this "for loop"
            break;
          }
        }
      }
    }

    // if length allDiffs[] > 0
    // re-/calculate all new or changed days as promises
    if (allDiffs.length > 0) {
      const frstPssblDt = new Date(clrsPrDyKys[0]).getTime();
      const promises = [];
      allDiffs.forEach((date) => {
        // calculate the frameNumber
        const frmNmbrStr = (
          (new Date(date).getTime() - frstPssblDt) / 86400000 +
          1
        )
          .toString()
          .padStart(4, "0");
        // frameName
        const frameName = framesFullPath.replace("F-0000", `F-${frmNmbrStr}`);

        // add fill color to every region
        for (const rgnPthElmnt of mapData.children) {
          const idAttribute = rgnPthElmnt.attributes.id;
          const id = idAttribute.split("-")[1];
          rgnPthElmnt.attributes["fill"] = clrsPrDy[date][id].color;
          if (region == Region.states) {
            rgnPthElmnt.attributes["stroke"] = "#DBDBDB";
            rgnPthElmnt.attributes["stroke-width"] = "0.9";
          }
        }
        const svgBuffer = Buffer.from(stringify(mapData));

        // define headline depending on region
        const hdline =
          region == Region.districts
            ? "7-Tage-Inzidenz der Landkreise"
            : "7-Tage-Inzidenz der Bundesländer";

        // define mAM
        let mAM: MAM[] = [
          { name: "min", iCol: clrsPrDy[date]["min"].color, nCol: "green" },
        ];
        mAM.push({
          name: "avg",
          iCol: clrsPrDy[date]["avg"].color,
          nCol: "orange",
        });
        mAM.push({
          name: "max",
          iCol: clrsPrDy[date]["max"].color,
          nCol: "red",
        });

        // define mAMG
        // get range index of min color
        const minRind = wkIClrRngs.findIndex(
          (rng) => rng.color == clrsPrDy[date]["min"].color
        );
        // get range index of avg color
        const avgRind = wkIClrRngs.findIndex(
          (rng) => rng.color == clrsPrDy[date]["avg"].color
        );
        //get range index of max color
        const maxRind = wkIClrRngs.findIndex(
          (rng) => rng.color == clrsPrDy[date]["max"].color
        );
        let mAMG: MAMGrpd = {
          [clrsPrDy[date]["min"].color]: [
            { name: "min", nCol: "green", rInd: minRind },
          ],
        };
        if (mAMG[clrsPrDy[date]["avg"].color]) {
          mAMG[clrsPrDy[date]["avg"].color].push({
            name: "avg",
            nCol: "orange",
            rInd: avgRind,
          });
        } else {
          mAMG[clrsPrDy[date]["avg"].color] = [
            { name: "avg", nCol: "orange", rInd: avgRind },
          ];
        }
        if (mAMG[clrsPrDy[date]["max"].color]) {
          mAMG[clrsPrDy[date]["max"].color].push({
            name: "max",
            nCol: "red",
            rInd: maxRind,
          });
        } else {
          mAMG[clrsPrDy[date]["max"].color] = [
            { name: "max", nCol: "red", rInd: maxRind },
          ];
        }

        // push new promise for frames with legend
        promises.push(
          sharp(gtMpBckgrnd(hdline, new Date(date), wkIClrRngs, mAM, mAMG))
            .composite([{ input: svgBuffer, top: 100, left: 180 }])
            .png({ quality: 100 })
            .toFile(frameName)
        );
      });

      // await all frames promises
      await Promise.all(promises);
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
  const firstFrameNumber = (clrsPrDyKys.length - days + 1)
    .toString()
    .padStart(4, "0");

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
  // cleanup videofiles region, store only the 5 last created entrys
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

  return mp4out;
}
