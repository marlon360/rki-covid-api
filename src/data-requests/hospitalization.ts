import axios from "axios";
import XLSX from "xlsx";
import { ResponseData } from "./response-data";

export interface AgeGroups {
  "A00-A04": AgeGroupData;
  "A05-A14": AgeGroupData;
  "A15-A34": AgeGroupData;
  "A35-A59": AgeGroupData;
  "A60-A79": AgeGroupData;
  "A80+": AgeGroupData;
}

export interface AgeGroupData {
  cases7Days: number;
  incidence7Days: number;
}

export interface HospitalizationData {
  [date: string]: {
    cases7Days: number;
    incidence7Days: number;
    ageGroups: AgeGroups;
    states: {
      [state: string]: {
        cases7Days: number;
        incidence7Days: number;
        ageGroups: AgeGroups;
      };
    };
  };
}

export async function getHospitalizationData(): Promise<ResponseData<HospitalizationData>> {
  const response = await axios.get(
    `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/Aktuell_Deutschland_COVID-19-Hospitalisierungen.csv`,
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  const workbook = XLSX.read(data, {
    type: "buffer",
    codepage: 65001, // Codepage 65001 = UTF8
    raw: true, // because some fields are interpreted as dates read the data "raw"
  });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // rawread all fields are strings!
  const json = XLSX.utils.sheet_to_json<{
    date: string;
    state: string;
    id: string;
    ageGroup: string;
    cases7days: string;
    incidence7days: string;
  }>(sheet, {
    header: ["date", "state", "id", "ageGroup", "cases7days", "incidence7days"],
    range: 1,
  });

  const hospitalizationData: HospitalizationData = {};

  json.forEach((element) => {
    const date = new Date(element.date);
    // read entry for the date
    let dateEntry = hospitalizationData[date.toISOString()];

    // create new object if the entry does not exist
    if (!dateEntry) {
      dateEntry = {
        cases7Days: undefined,
        incidence7Days: undefined,
        ageGroups: {} as AgeGroups,
        states: {},
      };
    }

    // default hospitalization data entry
    let hospitalizationDataEntry = {
      cases7Days: undefined,
      incidence7Days: undefined,
      ageGroups: {} as AgeGroups,
    };

    // if "Bundesgebiet" write data to the root of the date entry, else add to "states" property
    if (element.state === "Bundesgebiet") {
      // get the current data for "Bundesgebiet"
      hospitalizationDataEntry = { ...hospitalizationDataEntry, ...dateEntry}
    } else {
      // get the current data of the state
      hospitalizationDataEntry = { ...hospitalizationDataEntry, ...dateEntry.states[element.state] }
    }

    // write to root if "00+" (all age groups combined) or if it is a specific age group to the "ageGroups" property
    switch (element.ageGroup) {
      case "00+":
        hospitalizationDataEntry.cases7Days = parseInt(element.cases7days);
        hospitalizationDataEntry.incidence7Days = parseFloat(
          element.incidence7days
        );
        break;
      case "00-04":
        hospitalizationDataEntry.ageGroups["A00-A04"] = {
          cases7Days: parseInt(element.cases7days),
          incidence7Days: parseFloat(element.incidence7days),
        };
        break;
      case "05-14":
        hospitalizationDataEntry.ageGroups["A05-A14"] = {
          cases7Days: parseInt(element.cases7days),
          incidence7Days: parseFloat(element.incidence7days),
        };
        break;
      case "15-34":
        hospitalizationDataEntry.ageGroups["A15-A34"] = {
          cases7Days: parseInt(element.cases7days),
          incidence7Days: parseFloat(element.incidence7days),
        };
        break;
      case "35-59":
        hospitalizationDataEntry.ageGroups["A35-A59"] = {
          cases7Days: parseInt(element.cases7days),
          incidence7Days: parseFloat(element.incidence7days),
        };
        break;
      case "60-79":
        hospitalizationDataEntry.ageGroups["A60-A79"] = {
          cases7Days: parseInt(element.cases7days),
          incidence7Days: parseFloat(element.incidence7days),
        };
        break;
      case "80+":
        hospitalizationDataEntry.ageGroups["A80+"] = {
          cases7Days: parseInt(element.cases7days),
          incidence7Days: parseFloat(element.incidence7days),
        };
        break;
      default:
        break;
    }

    // write data to object
    if (element.state === "Bundesgebiet") {
      dateEntry = {
        ...hospitalizationDataEntry,
        states: dateEntry.states,
      };
    } else {
      dateEntry.states[element.state] = hospitalizationDataEntry;
    }
    hospitalizationData[date.toISOString()] = dateEntry;
  });

  const meta = await axios.get(
    `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/.zenodo.json`
  );
  const lastUpdate = new Date(meta.data.publication_date);

  return {
    data: hospitalizationData,
    lastUpdate: lastUpdate,
  };
}


export function getLatestHospitalizationDataKey (hospitalizationData: HospitalizationData) {  
  return Object.keys(hospitalizationData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  })[0]
}