import { IResponseMeta, ResponseMeta } from "./meta";
import { ResponseData } from "../data-requests/response-data";
import {
  getDistrictsData,
  getDistrictsNewCases,
  getDistrictsNewDeaths,
  getDistrictsNewRecovered,
  IDistrictData,
  getDistrictsCasesHistory,
  getDistrictsDeathsHistory,
  getDistrictsRecoveredHistory,
  getDistrictsIncidenceHistory,
  getDistrictsAgeGroups,
} from "../data-requests/districts";
import {
  AddDaysToDate,
  getStateAbbreviationByName,
  limit,
  getMetaData,
} from "../utils";
import {
  FrozenIncidenceData,
  getDistrictsFrozenIncidenceHistory,
} from "../data-requests/frozen-incidence";
import { AgeGroupsData } from "../data-requests/states";

interface DistrictData extends IDistrictData {
  stateAbbreviation: string;
  weekIncidence: number;
  casesPer100k: number;
  recovered: number;
  delta: {
    cases: number;
    deaths: number;
    recovered: number;
    weekIncidence: number;
  };
}

interface DistrictsData extends IResponseMeta {
  data: {
    [key: string]: DistrictData;
  };
}

export function getDistrictByAGS(
  data: ResponseData<any[]>,
  ags: string
): any | null {
  for (const district of data.data) {
    if (district.ags == ags) return district;
  }
  return null;
}

export async function DistrictsResponse(ags?: string): Promise<DistrictsData> {
  const metaData = await getMetaData();
  // make all requests
  const [
    districtsData,
    districtsNewCases,
    districtsNewDeaths,
    districtsNewRecovered,
    districtsFixIncidence,
  ] = await Promise.all([
    getDistrictsData(metaData),
    getDistrictsNewCases(metaData),
    getDistrictsNewDeaths(metaData),
    getDistrictsNewRecovered(metaData),
    getDistrictsFrozenIncidenceHistory(metaData, 7),
  ]);

  const yesterdayDate = new Date(
    AddDaysToDate(districtsData.lastUpdate, -1).setHours(0, 0, 0, 0)
  );

  let districts = districtsData.data.map((district) => {
    const districtFixHistory = districtsFixIncidence.data.find(
      (fixEntry) => fixEntry.ags == district.ags
    ).history;
    const yesterdayIncidence = districtFixHistory.find(
      (entry) => entry.date.getTime() == yesterdayDate.getTime()
    ).weekIncidence;
    return {
      ...district,
      stateAbbreviation: getStateAbbreviationByName(district.state),
      weekIncidence: (district.casesPerWeek / district.population) * 100000,
      casesPer100k: (district.cases / district.population) * 100000,
      delta: {
        cases: getDistrictByAGS(districtsNewCases, district.ags)?.cases ?? 0,
        deaths: getDistrictByAGS(districtsNewDeaths, district.ags)?.deaths ?? 0,
        recovered:
          getDistrictByAGS(districtsNewRecovered, district.ags)?.recovered ?? 0,
        weekIncidence: limit(
          (district.casesPerWeek / district.population) * 100000 -
            yesterdayIncidence,
          12
        ),
      },
    };
  });

  if (ags) {
    districts = districts.filter((districts) => {
      return districts.ags == ags;
    });
  }

  const districtsKey = {};
  for (const district of districts) {
    districtsKey[district.ags] = district;
  }

  return {
    data: districtsKey,
    meta: new ResponseMeta(districtsData.lastUpdate),
  };
}

interface DistrictHistory<T> {
  ags: string;
  name: string;
  history: T[];
}

interface DistrictHistoryByDate<T> {
  [date: string]: T[];
}

export interface DistrictsHistoryData<T> extends IResponseMeta {
  data: T;
}

export interface DistrictsCasesHistory {
  [key: string]: DistrictHistory<{ cases: number; date: Date }>;
}

export async function DistrictsCasesHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsCasesHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }

  const metaData = await getMetaData();
  const historyData = await getDistrictsCasesHistory(metaData, days, ags);
  const data: DistrictsCasesHistory = {};
  for (const history of historyData.data) {
    if (!data[history.ags]) {
      data[history.ags] = {
        ags: history.ags,
        name: history.name,
        history: [],
      };
    }
    data[history.ags].history.push({
      cases: history.cases,
      date: history.date,
    });
  }
  return {
    data,
    meta: new ResponseMeta(historyData.lastUpdate),
  };
}

