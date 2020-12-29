import { getLastCasesHistory, getStatesData } from '../requests';
import { IResponseMeta, ResponseMeta } from './meta'

interface GermanyCasesHistoryData extends IResponseMeta {
    data: {
        cases: number;
        date: number;
    }[],
    meta: ResponseMeta
}

export async function GermanyCasesHistoryResponse(days?: number): Promise<GermanyCasesHistoryData> {
    const history = await getLastCasesHistory(days);
    return {
        data: history,
        meta: new ResponseMeta(new Date(history[history.length - 1].date))
    }
}