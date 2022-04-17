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
  "A05-A17": {
    total: number;
    "A05-A11": number;
    "A12-A17": number;
  };
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
    novavax: number;
  };
  delta: number;
  quote: number;
  quotes: quotes;
  secondVaccination: {
    vaccinated: number;
    vaccination: {
      biontech: number;
      moderna: number;
      astraZeneca: number;
      novavax: number;
    };
    delta: number;
    quote: number;
    quotes: quotes;
  };
  boosterVaccination: {
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
        novavax: number;
      };
      delta: number;
      quote: number;
      quotes: quotes;
      secondVaccination: {
        vaccinated: number;
        vaccination: {
          biontech: number;
          moderna: number;
          astraZeneca: number;
          novavax: number;
        };
        delta: number;
        quote: number;
        quotes: quotes;
      };
      boosterVaccination: {
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
    firstVaccination: number;
    firstBiontech: number;
    firstModerna: number;
    firstAstraZeneca: number;
    firstJanssen: number;
    firstNovavax: number;
    firstDifference: number;
    fullVaccinated: number;
    fullBiontech: number;
    fullModerna: number;
    fullAstraZeneca: number;
    fullNovavax: number;
    fullDifference: number;
    boosterVaccination: number;
    boosterBiontech: number;
    boosterModerna: number;
    boosterJanssen: number;
    boosterDifference: number;
  }>(sheet, {
    header: [
      "ags",
      "state",
      "firstVaccination",
      "firstBiontech",
      "firstModerna",
      "firstAstraZeneca",
      "firstJanssen",
      "firstNovavax",
      "firstDifference",
      "fullVaccinated",
      "fullBiontech",
      "fullModerna",
      "fullAstraZeneca",
      "fullNovavax",
      "fullDifference",
      "boosterVaccination",
      "boosterBiontech",
      "boosterModerna",
      "boosterJanssen",
      "boosterDifference",
    ],
    range: "A4:T21",
  });

  const quoteSheet = workbook.Sheets[workbook.SheetNames[1]];
  const quoteJson = XLSX.utils.sheet_to_json<{
    ags: number;
    state: string;
    vaccination: number;
    n1st: number;
    n2nd: number;
    n3rd: number;
    q1st: number;
    q1stls18: number;
    q1st5to11: number;
    q1st12to17: number;
    q1st18plus: number;
    q1st18to59: number;
    q1stgr60: number;
    q2nd: number;
    q2ndls18: number;
    q2nd5to11: number;
    q2nd12to17: number;
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
      "n2nd",
      "n3rd",
      "q1st",
      "q1stls18",
      "q1st5to11",
      "q1st12to17",
      "q1st18plus",
      "q1st18to59",
      "q1stgr60",
      "q2nd",
      "q2ndls18",
      "q2nd5to11",
      "q2nd12to17",
      "q2nd18plus",
      "q2nd18to59",
      "q2ndgr60",
      "q3rd",
      "q3rdls18",
      "q3rd18plus",
      "q3rd18to59",
      "q3rdgr60",
    ],
    range: "A4:Y21",
  });

  const coverage: VaccinationCoverage = {
    administeredVaccinations: 0,
    vaccinated: 0,
    vaccination: {
      biontech: 0,
      moderna: 0,
      astraZeneca: 0,
      janssen: 0,
      novavax: 0,
    },
    delta: 0,
    quote: 0,
    quotes: {
      total: 0,
      "A05-A17": {
        total: 0,
        "A05-A11": 0,
        "A12-A17": 0,
      },
      "A18+": {
        total: 0,
        "A18-A59": 0,
        "A60+": 0,
      },
    },
    secondVaccination: {
      vaccinated: 0,
      vaccination: {
        biontech: 0,
        moderna: 0,
        astraZeneca: 0,
        novavax: 0,
      },
      delta: 0,
      quote: 0,
      quotes: {
        total: 0,
        "A05-A17": {
          total: 0,
          "A05-A11": 0,
          "A12-A17": 0,
        },
        "A18+": {
          total: 0,
          "A18-A59": 0,
          "A60+": 0,
        },
      },
    },
    boosterVaccination: {
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
        "A05-A17": {
          total: 0,
          "A05-A11": 0,
          "A12-A17": 0,
        },
        "A18+": {
          total: 0,
          "A18-A59": 0,
          "A60+": 0,
        },
      },
    },
    latestDailyVaccinations: {
      date: null,
      firstVaccination: 0,
      secondVaccination: 0,
      boosterVaccination: 0,
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
        biontech: entry.firstBiontech,
        moderna: entry.firstModerna,
        astraZeneca: entry.firstAstraZeneca,
        janssen: entry.firstJanssen,
        novavax: entry.firstNovavax == null ? null : entry.firstNovavax,
      };
      coverage.delta = entry.firstDifference;
      coverage.quote =
        quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3);
      coverage.quotes.total =
        quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3);
      coverage.quotes["A05-A17"].total =
        quotes.q1stls18 === null
          ? null
          : limitDecimals(quotes.q1stls18 / 100.0, 3);
      coverage.quotes["A05-A17"]["A05-A11"] =
        quotes.q1st5to11 === null
          ? null
          : limitDecimals(quotes.q1st5to11 / 100.0, 3);
      coverage.quotes["A05-A17"]["A12-A17"] =
        quotes.q1st12to17 === null
          ? null
          : limitDecimals(quotes.q1st12to17 / 100.0, 3);
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
      coverage.secondVaccination = {
        vaccinated: quotes.n2nd,
        vaccination: {
          biontech: entry.fullBiontech,
          moderna: entry.fullModerna,
          astraZeneca: entry.fullAstraZeneca,
          novavax: entry.fullNovavax === null ? null : entry.fullNovavax,
        },
        delta: entry.fullDifference,
        quote:
          quotes.q2nd === null ? null : limitDecimals(quotes.q2nd / 100.0, 3),
        quotes: {
          total:
            quotes.q2nd === null ? null : limitDecimals(quotes.q2nd / 100.0, 3),
          "A05-A17": {
            total:
              quotes.q2ndls18 === null
                ? null
                : limitDecimals(quotes.q2ndls18 / 100.0, 3),
            "A05-A11":
              quotes.q2nd5to11 === null
                ? null
                : limitDecimals(quotes.q2nd5to11 / 100.0, 3),
            "A12-A17":
              quotes.q2nd12to17 === null
                ? null
                : limitDecimals(quotes.q2nd12to17 / 100.0, 3),
          },
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
      coverage.boosterVaccination = {
        vaccinated: entry.boosterVaccination,
        vaccination: {
          biontech: entry.boosterBiontech,
          moderna: entry.boosterModerna,
          janssen: entry.boosterJanssen,
        },
        delta: entry.boosterDifference,
        quote:
          quotes.q3rd === null ? null : limitDecimals(quotes.q3rd / 100.0, 3),
        quotes: {
          total:
            quotes.q3rd === null ? null : limitDecimals(quotes.q3rd / 100.0, 3),
          "A05-A17": {
            total:
              quotes.q3rdls18 === null
                ? null
                : limitDecimals(quotes.q3rdls18 / 100.0, 3),
            "A05-A11": null, // not publisched at this time!
            "A12-A17":
              quotes.q3rdls18 === null
                ? null
                : limitDecimals(quotes.q3rdls18 / 100.0, 3),
          },
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
          biontech: entry.firstBiontech,
          moderna: entry.firstModerna,
          astraZeneca: entry.firstAstraZeneca,
          janssen: entry.firstJanssen,
          novavax: entry.firstNovavax === null ? null : entry.firstNovavax,
        },
        delta: entry.firstDifference,
        quote:
          quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3),
        quotes: {
          total:
            quotes.q1st === null ? null : limitDecimals(quotes.q1st / 100.0, 3),
          "A05-A17": {
            total:
              quotes.q1stls18 === null
                ? null
                : limitDecimals(quotes.q1stls18 / 100.0, 3),
            "A05-A11":
              quotes.q1st5to11 === null
                ? null
                : limitDecimals(quotes.q1st5to11 / 100.0, 3),
            "A12-A17":
              quotes.q1st12to17 === null
                ? null
                : limitDecimals(quotes.q1st12to17 / 100.0, 3),
          },
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
        secondVaccination: {
          vaccinated: quotes.n2nd,
          vaccination: {
            biontech: entry.fullBiontech,
            moderna: entry.fullModerna,
            astraZeneca: entry.fullAstraZeneca,
            novavax: entry.fullNovavax === null ? null : entry.fullNovavax,
          },
          delta: entry.fullDifference,
          quote:
            quotes.q2nd === null ? null : limitDecimals(quotes.q2nd / 100.0, 3),
          quotes: {
            total:
              quotes.q2nd === null
                ? null
                : limitDecimals(quotes.q2nd / 100.0, 3),
            "A05-A17": {
              total:
                quotes.q2ndls18 === null
                  ? null
                  : limitDecimals(quotes.q2ndls18 / 100.0, 3),
              "A05-A11":
                quotes.q2nd5to11 === null
                  ? null
                  : limitDecimals(quotes.q2nd5to11 / 100.0, 3),
              "A12-A17":
                quotes.q2nd12to17 === null
                  ? null
                  : limitDecimals(quotes.q2nd12to17 / 100.0, 3),
            },
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
        boosterVaccination: {
          vaccinated: entry.boosterVaccination,
          vaccination: {
            biontech: entry.boosterBiontech,
            moderna: entry.boosterModerna,
            janssen: entry.boosterJanssen,
          },
          delta: entry.boosterDifference,
          quote:
            quotes.q3rd === null ? null : limitDecimals(quotes.q3rd / 100.0, 3),
          quotes: {
            total:
              quotes.q3rd === null
                ? null
                : limitDecimals(quotes.q3rd / 100.0, 3),
            "A05-A17": {
              total:
                quotes.q3rdls18 === null
                  ? null
                  : limitDecimals(quotes.q3rdls18 / 100.0, 3),
              "A05-A11": null, // not published at this time!
              "A12-A17":
                quotes.q3rdls18 === null
                  ? null
                  : limitDecimals(quotes.q2ndls18 / 100.0, 3),
            },
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
  firstVaccination: number;
  secondVaccination: number;
  boosterVaccination: number;
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
    const boostVac = entry["Auffrischungsimpfung"] || entry["Auffrischimpfung"];
    if (typeof entry.Datum == "string") {
      const dateString: string = entry.Datum;
      const DateNew: Date = new Date(dateString.replace(pattern, "$3-$2-$1"));
      vaccinationHistory.push({
        date: DateNew,
        vaccinated: firstVac ?? 0, // legacy attribute
        firstVaccination: firstVac ?? 0,
        secondVaccination: secVac ?? 0,
        boosterVaccination: boostVac ?? 0,
      });
    } else if (entry.Datum instanceof Date) {
      vaccinationHistory.push({
        date: entry.Datum,
        vaccinated: firstVac ?? 0, // legacy attribute
        firstVaccination: firstVac ?? 0,
        secondVaccination: secVac ?? 0,
        boosterVaccination: boostVac ?? 0,
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
