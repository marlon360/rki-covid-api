import { IResponseMeta, ResponseMeta } from './meta'
import { getLastStateCasesHistory, getLastStateDeathsHistory, getLastStateRecoveredHistory, getNewStateCases, getNewStateDeaths, getStatesData, getStatesRecoveredData, IStateData, getNewStateRecovered } from '../data-requests/states';
import { getStateAbbreviationById, getStateIdByAbbreviation } from '../utils'
import { ResponseData } from '../data-requests/response-data';

interface StateData extends IStateData {
    abbreviation: string,
    weekIncidence: number,
    casesPer100k: number,
    delta: {
        cases: number,
        deaths: number,
        recovered: number
    }
}

interface StatesData extends IResponseMeta {
    data: {
        [key: string]: StateData
    }
}

export async function StatesResponse(abbreviation?: string): Promise<StatesData> {

    const statesData = await getStatesData();
    const statesRecoverdData = await getStatesRecoveredData();
    const statesNewCasesData = await getNewStateCases();
    const statesNewDeathsData = await getNewStateDeaths();
    const statesNewRecoveredData = await getNewStateRecovered();

    function getStateById (data: ResponseData<any[]>, id: number): any | null {
        for (const state of data.data) {
            if (state.id == id) return state;
        }
        return null
    }    

    let states = statesData.data.map((state) => {
        return {
            ...state,
            recovered: getStateById(statesRecoverdData, state.id)?.recovered ?? 0,
            abbreviation: getStateAbbreviationById(state.id),
            weekIncidence: state.casesPerWeek / state.population * 100000,
            casesPer100k: state.cases / state.population * 100000,
            delta: {
                cases: getStateById(statesNewCasesData, state.id)?.cases ?? 0,
                deaths: getStateById(statesNewDeathsData, state.id)?.deaths ?? 0,
                recovered: getStateById(statesNewRecoveredData, state.id)?.recovered ?? 0
            }
        }
    })

    if (abbreviation != null) {
        const id = getStateIdByAbbreviation(abbreviation);
        if (id != null) {
            states = states.filter((state) => {
                return state.id == id
            })
        }
    }

    const statesKey = {}
    for (const state of states) {
        statesKey[state.abbreviation] = state
    }

    return {
        data: statesKey,
        meta: new ResponseMeta(statesData.lastUpdate)
    }

}

interface StateHistory<T> {
    id: number,
    name: string,
    history: T[]
}
interface StatesHistoryData<T> extends IResponseMeta {
    data: T
}

interface StatesCasesHistory {
    [key: string]: StateHistory<{cases: number, date: Date}>
}
export async function StatesCasesHistoryResponse(days?: number, abbreviation?: string): Promise<StatesHistoryData<StatesCasesHistory>> {
    
    let id = null;
    if (abbreviation != null) {
        id = getStateIdByAbbreviation(abbreviation);
    }

    const statesHistoryData = await getLastStateCasesHistory(days, id);

    const data: StatesCasesHistory = {}

    for (const historyData of statesHistoryData.data) {
        const abbr = getStateAbbreviationById(historyData.id);
        if (data[abbr] == null) {
            data[abbr] = {
                id: historyData.id, 
                name: historyData.name,
                history: []
            }
        }
        data[abbr].history.push({
            cases: historyData.cases,
            date: new Date(historyData.date)
        })
    }
    return {
        data,
        meta: new ResponseMeta(statesHistoryData.lastUpdate)
    };
}

interface StatesDeathsHistory {
    [key: string]: StateHistory<{deaths: number, date: Date}>
}
export async function StatesDeathsHistoryResponse(days?: number, abbreviation?: string): Promise<StatesHistoryData<StatesDeathsHistory>> {
    
    let id = null;
    if (abbreviation != null) {
        id = getStateIdByAbbreviation(abbreviation);
    }

    const statesHistoryData = await getLastStateDeathsHistory(days, id);

    const data: StatesDeathsHistory = {}

    for (const historyData of statesHistoryData.data) {
        const abbr = getStateAbbreviationById(historyData.id);
        if (data[abbr] == null) {
            data[abbr] = {
                id: historyData.id, 
                name: historyData.name,
                history: []
            }
        }
        data[abbr].history.push({
            deaths: historyData.deaths,
            date: new Date(historyData.date)
        })
    }
    return {
        data,
        meta: new ResponseMeta(statesHistoryData.lastUpdate)
    };
}

interface StatesRecoveredHistory {
    [key: string]: StateHistory<{recovered: number, date: Date}>
}
export async function StatesRecoveredHistoryResponse(days?: number, abbreviation?: string): Promise<StatesHistoryData<StatesRecoveredHistory>> {
    
    let id = null;
    if (abbreviation != null) {
        id = getStateIdByAbbreviation(abbreviation);
    }

    const statesHistoryData = await getLastStateRecoveredHistory(days, id);

    const data: StatesRecoveredHistory = {}

    for (const historyData of statesHistoryData.data) {
        const abbr = getStateAbbreviationById(historyData.id);
        if (data[abbr] == null) {
            data[abbr] = {
                id: historyData.id, 
                name: historyData.name,
                history: []
            }
        }
        data[abbr].history.push({
            recovered: historyData.recovered,
            date: new Date(historyData.date)
        })
    }
    return {
        data,
        meta: new ResponseMeta(statesHistoryData.lastUpdate)
    };
}