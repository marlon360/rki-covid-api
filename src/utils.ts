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

export function checkDateParameter(parmsDate: string) {
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
    objKey == "Datenstand" ||
    objKey == "m" ||
    objKey == "cD"
  ) {
    return new Date(objValue);
  }
  return objValue;
}

export enum Files {
  D_Data = "cases/districts.json.xz",
  D_NewCases = "cases/districts.json.xz",
  D_NewDeaths = "cases/districts.json.xz",
  D_NewRecovered = "cases/districts.json.xz",
  D_CasesHistory = "history/d_cases_short.json.xz",
  D_DeathsHistory = "history/d_deaths_short.json.xz",
  D_RecoveredHistory = "history/d_recovered_short.json.xz",
  D_IncidenceHistory = "history/d_incidence_short.json.xz",
  D_AgeGroups = "agegroup/districts.json.xz",
  D_CasesHistoryLastChangesFile = "historychanges/cases/districts_Diff.json.xz",
  D_DeathsHistoryLastChangesFile = "historychanges/deaths/districts_Diff.json.xz",
  D_RevoveredHistoryLastChangesFile = "historychanges/recovered/districts_Diff.json.xz",
  D_IncidenceHistoryLastChangesFile = "historychanges/incidence/districts_Diff.json.xz",
  S_Data = "cases/states.json.xz",
  S_NewCases = "cases/states.json.xz",
  S_NewDeaths = "cases/states.json.xz",
  S_NewRecovered = "cases/states.json.xz",
  S_CasesHistory = "history/s_cases_short.json.xz",
  S_DeathsHistory = "history/s_deaths_short.json.xz",
  S_RecoveredHistory = "history/s_recovered_short.json.xz",
  S_IncidenceHistory = "history/s_incidence_short.json.xz",
  S_AgeGroups = "agegroup/states.json.xz",
  S_CasesHistoryLastChangesFile = "historychanges/cases/states_Diff.json.xz",
  S_DeathsHistoryLastChangesFile = "historychanges/deaths/states_Diff.json.xz",
  S_RevoveredHistoryLastChangesFile = "historychanges/recovered/states_Diff.json.xz",
  S_IncidenceHistoryLastChangesFile = "historychanges/incidence/states_Diff.json.xz",
}

export interface MetaData {
  publication_date: string;
  version: string;
  size: number;
  filename: string;
  url: string;
  modified: number;
}

export const baseUrl =
  "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/dataStore/";

export const baseUrlRD5 =
  "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA5/master/dataStore/";

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

export async function getMetaDataRD5(): Promise<MetaData> {
  let metaDataRD5: MetaData;
  // check if redis entry for meta data exists, if yes use it
  const redisEntryMeta = await GetRedisEntry(redisClientBas, "metaRD5");
  // check if redisEmtry is older than 1 day
  let olderThenOneDay = false;
  if (redisEntryMeta.length == 1) {
    const now = new Date().getTime();
    metaDataRD5 = JSON.parse(redisEntryMeta[0].body);
    const redisEntryAge = now - metaDataRD5.modified;
    olderThenOneDay = redisEntryAge > 24 * 60 * 60 * 1000;
  }
  // if redisEntry for metadata not exists get data from github and store data to redis
  if (redisEntryMeta.length == 0 || olderThenOneDay) {
    const metaUrl = `${baseUrlRD5}meta/meta.json`;
    const metaResponse = await axios.get(metaUrl);
    const rMetaData = metaResponse.data;
    if (rMetaData.error) {
      throw new RKIError(rMetaData.error, metaResponse.config.url);
    }
    metaDataRD5 = rMetaData;
    // prepare for redis
    const metaRedis = JSON.stringify(metaDataRD5);
    let validForSec = 0;
    if (olderThenOneDay) {
      const oldMetaData: MetaData = JSON.parse(redisEntryMeta[0].body);
      const oldModified = oldMetaData.modified;
      const newModified = metaDataRD5.modified;
      newModified > oldModified;
      if (newModified > oldModified) {
        const validToMs = AddDaysToDate(
          new Date(metaDataRD5.modified),
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
      const validToMs = AddDaysToDate(
        new Date(metaDataRD5.modified),
        1
      ).setHours(3, 0, 0, 0);
      // calculate the seconds from now to validTo
      // if Math.ceil((validToMs - new Date().getTime()) / 1000) < 0 then set validForSec to 3600 () (one more hour to wait for Updates)
      validForSec =
        Math.ceil((validToMs - new Date().getTime()) / 1000) > 0
          ? Math.ceil((validToMs - new Date().getTime()) / 1000)
          : 3600;
    }
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "metaRD5",
      metaRedis,
      validForSec,
      "json"
    );
  } else {
    metaDataRD5 = JSON.parse(redisEntryMeta[0].body);
  }
  return metaDataRD5;
}

export async function getData(
  metaData: MetaData,
  whatToLoad: Files,
  base = baseUrl
) {
  let result;
  let newerDataAvail = false;

  // remove .xz extension from filename for rediskey
  const redisKey = whatToLoad.split(".").slice(0, -1).join(".");

  // check if a redis entry exists, if yes use it
  // get redisKey from redis
  const redisEntry = await GetRedisEntry(redisClientBas, redisKey);

  // if length == 1 (entry exists)
  if (redisEntry.length == 1) {
    // parse json data
    result = JSON.parse(redisEntry[0].body, dateReviver);

    // compare redis.modified to meta.modified
    const oldModified = result.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }

  // if redisEntry not exists or new data is avail get data from github und store data to redis
  if (redisEntry.length == 0 || newerDataAvail) {
    const url = `${base}${whatToLoad}`;

    // request data
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;

    // error check
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }

    // decompress lzma compressed data (files are xz compressed)
    const decomp = await new Promise((resolve) =>
      lzma.decompress(rdata, undefined, (result) => resolve(result))
    );

    // parse json data
    result = {
      data: JSON.parse(decomp.toString(), dateReviver),
      metaData: metaData,
    };

    // prepare data for redis
    const redisResult = JSON.stringify(result);

    // create redis Entry
    await AddRedisEntry(
      redisClientBas,
      redisKey,
      redisResult,
      neverExpire,
      "json"
    );
  }

  // return requested data
  return result;
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
