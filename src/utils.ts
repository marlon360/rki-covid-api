import axios from "axios";
import lzma from "lzma-native";
import { redisClientBas } from "./server";
import { ApiData } from "./data-requests/r-value";

export function getStateAbbreviationById(id: number): string | null {
  switch (id) {
    case 0:
      return "Bund";
    case 1:
      return "SH";
    case 2:
      return "HH";
    case 3:
      return "NI";
    case 4:
      return "HB";
    case 5:
      return "NW";
    case 6:
      return "HE";
    case 7:
      return "RP";
    case 8:
      return "BW";
    case 9:
      return "BY";
    case 10:
      return "SL";
    case 11:
      return "BE";
    case 12:
      return "BB";
    case 13:
      return "MV";
    case 14:
      return "SN";
    case 15:
      return "ST";
    case 16:
      return "TH";
    default:
      return null;
  }
}

export function getStateIdByAbbreviation(abbreviation: string): number | null {
  switch (abbreviation) {
    case "Bund":
      return 0;
    case "SH":
      return 1;
    case "HH":
      return 2;
    case "NI":
      return 3;
    case "HB":
      return 4;
    case "NW":
      return 5;
    case "HE":
      return 6;
    case "RP":
      return 7;
    case "BW":
      return 8;
    case "BY":
      return 9;
    case "SL":
      return 10;
    case "BE":
      return 11;
    case "BB":
      return 12;
    case "MV":
      return 13;
    case "SN":
      return 14;
    case "ST":
      return 15;
    case "TH":
      return 16;
    default:
      return null;
  }
}

export function getStateAbbreviationByName(name: string): string | null {
  switch (name) {
    case "Baden-Württemberg":
      return "BW";
    case "Bayern":
      return "BY";
    case "Berlin":
      return "BE";
    case "Brandenburg":
      return "BB";
    case "Bremen":
      return "HB";
    case "Hamburg":
      return "HH";
    case "Hessen":
      return "HE";
    case "Mecklenburg-Vorpommern":
      return "MV";
    case "Niedersachsen":
      return "NI";
    case "Nordrhein-Westfalen":
      return "NW";
    case "Rheinland-Pfalz":
      return "RP";
    case "Saarland":
      return "SL";
    case "Sachsen":
      return "SN";
    case "Sachsen-Anhalt":
      return "ST";
    case "Schleswig-Holstein":
      return "SH";
    case "Thüringen":
      return "TH";
    case "Bundesgebiet":
      return "Bund";
    default:
      return null;
  }
}

export function getStateNameByAbbreviation(
  abbreviation: string
): string | null {
  switch (abbreviation) {
    case "BW":
      return "Baden-Württemberg";
    case "BY":
      return "Bayern";
    case "BE":
      return "Berlin";
    case "BB":
      return "Brandenburg";
    case "HB":
      return "Bremen";
    case "HH":
      return "Hamburg";
    case "HE":
      return "Hessen";
    case "MV":
      return "Mecklenburg-Vorpommern";
    case "NI":
      return "Niedersachsen";
    case "NW":
      return "Nordrhein-Westfalen";
    case "RP":
      return "Rheinland-Pfalz";
    case "SL":
      return "Saarland";
    case "SN":
      return "Sachsen";
    case "ST":
      return "Sachsen-Anhalt";
    case "SH":
      return "Schleswig-Holstein";
    case "TH":
      return "Thüringen";
    case "Bund":
      return "Bundesgebiet";
    default:
      return null;
  }
}

export function getStateIdByName(name: string): number | null {
  switch (name) {
    case "Baden-Württemberg":
      return 8;
    case "Bayern":
      return 9;
    case "Berlin":
      return 11;
    case "Brandenburg":
      return 12;
    case "Bremen":
      return 4;
    case "Hamburg":
      return 2;
    case "Hessen":
      return 6;
    case "Mecklenburg-Vorpommern":
      return 13;
    case "Niedersachsen":
      return 3;
    case "Nordrhein-Westfalen":
      return 5;
    case "Rheinland-Pfalz":
      return 7;
    case "Saarland":
      return 10;
    case "Sachsen":
      return 14;
    case "Sachsen-Anhalt":
      return 15;
    case "Schleswig-Holstein":
      return 1;
    case "Thüringen":
      return 16;
    case "Bundesgebiet":
      return 0;
    default:
      return null;
  }
}

