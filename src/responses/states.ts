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
  getDayDifference,
  getDateBefore,
  getStateAbbreviationById,
  getStateAbbreviationByName,
  getStateIdByAbbreviation,
  getStateNameByAbbreviation,
  getStateIdByName,
  fixDigit,
} from "../utils";
import { ResponseData } from "../data-requests/response-data";
import {
  AgeGroups,
  getHospitalizationData,
  getLatestHospitalizationDataKey,
} from "../data-requests/hospitalization";
import {
  StatesFrozenIncidenceData,
  getStatesFrozenIncidenceHistory,
} from "../data-requests/frozen-incidence";

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
    cases7Days: number;
    incidence7Days: number;
    ageGroups: AgeGroups;
    date: Date;
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
    hospitalizationData,
  ] = await Promise.all([
    getStatesData(),
    getStatesRecoveredData(),
    getNewStateCases(),
    getNewStateDeaths(),
    getNewStateRecovered(),
    getHospitalizationData(),
  ]);

  function getStateById(data: ResponseData<any[]>, id: number): any | null {
    for (const state of data.data) {
      if (state.id == id) return state;
    }
    return null;
  }

  const latestHospitalizationDataKey = getLatestHospitalizationDataKey(
    hospitalizationData.data
  );

  let states = statesData.data.map((state) => {
    return {
      ...state,
      recovered: getStateById(statesRecoverdData, state.id)?.recovered ?? 0,
      abbreviation: getStateAbbreviationById(state.id),
      weekIncidence: fixDigit(
        (state.casesPerWeek / state.population) * 100000,
        2
      ),
      casesPer100k: fixDigit((state.cases / state.population) * 100000, 0),
      delta: {
        cases: getStateById(statesNewCasesData, state.id)?.cases ?? 0,
        deaths: getStateById(statesNewDeathsData, state.id)?.deaths ?? 0,
        recovered:
          getStateById(statesNewRecoveredData, state.id)?.recovered ?? 0,
      },
      hospitalization: {
        cases7Days:
          hospitalizationData.data[latestHospitalizationDataKey].states[
            state.name
          ].cases7Days,
        incidence7Days:
          hospitalizationData.data[latestHospitalizationDataKey].states[
            state.name
          ].incidence7Days,
        date: new Date(latestHospitalizationDataKey),
        lastUpdate: hospitalizationData.lastUpdate,
      },
    };
  });

  if (abbreviation) {
    const id = getStateIdByAbbreviation(abbreviation);
    if (id) {
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
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  let id = null;
  if (abbreviation) {
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
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }

  // add 6 days to calculate week incidence
  if (days) {
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
  if (days && isNaN(days)) {
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
  if (days && isNaN(days)) {
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

interface StatesHospitalizationHistory {
  data: {
    [abbreviation: string]: {
      id: number;
      name: string;
      history: [
        {
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
          adjustedUpperIncidence7days: number;
        }
      ];
    };
  };
  meta: ResponseMeta;
}

export async function StatesHospitalizationHistoryResponse(
  days?: number,
  p_abbreviation?: string
): Promise<StatesHospitalizationHistory> {
  if (days != null && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  const hospitalizationData = await getHospitalizationData();
  let dateKeys = Object.keys(hospitalizationData.data);
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    dateKeys = dateKeys.filter((date) => new Date(date) > reference_date);
  }
  dateKeys.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
  const historyData = {};
  let abbreviationList = [];
  for (let id = 1; id <= 16; id++) {
    abbreviationList[id - 1] = getStateAbbreviationById(id);
  }
  dateKeys.forEach((dateKey) => {
    const stateNameKeys = Object.keys(hospitalizationData.data[dateKey].states);
    if (!p_abbreviation) {
      stateNameKeys.forEach((stateName) => {
        const id = getStateIdByName(stateName);
        const abbreviation = getStateAbbreviationByName(stateName);
        if (!historyData[abbreviation]) {
          historyData[abbreviation] = {
            id: id,
            name: stateName,
            history: [],
          };
        }
        historyData[abbreviation].history.push({
          cases7Days:
            hospitalizationData.data[dateKey].states[stateName].cases7Days, //legacy
          incidence7Days:
            hospitalizationData.data[dateKey].states[stateName].incidence7Days, //legacy
          date: new Date(dateKey),
          fixedCases7Days:
            hospitalizationData.data[dateKey].states[stateName].fixedCases7Days,
          updatedCases7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .updatedCases7Days,
          adjustedLowerCases7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .adjustedLowerCases7Days,
          adjustedCases7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .adjustedCases7Days,
          adjustedUpperCases7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .adjustedUpperCases7Days,
          fixedIncidence7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .fixedIncidence7Days,
          updatedIncidence7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .updatedIncidence7Days,
          adjustedLowerIncidence7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .adjustedLowerIncidence7Days,
          adjustedIncidence7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .adjustedIncidence7Days,
          adjustedUpperIncidence7Days:
            hospitalizationData.data[dateKey].states[stateName]
              .adjustedUpperIncidence7Days,
        });
      });
    } else if (abbreviationList.includes(p_abbreviation)) {
      const id = getStateIdByAbbreviation(p_abbreviation);
      const stateName = getStateNameByAbbreviation(p_abbreviation);
      if (!historyData[p_abbreviation]) {
        historyData[p_abbreviation] = {
          id: id,
          name: stateName,
          history: [],
        };
      }
      historyData[p_abbreviation].history.push({
        cases7Days:
          hospitalizationData.data[dateKey].states[stateName].cases7Days, //legacy
        incidence7Days:
          hospitalizationData.data[dateKey].states[stateName].incidence7Days, //legacy
        date: new Date(dateKey),
        fixedCases7Days:
          hospitalizationData.data[dateKey].states[stateName].fixedCases7Days,
        updatedCases7Days:
          hospitalizationData.data[dateKey].states[stateName].updatedCases7Days,
        adjustedLowerCases7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .adjustedLowerCases7Days,
        adjustedCases7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .adjustedCases7Days,
        adjustedUpperCases7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .adjustedUpperCases7Days,
        fixedIncidence7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .fixedIncidence7Days,
        updatedIncidence7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .updatedIncidence7Days,
        adjustedLowerIncidence7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .adjustedLowerIncidence7Days,
        adjustedIncidence7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .adjustedIncidence7Days,
        adjustedUpperIncidence7Days:
          hospitalizationData.data[dateKey].states[stateName]
            .adjustedUpperIncidence7Days,
      });
    } else {
      throw new Error(
        `Abbreviation ${p_abbreviation} is not allowed. Please choose one of: ${abbreviationList}`
      );
    }
  });

  return {
    data: historyData,
    meta: new ResponseMeta(hospitalizationData.lastUpdate),
  };
}

export async function StatesAgeGroupsResponse(abbreviation?: string): Promise<{
  data: AgeGroupsData;
  meta: ResponseMeta;
}> {
  let id = null;
  if (abbreviation) {
    id = getStateIdByAbbreviation(abbreviation);
  }
  const AgeGroupsData = await getStatesAgeGroups(id);
  const hospitalizationData = await getHospitalizationData();

  const latestHospitalizationDataKey = getLatestHospitalizationDataKey(
    hospitalizationData.data
  );

  const data = {};
  Object.keys(AgeGroupsData.data).forEach((stateAbbreviation) => {
    data[stateAbbreviation] = {
      ...AgeGroupsData.data[stateAbbreviation],
    };
    Object.keys(AgeGroupsData.data[stateAbbreviation]).forEach((ageGroup) => {
      data[stateAbbreviation][ageGroup] = {
        ...AgeGroupsData.data[stateAbbreviation][ageGroup],
        hospitalization: {
          cases7Days:
            hospitalizationData.data[latestHospitalizationDataKey].states[
              getStateNameByAbbreviation(stateAbbreviation)
            ].ageGroups[ageGroup].cases7Days,
          incidence7Days:
            hospitalizationData.data[latestHospitalizationDataKey].states[
              getStateNameByAbbreviation(stateAbbreviation)
            ].ageGroups[ageGroup].incidence7Days,
          date: new Date(latestHospitalizationDataKey),
        },
      };
    });
  });

  return {
    data: data,
    meta: new ResponseMeta(AgeGroupsData.lastUpdate),
  };
}

interface StatesFrozenIncidenceHistoryData extends IResponseMeta {
  data: {
    [key: string]: StatesFrozenIncidenceData;
  };
}

export async function StatesFrozenIncidenceHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesFrozenIncidenceHistoryData> {
  if (days && isNaN(days)) {
    throw new TypeError(
      "Wrong format for ':days' parameter! This is not a number."
    );
  }
  const frozenIncidenceHistoryData = await getStatesFrozenIncidenceHistory(
    days,
    abbreviation
  );

  let data = {};
  frozenIncidenceHistoryData.data.forEach((historyData) => {
    if (historyData.abbreviation) {
      data[historyData.abbreviation] = historyData;
    }
  });

  return {
    data: data,
    meta: new ResponseMeta(frozenIncidenceHistoryData.lastUpdate),
  };
}
