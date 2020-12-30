import { IResponseMeta, ResponseMeta } from './meta'
import { getLastCasesHistory, getCases, getDeaths, getNewCases, getNewDeaths, getNewRecovered, getRecovered, getRValue, getStatesData, getLastDeathsHistory } from '../requests';

interface GermanyData extends IResponseMeta {
    cases: number,
    deaths: number,
    recovered: number,
    weekIncidence: number,
    casesPerWeek: number,
    casesPer100k: number,
    r: {
        value: number,
        date: Date
    },
    delta: {
        cases: number,
        deaths: number,
        recovered: number
    }
}

export async function GermanyResponse(): Promise<GermanyData> {

    const casesData = await getCases();
    const deathsData = await getDeaths();
    const recoveredData = await getRecovered();

    const newCasesData = await getNewCases();
    const newDeathsData = await getNewDeaths();
    const newRecoveredData = await getNewRecovered();

    const statesData = await getStatesData();

    // calculate week incidence
    let population = 0;
    let casesPerWeek = 0;
    for (const state of statesData.data) {
        population += state.population;
        casesPerWeek += state.casesPerWeek;
    }

    const weekIncidence = casesPerWeek / population * 100000;
    const casesPer100k = casesData.data / population * 100000;

    const rData = await getRValue();

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
            recovered: newRecoveredData.data
        },
        r: {
            value: rData.data,
            date: rData.lastUpdate
        },
        meta: new ResponseMeta(statesData.lastUpdate)
    }
}

interface GermanyHistoryData<T> extends IResponseMeta {
    data: T[],
    meta: ResponseMeta
}

export async function GermanyCasesHistoryResponse(days?: number): Promise<GermanyHistoryData<{cases: number, date: Date}>> {
    const history = await getLastCasesHistory(days);
    return {
        data: history,
        meta: new ResponseMeta(new Date(history[history.length - 1].date))
    }
}

export async function GermanyDeathsHistoryResponse(days?: number): Promise<GermanyHistoryData<{deaths: number, date: Date}>> {
    const history = await getLastDeathsHistory(days);
    return {
        data: history,
        meta: new ResponseMeta(new Date(history[history.length - 1].date))
    }
}