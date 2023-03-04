import axios from "axios";
import XLSX from "xlsx";
import zlib from "zlib";

import {
  AddDaysToDate,
  getDateBefore,
  getStateAbbreviationByName,
  RKIError,
  getStateIdByAbbreviation,
  CreateRedisClient,
  AddRedisEntry,
  GetRedisEntry,
  dateReviver,
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

// value for redis entry for never expire
const neverExpire = -1;

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

// create redis client for frozen-incidence Excel- and Date-Data
const redisClientFix = CreateRedisClient("fix:");

function GetNextMonday(date = new Date()) {
  const dateCopy = new Date(date.getTime());
  const nextMonday = new Date(
    dateCopy.setUTCDate(
      dateCopy.getUTCDate() + ((7 - dateCopy.getUTCDay() + 1) % 7 || 7)
    )
  );
  return nextMonday;
}

function GetLastMonday(date = new Date()) {
  const dateCopy = new Date(date.getTime());
  const lastMonday = new Date(
    dateCopy.setUTCDate(
      dateCopy.getUTCDate() - ((dateCopy.getUTCDay() + 6) % 7 || 7)
    )
  );
  return lastMonday;
}

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

  let data = [];
  let lastUpdate: Date;

  // check if a redis entry exists, if yes use it
  const redisEntry = await GetRedisEntry(redisClientFix, redisKey);

  // if there is no redis entry, set localdata.lastUpdate to 1970-01-01 to initiate recalculation
  const redisData = redisEntry.length
    ? JSON.parse(redisEntry[0].body, dateReviver)
    : { lastUpdate: new Date(1970, 0, 1), data };

  // build data from excel and store to redis
  if (
    new Date(redisData.lastUpdate).getTime() == new Date(1970, 0, 1).getTime()
  ) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      reject(new RKIError(rdata.error, response.config.url));
      throw new RKIError(rdata.error, response.config.url);
    }
    lastUpdate = new Date(response.headers["last-modified"]);
    const workbook = XLSX.read(rdata, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[SheetName];
    // table starts in row "startRow" (parameter is zero indexed)
    // if type == Districts.Archive.type filter out rows with "NR"
    let json = [];
    if (type == ArchiveDistricts.type) {
      json = XLSX.utils
        .sheet_to_json(sheet, { range: startRow })
        .filter((entry) => !!entry["NR"]);
    } else {
      json = XLSX.utils.sheet_to_json(sheet, { range: startRow });
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

    //prepare data for redis entry for the excelsheet
    const JsonData = JSON.stringify({ lastUpdate, data });

    let validForSec: number;

    // if archive data, set validForSec to neverExpire = -1
    // (archive data excel sheet should never change)
    if (type == ArchiveDistricts.type || type == ArchiveStates.type) {
      validForSec = neverExpire;
    } else {
      // get next monday
      const nextMonday = GetNextMonday();

      // get lastMonday
      const lastMonday = GetLastMonday();

      // set validToMs to nextMonday 8 o`clock in milliseconds (RKI update should be done then)
      let validToMs = new Date(nextMonday).setUTCHours(8, 0, 0, 0);

      // if lastUpdate < last monday 0 o`clock maybe today is public holiday
      // and the data will be updated tomorrow!
      // set validToMs to tomorrow 8 o`clock (new try tomorrow)
      if (new Date(lastUpdate).getTime() < lastMonday.setUTCHours(0, 0, 0, 0)) {
        validToMs = AddDaysToDate(new Date(), 1).setHours(8, 0, 0, 0);
      }
      // calculate the seconds from now to validTo or set to -1 if validTo is set to -1
      validForSec = Math.ceil((validToMs - new Date().getTime()) / 1000);
    }

    // add to redis
    await AddRedisEntry(
      redisClientFix,
      redisKey,
      JsonData,
      validForSec,
      "json"
    );
  } else {
    data = redisData.data;
    lastUpdate = new Date(redisData.lastUpdate);
  }
  resolve({ lastUpdate, data });
};