export const neverExpire = -1;

export function getDateBefore(days: number): string {
  let offsetDate = new Date();
  offsetDate.setHours(0, 0, 0, 0);
  offsetDate.setDate(new Date().getDate() - days);
  return offsetDate.toISOString().split("T").shift();
}

export function getDateBeforeDate(date: string, days: number): string {
  let offsetDate = new Date(date);
  offsetDate.setHours(0, 0, 0, 0);
  offsetDate.setDate(new Date(date).getDate() - days);
  return offsetDate.toISOString().split("T").shift();
}

export function getDayDifference(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function AddDaysToDate(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 1000 * 60 * 60 * 24);
}

export function cleanupString(input: string): string {
  // only keep latin characters, umlaute, ß, -
  return input.replace(/[^a-zA-ZäöüÄÖÜß\-]/g, "");
}

export interface RKIErrorResponse {
  code: number;
  message: string;
  details: string[];
}

export class RKIError extends Error {
  public url?: string;
  public rkiError: RKIErrorResponse;

  constructor(error: RKIErrorResponse, url?: string) {
    super(error.message);
    this.name = "RKIError";
    this.rkiError = error;
    this.url = url;
  }
}

export function checkDateParameterForMaps(parmsDate: string) {
  let dateString: string;
  // Parametercheck
  if (
    parmsDate.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/) &&
    !(new Date(parmsDate).getTime() > new Date().getTime())
  ) {
    dateString = parmsDate;
  } else if (parmsDate.match(/^[0-9]+$/) && !isNaN(parseInt(parmsDate))) {
    dateString = getDateBefore(parseInt(parmsDate));
  } else {
    throw new Error(
      `Parameter bitte in der Form "JJJJ-MM-TT" wobei "JJJJ-MM-TT" < heute, oder als Ganzzahl Tage in die Vergangenheit angeben. ${parmsDate} überprüfen.`
    );
  }
  return dateString;
}
export function parseDate(dateString: string): Date {
  const parts = dateString.split(",");
  const dateParts = parts[0].split(".");
  const timeParts = parts[1].replace("Uhr", "").split(":");
  return new Date(
    parseInt(dateParts[2]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[0]),
    parseInt(timeParts[0]),
    parseInt(timeParts[1])
  );
}

export enum RequestType {
  cases = "cases",
  recovered = "recovered",
  deaths = "deaths",
}

export enum RegionType {
  districts = "ags",
  states = "id",
}

export function fill0CasesDays(
  sourceData: any,
  lowDate: Date,
  highDate: Date,
  regionType: RegionType,
  requestType: RequestType
) {
  const targetData = {};
  for (const historyData of sourceData.data) {
    const regionKey =
      regionType == RegionType.states
        ? getStateAbbreviationById(historyData[regionType])
        : historyData[regionType];
    if (!targetData[regionKey]) {
      targetData[regionKey] = {
        [regionType]: historyData[regionType],
        name: historyData.name,
        history: [],
      };
    }
    // if history is empty and lowDate is missing insert lowDate
    if (
      historyData.date > lowDate &&
      targetData[regionKey].history.length == 0
    ) {
      targetData[regionKey].history.push({
        [requestType]: 0,
        date: lowDate,
      });
    }
    if (targetData[regionKey].history.length > 0) {
      const nextDate: Date = historyData.date;
      while (
        getDayDifference(
          nextDate,
          targetData[regionKey].history[
            targetData[regionKey].history.length - 1
          ].date
        ) > 1
      ) {
        targetData[regionKey].history.push({
          [requestType]: 0,
          date: AddDaysToDate(
            targetData[regionKey].history[
              targetData[regionKey].history.length - 1
            ].date,
            1
          ),
        });
      }
    }
    targetData[regionKey].history.push({
      [requestType]: historyData[requestType],
      date: historyData.date,
    });
  }
  // now fill top dates to highDate (datenstand -1) for each regionKey
  for (const regionKey of Object.keys(targetData)) {
    while (
      targetData[regionKey].history[targetData[regionKey].history.length - 1]
        .date < highDate
    ) {
      targetData[regionKey].history.push({
        [requestType]: 0,
        date: AddDaysToDate(
          targetData[regionKey].history[
            targetData[regionKey].history.length - 1
          ].date,
          1
        ),
      });
    }
  }
  return targetData;
}

