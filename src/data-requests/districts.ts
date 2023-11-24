import {
  getDateBefore,
  getDistrictsCasesJson,
  getDistrictsCasesHistoryJson,
  getDistrictsAgeGroupJson,
  MetaData,
} from "../utils";
import { ResponseData } from "./response-data";
import { AgeGroupsData } from "./states";
import LK_Names from "../configuration/LK_Names.json";

export interface IDistrictData {
  ags: string;
  name: string;
  county: string;
  state: string;
  population: number;
  cases: number;
  deaths: number;
  recovered: number;
  casesPerWeek: number;
  deathsPerWeek: number;
}

export async function getDistrictsData(
  metaData: MetaData
): Promise<ResponseData<IDistrictData[]>> {
  const json = await getDistrictsCasesJson(metaData);
  const districts = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      name: LK_Names.names[district.Landkreis].GEN,
      county: district.Landkreis,
      state: district.Bundesland,
      population: district.population,
      cases: district.accuCases,
      deaths: district.accuDeaths,
      recovered: district.accuRecovered,
      casesPerWeek: district.accuCasesPerWeek,
      deathsPerWeek: district.accuDeathsPerWeek,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsNewCases(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; cases: number }[]>> {
  let json = await getDistrictsCasesJson(metaData);
  const districts = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      cases: district.newCases,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsNewDeaths(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; deaths: number }[]>> {
  let json = await getDistrictsCasesJson(metaData);
  const districts = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      deaths: district.newDeaths,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsNewRecovered(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; recovered: number }[]>> {
  let json = await getDistrictsCasesJson(metaData);
  const districts = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      recovered: district.newRecovered,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsCasesHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; cases: number; date: Date }[]>
> {
  const start = new Date().getTime();
  let json = await getDistrictsCasesHistoryJson(metaData);
  let history: {
    ags: string;
    name: string;
    cases: number;
    date: Date;
  }[] = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      name: district.Landkreis,
      cases: district.cases,
      date: new Date(district.Meldedatum),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  const end = new Date().getTime();
  const logtime = new Date().toISOString().substring(0, 19);
  console.log(`${logtime}: districts get cases history json data time: ${(end - start) / 1000} seconds`)
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsDeathsHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; deaths: number; date: Date }[]>
> {
  let json = await getDistrictsCasesHistoryJson(metaData);
  let history: {
    ags: string;
    name: string;
    deaths: number;
    date: Date;
  }[] = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      name: district.Landkreis,
      deaths: district.deaths,
      date: new Date(district.Meldedatum),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsRecoveredHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; recovered: number; date: Date }[]>
> {
  let json = await getDistrictsCasesHistoryJson(metaData);
  let history: {
    ags: string;
    name: string;
    recovered: number;
    date: Date;
  }[] = json.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      name: district.Landkreis,
      recovered: district.recovered,
      date: new Date(district.Meldedatum),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getDistrictsAgeGroups(
  metaData: MetaData,
  paramAgs?: string
): Promise<ResponseData<AgeGroupsData>> {
  let json = await getDistrictsAgeGroupJson(metaData);
  if (paramAgs) paramAgs = paramAgs.padStart(5, "0");
  const districts: AgeGroupsData = {};
  json.data.forEach((entry) => {
    const ags = entry.IdLandkreis;
    if (paramAgs && paramAgs != ags) return;
    if (!districts[ags]) districts[ags] = {};
    districts[ags][entry.Altersgruppe] = {
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
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}
