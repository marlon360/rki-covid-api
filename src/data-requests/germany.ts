import { ResponseData } from "./response-data";
import {
  getDateBefore,
  getStatesCasesJson,
  getStatesHistoryJson,
  getStatesAgeGroupJson,
  MetaData,
} from "../utils";

export async function getGermanyCases(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json = await getStatesCasesJson(metaData);
  return {
    data: json.data[0].accuCases,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyNewCases(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json = await getStatesCasesJson(metaData);
  return {
    data: json.data[0].newCases,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyCasesHistory(
  metaData: MetaData,
  days?: number
): Promise<{ history: { cases: number; date: Date }[]; lastUpdate: Date }> {
  const json = await getStatesHistoryJson(metaData);
  let history = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        cases: state.c,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    history: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyDeathsHistory(
  metaData: MetaData,
  days?: number
): Promise<{ history: { deaths: number; date: Date }[]; lastUpdate: Date }> {
  const json = await getStatesHistoryJson(metaData);
  let history = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        deaths: state.d,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    history: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyRecoveredHistory(
  metaData: MetaData,
  days?: number
): Promise<{ history: { recovered: number; date: Date }[]; lastUpdate: Date }> {
  const json = await getStatesHistoryJson(metaData);
  let history = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        recovered: state.r,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    history: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyDeaths(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json = await getStatesCasesJson(metaData);
  return {
    data: json.data[0].accuDeaths,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyNewDeaths(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json = await getStatesCasesJson(metaData);
  return {
    data: json.data[0].newDeaths,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyRecovered(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json = await getStatesCasesJson(metaData);
  return {
    data: json.data[0].accuRecovered,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyNewRecovered(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json = await getStatesCasesJson(metaData);
  return {
    data: json.data[0].newRecovered,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export interface AgeGroupData {
  casesMale: number;
  casesFemale: number;
  deathsMale: number;
  deathsFemale: number;
  casesMalePer100k: number;
  casesFemalePer100k: number;
  deathsMalePer100k: number;
  deathsFemalePer100k: number;
}

export async function getGermanyAgeGroups(
  metaData: MetaData
): Promise<ResponseData<{ [ageGroup: string]: AgeGroupData }>> {
  const json = await getStatesAgeGroupJson(metaData);
  let germany_data: { [ageGroup: string]: AgeGroupData } = {};
  json.data.forEach((entry) => {
    if (entry.Altersgruppe == "unbekannt") return;
    // germany has BundeslandId=0
    if (parseInt(entry.IdBundesland) === 0) {
      germany_data[entry.Altersgruppe] = {
        casesMale: entry.casesMale,
        casesFemale: entry.casesFemale,
        deathsMale: entry.deathsMale,
        deathsFemale: entry.deathsFemale,
        casesMalePer100k: entry.casesMalePer100k,
        casesFemalePer100k: entry.casesFemalePer100k,
        deathsMalePer100k: entry.deathsMalePer100k,
        deathsFemalePer100k: entry.deathsFemalePer100k,
      };
    }
  });
  return {
    data: germany_data,
    lastUpdate: new Date(json.metaData.modified),
  };
}