export function fill0CasesDaysGermany(
  sourceData: any,
  lowDate: Date,
  highDate: Date,
  requestType: RequestType
) {
  const targetData = [];
  for (const historyData of sourceData.history) {
    // if history is empty and lowDate is missing insert lowDate
    if (historyData.date > lowDate && targetData.length == 0) {
      targetData.push({
        [requestType]: 0,
        date: lowDate,
      });
    }
    if (targetData.length > 0) {
      const nextDate = historyData.date;
      while (
        getDayDifference(nextDate, targetData[targetData.length - 1].date) > 1
      ) {
        targetData.push({
          [requestType]: 0,
          date: AddDaysToDate(targetData[targetData.length - 1].date, 1),
        });
      }
    }
    targetData.push({
      [requestType]: historyData[requestType],
      date: historyData.date,
    });
  }
  // now fill top dates to highDate (datenstand -1) for each ags
  while (targetData[targetData.length - 1].date < highDate) {
    targetData.push({
      [requestType]: 0,
      date: AddDaysToDate(targetData[targetData.length - 1].date, 1),
    });
  }
  return targetData;
}

export function limit(value: number, decimals: number): number {
  return parseFloat(value.toFixed(decimals));
}

// create a new redis client with spezific prefix
export function CreateRedisClient(prefix: string) {
  // create redis client
  const client = require("express-redis-cache-next")({
    prefix: prefix,
    host: process.env.REDISHOST || process.env.REDIS_URL,
    port: process.env.REDISPORT,
    auth_pass: process.env.REDISPASSWORD,
  });
  return client;
}

// function to add entry to redis
export async function AddRedisEntry(
  redisClient: any,
  redisKey: string,
  JsonData: string,
  validFor: number,
  mime: string
) {
  return new Promise((resolve, reject) => {
    redisClient.add(
      redisKey,
      JsonData,
      { expire: validFor, type: mime },
      (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      }
    );
  });
}

export interface redisEntry {
  body: string;
  touched: number;
  expire: number;
  type: string;
}

// function to get entry from redis
export async function GetRedisEntry(redisClient: any, redisKey: string) {
  return new Promise<redisEntry[]>((resolve, reject) => {
    redisClient.get(redisKey, (err, objectString) => {
      if (err) {
        reject(err);
      } else {
        resolve(objectString);
      }
    });
  });
}

// this is a reviver for JSON.parse to convert all key including "date", "datum" or "Datum" to Date type
export function dateReviver(objKey: string, objValue: string | number | Date) {
  if (
    objKey.includes("date") ||
    objKey.includes("datum") ||
    objKey.includes("Datum") ||
    objKey.includes("Datenstand")
  ) {
    return new Date(objValue);
  }
  return objValue;
}

export interface MetaData {
  publication_date: string;
  version: string;
  size: number;
  filename: string;
  url: string;
  modified: number;
}

const baseUrl =
  "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/";