interface DistrictsWeekIncidenceHistory {
  [key: string]: DistrictHistory<{ weekIncidence: number; date: Date }>;
}

export async function DistrictsWeekIncidenceHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsWeekIncidenceHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const metaData = await getMetaData();
  const historyData = await getDistrictsIncidenceHistory(metaData, days, ags);

  const data: DistrictsWeekIncidenceHistory = {};

  for (const history of historyData.data) {
    if (!data[history.ags]) {
      data[history.ags] = {
        ags: history.ags,
        name: history.name,
        history: [],
      };
    }
    data[history.ags].history.push({
      weekIncidence: history.incidence,
      date: history.date,
    });
  }

  return {
    data,
    meta: new ResponseMeta(historyData.lastUpdate),
  };
}

interface DistrictsIncidenceHistoryByDate {
  [dateKey: string]: {
    ags: string;
    name: string;
    weekIncidence: number;
  }[];
}

export async function DistrictsIncidenceHistoryByDate(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsIncidenceHistoryByDate>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const metaData = await getMetaData();
  const historyData = await getDistrictsIncidenceHistory(metaData, days, ags);

  const data: DistrictsIncidenceHistoryByDate = {};

  for (const history of historyData.data) {
    const dateKey = history.date.toISOString()
    if (!data[dateKey]) {
      data[dateKey] = [];
    }
    data[dateKey].push({ags: history.ags, name: history.name, weekIncidence: history.incidence});
  }

  return {
    data,
    meta: new ResponseMeta(historyData.lastUpdate),
  };
}

interface DistrictsDeathsHistory {
  [key: string]: DistrictHistory<{ deaths: number; date: Date }>;
}

export async function DistrictsDeathsHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsDeathsHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const metaData = await getMetaData();
  const historyData = await getDistrictsDeathsHistory(metaData, days, ags);

  const data: DistrictsDeathsHistory = {};

  for (const history of historyData.data) {
    if (!data[history.ags]) {
      data[history.ags] = {
        ags: history.ags,
        name: history.name,
        history: [],
      };
    }
    data[history.ags].history.push({
      deaths: history.deaths,
      date: history.date,
    });
  }

  return {
    data,
    meta: new ResponseMeta(historyData.lastUpdate),
  };
}

interface DistrictsRecoveredHistory {
  [key: string]: DistrictHistory<{ recovered: number; date: Date }>;
}
export async function DistrictsRecoveredHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsRecoveredHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const metaData = await getMetaData();
  const historyData = await getDistrictsRecoveredHistory(metaData, days, ags);

  const data: DistrictsRecoveredHistory = {};

  for (const history of historyData.data) {
    if (!data[history.ags]) {
      data[history.ags] = {
        ags: history.ags,
        name: history.name,
        history: [],
      };
    }
    data[history.ags].history.push({
      recovered: history.recovered,
      date: history.date,
    });
  }

  return {
    data,
    meta: new ResponseMeta(historyData.lastUpdate),
  };
}

interface FrozenIncidenceHistoryData extends IResponseMeta {
  data: {
    [key: string]: FrozenIncidenceData;
  };
}

export async function FrozenIncidenceHistoryResponse(
  days?: number,
  ags?: string
): Promise<FrozenIncidenceHistoryData> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const metaData = await getMetaData();
  const frozenIncidenceHistoryData = await getDistrictsFrozenIncidenceHistory(
    metaData,
    days,
    ags
  );

  let data = {};
  frozenIncidenceHistoryData.data.forEach((historyData) => {
    data[historyData.ags] = historyData;
  });

  return {
    data: data,
    meta: new ResponseMeta(frozenIncidenceHistoryData.lastUpdate),
  };
}

export async function DistrictsAgeGroupsResponse(ags?: string): Promise<{
  data: AgeGroupsData;
  meta: ResponseMeta;
}> {
  const metaData = await getMetaData();
  const AgeGroupsData = await getDistrictsAgeGroups(metaData, ags);

  const data = {};
  Object.keys(AgeGroupsData.data).forEach((ags) => {
    data[ags] = {
      ...AgeGroupsData.data[ags],
    };
    Object.keys(AgeGroupsData.data[ags]).forEach((ageGroup) => {
      data[ags][ageGroup] = {
        ...AgeGroupsData.data[ags][ageGroup],
      };
    });
  });

  return {
    data: data,
    meta: new ResponseMeta(AgeGroupsData.lastUpdate),
  };
}
