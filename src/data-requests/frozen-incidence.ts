import axios from "axios";
import XLSX from "xlsx";
import zlib from "zlib";

import {
  AddDaysToDate,
  getDateBefore,
  getDayDifference,
  getStateAbbreviationByName,
  getStateIdByAbbreviation,
  RKIError,
} from "../utils";
import { ResponseData } from "./response-data";

function getDateFromString(dateString: string): Date {
  if (dateString.indexOf("/") > -1) {
    // probably this format: 8/25/21: m/d/y
    const parts = dateString.split("/");
    return new Date(
      `20${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
    );
  } else {
    // probably this format: 01.12.2020: dd.mm.yyyy
    const date_pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    return new Date(dateString.replace(date_pattern, "$3-$2-$1"));
  }
}

export interface DistrictsFrozenIncidenceData {
  ags: string;
  name: string;
  history: {
    date: Date;
    weekIncidence: number;
    dataSource: string;
  }[];
}

interface redisEntry {
  body: string;
  touched: Number;
  expire: Number;
  type: string;
}

interface RequestTypeParameter {
  type: string;
  url: string;
  WorkBook: string;
  SheetName: string;
  startRow: number;
  startColumn: number;
  key: string;
  githubFileName: string;
  redisKey: string;
}
const ActualDistricts: RequestTypeParameter = {
  type: "ActualDistricts",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_aktuell.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_aktuell.xlsx",
  SheetName: "LK_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 2,
  key: "ags",
  githubFileName: "_LK.json.gz",
  redisKey: "redisActualDistricts",
};

const ArchiveDistricts: RequestTypeParameter = {
  type: "ArchiveDistricts",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_Archiv.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_Archiv.xlsx",
  SheetName: "LK_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 3,
  key: "ags",
  githubFileName: "",
  redisKey: "redisArchiveDistricts",
};

const ActualStates: RequestTypeParameter = {
  type: "ActualStates",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_aktuell.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_aktuell.xlsx",
  SheetName: "BL_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 1,
  key: "abbreviation",
  githubFileName: "_BL.json.gz",
  redisKey: "redisActualStates",
};

const ArchiveStates: RequestTypeParameter = {
  type: "ArchiveStates",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_Archiv.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_Archiv.xlsx",
  SheetName: "BL_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 1,
  key: "abbreviation",
  githubFileName: "",
  redisKey: "redisArchiveStates",
};

const fiJsonCache = require("express-redis-cache")({
  prefix: "fiJson",
  host: process.env.REDISHOST || process.env.REDIS_URL,
  port: process.env.REDISPORT,
  auth_pass: process.env.REDISPASSWORD,
});

const addJsonDataToRedis = function (
  redisKey: string,
  JsonData: string,
  validFor: number
) {
  return new Promise((resolve, reject) => {
    fiJsonCache.add(
      redisKey,
      JsonData,
      { expire: validFor, type: "json" },
      (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      }
    );
  });
};

const getJsonDataFromRedis = function (redisKey: string) {
  return new Promise<redisEntry[]>((resolve, reject) => {
    fiJsonCache.get(redisKey, (err, objectString) => {
      if (err) {
        reject(err);
      } else {
        resolve(objectString);
      }
    });
  });
};

const delJsonDataFromRedis = function (redisKey: string) {
  return new Promise<void>((resolve, reject) => {
    fiJsonCache.del(redisKey, (err, numberDeletions) => {
      if (err) {
        reject(err);
      } else {
        if ((numberDeletions = 1)) {
          console.log(`Redis key ${redisKey} successfully deleted.`);
        } else {
          console.log(
            `Something went wrong while deleting the redis key ${redisKey}. The key is not available!`
          );
        }
      }
    });
  });
};

// this is the promise to prepare the districts AND states data from the excel sheets
// and store this to redis (if not exists!) they will not expire
const RkiFrozenIncidenceHistoryPromise = async function (resolve, reject) {
  const requestType: RequestTypeParameter = this.requestType;
  const type = requestType.type;
  const url = requestType.url;
  const WorkBook = requestType.WorkBook;
  const SheetName = requestType.SheetName;
  const startRow = requestType.startRow;
  const startColumn = requestType.startColumn;
  const key = requestType.key;
  const redisKey = requestType.redisKey;

  const response = await axios.get(url, { responseType: "arraybuffer" });
  const rdata = response.data;
  if (rdata.error) {
    reject(new RKIError(rdata.error, response.config.url));
    throw new RKIError(rdata.error, response.config.url);
  }
  let lastUpdate = new Date(response.headers["last-modified"]);
  let data = [];
  // check if a redis entry exists, if yes use it
  // if there is no redis entry, set localdata.lastUpdate to 1970-01-01 to initiate recalculation
  const temp = await getJsonDataFromRedis(redisKey);
  const localData = temp.length
    ? JSON.parse(temp[0].body)
    : { lastUpdate: new Date(1970, 0, 1), data };

  // also recalculate if the excelfile is newer as redis data
  if (lastUpdate.getTime() > new Date(localData.lastUpdate).getTime()) {
    // if redisKey exists in redis delete it
    if (temp.length) await delJsonDataFromRedis(redisKey);
    const workbook = XLSX.read(rdata, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[SheetName];
    // table starts in row 5 (parameter is zero indexed)
    let json = XLSX.utils.sheet_to_json(sheet, { range: startRow });

    if (type == ArchiveDistricts.type) {
      json = json.filter((entry) => !!entry["NR"]);
    }
    data = json.map((entry) => {
      const name =
        key == "abbreviation"
          ? type == ActualStates.type
            ? entry["MeldeLandkreisBundesland"] == "Gesamt"
              ? "Bundesgebiet"
              : entry["MeldeLandkreisBundesland"]
            : entry["__EMPTY"] == "Gesamt"
            ? "Bundesgebiet"
            : entry["__EMPTY"]
          : entry["LK"];
      const regionKey =
        key == "abbreviation"
          ? getStateAbbreviationByName(name) == null
            ? "Bund"
            : getStateAbbreviationByName(name)
          : entry["LKNR"].toString().padStart(5, "0");

      const history = [];

      // get all date keys
      const dateKeys = Object.keys(entry);

      // ignore the first startColumn elements (rowNumber, LK, LKNR)
      dateKeys.splice(0, startColumn);
      dateKeys.forEach((dateKey) => {
        const date = getDateFromString(dateKey.toString());
        history.push({
          weekIncidence: entry[dateKey],
          date: date,
          dataSource: WorkBook,
        });
      });
      return { [key]: regionKey, name: name, history: history };
    });
    //store the sheet as stringifyed Json to redis
    const JsonData = JSON.stringify({ lastUpdate, data });
    await addJsonDataToRedis(redisKey, JsonData, -1);
  } else {
    data = localData.data;
    lastUpdate = new Date(localData.lastUpdate);
  }
  resolve({ lastUpdate, data });
};

// this is the Promise to download the files for the missing frozen-incidence dates
const MissingDateDataPromise = async function (resolve, reject) {
  const requestType: RequestTypeParameter = this.requestType;
  const date = this.date;
  const redisKey = date + "_" + requestType.redisKey;
  const githubFileName = requestType.githubFileName;
  const temp = await getJsonDataFromRedis(redisKey);
  let missingDateData;
  if (temp.length) {
    missingDateData = JSON.parse(temp[0].body)
  } else {
    const url = `https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/frozen-incidence/frozen-incidence_${date}${githubFileName}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      reject(new RKIError(rdata.error, response.config.url));
      throw new RKIError(rdata.error, response.config.url);
    }
    const unzipped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // add to redis valid for 14 days
    await addJsonDataToRedis(
      redisKey,
      unzipped.toString(),
      14 * 24 * 60 * 60,
    );
    missingDateData = JSON.parse(unzipped.toString());
  }  
  resolve(missingDateData);
};

