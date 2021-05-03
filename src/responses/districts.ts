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
  getDayDifference,
  getStateAbbreviationByName,
} from "../utils";
import {
  FrozenIncidenceData,
  getFrozenIncidenceHistory,
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

  if (ags != null) {
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
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  const statesHistoryData = await getLastDistrictCasesHistory(days, ags);

  const data: DistrictsCasesHistory = {};

  for (const historyData of statesHistoryData.data) {
    if (data[historyData.ags] == null) {
      data[historyData.ags] = {
        ags: historyData.ags,
        name: historyData.name,
        history: [],
      };
    }
    if (data[historyData.ags].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[historyData.ags].history[
            data[historyData.ags].history.length - 1
          ].date
        ) > 1
      ) {
        data[historyData.ags].history.push({
          cases: 0,
          date: AddDaysToDate(
            data[historyData.ags].history[
              data[historyData.ags].history.length - 1
            ].date,
            1
          ),
        });
      }
    }
    data[historyData.ags].history.push({
      cases: historyData.cases,
      date: new Date(historyData.date),
    });
  }
  return {
    data,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

interface DistrictsWeekIncidenceHistory {
  [key: string]: DistrictHistory<{ weekIncidence: number; date: Date }>;
}
export async function DistrictsWeekIncidenceHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsWeekIncidenceHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  // add 6 days to calculate week incidence
  if (days != null) {
    days += 6;
  }

  const statesHistoryData = await getLastDistrictCasesHistory(days, ags);
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

  const data: DistrictsCasesHistory = {};

  for (const historyData of statesHistoryData.data) {
    if (data[historyData.ags] == null) {
      data[historyData.ags] = {
        ags: historyData.ags,
        name: historyData.name,
        history: [],
      };
    }
    if (data[historyData.ags].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[historyData.ags].history[
            data[historyData.ags].history.length - 1
          ].date
        ) > 1
      ) {
        data[historyData.ags].history.push({
          cases: 0,
          date: AddDaysToDate(
            data[historyData.ags].history[
              data[historyData.ags].history.length - 1
            ].date,
            1
          ),
        });
      }
    }
    data[historyData.ags].history.push({
      cases: historyData.cases,
      date: new Date(historyData.date),
    });
  }

  const incidenceData: DistrictsWeekIncidenceHistory = {};

  for (const ags of Object.keys(data)) {
    const districtHistory = data[ags].history;
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
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

interface DistrictsDeathsHistory {
  [key: string]: DistrictHistory<{ deaths: number; date: Date }>;
}
export async function DistrictsDeathsHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsDeathsHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  const statesHistoryData = await getLastDistrictDeathsHistory(days, ags);

  const data: DistrictsDeathsHistory = {};

  for (const historyData of statesHistoryData.data) {
    if (data[historyData.ags] == null) {
      data[historyData.ags] = {
        ags: historyData.ags,
        name: historyData.name,
        history: [],
      };
    }
    if (data[historyData.ags].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[historyData.ags].history[
            data[historyData.ags].history.length - 1
          ].date
        ) > 1
      ) {
        data[historyData.ags].history.push({
          deaths: 0,
          date: AddDaysToDate(
            data[historyData.ags].history[
              data[historyData.ags].history.length - 1
            ].date,
            1
          ),
        });
      }
    }
    data[historyData.ags].history.push({
      deaths: historyData.deaths,
      date: new Date(historyData.date),
    });
  }
  return {
    data,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

interface DistrictsRecoveredHistory {
  [key: string]: DistrictHistory<{ recovered: number; date: Date }>;
}
export async function DistrictsRecoveredHistoryResponse(
  days?: number,
  ags?: string
): Promise<DistrictsHistoryData<DistrictsRecoveredHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  const statesHistoryData = await getLastDistrictRecoveredHistory(days, ags);

  const data: DistrictsRecoveredHistory = {};

  for (const historyData of statesHistoryData.data) {
    if (data[historyData.ags] == null) {
      data[historyData.ags] = {
        ags: historyData.ags,
        name: historyData.name,
        history: [],
      };
    }
    if (data[historyData.ags].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[historyData.ags].history[
            data[historyData.ags].history.length - 1
          ].date
        ) > 1
      ) {
        data[historyData.ags].history.push({
          recovered: 0,
          date: AddDaysToDate(
            data[historyData.ags].history[
              data[historyData.ags].history.length - 1
            ].date,
            1
          ),
        });
      }
    }
    data[historyData.ags].history.push({
      recovered: historyData.recovered,
      date: new Date(historyData.date),
    });
  }
  return {
    data,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
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
  const frozenIncidenceHistoryData = await getFrozenIncidenceHistory(days, ags);

  let data = {};
  frozenIncidenceHistoryData.data.forEach((historyData) => {
    data[historyData.ags] = historyData;
  });

  return {
    data: data,
    meta: new ResponseMeta(frozenIncidenceHistoryData.lastUpdate),
  };
}
