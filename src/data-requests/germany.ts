import { ResponseData } from "./response-data";
import {
  getDateBefore,
  getCasesStatesJson,
  getCasesHistoryStatesJson,
  getAgeGroupStatesJson,
} from "../utils";

export async function getCases(): Promise<ResponseData<number>> {
  const data = await getCasesStatesJson();
  return {
    data: data.data[0].accuCases,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewCases(): Promise<ResponseData<number>> {
  const data  = await getCasesStatesJson();
  return {
    data: data.data[0].newCases,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastCasesHistory(
  days?: number
): Promise<{ history: { cases: number; date: Date }[]; lastUpdate: Date }> {
  const data = await getCasesHistoryStatesJson();
  let history = data.data
    .filter((state) => state.IdBundesland == "00")
    .map((state) => {
      return {
        cases: state.cases,
        date: new Date(state.Meldedatum),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    history: history,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastDeathsHistory(
  days?: number
): Promise<{ history: { deaths: number; date: Date }[]; lastUpdate: Date }> {
  const data = await getCasesHistoryStatesJson();
  let history = data.data
    .filter((state) => state.IdBundesland == "00")
    .map((state) => {
      return {
        deaths: state.deaths,
        date: new Date(state.Meldedatum),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    history: history,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastRecoveredHistory(
  days?: number
): Promise<{ history: { recovered: number; date: Date }[]; lastUpdate: Date }> {
  const data = await getCasesHistoryStatesJson();
  let history = data.data
    .filter((state) => state.IdBundesland == "00")
    .map((state) => {
      return {
        recovered: state.recovered,
        date: new Date(state.Meldedatum),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    history: history,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getDeaths(): Promise<ResponseData<number>> {
  const data = await getCasesStatesJson();
  return {
    data: data.data[0].accuDeaths,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewDeaths(): Promise<ResponseData<number>> {
  const data = await getCasesStatesJson();
  return {
    data: data.data[0].newDeaths,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getRecovered(): Promise<ResponseData<number>> {
  const data = await getCasesStatesJson();
  return {
    data: data.data[0].accuRecovered,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewRecovered(): Promise<ResponseData<number>> {
  const data = await getCasesStatesJson();
  return {
    data: data.data[0].newRecovered,
    lastUpdate: new Date(data.metaData.modified),
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

export async function getGermanyAgeGroups(): Promise<
  ResponseData<{ [ageGroup: string]: AgeGroupData }>
> {
  const data = await getAgeGroupStatesJson();
  const lastUpdate = new Date(data.metaData.modified);
  let germany_data: { [ageGroup: string]: AgeGroupData } = {};
  data.data.forEach((entry) => {
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
    lastUpdate,
  };
}
