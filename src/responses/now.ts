import { getCases, getDeaths, getNewCases, getNewDeaths, getNewRecovered, getRecovered, getStatesData } from '../requests';
import { IResponseMeta, ResponseMeta } from './meta'

interface NowData extends IResponseMeta {
    cases: number,
    deaths: number,
    recovered: number,
    weekIncidence: number,
    casesPerWeek: number,
    casesPer100k: number,
    delta: {
        cases: number,
        deaths: number,
        recovered: number
    }
}

export async function NowResponse(): Promise<NowData> {

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
        meta: new ResponseMeta(casesData.lastUpdate)
    }
}