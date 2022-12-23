import { IResponseMeta, ResponseMeta } from "./meta";
import { getRValueHistory, RValueHistoryEntry } from "../data-requests/r-value";

interface RValueHistoryData extends IResponseMeta {
  data: RValueHistoryEntry[];
}

export async function RValueHistoryHistoryResponse(
  days?: number
): Promise<RValueHistoryData> {
  if (days != null) {
    if (isNaN(days)) {
      throw new TypeError(
        "Wrong format for ':days' parameter! This is not a number."
      );
    } else if (days <= 0) {
      throw new TypeError("':days' parameter must be > '0'");
    }
  }
  const rValueHistory = await getRValueHistory(days);
  return {
    data: rValueHistory.data,
    meta: new ResponseMeta(rValueHistory.lastUpdate),
  };
}
