import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getLastCasesHistory,
  getCases,
  getDeaths,
  getNewCases,
  getNewDeaths,
  getNewRecovered,
  getRecovered,
  getLastDeathsHistory,
  getLastRecoveredHistory,
  getGermanyAgeGroups,
  AgeGroupData,
} from "../data-requests/germany";
import { getRValue } from "../data-requests/r-value";
import { getStatesData } from "../data-requests/states";
import {
  getHospitalizationData,
  getLatestHospitalizationDataKey,
} from "../data-requests/hospitalization";
import { getStatesFrozenIncidenceHistory } from "../data-requests/frozen-incidence";
import {
  getDateBefore,
  AddDaysToDate,
  getDayDifference,
  RequestType,
  fill0CasesDaysGermany,
} from "../utils";

interface GermanyData extends IResponseMeta {
  cases: number;
  deaths: number;
  recovered: number;
  weekIncidence: number;
  casesPerWeek: number;
  casesPer100k: number;
  r: {
    value: number;
    rValue4Days: {
      value: number;
      date: Date;
    };
    rValue7Days: {
      value: number;
      date: Date;
    };
    lastUpdate: Date;
  };
  delta: {
    cases: number;
    deaths: number;
    recovered: number;
  };
  hospitalization: {
    date: Date;
    cases7Days: number;
    incidence7Days: number;
    lastUpdate: Date;
  };
}

export async function GermanyResponse(): Promise<GermanyData> {
  // make all requests
  const [
    casesData,
    deathsData,
    recoveredData,
    newCasesData,
    newDeathsData,
    newRecoveredData,
    statesData,
    rData,
    hospitalizationData,
  ] = await Promise.all([
    getCases(),
    getDeaths(),
    getRecovered(),
    getNewCases(),
    getNewDeaths(),
    getNewRecovered(),
    getStatesData(),
    getRValue(),
    getHospitalizationData(),
  ]);

  // calculate week incidence
  let population = 0;
  let casesPerWeek = 0;
  for (const state of statesData.data) {
    population += state.population;
    casesPerWeek += state.casesPerWeek;
  }

  const weekIncidence = (casesPerWeek / population) * 100000;
  const casesPer100k = (casesData.data / population) * 100000;

  return {
    cases: casesData.data,
    deaths: deathsData.data,
    recovered: recoveredData.data,
    weekIncidence,
    casesPer100k,
    casesPerWeek,
    delta: {
      cases: newCasesData.data,
      deaths: newDeathsData.data,
      recovered: newRecoveredData.data,
    },
    r: {
      value: rData.data.rValue4Days.value, // legacy
      rValue4Days: rData.data.rValue4Days,
      rValue7Days: rData.data.rValue7Days,
      lastUpdate: rData.lastUpdate,
    },
    hospitalization: {
      cases7Days:
        hospitalizationData.data[
          getLatestHospitalizationDataKey(hospitalizationData.data)
        ].cases7Days,
      incidence7Days:
        hospitalizationData.data[
          getLatestHospitalizationDataKey(hospitalizationData.data)
        ].incidence7Days,
      date: new Date(getLatestHospitalizationDataKey(hospitalizationData.data)),
      lastUpdate: hospitalizationData.lastUpdate,
    },
    meta: new ResponseMeta(statesData.lastUpdate),
  };
}

interface GermanyHistoryData<T> extends IResponseMeta {
  data: T[];
  meta: ResponseMeta;
}

export async function GermanyCasesHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ cases: number; date: Date }>> {
  const history = await getLastCasesHistory(days);
  const highDate = AddDaysToDate(history.lastUpdate, -1); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01
  const data = fill0CasesDaysGermany(
    history,
    lowDate,
    highDate,
    RequestType.cases
  );
  return {
    data: data,
    meta: new ResponseMeta(history.lastUpdate),
  };
}

export async function GermanyWeekIncidenceHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ weekIncidence: number; date: Date }>> {
  if (days != null) {
    days += 6;
  }

  const history = await GermanyCasesHistoryResponse(days);
  const statesData = await getStatesData();

  const population = statesData.data
    .map((state) => state.population)
    .reduce((cur, acc) => (cur += acc));

  const weekIncidenceHistory: { weekIncidence: number; date: Date }[] = [];

  for (let i = 6; i < history.data.length; i++) {
    const date = history.data[i].date;
    let sum = 0;
    for (let dayOffset = i; dayOffset > i - 7; dayOffset--) {
      sum += history.data[dayOffset].cases;
    }
    weekIncidenceHistory.push({
      weekIncidence: (sum / population) * 100000,
      date: date,
    });
  }

  return {
    data: weekIncidenceHistory,
    meta: history.meta,
  };
}

