import { IResponseMeta, ResponseMeta } from "./meta";
import { getRValueHistory, RValueHistoryEntry } from "../data-requests/r-value";

interface RValueHistoryData extends IResponseMeta {
  data: RValueHistoryEntry[];
}

export async function RValueHistoryHistoryResponse(
  days?: number
): Promise<RValueHistoryData> {
  const rValueHistory = await getRValueHistory(days);
  return {
    data: rValueHistory.data,
    meta: new ResponseMeta(rValueHistory.lastUpdate),
  };
}