export async function getMetaData(): Promise<MetaData> {
  let metaData: MetaData;
  // check if redis entry for meta data exists, if yes use it
  const redisEntryMeta = await GetRedisEntry(redisClientBas, "meta");
  // check if redisEmtry is older than 1 day
  let olderThenOneDay = false;
  if (redisEntryMeta.length == 1) {
    const now = new Date().getTime();
    metaData = JSON.parse(redisEntryMeta[0].body);
    const redisEntryAge = now - metaData.modified;
    olderThenOneDay = redisEntryAge > 24 * 60 * 60 * 1000;
  }
  // if redisEntry for metadata not exists get data from github and store data to redis
  if (redisEntryMeta.length == 0 || olderThenOneDay) {
    const metaUrl = `${baseUrl}meta/meta.json`;
    const metaResponse = await axios.get(metaUrl);
    const rMetaData = metaResponse.data;
    if (rMetaData.error) {
      throw new RKIError(rMetaData.error, metaResponse.config.url);
    }
    metaData = rMetaData;
    // prepare for redis
    const metaRedis = JSON.stringify(metaData);
    let validForSec = 0;
    if (olderThenOneDay) {
      const oldMetaData: MetaData = JSON.parse(redisEntryMeta[0].body);
      const oldModified = oldMetaData.modified;
      const newModified = metaData.modified;
      newModified > oldModified;
      if (newModified > oldModified) {
        const validToMs = AddDaysToDate(
          new Date(metaData.modified),
          1
        ).setHours(3, 0, 0, 0);
        // calculate the seconds from now to validTo
        // if Math.ceil((validToMs - new Date().getTime()) / 1000) < 0 then set validForSec to 3600 () (one more hour to wait for Updates)
        validForSec = Math.ceil((validToMs - new Date().getTime()) / 1000);
      } else {
        validForSec = 3600;
      }
    } else {
      // metaData redisEntry is valid to next day 3 o`clock GMT
      const validToMs = AddDaysToDate(new Date(metaData.modified), 1).setHours(
        3,
        0,
        0,
        0
      );
      // calculate the seconds from now to validTo
      // if Math.ceil((validToMs - new Date().getTime()) / 1000) < 0 then set validForSec to 3600 () (one more hour to wait for Updates)
      validForSec =
        Math.ceil((validToMs - new Date().getTime()) / 1000) > 0
          ? Math.ceil((validToMs - new Date().getTime()) / 1000)
          : 3600;
    }
    // create redis Entry for metaData
    await AddRedisEntry(redisClientBas, "meta", metaRedis, validForSec, "json");
  } else {
    metaData = JSON.parse(redisEntryMeta[0].body);
  }
  return metaData;
}

interface StatesCasesJson {
  data: {
    IdBundesland: string;
    Bundesland: string;
    Meldedatum: Date;
    Datenstand: Date;
    accuCases: number;
    newCases: number;
    accuCasesPerWeek: number;
    newCasesPerWeek: number;
    accuDeaths: number;
    newDeaths: number;
    accuDeathsPerWeek: number;
    newDeathsPerWeek: number;
    accuRecovered: number;
    newRecovered: number;
    population: number;
  }[];
  metaData: MetaData;
}

export async function getStatesCasesJson(
  metaData: MetaData
): Promise<StatesCasesJson> {
  let statesCasesJson: StatesCasesJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryStatesCasesJson = await GetRedisEntry(
    redisClientBas,
    "statesCasesJson"
  );
  if (redisEntryStatesCasesJson.length == 1) {
    statesCasesJson = JSON.parse(
      redisEntryStatesCasesJson[0].body,
      dateReviver
    );
    const oldModified = statesCasesJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryStatesCasesJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}cases/states.json.xz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //decompress lzma compressed data (xz)
    const decompressed = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );
    // prepare data for redis
    statesCasesJson.data = JSON.parse(decompressed.toString(), dateReviver);
    statesCasesJson.metaData = metaData;
    const redisStatesCasesHistory = JSON.stringify(statesCasesJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "statesCasesJson",
      redisStatesCasesHistory,
      neverExpire,
      "json"
    );
  }
  return statesCasesJson;
}

export interface StatesHistoryJson {
  data: {
    m: Date;
    i: string;
    b: string;
    c: number;
    d: number;
    r: number;
  }[];
  metaData: MetaData;
}

