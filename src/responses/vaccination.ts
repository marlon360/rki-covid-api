import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getVaccinationCoverage,
  VaccinationCoverage,
  getVaccinationHistory,
  VaccinationHistoryEntry,
} from "../data-requests/vaccination";

interface VaccinationData extends IResponseMeta {
  data: VaccinationCoverage;
}

export async function VaccinationResponse(
  abbreviation?: string
): Promise<VaccinationData> {
  const vaccinationData = await getVaccinationCoverage();
  const vaccinationDataOut = { data: undefined };
  if (abbreviation) {
    vaccinationDataOut.data = { [abbreviation]: undefined };
    vaccinationDataOut.data[abbreviation] =
      vaccinationData.data.states[abbreviation];
  } else {
    vaccinationData.data = vaccinationData.data;
  }
  return {
    data: vaccinationDataOut.data,
    meta: new ResponseMeta(vaccinationData.lastUpdate),
  };
}

interface VaccinationHistoryData extends IResponseMeta {
  data: {
    history: VaccinationHistoryEntry[];
  };
}

export async function VaccinationHistoryResponse(
  days?: number
): Promise<VaccinationHistoryData> {
  const vaccinationData = await getVaccinationHistory(days);

  return {
    data: {
      history: vaccinationData.data,
    },
    meta: new ResponseMeta(vaccinationData.lastUpdate),
  };
}
