import { IResponseMeta, ResponseMeta } from "./meta";
import { ResponseData } from "../data-requests/response-data";
import {
  getDistrictsData,
  getNewDistrictCases,
  getNewDistrictDeaths,
  IDistrictData,
  getLastDistrictCasesHistory,
  getLastDistrictDeathsHistory,
  getLastDistrictRecoveredHistory,
  getDistrictsRecoveredData,
  getNewDistrictRecovered,
} from "../data-requests/districts";
import {
  AddDaysToDate,
  getStateAbbreviationByName,
  fill0CasesDays,
  RequestType,
  RegionType,
} from "../utils";
import {
  DistrictsFrozenIncidenceData,
  getDistrictsFrozenIncidenceHistory,
} from "../data-requests/frozen-incidence";

interface DistrictData extends IDistrictData {
  stateAbbreviation: string;
  weekIncidence: number;
  casesPer100k: number;
  recovered: number;
  delta: {
    cases: number;
    deaths: number;
    recovered: number;
  };
}

interface DistrictsData extends IResponseMeta {
  data: {
    [key: string]: DistrictData;
  };
}

export async function DistrictsResponse(ags?: string): Promise<DistrictsData> {
  // make all requests
  const [
    districtsData,
    districtsRecoveredData,
    districtNewCasesData,
    districtNewDeathsData,
    districtNewRecoveredData,
  ] = await Promise.all([
    getDistrictsData(),
    getDistrictsRecoveredData(),
    getNewDistrictCases(),
    getNewDistrictDeaths(),
    getNewDistrictRecovered(),
  ]);

  function getDistrictByAgs(
    data: ResponseData<any[]>,
    ags: string
  ): any | null {
    for (const district of data.data) {
      if (district.ags == ags) return district;
    }
    return null;
  }

  let districts = districtsData.data.map((district) => {
    return {
      ...district,
      stateAbbreviation: getStateAbbreviationByName(district.state),
      recovered:
        getDistrictByAgs(districtsRecoveredData, district.ags)?.recovered ?? 0,
      weekIncidence: (district.casesPerWeek / district.population) * 100000,
      casesPer100k: (district.cases / district.population) * 100000,
      delta: {
        cases: getDistrictByAgs(districtNewCasesData, district.ags)?.cases ?? 0,
        deaths:
          getDistrictByAgs(districtNewDeathsData, district.ags)?.deaths ?? 0,
        recovered:
          getDistrictByAgs(districtNewRecoveredData, district.ags)?.recovered ??
          0,
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
interface DistrictsHistoryData<T> extends IResponseMeta {
  data: T;
}

interface DistrictsCasesHistory {
  [key: string]: DistrictHistory<{ cases: number; date: Date }>;
}
export async function DistrictsCasesHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsCasesHistory>> {
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  if (!ags && days) {
    // if ags is not defined restrict days to 336
    days = Math.min(days, 336);
  } else if (!ags) {
    days = 336;
  }
  const districtsHistoryData = await getLastDistrictCasesHistory(days, ags);
  const highDate = AddDaysToDate(districtsHistoryData.lastUpdate, -1); //highest date, if all datasets are actual, this is yesterday!
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
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  // add 6 days to calculate week incidence
  if (days) {
    days += 6;
  }

  const districtsHistoryData = await DistrictsCasesHistoryResponse(days, ags);
  const districtsData = await getDistrictsData();

  function getDistrictByAGS(
    data: ResponseData<IDistrictData[]>,
    ags: string
  ): IDistrictData | null {
    for (const district of data.data) {
      if (district.ags == ags) return district;
    }
    return null;
  }

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
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  if (!ags && days) {
    // if ags is not defined restrict days to 330
    days = Math.min(days, 330);
  } else if (!ags) {
    days = 330;
  }
  const districtsHistoryData = await getLastDistrictDeathsHistory(days, ags);
  const highDate = AddDaysToDate(districtsHistoryData.lastUpdate, -1); //highest date, if all datasets are actual, this is yesterday!
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
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  if (!ags && days) {
    // if ags is not defined restrict days to 330
    days = Math.min(days, 330);
  } else if (!ags) {
    days = 330;
  }
  const districtsHistoryData = await getLastDistrictRecoveredHistory(days, ags);
  const highDate = AddDaysToDate(districtsHistoryData.lastUpdate, -1); //highest date, witch is "datenstand" -1
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
    [key: string]: DistrictsFrozenIncidenceData;
  };
}

export async function FrozenIncidenceHistoryResponse(
  days?: number,
  ags?: string
): Promise<FrozenIncidenceHistoryData> {
  const frozenIncidenceHistoryData = await getDistrictsFrozenIncidenceHistory(
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
