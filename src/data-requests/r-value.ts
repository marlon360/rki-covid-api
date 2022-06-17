import axios from "axios";
import XLSX from "xlsx";

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
  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet);

  const latestEntry = json[json.length - 1];
  const rValue4DaysDateString = latestEntry["Datum"];
  // since 2021-07-17 the RKI no longer provide the 4-day-r-value
  // so that the value has to be calculated

  // sum of the daily cases in the last 4 days
  let numerator = 0;
  for (let offset = 1; offset < 5; offset++) {
    numerator += json[json.length - offset]["PS_COVID_Faelle"];
  }

  // sum of four daily cases 4 days ago
  let denominator = 0;
  for (let offset = 5; offset < 9; offset++) {
    denominator += json[json.length - offset]["PS_COVID_Faelle"];
  }
  const rValue4Days = Math.round((numerator / denominator) * 100) / 100;

  // the 7-day r-value is always one day before the 4-day r-value!
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
  const meta = await axios.get(
    `https://github.com/robert-koch-institut/SARS-CoV-2-Nowcasting_und_-R-Schaetzung/raw/main/Metadaten/zenodo.json`
  );
  return {
    data: rData,
    lastUpdate: new Date(meta.data.publication_date),
  };
}
