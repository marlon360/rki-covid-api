import {
  getDateBefore,
  getStateAbbreviationById,
  getStatesCasesJson,
  getStatesCasesHistoryJson,
  getStatesAgeGroupJson,
  MetaData,
} from "../utils";
import { AgeGroupData } from "./germany";
import { ResponseData } from "./response-data";

export interface IStateData {
  id: number;
  name: string;
  population: number;
  cases: number;
  deaths: number;
  recovered: number;
  casesPerWeek: number;
  deathsPerWeek: number;
}

export async function getStatesData(
  metaData: MetaData
): Promise<ResponseData<IStateData[]>> {
  const json = await getStatesCasesJson(metaData);
  const states = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      population: state.population,
      cases: state.accuCases,
      deaths: state.accuDeaths,
      recovered: state.accuRecovered,
      casesPerWeek: state.accuCasesPerWeek,
      deathsPerWeek: state.accuDeathsPerWeek,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getStatesNewRecovered(
  metaData: MetaData
): Promise<ResponseData<{ id: number; recovered: number }[]>> {
  const json = await getStatesCasesJson(metaData);
  const states = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      recovered: state.newRecovered,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getStatesNewCases(
  metaData: MetaData
): Promise<ResponseData<{ id: number; cases: number }[]>> {
  const json = await getStatesCasesJson(metaData);
  const states = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      cases: state.newCases,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getStatesNewDeaths(
  metaData: MetaData
): Promise<ResponseData<{ id: number; deaths: number }[]>> {
  const json = await getStatesCasesJson(metaData);
  const states = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      deaths: state.newDeaths,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getStatesCasesHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; cases: number; date: Date }[]>
> {
  const json = await getStatesCasesHistoryJson(metaData);
  let history: {
    id: number;
    name: string;
    cases: number;
    date: Date;
  }[] = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      cases: state.cases,
      date: new Date(state.Meldedatum),
    };
  });
  if (id) {
    history = history.filter((entry) => entry.id == id);
  } else {
    history = history.filter((entry) => entry.id != 0);
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getStatesDeathsHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; deaths: number; date: Date }[]>
> {
  const json = await getStatesCasesHistoryJson(metaData);
  let history: {
    id: number;
    name: string;
    deaths: number;
    date: Date;
  }[] = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      deaths: state.deaths,
      date: new Date(state.Meldedatum),
    };
  });
  if (id) {
    history = history.filter((entry) => entry.id == id);
  } else {
    history = history.filter((entry) => entry.id != 0);
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getStatesRecoveredHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; recovered: number; date: Date }[]>
> {
  let json = await getStatesCasesHistoryJson(metaData);
  let history: {
    id: number;
    name: string;
    recovered: number;
    date: Date;
  }[] = json.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      recovered: state.recovered,
      date: new Date(state.Meldedatum),
    };
  });
  if (id) {
    history = history.filter((entry) => entry.id == id);
  } else {
    history = history.filter((entry) => entry.id != 0);
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export interface AgeGroupsData {
  [key: string]: {
    [key: string]: AgeGroupData;
  };
}

export async function getStatesAgeGroups(
  metaData: MetaData,
  id?: number
): Promise<ResponseData<AgeGroupsData>> {
  const json = await getStatesAgeGroupJson(metaData);
  const states: AgeGroupsData = {};
  json.data.forEach((entry) => {
    if (!parseInt(entry.IdBundesland)) return;
    if (id && parseInt(entry.IdBundesland) != id) return;
    const abbreviation = getStateAbbreviationById(parseInt(entry.IdBundesland));
    if (!states[abbreviation]) states[abbreviation] = {};
    states[abbreviation][entry.Altersgruppe] = {
      casesMale: entry.casesMale,
      casesFemale: entry.casesFemale,
      deathsMale: entry.deathsMale,
      deathsFemale: entry.deathsFemale,
      casesMalePer100k: entry.casesMalePer100k,
      casesFemalePer100k: entry.casesFemalePer100k,
      deathsMalePer100k: entry.deathsMalePer100k,
      deathsFemalePer100k: entry.deathsFemalePer100k,
    };
  });

  return {
    data: states,
    lastUpdate: new Date(json.metaData.modified),
  };
}
