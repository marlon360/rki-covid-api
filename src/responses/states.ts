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
  getStateAbbreviationById,
  getStateAbbreviationByName,
  getStateIdByAbbreviation,
  getStateIdByName,
  getStateNameByAbbreviation,
  getDateBefore,
  fill0CasesDays,
  RegionType,
  RequestType,
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
    statesFixIncidence,
  ] = await Promise.all([
    getStatesData(),
    getStatesRecoveredData(),
    getNewStateCases(),
    getNewStateDeaths(),
    getNewStateRecovered(),
    getHospitalizationData(),
    getStatesFrozenIncidenceHistory(2),
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

  const yesterdayDate = new Date(AddDaysToDate(statesData.lastUpdate, -1));

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
      recovered: getStateById(statesRecoverdData, state.id)?.recovered ?? 0,
      abbreviation: getStateAbbreviationById(state.id),
      weekIncidence: (state.casesPerWeek / state.population) * 100000,
      casesPer100k: (state.cases / state.population) * 100000,
      delta: {
        cases: getStateById(statesNewCasesData, state.id)?.cases ?? 0,
        deaths: getStateById(statesNewDeathsData, state.id)?.deaths ?? 0,
        recovered:
          getStateById(statesNewRecoveredData, state.id)?.recovered ?? 0,
        weekIncidence:
          (state.casesPerWeek / state.population) * 100000 - yesterdayIncidence,
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

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;

  const statesHistoryData = await getLastStateCasesHistory(days, id);

  const highDate = AddDaysToDate(statesHistoryData.lastUpdate, -1); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01

  const data: StatesCasesHistory = fill0CasesDays(
    statesHistoryData,
    lowDate,
    highDate,
    RegionType.states,
    RequestType.cases
  );

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

  const statesHistoryCasesData = await StatesCasesHistoryResponse(
    days,
    abbreviation
  );
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

  const incidenceData: StatesWeekIncidenceHistory = {};

  for (const abbr of Object.keys(statesHistoryCasesData.data)) {
    const stateHistory = statesHistoryCasesData.data[abbr].history;
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
        weekIncidence: (sum / state.population) * 100000,
        date: date,
      });
    }
  }

  return {
    data: incidenceData,
    meta: statesHistoryCasesData.meta,
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

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;

  const statesHistoryData = await getLastStateDeathsHistory(days, id);
  const highDate = AddDaysToDate(statesHistoryData.lastUpdate, -1); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01

  const data: StatesDeathsHistory = fill0CasesDays(
    statesHistoryData,
    lowDate,
    highDate,
    RegionType.states,
    RequestType.deaths
  );

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

  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;

  const statesHistoryData = await getLastStateRecoveredHistory(days, id);
  const highDate = AddDaysToDate(statesHistoryData.lastUpdate, -1); //highest date, witch is "datenstand" -1
  const lowDate = days
    ? AddDaysToDate(highDate, (days - 1) * -1)
    : new Date("2020-01-01"); // lowest date if days is set, else set lowdate to 2020-01-01

  const data: StatesRecoveredHistory = fill0CasesDays(
    statesHistoryData,
    lowDate,
    highDate,
    RegionType.states,
    RequestType.recovered
  );

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
  if (days && isNaN(days)) {
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
  const id = abbreviation ? getStateIdByAbbreviation(abbreviation) : null;

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
    [key: string]: FrozenIncidenceData;
  };
}

export async function StatesFrozenIncidenceHistoryResponse(
  days?: number,
  abbreviation?: string
): Promise<StatesFrozenIncidenceHistoryData> {
  const frozenIncidenceHistoryData = await getStatesFrozenIncidenceHistory(
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