export async function getDistrictsFrozenIncidenceHistory(
  days?: number,
  ags?: string
): Promise<ResponseData<DistrictsFrozenIncidenceData[]>> {
  const actualDataPromise = new Promise<
    ResponseData<DistrictsFrozenIncidenceData[]>
  >(
    RkiFrozenIncidenceHistoryPromise.bind({
      requestType: ActualDistricts,
    })
  );
  const archiveDataPromise = new Promise<
    ResponseData<DistrictsFrozenIncidenceData[]>
  >(
    RkiFrozenIncidenceHistoryPromise.bind({
      requestType: ArchiveDistricts,
    })
  );
  let [actual, archive, metaLastFileDate] = await Promise.all([
    actualDataPromise,
    archiveDataPromise,
    axios
      .get(
        "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/meta/meta.json"
      )
      .then((response) => {
        return new Date(response.data.modified);
      }),
  ]);
  let lastUpdate = actual.lastUpdate;

  // The Excel sheet with fixed incidence data is only updated on mondays
  // check witch date is the last date in history
  const lastUpdate000 = new Date(new Date(actual.lastUpdate).setHours(0, 0, 0));
  const lastDate =
    actual.data[0].history.length == 0
      ? lastUpdate000
      : new Date(
          actual.data[0].history[actual.data[0].history.length - 1].date
        );
  const today: Date = new Date(new Date().setHours(0, 0, 0));
  // if lastDate < today and lastDate <= lastFileDate get the missing dates from github stored json files
  if (
    lastDate.getTime() < today.getTime() &&
    lastDate.getTime() <= metaLastFileDate.getTime()
  ) {
    lastUpdate = metaLastFileDate;
    const maxNumberOfDays = Math.min(
      getDayDifference(today, lastDate) - 1,
      getDayDifference(metaLastFileDate, lastDate) - 1
    );
    // add the missing date(s) to districts
    const startDay = days
      ? days <= maxNumberOfDays
        ? maxNumberOfDays - days + 1
        : 1
      : 1;
    const MissingDateDataPromises = [];
    for (let day = startDay; day <= maxNumberOfDays; day++) {
      const missingDate = new Date(AddDaysToDate(lastDate, day))
        .toISOString()
        .split("T")
        .shift();
      MissingDateDataPromises.push(
        new Promise<redisEntry>(
          MissingDateDataPromise.bind({
            date: missingDate,
            requestType: ActualDistricts,
          })
        )
      );
    }
    const MissingDateDataResults = await Promise.all(MissingDateDataPromises);

    MissingDateDataResults.forEach((result) => {
      actual.data = actual.data.map((district) => {
        if (result[district.ags]) {
          district.history.push({
            weekIncidence: result[district.ags].incidence_7d,
            date: new Date(result[district.ags].Datenstand),
            dataSource: "Unofficial, calculated from daily RKI Dump",
          });
        }
        return district;
      });
    });
  }

  // merge archive data with current data
  actual.data = actual.data.map((district) => {
    district.history.unshift(
      ...archive.data.find((element) => element.ags === district.ags).history
    );
    return district;
  });

  // filter by ags
  if (ags) {
    actual.data = actual.data.filter((district) => district.ags === ags);
  }

  // filter by days
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    actual.data = actual.data.map((district) => {
      district.history = district.history.filter(
        (element) => new Date(element.date) > reference_date
      );
      return district;
    });
  }

  return {
    data: actual.data,
    lastUpdate: lastUpdate,
  };
}

