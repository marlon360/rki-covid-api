import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getVaccinationCoverage,
  VaccinationCoverage,
  getVaccinationHistory,
  VaccinationHistoryEntry,
} from "../data-requests/vaccination";
import { getStateAbbreviationById } from "../utils";

interface VaccinationData extends IResponseMeta {
  data: VaccinationCoverage;
}

export async function VaccinationResponse(): Promise<VaccinationData> {
  const vaccinationData = await getVaccinationCoverage();
  return {
    data: vaccinationData.data,
    meta: new ResponseMeta(vaccinationData.lastUpdate),
  };
}

export async function VaccinationGermanyResponse(): Promise<VaccinationData> {
  const vaccinationData = await getVaccinationCoverage();
  delete vaccinationData.data.states;
  return {
    data: vaccinationData.data,
    meta: new ResponseMeta(vaccinationData.lastUpdate),
  };
}

function isAbbreviationValid(abbreviation: string) {
  let abbreviationList = [];
  for (let id = 1; id <= 16; id++) {
    abbreviationList[id - 1] = getStateAbbreviationById(id);
  }
  return abbreviationList.includes(abbreviation);
}

export async function VaccinationStatesResponse(
  abbreviation?: string
): Promise<VaccinationData> {
  const vaccinationData = await getVaccinationCoverage();
  const vaccinationDataOut = { data: undefined };
  if (abbreviation && isAbbreviationValid(abbreviation)) {
    const tempData = { data: undefined };
    tempData.data = {
      [abbreviation]: vaccinationData.data.states[abbreviation],
    };
    vaccinationDataOut.data = { ...vaccinationDataOut.data, ...tempData.data };
  } else {
    for (let id = 1; id <= 16; id++) {
      const tempData = { data: undefined };
      tempData.data = {
        [getStateAbbreviationById(id)]:
          vaccinationData.data.states[getStateAbbreviationById(id)],
      };
      vaccinationDataOut.data = {
        ...vaccinationDataOut.data,
        ...tempData.data,
      };
    }
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
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const vaccinationData = await getVaccinationHistory(days);

  return {
    data: {
      history: vaccinationData.data,
    },
    meta: new ResponseMeta(vaccinationData.lastUpdate),
  };
}
