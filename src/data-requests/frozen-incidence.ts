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

export interface FrozenIncidenceData {
  [key: string]: any;
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
  githubUrlPre: string;
  githubUrlPost: string;
  redisKey: string;
}

interface FrozenIncidenceDayFile {
  [key: string]: {
    Bundesland: string;
    Datenstand: string;
    AnzahlFall_7d: number;
    incidence_7d: number;
  };
}

const ActualDistricts: RequestTypeParameter = {
  type: "ActualDistricts",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_aktuell.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_aktuell.xlsx",
  SheetName: "LK_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 2,
  key: "ags",
  githubUrlPre:
    "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/frozen-incidence/frozen-incidence_",
  githubUrlPost: "_LK.json.gz",
  redisKey: "ActualDistricts",
};

const ArchiveDistricts: RequestTypeParameter = {
  type: "ArchiveDistricts",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_Archiv.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_Archiv.xlsx",
  SheetName: "LK_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 3,
  key: "ags",
  githubUrlPre: "",
  githubUrlPost: "",
  redisKey: "ArchiveDistricts",
};

const ActualStates: RequestTypeParameter = {
  type: "ActualStates",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_aktuell.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_aktuell.xlsx",
  SheetName: "BL_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 1,
  key: "abbreviation",
  githubUrlPre:
    "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/frozen-incidence/frozen-incidence_",
  githubUrlPost: "_BL.json.gz",
  redisKey: "ActualStates",
};

const ArchiveStates: RequestTypeParameter = {
  type: "ArchiveStates",
  url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_Archiv.xlsx?__blob=publicationFile",
  WorkBook: "Official, from Fallzahlen_Kum_Tab_Archiv.xlsx",
  SheetName: "BL_7-Tage-Inzidenz (fixiert)",
  startRow: 4,
  startColumn: 1,
  key: "abbreviation",
  githubUrlPre: "",
  githubUrlPost: "",
  redisKey: "ArchiveStates",
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
  return new Promise<number>((resolve, reject) => {
    fiJsonCache.del(redisKey, (err, deletions) => {
      if (err) {
        reject(err);
      } else {
        resolve(deletions);
      }
    });
  });
};

// this is a reviver for JSON.parse to convert all key including "date" to Date type
const dateReviver = function (
  objKey: string,
  objValue: string | number | Date
) {
  if (objKey.includes("date")) {
    return new Date(objValue);
  }
  return objValue;
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
  const redisEntry = await getJsonDataFromRedis(redisKey);
  let redisData = redisEntry.length
    ? JSON.parse(redisEntry[0].body, dateReviver)
    : { lastUpdate: new Date(1970, 0, 1), data };

  // also recalculate if the excelfile is newer as redis data
  if (lastUpdate.getTime() > new Date(redisData.lastUpdate).getTime()) {
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

    //create or update redis entry for the excelsheet
    const JsonData = JSON.stringify({ lastUpdate, data });
    await addJsonDataToRedis(redisKey, JsonData, -1);
  } else {
    data = redisData.data;
    lastUpdate = new Date(redisData.lastUpdate);
  }
  resolve({ lastUpdate, data });
};

