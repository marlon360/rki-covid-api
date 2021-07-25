import axios from "axios";
import XLSX from "xlsx";
import { AddDaysToDate } from "../utils";

function parseRValue(
  data: ArrayBuffer
): {
  rValue4Days: {
    value: number;
    date: Date;
  };
  rValue7Days: {
    value: number;
    date: Date;
  };
} | null {
  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet);

  const latestEntry = json[json.length - 1];
  const rValue4DaysDateString = latestEntry["Datum"];
  // since 2021-07-17 the RKI no longer provide the 4-day-r-value
  // so that the value has to be calculated
  let numerator = 0 as number;
  for (let Offset = 1; Offset < 5; Offset++) {
    numerator += json[json.length - Offset]["PS_COVID_Faelle"];
  }
  let denominator = 0 as number;
  for (let Offset = 5; Offset < 9; Offset++) {
    denominator += json[json.length - Offset]["PS_COVID_Faelle"];
  }
  const rValue4Days = Math.round((numerator / denominator) * 100) / 100;

  // the 7-day r-value is always one day bevor the 4-day r-value!
  const entry = json[json.length - 2];
  const rValue7DaysDateString = entry["Datum"];
  const rValue7Days = entry["PS_7_Tage_R_Wert"];

  const rValue4DaysDate = new Date(rValue4DaysDateString);
  const rValue7DaysDate = new Date(rValue7DaysDateString);

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
  const response = await axios.get(
    `https://raw.githubusercontent.com/robert-koch-institut/SARS-CoV-2-Nowcasting_und_-R-Schaetzung/main/Nowcast_R_aktuell.csv`,
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  const rData = parseRValue(data);
  return {
    data: rData,
    lastUpdate: AddDaysToDate(rData.rValue4Days.date, 4), // the lastUpdate Date is rValue4Days.date + 4 Days
  };
}
