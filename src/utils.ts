import axios from "axios";
import zlib from "zlib";
import { redisClientBas } from "./server";

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

interface CasesStatesJson {
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

export async function getCasesStatesJson(
  metaData: MetaData
): Promise<CasesStatesJson> {
  let casesStatesJson: CasesStatesJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryCasesStatesJson = await GetRedisEntry(
    redisClientBas,
    "casesStatesJson"
  );
  if (redisEntryCasesStatesJson.length == 1) {
    casesStatesJson = JSON.parse(
      redisEntryCasesStatesJson[0].body,
      dateReviver
    );
    const oldModified = casesStatesJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryCasesStatesJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}cases/states.json.gz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //unzip data
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    casesStatesJson.data = JSON.parse(unziped.toString(), dateReviver);
    casesStatesJson.metaData = metaData;
    const redisCasesHistoryStates = JSON.stringify(casesStatesJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "casesStatesJson",
      redisCasesHistoryStates,
      neverExpire,
      "json"
    );
  }
  return casesStatesJson;
}

export interface CasesHistoryStatesJson {
  data: {
    Meldedatum: Date;
    IdBundesland: string;
    Bundesland: string;
    cases: number;
    deaths: number;
    Datenstand: Date;
    recovered: number;
  }[];
  metaData: MetaData;
}

export async function getCasesHistoryStatesJson(
  metaData: MetaData
): Promise<CasesHistoryStatesJson> {
  let casesHistoryStatesJson: CasesHistoryStatesJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryCasesHistoryStatesJson = await GetRedisEntry(
    redisClientBas,
    "casesHistoryStatesJson"
  );
  if (redisEntryCasesHistoryStatesJson.length == 1) {
    casesHistoryStatesJson = JSON.parse(
      redisEntryCasesHistoryStatesJson[0].body,
      dateReviver
    );
    const oldModified = casesHistoryStatesJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryCasesHistoryStatesJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}history/states.json.gz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //unzip data
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    casesHistoryStatesJson.data = JSON.parse(unziped.toString(), dateReviver);
    casesHistoryStatesJson.metaData = metaData;
    const redisCasesHistoryStates = JSON.stringify(casesHistoryStatesJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "casesHistoryStatesJson",
      redisCasesHistoryStates,
      neverExpire,
      "json"
    );
  }
  return casesHistoryStatesJson;
}

interface CasesDistrictsJson {
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

export async function getCasesDistrictsJson(
  metaData: MetaData
): Promise<CasesDistrictsJson> {
  let casesDistrictsJson: CasesDistrictsJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryCasesHistoryDistrictsJson = await GetRedisEntry(
    redisClientBas,
    "casesDistrictsJson"
  );
  if (redisEntryCasesHistoryDistrictsJson.length == 1) {
    casesDistrictsJson = JSON.parse(
      redisEntryCasesHistoryDistrictsJson[0].body,
      dateReviver
    );
    const oldModified = casesDistrictsJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryCasesHistoryDistrictsJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}cases/districts.json.gz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //unzip data
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    casesDistrictsJson.data = JSON.parse(unziped.toString(), dateReviver);
    casesDistrictsJson.metaData = metaData;
    const redisCasesDistricts = JSON.stringify(casesDistrictsJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "casesDistrictsJson",
      redisCasesDistricts,
      neverExpire,
      "json"
    );
  }
  return casesDistrictsJson;
}

interface CasesHistoryDistrictsJson {
  data: {
    IdLandkreis: string;
    Meldedatum: Date;
    Landkreis: string;
    cases: number;
    deaths: number;
    Datenstand: Date;
    recovered: number;
  }[];
  metaData: MetaData;
}

