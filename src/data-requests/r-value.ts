import axios from "axios";
import XLSX from "xlsx";
import { Response_rData } from "./response-data";

function parseRValue(
  data: ArrayBuffer
): { r4: number; date_r4: Date; r7: number; date_r7: Date } | null {
  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[1]];
  const json = XLSX.utils.sheet_to_json(sheet);

  const latestEntryr4 = json[json.length - 1];
  const latestEntryr7 = json[json.length - 2];
  // The RKI is very creative in naming the columns!
    const dateString_r4 =
    latestEntryr4["Datum des Erkrankungsbeginns"] ||
    latestEntryr4["Datum des Erkrankungs-beginns"];
  let r4Value =
    latestEntryr4["Punktschätzer des 4-Tage R-Wertes"] ||
    latestEntryr4["Punktschätzer der 4-Tage R-Wert"] ||
    latestEntryr4["Punktschätzer des 4-Tage-R-Wertes"] ||
    latestEntryr4["Punktschätzer des 4-Tage-R Wertes"];
  const dateString_r7 =
    latestEntryr7["Datum des Erkrankungsbeginns"] ||
    latestEntryr7["Datum des Erkrankungs-beginns"];
  let r7Value =
    latestEntryr7["Punktschätzer des 7-Tage R-Wertes"] ||
    latestEntryr7["Punktschätzer der 7-Tage R-Wert"] ||
    latestEntryr7["Punktschätzer des 7-Tage-R-Wertes"] ||
    latestEntryr7["Punktschätzer des 7-Tage-R Wertes"];

  if (typeof r4Value === "string" || r4Value instanceof String) {
    r4Value = parseFloat(r4Value.replace(",", "."));
  }
  if (typeof r7Value === "string" || r7Value instanceof String) {
    r7Value = parseFloat(r7Value.replace(",", "."));
  }
  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  const date_r4 = new Date(dateString_r4.replace(pattern, "$3-$2-$1"));
  const date_r7 = new Date(dateString_r7.replace(pattern, "$3-$2-$1"));

  return {
    r4: r4Value,
    date_r4,
    r7: r7Value,
    date_r7,
  };
}

export async function getRValue(): Promise<Response_rData> {
  const response = await axios.get(
    `https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen.xlsx?__blob=publicationFile`,
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  const rData = parseRValue(data);
  return {
    data_r4: rData.r4,
    lastUpdate_r4: rData.date_r4,
    data_r7: rData.r7,
    lastUpdate_r7: rData.date_r7,
  };
}