export interface StatesFrozenIncidenceData {
  abbreviation: string;
  name: string;
  history: {
    date: Date;
    weekIncidence: number;
    dataSource: string;
  }[];
}

export async function getStatesFrozenIncidenceHistory(
  days?: number,
  abbreviation?: string
): Promise<ResponseData<StatesFrozenIncidenceData[]>> {
  const actualDataPromise = new Promise<
    ResponseData<StatesFrozenIncidenceData[]>
  >(
    RkiFrozenIncidenceHistoryPromise.bind({
      requestType: ActualStates,
    })
  );
  const archiveDataPromise = new Promise<
    ResponseData<StatesFrozenIncidenceData[]>
  >(
    RkiFrozenIncidenceHistoryPromise.bind({
      requestType: ArchiveStates,
    })
  );
  let [actual, archive, metaLastFileDate] = await Promise.all([
    actualDataPromise,
    archiveDataPromise,
    axios
      .get(
        "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/meta/meta.json"
      )
      .then((response) => {
        return new Date(response.data.modified);
      }),
  ]);
  let lastUpdate = actual.lastUpdate;

  // The Excel sheet with fixed incidence data is only updated on mondays
  // check witch date is the last date in history
  const lastUpdate000 = new Date(new Date(actual.lastUpdate).setHours(0, 0, 0));
  const lastDate =
    actual.data[0].history.length == 0
      ? lastUpdate000
      : new Date(
          actual.data[0].history[actual.data[0].history.length - 1].date
        );
  const today: Date = new Date(new Date().setHours(0, 0, 0));
  // if lastDate < today and lastDate <= lastFileDate get the missing dates from github stored json files
  if (
    lastDate.getTime() < today.getTime() &&
    lastDate.getTime() <= metaLastFileDate.getTime()
  ) {
    lastUpdate = metaLastFileDate;
    const maxNumberOfDays = Math.min(
      getDayDifference(today, lastDate) - 1,
      getDayDifference(metaLastFileDate, lastDate) - 1
    );
    // add the missing date(s) to districts
    const startDay = days
      ? days <= maxNumberOfDays
        ? maxNumberOfDays - days + 1
        : 1
      : 1;
    const MissingDateDataPromises = [];
    for (let day = startDay; day <= maxNumberOfDays; day++) {
      const missingDate = new Date(AddDaysToDate(lastDate, day))
        .toISOString()
        .split("T")
        .shift();
      MissingDateDataPromises.push(
        new Promise<redisEntry>(
          MissingDateDataPromise.bind({
            date: missingDate,
            requestType: ActualStates,
          })
        )
      );
    }
    const MissingDateDataResults = await Promise.all(MissingDateDataPromises);

    MissingDateDataResults.forEach((result) => {
      actual.data = actual.data.map((state) => {
        const stateId = getStateIdByAbbreviation(state.abbreviation)
          .toString()
          .padStart(2, "0");
        if (result[stateId]) {
          state.history.push({
            weekIncidence: result[stateId].incidence_7d,
            date: new Date(result[stateId].Datenstand),
            dataSource: "Unofficial, calculated from daily RKI Dump",
          });
        }
        return state;
      });
    });
  }

  // merge archive data with current data
  actual.data = actual.data.map((state) => {
    state.history.unshift(
      ...archive.data.find(
        (element) => element.abbreviation === state.abbreviation
      ).history
    );
    return state;
  });

  // filter by ags
  if (abbreviation) {
    actual.data = actual.data.filter(
      (state) => state.abbreviation === abbreviation
    );
  }

  // filter by days
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    actual.data = actual.data.map((state) => {
      state.history = state.history.filter(
        (element) => new Date(element.date) > reference_date
      );
      return state;
    });
  }

  return {
    data: actual.data,
    lastUpdate: lastUpdate,
  };
}
