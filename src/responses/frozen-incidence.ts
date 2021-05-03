import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getFrozenIncidenceHistory,
  FrozenIncidenceData,
} from "../data-requests/frozen-incidence";

interface FrozenIncidenceHistoryData extends IResponseMeta {
  data: {
    [key: string]: FrozenIncidenceData;
  };
}

export async function FrozenIncidenceHistoryResponse(): Promise<FrozenIncidenceHistoryData> {
  const FrozenIncidenceData = await getFrozenIncidenceHistory();

  const data: {
    [key: string]: FrozenIncidenceData;
  } = {};

  for (const element of FrozenIncidenceData.data) {
    data[element.ags] = element;
  }

  return {
    data: data,
    meta: new ResponseMeta(FrozenIncidenceData.lastUpdate),
  };
}
