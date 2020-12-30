import { IResponseMeta, ResponseMeta } from './meta'
import { getVaccinationCoverage, VaccinationCoverage } from '../data-requests/vaccination'

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