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
import { fixDigit } from "../utils";
import { getActualHospitalization } from "../data-requests/hospitalization";
import { ageGroups } from "../utils";
import { ResponseData } from "../data-requests/response-data";

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
    cases7DbyAge: ageGroups;
    incidence7D: number;
    incidence7DbyAge: ageGroups;
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

  function getGermanHospitalisation(
    data: ResponseData<any[]>,
    ageGroup: string
  ): any | null {
    for (const germany of data.data) {
      if (germany.id == 0 && germany.ageGroup == ageGroup) return germany;
    }
    return null;
  }

  // calculate week incidence
  let population = 0;
  let casesPerWeek = 0;
  for (const state of statesData.data) {
    population += state.population;
    casesPerWeek += state.casesPerWeek;
  }

  const weekIncidence = fixDigit((casesPerWeek / population) * 100000, 2);
  const casesPer100k = fixDigit((casesData.data / population) * 100000, 0);

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
      cases7D: getGermanHospitalisation(actualHospitalizationData, "00+")
        .cases7days,
      cases7DbyAge: {
        "A00-A04": getGermanHospitalisation(actualHospitalizationData, "00-04")
          .cases7days,
        "A05-A14": getGermanHospitalisation(actualHospitalizationData, "05-14")
          .cases7days,
        "A15-A34": getGermanHospitalisation(actualHospitalizationData, "15-34")
          .cases7days,
        "A35-A59": getGermanHospitalisation(actualHospitalizationData, "35-59")
          .cases7days,
        "A60-A79": getGermanHospitalisation(actualHospitalizationData, "60-79")
          .cases7days,
        "A80+": getGermanHospitalisation(actualHospitalizationData, "80+")
          .cases7days,
      },
      incidence7D: getGermanHospitalisation(actualHospitalizationData, "00+")
        .incidence7days,
      incidence7DbyAge: {
        "A00-A04": getGermanHospitalisation(actualHospitalizationData, "00-04")
          .incidence7days,
        "A05-A14": getGermanHospitalisation(actualHospitalizationData, "05-14")
          .incidence7days,
        "A15-A34": getGermanHospitalisation(actualHospitalizationData, "15-34")
          .incidence7days,
        "A35-A59": getGermanHospitalisation(actualHospitalizationData, "35-59")
          .incidence7days,
        "A60-A79": getGermanHospitalisation(actualHospitalizationData, "60-79")
          .incidence7days,
        "A80+": getGermanHospitalisation(actualHospitalizationData, "80+")
          .incidence7days,
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
      weekIncidence: fixDigit((sum / population) * 100000, 2),
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
