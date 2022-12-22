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
  const TestingData = await getTestingHistory(weeks);

  return {
    data: {
      history: TestingData.data,
    },
    meta: new ResponseMeta(TestingData.lastUpdate),
  };
}