export async function getCasesHistoryDistrictsJson(
  metaData: MetaData
): Promise<CasesHistoryDistrictsJson> {
  let casesHistoryDistrictsJson: CasesHistoryDistrictsJson = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryCasesHistoryDistrictsJson = await GetRedisEntry(
    redisClientBas,
    "casesHistoryDistrictsJson"
  );
  if (redisEntryCasesHistoryDistrictsJson.length == 1) {
    casesHistoryDistrictsJson = JSON.parse(
      redisEntryCasesHistoryDistrictsJson[0].body,
      dateReviver
    );
    const oldModified = casesHistoryDistrictsJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryCasesHistoryDistrictsJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}history/districts.json.gz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //unzip data
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    casesHistoryDistrictsJson.data = JSON.parse(
      unziped.toString(),
      dateReviver
    );
    casesHistoryDistrictsJson.metaData = metaData;
    const redisCasesHistoryDistricts = JSON.stringify(
      casesHistoryDistrictsJson
    );
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "casesHistoryDistrictsJson",
      redisCasesHistoryDistricts,
      neverExpire,
      "json"
    );
  }
  return casesHistoryDistrictsJson;
}

interface AgeGroupStates {
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

export async function getAgeGroupStatesJson(
  metaData: MetaData
): Promise<AgeGroupStates> {
  let ageGroupStatesJson: AgeGroupStates = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryAgeGroupStatesJson = await GetRedisEntry(
    redisClientBas,
    "ageGroupStatesJson"
  );
  if (redisEntryAgeGroupStatesJson.length == 1) {
    ageGroupStatesJson = JSON.parse(
      redisEntryAgeGroupStatesJson[0].body,
      dateReviver
    );
    const oldModified = ageGroupStatesJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryAgeGroupStatesJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}agegroup/states.json.gz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //unzip data
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    ageGroupStatesJson.data = JSON.parse(unziped.toString(), dateReviver);
    ageGroupStatesJson.metaData = metaData;
    const redisAgeGroupStatesJson = JSON.stringify(ageGroupStatesJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "ageGroupStatesJson",
      redisAgeGroupStatesJson,
      neverExpire,
      "json"
    );
  }
  return ageGroupStatesJson;
}

interface AgeGroupDistricts {
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

export async function getAgeGroupDistrictsJson(
  metaData: MetaData
): Promise<AgeGroupDistricts> {
  let ageGroupDistrictsJson: AgeGroupDistricts = {
    data: undefined,
    metaData: undefined,
  };
  let newerDataAvail = false;
  // check if a redis entry for cases exists, if yes use it
  const redisEntryAgeGroupDistrictsJson = await GetRedisEntry(
    redisClientBas,
    "ageGroupDistrictsJson"
  );
  if (redisEntryAgeGroupDistrictsJson.length == 1) {
    ageGroupDistrictsJson = JSON.parse(
      redisEntryAgeGroupDistrictsJson[0].body,
      dateReviver
    );
    const oldModified = ageGroupDistrictsJson.metaData.modified;
    const modified = metaData.modified;
    newerDataAvail = modified > oldModified;
  }
  // if redisEntry for cases not exists get data from github und store data to redis
  if (redisEntryAgeGroupDistrictsJson.length == 0 || newerDataAvail) {
    const url = `${baseUrl}agegroup/districts.json.gz`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const rdata = response.data;
    if (rdata.error) {
      throw new RKIError(rdata.error, response.config.url);
    }
    //unzip data
    const unziped = await new Promise((resolve) =>
      zlib.gunzip(rdata, (_, result) => resolve(result))
    );
    // prepare data for redis
    ageGroupDistrictsJson.data = JSON.parse(unziped.toString(), dateReviver);
    ageGroupDistrictsJson.metaData = metaData;
    const redisAgeGroupDistrictsJson = JSON.stringify(ageGroupDistrictsJson);
    // create redis Entry for metaData
    await AddRedisEntry(
      redisClientBas,
      "ageGroupDistrictsJson",
      redisAgeGroupDistrictsJson,
      neverExpire,
      "json"
    );
  }
  return ageGroupDistrictsJson;
}
