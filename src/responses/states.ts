import { IResponseMeta, ResponseMeta } from './meta'
import { getStatesData, IStateData } from '../requests';

interface StateData extends IStateData {
    weekIncidence: number,
    casesPer100k: number
}

interface StatesData extends IResponseMeta {
    states: StateData[]
}

export async function StatesResponse(): Promise<StatesData> {

    const statesData = await getStatesData();

    const states = statesData.data.map((state) => {
        return {
            ...state,
            weekIncidence: state.casesPerWeek / state.population * 100000,
            casesPer100k: state.cases / state.population * 100000
        }
    })

    return {
        states,
        meta: new ResponseMeta(statesData.lastUpdate)
    }

}