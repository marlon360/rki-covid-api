import { IResponseMeta, ResponseMeta } from './meta'
import { getVaccinationCoverage, VaccinationCoverage, getVaccinationHistory, VaccinationHistoryEntry } from '../data-requests/vaccination'

interface VaccinationData extends IResponseMeta {
    data: VaccinationCoverage
}

export async function VaccinationResponse(abbreviation?: string): Promise<VaccinationData> {

    const vaccinationData = await getVaccinationCoverage();

    return {
        data: vaccinationData.data,
        meta: new ResponseMeta(vaccinationData.lastUpdate)
    }
}

interface VaccinationHistoryData extends IResponseMeta {
    data: {
        history: VaccinationHistoryEntry[]
    }
}

export async function VaccinationHistoryResponse(): Promise<VaccinationHistoryData> {

    const vaccinationData = await getVaccinationHistory();

    return {
        data: {
            history: vaccinationData.data
        },
        meta: new ResponseMeta(vaccinationData.lastUpdate)
    }
}