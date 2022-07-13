import axios from "axios";
import { ResponseData } from "./response-data";
import parse from "csv-parse";
import {
  cleanupString,
  getStateAbbreviationByName,
  getDateBefore,
  AddDaysToDate,
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
  vaccination: CoverageVaccine;
  delta: number;
  quote: number;
  quotes: CoverageQuotes;
  secondVaccination: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    quote: number;
    quotes: CoverageQuotes;
  };
  boosterVaccination: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    quote: number;
    quotes: CoverageQuotes;
  };
  "2ndBoosterVaccination": {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    quote: number;
    quotes: CoverageQuotes;
  };
  states: {
    [abbreviation: string]: {
      name: string;
      administeredVaccinations: number;
      vaccinated: number;
      vaccination: CoverageVaccine;
      delta: number;
      quote: number;
      quotes: CoverageQuotes;
      secondVaccination: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        quote: number;
        quotes: CoverageQuotes;
      };
      boosterVaccination: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        quote: number;
        quotes: CoverageQuotes;
      };
      "2ndBoosterVaccination": {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        quote: number;
        quotes: CoverageQuotes;
      };
    };
  };
}

interface CoverageQuotes {
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

interface Vaccine {
  total: number;
  astraZeneca: number;
  biontech: number;
  janssen: number;
  moderna: number;
  novavax: number;
}

interface CoverageVaccine {
  astraZeneca: number;
  biontech: number;
  janssen: number;
  moderna: number;
  novavax: number;
  deltaAstraZeneca: number;
  deltaBiontech: number;
  deltaJanssen: number;
  deltaModerna: number;
  deltaNovavax: number;
}

interface StateEntry {
  first: Vaccine;
  full: Vaccine;
  firstBooster: Vaccine;
  secondBooster: Vaccine;
}

interface VaccineVaccinationData {
  [state: string]: StateEntry;
}
[];

interface QuotesRegular {
  total: number;
  "5to17": number;
  "5to11": number;
  "12to17": number;
  "18plus": number;
  "18to59": number;
  "60plus": number;
}

interface QuotesBoost {
  total: number;
  "12to17": number;
  "18plus": number;
  "18to59": number;
  "60plus": number;
}

interface QuoteVaccinationData {
  [id: number]: {
    name: string;
    vaccination: {
      total: number;
      first: number;
      full: number;
      firstBooster: number;
      secondBooster: number;
    };
    quotes: {
      first: QuotesRegular;
      second: QuotesRegular;
      firstBooster: QuotesBoost;
      secondBooster: QuotesBoost;
    };
  };
}
[];

const DataPromise = async function (resolve, reject) {
  const url = this.url;
  // Create the parser
  const parser = parse({
    delimiter: ",",
    from: 2,
    cast: true,
    cast_date: true,
  });

  // get csv as stream
  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  // pipe csv stream to csv parser
  response.data.pipe(parser);

  // empty object, that gets filled including stateId 0 for "Bundesgebiet"
  const vaccinationDataObject: VaccineVaccinationData = {
    0: {
      first: {
        total: null,
        astraZeneca: null,
        biontech: null,
        janssen: null,
        moderna: null,
        novavax: null,
      },
      full: {
        total: null,
        astraZeneca: null,
        biontech: null,
        janssen: null,
        moderna: null,
        novavax: null,
      },
      firstBooster: {
        total: null,
        astraZeneca: null,
        biontech: null,
        janssen: null,
        moderna: null,
        novavax: null,
      },
      secondBooster: {
        total: null,
        astraZeneca: null,
        biontech: null,
        janssen: null,
        moderna: null,
        novavax: null,
      },
    },
  };

  // read the parser stream and add record to vaccinationDataObj
  parser.on("readable", function () {
    let record;
    while ((record = parser.read())) {
      let [date, stateId, vaccine, series, count] = record;
      // read entry for stateId
      let stateEntry = vaccinationDataObject[stateId];
      // create new object if the entry does not exist
      if (!stateEntry) {
        stateEntry = {
          first: {
            total: null,
            astraZeneca: null,
            biontech: null,
            janssen: null,
            moderna: null,
            novavax: null,
          },
          full: {
            total: null,
            astraZeneca: null,
            biontech: null,
            janssen: null,
            moderna: null,
            novavax: null,
          },
          firstBooster: {
            total: null,
            astraZeneca: null,
            biontech: null,
            janssen: null,
            moderna: null,
            novavax: null,
          },
          secondBooster: {
            total: null,
            astraZeneca: null,
            biontech: null,
            janssen: null,
            moderna: null,
            novavax: null,
          },
        };
      }

      // write data to stateEntry and id 0
      switch (series) {
        case 1:
          stateEntry.first.total += count;
          vaccinationDataObject[0].first.total += count;
          switch (vaccine) {
            case "AstraZeneca":
              stateEntry.first.astraZeneca += count;
              vaccinationDataObject[0].first.astraZeneca += count;
              break;
            case "Comirnaty":
              stateEntry.first.biontech += count;
              vaccinationDataObject[0].first.biontech += count;
              break;
            case "Janssen":
              stateEntry.first.janssen += count;
              vaccinationDataObject[0].first.janssen += count;
              break;
            case "Moderna":
              stateEntry.first.moderna += count;
              vaccinationDataObject[0].first.moderna += count;
              break;
            case "Novavax":
              stateEntry.first.novavax += count;
              vaccinationDataObject[0].first.novavax += count;
              break;
          }
          break;
        case 2:
          stateEntry.full.total += count;
          vaccinationDataObject[0].full.total += count;
          switch (vaccine) {
            case "AstraZeneca":
              stateEntry.full.astraZeneca += count;
              vaccinationDataObject[0].full.astraZeneca += count;
              break;
            case "Comirnaty":
              stateEntry.full.biontech += count;
              vaccinationDataObject[0].full.biontech += count;
              break;
            case "Janssen":
              stateEntry.full.janssen += count;
              vaccinationDataObject[0].full.janssen += count;
              break;
            case "Moderna":
              stateEntry.full.moderna += count;
              vaccinationDataObject[0].full.moderna += count;
              break;
            case "Novavax":
              stateEntry.full.novavax += count;
              vaccinationDataObject[0].full.novavax += count;
              break;
          }
          break;
        case 3:
          stateEntry.firstBooster.total += count;
          vaccinationDataObject[0].firstBooster.total += count;
          switch (vaccine) {
            case "AstraZeneca":
              stateEntry.firstBooster.astraZeneca += count;
              vaccinationDataObject[0].firstBooster.astraZeneca += count;
              break;
            case "Comirnaty":
              stateEntry.firstBooster.biontech += count;
              vaccinationDataObject[0].firstBooster.biontech += count;
              break;
            case "Janssen":
              stateEntry.firstBooster.janssen += count;
              vaccinationDataObject[0].firstBooster.janssen += count;
              break;
            case "Moderna":
              stateEntry.firstBooster.moderna += count;
              vaccinationDataObject[0].firstBooster.moderna += count;
              break;
            case "Novavax":
              stateEntry.firstBooster.novavax += count;
              vaccinationDataObject[0].firstBooster.novavax += count;
              break;
          }
          break;
        case 4:
          stateEntry.secondBooster.total += count;
          vaccinationDataObject[0].secondBooster.total += count;
          switch (vaccine) {
            case "AstraZeneca":
              stateEntry.secondBooster.astraZeneca += count;
              vaccinationDataObject[0].secondBooster.astraZeneca += count;
              break;
            case "Comirnaty":
              stateEntry.secondBooster.biontech += count;
              vaccinationDataObject[0].secondBooster.biontech += count;
              break;
            case "Janssen":
              stateEntry.secondBooster.janssen += count;
              vaccinationDataObject[0].secondBooster.janssen += count;
              break;
            case "Moderna":
              stateEntry.secondBooster.moderna += count;
              vaccinationDataObject[0].secondBooster.moderna += count;
              break;
            case "Novavax":
              stateEntry.secondBooster.novavax += count;
              vaccinationDataObject[0].secondBooster.novavax += count;
              break;
          }
          break;
      }
      vaccinationDataObject[stateId] = stateEntry;
    }
  });
  // Catch any error
  parser.on("error", function (err) {
    console.error(err.message);
    reject(err.message);
  });

  // When we are done, test that the parsed output matched what expected
  parser.on("end", function () {
    resolve(vaccinationDataObject);
  });
};

export async function getVaccinationCoverage(): Promise<
  ResponseData<VaccinationCoverage>
> {
  const url =
    "https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/master/Aktuell_Deutschland_Bundeslaender_COVID-19-Impfungen.csv";
  const actualDataPromise = new Promise<VaccineVaccinationData>(
    DataPromise.bind({ url: url })
  );

  const quoteDataPromise = new Promise<QuoteVaccinationData>(
    async (resolve, reject) => {
      // Create the parser
      const parser = parse({
        delimiter: ",",
        from: 2,
        cast: true,
        cast_date: true,
      });

      // get csv as stream
      const response = await axios({
        method: "get",
        url: "https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/master/Aktuell_Deutschland_Impfquoten_COVID-19.csv",
        responseType: "stream",
      });

      // pipe csv stream to csv parser
      response.data.pipe(parser);

      // empty object, that gets filled
      const quoteVaccinationDataObject: QuoteVaccinationData = {};

      // read the parser stream and add record to hospitalizationDataObject
      parser.on("readable", function () {
        let record;
        while ((record = parser.read())) {
          let [
            date,
            name,
            id,
            total,
            first,
            full,
            firstBooster,
            secondBooster,
            qFirstTotal,
            qFirst05bis17,
            qFirst05bis11,
            qFirst12bis17,
            qFirst18plus,
            qFirst18bis59,
            qFirst60plus,
            qFullTotal,
            qFull05bis17,
            qFull05bis11,
            qFull12bis17,
            qFull18plus,
            qFull18bis59,
            qFull60plus,
            q1BoostTotal,
            q1Boost12bis17,
            q1Boost18plus,
            q1Boost18bis59,
            q1Boost60plus,
            q2BoostTotal,
            q2Boost12bis17,
            q2Boost18plus,
            q2Boost18bis59,
            q2Boost60plus,
          ] = record;
          quoteVaccinationDataObject[id] = {
            name: name,
            vaccination: {
              total: total,
              first: first,
              full: full,
              firstBooster: firstBooster,
              secondBooster: secondBooster,
            },
            quotes: {
              first: {
                total: qFirstTotal,
                "5to17": qFirst05bis17,
                "5to11": qFirst05bis11,
                "12to17": qFirst12bis17,
                "18plus": qFirst18plus,
                "18to59": qFirst18bis59,
                "60plus": qFirst60plus,
              },
              second: {
                total: qFullTotal,
                "5to17": qFull05bis17,
                "5to11": qFull05bis11,
                "12to17": qFull12bis17,
                "18plus": qFull18plus,
                "18to59": qFull18bis59,
                "60plus": qFull60plus,
              },
              firstBooster: {
                total: q1BoostTotal,
                "12to17": q1Boost12bis17,
                "18plus": q1Boost18plus,
                "18to59": q1Boost18bis59,
                "60plus": q1Boost60plus,
              },
              secondBooster: {
                total: q2BoostTotal,
                "12to17": q2Boost12bis17,
                "18plus": q2Boost18plus,
                "18to59": q2Boost18bis59,
                "60plus": q2Boost60plus,
              },
            },
          };
        }
      });

      // Catch any error
      parser.on("error", function (err) {
        console.error(err.message);
        reject(err.message);
      });

      // When we are done, test that the parsed output matched what expected
      parser.on("end", function () {
        resolve(quoteVaccinationDataObject);
      });
    }
  );

  const lastUpdate = await axios
    .get(
      `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/master/.zenodo.json`
    )
    .then((response) => {
      return new Date(response.data.publication_date);
    });

  const weekday = lastUpdate.getDay();
  const offset = weekday == 1 ? -2 : -1;
  const archiveDate = AddDaysToDate(lastUpdate, offset)
    .toISOString()
    .split("T")
    .shift();
  const archiveUrl = `https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/master/Archiv/${archiveDate}_Deutschland_Bundeslaender_COVID-19-Impfungen.csv`;
  const archiveDataPromise = new Promise<VaccineVaccinationData>(
    DataPromise.bind({ url: archiveUrl })
  );

  // request all data
  const [actualVaccinationData, archiveVaccinationData, quoteVaccinationData] =
    await Promise.all([
      actualDataPromise,
      archiveDataPromise,
      quoteDataPromise,
    ]);

  // now we have all the stuff we need to fill the coverage
  // init
  const coverage: VaccinationCoverage = {
    administeredVaccinations: 0,
    vaccinated: 0,
    vaccination: {
      biontech: 0,
      moderna: 0,
      astraZeneca: 0,
      janssen: 0,
      novavax: 0,
      deltaBiontech: 0,
      deltaModerna: 0,
      deltaAstraZeneca: 0,
      deltaJanssen: 0,
      deltaNovavax: 0,
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
        janssen: 0,
        novavax: 0,
        deltaBiontech: 0,
        deltaModerna: 0,
        deltaAstraZeneca: 0,
        deltaJanssen: 0,
        deltaNovavax: 0,
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
        astraZeneca: 0,
        janssen: 0,
        novavax: 0,
        deltaBiontech: 0,
        deltaModerna: 0,
        deltaAstraZeneca: 0,
        deltaJanssen: 0,
        deltaNovavax: 0,
      },
      delta: 0,
      quote: 0,
      quotes: {
        total: 0,
        "A05-A17": {
          total: 0,
          "A05-A11": null,
          "A12-A17": 0,
        },
        "A18+": {
          total: 0,
          "A18-A59": 0,
          "A60+": 0,
        },
      },
    },
    "2ndBoosterVaccination": {
      vaccinated: 0,
      vaccination: {
        biontech: 0,
        moderna: 0,
        astraZeneca: 0,
        janssen: 0,
        novavax: 0,
        deltaBiontech: 0,
        deltaModerna: 0,
        deltaAstraZeneca: 0,
        deltaJanssen: 0,
        deltaNovavax: 0,
      },
      delta: 0,
      quote: 0,
      quotes: {
        total: 0,
        "A05-A17": {
          total: 0,
          "A05-A11": null,
          "A12-A17": 0,
        },
        "A18+": {
          total: 0,
          "A18-A59": 0,
          "A60+": 0,
        },
      },
    },
    states: {},
  };
  //fill
  for (let id = 0; id < 18; id++) {
    const actual = actualVaccinationData[id];
    clearEntry(actual);
    const quotes = quoteVaccinationData[id];
    clearEntry(quotes);
    const archive = archiveVaccinationData[id];
    clearEntry(archive);

    if (id == 0) {
      coverage.administeredVaccinations = quotes.vaccination.total;
      coverage.vaccinated = quotes.vaccination.first;
      coverage.vaccination = {
        biontech: actual.first.biontech,
        moderna: actual.first.moderna,
        astraZeneca: actual.first.astraZeneca,
        janssen: actual.first.janssen,
        novavax: actual.first.novavax == null ? null : actual.first.novavax,
        deltaBiontech: actual.first.biontech - archive.first.biontech,
        deltaModerna: actual.first.moderna - archive.first.moderna,
        deltaAstraZeneca: actual.first.astraZeneca - archive.first.astraZeneca,
        deltaJanssen: actual.first.janssen - archive.first.janssen,
        deltaNovavax: actual.first.novavax - archive.first.novavax,
      };
      coverage.delta = actual.first.total - archive.first.total;
      coverage.quote =
        quotes.quotes.first.total === null
          ? null
          : limitDecimals(quotes.quotes.first.total / 100.0, 3);
      coverage.quotes.total =
        quotes.quotes.first.total === null
          ? null
          : limitDecimals(quotes.quotes.first.total / 100.0, 3);
      coverage.quotes["A05-A17"].total =
        quotes.quotes.first["5to17"] === null
          ? null
          : limitDecimals(quotes.quotes.first["5to17"] / 100.0, 3);
      coverage.quotes["A05-A17"]["A05-A11"] =
        quotes.quotes.first["5to11"] === null
          ? null
          : limitDecimals(quotes.quotes.first["5to11"] / 100.0, 3);
      coverage.quotes["A05-A17"]["A12-A17"] =
        quotes.quotes.first["12to17"] === null
          ? null
          : limitDecimals(quotes.quotes.first["12to17"] / 100.0, 3);
      coverage.quotes["A18+"].total =
        quotes.quotes.first["18plus"] === null
          ? null
          : limitDecimals(quotes.quotes.first["18plus"] / 100.0, 3);
      coverage.quotes["A18+"]["A18-A59"] =
        quotes.quotes.first["18to59"] === null
          ? null
          : limitDecimals(quotes.quotes.first["18to59"] / 100.0, 3);
      coverage.quotes["A18+"]["A60+"] =
        quotes.quotes.first["60plus"] === null
          ? null
          : limitDecimals(quotes.quotes.first["60plus"] / 100.0, 3);
      coverage.secondVaccination = {
        vaccinated: quotes.vaccination.full,
        vaccination: {
          biontech: actual.full.biontech,
          moderna: actual.full.moderna,
          astraZeneca: actual.full.astraZeneca,
          janssen: actual.full.janssen,
          novavax: actual.full.novavax === null ? null : actual.full.novavax,
          deltaBiontech: actual.full.biontech - archive.full.biontech,
          deltaModerna: actual.full.moderna - archive.full.moderna,
          deltaAstraZeneca: actual.full.astraZeneca - archive.full.astraZeneca,
          deltaJanssen: actual.full.janssen - archive.full.janssen,
          deltaNovavax: actual.full.novavax - archive.full.novavax,
        },
        delta: actual.full.total - archive.full.total,
        quote:
          quotes.quotes.second.total === null
            ? null
            : limitDecimals(quotes.quotes.second.total / 100.0, 3),
        quotes: {
          total:
            quotes.quotes.second.total === null
              ? null
              : limitDecimals(quotes.quotes.second.total / 100.0, 3),
          "A05-A17": {
            total:
              quotes.quotes.second["5to17"] === null
                ? null
                : limitDecimals(quotes.quotes.second["5to17"] / 100.0, 3),
            "A05-A11":
              quotes.quotes.second["5to11"] === null
                ? null
                : limitDecimals(quotes.quotes.second["5to11"] / 100.0, 3),
            "A12-A17":
              quotes.quotes.second["12to17"] === null
                ? null
                : limitDecimals(quotes.quotes.second["12to17"] / 100.0, 3),
          },
          "A18+": {
            total:
              quotes.quotes.second["18plus"] === null
                ? null
                : limitDecimals(quotes.quotes.second["18plus"] / 100.0, 3),
            "A18-A59":
              quotes.quotes.second["18to59"] === null
                ? null
                : limitDecimals(quotes.quotes.second["18to59"] / 100.0, 3),
            "A60+":
              quotes.quotes.second["60plus"] === null
                ? null
                : limitDecimals(quotes.quotes.second["60plus"] / 100.0, 3),
          },
        },
      };
      coverage.boosterVaccination = {
        vaccinated: quotes.vaccination.firstBooster,
        vaccination: {
          biontech: actual.firstBooster.biontech,
          moderna: actual.firstBooster.moderna,
          astraZeneca: actual.firstBooster.astraZeneca,
          janssen: actual.firstBooster.janssen,
          novavax: actual.firstBooster.novavax,
          deltaBiontech:
            actual.firstBooster.biontech - archive.firstBooster.biontech,
          deltaModerna:
            actual.firstBooster.moderna - archive.firstBooster.moderna,
          deltaAstraZeneca:
            actual.firstBooster.astraZeneca - archive.firstBooster.astraZeneca,
          deltaJanssen:
            actual.firstBooster.janssen - archive.firstBooster.janssen,
          deltaNovavax:
            actual.firstBooster.novavax - archive.firstBooster.novavax,
        },
        delta: actual.firstBooster.total - archive.firstBooster.total,
        quote:
          quotes.quotes.firstBooster.total === null
            ? null
            : limitDecimals(quotes.quotes.firstBooster.total / 100.0, 3),
        quotes: {
          total:
            quotes.quotes.firstBooster.total === null
              ? null
              : limitDecimals(quotes.quotes.firstBooster.total / 100.0, 3),
          "A05-A17": {
            total:
              quotes.quotes.firstBooster["12to17"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.firstBooster["12to17"] / 100.0,
                    3
                  ),
            "A05-A11": null, // not publisched at this time!
            "A12-A17":
              quotes.quotes.firstBooster["12to17"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.firstBooster["12to17"] / 100.0,
                    3
                  ),
          },
          "A18+": {
            total:
              quotes.quotes.firstBooster["18plus"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.firstBooster["18plus"] / 100.0,
                    3
                  ),
            "A18-A59":
              quotes.quotes.firstBooster["18to59"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.firstBooster["18to59"] / 100.0,
                    3
                  ),
            "A60+":
              quotes.quotes.firstBooster["60plus"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.firstBooster["60plus"] / 100.0,
                    3
                  ),
          },
        },
      };
      coverage["2ndBoosterVaccination"] = {
        vaccinated: quotes.vaccination.secondBooster,
        vaccination: {
          biontech: actual.secondBooster.biontech,
          moderna: actual.secondBooster.moderna,
          astraZeneca: actual.secondBooster.astraZeneca,
          janssen: actual.secondBooster.janssen,
          novavax: actual.secondBooster.novavax,
          deltaBiontech:
            actual.secondBooster.biontech - archive.secondBooster.biontech,
          deltaModerna:
            actual.secondBooster.moderna - archive.secondBooster.moderna,
          deltaAstraZeneca:
            actual.secondBooster.astraZeneca -
            archive.secondBooster.astraZeneca,
          deltaJanssen:
            actual.secondBooster.janssen - archive.secondBooster.janssen,
          deltaNovavax:
            actual.secondBooster.novavax - archive.secondBooster.novavax,
        },
        delta: actual.secondBooster.total - archive.secondBooster.total,
        quote:
          quotes.quotes.secondBooster.total === null
            ? null
            : limitDecimals(quotes.quotes.secondBooster.total / 100.0, 3),
        quotes: {
          total:
            quotes.quotes.secondBooster.total === null
              ? null
              : limitDecimals(quotes.quotes.secondBooster.total / 100.0, 3),
          "A05-A17": {
            total:
              quotes.quotes.secondBooster["12to17"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.secondBooster["12to17"] / 100.0,
                    3
                  ),
            "A05-A11": null,
            "A12-A17":
              quotes.quotes.secondBooster["12to17"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.secondBooster["12to17"] / 100.0,
                    3
                  ),
          },
          "A18+": {
            total:
              quotes.quotes.secondBooster["18plus"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.secondBooster["18plus"] / 100.0,
                    3
                  ),
            "A18-A59":
              quotes.quotes.secondBooster["18to59"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.secondBooster["18to59"] / 100.0,
                    3
                  ),
            "A60+":
              quotes.quotes.secondBooster["60plus"] === null
                ? null
                : limitDecimals(
                    quotes.quotes.secondBooster["60plus"] / 100.0,
                    3
                  ),
          },
        },
      };
    } else {
      const cleanedStateName = cleanupString(quotes.name);
      // cleanedStateName should always be cleaned
      const abbreviation = quotes.name.includes("Bund")
        ? "Bund"
        : getStateAbbreviationByName(cleanedStateName);
      coverage.states[abbreviation] = {
        name: cleanedStateName,
        administeredVaccinations: quotes.vaccination.total,
        vaccinated: quotes.vaccination.first,
        vaccination: {
          biontech: actual.first.biontech,
          moderna: actual.first.moderna,
          astraZeneca: actual.first.astraZeneca,
          janssen: actual.first.janssen,
          novavax: actual.first.novavax === null ? null : actual.first.novavax,
          deltaBiontech: actual.first.biontech - archive.first.biontech,
          deltaModerna: actual.first.moderna - archive.first.moderna,
          deltaAstraZeneca:
            actual.first.astraZeneca - archive.first.astraZeneca,
          deltaJanssen: actual.first.janssen - archive.first.janssen,
          deltaNovavax: actual.first.novavax - archive.first.novavax,
        },
        delta: actual.first.total - archive.first.total,
        quote:
          quotes.quotes.first.total === null
            ? null
            : limitDecimals(quotes.quotes.first.total / 100.0, 3),
        quotes: {
          total:
            quotes.quotes.first.total === null
              ? null
              : limitDecimals(quotes.quotes.first.total / 100.0, 3),
          "A05-A17": {
            total:
              quotes.quotes.first["5to17"] === null
                ? null
                : limitDecimals(quotes.quotes.first["5to17"] / 100.0, 3),
            "A05-A11":
              quotes.quotes.first["5to11"] === null
                ? null
                : limitDecimals(quotes.quotes.first["5to11"] / 100.0, 3),
            "A12-A17":
              quotes.quotes.first["12to17"] === null
                ? null
                : limitDecimals(quotes.quotes.first["12to17"] / 100.0, 3),
          },
          "A18+": {
            total:
              quotes.quotes.first["18plus"] === null
                ? null
                : limitDecimals(quotes.quotes.first["18plus"] / 100.0, 3),
            "A18-A59":
              quotes.quotes.first["18to59"] === null
                ? null
                : limitDecimals(quotes.quotes.first["18to59"] / 100.0, 3),
            "A60+":
              quotes.quotes.first["60plus"] === null
                ? null
                : limitDecimals(quotes.quotes.first["60plus"] / 100.0, 3),
          },
        },
        secondVaccination: {
          vaccinated: quotes.vaccination.full,
          vaccination: {
            biontech: actual.full.biontech,
            moderna: actual.full.moderna,
            astraZeneca: actual.full.astraZeneca,
            janssen: actual.full.janssen,
            novavax: actual.full.novavax === null ? null : actual.full.novavax,
            deltaBiontech: actual.full.biontech - archive.full.biontech,
            deltaModerna: actual.full.moderna - archive.full.moderna,
            deltaAstraZeneca:
              actual.full.astraZeneca - archive.full.astraZeneca,
            deltaJanssen: actual.full.janssen - archive.full.janssen,
            deltaNovavax: actual.full.novavax - archive.full.novavax,
          },
          delta: actual.full.total - archive.full.total,
          quote:
            quotes.quotes.second.total === null
              ? null
              : limitDecimals(quotes.quotes.second.total / 100.0, 3),
          quotes: {
            total:
              quotes.quotes.second.total === null
                ? null
                : limitDecimals(quotes.quotes.second.total / 100.0, 3),
            "A05-A17": {
              total:
                quotes.quotes.second["5to17"] === null
                  ? null
                  : limitDecimals(quotes.quotes.second["5to17"] / 100.0, 3),
              "A05-A11":
                quotes.quotes.second["5to11"] === null
                  ? null
                  : limitDecimals(quotes.quotes.second["5to11"] / 100.0, 3),
              "A12-A17":
                quotes.quotes.second["12to17"] === null
                  ? null
                  : limitDecimals(quotes.quotes.second["12to17"] / 100.0, 3),
            },
            "A18+": {
              total:
                quotes.quotes.second["18plus"] === null
                  ? null
                  : limitDecimals(quotes.quotes.second["18plus"] / 100.0, 3),
              "A18-A59":
                quotes.quotes.second["18to59"] === null
                  ? null
                  : limitDecimals(quotes.quotes.second["18to59"] / 100.0, 3),
              "A60+":
                quotes.quotes.second["60plus"] === null
                  ? null
                  : limitDecimals(quotes.quotes.second["60plus"] / 100.0, 3),
            },
          },
        },
        boosterVaccination: {
          vaccinated: quotes.vaccination.firstBooster,
          vaccination: {
            biontech: actual.firstBooster.biontech,
            moderna: actual.firstBooster.moderna,
            janssen: actual.firstBooster.janssen,
            astraZeneca: actual.firstBooster.astraZeneca,
            novavax:
              actual.firstBooster.novavax === null
                ? null
                : actual.firstBooster.novavax,
            deltaBiontech:
              actual.firstBooster.biontech - archive.firstBooster.biontech,
            deltaModerna:
              actual.firstBooster.moderna - archive.firstBooster.moderna,
            deltaAstraZeneca:
              actual.firstBooster.astraZeneca -
              archive.firstBooster.astraZeneca,
            deltaJanssen:
              actual.firstBooster.janssen - archive.firstBooster.janssen,
            deltaNovavax:
              actual.firstBooster.novavax - archive.firstBooster.novavax,
          },
          delta: actual.firstBooster.total - archive.firstBooster.total,
          quote:
            quotes.quotes.firstBooster.total === null
              ? null
              : limitDecimals(quotes.quotes.firstBooster.total / 100.0, 3),
          quotes: {
            total:
              quotes.quotes.firstBooster.total === null
                ? null
                : limitDecimals(quotes.quotes.firstBooster.total / 100.0, 3),
            "A05-A17": {
              total:
                quotes.quotes.firstBooster["12to17"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.firstBooster["12to17"] / 100.0,
                      3
                    ),
              "A05-A11": null, // not published at this time!
              "A12-A17":
                quotes.quotes.firstBooster["12to17"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.firstBooster["12to17"] / 100.0,
                      3
                    ),
            },
            "A18+": {
              total:
                quotes.quotes.firstBooster["18plus"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.firstBooster["18plus"] / 100.0,
                      3
                    ),
              "A18-A59":
                quotes.quotes.firstBooster["18to59"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.firstBooster["18to59"] / 100.0,
                      3
                    ),
              "A60+":
                quotes.quotes.firstBooster["60plus"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.firstBooster["60plus"] / 100.0,
                      3
                    ),
            },
          },
        },
        "2ndBoosterVaccination": {
          vaccinated: quotes.vaccination.secondBooster,
          vaccination: {
            biontech: actual.secondBooster.biontech,
            moderna: actual.secondBooster.moderna,
            janssen: actual.secondBooster.janssen,
            astraZeneca: actual.secondBooster.astraZeneca,
            novavax: actual.secondBooster.novavax,
            deltaBiontech:
              actual.secondBooster.biontech - archive.secondBooster.biontech,
            deltaModerna:
              actual.secondBooster.moderna - archive.secondBooster.moderna,
            deltaAstraZeneca:
              actual.secondBooster.astraZeneca -
              archive.secondBooster.astraZeneca,
            deltaJanssen:
              actual.secondBooster.janssen - archive.secondBooster.janssen,
            deltaNovavax:
              actual.secondBooster.novavax - archive.secondBooster.novavax,
          },
          delta: actual.secondBooster.total - archive.secondBooster.total,
          quote:
            quotes.quotes.secondBooster.total === null
              ? null
              : limitDecimals(quotes.quotes.secondBooster.total / 100.0, 3),
          quotes: {
            total:
              quotes.quotes.secondBooster.total === null
                ? null
                : limitDecimals(quotes.quotes.secondBooster.total / 100.0, 3),
            "A05-A17": {
              total:
                quotes.quotes.secondBooster["12to17"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.secondBooster["12to17"] / 100.0,
                      3
                    ),
              "A05-A11": null, // not published at this time!
              "A12-A17":
                quotes.quotes.secondBooster["12to17"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.secondBooster["12to17"] / 100.0,
                      3
                    ),
            },
            "A18+": {
              total:
                quotes.quotes.secondBooster["18plus"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.secondBooster["18plus"] / 100.0,
                      3
                    ),
              "A18-A59":
                quotes.quotes.secondBooster["18to59"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.secondBooster["18to59"] / 100.0,
                      3
                    ),
              "A60+":
                quotes.quotes.secondBooster["60plus"] === null
                  ? null
                  : limitDecimals(
                      quotes.quotes.secondBooster["60plus"] / 100.0,
                      3
                    ),
            },
          },
        },
      };
    }
  }

