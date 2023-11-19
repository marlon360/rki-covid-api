import {
  getDateBefore,
  getCasesDistrictsJson,
  getCasesHistoryDistrictsJson,
  getAgeGroupDistrictsJson,
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
  casesPerWeek: number;
  deathsPerWeek: number;
}

export async function getDistrictsData(
  metaData: MetaData
): Promise<ResponseData<IDistrictData[]>> {
  const data = await getCasesDistrictsJson(metaData);

  const districts = data.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      name: LK_Names.names[district.Landkreis].GEN,
      county: district.Landkreis,
      state: district.Bundesland,
      population: district.population,
      cases: district.accuCases,
      deaths: district.accuDeaths,
      casesPerWeek: district.accuCasesPerWeek,
      deathsPerWeek: district.accuDeathsPerWeek,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getDistrictsRecoveredData(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; recovered: number }[]>> {
  let data = await getCasesDistrictsJson(metaData);
  const districts = data.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      recovered: district.accuRecovered,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewDistrictCases(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; cases: number }[]>> {
  let data = await getCasesDistrictsJson(metaData);

  const districts = data.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      cases: district.newCases,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewDistrictDeaths(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; deaths: number }[]>> {
  let data = await getCasesDistrictsJson(metaData);

  const districts = data.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      deaths: district.newDeaths,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getNewDistrictRecovered(
  metaData: MetaData
): Promise<ResponseData<{ ags: string; recovered: number }[]>> {
  let data = await getCasesDistrictsJson(metaData);

  const districts = data.data.map((district) => {
    return {
      ags: district.IdLandkreis,
      recovered: district.newRecovered,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastDistrictCasesHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; cases: number; date: Date }[]>
> {
  let data = await getCasesHistoryDistrictsJson(metaData);

  let history: {
    ags: string;
    name: string;
    cases: number;
    date: Date;
  }[] = data.data.map((district) => {
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
  return {
    data: history,
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastDistrictDeathsHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; deaths: number; date: Date }[]>
> {
  let data = await getCasesHistoryDistrictsJson(metaData);

  let history: {
    ags: string;
    name: string;
    deaths: number;
    date: Date;
  }[] = data.data.map((district) => {
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
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getLastDistrictRecoveredHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; recovered: number; date: Date }[]>
> {
  let data = await getCasesHistoryDistrictsJson(metaData);

  let history: {
    ags: string;
    name: string;
    recovered: number;
    date: Date;
  }[] = data.data.map((district) => {
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
    lastUpdate: new Date(data.metaData.modified),
  };
}

export async function getDistrictsAgeGroups(
  metaData: MetaData,
  paramAgs?: string
): Promise<ResponseData<AgeGroupsData>> {
  let data = await getAgeGroupDistrictsJson(metaData);
  const lastUpdate = new Date(metaData.modified);
  if (paramAgs) paramAgs = paramAgs.padStart(5, "0");
  const districts: AgeGroupsData = {};
  data.data.forEach((entry) => {
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
    lastUpdate,
  };
}
