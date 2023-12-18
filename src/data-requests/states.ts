import {
  getDateBefore,
  getStateAbbreviationById,
  getData,
  MetaData,
  Files,
} from "../utils";
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

export interface IStateDataFile {
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

export async function getStatesData(
  metaData: MetaData
): Promise<ResponseData<IStateData[]>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  const states: IStateData[] = json.data.map((state) => {
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

interface S_NewRecovered {
  id: number;
  recovered: number;
}

export async function getStatesNewRecovered(
  metaData: MetaData
): Promise<ResponseData<S_NewRecovered[]>> {
  const json: IStateDataFile = await getData(metaData, Files.S_NewRecovered);
  const states: S_NewRecovered[] = json.data.map((state) => {
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

interface S_NewCases {
  id: number;
  cases: number;
}

export async function getStatesNewCases(
  metaData: MetaData
): Promise<ResponseData<S_NewCases[]>> {
  const json: IStateDataFile = await getData(metaData, Files.S_NewCases);
  const states: S_NewCases[] = json.data.map((state) => {
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

interface S_NewDeaths {
  id: number;
  deaths: number;
}

export async function getStatesNewDeaths(
  metaData: MetaData
): Promise<ResponseData<S_NewDeaths[]>> {
  const json: IStateDataFile = await getData(metaData, Files.S_NewDeaths);
  const states: S_NewDeaths[] = json.data.map((state) => {
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

export interface S_CasesHistory {
  id: number;
  name: string;
  cases: number;
  date: Date;
}

export interface S_CasesHistoryFile {
  data: {
    m: Date; // Meldedatum
    i: string; // id Bundesland
    t: string; // Txt Bundesland
    c: number; // Fälle
  }[];
  metaData: MetaData;
}

export async function getStatesCasesHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<ResponseData<S_CasesHistory[]>> {
  const json: S_CasesHistoryFile = await getData(
    metaData,
    Files.S_CasesHistory
  );
  let history: S_CasesHistory[] = json.data.map((state) => {
    return {
      id: parseInt(state.i),
      name: state.t,
      cases: state.c,
      date: new Date(state.m),
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

interface S_DeathsHistory {
  id: number;
  name: string;
  deaths: number;
  date: Date;
}

export interface S_DeathsHistoryFile {
  data: {
    m: Date;
    i: string;
    t: string;
    d: number;
  }[];
  metaData: MetaData;
}

export async function getStatesDeathsHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<ResponseData<S_DeathsHistory[]>> {
  const json: S_DeathsHistoryFile = await getData(
    metaData,
    Files.S_DeathsHistory
  );
  let history: S_DeathsHistory[] = json.data.map((state) => {
    return {
      id: parseInt(state.i),
      name: state.t,
      deaths: state.d,
      date: new Date(state.m),
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

interface S_RecoveredHistory {
  id: number;
  name: string;
  recovered: number;
  date: Date;
}

export interface S_RecoveredHistoryFile {
  data: {
    m: Date;
    i: string;
    t: string;
    r: number;
  }[];
  metaData: MetaData;
}

export async function getStatesRecoveredHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<ResponseData<S_RecoveredHistory[]>> {
  let json: S_RecoveredHistoryFile = await getData(
    metaData,
    Files.S_RecoveredHistory
  );
  let history: S_RecoveredHistory[] = json.data.map((state) => {
    return {
      id: parseInt(state.i),
      name: state.t,
      recovered: state.r,
      date: new Date(state.m),
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

interface S_IncidenceHistory {
  id: number;
  name: string;
  incidence: number;
  date: Date;
}

export interface S_IncidenceHistoryFile {
  data: {
    m: Date;
    i: string;
    t: string;
    c7: number;
    i7: number;
  }[];
  metaData: MetaData;
}

export async function getStatesIncidenceHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<ResponseData<S_IncidenceHistory[]>> {
  let json: S_IncidenceHistoryFile = await getData(
    metaData,
    Files.S_IncidenceHistory
  );
  let history: S_IncidenceHistory[] = json.data.map((state) => {
    return {
      id: parseInt(state.i),
      name: state.t,
      incidence: state.i7,
      date: new Date(state.m),
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

export interface AgeGroupsData {
  [id: string]: {
    [ageGrp: string]: AgeGroupData;
  };
}

export interface S_AgeGrpFile {
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

export async function getStatesAgeGroups(
  metaData: MetaData,
  id?: number
): Promise<ResponseData<AgeGroupsData>> {
  const json: S_AgeGrpFile = await getData(metaData, Files.S_AgeGroups);
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
