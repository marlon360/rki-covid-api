import { IResponseMeta, ResponseMeta } from "./meta";
import { getRValueHistory, RValueEntry } from "../data-requests/r-value";

interface RValueHistoryData extends IResponseMeta {
  data: RValueEntry[];
}

export async function RValueHistoryHistoryResponse(): Promise<RValueHistoryData> {
  const rValueHistory = await getRValueHistory();
  return {
    data: rValueHistory.data,
    meta: new ResponseMeta(rValueHistory.lastUpdate),
  };
}
