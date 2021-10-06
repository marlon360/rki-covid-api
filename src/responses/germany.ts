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
import { getActualHospitalization } from "../data-requests/hospitalization";

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
    cases7D: number;
    cases7DbyAge: {
      age0to4: number;
      age5to14: number;
      age15to34: number;
      age35to59: number;
      age60to79: number;
      age80plus: number;
    };
    incidence7D: number;
    incidence7DbyAge: {
      age0to4: number;
      age5to14: number;
      age15to34: number;
      age35to59: number;
      age60to79: number;
      age80plus: number;
    };
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
    actualHospitalizationData,
  ] = await Promise.all([
    getCases(),
    getDeaths(),
    getRecovered(),
    getNewCases(),
    getNewDeaths(),
    getNewRecovered(),
    getStatesData(),
    getRValue(),
    getActualHospitalization(),
  ]);

  const germanyIndex = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "00+"
  );
  const age0to4Index = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "00-04"
  );
  const age5to14Index = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "05-14"
  );
  const age15to34Index = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "15-34"
  );
  const age35to59Index = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "35-59"
  );
  const age60to79Index = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "60-79"
  );
  const age80plusIndex = actualHospitalizationData.data.findIndex(
    (element) => element.id === 0 && element.ageGroup === "80+"
  );

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
      cases7D: actualHospitalizationData.data[germanyIndex].cases7days,
      cases7DbyAge: {
        age0to4: actualHospitalizationData.data[age0to4Index].cases7days,
        age5to14: actualHospitalizationData.data[age5to14Index].cases7days,
        age15to34: actualHospitalizationData.data[age15to34Index].cases7days,
        age35to59: actualHospitalizationData.data[age35to59Index].cases7days,
        age60to79: actualHospitalizationData.data[age60to79Index].cases7days,
        age80plus: actualHospitalizationData.data[age80plusIndex].cases7days,
      },
      incidence7D: actualHospitalizationData.data[germanyIndex].incidence7days,
      incidence7DbyAge: {
        age0to4: actualHospitalizationData.data[age0to4Index].incidence7days,
        age5to14: actualHospitalizationData.data[age5to14Index].incidence7days,
        age15to34:
          actualHospitalizationData.data[age15to34Index].incidence7days,
        age35to59:
          actualHospitalizationData.data[age35to59Index].incidence7days,
        age60to79:
          actualHospitalizationData.data[age60to79Index].incidence7days,
        age80plus:
          actualHospitalizationData.data[age80plusIndex].incidence7days,
      },
      lastUpdate: actualHospitalizationData.lastUpdate,
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
  return {
    data: history,
    meta: new ResponseMeta(new Date(history[history.length - 1].date)),
  };
}

export async function GermanyWeekIncidenceHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ weekIncidence: number; date: Date }>> {
  if (days != null) {
    days += 6;
  }

  const history = await getLastCasesHistory(days);
  const statesData = await getStatesData();

  const population = statesData.data
    .map((state) => state.population)
    .reduce((cur, acc) => (cur += acc));

  const weekIncidenceHistory: { weekIncidence: number; date: Date }[] = [];

  for (let i = 6; i < history.length; i++) {
    const date = history[i].date;
    let sum = 0;
    for (let dayOffset = i; dayOffset > i - 7; dayOffset--) {
      sum += history[dayOffset].cases;
    }
    weekIncidenceHistory.push({
      weekIncidence: (sum / population) * 100000,
      date: date,
    });
  }

  return {
    data: weekIncidenceHistory,
    meta: new ResponseMeta(new Date(history[history.length - 1].date)),
  };
}

export async function GermanyDeathsHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ deaths: number; date: Date }>> {
  const history = await getLastDeathsHistory(days);
  return {
    data: history,
    meta: new ResponseMeta(new Date(history[history.length - 1].date)),
  };
}

export async function GermanyRecoveredHistoryResponse(
  days?: number
): Promise<GermanyHistoryData<{ recovered: number; date: Date }>> {
  const history = await getLastRecoveredHistory(days);
  return {
    data: history,
    meta: new ResponseMeta(new Date(history[history.length - 1].date)),
  };
}

export async function GermanyAgeGroupsResponse(): Promise<{
  data: { [ageGroup: string]: AgeGroupData };
  meta: ResponseMeta;
}> {
  const AgeGroupsData = await getGermanyAgeGroups();
  return {
    data: AgeGroupsData.data,
    meta: new ResponseMeta(AgeGroupsData.lastUpdate),
  };
}
