import axios from "axios";
import XLSX from "xlsx";
import { RKIError, AddDaysToDate } from "../utils";
import { ResponseData } from "./response-data";

export interface FrozenIncidenceData {
  ags: string;
  name: string;
  history: {
    date: string;
    value: number;
  }[];
}

export async function getFrozenIncidenceHistory(
  days?: number,
  ags?: string
): Promise<ResponseData<FrozenIncidenceData[]>> {
  const response = await axios.get(
    "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab.xlsx?__blob=publicationFile",
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets["LK_7-Tage-Inzidenz"];
  // table starts in row 5 (parameter is zero indexed)
  const json = XLSX.utils.sheet_to_json(sheet, { range: 4 });
  const date_pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  // date is in cell A2
  const dateString = sheet["A2"].v
    .replace("Stand: ", "")
    .replace(date_pattern, "$3-$2-$1");
  const lastUpdate = new Date(dateString);

  let districts = json.map((district) => {
    const name = district["LK"];
    const ags = district["LKNR"].toString().padStart(5, "0");

    let history = [];

    // get all date keys
    const dateKeys = Object.keys(district);
    // ignore the first three elements (rowNumber, LK, LKNR)
    // and read only required dates if days: != null
    dateKeys.splice(0, days != null ? dateKeys.length - days : 3);
    dateKeys.forEach((dateKey) => {
      const dateString = dateKey.toString().replace(date_pattern, "$3-$2-$1");
      const date = AddDaysToDate(
        new Date(dateString), -1
      );
      history.push({ weekIncidence: district[dateKey], date });
    });

    return { ags, name, history };
  });

  if (ags != null) {
    districts = districts.filter((district) => district.ags === ags);
  }

  return {
    data: districts,
    lastUpdate: lastUpdate,
  };
}
