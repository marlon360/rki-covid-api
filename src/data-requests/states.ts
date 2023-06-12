import {
  getDateBefore,
  getStateAbbreviationById,
  getCasesStatesJson,
  getCasesHistoryStatesJson,
  CasesHistoryStatesJson,
  getAgeGroupStatesJson,
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
  casesPerWeek: number;
  deathsPerWeek: number;
}

export async function getStatesData(
  metaData: MetaData
): Promise<ResponseData<IStateData[]>> {
  const data = await getCasesStatesJson(metaData);
  const states = data.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      population: state.population,
      cases: state.accuCases,
      deaths: state.accuDeaths,
      casesPerWeek: state.accuCasesPerWeek,
      deathsPerWeek: state.accuDeathsPerWeek,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getStatesRecoveredData(
  metaData: MetaData
): Promise<ResponseData<{ id: number; recovered: number }[]>> {
  const data = await getCasesStatesJson(metaData);
  const states = data.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      recovered: state.accuRecovered,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewStateRecovered(
  metaData: MetaData
): Promise<ResponseData<{ id: number; recovered: number }[]>> {
  const data = await getCasesStatesJson(metaData);
  const states = data.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      recovered: state.newRecovered,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewStateCases(
  metaData: MetaData
): Promise<ResponseData<{ id: number; cases: number }[]>> {
  const data = await getCasesStatesJson(metaData);
  const states = data.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      cases: state.newCases,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewStateDeaths(
  metaData: MetaData
): Promise<ResponseData<{ id: number; deaths: number }[]>> {
  const data = await getCasesStatesJson(metaData);
  const states = data.data.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      deaths: state.newDeaths,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastStateCasesHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; cases: number; date: Date }[]>
> {
  const data = await getCasesHistoryStatesJson(metaData);
  let historyData: CasesHistoryStatesJson["data"];
  if (id) {
    historyData = data.data.filter(
      (state) => parseInt(state.IdBundesland) == id
    );
  } else {
    historyData = data.data.filter((state) => state.IdBundesland != "00");
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    historyData = historyData.filter(
      (dates) => dates.Meldedatum >= reference_date
    );
  }
  const history: {
    id: number;
    name: string;
    cases: number;
    date: Date;
  }[] = historyData.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      cases: state.cases,
      date: new Date(state.Meldedatum),
    };
  });

  return {
    data: history,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastStateDeathsHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; deaths: number; date: Date }[]>
> {
  const data = await getCasesHistoryStatesJson(metaData);
  let historyData: CasesHistoryStatesJson["data"];
  if (id) {
    historyData = data.data.filter(
      (state) => parseInt(state.IdBundesland) == id
    );
  } else {
    historyData = data.data.filter((state) => state.IdBundesland != "00");
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    historyData = historyData.filter(
      (dates) => dates.Meldedatum >= reference_date
    );
  }
  const history: {
    id: number;
    name: string;
    deaths: number;
    date: Date;
  }[] = historyData.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      deaths: state.deaths,
      date: new Date(state.Meldedatum),
    };
  });

  return {
    data: history,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastStateRecoveredHistory(
  metaData: MetaData,
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; recovered: number; date: Date }[]>
> {
  const data = await getCasesHistoryStatesJson(metaData);
  let historyData: CasesHistoryStatesJson["data"];
  if (id) {
    historyData = data.data.filter(
      (state) => parseInt(state.IdBundesland) == id
    );
  } else {
    historyData = data.data.filter((state) => state.IdBundesland != "00");
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    historyData = historyData.filter(
      (dates) => dates.Meldedatum >= reference_date
    );
  }
  const history: {
    id: number;
    name: string;
    recovered: number;
    date: Date;
  }[] = historyData.map((state) => {
    return {
      id: parseInt(state.IdBundesland),
      name: state.Bundesland,
      recovered: state.recovered,
      date: new Date(state.Meldedatum),
    };
  });

  return {
    data: history,
    lastUpdate: new Date(data.metaData.modified),
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
  const data = await getAgeGroupStatesJson(metaData);
  const lastUpdate = new Date(metaData.modified);

  const states: AgeGroupsData = {};
  data.data.forEach((entry) => {
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
    lastUpdate,
  };
}