export async function getStatesHistoryJson(
  metaData: MetaData
): Promise<StatesHistoryJson> {
  let statesHistoryJson: StatesHistoryJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryStatesHistoryJson = await GetRedisEntry(
    redisClientBas,
    "statesHistoryJson"
  );
  if (redisEntryStatesHistoryJson.length == 1) {
    statesHistoryJson = JSON.parse(
      redisEntryStatesHistoryJson[0].body,
      dateReviver
    );
    const oldModified = statesHistoryJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryStatesHistoryJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}history/states_new.json.xz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //decompress lzma compressed data (xz)
    const decompressed = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );
    // prepare data for redis
    statesHistoryJson.data = JSON.parse(decompressed.toString(), dateReviver);
    statesHistoryJson.metaData = metaData;
    const redisStatesHistory = JSON.stringify(statesHistoryJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "statesHistoryJson",
      redisStatesHistory,
      neverExpire,
      "json"
    );
  }
  return statesHistoryJson;
}

interface DistrictsCasesJson {
  data: {
    IdLandkreis: string;
    Bundesland: string;
    Landkreis: string;
    Meldedatum: Date;
    Datenstand: Date;
    accuCases: number;
    newCases: number;
    accuCasesPerWeek: number;
    newCasesPerWeek: number;
    accuDeaths: number;
    newDeaths: number;
    accuDeathsPerWeek: number;
    newDeathsPerWeek: number;
    accuRecovered: number;
    newRecovered: number;
    population: number;
  }[];
  metaData: MetaData;
}

export async function getDistrictsCasesJson(
  metaData: MetaData
): Promise<DistrictsCasesJson> {
  let districtsCasesJson: DistrictsCasesJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryDistrictsCasesHistoryJson = await GetRedisEntry(
    redisClientBas,
    "districtsCasesJson"
  );
  if (redisEntryDistrictsCasesHistoryJson.length == 1) {
    districtsCasesJson = JSON.parse(
      redisEntryDistrictsCasesHistoryJson[0].body,
      dateReviver
    );
    const oldModified = districtsCasesJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryDistrictsCasesHistoryJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}cases/districts.json.xz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //decompress lzma compressed data (xz)
    const decompressed = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );
    // prepare data for redis
    districtsCasesJson.data = JSON.parse(decompressed.toString(), dateReviver);
    districtsCasesJson.metaData = metaData;
    const redisDistrictsCases = JSON.stringify(districtsCasesJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "districtsCasesJson",
      redisDistrictsCases,
      neverExpire,
      "json"
    );
  }
  return districtsCasesJson;
}

interface DistrictsHistoryJson {
  data: {
    i: string;
    m: Date;
    l: string;
    c: number;
    d: number;
    r: number;
  }[];
  metaData: MetaData;
}

export async function getDistrictsHistoryJson(
  metaData: MetaData
): Promise<DistrictsHistoryJson> {
  let districtsHistoryJson: DistrictsHistoryJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryDistrictsHistoryJson = await GetRedisEntry(
    redisClientBas,
    "districtsHistoryJson"
  );
  if (redisEntryDistrictsHistoryJson.length == 1) {
    districtsHistoryJson = JSON.parse(
      redisEntryDistrictsHistoryJson[0].body,
      dateReviver
    );
    const oldModified = districtsHistoryJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryDistrictsHistoryJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}history/districts_new.json.xz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //decompress lzma compressed data (xz)
    const decompressed = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );
    // prepare data for redis
    districtsHistoryJson.data = JSON.parse(
      decompressed.toString(),
      dateReviver
    );
    districtsHistoryJson.metaData = metaData;
    const redisDistrictsHistory = JSON.stringify(districtsHistoryJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "districtsHistoryJson",
      redisDistrictsHistory,
      neverExpire,
      "json"
    );
  }
  return districtsHistoryJson;
}

interface StatesAgeGroup {
  data: {
    Altersgruppe: string;
    IdBundesland: string;
    casesMale: number;
    casesFemale: number;
    deathsMale: number;
    deathsFemale: number;
    casesMalePer100k: number;
    casesFemalePer100k: number;
    deathsMalePer100k: number;
    deathsFemalePer100k: number;
  }[];
  metaData: MetaData;
}

