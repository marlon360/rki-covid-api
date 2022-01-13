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

interface quotes {
  total: number;
  "A12-A17": number;
  "A18+": {
    total: number;
    "A18-A59": number;
    "A60+": number;
  };
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
  quotes: quotes;
  n2ndVaccination: {
    vaccinated: number;
    vaccination: {
      biontech: number;
      moderna: number;
      astraZeneca: number;
    };
    delta: number;
    quote: number;
    quotes: quotes;
  };
  n3rdVaccination: {
    vaccinated: number;
    vaccination: {
      biontech: number;
      moderna: number;
      janssen: number;
    };
    delta: number;
    quote: number;
    quotes: quotes;
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
      quotes: quotes;
      n2ndVaccination: {
        vaccinated: number;
        vaccination: {
          biontech: number;
          moderna: number;
          astraZeneca: number;
        };
        delta: number;
        quote: number;
        quotes: quotes;
      };
      n3rdVaccination: {
        vaccinated: number;
        vaccination: {
          biontech: number;
          moderna: number;
          janssen: number;
        };
        delta: number;
        quote: number;
        quotes: quotes;
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
    n1stVaccination: number;
    n1stBiontech: number;
    n1stModerna: number;
    n1stAstraZeneca: number;
    n1stJanssen: number;
    n1stDifference: number;
    n2ndVaccinated: number;
    n2ndBiontech: number;
    n2ndModerna: number;
    n2ndAstraZeneca: number;
    n2ndDifference: number;
    n3rdVaccination: number;
    n3rdBiontech: number;
    n3rdModerna: number;
    n3rdJanssen: number;
    n3rdDifference: number;
  }>(sheet, {
    header: [
      "ags",
      "state",
      "n1stVaccination",
      "n1stBiontech",
      "n1stModerna",
      "n1stAstraZeneca",
      "n1stJanssen",
      "n1stDifference",
      "n2ndVaccinated",
      "n2ndBiontech",
      "n2ndModerna",
      "n2ndAstraZeneca",
      "n2ndDifference",
      "n3rdVaccination",
      "n3rdBiontech",
      "n3rdModerna",
      "n3rdJanssen",
      "n3rdDifference",
    ],
    range: "A4:R21",
  });

  const quoteSheet = workbook.Sheets[workbook.SheetNames[1]];
  const quoteJson = XLSX.utils.sheet_to_json<{
    ags: number;
    state: string;
    vaccination: number;
    n1st: number;
    n1st5to11: number;
    n2nd: number;
    n3rd: number;
    q1st: number;
    q1stls18: number;
    q1st18plus: number;
    q1st18to59: number;
    q1stgr60: number;
    q2nd: number;
    q2ndls18: number;
    q2nd18plus: number;
    q2nd18to59: number;
    q2ndgr60: number;
    q3rd: number;
    q3rdls18: number;
    q3rd18plus: number;
    q3rd18to59: number;
    q3rdgr60: number;
  }>(quoteSheet, {
    header: [
      "ags",
      "state",
      "vaccination",
      "n1st",
      "n1st5to11:",
      "n2nd",
      "n3rd",
      "q1st",
      "q1stls18",
      "q1st18plus",
      "q1st18to59",
      "q1stgr60",
      "q2nd",
      "q2ndls18",
      "q2nd18plus",
      "q2nd18to59",
      "q2ndgr60",
      "q3rd",
      "q3rdls18",
      "q3rd18plus",
      "q3rd18to59",
      "q3rdgr60",
    ],
    range: "A4:V21",
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
    quotes: {
      total: 0,
      "A12-A17": 0,
      "A18+": {
        total: 0,
        "A18-A59": 0,
        "A60+": 0,
      },
    },
    n2ndVaccination: {
      vaccinated: 0,
      vaccination: {
        biontech: 0,
        moderna: 0,
        astraZeneca: 0,
      },
      delta: 0,
      quote: 0,
      quotes: {
        total: 0,
        "A12-A17": 0,
        "A18+": {
          total: 0,
          "A18-A59": 0,
          "A60+": 0,
        },
      },
    },
    n3rdVaccination: {
      vaccinated: 0,
      vaccination: {
        biontech: 0,
        moderna: 0,
        janssen: 0,
      },
      delta: 0,
      quote: 0,
      quotes: {
        total: 0,
        "A12-A17": 0,
        "A18+": {
          total: 0,
          "A18-A59": 0,
          "A60+": 0,
        },
      },
    },
    latestDailyVaccinations: {
      date: null,
      n1stVaccination: 0,
      n2ndVaccination: 0,
      n3rdVaccination: 0,
      vaccinated: 0,
    },
    states: {},
  };

  for (let i = 0; i < 18; i++) {
    const entry = json[i];
    clearEntry(entry);
    const quotes = quoteJson[i];
    clearEntry(quotes);

    if (entry.state == "Gesamt") {
      coverage.administeredVaccinations = quotes.vaccination;
      coverage.vaccinated = quotes.n1st;
      coverage.vaccination = {
        biontech: entry.n1stBiontech,
        moderna: entry.n1stModerna,
        astraZeneca: entry.n1stAstraZeneca,
        janssen: entry.n1stJanssen,
      };
      coverage.delta = entry.n1stDifference;
      coverage.quote =
        quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3);
      coverage.quotes.total =
        quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3);
      coverage.quotes["A12-A17"] =
        quotes.q1stls18 === null
          ? null
          : limitDecimals(quotes.q1stls18 / 100.0, 3);
      coverage.quotes["A18+"].total =
        quotes.q1st18plus === null
          ? null
          : limitDecimals(quotes.q1st18plus / 100.0, 3);
      coverage.quotes["A18+"]["A18-A59"] =
        quotes.q1st18to59 === null
          ? null
          : limitDecimals(quotes.q1st18to59 / 100.0, 3);
      coverage.quotes["A18+"]["A60+"] =
        quotes.q1stgr60 === null
          ? null
          : limitDecimals(quotes.q1stgr60 / 100.0, 3);
      coverage.n2ndVaccination = {
        vaccinated: quotes.n2nd,
        vaccination: {
          biontech: entry.n2ndBiontech,
          moderna: entry.n2ndModerna,
          astraZeneca: entry.n2ndAstraZeneca,
        },
        delta: entry.n2ndDifference,
        quote:
          quotes.q2nd === null ? null : limitDecimals(quotes.q2nd / 100.0, 3),
        quotes: {
          total:
            quotes.q2nd === null ? null : limitDecimals(quotes.q2nd / 100.0, 3),
          "A12-A17":
            quotes.q2ndls18 === null
              ? null
              : limitDecimals(quotes.q2ndls18 / 100.0, 3),
          "A18+": {
            total:
              quotes.q2nd18plus === null
                ? null
                : limitDecimals(quotes.q2nd18plus / 100.0, 3),
            "A18-A59":
              quotes.q2nd18to59 === null
                ? null
                : limitDecimals(quotes.q2nd18to59 / 100.0, 3),
            "A60+":
              quotes.q2ndgr60 === null
                ? null
                : limitDecimals(quotes.q2ndgr60 / 100.0, 3),
          },
        },
      };
      coverage.n3rdVaccination = {
        vaccinated: entry.n3rdVaccination,
        vaccination: {
          biontech: entry.n3rdBiontech,
          moderna: entry.n3rdModerna,
          janssen: entry.n3rdJanssen,
        },
        delta: entry.n3rdDifference,
        quote:
          quotes.q3rd === null ? null : limitDecimals(quotes.q3rd / 100.0, 3),
        quotes: {
          total:
            quotes.q3rd === null ? null : limitDecimals(quotes.q3rd / 100.0, 3),
          "A12-A17":
            quotes.q3rdls18 === null
              ? null
              : limitDecimals(quotes.q3rdls18 / 100.0, 3),
          "A18+": {
            total:
              quotes.q3rd18plus === null
                ? null
                : limitDecimals(quotes.q3rd18plus / 100.0, 3),
            "A18-A59":
              quotes.q3rd18to59 === null
                ? null
                : limitDecimals(quotes.q3rd18to59 / 100.0, 3),
            "A60+":
              quotes.q3rdgr60 === null
                ? null
                : limitDecimals(quotes.q3rdgr60 / 100.0, 3),
          },
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
        administeredVaccinations: quotes.vaccination,
        vaccinated: quotes.n1st,
        vaccination: {
          biontech: entry.n1stBiontech,
          moderna: entry.n1stModerna,
          astraZeneca: entry.n1stAstraZeneca,
          janssen: entry.n1stJanssen,
        },
        delta: entry.n1stDifference,
        quote:
          quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3),
        quotes: {
          total:
            quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3),
          "A12-A17":
            quotes.q1stls18 === null
              ? null
              : limitDecimals(quotes.q1stls18 / 100.0, 3),
          "A18+": {
            total:
              quotes.q1st18plus === null
                ? null
                : limitDecimals(quotes.q1st18plus / 100.0, 3),
            "A18-A59":
              quotes.q1st18to59 === null
                ? null
                : limitDecimals(quotes.q1st18to59 / 100.0, 3),
            "A60+":
              quotes.q1stgr60 === null
                ? null
                : limitDecimals(quotes.q1stgr60 / 100.0, 3),
          },
        },
        n2ndVaccination: {
          vaccinated: quotes.n2nd,
          vaccination: {
            biontech: entry.n2ndBiontech,
            moderna: entry.n2ndModerna,
            astraZeneca: entry.n2ndAstraZeneca,
          },
          delta: entry.n2ndDifference,
          quote:
            quotes.q2nd === null ? null : limitDecimals(quotes.q2nd / 100.0, 3),
          quotes: {
            total:
              quotes.q2nd === null
                ? null
                : limitDecimals(quotes.q2nd / 100.0, 3),
            "A12-A17":
              quotes.q2ndls18 === null
                ? null
                : limitDecimals(quotes.q2ndls18 / 100.0, 3),
            "A18+": {
              total:
                quotes.q2nd18plus === null
                  ? null
                  : limitDecimals(quotes.q2nd18plus / 100.0, 3),
              "A18-A59":
                quotes.q2nd18to59 === null
                  ? null
                  : limitDecimals(quotes.q2nd18to59 / 100.0, 3),
              "A60+":
                quotes.q2ndgr60 === null
                  ? null
                  : limitDecimals(quotes.q2ndgr60 / 100.0, 3),
            },
          },
        },
        n3rdVaccination: {
          vaccinated: entry.n3rdVaccination,
          vaccination: {
            biontech: entry.n3rdBiontech,
            moderna: entry.n3rdModerna,
            janssen: entry.n3rdJanssen,
          },
          delta: entry.n3rdDifference,
          quote:
            quotes.q3rd === null ? null : limitDecimals(quotes.q3rd / 100.0, 3),
          quotes: {
            total:
              quotes.q3rd === null
                ? null
                : limitDecimals(quotes.q3rd / 100.0, 3),
            "A12-A17":
              quotes.q3rdls18 === null
                ? null
                : limitDecimals(quotes.q2ndls18 / 100.0, 3),
            "A18+": {
              total:
                quotes.q3rd18plus === null
                  ? null
                  : limitDecimals(quotes.q3rd18plus / 100.0, 3),
              "A18-A59":
                quotes.q3rd18to59 === null
                  ? null
                  : limitDecimals(quotes.q3rd18to59 / 100.0, 3),
              "A60+":
                quotes.q3rdgr60 === null
                  ? null
                  : limitDecimals(quotes.q3rdgr60 / 100.0, 3),
            },
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

function limitDecimals(value: number, decimals: number): number {
  return parseFloat(value.toFixed(decimals));
}

export interface VaccinationHistoryEntry {
  date: Date;
  vaccinated: number;
  n1stVaccination: number;
  n2ndVaccination: number;
  n3rdVaccination: number;
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
    const n1stVac =
      entry["Erstimpfung"] ||
      entry["Erstimpfungen"] ||
      entry["mindestens einmal geimpft"];
    const n2ndVac =
      entry["Zweitimpfung"] ||
      entry["Zweitimpfungen"] ||
      entry["vollständig geimpt"] ||
      entry["vollständig geimpft"];
    const n3rdVac = entry["Auffrischungsimpfung"] || entry["Auffrischimpfung"];
    if (typeof entry.Datum == "string") {
      const dateString: string = entry.Datum;
      const DateNew: Date = new Date(dateString.replace(pattern, "$3-$2-$1"));
      vaccinationHistory.push({
        date: DateNew,
        vaccinated: n1stVac ?? 0, // legacy attribute
        n1stVaccination: n1stVac ?? 0,
        n2ndVaccination: n2ndVac ?? 0,
        n3rdVaccination: n3rdVac ?? 0,
      });
    } else if (entry.Datum instanceof Date) {
      vaccinationHistory.push({
        date: entry.Datum,
        vaccinated: n1stVac ?? 0, // legacy attribute
        n1stVaccination: n1stVac ?? 0,
        n2ndVaccination: n2ndVac ?? 0,
        n3rdVaccination: n3rdVac ?? 0,
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