// this is the Promise to download the files or get it from redis for the missing frozen-incidence dates
// dateData parameter, witch date is requested and the date when the RKI excel file is last updated must be bind
const MissingDateDataPromise = async function (resolve, reject) {
  const requestType: RequestTypeParameter = this.requestType;
  const date = this.date;
  const lastUpdateRKI: Date = this.lastUpdateRKI;
  const redisKey = `${requestType.redisKey}_${date}`;
  const githubUrlPre = requestType.githubUrlPre;
  const githubUrlPost = requestType.githubUrlPost;

  let missingDateData: FrozenIncidenceDayFile;
  const redisEntry = await GetRedisEntry(redisClientFix, redisKey);
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
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    const redisData = unziped.toString();

    // get next monday
    const nextMonday = GetNextMonday();

    //get last monday
    const lastMonday = GetLastMonday();

    // set validToMs to nextMonday 8 o`clock in milliseconds (RKI Update should be done then)
    let validToMs = new Date(nextMonday).setUTCHours(8, 0, 0, 0);

    // if lastUpdate < last monday 0 o`clock, maybe today is public holiday
    // or the RKI is late and the data will updated later or tomorrow!
    // set validToMs to tomorrow 8 o`clock (new try tomorrow)
    if (
      new Date(lastUpdateRKI).getTime() < lastMonday.setUTCHours(0, 0, 0, 0)
    ) {
      validToMs = AddDaysToDate(new Date(), 1).setHours(8, 0, 0, 0);
    }

    // calculate the seconds from now to validTo
    const validForSec = Math.ceil((validToMs - new Date().getTime()) / 1000);

    // add to redis
    await AddRedisEntry(
      redisClientFix,
      redisKey,
      redisData,
      validForSec,
      "json"
    );
    missingDateData = JSON.parse(redisData, dateReviver);
  }
  resolve(missingDateData);
};

// function to finalize the request
// request missing dates, merge all data (actual, archive, missing dates)
// an apply filter if regionkey (ags or abbreviation) and/or days are given
async function finalizeData(
  actualData: { lastUpdate: Date; data: FrozenIncidenceData[] },
  archiveData: { lastUpdate: Date; data: FrozenIncidenceData[] },
  metaLastFileDate: Date,
  requestType: RequestTypeParameter,
  paramKey: string,
  paramDays?: number,
  paramDate?: Date
): Promise<{ data: FrozenIncidenceData[]; lastUpdate: Date }> {
  // lastUpdate from actual data is date of last entry
  const lastDate = new Date(actualData.lastUpdate).setHours(0, 0, 0);
  const today = new Date().setHours(0, 0, 0);
  let lastUpdate: Date;
  // if lastDate < today and lastDate <= lastFileDate get the missing dates from github stored json files
  if (lastDate < today && lastDate <= metaLastFileDate.getTime()) {
    lastUpdate = new Date(metaLastFileDate);
    const maxNumberOfDays =
      (metaLastFileDate.setHours(0, 0, 0, 0) - lastDate) / 86400000;
    const startDay = paramDays
      ? paramDays <= maxNumberOfDays
        ? maxNumberOfDays - paramDays + 1
        : 1
      : 1;
    const MissingDateDataPromises = [];

    // create a Promise for each missing Date
    for (let day = startDay; day <= maxNumberOfDays; day++) {
      const missingDate = new Date(AddDaysToDate(new Date(lastDate), day))
        .toISOString()
        .split("T")
        .shift();
      MissingDateDataPromises.push(
        new Promise<FrozenIncidenceDayFile>(
          MissingDateDataPromise.bind({
            date: missingDate,
            requestType: requestType,
            lastUpdateRKI: actualData.lastUpdate,
          })
        )
      );
    }

    // pull the data
    const MissingDateDataResults: FrozenIncidenceDayFile[] = await Promise.all(
      MissingDateDataPromises
    );

    // add the missing dates data to actual data
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
  } else {
    lastUpdate = new Date(actualData.lastUpdate);
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

  const districtsFinal = await finalizeData(
    actual,
    archive,
    metaLastFileDate,
    ActualDistricts,
    ags,
    days,
    date
  );

  return {
    data: districtsFinal.data,
    lastUpdate: districtsFinal.lastUpdate,
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

  const statesFinal = await finalizeData(
    actual,
    archive,
    metaLastFileDate,
    ActualStates,
    abbreviation,
    days,
    date
  );

  return {
    data: statesFinal.data,
    lastUpdate: statesFinal.lastUpdate,
  };
}
