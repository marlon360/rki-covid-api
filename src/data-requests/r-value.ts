import axios from "axios";
import XLSX from "xlsx";
import { getDateBefore, RKIError } from "../utils";
import { ResponseData } from "./response-data";

const rValueURL =
  "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen.xlsx?__blob=publicationFile";

export interface RValueEntry {
  r: number;
  date: Date;
}

function parseRValueRow(row: unknown): RValueEntry | null {
  const dateString =
    row["Datum des Erkrankungsbeginns"] || row["Datum des Erkrankungs-beginns"];
  let rValue =
    row["Punktschätzer des 4-Tage R-Wertes"] ||
    row["Punktschätzer der 4-Tage R-Wert"] ||
    row["Punktschätzer des 4-Tage-R-Wertes"];

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
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const lastModified = response.headers["last-modified"];
  const lastUpdate = lastModified ? new Date(lastModified) : new Date();

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[1]];
  const json = XLSX.utils.sheet_to_json(sheet);
  const latestEntry = json[json.length - 1];
  const rData: RValueEntry = parseRValueRow(latestEntry);

  return {
    data: rData.r,
    lastUpdate: lastUpdate,
  };
}

export async function getRValueHistory(
  days?: number
): Promise<ResponseData<RValueEntry[]>> {
  const response = await axios.get(rValueURL, {
    responseType: "arraybuffer",
  });
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const lastModified = response.headers["last-modified"];
  const lastUpdate = lastModified ? new Date(lastModified) : new Date();

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[1]];
  const json = XLSX.utils.sheet_to_json(sheet);
  let history: RValueEntry[] = json.map((row) => parseRValueRow(row));

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