export async function GermanyDeathsHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ deaths: number; date: Date }>> {
  const history = await getLastDeathsHistory(days);
  const highDate = AddDaysToDate(history.lastUpdate, -1); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01
  const data = fill0CasesDaysGermany(
    history,
    lowDate,
    highDate,
    RequestType.deaths
  );
  return {
    data: data,
    meta: new ResponseMeta(history.lastUpdate),
  };
}

export async function GermanyRecoveredHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ recovered: number; date: Date }>> {
  const history = await getLastRecoveredHistory(days);
  const highDate = AddDaysToDate(history.lastUpdate, -1); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01
  const data = fill0CasesDaysGermany(
    history,
    lowDate,
    highDate,
    RequestType.recovered
  );
  return {
    data: data,
    meta: new ResponseMeta(history.lastUpdate),
  };
}

export async function GermanyHospitalizationHistoryResponse(
  days?: number
): Promise<
  GermanyHistoryData<{
    cases7Days: number; //legacy
    incidence7Days: number; //legacy
    date: Date;
    fixedCases7Days: number;
    updatedCases7Days: number;
    adjustedLowerCases7Days: number;
    adjustedCases7Days: number;
    adjustedUpperCases7Days: number;
    fixedIncidence7Days: number;
    updatedIncidence7Days: number;
    adjustedLowerIncidence7Days: number;
    adjustedIncidence7Days: number;
    adjustedUpperIncidence7Days: number;
  }>
> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  const hospitalizationData = await getHospitalizationData();
  const history = [];
  let dateKeys = Object.keys(hospitalizationData.data);
  if (days != undefined) {
    const reference_date = new Date(getDateBefore(days));
    dateKeys = dateKeys.filter((date) => new Date(date) > reference_date);
  }
  dateKeys.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
  dateKeys.forEach((dateKey) => {
    history.push({
      cases7Days: hospitalizationData.data[dateKey].cases7Days, //legacy
      incidence7Days: hospitalizationData.data[dateKey].incidence7Days, //legacy
      date: new Date(dateKey),
      fixedCases7Days: hospitalizationData.data[dateKey].fixedCases7Days,
      updatedCases7Days: hospitalizationData.data[dateKey].updatedCases7Days,
      adjustedLowerCases7Days:
        hospitalizationData.data[dateKey].adjustedLowerCases7Days,
      adjustedCases7Days: hospitalizationData.data[dateKey].adjustedCases7Days,
      adjustedUpperCases7Days:
        hospitalizationData.data[dateKey].adjustedUpperCases7Days,
      fixedIncidence7Days:
        hospitalizationData.data[dateKey].fixedIncidence7Days,
      updatedIncidence7Days:
        hospitalizationData.data[dateKey].updatedIncidence7Days,
      adjustedLowerIncidence7Days:
        hospitalizationData.data[dateKey].adjustedLowerIncidence7Days,
      adjustedIncidence7Days:
        hospitalizationData.data[dateKey].adjustedIncidence7Days,
      adjustedUpperIncidence7Days:
        hospitalizationData.data[dateKey].adjustedUpperIncidence7Days,
    });
  });

  return {
    data: history,
    meta: new ResponseMeta(hospitalizationData.lastUpdate),
  };
}

export async function GermanyAgeGroupsResponse(): Promise<{
  data: {
    [ageGroup: string]: AgeGroupData & {
      hospitalization: {
        cases7Days: number;
        incidence7Days: number;
        date: Date;
      };
    };
  };
  meta: ResponseMeta;
}> {
  const AgeGroupsData = await getGermanyAgeGroups();
  const hospitalizationData = await getHospitalizationData();

  const latestHospitalizationDataKey = getLatestHospitalizationDataKey(
    hospitalizationData.data
  );

  const data = {};
  Object.keys(AgeGroupsData.data).forEach((key) => {
    data[key] = {
      ...AgeGroupsData.data[key],
      hospitalization: {
        cases7Days:
          hospitalizationData.data[latestHospitalizationDataKey].ageGroups[key]
            .cases7Days,
        incidence7Days:
          hospitalizationData.data[latestHospitalizationDataKey].ageGroups[key]
            .incidence7Days,
        date: new Date(latestHospitalizationDataKey),
      },
    };
  });

  return {
    data: data,
    meta: new ResponseMeta(AgeGroupsData.lastUpdate),
  };
}

interface StatesFrozenIncidenceHistoryData extends IResponseMeta {
  data: {};
}

export async function GermanyFrozenIncidenceHistoryResponse(
  days?: number
): Promise<StatesFrozenIncidenceHistoryData> {
  const frozenIncidenceHistoryData = await getStatesFrozenIncidenceHistory(
    days
  );

  let data = {};
  frozenIncidenceHistoryData.data.forEach((historyData) => {
    if (historyData.abbreviation == null) {
      historyData.abbreviation = "Bund";
      historyData.name = "Bundesgebiet";
      data = historyData;
    }
  });

  return {
    data: data,
    meta: new ResponseMeta(frozenIncidenceHistoryData.lastUpdate),
  };
}
