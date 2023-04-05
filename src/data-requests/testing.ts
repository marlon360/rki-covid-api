import axios from "axios";
import XLSX from "xlsx";
import { ResponseData } from "./response-data";
import { RKIError, limit } from "../utils";

export interface testingHistoryEntry {
  calendarWeek: string;
  performedTests: number;
  positiveTests: number;
  positivityRate: number;
  laboratoryCount: number;
}

export async function getTestingHistory(
  weeks?: number
): Promise<ResponseData<testingHistoryEntry[]>> {
  const testingDataUrl =
    "https://github.com/robert-koch-institut/SARS-CoV-2-PCR-Testungen_in_Deutschland/raw/main/SARS-CoV-2-PCR-Testungen_in_Deutschland.xlsx";

  const testingMetaUrl =
    "https://github.com/robert-koch-institut/SARS-CoV-2-PCR-Testungen_in_Deutschland/raw/main/Metadaten/zenodo.json";

  const response = await axios.get(testingDataUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  var workbook = XLSX.read(data, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<{
    date: string;
    tests_total: number;
    tests_total_accumulated: number;
    tests_positive: number;
    tests_positive_accumulated: number;
    tests_positive_ratio: number;
    laboratories_tests: number;
    capacities_daily: number;
    capacities_weekly_theoretically: number;
    capacities_weeklyweek_actually: number;
    laboratories_capacities: number;
    laboratories_samplebacklog: number;
    samplebacklog: number;
  }>(sheet);

  let testingHistory: testingHistoryEntry[] = [];

  for (const entry of json) {
    const dateSplit = entry.date.split("-");
    const dateStr = `${dateSplit[1].substring(1).padStart(2, "0")}/${
      dateSplit[0]
    }`;
    testingHistory.push({
      calendarWeek: dateStr,
      performedTests: entry.tests_total ?? null,
      positiveTests: entry.tests_positive ?? null,
      positivityRate:
        limit(entry.tests_positive / entry.tests_total, 4) ?? null,
      laboratoryCount: entry.laboratories_tests ?? null,
    });
  }

  if (weeks != null) {
    testingHistory = testingHistory.slice(-weeks);
  }
  const meta = await axios.get(testingMetaUrl);

  return {
    data: testingHistory,
    lastUpdate: new Date(meta.data.publication_date),
  };
}
