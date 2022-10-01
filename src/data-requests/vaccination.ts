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

// for History
enum SeriesHistory {
  S1 = "firstVaccination",
  S2 = "secondVaccination",
  S3 = "firstBoosterVaccination",
  S4 = "secondBoosterVaccination",
}

// UsedSeries
enum US {
  S1 = "first",
  S2 = "full",
  S3 = "firstBooster",
  S4 = "secondBooster",
}

//seriesName
enum SN {
  "first" = "vaccination",
  "full" = "secondVaccination",
  "firstBooster" = "boosterVaccination",
  "secondBooster" = "2ndBoosterVaccination",
}

//Used Vaccines
enum UV {
  V1 = "astraZeneca",
  V2 = "biontech",
  V3 = "janssen",
  V4 = "moderna",
  V5 = "novavax",
  V6 = "valneva",
  V7 = "biontechBivalent",
  V8 = "modernaBivalent",
}

// UsedVaccinesDelta
enum UVD {
  V1 = "deltaAstraZeneca",
  V2 = "deltaBiontech",
  V3 = "deltaJanssen",
  V4 = "deltaModerna",
  V5 = "deltaNovavax",
  V6 = "deltaValneva",
  V7 = "deltaBiontechBivalent",
  V8 = "deltaModernaBivalent",
}

// VaccineNameReverse
enum VNR {
  "Vaxzevria" = "astraZeneca",
  "Comirnaty" = "biontech",
  "Jcovden" = "janssen",
  "Spikevax" = "moderna",
  "Nuvaxovid" = "novavax",
  "Valneva" = "valneva",
  "Comirnaty bivalent (Original/Omikron)" = "biontechBivalent",
  "Spikevax bivalent (Original/Omikron)" = "modernaBivalent",
}

// UsedAgeGroups
enum UAG {
  G0517 = "A05-A17",
  G0511 = "A05-A11",
  G1217 = "A12-A17",
  G18pl = "A18+",
  G1859 = "A18-A59",
  G60pl = "A60+",
}

export interface VaccinationCoverage {
  administeredVaccinations: number;
  vaccinated: number;
  vaccination: CoverageVaccine;
  delta: number;
  quote: number;
  quotes: CoverageQuotesS1S2;
  [SN.full]: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    quote: number;
    quotes: CoverageQuotesS1S2;
  };
  [SN.firstBooster]: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    quote: number;
    quotes: CoverageQuotesS3S4;
  };
  [SN.secondBooster]: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    quote: number;
    quotes: CoverageQuotesS3S4;
  };
  states: {
    [abbreviation: string]: {
      name: string;
      administeredVaccinations: number;
      vaccinated: number;
      vaccination: CoverageVaccine;
      delta: number;
      quote: number;
      quotes: CoverageQuotesS1S2;
      [SN.full]: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        quote: number;
        quotes: CoverageQuotesS1S2;
      };
      [SN.firstBooster]: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        quote: number;
        quotes: CoverageQuotesS3S4;
      };
      [SN.secondBooster]: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        quote: number;
        quotes: CoverageQuotesS3S4;
      };
    };
  };
}

interface CoverageQuotesS1S2 {
  total: number;
  [UAG.G0517]: {
    total: number;
    [UAG.G0511]: number;
    [UAG.G1217]: number;
  };
  [UAG.G18pl]: {
    total: number;
    [UAG.G1859]: number;
    [UAG.G60pl]: number;
  };
}

interface CoverageQuotesS3S4 {
  total: number;
  [UAG.G1217]: number;
  [UAG.G18pl]: {
    total: number;
    [UAG.G1859]: number;
    [UAG.G60pl]: number;
  };
}

interface Vaccines {
  [UV.V1]: number;
  [UV.V2]: number;
  [UV.V3]: number;
  [UV.V4]: number;
  [UV.V5]: number;
  [UV.V6]: number;
  [UV.V7]: number;
  [UV.V8]: number;
}

interface Vaccine extends Vaccines {
  total: number;
}

interface CoverageVaccine extends Vaccines {
  [UVD.V1]: number;
  [UVD.V2]: number;
  [UVD.V3]: number;
  [UVD.V4]: number;
  [UVD.V5]: number;
  [UVD.V6]: number;
  [UVD.V7]: number;
  [UVD.V8]: number;
}

interface StateEntry {
  [US.S1]: Vaccine;
  [US.S2]: Vaccine;
  [US.S3]: Vaccine;
  [US.S4]: Vaccine;
}

interface VaccineVaccinationData {
  [state: string]: StateEntry;
}
[];

interface QuotesRegular {
  total: number;
  [UAG.G0517]: number;
  [UAG.G0511]: number;
  [UAG.G1217]: number;
  [UAG.G18pl]: number;
  [UAG.G1859]: number;
  [UAG.G60pl]: number;
}