  function limitDecimals(value: number, decimals: number): number {
    return parseFloat(value.toFixed(decimals));
  }
  return {
    data: coverage,
    lastUpdate: lastUpdate,
  };
}

interface VacciantionHistoryDataObject {
  [date: string]: {
    date: Date;
    vaccinated: number;
    firstVaccination: number;
    secondVaccination: number;
    firstBoosterVaccination: number;
    secondBoosterVaccination: number;
    totalVacciantionOfTheDay: number;
  };
}

export interface VaccinationHistoryEntry {
  date: Date;
  vaccinated: number;
  firstVaccination: number;
  secondVaccination: number;
  firstBoosterVaccination: number;
  secondBoosterVaccination: number;
  totalVacciantionOfTheDay: number;
}
[];

export async function getVaccinationHistory(
  days?: number
): Promise<ResponseData<VaccinationHistoryEntry[]>> {
  const vaccinationHistoryPromise = new Promise<VacciantionHistoryDataObject>(
    async (resolve, reject) => {
      // Create the parser
      const parser = parse({
        delimiter: ",",
        from: 2,
        cast: true,
        cast_date: true,
      });

      // get csv as stream
      const response = await axios({
        method: "get",
        url: "https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/master/Aktuell_Deutschland_Bundeslaender_COVID-19-Impfungen.csv",
        responseType: "stream",
      });

      // pipe csv stream to csv parser
      response.data.pipe(parser);

      // empty object, that gets filled
      const vaccinationHistoryDataObject: VacciantionHistoryDataObject = {};

      // read the parser stream and add record to hospitalizationDataObject
      parser.on("readable", function () {
        let record;
        while ((record = parser.read())) {
          let [date, stateId, vaccine, series, count] = record;
          let total = 0;
          // read entry for the date
          let dateEntry = vaccinationHistoryDataObject[date.toISOString()];

          // create new object if the entry does not exist
          if (!dateEntry) {
            dateEntry = {
              date: date,
              vaccinated: null,
              firstVaccination: null,
              secondVaccination: null,
              firstBoosterVaccination: null,
              secondBoosterVaccination: null,
              totalVacciantionOfTheDay: null,
            };
          }

          dateEntry.totalVacciantionOfTheDay += count;
          switch (series) {
            case 1:
              dateEntry.firstVaccination += count;
              dateEntry.vaccinated += count; // legacy Entry
              break;
            case 2:
              dateEntry.secondVaccination += count;
              break;
            case 3:
              dateEntry.firstBoosterVaccination += count;
              break;
            case 4:
              dateEntry.secondBoosterVaccination += count;
              break;
            default:
              break;
          }

          // write data to object
          vaccinationHistoryDataObject[date.toISOString()] = dateEntry;
        }
      });
      // Catch any error
      parser.on("error", function (err) {
        console.error(err.message);
        reject(err.message);
      });

      // When we are done, test that the parsed output matched what expected
      parser.on("end", function () {
        resolve(vaccinationHistoryDataObject);
      });
    }
  );

  const [vaccinationHistoryObject, lastUpdate] = await Promise.all([
    vaccinationHistoryPromise,
    axios
      .get(
        "https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/master/.zenodo.json"
      )
      .then((response) => {
        return new Date(response.data.publication_date);
      }),
  ]);
  let vaccinationHistory: VaccinationHistoryEntry[] = [];
  for (const entry of Object.keys(vaccinationHistoryObject)) {
    vaccinationHistory.push(vaccinationHistoryObject[entry]);
  }
  if (days) {
    const reference_date = new Date(getDateBefore(days + 1));
    vaccinationHistory = vaccinationHistory.filter(
      (element) => element.date > reference_date
    );
  }
  return {
    data: vaccinationHistory,
    lastUpdate: lastUpdate,
  };
}
