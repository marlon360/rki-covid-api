import axios from "axios";
import { ResponseData } from "./response-data";
import XLSX from "xlsx";
import {
  cleanupString,
  getDateBefore,
  getStateAbbreviationByName,
} from "../utils";

function clearEntry(entry: any) {
  for (const key in entry) {
    if (Object.prototype.hasOwnProperty.call(entry, key)) {
      const element = entry[key];
      if (element === "-") {
        entry[key] = null;
      }
    }
  }
}

export interface VaccinationCoverage {
  administeredVaccinations: number;
  vaccinated: number;
  vaccination: {
    biontech: number;
    moderna: number;
    astraZeneca: number;
    janssen: number;
  };
  delta: number;
  quote: number;
  secondVaccination: {
    vaccinated: number;
    vaccination: {
      biontech: number;
      moderna: number;
      astraZeneca: number;
      janssen: number;
    };
    delta: number;
    quote: number;
  };
  indication: {
    age: number;
    job: number;
    medical: number;
    nursingHome: number;
    secondVaccination: {
      age: number;
      job: number;
      medical: number;
      nursingHome: number;
    };
  };
  latestDailyVaccinations: VaccinationHistoryEntry;
  states: {
    [abbreviation: string]: {
      name: string;
      administeredVaccinations: number;
      vaccinated: number;
      vaccination: {
        biontech: number;
        moderna: number;
        astraZeneca: number;
        janssen: number;
      };
      delta: number;
      quote: number;
      secondVaccination: {
        vaccinated: number;
        vaccination: {
          biontech: number;
          moderna: number;
          astraZeneca: number;
          janssen: number;
        };
        delta: number;
        quote: number;
      };
      indication: {
        age: number;
        job: number;
        medical: number;
        nursingHome: number;
        secondVaccination: {
          age: number;
          job: number;
          medical: number;
          nursingHome: number;
        };
      };
    };
  };
}

export async function getVaccinationCoverage(): Promise<
  ResponseData<VaccinationCoverage>
