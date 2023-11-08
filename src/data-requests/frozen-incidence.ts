import axios from "axios";
import XLSX from "xlsx";
import lzma from "lzma-native";
import { MetaData, neverExpire } from "../utils";

import {
  getDateBefore,
  getStateAbbreviationByName,
  RKIError,
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
interface ActualParameter {
  type: string;
  url: string;
  WorkBook: string;
  SheetName: string;
  startRow: number;
  startColumn: number;
  key: string;
  redisKey: string;
}
interface ArchiveParameter {
  type: string;
  url: string;
  WorkBook: string;
  SheetName: string;
  startRow: number;
  startColumn: number;
  key: string;
  redisKey: string;
}
interface UnofficialParameter {
  key: string;
  githubUrlUnofficial: string;
  redisKeyUnofficial: string;
}
interface Region {
  Actual: ActualParameter;
  Archive: ArchiveParameter;
  Unofficial: UnofficialParameter;
}

const Districts: Region = {
  Actual: {
    type: "ActualDistricts",
    url: "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/Fallzahlen_Kum_Tab_aktuell.xlsx",
    WorkBook: "Unofficial, copy of Fallzahlen_Kum_Tab_aktuell.xlsx",
    SheetName: "LK_7-Tage-Inzidenz (fixiert)",
    startRow: 4,
    startColumn: 2,
    key: "ags",
    redisKey: "DistrictsActual",
  },
  Archive: {
    type: "ArchiveDistricts",
    url: "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/Fallzahlen_Kum_Tab_Archiv.xlsx",
    WorkBook: "Unofficial, copy of Fallzahlen_Kum_Tab_Archiv.xlsx",
    SheetName: "LK_7-Tage-Inzidenz (fixiert)",
    startRow: 4,
    startColumn: 3,
    key: "ags",
    redisKey: "DistrictsArchive",
  },
  Unofficial: {
    key: "ags",
    githubUrlUnofficial:
      "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/frozen-incidence/LK.json.gz",
    redisKeyUnofficial: "DistrictsUnofficial",
  },
};

const States: Region = {
  Actual: {
    type: "ActualStates",
    url: "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/Fallzahlen_Kum_Tab_aktuell.xlsx",
    WorkBook: "Unofficial, copy of Fallzahlen_Kum_Tab_aktuell.xlsx",
    SheetName: "BL_7-Tage-Inzidenz (fixiert)",
    startRow: 4,
    startColumn: 1,
    key: "abbreviation",
    redisKey: "StatesActual",
  },
  Archive: {
    type: "ArchiveStates",
    url: "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/Fallzahlen_Kum_Tab_Archiv.xlsx",
    WorkBook: "Unofficial, copy of Fallzahlen_Kum_Tab_Archiv.xlsx",
    SheetName: "BL_7-Tage-Inzidenz (fixiert)",
    startRow: 4,
    startColumn: 1,
    key: "abbreviation",
    redisKey: "StatesArchive",
  },
  Unofficial: {
    key: "abbreviation",
    githubUrlUnofficial:
      "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/frozen-incidence/BL.json.gz",
    redisKeyUnofficial: "StatesUnofficial",
  },
};

// create redis client for frozen-incidence Excel- and self calculated unofficial data
const redisClientFix = CreateRedisClient("fix:");

// this is the promise to prepare the districts AND states data from the excel sheets
// and store this to redis (if not exists!) they will not expire
const RKIFrozenIncidenceHistoryPromise = async function (resolve, reject) {
  const parameter: ActualParameter | ArchiveParameter = this.requestType;

  let data = [];
  let lastUpdate: Date;

  // check if a redis entry exists, if yes use it
  const redisEntry = await GetRedisEntry(redisClientFix, parameter.redisKey);

  // if there is no redis entry, set localdata.lastUpdate to 1970-01-01 to initiate recalculation
  const redisData = redisEntry.length
    ? JSON.parse(redisEntry[0].body, dateReviver)
    : { lastUpdate: new Date(1970, 0, 1), data };

  // build data from excel and store to redis
  if (
    new Date(redisData.lastUpdate).getTime() == new Date(1970, 0, 1).getTime()
  ) {
    const response = await axios.get(parameter.url, {
      responseType: "arraybuffer",
    });
    const rdata = response.data;
    if (rdata.error) {
      reject(new RKIError(rdata.error, response.config.url));
      throw new RKIError(rdata.error, response.config.url);
    }
    const workbook = XLSX.read(rdata, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[parameter.SheetName];
    // table starts in row "startRow" (parameter is zero indexed)
    // if type == Districts.Archive.type filter out rows with "NR"
    let json = [];
    if (parameter.type == Districts.Archive.type) {
      json = XLSX.utils
        .sheet_to_json(sheet, { range: parameter.startRow })
        .filter((entry) => !!entry["NR"]);
    } else {
      json = XLSX.utils.sheet_to_json(sheet, { range: parameter.startRow });
    }
    data = json.map((entry) => {
      const name =
        parameter.key == "abbreviation"
          ? parameter.type == States.Actual.type
            ? entry["MeldeLandkreisBundesland"] == "Gesamt"
              ? "Bundesgebiet"
              : entry["MeldeLandkreisBundesland"]
            : entry["__EMPTY"] == "Gesamt"
            ? "Bundesgebiet"
            : entry["__EMPTY"]
          : entry["LK"];
      const regionKey =
        parameter.key == "abbreviation"
          ? getStateAbbreviationByName(name) == null
            ? "Bund"
            : getStateAbbreviationByName(name)
          : entry["LKNR"].toString().padStart(5, "0");

      const history = [];

      // get all date keys
      const dateKeys = Object.keys(entry);

      // ignore the first startColumn elements (rowNumber, LK, LKNR)
      dateKeys.splice(0, parameter.startColumn);
      dateKeys.forEach((dateKey) => {
        const date = getDateFromString(dateKey.toString());
        history.push({
          weekIncidence: entry[dateKey],
          date: date,
          dataSource: parameter.WorkBook,
        });
      });
      return { [parameter.key]: regionKey, name: name, history: history };
    });
    lastUpdate = new Date(data[0].history[data[0].history.length - 1].date);
    //prepare data for redis entry for the excelsheet
    const JsonData = JSON.stringify({ lastUpdate, data });

    // add to redis
    await AddRedisEntry(
      redisClientFix,
      parameter.redisKey,
      JsonData,
      neverExpire,
      "json"
    );
  } else {
    data = redisData.data;
    lastUpdate = new Date(redisData.lastUpdate);
  }
  resolve({ lastUpdate, data });
};

export interface UnofficialData {
  [key: string]: {
    name: string;
    history: {
      date: Date;
      weekIncidence: number;
      dataSource: string;
    }[];
  };
}
// this reloads the unofficial data from LK.json.gz or BL.json.gz and store this to redis
async function reloadUnofficial(
  requestType: UnofficialParameter,
  lastUpdate: Date
): Promise<UnofficialData> {
  const response = await axios.get(requestType.githubUrlUnofficial, {
    responseType: "arraybuffer",
  });
  const rdata = response.data;
  if (rdata.error) {
    throw new RKIError(rdata.error, response.config.url);
  }
  //decompress lzma compressed data (xz)
  const decompressed = await new Promise((resolve) =>
    lzma.decompress(rdata, undefined, (result) => resolve(result))
  );
  // parse Json
  const jsonData = JSON.parse(decompressed.toString(), dateReviver);
  // build unofficial data
  let unofficial: UnofficialData = {};
  jsonData.forEach((entry) => {
    const name =
      requestType.key == "abbreviation"
        ? entry["Bundesland"]
        : entry["Landkreis"];
    let regionKey =
      requestType.key == "abbreviation"
        ? getStateAbbreviationByName(name)
        : entry["IdLandkreis"].padStart(5, "0");
    let keyEntry = unofficial[regionKey];
    if (!keyEntry) {
      const history = [];
      unofficial[regionKey] = { name: name, history: history };
    }
    unofficial[regionKey].history.push({
      date: new Date(entry["Datenstand"]),
      weekIncidence: entry["incidence_7d"],
      dataSource: "Unofficial, calculated from daily RKI Dump",
    });
  });
  const redisData = JSON.stringify({ lastUpdate, unofficial });
  // add to redis
  await AddRedisEntry(
    redisClientFix,
    requestType.redisKeyUnofficial,
    redisData,
    neverExpire,
    "json"
  );
  return unofficial;
}
// this is the Promise to get BL.json.gz or LK.json.gz from redis for all dates after 2023-04-17
// if not present call a reload and store to redis (reloadUnofficial)
// if metadata lastUpdate is newer the the stored date in redis, reload and store new unofficial data to redis (reloadUnofficial)
// requestType mus be bind
const UnofficialDataPromise = async function (resolve, reject) {
  const requestType: UnofficialParameter = this.requestType;
  const metaData: MetaData = this.metaData;

  const lastUpdateMeta = new Date(metaData.publication_date);
  let unofficialData: UnofficialData = {};
  const redisEntry = await GetRedisEntry(
    redisClientFix,
    requestType.redisKeyUnofficial
  );
  if (redisEntry.length == 1) {
    const unofficialRedis = JSON.parse(redisEntry[0].body, dateReviver);
    if (
      new Date(lastUpdateMeta).getTime() <=
      new Date(unofficialRedis.lastUpdate).getTime()
    ) {
      unofficialData = unofficialRedis.unofficial;
    } else {
      unofficialData = await reloadUnofficial(requestType, lastUpdateMeta);
    }
  } else {
    unofficialData = await reloadUnofficial(requestType, lastUpdateMeta);
  }
  resolve(unofficialData);
};

// function to finalize the request
// request missing dates, merge all data (actual, archive, missing dates)
// an apply filter if regionkey (ags or abbreviation) and/or days are given
async function finalizeData(
  actualData: { lastUpdate: Date; data: FrozenIncidenceData[] },
  archiveData: { lastUpdate: Date; data: FrozenIncidenceData[] },
  unofficialData: UnofficialData,
  metaLastFileDate: Date,
  region: Region,
  paramKey: string,
  paramDays?: number,
  paramDate?: Date
): Promise<{ data: FrozenIncidenceData[]; lastUpdate: Date }> {
  // merge archive data with current data
  actualData.data = actualData.data.map((entry) => {
    entry.history.unshift(
      ...archiveData.data.find(
        (element) => element[region.Actual.key] === entry[region.Actual.key]
      ).history
    );
    return entry;
  });

  // merge unofficial data with current data
  actualData.data.forEach((entry) => {
    if (unofficialData[entry[region.Unofficial.key]] != null) {
      entry.history.unshift(
        ...unofficialData[entry[region.Unofficial.key]].history
      );
    }
    entry.history.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  });

  // filter by requestType.key (ags or abbreviation)
  if (paramKey) {
    actualData.data = actualData.data.filter(
      (entry) => entry[region.Actual.key] === paramKey
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
  return { data: actualData.data, lastUpdate: new Date(metaLastFileDate) };
}

export async function getDistrictsFrozenIncidenceHistory(
  metaData: MetaData,
  days?: number,
  ags?: string,
  date?: Date
): Promise<ResponseData<FrozenIncidenceData[]>> {
  const actualDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
    RKIFrozenIncidenceHistoryPromise.bind({
      requestType: Districts.Actual,
    })
  );
  const archiveDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
    RKIFrozenIncidenceHistoryPromise.bind({
      requestType: Districts.Archive,
    })
  );
  const GitUnofficialDataPromise = new Promise<UnofficialData>(
    UnofficialDataPromise.bind({
      requestType: Districts.Unofficial,
      metaData: metaData,
    })
  );
  let [actual, archive, metaLastFileDate, unofficialData] = await Promise.all([
    actualDataPromise,
    archiveDataPromise,
    axios
      .get(
        "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/meta/meta.json"
      )
      .then((response) => {
        return new Date(response.data.modified);
      }),
    GitUnofficialDataPromise,
  ]);

  const districtsFinal = await finalizeData(
    actual,
    archive,
    unofficialData,
    metaLastFileDate,
    Districts,
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
  metaData: MetaData,
  days?: number,
  abbreviation?: string,
  date?: Date
): Promise<ResponseData<FrozenIncidenceData[]>> {
  const actualDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
    RKIFrozenIncidenceHistoryPromise.bind({
      requestType: States.Actual,
    })
  );
  const archiveDataPromise = new Promise<ResponseData<FrozenIncidenceData[]>>(
    RKIFrozenIncidenceHistoryPromise.bind({
      requestType: States.Archive,
    })
  );
  const GitUnofficialDataPromise = new Promise<UnofficialData>(
    UnofficialDataPromise.bind({
      requestType: States.Unofficial,
      metaData: metaData,
    })
  );
  let [actual, archive, metaLastFileDate, unofficialData] = await Promise.all([
    actualDataPromise,
    archiveDataPromise,
    axios
      .get(
        "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/meta/meta.json"
      )
      .then((response) => {
        return new Date(response.data.modified);
      }),
    GitUnofficialDataPromise,
  ]);

  const statesFinal = await finalizeData(
    actual,
    archive,
    unofficialData,
    metaLastFileDate,
    States,
    abbreviation,
    days,
    date
  );

  return {
    data: statesFinal.data,
    lastUpdate: statesFinal.lastUpdate,
  };
}
