import axios from "axios";
import XLSX from "xlsx";

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
  const rValue4Days = null; // no longer provided by RKI
  
  let rValue7DaysDateString = latestEntry["Datum"];
  let rValue7Days = latestEntry["PS_7_Tage_R_Wert"];
  if (rValue7Days == null) {
    const entry = json[json.length - 2];
    rValue7DaysDateString = entry["Datum"];
    rValue7Days = entry["PS_7_Tage_R_Wert"];
  }

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
    lastUpdate: rData.rValue7Days.date,
  };
}
