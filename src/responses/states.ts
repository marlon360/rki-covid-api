import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getLastStateCasesHistory,
  getLastStateDeathsHistory,
  getLastStateRecoveredHistory,
  getNewStateCases,
  getNewStateDeaths,
  getStatesData,
  getStatesRecoveredData,
  IStateData,
  getNewStateRecovered,
  getStatesAgeGroups,
  AgeGroupsData,
} from "../data-requests/states";
import {
  AddDaysToDate,
  fixDigit,
  getDayDifference,
  getStateAbbreviationById,
  getStateIdByAbbreviation,
} from "../utils";
import { ResponseData } from "../data-requests/response-data";
import { getActualHospitalization } from "../data-requests/hospitalization";

interface StateData extends IStateData {
  abbreviation: string;
  weekIncidence: number;
  casesPer100k: number;
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

interface StatesData extends IResponseMeta {
  data: {
    [key: string]: StateData;
  };
}

export async function StatesResponse(
  abbreviation?: string
): Promise<StatesData> {
  // make all requests
  const [
    statesData,
    statesRecoverdData,
    statesNewCasesData,
    statesNewDeathsData,
    statesNewRecoveredData,
    actualHospitalizationData,
  ] = await Promise.all([
    getStatesData(),
    getStatesRecoveredData(),
    getNewStateCases(),
    getNewStateDeaths(),
    getNewStateRecovered(),
    getActualHospitalization(),
  ]);

  function getStateById(data: ResponseData<any[]>, id: number): any | null {
    for (const state of data.data) {
      if (state.id == id) return state;
    }
    return null;
  }

  let states = statesData.data.map((state) => {
    const stateIndex = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "00+"
    );
    const age0to4Index = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "00-04"
    );
    const age5to14Index = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "05-14"
    );
    const age15to34Index = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "15-34"
    );
    const age35to59Index = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "35-59"
    );
    const age60to79Index = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "60-79"
    );
    const age80plusIndex = actualHospitalizationData.data.findIndex(
      (element) => element.id === state.id && element.ageGroup === "80+"
    );
    return {
      ...state,
      recovered: getStateById(statesRecoverdData, state.id)?.recovered ?? 0,
      abbreviation: getStateAbbreviationById(state.id),
      weekIncidence: (state.casesPerWeek / state.population) * 100000,
      casesPer100k: (state.cases / state.population) * 100000,
      delta: {
        cases: getStateById(statesNewCasesData, state.id)?.cases ?? 0,
        deaths: getStateById(statesNewDeathsData, state.id)?.deaths ?? 0,
        recovered:
          getStateById(statesNewRecoveredData, state.id)?.recovered ?? 0,
      },
      hospitalization: {
        cases7D: actualHospitalizationData.data[stateIndex].cases7days,
        cases7DbyAge: {
          age0to4: actualHospitalizationData.data[age0to4Index].cases7days,
          age5to14: actualHospitalizationData.data[age5to14Index].cases7days,
          age15to34: actualHospitalizationData.data[age15to34Index].cases7days,
          age35to59: actualHospitalizationData.data[age35to59Index].cases7days,
          age60to79: actualHospitalizationData.data[age60to79Index].cases7days,
          age80plus: actualHospitalizationData.data[age80plusIndex].cases7days,
        },
        incidence7D: actualHospitalizationData.data[stateIndex].incidence7days,
        incidence7DbyAge: {
          age0to4: actualHospitalizationData.data[age0to4Index].incidence7days,
          age5to14:
            actualHospitalizationData.data[age5to14Index].incidence7days,
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
    };
  });

  if (abbreviation != null) {
    const id = getStateIdByAbbreviation(abbreviation);
    if (id != null) {
      states = states.filter((state) => {
        return state.id == id;
      });
    }
  }

  const statesKey = {};
  for (const state of states) {
    statesKey[state.abbreviation] = state;
  }

  return {
    data: statesKey,
    meta: new ResponseMeta(statesData.lastUpdate),
  };
}

interface StateHistory<T> {
  id: number;
  name: string;
  history: T[];
}
interface StatesHistoryData<T> extends IResponseMeta {
  data: T;
}