> {
  const response = await axios.get(
    `https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile`,
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  const lastModified = response.headers["last-modified"];
  const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

  var workbook = XLSX.read(data, { type: "buffer" });

  const sheet = workbook.Sheets[workbook.SheetNames[2]];
  const json = XLSX.utils.sheet_to_json<{
    ags: number;
    state: string;
    firstVaccination: number;
    firstBiontech: number;
    firstModerna: number;
    firstAstraZeneca: number;
    firstJanssen: number;
    firstDifference: number;
    fullVaccinated: number;
    fullBiontech: number;
    fullModerna: number;
    fullAstraZeneca: number;
    fullJanssen: number;
    fullDifference: number;
  }>(sheet, {
    header: [
      "ags",
      "state",
      "firstVaccination",
      "firstBiontech",
      "firstModerna",
      "firstAstraZeneca",
      "firstJanssen",
      "firstDifference",
      "fullVaccinated",
      "fullBiontech",
      "fullModerna",
      "fullAstraZeneca",
      "fullJanssen",
      "fullDifference",
    ],
    range: "A4:N21",
  });

  const quoteSheet = workbook.Sheets[workbook.SheetNames[1]];
  const quoteJson = XLSX.utils.sheet_to_json<{
    ags: number;
    state: string;
    totalvaccination: number;
    total1: number;
    totalfull: number;
    quote1: number;
    quote1_ls18: number;
    quote1_18to59: number;
    quote1_gr60: number;
    quotefull: number;
    quotefull_ls18: number;
    quotefull_18to59: number;
    quotefull_gr60: number;
  }>(quoteSheet, {
    header: [
      "ags",
      "state",
      "totalvaccination",
      "total1",
      "totalfull",
      "quote1",
      "quote1_ls18",
      "quote1_18to59",
      "quote1_gr60",
      "quotefull",
      "quotefull_ls18",
      "quotefull_18to59",
      "quotefull_gr60",
    ],
    range: "A4:M21",
  });

  const coverage: VaccinationCoverage = {
    administeredVaccinations: 0,
    vaccinated: 0,
    vaccination: {
      biontech: 0,
      moderna: 0,
      astraZeneca: 0,
      janssen: 0,
    },
    delta: 0,
    quote: 0,
    secondVaccination: {
      vaccinated: 0,
      vaccination: {
        biontech: 0,
        moderna: 0,
        astraZeneca: 0,
        janssen: 0,
      },
      delta: 0,
      quote: 0,
    },
    latestDailyVaccinations: {
      date: null,
      firstVaccination: 0,
      secondVaccination: 0,
      vaccinated: 0,
    },
    indication: {
      age: null,
      job: null,
      medical: null,
      nursingHome: null,
      secondVaccination: {
        age: null,
        job: null,
        medical: null,
        nursingHome: null,
      },
    },
    states: {},
  };

  for (let i = 0; i < 18; i++) {
    const entry = json[i];
    clearEntry(entry);
    const quoteEntry = quoteJson[i];
    clearEntry(quoteEntry);

    if (entry.state == "Gesamt") {
      coverage.administeredVaccinations = quoteEntry.totalvaccination;
      coverage.vaccinated = quoteEntry.total1;
      coverage.vaccination = {
        biontech: entry.firstBiontech,
        moderna: entry.firstModerna,
        astraZeneca: entry.firstAstraZeneca,
        janssen: entry.firstJanssen,
      };
      coverage.delta = entry.firstDifference;
      coverage.quote =
        quoteEntry.quote1 === null ? null : quoteEntry.quote1 / 100.0;
      coverage.secondVaccination = {
        vaccinated: quoteEntry.totalfull,
        vaccination: {
          biontech: entry.fullBiontech,
          moderna: entry.fullModerna,
          astraZeneca: entry.fullAstraZeneca,
          janssen: entry.fullJanssen,
        },
        delta: entry.fullDifference,
        quote:
          quoteEntry.quotefull === null ? null : quoteEntry.quotefull / 100.0,
      };
      coverage.indication = {
        age: null,
        job: null,
        medical: null,
        nursingHome: null,
        secondVaccination: {
          age: null,
          job: null,
          medical: null,
          nursingHome: null,
        },
      };
    } else {
      const cleanedStateName = cleanupString(entry.state);
      // cleanedStateName should always be cleaned
      const abbreviation = entry.state.includes("Bund")
        ? "Bund"
        : getStateAbbreviationByName(cleanedStateName);
      coverage.states[abbreviation] = {
        name: cleanedStateName,
        administeredVaccinations: quoteEntry.totalvaccination,
        vaccinated: quoteEntry.total1,
        vaccination: {
          biontech: entry.firstBiontech,
          moderna: entry.firstModerna,
          astraZeneca: entry.firstAstraZeneca,
          janssen: entry.firstJanssen,
        },
        delta: entry.firstDifference,
        quote: quoteEntry.quote1 === null ? null : quoteEntry.quote1 / 100.0,
        secondVaccination: {
          vaccinated: quoteEntry.totalfull,
          vaccination: {
            biontech: entry.fullBiontech,
            moderna: entry.fullModerna,
            astraZeneca: entry.fullAstraZeneca,
            janssen: entry.fullJanssen,
          },
          delta: entry.fullDifference,
          quote:
            quoteEntry.quotefull === null ? null : quoteEntry.quotefull / 100.0,
        },
        indication: {
          age: null,
          job: null,
          medical: null,
          nursingHome: null,
          secondVaccination: {
            age: null,
            job: null,
            medical: null,
            nursingHome: null,
          },
        },
      };
    }
  }

  const historySheet = workbook.Sheets[workbook.SheetNames[3]];
  const vaccinationHistory = extractVaccinationHistory(historySheet);
  coverage.latestDailyVaccinations =
    vaccinationHistory[vaccinationHistory.length - 1];

  return {
    data: coverage,
    lastUpdate: lastUpdate,
  };
}

export interface VaccinationHistoryEntry {
  date: Date;
  vaccinated: number;
  firstVaccination: number;
  secondVaccination: number;
}

function extractVaccinationHistory(
  sheet: any,
  days?: number
): VaccinationHistoryEntry[] {
  const json = XLSX.utils.sheet_to_json<{
    Datum: Date;
  }>(sheet);

  let vaccinationHistory: VaccinationHistoryEntry[] = [];
  const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  for (const entry of json) {
    const firstVac =
      entry["Erstimpfung"] ||
      entry["Erstimpfungen"] ||
      entry["mindestens einmal geimpft"];
    const secVac =
      entry["Zweitimpfung"] ||
      entry["Zweitimpfungen"] ||
      entry["vollständig geimpt"] ||
      entry["vollständig geimpft"];
    if (typeof entry.Datum == "string") {
      const dateString: string = entry.Datum;
      const DateNew: Date = new Date(dateString.replace(pattern, "$3-$2-$1"));
      vaccinationHistory.push({
        date: DateNew,
        vaccinated: firstVac ?? 0, // legacy attribute
        firstVaccination: firstVac ?? 0,
        secondVaccination: secVac ?? 0,
      });
    } else if (entry.Datum instanceof Date) {
      vaccinationHistory.push({
        date: entry.Datum,
        vaccinated: firstVac ?? 0, // legacy attribute
        firstVaccination: firstVac ?? 0,
        secondVaccination: secVac ?? 0,
      });
    }
  }

  if (days == null) {
    days = json.length;
  } //to filter out undefined dates
  const reference_date = new Date(getDateBefore(days + 1));
  vaccinationHistory = vaccinationHistory.filter(
    (element) => element.date > reference_date
  );

  return vaccinationHistory;
}

export async function getVaccinationHistory(
  days?: number
): Promise<ResponseData<VaccinationHistoryEntry[]>> {
  const response = await axios.get(
    `https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile`,
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  const lastModified = response.headers["last-modified"];
  const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });

  const sheet = workbook.Sheets[workbook.SheetNames[3]];
  const vaccinationHistory = extractVaccinationHistory(sheet, days);

  return {
    data: vaccinationHistory,
    lastUpdate: lastUpdate,
  };
}
