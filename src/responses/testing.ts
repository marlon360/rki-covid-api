import { IResponseMeta, ResponseMeta } from "./meta";
import {
  getTestingHistory,
  testingHistoryEntry,
} from "../data-requests/testing";

interface TestingHistoryData extends IResponseMeta {
  data: {
    history: testingHistoryEntry[];
  };
}

export async function TestingHistoryResponse(
  weeks?: number
): Promise<TestingHistoryData> {
  if (weeks != null) {
    if (isNaN(weeks)) {
      throw new TypeError(
        "Wrong format for ':weeks' parameter! This is not a number."
      );
    } else if (weeks <= 0) {
      throw new TypeError("':weeks' parameter must be > '0'");
    }
  }
  const TestingData = await getTestingHistory(weeks);

  return {
    data: {
      history: TestingData.data,
    },
    meta: new ResponseMeta(TestingData.lastUpdate),
  };
}
