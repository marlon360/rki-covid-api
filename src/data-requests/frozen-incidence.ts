import axios from "axios";
import XLSX from "xlsx";
import { RKIError } from "../utils";
import { ResponseData } from "./response-data";

export interface FrozenIncidenceData {
  ags: string;
  name: string;
  history: {
    date: string;
    value: number;
  }[];
}

export async function getFrozenIncidenceHistory(): Promise<
  ResponseData<FrozenIncidenceData[]>
> {
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
  const json = XLSX.utils.sheet_to_json(sheet);
  const header = json.shift();
  const dateString = Object.keys(json[0])[0].replace("Stand: ", "");
  const lastUpdate = new Date(dateString);

  const districts = json.map((element) => {
    // one district in each row

    const keys = Object.keys(element); // columns
    keys.shift(); // rowNumber
    const name = element[keys.shift()];
    const ags = element[keys.shift()].toString().padStart(5, "0");

    let history = [];
    keys.forEach((key) => {
      const date_pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
      const date = new Date(
        header[key].toString().replace(date_pattern, "$3-$2-$1")
      );
      history.push({ weekIncidence: element[key], date });
    });

    return {
      ags,
      name,
      history: history.slice(Math.max(history.length - 30, 0)),
    };
  });

  return {
    data: districts,
    lastUpdate: lastUpdate,
  };
}
