import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getStatesCasesHistory,
  getStatesDeathsHistory,
  getStatesRecoveredHistory,
  getStatesIncidenceHistory,
  getStatesNewCases,
  getStatesNewDeaths,
  getStatesNewRecovered,
  getStatesData,
  IStateData,
  getStatesAgeGroups,
  AgeGroupsData,
} from "../data-requests/states";
import {
  AddDaysToDate,
  getStateAbbreviationById,
  getStateAbbreviationByName,
  getStateIdByAbbreviation,
  getStateIdByName,
  getStateNameByAbbreviation,
  getDateBefore,
  limit,
  getMetaData,
  MetaData,
} from "../utils";
import { ResponseData } from "../data-requests/response-data";
import {
  AgeGroups,
  getHospitalizationData,
  getLatestHospitalizationDataKey,
} from "../data-requests/hospitalization";
import {
  FrozenIncidenceData,
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
    weekIncidence: number;
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

export function getStateById(
  data: ResponseData<any[]>,
  id: number
): any | null {
  for (const state of data.data) {
    if (state.id == id) return state;
  }
  return null;
}

export async function StatesResponse(
  abbreviation?: string
): Promise<StatesData> {
  const metaData = await getMetaData();
  // make all requests
  const [
    statesData,
    statesNewCasesData,
    statesNewDeathsData,
    statesNewRecoveredData,
    hospitalizationData,
    statesFixIncidence,
  ] = await Promise.all([
    getStatesData(metaData),
    getStatesNewCases(metaData),
    getStatesNewDeaths(metaData),
    getStatesNewRecovered(metaData),
    getHospitalizationData(),
    getStatesFrozenIncidenceHistory(metaData, 7),
  ]);

  // remove the first element from statesData.data (=Bundesgebiet)
  statesData.data.shift();

  const latestHospitalizationDataKey = getLatestHospitalizationDataKey(
    hospitalizationData.data
  );

  const yesterdayDate = new Date(
    AddDaysToDate(statesData.lastUpdate, -1).setHours(0, 0, 0, 0)
  );

  let states = statesData.data.map((state) => {
    const stateAbbreviation = getStateAbbreviationById(state.id);
    const stateFixHistory = statesFixIncidence.data.find(
      (fixEntry) => fixEntry.abbreviation == stateAbbreviation
    ).history;
    const yesterdayIncidence = stateFixHistory.find(
      (entry) => entry.date.getTime() == yesterdayDate.getTime()
    ).weekIncidence;
    return {
      ...state,
      abbreviation: getStateAbbreviationById(state.id),
      weekIncidence: (state.casesPerWeek / state.population) * 100000,
      casesPer100k: (state.cases / state.population) * 100000,
      delta: {
        cases: getStateById(statesNewCasesData, state.id)?.cases ?? 0,
        deaths: getStateById(statesNewDeathsData, state.id)?.deaths ?? 0,
        recovered:
          getStateById(statesNewRecoveredData, state.id)?.recovered ?? 0,
        weekIncidence: limit(
          (state.casesPerWeek / state.population) * 100000 - yesterdayIncidence,
          12
        ),
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

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;
  if (id) {
    states = states.filter((state) => {
      return state.id == id;
    });
  }

  const statesKey = {};
  for (const state of states) {
    if (state) {
      statesKey[state.abbreviation] = state;
    }
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
export interface StatesHistoryData<T> extends IResponseMeta {
  data: T;
}

export interface StatesCasesHistory {
  [key: string]: StateHistory<{ cases: number; date: Date }>;
}

export async function StatesCasesHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesCasesHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;
  const metaData = await getMetaData();
  const sHData = await getStatesCasesHistory(metaData, days, id);

  const data: StatesCasesHistory = {};

  for (const history of sHData.data) {
    const idKey = getStateAbbreviationById(history.id);
    if (!data[history[idKey]]) {
      data[history[idKey]] = {
        id: history.id,
        name: history.name,
        history: [],
      };
    }
    data[history[idKey]].history.push({
      cases: history.cases,
      date: history.date,
    });
  }

  return {
    data,
    meta: new ResponseMeta(sHData.lastUpdate),
  };
}

interface StatesWeekIncidenceHistory {
  [key: string]: StateHistory<{ weekIncidence: number; date: Date }>;
}
export async function StatesWeekIncidenceHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesWeekIncidenceHistory>> {
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
  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;
  const sHData = await getStatesIncidenceHistory(metaData, days, id);

  const data: StatesWeekIncidenceHistory = {};

  for (const history of sHData.data) {
    const idKey = getStateAbbreviationById(history.id);
    if (!data[history[idKey]]) {
      data[history[idKey]] = {
        id: history.id,
        name: history.name,
        history: [],
      };
    }
    data[history[idKey]].history.push({
      weekIncidence: history.incidence,
      date: history.date,
    });
  }

  return {
    data,
    meta: new ResponseMeta(sHData.lastUpdate),
  };
}

interface StatesDeathsHistory {
  [key: string]: StateHistory<{ deaths: number; date: Date }>;
}
export async function StatesDeathsHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesDeathsHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;
  const metaData = await getMetaData();
  const sHData = await getStatesDeathsHistory(metaData, days, id);

  const data: StatesDeathsHistory = {};
  for (const history of sHData.data) {
    const idKey = getStateAbbreviationById(history.id);
    if (!data[history[idKey]]) {
      data[history[idKey]] = {
        id: history.id,
        name: history.name,
        history: [],
      };
    }
    data[history[idKey]].history.push({
      deaths: history.deaths,
      date: history.date,
    });
  }

  return {
    data,
    meta: new ResponseMeta(sHData.lastUpdate),
  };
}

interface StatesRecoveredHistory {
  [key: string]: StateHistory<{ recovered: number; date: Date }>;
}
export async function StatesRecoveredHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesHistoryData<StatesRecoveredHistory>> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;
  const metaData = await getMetaData();
  const sHData = await getStatesRecoveredHistory(metaData, days, id);

  const data: StatesRecoveredHistory = {};
  for (const history of sHData.data) {
    const idKey = getStateAbbreviationById(history.id);
    if (!data[history[idKey]]) {
      data[history[idKey]] = {
        id: history.id,
        name: history.name,
        history: [],
      };
    }
    data[history[idKey]].history.push({
      recovered: history.recovered,
      date: history.date,
    });
  }
  return {
    data,
    meta: new ResponseMeta(sHData.lastUpdate),
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
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
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
  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;
  const metaData = await getMetaData();
  const AgeGroupsData = await getStatesAgeGroups(metaData, id);
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
    [key: string]: FrozenIncidenceData;
  };
}

export async function StatesFrozenIncidenceHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesFrozenIncidenceHistoryData> {
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
  const frozenIncidenceHistoryData = await getStatesFrozenIncidenceHistory(
    metaData,
    days,
    abbreviation
  );

  let data = {};
  frozenIncidenceHistoryData.data.forEach((historyData) => {
    if (historyData.abbreviation != "Bund") {
      data[historyData.abbreviation] = historyData;
    }
  });

  return {
    data: data,
    meta: new ResponseMeta(frozenIncidenceHistoryData.lastUpdate),
  };
}
