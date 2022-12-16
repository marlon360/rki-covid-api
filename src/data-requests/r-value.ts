import axios from "axios";
import XLSX from "xlsx";
import { getDateBefore, RKIError } from "../utils";
import { ResponseData } from "./response-data";

export interface RValueHistoryEntry {
  rValue4Days: number;
  rValue7Days: number;
  date: Date;
}

function sumInterval (data: unknown[], startRow: number, intervalStart:number, intervalEnd: number, fieldName: string): number {
  let sum = 0;
  for (let offset = intervalStart; offset <= intervalEnd; offset++){
    sum += data[startRow - offset][fieldName];
  }
  return sum;
}

const rValueDataUrl =
  "https://raw.githubusercontent.com/robert-koch-institut/SARS-CoV-2-Nowcasting_und_-R-Schaetzung/main/Nowcast_R_aktuell.csv";

const rValueMetaUrl =
  "https://github.com/robert-koch-institut/SARS-CoV-2-Nowcasting_und_-R-Schaetzung/raw/main/Metadaten/zenodo.json";
  
function parseRValue(data: ArrayBuffer): {
  rValue4Days: {
    value: number;
    date: Date;
  };
  rValue7Days: {
    value: number;
    date: Date;
  };
} | null {
  const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet);

  const latestIndex = json.length - 1;
  const rValue4DaysDate = new Date(json[latestIndex]["Datum"]);
  // since 2021-07-17 the RKI no longer provide the 4-day-r-value
  // so that the value has to be calculated
  // R_Wert[t] <- sum(data$NeuErkr[t-0:3]) / sum(data$NeuErkr[t-4:7])
  
  // sum of the daily cases in the last 4 days
  const numerator = sumInterval(json, latestIndex, 0, 3, "PS_COVID_Faelle");
  // sum of four daily cases 4 days ago
  const denominator = sumInterval(json, latestIndex, 4, 7, "PS_COVID_Faelle");
  const rValue4Days = Math.round((numerator / denominator) * 100) / 100;

  // the 7-day r-value is always one day before the 4-day r-value!
  const rValue7DaysDate = new Date(json[latestIndex -1]["Datum"]);
  const rValue7Days = json[latestIndex - 1]["PS_7_Tage_R_Wert"];

  return {
    rValue4Days: {
      value: rValue4Days,
      date: rValue4DaysDate,
    },
    rValue7Days: {
      value: rValue7Days,
      date: rValue7DaysDate,
    },
  };
}

export async function getRValue() {
  const response = await axios.get(rValueDataUrl, {responseType: "arraybuffer"});
  const data = response.data;
  const rData = parseRValue(data);
  const meta = await axios.get(rValueMetaUrl);
  return {
    data: rData,
    lastUpdate: new Date(meta.data.publication_date),
  };
}

export async function getRValueHistory(
  days?: number
): Promise<ResponseData<RValueHistoryEntry[]>> {
  const response = await axios.get(rValueDataUrl, {
    responseType: "arraybuffer",
  });
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const meta = await axios.get(rValueMetaUrl);
  const lastUpdate = new Date(meta.data.publication_date);

  const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  let json = XLSX.utils.sheet_to_json(sheet);

  // since 2021-07-17 the RKI no longer provide the 4-day-r-value
  // so that the value has to be calculated
  // R_Wert[t] <- sum(data$NeuErkr[t-0:3]) / sum(data$NeuErkr[t-4:7])

  for (let index = json.length - 1; index >= 7; index--) {
    // sum of the daily cases in the last 4 days
    const numerator = sumInterval(json, index, 0, 3, "PS_COVID_Faelle");
    // sum of four daily cases 4 days ago
    const denominator = sumInterval(json, index, 4, 7, "PS_COVID_Faelle");
    json[index]["rValue4Days"] = Math.round((numerator / denominator) * 100) / 100;
  }
  let history: RValueHistoryEntry[] = json.map((row) => {
    return {
      rValue7Days: row["PS_7_Tage_R_Wert"],
      rValue4Days: row["rValue4Days"],
      date: new Date(row["Datum"]),
    };
  });
  // the first 4 entries are always null
  history = history.slice(4);

  if (days != null) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((element) => element.date > reference_date);
  }

  return {
    data: history,
    lastUpdate: lastUpdate,
  };
}