interface StatesCasesHistory {
  [key: string]: StateHistory<{ cases: number; date: Date }>;
}
export async function StatesCasesHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesCasesHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  let id = null;
  if (abbreviation != null) {
    id = getStateIdByAbbreviation(abbreviation);
  }

  const statesHistoryData = await getLastStateCasesHistory(days, id);

  const data: StatesCasesHistory = {};

  for (const historyData of statesHistoryData.data) {
    const abbr = getStateAbbreviationById(historyData.id);
    if (data[abbr] == null) {
      data[abbr] = {
        id: historyData.id,
        name: historyData.name,
        history: [],
      };
    }
    if (data[abbr].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[abbr].history[data[abbr].history.length - 1].date
        ) > 1
      ) {
        data[abbr].history.push({
          cases: 0,
          date: AddDaysToDate(
            data[abbr].history[data[abbr].history.length - 1].date,
            1
          ),
        });
      }
    }
    data[abbr].history.push({
      cases: historyData.cases,
      date: new Date(historyData.date),
    });
  }
  return {
    data,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

interface StatesWeekIncidenceHistory {
  [key: string]: StateHistory<{ weekIncidence: number; date: Date }>;
}
export async function StatesWeekIncidenceHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesWeekIncidenceHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  // add 6 days to calculate week incidence
  if (days != null) {
    days += 6;
  }

  let id = null;
  if (abbreviation != null) {
    id = getStateIdByAbbreviation(abbreviation);
  }

  const statesHistoryData = await getLastStateCasesHistory(days, id);
  const statesData = await getStatesData();

  function getStateById(
    data: ResponseData<IStateData[]>,
    id: number
  ): IStateData | null {
    for (const state of data.data) {
      if (state.id == id) return state;
    }
    return null;
  }

  const data: StatesCasesHistory = {};

  for (const historyData of statesHistoryData.data) {
    const abbr = getStateAbbreviationById(historyData.id);
    if (data[abbr] == null) {
      data[abbr] = {
        id: historyData.id,
        name: historyData.name,
        history: [],
      };
    }
    if (data[abbr].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[abbr].history[data[abbr].history.length - 1].date
        ) > 1
      ) {
        data[abbr].history.push({
          cases: 0,
          date: AddDaysToDate(
            data[abbr].history[data[abbr].history.length - 1].date,
            1
          ),
        });
      }
    }
    data[abbr].history.push({
      cases: historyData.cases,
      date: new Date(historyData.date),
    });
  }

  const incidenceData: StatesWeekIncidenceHistory = {};

  for (const abbr of Object.keys(data)) {
    const stateHistory = data[abbr].history;
    const state = getStateById(statesData, getStateIdByAbbreviation(abbr));

    incidenceData[abbr] = {
      id: state.id,
      name: state.name,
      history: [],
    };

    for (let i = 6; i < stateHistory.length; i++) {
      const date = stateHistory[i].date;
      let sum = 0;
      for (let dayOffset = i; dayOffset > i - 7; dayOffset--) {
        sum += stateHistory[dayOffset].cases;
      }
      incidenceData[abbr].history.push({
        weekIncidence: fixDigit((sum / state.population) * 100000, 2),
        date: date,
      });
    }
  }

  return {
    data: incidenceData,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

interface StatesDeathsHistory {
  [key: string]: StateHistory<{ deaths: number; date: Date }>;
}
export async function StatesDeathsHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesDeathsHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  let id = null;
  if (abbreviation != null) {
    id = getStateIdByAbbreviation(abbreviation);
  }

  const statesHistoryData = await getLastStateDeathsHistory(days, id);

  const data: StatesDeathsHistory = {};

  for (const historyData of statesHistoryData.data) {
    const abbr = getStateAbbreviationById(historyData.id);
    if (data[abbr] == null) {
      data[abbr] = {
        id: historyData.id,
        name: historyData.name,
        history: [],
      };
    }
    if (data[abbr].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[abbr].history[data[abbr].history.length - 1].date
        ) > 1
      ) {
        data[abbr].history.push({
          deaths: 0,
          date: AddDaysToDate(
            data[abbr].history[data[abbr].history.length - 1].date,
            1
          ),
        });
      }
    }
    data[abbr].history.push({
      deaths: historyData.deaths,
      date: new Date(historyData.date),
    });
  }
  return {
    data,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

interface StatesRecoveredHistory {
  [key: string]: StateHistory<{ recovered: number; date: Date }>;
}
export async function StatesRecoveredHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesRecoveredHistory>> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  let id = null;
  if (abbreviation != null) {
    id = getStateIdByAbbreviation(abbreviation);
  }

  const statesHistoryData = await getLastStateRecoveredHistory(days, id);

  const data: StatesRecoveredHistory = {};

  for (const historyData of statesHistoryData.data) {
    const abbr = getStateAbbreviationById(historyData.id);
    if (data[abbr] == null) {
      data[abbr] = {
        id: historyData.id,
        name: historyData.name,
        history: [],
      };
    }
    if (data[abbr].history.length > 0) {
      const nextDate = new Date(historyData.date);
      while (
        getDayDifference(
          nextDate,
          data[abbr].history[data[abbr].history.length - 1].date
        ) > 1
      ) {
        data[abbr].history.push({
          recovered: 0,
          date: AddDaysToDate(
            data[abbr].history[data[abbr].history.length - 1].date,
            1
          ),
        });
      }
    }
    data[abbr].history.push({
      recovered: historyData.recovered,
      date: new Date(historyData.date),
    });
  }
  return {
    data,
    meta: new ResponseMeta(statesHistoryData.lastUpdate),
  };
}

export async function StatesAgeGroupsResponse(
  abbreviation?: string
): Promise<{
  data: AgeGroupsData;
  meta: ResponseMeta;
}> {
  let id = null;
  if (abbreviation != null) {
    id = getStateIdByAbbreviation(abbreviation);
  }
  const AgeGroupsData = await getStatesAgeGroups(id);
  return {
    data: AgeGroupsData.data,
    meta: new ResponseMeta(AgeGroupsData.lastUpdate),
  };
}