export async function getStatesAgeGroupJson(
  metaData: MetaData
): Promise<StatesAgeGroup> {
  let statesAgeGroupJson: StatesAgeGroup = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryStatesAgeGroupJson = await GetRedisEntry(
    redisClientBas,
    "statesAgeGroupJson"
  );
  if (redisEntryStatesAgeGroupJson.length == 1) {
    statesAgeGroupJson = JSON.parse(
      redisEntryStatesAgeGroupJson[0].body,
      dateReviver
    );
    const oldModified = statesAgeGroupJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryStatesAgeGroupJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}agegroup/states.json.xz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //decompress lzma compressed data (xz)
    const decompressed = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );
    // prepare data for redis
    statesAgeGroupJson.data = JSON.parse(decompressed.toString(), dateReviver);
    statesAgeGroupJson.metaData = metaData;
    const redisStatesAgeGroupJson = JSON.stringify(statesAgeGroupJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "statesAgeGroupJson",
      redisStatesAgeGroupJson,
      neverExpire,
      "json"
    );
  }
  return statesAgeGroupJson;
}

interface DistrictsAgeGroup {
  data: {
    IdLandkreis: string;
    Altersgruppe: string;
    casesMale: number;
    casesFemale: number;
    deathsMale: number;
    deathsFemale: number;
    casesMalePer100k: number;
    casesFemalePer100k: number;
    deathsMalePer100k: number;
    deathsFemalePer100k: number;
  }[];
  metaData: MetaData;
}

export async function getDistrictsAgeGroupJson(
  metaData: MetaData
): Promise<DistrictsAgeGroup> {
  let districtsAgeGroupJson: DistrictsAgeGroup = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryDistrictsAgeGroupJson = await GetRedisEntry(
    redisClientBas,
    "districtsAgeGroupJson"
  );
  if (redisEntryDistrictsAgeGroupJson.length == 1) {
    districtsAgeGroupJson = JSON.parse(
      redisEntryDistrictsAgeGroupJson[0].body,
      dateReviver
    );
    const oldModified = districtsAgeGroupJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryDistrictsAgeGroupJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}agegroup/districts.json.xz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //decompress lzma compressed data (xz)
    const decompressed = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );
    // prepare data for redis
    districtsAgeGroupJson.data = JSON.parse(
      decompressed.toString(),
      dateReviver
    );
    districtsAgeGroupJson.metaData = metaData;
    const redisDistrictsAgeGroup = JSON.stringify(districtsAgeGroupJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "districtsAgeGroupJson",
      redisDistrictsAgeGroup,
      neverExpire,
      "json"
    );
  }
  return districtsAgeGroupJson;
}

export async function GetApiCommit(url: string, key: string): Promise<ApiData> {
  let apiData: ApiData;
  const apiDataRedis = await GetRedisEntry(redisClientBas, key);
  if (apiDataRedis.length == 1) {
    apiData = JSON.parse(apiDataRedis[0].body, dateReviver);
  } else {
    // if redisEntry for cases not exists get data from github und store data to redis
    const response = await axios.get(url);
    const rData = response.data;
    if (rData.error) {
      throw new RKIError(rData.error, response.config.url);
    }
    // prepare data for redis
    apiData = rData;
    const apiDataRedis = JSON.stringify(apiData);
    // create redis Entry for metaData
    await AddRedisEntry(redisClientBas, key, apiDataRedis, 720, "json");
  }
  return apiData;
}

export interface ApiTreesSha {
  sha: string;
  url: string;
  truncated: boolean;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size: number;
    url: string;
  }[];
}

export async function GetApiTrees(
  url: string,
  key: string
): Promise<ApiTreesSha> {
  let apiData: ApiTreesSha;
  const apiDataRedis = await GetRedisEntry(redisClientBas, key);
  if (apiDataRedis.length == 1) {
    apiData = JSON.parse(apiDataRedis[0].body, dateReviver);
  } else {
    // if redisEntry for cases not exists get data from github und store data to redis
    const response = await axios.get(url);
    const rData = response.data;
    if (rData.error) {
      throw new RKIError(rData.error, response.config.url);
    }
    // prepare data for redis
    apiData = rData;
    const apiDataRedis = JSON.stringify(apiData);
    // create redis Entry for metaData
    await AddRedisEntry(redisClientBas, key, apiDataRedis, 720, "json");
  }
  return apiData;
}
