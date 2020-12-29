import { IResponseMeta, ResponseMeta } from './meta'
import { getNewStateCases, getNewStateDeaths, getStatesData, IStateData, ResponseData } from '../requests';

interface StateData extends IStateData {
    weekIncidence: number,
    casesPer100k: number,
    delta: {
        cases: number,
        deaths: number
    }
}

interface StatesData extends IResponseMeta {
    states: StateData[]
}

export async function StatesResponse(): Promise<StatesData> {

    const statesData = await getStatesData();
    const statesNewCasesData = await getNewStateCases();
    const statesNewDeathsData = await getNewStateDeaths();

    function getStateById (data: ResponseData<any[]>, id: number): any | null {
        for (const state of data.data) {
            if (state.id == id) return state;
        }
        return null
    }    

    const states = statesData.data.map((state) => {
        return {
            ...state,
            weekIncidence: state.casesPerWeek / state.population * 100000,
            casesPer100k: state.cases / state.population * 100000,
            delta: {
                cases: getStateById(statesNewCasesData, state.id)?.cases ?? 0,
                deaths: getStateById(statesNewDeathsData, state.id)?.deaths ?? 0
            }
        }
    })

    return {
        states,
        meta: new ResponseMeta(statesData.lastUpdate)
    }

}