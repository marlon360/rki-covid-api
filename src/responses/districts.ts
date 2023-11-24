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
  getDistrictsAgeGroups,
} from "../data-requests/districts";
import {
  AddDaysToDate,
  getStateAbbreviationByName,
  fill0CasesDays,
  RequestType,
  RegionType,
  limit,
  getMetaData,
  MetaData,
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
    getDistrictsFrozenIncidenceHistory(metaData, 3),
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
        deaths:
          getDistrictByAGS(districtsNewDeaths, district.ags)?.deaths ?? 0,
        recovered:
          getDistrictByAGS(districtsNewRecovered, district.ags)?.recovered ??
          0,
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
export interface DistrictsHistoryData<T> extends IResponseMeta {
  data: T;
}

export interface DistrictsCasesHistory {
  [key: string]: DistrictHistory<{ cases: number; date: Date }>;
}
export async function DistrictsCasesHistoryResponse(
  days?: number,
  ags?: string,
  metaData?: MetaData
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
  if (metaData == null) {
    metaData = await getMetaData();
  }
  const districtsHistoryData = await getDistrictsCasesHistory(
    metaData,
    days,
    ags
  );
  const highDate = new Date(
    AddDaysToDate(districtsHistoryData.lastUpdate, -1).setHours(0, 0, 0, 0)
  );
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set
  const data: DistrictsCasesHistory = fill0CasesDays(
    districtsHistoryData,
    lowDate,
    highDate,
    RegionType.districts,
    RequestType.cases
  );
  return {
    data,
    meta: new ResponseMeta(districtsHistoryData.lastUpdate),
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
    } else {
      // add 6 days to calculate week incidence
      days += 6;
    }
  }
  const metaData = await getMetaData();
  const districtsHistoryData = await DistrictsCasesHistoryResponse(
    days,
    ags,
    metaData
  );
  const districtsData = await getDistrictsData(metaData);

  const incidenceData: DistrictsWeekIncidenceHistory = {};

  for (const ags of Object.keys(districtsHistoryData.data)) {
    const districtHistory = districtsHistoryData.data[ags].history;
    const district = getDistrictByAGS(districtsData, ags);

    incidenceData[ags] = {
      ags: district.ags,
      name: district.name,
      history: [],
    };

    for (let i = 6; i < districtHistory.length; i++) {
      const date = districtHistory[i].date;
      let sum = 0;
      for (let dayOffset = i; dayOffset > i - 7; dayOffset--) {
        sum += districtHistory[dayOffset].cases;
      }
      incidenceData[ags].history.push({
        weekIncidence: (sum / district.population) * 100000,
        date: date,
      });
    }
  }

  return {
    data: incidenceData,
    meta: districtsHistoryData.meta,
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
  const districtsHistoryData = await getDistrictsDeathsHistory(
    metaData,
    days,
    ags
  );
  const highDate = new Date(
    AddDaysToDate(districtsHistoryData.lastUpdate, -1).setHours(0, 0, 0, 0)
  );
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set

  const data: DistrictsDeathsHistory = fill0CasesDays(
    districtsHistoryData,
    lowDate,
    highDate,
    RegionType.districts,
    RequestType.deaths
  );

  return {
    data,
    meta: new ResponseMeta(districtsHistoryData.lastUpdate),
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
  const districtsHistoryData = await getDistrictsRecoveredHistory(
    metaData,
    days,
    ags
  );
  const highDate = new Date(
    AddDaysToDate(districtsHistoryData.lastUpdate, -1).setHours(0, 0, 0, 0)
  ); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01

  const data: DistrictsRecoveredHistory = fill0CasesDays(
    districtsHistoryData,
    lowDate,
    highDate,
    RegionType.districts,
    RequestType.recovered
  );

  return {
    data,
    meta: new ResponseMeta(districtsHistoryData.lastUpdate),
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