// this is the Promise to download the files for the missing frozen-incidence dates
const MissingDateDataPromise = async function (resolve, reject) {
  const requestType: RequestTypeParameter = this.requestType;
  const date = this.date;
  const redisKey = `${requestType.redisKey}_${date}`;
  const githubUrlPre = requestType.githubUrlPre;
  const githubUrlPost = requestType.githubUrlPost;

  const redisEntry = await getJsonDataFromRedis(redisKey);
  let missingDateData: FrozenIncidenceDayFile;
  if (redisEntry.length == 1) {
    missingDateData = JSON.parse(redisEntry[0].body, dateReviver);
  } else {
    const url = `${githubUrlPre}${date}${githubUrlPost}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      reject(new RKIError(rdata.error, response.config.url));
      throw new RKIError(rdata.error, response.config.url);
    }
    const unzipped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // add to redis
    await addJsonDataToRedis(redisKey, unzipped.toString(), -1);
    missingDateData = JSON.parse(unzipped.toString(), dateReviver);
  }
  resolve(missingDateData);
};

async function finalizeData(
  actualData: { lastUpdate: Date; data: FrozenIncidenceData[] },
  archiveData: { lastUpdate: Date; data: FrozenIncidenceData[] },
  metaLastFileDate: Date,
  requestType: RequestTypeParameter,
  paramKey: string,
  paramDays?: number,
  paramDate?: Date
) {
  // The Excel sheet with fixed incidence data is only updated on mondays
  // check witch date is the last date in history
  const lastUpdate000 = new Date(
    new Date(actualData.lastUpdate).setHours(0, 0, 0)
  );
  const lastDate =
    actualData.data[0].history.length == 0
      ? lastUpdate000
      : new Date(
          actualData.data[0].history[actualData.data[0].history.length - 1].date
        );
  const today: Date = new Date(new Date().setHours(0, 0, 0));
  let lastUpdate: Date;
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
    const startDay = paramDays
      ? paramDays <= maxNumberOfDays
        ? maxNumberOfDays - paramDays + 1
        : 1
      : 1;
    const MissingDateDataPromises = [];
    for (let day = startDay; day <= maxNumberOfDays; day++) {
      const missingDate = new Date(AddDaysToDate(lastDate, day))
        .toISOString()
        .split("T")
        .shift();
      MissingDateDataPromises.push(
        new Promise<FrozenIncidenceDayFile>(
          MissingDateDataPromise.bind({
            date: missingDate,
            requestType: requestType,
          })
        )
      );
    }
    const MissingDateDataResults: FrozenIncidenceDayFile[] = await Promise.all(
      MissingDateDataPromises
    );

    MissingDateDataResults.forEach((result) => {
      actualData.data = actualData.data.map((entry) => {
        const key: string =
          requestType == ActualStates
            ? getStateIdByAbbreviation(entry[requestType.key])
                .toString()
                .padStart(2, "0")
            : entry[requestType.key];
        if (result[key]) {
          entry.history.push({
            weekIncidence: result[key].incidence_7d,
            date: new Date(result[key].Datenstand),
            dataSource: "Unofficial, calculated from daily RKI Dump",
          });
        }
        return entry;
      });
    });
  }

  // merge archive data with current data
  actualData.data = actualData.data.map((entry) => {
    entry.history.unshift(
      ...archiveData.data.find(
        (element) => element[requestType.key] === entry[requestType.key]
      ).history
    );
    return entry;
  });

  // filter by requestType.key (ags or abbreviation)
  if (paramKey) {
    actualData.data = actualData.data.filter(
      (entry) => entry[requestType.key] === paramKey
    );
  }

  // filter by days || date
  if (paramDays || paramDate) {
    const reference_date = paramDays
      ? new Date(getDateBefore(paramDays))
      : new Date(paramDate);
    actualData.data = actualData.data.map((entry) => {
      if (paramDays) {
        entry.history = entry.history.filter(
          (element) => new Date(element.date) > reference_date
        );
      } else {
        entry.history = entry.history.filter(
          (element) =>
            new Date(element.date).getTime() == reference_date.getTime()
        );
      }
      return entry;
    });
  }
  return { data: actualData.data, lastUpdate: lastUpdate };
}

// function to cleanup the daily missing data entry in redis
async function CleanupRedisCache(
  lastUpdateExcelAktuell: Date,
  requestType: RequestTypeParameter
) {
  const date = new Date(lastUpdateExcelAktuell);
  date.setHours(0, 0, 0, 0);
  for (let i = 14; i >= 0; i--) {
    const dateStr = AddDaysToDate(date, i).toISOString().split("T").shift();
    const redisKey = `${dateStr}_${requestType.redisKey}`;
    const numberOfDeletions = await delJsonDataFromRedis(redisKey);
    if (numberOfDeletions) {
      console.log(
        `Rediskey ${redisKey} deleted. Number of deletions: ${numberOfDeletions}`
      );
    }
  }
}

export async function getDistrictsFrozenIncidenceHistory(
  days?: number,
  ags?: string,
  date?: Date
): Promise<ResponseData<FrozenIncidenceData[]>> {
  const actualDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
    RkiFrozenIncidenceHistoryPromise.bind({
      requestType: ActualDistricts,
    })
  );
  const archiveDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
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

  const actualFinal = await finalizeData(
    actual,
    archive,
    metaLastFileDate,
    ActualDistricts,
    ags,
    days,
    date
  );

  await CleanupRedisCache(actual.lastUpdate, ActualDistricts);

  return {
    data: actualFinal.data,
    lastUpdate: actualFinal.lastUpdate,
  };
}

export async function getStatesFrozenIncidenceHistory(
  days?: number,
  abbreviation?: string,
  date?: Date
): Promise<ResponseData<FrozenIncidenceData[]>> {
  const actualDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
    RkiFrozenIncidenceHistoryPromise.bind({
      requestType: ActualStates,
    })
  );
  const archiveDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
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

  const actualFinal = await finalizeData(
    actual,
    archive,
    metaLastFileDate,
    ActualStates,
    abbreviation,
    days,
    date
  );

  await CleanupRedisCache(actual.lastUpdate, ActualStates);

  return {
    data: actualFinal.data,
    lastUpdate: actualFinal.lastUpdate,
  };
}
