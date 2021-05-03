import axios from "axios";
import XLSX from "xlsx";
import { ResponseData } from "./response-data";

const rValueURL =
  "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen.xlsx?__blob=publicationFile";

function parseRValueRow(row: unknown): { r: number; date: Date } | null {
  let latestEntry = row;
  const dateString =
    latestEntry["Datum des Erkrankungsbeginns"] ||
    latestEntry["Datum des Erkrankungs-beginns"];
  let rValue =
    latestEntry["Punktschätzer des 4-Tage R-Wertes"] ||
    latestEntry["Punktschätzer der 4-Tage R-Wert"] ||
    latestEntry["Punktschätzer des 4-Tage-R-Wertes"];

  if (typeof rValue === "string" || rValue instanceof String) {
    rValue = parseFloat(rValue.replace(",", "."));
  }

  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  const date = new Date(dateString.replace(pattern, "$3-$2-$1"));

  return {
    r: rValue,
    date,
  };
}

export async function getRValue(): Promise<ResponseData<number>> {
  const response = await axios.get(rValueURL, {
    responseType: "arraybuffer",
  });
  const data = response.data;

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[1]];
  const json = XLSX.utils.sheet_to_json(sheet);
  const latestEntry = json[json.length - 1];
  const rData: { r: number; date: Date } = parseRValueRow(latestEntry);

  return {
    data: rData.r,
    lastUpdate: rData.date,
  };
}