interface QuotesBoost {
  total: number;
  [UAG.G1217]: number;
  [UAG.G18pl]: number;
  [UAG.G1859]: number;
  [UAG.G60pl]: number;
}

interface QuoteVaccinationData {
  [id: number]: {
    name: string;
    vaccination: {
      total: number;
      [US.S1]: number;
      [US.S2]: number;
      [US.S3]: number;
      [US.S4]: number;
    };
    [US.S1]: QuotesRegular;
    [US.S2]: QuotesRegular;
    [US.S3]: QuotesBoost;
    [US.S4]: QuotesBoost;
  };
}
[];

function clone<T>(a: T): T {
  return JSON.parse(JSON.stringify(a));
}

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

  // empty vaccine Object
  const vaccineObject: Vaccine = {
    total: null,
    [UV.V1]: null,
    [UV.V2]: null,
    [UV.V3]: null,
    [UV.V4]: null,
    [UV.V5]: null,
    [UV.V6]: null,
    [UV.V7]: null,
    [UV.V8]: null,
  };

  const emptyStateObject: StateEntry = {
    [US.S1]: clone(vaccineObject),
    [US.S2]: clone(vaccineObject),
    [US.S3]: clone(vaccineObject),
    [US.S4]: clone(vaccineObject),
  };

  // empty object, that gets filled
  const vaccinationDataObject: VaccineVaccinationData = {
    0: clone(emptyStateObject),
  };

  // read the parser stream and add record to vaccinationDataObj
  parser.on("readable", function () {
    let record;
    while ((record = parser.read())) {
      let [date, stateId, vaccinekey, series, count] = record;
      const seriesKey = "S" + series.toString();
      // read entry for stateId
      let stateEntry = vaccinationDataObject[stateId];
      // create new object if the entry does not exist
      if (!stateEntry) {
        stateEntry = clone(emptyStateObject);
      }
      // write data to id 0
      vaccinationDataObject[0][US[seriesKey]].total += count;
      vaccinationDataObject[0][US[seriesKey]][VNR[vaccinekey]] += count;
      // write data to stateEntry
      stateEntry[US[seriesKey]].total += count;
      stateEntry[US[seriesKey]][VNR[vaccinekey]] += count;

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
              [US.S1]: first,
              [US.S2]: full,
              [US.S3]: firstBooster,
              [US.S4]: secondBooster,
            },
            [US.S1]: {
              total: qFirstTotal,
              [UAG.G0517]: qFirst05bis17,
              [UAG.G0511]: qFirst05bis11,
              [UAG.G1217]: qFirst12bis17,
              [UAG.G18pl]: qFirst18plus,
              [UAG.G1859]: qFirst18bis59,
              [UAG.G60pl]: qFirst60plus,
            },
            [US.S2]: {
              total: qFullTotal,
              [UAG.G0517]: qFull05bis17,
              [UAG.G0511]: qFull05bis11,
              [UAG.G1217]: qFull12bis17,
              [UAG.G18pl]: qFull18plus,
              [UAG.G1859]: qFull18bis59,
              [UAG.G60pl]: qFull60plus,
            },
            [US.S3]: {
              total: q1BoostTotal,
              [UAG.G1217]: q1Boost12bis17,
              [UAG.G18pl]: q1Boost18plus,
              [UAG.G1859]: q1Boost18bis59,
              [UAG.G60pl]: q1Boost60plus,
            },
            [US.S4]: {
              total: q2BoostTotal,
              [UAG.G1217]: q2Boost12bis17,
              [UAG.G18pl]: q2Boost18plus,
              [UAG.G1859]: q2Boost18bis59,
              [UAG.G60pl]: q2Boost60plus,
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
      `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/master/Metadaten/zenodo.json`
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

  // empty CoverageVaccineObject
  const emptyCoverageVaccineObject: CoverageVaccine = {
    [UV.V1]: null,
    [UV.V2]: null,
    [UV.V3]: null,
    [UV.V4]: null,
    [UV.V5]: null,
    [UV.V6]: null,
    [UV.V7]: null,
    [UV.V8]: null,
    [UVD.V1]: null,
    [UVD.V2]: null,
    [UVD.V3]: null,
    [UVD.V4]: null,
    [UVD.V5]: null,
    [UVD.V6]: null,
    [UVD.V7]: null,
    [UVD.V8]: null,
  };
  const emptyCoverageQuotesS1S2Object: CoverageQuotesS1S2 = {
    total: null,
    [UAG.G0517]: {
      total: null,
      [UAG.G0511]: null,
      [UAG.G1217]: null,
    },
    [UAG.G18pl]: {
      total: null,
      [UAG.G1859]: null,
      [UAG.G60pl]: null,
    },
  };
  const emptyCoverageQuotesS3S4Object: CoverageQuotesS3S4 = {
    total: null,
    [UAG.G1217]: null,
    [UAG.G18pl]: {
      total: null,
      [UAG.G1859]: null,
      [UAG.G60pl]: null,
    },
  };
  // now we have all the stuff we need to fill the coverage
  // init
  const coverage: VaccinationCoverage = {
    administeredVaccinations: null,
    vaccinated: null,
    [SN[US.S1]]: clone(emptyCoverageVaccineObject),
    delta: null,
    quote: null,
    quotes: clone(emptyCoverageQuotesS1S2Object),
    [SN[US.S2]]: {
      vaccinated: null,
      vaccination: clone(emptyCoverageVaccineObject),
      delta: null,
      quote: null,
      quotes: clone(emptyCoverageQuotesS1S2Object),
    },
    [SN[US.S3]]: {
      vaccinated: null,
      vaccination: clone(emptyCoverageVaccineObject),
      delta: null,
      quote: null,
      quotes: clone(emptyCoverageQuotesS3S4Object),
    },
    [SN[US.S4]]: {
      vaccinated: null,
      vaccination: clone(emptyCoverageVaccineObject),
      delta: null,
      quote: null,
      quotes: clone(emptyCoverageQuotesS3S4Object),
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
    // prettier-ignore
    if (id == 0) {
      coverage.administeredVaccinations = quotes.vaccination.total;
      coverage.vaccinated = quotes.vaccination[US.S1];
      coverage[SN[US.S1]] = {
        [UV.V1]: actual[US.S1][UV.V1],
        [UV.V2]: actual[US.S1][UV.V2],
        [UV.V3]: actual[US.S1][UV.V3],
        [UV.V4]: actual[US.S1][UV.V4],
        [UV.V5]: actual[US.S1][UV.V5],
        [UV.V6]: actual[US.S1][UV.V6],
        [UV.V7]: actual[US.S1][UV.V7],
        [UV.V8]: actual[US.S1][UV.V8],
        [UVD.V1]: actual[US.S1][UV.V1] === null && archive[US.S1][UV.V1] === null ? null : actual[US.S1][UV.V1] - archive[US.S1][UV.V1],
        [UVD.V2]: actual[US.S1][UV.V2] === null && archive[US.S1][UV.V2] === null ? null : actual[US.S1][UV.V2] - archive[US.S1][UV.V2],
        [UVD.V3]: actual[US.S1][UV.V3] === null && archive[US.S1][UV.V3] === null ? null : actual[US.S1][UV.V3] - archive[US.S1][UV.V3],
        [UVD.V4]: actual[US.S1][UV.V4] === null && archive[US.S1][UV.V4] === null ? null : actual[US.S1][UV.V4] - archive[US.S1][UV.V4],
        [UVD.V5]: actual[US.S1][UV.V5] === null && archive[US.S1][UV.V5] === null ? null : actual[US.S1][UV.V5] - archive[US.S1][UV.V5],
        [UVD.V6]: actual[US.S1][UV.V6] === null && archive[US.S1][UV.V6] === null ? null : actual[US.S1][UV.V6] - archive[US.S1][UV.V6],
        [UVD.V7]: actual[US.S1][UV.V7] === null && archive[US.S1][UV.V7] === null ? null : actual[US.S1][UV.V7] - archive[US.S1][UV.V7],
        [UVD.V8]: actual[US.S1][UV.V8] === null && archive[US.S1][UV.V8] === null ? null : actual[US.S1][UV.V8] - archive[US.S1][UV.V8],
      };
      coverage.delta = archive[US.S1].total === null ? null : actual[US.S1].total - archive[US.S1].total;
      coverage.quote = quotes[US.S1].total === null ? null : limit(quotes[US.S1].total / 100.0, 3);
      coverage.quotes.total = quotes[US.S1].total === null ? null : limit(quotes[US.S1].total / 100.0, 3);
      coverage.quotes[UAG.G0517].total = quotes[US.S1][UAG.G0517] === null ? null : limit(quotes[US.S1][UAG.G0517] / 100.0, 3);
      coverage.quotes[UAG.G0517][UAG.G0511] = quotes[US.S1][UAG.G0511] === null ? null : limit(quotes[US.S1][UAG.G0511] / 100.0, 3);
      coverage.quotes[UAG.G0517][UAG.G1217] = quotes[US.S1][UAG.G1217] === null ? null : limit(quotes[US.S1][UAG.G1217] / 100.0, 3);
      coverage.quotes[UAG.G18pl].total = quotes[US.S1][UAG.G18pl] === null ? null : limit(quotes[US.S1][UAG.G18pl] / 100.0, 3);
      coverage.quotes[UAG.G18pl][UAG.G1859] = quotes[US.S1][UAG.G1859] === null ? null : limit(quotes[US.S1][UAG.G1859] / 100.0, 3);
      coverage.quotes[UAG.G18pl][UAG.G60pl] = quotes[US.S1][UAG.G60pl] === null ? null : limit(quotes[US.S1][UAG.G60pl] / 100.0, 3);
      coverage[SN[US.S2]] = {
        vaccinated: quotes.vaccination[US.S2],
        vaccination: {
          [UV.V1]: actual[US.S2][UV.V1],
          [UV.V2]: actual[US.S2][UV.V2],
          [UV.V3]: actual[US.S2][UV.V3],
          [UV.V4]: actual[US.S2][UV.V4],
          [UV.V5]: actual[US.S2][UV.V5],
          [UV.V6]: actual[US.S2][UV.V6],
          [UV.V7]: actual[US.S2][UV.V7],
          [UV.V8]: actual[US.S2][UV.V8],
          [UVD.V1]: actual[US.S2][UV.V1] === null && archive[US.S2][UV.V1] === null ? null : actual[US.S2][UV.V1] - archive[US.S2][UV.V1],
          [UVD.V2]: actual[US.S2][UV.V2] === null && archive[US.S2][UV.V2] === null ? null : actual[US.S2][UV.V2] - archive[US.S2][UV.V2],
          [UVD.V3]: actual[US.S2][UV.V3] === null && archive[US.S2][UV.V3] === null ? null : actual[US.S2][UV.V3] - archive[US.S2][UV.V3],
          [UVD.V4]: actual[US.S2][UV.V4] === null && archive[US.S2][UV.V4] === null ? null : actual[US.S2][UV.V4] - archive[US.S2][UV.V4],
          [UVD.V5]: actual[US.S2][UV.V5] === null && archive[US.S2][UV.V5] === null ? null : actual[US.S2][UV.V5] - archive[US.S2][UV.V5],
          [UVD.V6]: actual[US.S2][UV.V6] === null && archive[US.S2][UV.V6] === null ? null : actual[US.S2][UV.V6] - archive[US.S2][UV.V6],
          [UVD.V7]: actual[US.S2][UV.V7] === null && archive[US.S2][UV.V7] === null ? null : actual[US.S2][UV.V7] - archive[US.S2][UV.V7],
          [UVD.V8]: actual[US.S2][UV.V8] === null && archive[US.S2][UV.V8] === null ? null : actual[US.S2][UV.V8] - archive[US.S2][UV.V8],
        },
        delta: archive[US.S2].total === null ? null : actual[US.S2].total - archive[US.S2].total,
        quote: quotes[US.S2].total === null ? null : limit(quotes[US.S2].total / 100.0, 3),
        quotes: {
          total: quotes[US.S2].total === null ? null : limit(quotes[US.S2].total / 100.0, 3),
          [UAG.G0517]: {
            total: quotes[US.S2][UAG.G0517] === null ? null : limit(quotes[US.S2][UAG.G0517] / 100.0, 3),
            [UAG.G0511]: quotes[US.S2][UAG.G0511] === null ? null : limit(quotes[US.S2][UAG.G0511] / 100.0, 3),
            [UAG.G1217]: quotes[US.S2][UAG.G1217] === null ? null : limit(quotes[US.S2][UAG.G1217] / 100.0, 3),
          },
          [UAG.G18pl]: {
            total: quotes[US.S2][UAG.G18pl] === null ? null : limit(quotes[US.S2][UAG.G18pl] / 100.0, 3),
            [UAG.G1859]: quotes[US.S2][UAG.G1859] === null ? null : limit(quotes[US.S2][UAG.G1859] / 100.0, 3),
            [UAG.G60pl]: quotes[US.S2][UAG.G60pl] === null ? null : limit(quotes[US.S2][UAG.G60pl] / 100.0, 3),
          },
        },
      };
      coverage[SN[US.S3]] = {
        vaccinated: quotes.vaccination[US.S3],
        vaccination: {
          [UV.V1]: actual[US.S3][UV.V1],
          [UV.V2]: actual[US.S3][UV.V2],
          [UV.V3]: actual[US.S3][UV.V3],
          [UV.V4]: actual[US.S3][UV.V4],
          [UV.V5]: actual[US.S3][UV.V5],
          [UV.V6]: actual[US.S3][UV.V6],
          [UV.V7]: actual[US.S3][UV.V7],
          [UV.V8]: actual[US.S3][UV.V8],
          [UVD.V1]: actual[US.S3][UV.V1] === null && archive[US.S3][UV.V1] === null ? null : actual[US.S3][UV.V1] - archive[US.S3][UV.V1],
          [UVD.V2]: actual[US.S3][UV.V2] === null && archive[US.S3][UV.V2] === null ? null : actual[US.S3][UV.V2] - archive[US.S3][UV.V2],
          [UVD.V3]: actual[US.S3][UV.V3] === null && archive[US.S3][UV.V3] === null ? null : actual[US.S3][UV.V3] - archive[US.S3][UV.V3],
          [UVD.V4]: actual[US.S3][UV.V4] === null && archive[US.S3][UV.V4] === null ? null : actual[US.S3][UV.V4] - archive[US.S3][UV.V4],
          [UVD.V5]: actual[US.S3][UV.V5] === null && archive[US.S3][UV.V5] === null ? null : actual[US.S3][UV.V5] - archive[US.S3][UV.V5],
          [UVD.V6]: actual[US.S3][UV.V6] === null && archive[US.S3][UV.V6] === null ? null : actual[US.S3][UV.V6] - archive[US.S3][UV.V6],
          [UVD.V7]: actual[US.S3][UV.V7] === null && archive[US.S3][UV.V7] === null ? null : actual[US.S3][UV.V7] - archive[US.S3][UV.V7],
          [UVD.V8]: actual[US.S3][UV.V8] === null && archive[US.S3][UV.V8] === null ? null : actual[US.S3][UV.V8] - archive[US.S3][UV.V8],
        },
        delta: archive[US.S3].total === null ? null : actual[US.S3].total - archive[US.S3].total,
        quote: quotes[US.S3].total === null ? null : limit(quotes[US.S3].total / 100.0, 3),
        quotes: {
          total: quotes[US.S3].total === null ? null : limit(quotes[US.S3].total / 100.0, 3),
          [UAG.G1217]: quotes[US.S3][UAG.G1217] === null ? null : limit(quotes[US.S3][UAG.G1217] / 100.0, 3),
          [UAG.G18pl]: {
            total: quotes[US.S3][UAG.G18pl] === null ? null : limit(quotes[US.S3][UAG.G18pl] / 100.0, 3),
            [UAG.G1859]: quotes[US.S3][UAG.G1859] === null ? null : limit(quotes[US.S3][UAG.G1859] / 100.0, 3),
            [UAG.G60pl]: quotes[US.S3][UAG.G60pl] === null ? null : limit(quotes[US.S3][UAG.G60pl] / 100.0, 3),
          },
        },
      };
      coverage[SN[US.S4]] = {
        vaccinated: quotes.vaccination[US.S4],
        vaccination: {
          [UV.V1]: actual[US.S4][UV.V1],
          [UV.V2]: actual[US.S4][UV.V2],
          [UV.V3]: actual[US.S4][UV.V3],
          [UV.V4]: actual[US.S4][UV.V4],
          [UV.V5]: actual[US.S4][UV.V5],
          [UV.V6]: actual[US.S4][UV.V6],
          [UV.V7]: actual[US.S4][UV.V7],
          [UV.V8]: actual[US.S4][UV.V8],
          [UVD.V1]: actual[US.S4][UV.V1] === null && archive[US.S4][UV.V1] === null ? null : actual[US.S4][UV.V1] - archive[US.S4][UV.V1],
          [UVD.V2]: actual[US.S4][UV.V2] === null && archive[US.S4][UV.V2] === null ? null : actual[US.S4][UV.V2] - archive[US.S4][UV.V2],
          [UVD.V3]: actual[US.S4][UV.V3] === null && archive[US.S4][UV.V3] === null ? null : actual[US.S4][UV.V3] - archive[US.S4][UV.V3],
          [UVD.V4]: actual[US.S4][UV.V4] === null && archive[US.S4][UV.V4] === null ? null : actual[US.S4][UV.V4] - archive[US.S4][UV.V4],
          [UVD.V5]: actual[US.S4][UV.V5] === null && archive[US.S4][UV.V5] === null ? null : actual[US.S4][UV.V5] - archive[US.S4][UV.V5],
          [UVD.V6]: actual[US.S4][UV.V6] === null && archive[US.S4][UV.V6] === null ? null : actual[US.S4][UV.V6] - archive[US.S4][UV.V6],
          [UVD.V7]: actual[US.S4][UV.V7] === null && archive[US.S4][UV.V7] === null ? null : actual[US.S4][UV.V7] - archive[US.S4][UV.V7],
          [UVD.V8]: actual[US.S4][UV.V8] === null && archive[US.S4][UV.V8] === null ? null : actual[US.S4][UV.V8] - archive[US.S4][UV.V8],
        },
        delta: archive[US.S4].total === null ? null : actual[US.S4].total - archive[US.S4].total,
        quote: quotes[US.S4].total === null ? null : limit(quotes[US.S4].total / 100.0, 3),
        quotes: {
          total: quotes[US.S4].total === null ? null : limit(quotes[US.S4].total / 100.0, 3),
          [UAG.G1217]: quotes[US.S4][UAG.G1217] === null ? null : limit(quotes[US.S4][UAG.G1217] / 100.0, 3),
          [UAG.G18pl]: {
            total: quotes[US.S4][UAG.G18pl] === null ? null : limit(quotes[US.S4][UAG.G18pl] / 100.0, 3),
            [UAG.G1859]: quotes[US.S4][UAG.G1859] === null ? null : limit(quotes[US.S4][UAG.G1859] / 100.0, 3),
            [UAG.G60pl]: quotes[US.S4][UAG.G60pl] === null ? null : limit(quotes[US.S4][UAG.G60pl] / 100.0, 3),
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
        vaccinated: quotes.vaccination[US.S1],
        [SN[US.S1]]: {
          [UV.V1]: actual[US.S1][UV.V1],
          [UV.V2]: actual[US.S1][UV.V2],
          [UV.V3]: actual[US.S1][UV.V3],
          [UV.V4]: actual[US.S1][UV.V4],
          [UV.V5]: actual[US.S1][UV.V5],
          [UV.V6]: actual[US.S1][UV.V6],
          [UV.V7]: actual[US.S1][UV.V7],
          [UV.V8]: actual[US.S1][UV.V8],
          [UVD.V1]: actual[US.S1][UV.V1] === null && archive[US.S1][UV.V1] === null ? null : actual[US.S1][UV.V1] - archive[US.S1][UV.V1],
          [UVD.V2]: actual[US.S1][UV.V2] === null && archive[US.S1][UV.V2] === null ? null : actual[US.S1][UV.V2] - archive[US.S1][UV.V2],
          [UVD.V3]: actual[US.S1][UV.V3] === null && archive[US.S1][UV.V3] === null ? null : actual[US.S1][UV.V3] - archive[US.S1][UV.V3],
          [UVD.V4]: actual[US.S1][UV.V4] === null && archive[US.S1][UV.V4] === null ? null : actual[US.S1][UV.V4] - archive[US.S1][UV.V4],
          [UVD.V5]: actual[US.S1][UV.V5] === null && archive[US.S1][UV.V5] === null ? null : actual[US.S1][UV.V5] - archive[US.S1][UV.V5],
          [UVD.V6]: actual[US.S1][UV.V6] === null && archive[US.S1][UV.V6] === null ? null : actual[US.S1][UV.V6] - archive[US.S1][UV.V6],
          [UVD.V7]: actual[US.S1][UV.V7] === null && archive[US.S1][UV.V7] === null ? null : actual[US.S1][UV.V7] - archive[US.S1][UV.V7],
          [UVD.V8]: actual[US.S1][UV.V8] === null && archive[US.S1][UV.V8] === null ? null : actual[US.S1][UV.V8] - archive[US.S1][UV.V8],
        },
        delta: archive[US.S1].total === null ? null : actual[US.S1].total - archive[US.S1].total,
        quote: quotes[US.S1].total === null ? null : limit(quotes[US.S1].total / 100.0, 3),
        quotes: {
          total: quotes[US.S1].total === null ? null : limit(quotes[US.S1].total / 100.0, 3),
          [UAG.G0517]: {
            total: quotes[US.S1][UAG.G0517] === null ? null : limit(quotes[US.S1][UAG.G0517] / 100.0, 3),
            [UAG.G0511]: quotes[US.S1][UAG.G0511] === null ? null : limit(quotes[US.S1][UAG.G0511] / 100.0, 3),
            [UAG.G1217]: quotes[US.S1][UAG.G1217] === null ? null : limit(quotes[US.S1][UAG.G1217] / 100.0, 3),
          },
          [UAG.G18pl]: {
            total: quotes[US.S1][UAG.G18pl] === null ? null : limit(quotes[US.S1][UAG.G18pl] / 100.0, 3),
            [UAG.G1859]: quotes[US.S1][UAG.G1859] === null ? null : limit(quotes[US.S1][UAG.G1859] / 100.0, 3),
            [UAG.G60pl]: quotes[US.S1][UAG.G60pl] === null ? null : limit(quotes[US.S1][UAG.G60pl] / 100.0, 3),
          },
        },
        [SN[US.S2]]: {
          vaccinated: quotes.vaccination[US.S2],
          vaccination: {
            [UV.V1]: actual[US.S2][UV.V1],
            [UV.V2]: actual[US.S2][UV.V2],
            [UV.V3]: actual[US.S2][UV.V3],
            [UV.V4]: actual[US.S2][UV.V4],
            [UV.V5]: actual[US.S2][UV.V5],
            [UV.V6]: actual[US.S2][UV.V6],
            [UV.V7]: actual[US.S2][UV.V7],
            [UV.V8]: actual[US.S2][UV.V8],
            [UVD.V1]: actual[US.S2][UV.V1] === null && archive[US.S2][UV.V1] === null ? null : actual[US.S2][UV.V1] - archive[US.S2][UV.V1],
            [UVD.V2]: actual[US.S2][UV.V2] === null && archive[US.S2][UV.V2] === null ? null : actual[US.S2][UV.V2] - archive[US.S2][UV.V2],
            [UVD.V3]: actual[US.S2][UV.V3] === null && archive[US.S2][UV.V3] === null ? null : actual[US.S2][UV.V3] - archive[US.S2][UV.V3],
            [UVD.V4]: actual[US.S2][UV.V4] === null && archive[US.S2][UV.V4] === null ? null : actual[US.S2][UV.V4] - archive[US.S2][UV.V4],
            [UVD.V5]: actual[US.S2][UV.V5] === null && archive[US.S2][UV.V5] === null ? null : actual[US.S2][UV.V5] - archive[US.S2][UV.V5],
            [UVD.V6]: actual[US.S2][UV.V6] === null && archive[US.S2][UV.V6] === null ? null : actual[US.S2][UV.V6] - archive[US.S2][UV.V6],
            [UVD.V7]: actual[US.S2][UV.V7] === null && archive[US.S2][UV.V7] === null ? null : actual[US.S2][UV.V7] - archive[US.S2][UV.V7],
            [UVD.V8]: actual[US.S2][UV.V8] === null && archive[US.S2][UV.V8] === null ? null : actual[US.S2][UV.V8] - archive[US.S2][UV.V8],
          },
          delta: archive[US.S2].total === null ? null : actual[US.S2].total - archive[US.S2].total,
          quote: quotes[US.S2].total === null ? null : limit(quotes[US.S2].total / 100.0, 3),
          quotes: {
            total: quotes[US.S2].total === null ? null : limit(quotes[US.S2].total / 100.0, 3),
            [UAG.G0517]: {
              total: quotes[US.S2][UAG.G0517] === null ? null : limit(quotes[US.S2][UAG.G0517] / 100.0, 3),
              [UAG.G0511]: quotes[US.S2][UAG.G0511] === null ? null : limit(quotes[US.S2][UAG.G0511] / 100.0, 3),
              [UAG.G1217]: quotes[US.S2][UAG.G1217] === null ? null : limit(quotes[US.S2][UAG.G1217] / 100.0, 3),
            },
            [UAG.G18pl]: {
              total: quotes[US.S2][UAG.G18pl] === null ? null : limit(quotes[US.S2][UAG.G18pl] / 100.0, 3),
              [UAG.G1859]: quotes[US.S2][UAG.G1859] === null ? null : limit(quotes[US.S2][UAG.G1859] / 100.0, 3),
              [UAG.G60pl]: quotes[US.S2][UAG.G60pl] === null ? null : limit(quotes[US.S2][UAG.G60pl] / 100.0, 3),
            },
          },
        },
        [SN[US.S3]]: {
          vaccinated: quotes.vaccination[US.S3],
          vaccination: {
            [UV.V1]: actual[US.S3][UV.V1],
            [UV.V2]: actual[US.S3][UV.V2],
            [UV.V3]: actual[US.S3][UV.V3],
            [UV.V4]: actual[US.S3][UV.V4],
            [UV.V5]: actual[US.S3][UV.V5],
            [UV.V6]: actual[US.S3][UV.V6],
            [UV.V7]: actual[US.S3][UV.V7],
            [UV.V8]: actual[US.S3][UV.V8],
            [UVD.V1]: actual[US.S3][UV.V1] === null && archive[US.S3][UV.V1] === null ? null : actual[US.S3][UV.V1] - archive[US.S3][UV.V1],
            [UVD.V2]: actual[US.S3][UV.V2] === null && archive[US.S3][UV.V2] === null ? null : actual[US.S3][UV.V2] - archive[US.S3][UV.V2],
            [UVD.V3]: actual[US.S3][UV.V3] === null && archive[US.S3][UV.V3] === null ? null : actual[US.S3][UV.V3] - archive[US.S3][UV.V3],
            [UVD.V4]: actual[US.S3][UV.V4] === null && archive[US.S3][UV.V4] === null ? null : actual[US.S3][UV.V4] - archive[US.S3][UV.V4],
            [UVD.V5]: actual[US.S3][UV.V5] === null && archive[US.S3][UV.V5] === null ? null : actual[US.S3][UV.V5] - archive[US.S3][UV.V5],
            [UVD.V6]: actual[US.S3][UV.V6] === null && archive[US.S3][UV.V6] === null ? null : actual[US.S3][UV.V6] - archive[US.S3][UV.V6],
            [UVD.V7]: actual[US.S3][UV.V7] === null && archive[US.S3][UV.V7] === null ? null : actual[US.S3][UV.V7] - archive[US.S3][UV.V7],
            [UVD.V8]: actual[US.S3][UV.V8] === null && archive[US.S3][UV.V8] === null ? null : actual[US.S3][UV.V8] - archive[US.S3][UV.V8],
          },
          delta: archive[US.S3].total === null ? null : actual[US.S3].total - archive[US.S3].total,
          quote: quotes[US.S3].total === null ? null : limit(quotes[US.S3].total / 100.0, 3),
          quotes: {
            total: quotes[US.S3].total === null ? null : limit(quotes[US.S3].total / 100.0, 3),
            [UAG.G1217]: quotes[US.S3][UAG.G1217] === null ? null : limit(quotes[US.S3][UAG.G1217] / 100.0, 3),
            [UAG.G18pl]: {
              total: quotes[US.S3][UAG.G18pl] === null ? null : limit(quotes[US.S3][UAG.G18pl] / 100.0, 3),
              [UAG.G1859]: quotes[US.S3][UAG.G1859] === null ? null : limit(quotes[US.S3][UAG.G1859] / 100.0, 3),
              [UAG.G60pl]: quotes[US.S3][UAG.G60pl] === null ? null : limit(quotes[US.S3][UAG.G60pl] / 100.0, 3),
            },
          },
        },
        [SN[US.S4]]: {
          vaccinated: quotes.vaccination.secondBooster,
          vaccination: {
            [UV.V1]: actual[US.S4][UV.V1],
            [UV.V2]: actual[US.S4][UV.V2],
            [UV.V3]: actual[US.S4][UV.V3],
            [UV.V4]: actual[US.S4][UV.V4],
            [UV.V5]: actual[US.S4][UV.V5],
            [UV.V6]: actual[US.S4][UV.V6],
            [UV.V7]: actual[US.S4][UV.V7],
            [UV.V8]: actual[US.S4][UV.V8],
            [UVD.V1]: actual[US.S4][UV.V1] === null && archive[US.S4][UV.V1] === null ? null : actual[US.S4][UV.V1] - archive[US.S4][UV.V1],
            [UVD.V2]: actual[US.S4][UV.V2] === null && archive[US.S4][UV.V2] === null ? null : actual[US.S4][UV.V2] - archive[US.S4][UV.V2],
            [UVD.V3]: actual[US.S4][UV.V3] === null && archive[US.S4][UV.V3] === null ? null : actual[US.S4][UV.V3] - archive[US.S4][UV.V3],
            [UVD.V4]: actual[US.S4][UV.V4] === null && archive[US.S4][UV.V4] === null ? null : actual[US.S4][UV.V4] - archive[US.S4][UV.V4],
            [UVD.V5]: actual[US.S4][UV.V5] === null && archive[US.S4][UV.V5] === null ? null : actual[US.S4][UV.V5] - archive[US.S4][UV.V5],
            [UVD.V6]: actual[US.S4][UV.V6] === null && archive[US.S4][UV.V6] === null ? null : actual[US.S4][UV.V6] - archive[US.S4][UV.V6],
            [UVD.V7]: actual[US.S4][UV.V7] === null && archive[US.S4][UV.V7] === null ? null : actual[US.S4][UV.V7] - archive[US.S4][UV.V7],
            [UVD.V8]: actual[US.S4][UV.V8] === null && archive[US.S4][UV.V8] === null ? null : actual[US.S4][UV.V8] - archive[US.S4][UV.V8],
          },
          delta: archive[US.S4].total === null ? null : actual[US.S4].total - archive[US.S4].total,
          quote: quotes[US.S4].total === null ? null : limit(quotes[US.S4].total / 100.0, 3),
          quotes: {
            total: quotes[US.S4].total === null ? null : limit(quotes[US.S4].total / 100.0, 3),
            [UAG.G1217]: quotes[US.S4][UAG.G1217] === null ? null : limit(quotes[US.S4][UAG.G1217] / 100.0, 3),
            [UAG.G18pl]: {
              total: quotes[US.S4][UAG.G18pl] === null ? null : limit(quotes[US.S4][UAG.G18pl] / 100.0, 3),
              [UAG.G1859]: quotes[US.S4][UAG.G1859] === null ? null : limit(quotes[US.S4][UAG.G1859] / 100.0, 3),
              [UAG.G60pl]: quotes[US.S4][UAG.G60pl] === null ? null : limit(quotes[US.S4][UAG.G60pl] / 100.0, 3),
            },
          },
        },
      };
    }
  }

  function limit(value: number, decimals: number): number {
    return parseFloat(value.toFixed(decimals));
  }
  return {
    data: coverage,
    lastUpdate: lastUpdate,
  };
}

interface VacciantionHistoryDataObject {
  [date: string]: VaccinationHistoryEntry;
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
          const seriesKey = "S" + series.toString();
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
          dateEntry[SeriesHistory[seriesKey]] += count;
          if (series == 1) dateEntry.vaccinated += count; // legacy Entry

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
        "https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/master/Metadaten/zenodo.json"
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
