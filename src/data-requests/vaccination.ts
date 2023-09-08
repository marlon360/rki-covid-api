import axios from "axios";
import { ResponseData } from "./response-data";
import parse from "csv-parse";
import {
  cleanupString,
  getStateAbbreviationByName,
  getDateBefore,
  AddDaysToDate,
  limit,
  GetApiCommit,
  GetApiTrees,
} from "../utils";
import { ApiData } from "./r-value";

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

// UsedSeries
enum US {
  S1 = "first",
  S1I = "firstInfant",
  S2 = "full",
  S2I = "fullInfant",
  S3 = "firstBooster",
  S4 = "secondBooster",
  S5 = "thirdBooster",
  S6 = "fourthBooster",
}

//seriesName
enum SN {
  "first" = "vaccination",
  "full" = "secondVaccination",
  "firstBooster" = "boosterVaccination",
  "secondBooster" = "2ndBoosterVaccination",
  "thirdBooster" = "3rdBoosterVaccination",
  "fourthBooster" = "4thBoosterVaccination",
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
  V9 = "biontechInfant",
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
  V9 = "deltaBiontechInfant",
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
  "Comirnaty-Kleinkinder" = "biontechInfant",
}

// UsedAgeGroups
enum UAG {
  /* A00-A04 is not used at the moment
  G0004 = "A00-A04",
  */
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
  [SN.thirdBooster]: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    /* The RKI does not provide any quotes for third booster
    quote: number;
    quotes: CoverageQuotesS3S4;
    */
  };
  [SN.fourthBooster]: {
    vaccinated: number;
    vaccination: CoverageVaccine;
    delta: number;
    /* The RKI does not provide any quotes for fourth booster
    quote: number;
    quotes: CoverageQuotesS3S4;
    */
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
      [SN.thirdBooster]: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        /* The RKI does not provide any quotes for third booster
        quote: number;
        quotes: CoverageQuotesS3S4;
        */
      };
      [SN.fourthBooster]: {
        vaccinated: number;
        vaccination: CoverageVaccine;
        delta: number;
        /* The RKI does not provide any quotes for fourth booster
        quote: number;
        quotes: CoverageQuotesS3S4;
        */
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
  [UV.V9]: number;
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
  [UVD.V9]: number;
}

interface StateEntry {
  [US.S1]: Vaccine;
  [US.S2]: Vaccine;
  [US.S3]: Vaccine;
  [US.S4]: Vaccine;
  [US.S5]: Vaccine;
  [US.S6]: Vaccine;
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
      [US.S1I]: number;
      [US.S2]: number;
      [US.S2I]: number;
      [US.S3]: number;
      [US.S4]: number;
      [US.S5]: number;
      [US.S6]: number;
    };
    [US.S1]: QuotesRegular;
    [US.S2]: QuotesRegular;
    [US.S3]: QuotesBoost;
    [US.S4]: QuotesBoost;
    /* The RKI does not provide any quotes for third and fourth booster
    [US.S5]: QuotesBoost;
    [US.S6]: QuotesBoost;
    */
  };
}
[];
// empty objects for later use
// emptyVaccinesObject
const emptyVaccinesObject: Vaccines = {
  [UV.V1]: null,
  [UV.V2]: null,
  [UV.V3]: null,
  [UV.V4]: null,
  [UV.V5]: null,
  [UV.V6]: null,
  [UV.V7]: null,
  [UV.V8]: null,
  [UV.V9]: null,
};
// empty CoverageVaccineObject
const emptyCoverageVaccineObject: CoverageVaccine = {
  ...clone(emptyVaccinesObject),
  [UVD.V1]: null,
  [UVD.V2]: null,
  [UVD.V3]: null,
  [UVD.V4]: null,
  [UVD.V5]: null,
  [UVD.V6]: null,
  [UVD.V7]: null,
  [UVD.V8]: null,
  [UVD.V9]: null,
};
// empty CoverageQuotesS1S2Object
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
// empty CoverageQuotesS3S4Object
const emptyCoverageQuotesS3S4Object: CoverageQuotesS3S4 = {
  total: null,
  [UAG.G1217]: null,
  [UAG.G18pl]: {
    total: null,
    [UAG.G1859]: null,
    [UAG.G60pl]: null,
  },
};

// empty vaccine Object
const vaccineObject: Vaccine = {
  total: null,
  ...clone(emptyVaccinesObject),
};

const emptyStateObject: StateEntry = {
  [US.S1]: clone(vaccineObject),
  [US.S2]: clone(vaccineObject),
  [US.S3]: clone(vaccineObject),
  [US.S4]: clone(vaccineObject),
  [US.S5]: clone(vaccineObject),
  [US.S6]: clone(vaccineObject),
};

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
      // continue if series not available
      if (US[seriesKey] == null) {
        continue;
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
    "https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/main/Deutschland_Bundeslaender_COVID-19-Impfungen.csv";
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
        url: "https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/main/Deutschland_Impfquoten_COVID-19.csv",
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
            // VariableName       csv header name (2022-12-03)
            date, // Datum,
            name, // Bundesland,
            id, // BundeslandId_Impfort,
            total, // Impfungen_gesamt,
            first, // Impfungen_gesamt_min1,
            firstInfant, // Impfungen_gesamt_00bis04_min1,
            full, // Impfungen_gesamt_gi,
            fullInfant, // Impfungen_gesamt_00bis04_gi,
            firstBooster, // Impfungen_gesamt_boost1,
            secondBooster, // Impfungen_gesamt_boost2,
            thirdBooster, // Impfungen_gesamt_boost3,
            fourthBooster, // Impfungen_gesamt_boost4,
            qFirstTotal, // Impfquote_gesamt_min1,
            qFirst05bis17, // Impfquote_05bis17_min1,
            qFirst05bis11, // Impfquote_05bis11_min1,
            qFirst12bis17, // Impfquote_12bis17_min1,
            qFirst18plus, // Impfquote_18plus_min1,
            qFirst18bis59, // Impfquote_18bis59_min1,
            qFirst60plus, // Impfquote_60plus_min1,
            qFullTotal, // Impfquote_gesamt_gi,
            qFull05bis17, // Impfquote_05bis17_gi,
            qFull05bis11, // Impfquote_05bis11_gi,
            qFull12bis17, // Impfquote_12bis17_gi,
            qFull18plus, // Impfquote_18plus_gi,
            qFull18bis59, // Impfquote_18bis59_gi,
            qFull60plus, // Impfquote_60plus_gi,
            q1BoostTotal, // Impfquote_gesamt_boost1,
            q1Boost12bis17, // Impfquote_12bis17_boost1,
            q1Boost18plus, // Impfquote_18plus_boost1,
            q1Boost18bis59, // Impfquote_18bis59_boost1,
            q1Boost60plus, // Impfquote_60plus_boost1,
            q2BoostTotal, // Impfquote_gesamt_boost2,
            q2Boost12bis17, // Impfquote_12bis17_boost2,
            q2Boost18plus, // Impfquote_18plus_boost2,
            q2Boost18bis59, // Impfquote_18bis59_boost2,
            q2Boost60plus, // Impfquote_60plus_boost2,
            // no quotes for third and fourth booster are privided !
          ] = record;
          quoteVaccinationDataObject[id] = {
            name: name,
            vaccination: {
              total: total,
              [US.S1]: first,
              [US.S1I]: firstInfant,
              [US.S2]: full,
              [US.S2I]: fullInfant,
              [US.S3]: firstBooster,
              [US.S4]: secondBooster,
              [US.S5]: thirdBooster,
              [US.S6]: fourthBooster,
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
            /* The RKI does not provide quotes for the third and fourth booster
            [US.S5]: {
              total: q2BoostTotal,
              [UAG.G1217]: q2Boost12bis17,
              [UAG.G18pl]: q2Boost18plus,
              [UAG.G1859]: q2Boost18bis59,
              [UAG.G60pl]: q2Boost60plus,
            },
            [US.S6]: {
              total: q2BoostTotal,
              [UAG.G1217]: q2Boost12bis17,
              [UAG.G18pl]: q2Boost18plus,
              [UAG.G1859]: q2Boost18bis59,
              [UAG.G60pl]: q2Boost60plus,
            },
            */
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
  const apiUrlCommitsMain = new URL(`https://api.github.com/repos/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/commits/main`);
  const apiResponse: { lastUpdate: Date; sha: string } = await GetApiCommit(apiUrlCommitsMain.href, apiUrlCommitsMain.pathname)
    .then((apiData) => {
      const lastUpdate = new Date(apiData.commit.author.date);
      const sha = apiData.sha;
      return { lastUpdate, sha };
    });
  const lastUpdate = apiResponse.lastUpdate;
  const sha = apiResponse.sha;

  // finde den letzten Datansatz bevor dem aktuellen
  const apiUrlTreesSha = new URL(`https://api.github.com/repos/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/git/trees/${sha}`);
  const filesResponse = await GetApiTrees(apiUrlTreesSha.href,apiUrlTreesSha.pathname);
  const baseFiles = filesResponse.tree;
  const archiveSha = baseFiles.find((entry) => entry.path == "Archiv").sha;
  const apiUrlTreesArchivSha = new URL(`https://api.github.com/repos/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/git/trees/${archiveSha}`);
  const archiveResponse = await GetApiTrees(apiUrlTreesArchivSha.href, apiUrlTreesArchivSha.pathname);
  const archiveFile = archiveResponse.tree
    .filter((entry) => entry.path.includes("Bundeslaender"))
    .sort((a, b) => {
      const dateA = new Date(a.path.substr(0, 10));
      const dateB = new Date(b.path.substr(0, 10));
      return dateB.getTime() - dateA.getTime();
    })[1].path;
  const archiveUrl = `https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/main/Archiv/${archiveFile}`;
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
    [SN[US.S5]]: {
      vaccinated: null,
      vaccination: clone(emptyCoverageVaccineObject),
      delta: null,
    },
    [SN[US.S6]]: {
      vaccinated: null,
      vaccination: clone(emptyCoverageVaccineObject),
      delta: null,
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
        [UV.V9]: actual[US.S1][UV.V9],
        [UVD.V1]: actual[US.S1][UV.V1] === null && archive[US.S1][UV.V1] === null ? null : actual[US.S1][UV.V1] - archive[US.S1][UV.V1],
        [UVD.V2]: actual[US.S1][UV.V2] === null && archive[US.S1][UV.V2] === null ? null : actual[US.S1][UV.V2] - archive[US.S1][UV.V2],
        [UVD.V3]: actual[US.S1][UV.V3] === null && archive[US.S1][UV.V3] === null ? null : actual[US.S1][UV.V3] - archive[US.S1][UV.V3],
        [UVD.V4]: actual[US.S1][UV.V4] === null && archive[US.S1][UV.V4] === null ? null : actual[US.S1][UV.V4] - archive[US.S1][UV.V4],
        [UVD.V5]: actual[US.S1][UV.V5] === null && archive[US.S1][UV.V5] === null ? null : actual[US.S1][UV.V5] - archive[US.S1][UV.V5],
        [UVD.V6]: actual[US.S1][UV.V6] === null && archive[US.S1][UV.V6] === null ? null : actual[US.S1][UV.V6] - archive[US.S1][UV.V6],
        [UVD.V7]: actual[US.S1][UV.V7] === null && archive[US.S1][UV.V7] === null ? null : actual[US.S1][UV.V7] - archive[US.S1][UV.V7],
        [UVD.V8]: actual[US.S1][UV.V8] === null && archive[US.S1][UV.V8] === null ? null : actual[US.S1][UV.V8] - archive[US.S1][UV.V8],
        [UVD.V9]: actual[US.S1][UV.V9] === null && archive[US.S1][UV.V9] === null ? null : actual[US.S1][UV.V9] - archive[US.S1][UV.V9],
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
          [UV.V9]: actual[US.S2][UV.V9],
          [UVD.V1]: actual[US.S2][UV.V1] === null && archive[US.S2][UV.V1] === null ? null : actual[US.S2][UV.V1] - archive[US.S2][UV.V1],
          [UVD.V2]: actual[US.S2][UV.V2] === null && archive[US.S2][UV.V2] === null ? null : actual[US.S2][UV.V2] - archive[US.S2][UV.V2],
          [UVD.V3]: actual[US.S2][UV.V3] === null && archive[US.S2][UV.V3] === null ? null : actual[US.S2][UV.V3] - archive[US.S2][UV.V3],
          [UVD.V4]: actual[US.S2][UV.V4] === null && archive[US.S2][UV.V4] === null ? null : actual[US.S2][UV.V4] - archive[US.S2][UV.V4],
          [UVD.V5]: actual[US.S2][UV.V5] === null && archive[US.S2][UV.V5] === null ? null : actual[US.S2][UV.V5] - archive[US.S2][UV.V5],
          [UVD.V6]: actual[US.S2][UV.V6] === null && archive[US.S2][UV.V6] === null ? null : actual[US.S2][UV.V6] - archive[US.S2][UV.V6],
          [UVD.V7]: actual[US.S2][UV.V7] === null && archive[US.S2][UV.V7] === null ? null : actual[US.S2][UV.V7] - archive[US.S2][UV.V7],
          [UVD.V8]: actual[US.S2][UV.V8] === null && archive[US.S2][UV.V8] === null ? null : actual[US.S2][UV.V8] - archive[US.S2][UV.V8],
          [UVD.V9]: actual[US.S2][UV.V9] === null && archive[US.S2][UV.V9] === null ? null : actual[US.S2][UV.V9] - archive[US.S2][UV.V9],
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
          [UV.V9]: actual[US.S3][UV.V9],
          [UVD.V1]: actual[US.S3][UV.V1] === null && archive[US.S3][UV.V1] === null ? null : actual[US.S3][UV.V1] - archive[US.S3][UV.V1],
          [UVD.V2]: actual[US.S3][UV.V2] === null && archive[US.S3][UV.V2] === null ? null : actual[US.S3][UV.V2] - archive[US.S3][UV.V2],
          [UVD.V3]: actual[US.S3][UV.V3] === null && archive[US.S3][UV.V3] === null ? null : actual[US.S3][UV.V3] - archive[US.S3][UV.V3],
          [UVD.V4]: actual[US.S3][UV.V4] === null && archive[US.S3][UV.V4] === null ? null : actual[US.S3][UV.V4] - archive[US.S3][UV.V4],
          [UVD.V5]: actual[US.S3][UV.V5] === null && archive[US.S3][UV.V5] === null ? null : actual[US.S3][UV.V5] - archive[US.S3][UV.V5],
          [UVD.V6]: actual[US.S3][UV.V6] === null && archive[US.S3][UV.V6] === null ? null : actual[US.S3][UV.V6] - archive[US.S3][UV.V6],
          [UVD.V7]: actual[US.S3][UV.V7] === null && archive[US.S3][UV.V7] === null ? null : actual[US.S3][UV.V7] - archive[US.S3][UV.V7],
          [UVD.V8]: actual[US.S3][UV.V8] === null && archive[US.S3][UV.V8] === null ? null : actual[US.S3][UV.V8] - archive[US.S3][UV.V8],
          [UVD.V9]: actual[US.S3][UV.V9] === null && archive[US.S3][UV.V9] === null ? null : actual[US.S3][UV.V9] - archive[US.S3][UV.V9],
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
          [UV.V9]: actual[US.S4][UV.V9],
          [UVD.V1]: actual[US.S4][UV.V1] === null && archive[US.S4][UV.V1] === null ? null : actual[US.S4][UV.V1] - archive[US.S4][UV.V1],
          [UVD.V2]: actual[US.S4][UV.V2] === null && archive[US.S4][UV.V2] === null ? null : actual[US.S4][UV.V2] - archive[US.S4][UV.V2],
          [UVD.V3]: actual[US.S4][UV.V3] === null && archive[US.S4][UV.V3] === null ? null : actual[US.S4][UV.V3] - archive[US.S4][UV.V3],
          [UVD.V4]: actual[US.S4][UV.V4] === null && archive[US.S4][UV.V4] === null ? null : actual[US.S4][UV.V4] - archive[US.S4][UV.V4],
          [UVD.V5]: actual[US.S4][UV.V5] === null && archive[US.S4][UV.V5] === null ? null : actual[US.S4][UV.V5] - archive[US.S4][UV.V5],
          [UVD.V6]: actual[US.S4][UV.V6] === null && archive[US.S4][UV.V6] === null ? null : actual[US.S4][UV.V6] - archive[US.S4][UV.V6],
          [UVD.V7]: actual[US.S4][UV.V7] === null && archive[US.S4][UV.V7] === null ? null : actual[US.S4][UV.V7] - archive[US.S4][UV.V7],
          [UVD.V8]: actual[US.S4][UV.V8] === null && archive[US.S4][UV.V8] === null ? null : actual[US.S4][UV.V8] - archive[US.S4][UV.V8],
          [UVD.V9]: actual[US.S4][UV.V9] === null && archive[US.S4][UV.V9] === null ? null : actual[US.S4][UV.V9] - archive[US.S4][UV.V9],
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
      coverage[SN[US.S5]] = {
        vaccinated: quotes.vaccination[US.S5],
        vaccination: {
          [UV.V1]: actual[US.S5][UV.V1],
          [UV.V2]: actual[US.S5][UV.V2],
          [UV.V3]: actual[US.S5][UV.V3],
          [UV.V4]: actual[US.S5][UV.V4],
          [UV.V5]: actual[US.S5][UV.V5],
          [UV.V6]: actual[US.S5][UV.V6],
          [UV.V7]: actual[US.S5][UV.V7],
          [UV.V8]: actual[US.S5][UV.V8],
          [UV.V9]: actual[US.S5][UV.V9],
          [UVD.V1]: actual[US.S5][UV.V1] === null && archive[US.S5][UV.V1] === null ? null : actual[US.S5][UV.V1] - archive[US.S5][UV.V1],
          [UVD.V2]: actual[US.S5][UV.V2] === null && archive[US.S5][UV.V2] === null ? null : actual[US.S5][UV.V2] - archive[US.S5][UV.V2],
          [UVD.V3]: actual[US.S5][UV.V3] === null && archive[US.S5][UV.V3] === null ? null : actual[US.S5][UV.V3] - archive[US.S5][UV.V3],
          [UVD.V4]: actual[US.S5][UV.V4] === null && archive[US.S5][UV.V4] === null ? null : actual[US.S5][UV.V4] - archive[US.S5][UV.V4],
          [UVD.V5]: actual[US.S5][UV.V5] === null && archive[US.S5][UV.V5] === null ? null : actual[US.S5][UV.V5] - archive[US.S5][UV.V5],
          [UVD.V6]: actual[US.S5][UV.V6] === null && archive[US.S5][UV.V6] === null ? null : actual[US.S5][UV.V6] - archive[US.S5][UV.V6],
          [UVD.V7]: actual[US.S5][UV.V7] === null && archive[US.S5][UV.V7] === null ? null : actual[US.S5][UV.V7] - archive[US.S5][UV.V7],
          [UVD.V8]: actual[US.S5][UV.V8] === null && archive[US.S5][UV.V8] === null ? null : actual[US.S5][UV.V8] - archive[US.S5][UV.V8],
          [UVD.V9]: actual[US.S5][UV.V9] === null && archive[US.S5][UV.V9] === null ? null : actual[US.S5][UV.V9] - archive[US.S5][UV.V9],
        },
        delta: archive[US.S5].total === null ? null : actual[US.S5].total - archive[US.S5].total,
        /* The RKI does not provide any quotes for the third Booster
        quote: quotes[US.S5].total === null ? null : limit(quotes[US.S5].total / 100.0, 3),
        quotes: {
          total: quotes[US.S5].total === null ? null : limit(quotes[US.S5].total / 100.0, 3),
          [UAG.G1217]: quotes[US.S5][UAG.G1217] === null ? null : limit(quotes[US.S5][UAG.G1217] / 100.0, 3),
          [UAG.G18pl]: {
            total: quotes[US.S5][UAG.G18pl] === null ? null : limit(quotes[US.S5][UAG.G18pl] / 100.0, 3),
            [UAG.G1859]: quotes[US.S5][UAG.G1859] === null ? null : limit(quotes[US.S5][UAG.G1859] / 100.0, 3),
            [UAG.G60pl]: quotes[US.S5][UAG.G60pl] === null ? null : limit(quotes[US.S5][UAG.G60pl] / 100.0, 3),
          },
        },
        */
      };
      coverage[SN[US.S6]] = {
        vaccinated: quotes.vaccination[US.S6],
        vaccination: {
          [UV.V1]: actual[US.S6][UV.V1],
          [UV.V2]: actual[US.S6][UV.V2],
          [UV.V3]: actual[US.S6][UV.V3],
          [UV.V4]: actual[US.S6][UV.V4],
          [UV.V5]: actual[US.S6][UV.V5],
          [UV.V6]: actual[US.S6][UV.V6],
          [UV.V7]: actual[US.S6][UV.V7],
          [UV.V8]: actual[US.S6][UV.V8],
          [UV.V9]: actual[US.S6][UV.V9],
          [UVD.V1]: actual[US.S6][UV.V1] === null && archive[US.S6][UV.V1] === null ? null : actual[US.S6][UV.V1] - archive[US.S6][UV.V1],
          [UVD.V2]: actual[US.S6][UV.V2] === null && archive[US.S6][UV.V2] === null ? null : actual[US.S6][UV.V2] - archive[US.S6][UV.V2],
          [UVD.V3]: actual[US.S6][UV.V3] === null && archive[US.S6][UV.V3] === null ? null : actual[US.S6][UV.V3] - archive[US.S6][UV.V3],
          [UVD.V4]: actual[US.S6][UV.V4] === null && archive[US.S6][UV.V4] === null ? null : actual[US.S6][UV.V4] - archive[US.S6][UV.V4],
          [UVD.V5]: actual[US.S6][UV.V5] === null && archive[US.S6][UV.V5] === null ? null : actual[US.S6][UV.V5] - archive[US.S6][UV.V5],
          [UVD.V6]: actual[US.S6][UV.V6] === null && archive[US.S6][UV.V6] === null ? null : actual[US.S6][UV.V6] - archive[US.S6][UV.V6],
          [UVD.V7]: actual[US.S6][UV.V7] === null && archive[US.S6][UV.V7] === null ? null : actual[US.S6][UV.V7] - archive[US.S6][UV.V7],
          [UVD.V8]: actual[US.S6][UV.V8] === null && archive[US.S6][UV.V8] === null ? null : actual[US.S6][UV.V8] - archive[US.S6][UV.V8],
          [UVD.V9]: actual[US.S6][UV.V9] === null && archive[US.S6][UV.V9] === null ? null : actual[US.S6][UV.V9] - archive[US.S6][UV.V9],
        },
        delta: archive[US.S6].total === null ? null : actual[US.S6].total - archive[US.S6].total,
        /* The RKI does not provide any quotes for the fourth Booster
        quote: quotes[US.S6].total === null ? null : limit(quotes[US.S6].total / 100.0, 3),
        quotes: {
          total: quotes[US.S6].total === null ? null : limit(quotes[US.S6].total / 100.0, 3),
          [UAG.G1217]: quotes[US.S6][UAG.G1217] === null ? null : limit(quotes[US.S6][UAG.G1217] / 100.0, 3),
          [UAG.G18pl]: {
            total: quotes[US.S6][UAG.G18pl] === null ? null : limit(quotes[US.S6][UAG.G18pl] / 100.0, 3),
            [UAG.G1859]: quotes[US.S6][UAG.G1859] === null ? null : limit(quotes[US.S6][UAG.G1859] / 100.0, 3),
            [UAG.G60pl]: quotes[US.S6][UAG.G60pl] === null ? null : limit(quotes[US.S6][UAG.G60pl] / 100.0, 3),
          },
        },
        */
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
          [UV.V9]: actual[US.S1][UV.V9],
          [UVD.V1]: actual[US.S1][UV.V1] === null && archive[US.S1][UV.V1] === null ? null : actual[US.S1][UV.V1] - archive[US.S1][UV.V1],
          [UVD.V2]: actual[US.S1][UV.V2] === null && archive[US.S1][UV.V2] === null ? null : actual[US.S1][UV.V2] - archive[US.S1][UV.V2],
          [UVD.V3]: actual[US.S1][UV.V3] === null && archive[US.S1][UV.V3] === null ? null : actual[US.S1][UV.V3] - archive[US.S1][UV.V3],
          [UVD.V4]: actual[US.S1][UV.V4] === null && archive[US.S1][UV.V4] === null ? null : actual[US.S1][UV.V4] - archive[US.S1][UV.V4],
          [UVD.V5]: actual[US.S1][UV.V5] === null && archive[US.S1][UV.V5] === null ? null : actual[US.S1][UV.V5] - archive[US.S1][UV.V5],
          [UVD.V6]: actual[US.S1][UV.V6] === null && archive[US.S1][UV.V6] === null ? null : actual[US.S1][UV.V6] - archive[US.S1][UV.V6],
          [UVD.V7]: actual[US.S1][UV.V7] === null && archive[US.S1][UV.V7] === null ? null : actual[US.S1][UV.V7] - archive[US.S1][UV.V7],
          [UVD.V8]: actual[US.S1][UV.V8] === null && archive[US.S1][UV.V8] === null ? null : actual[US.S1][UV.V8] - archive[US.S1][UV.V8],
          [UVD.V9]: actual[US.S1][UV.V9] === null && archive[US.S1][UV.V9] === null ? null : actual[US.S1][UV.V9] - archive[US.S1][UV.V9],
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
            [UV.V9]: actual[US.S2][UV.V9],
            [UVD.V1]: actual[US.S2][UV.V1] === null && archive[US.S2][UV.V1] === null ? null : actual[US.S2][UV.V1] - archive[US.S2][UV.V1],
            [UVD.V2]: actual[US.S2][UV.V2] === null && archive[US.S2][UV.V2] === null ? null : actual[US.S2][UV.V2] - archive[US.S2][UV.V2],
            [UVD.V3]: actual[US.S2][UV.V3] === null && archive[US.S2][UV.V3] === null ? null : actual[US.S2][UV.V3] - archive[US.S2][UV.V3],
            [UVD.V4]: actual[US.S2][UV.V4] === null && archive[US.S2][UV.V4] === null ? null : actual[US.S2][UV.V4] - archive[US.S2][UV.V4],
            [UVD.V5]: actual[US.S2][UV.V5] === null && archive[US.S2][UV.V5] === null ? null : actual[US.S2][UV.V5] - archive[US.S2][UV.V5],
            [UVD.V6]: actual[US.S2][UV.V6] === null && archive[US.S2][UV.V6] === null ? null : actual[US.S2][UV.V6] - archive[US.S2][UV.V6],
            [UVD.V7]: actual[US.S2][UV.V7] === null && archive[US.S2][UV.V7] === null ? null : actual[US.S2][UV.V7] - archive[US.S2][UV.V7],
            [UVD.V8]: actual[US.S2][UV.V8] === null && archive[US.S2][UV.V8] === null ? null : actual[US.S2][UV.V8] - archive[US.S2][UV.V8],
            [UVD.V9]: actual[US.S2][UV.V9] === null && archive[US.S2][UV.V9] === null ? null : actual[US.S2][UV.V9] - archive[US.S2][UV.V9],
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
            [UV.V9]: actual[US.S3][UV.V9],
            [UVD.V1]: actual[US.S3][UV.V1] === null && archive[US.S3][UV.V1] === null ? null : actual[US.S3][UV.V1] - archive[US.S3][UV.V1],
            [UVD.V2]: actual[US.S3][UV.V2] === null && archive[US.S3][UV.V2] === null ? null : actual[US.S3][UV.V2] - archive[US.S3][UV.V2],
            [UVD.V3]: actual[US.S3][UV.V3] === null && archive[US.S3][UV.V3] === null ? null : actual[US.S3][UV.V3] - archive[US.S3][UV.V3],
            [UVD.V4]: actual[US.S3][UV.V4] === null && archive[US.S3][UV.V4] === null ? null : actual[US.S3][UV.V4] - archive[US.S3][UV.V4],
            [UVD.V5]: actual[US.S3][UV.V5] === null && archive[US.S3][UV.V5] === null ? null : actual[US.S3][UV.V5] - archive[US.S3][UV.V5],
            [UVD.V6]: actual[US.S3][UV.V6] === null && archive[US.S3][UV.V6] === null ? null : actual[US.S3][UV.V6] - archive[US.S3][UV.V6],
            [UVD.V7]: actual[US.S3][UV.V7] === null && archive[US.S3][UV.V7] === null ? null : actual[US.S3][UV.V7] - archive[US.S3][UV.V7],
            [UVD.V8]: actual[US.S3][UV.V8] === null && archive[US.S3][UV.V8] === null ? null : actual[US.S3][UV.V8] - archive[US.S3][UV.V8],
            [UVD.V9]: actual[US.S3][UV.V9] === null && archive[US.S3][UV.V9] === null ? null : actual[US.S3][UV.V9] - archive[US.S3][UV.V9],
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
            [UV.V9]: actual[US.S4][UV.V9],
            [UVD.V1]: actual[US.S4][UV.V1] === null && archive[US.S4][UV.V1] === null ? null : actual[US.S4][UV.V1] - archive[US.S4][UV.V1],
            [UVD.V2]: actual[US.S4][UV.V2] === null && archive[US.S4][UV.V2] === null ? null : actual[US.S4][UV.V2] - archive[US.S4][UV.V2],
            [UVD.V3]: actual[US.S4][UV.V3] === null && archive[US.S4][UV.V3] === null ? null : actual[US.S4][UV.V3] - archive[US.S4][UV.V3],
            [UVD.V4]: actual[US.S4][UV.V4] === null && archive[US.S4][UV.V4] === null ? null : actual[US.S4][UV.V4] - archive[US.S4][UV.V4],
            [UVD.V5]: actual[US.S4][UV.V5] === null && archive[US.S4][UV.V5] === null ? null : actual[US.S4][UV.V5] - archive[US.S4][UV.V5],
            [UVD.V6]: actual[US.S4][UV.V6] === null && archive[US.S4][UV.V6] === null ? null : actual[US.S4][UV.V6] - archive[US.S4][UV.V6],
            [UVD.V7]: actual[US.S4][UV.V7] === null && archive[US.S4][UV.V7] === null ? null : actual[US.S4][UV.V7] - archive[US.S4][UV.V7],
            [UVD.V8]: actual[US.S4][UV.V8] === null && archive[US.S4][UV.V8] === null ? null : actual[US.S4][UV.V8] - archive[US.S4][UV.V8],
            [UVD.V9]: actual[US.S4][UV.V9] === null && archive[US.S4][UV.V9] === null ? null : actual[US.S4][UV.V9] - archive[US.S4][UV.V9],
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
        [SN[US.S5]]: {
          vaccinated: quotes.vaccination.secondBooster,
          vaccination: {
            [UV.V1]: actual[US.S5][UV.V1],
            [UV.V2]: actual[US.S5][UV.V2],
            [UV.V3]: actual[US.S5][UV.V3],
            [UV.V4]: actual[US.S5][UV.V4],
            [UV.V5]: actual[US.S5][UV.V5],
            [UV.V6]: actual[US.S5][UV.V6],
            [UV.V7]: actual[US.S5][UV.V7],
            [UV.V8]: actual[US.S5][UV.V8],
            [UV.V9]: actual[US.S5][UV.V9],
            [UVD.V1]: actual[US.S5][UV.V1] === null && archive[US.S5][UV.V1] === null ? null : actual[US.S5][UV.V1] - archive[US.S5][UV.V1],
            [UVD.V2]: actual[US.S5][UV.V2] === null && archive[US.S5][UV.V2] === null ? null : actual[US.S5][UV.V2] - archive[US.S5][UV.V2],
            [UVD.V3]: actual[US.S5][UV.V3] === null && archive[US.S5][UV.V3] === null ? null : actual[US.S5][UV.V3] - archive[US.S5][UV.V3],
            [UVD.V4]: actual[US.S5][UV.V4] === null && archive[US.S5][UV.V4] === null ? null : actual[US.S5][UV.V4] - archive[US.S5][UV.V4],
            [UVD.V5]: actual[US.S5][UV.V5] === null && archive[US.S5][UV.V5] === null ? null : actual[US.S5][UV.V5] - archive[US.S5][UV.V5],
            [UVD.V6]: actual[US.S5][UV.V6] === null && archive[US.S5][UV.V6] === null ? null : actual[US.S5][UV.V6] - archive[US.S5][UV.V6],
            [UVD.V7]: actual[US.S5][UV.V7] === null && archive[US.S5][UV.V7] === null ? null : actual[US.S5][UV.V7] - archive[US.S5][UV.V7],
            [UVD.V8]: actual[US.S5][UV.V8] === null && archive[US.S5][UV.V8] === null ? null : actual[US.S5][UV.V8] - archive[US.S5][UV.V8],
            [UVD.V9]: actual[US.S5][UV.V9] === null && archive[US.S5][UV.V9] === null ? null : actual[US.S5][UV.V9] - archive[US.S5][UV.V9],
          },
          delta: archive[US.S5].total === null ? null : actual[US.S5].total - archive[US.S5].total,
          /* The RKI does not provide any quotes for the third Booster
          quote: quotes[US.S5].total === null ? null : limit(quotes[US.S5].total / 100.0, 3),
          quotes: {
            total: quotes[US.S5].total === null ? null : limit(quotes[US.S5].total / 100.0, 3),
            [UAG.G1217]: quotes[US.S5][UAG.G1217] === null ? null : limit(quotes[US.S5][UAG.G1217] / 100.0, 3),
            [UAG.G18pl]: {
              total: quotes[US.S5][UAG.G18pl] === null ? null : limit(quotes[US.S5][UAG.G18pl] / 100.0, 3),
              [UAG.G1859]: quotes[US.S5][UAG.G1859] === null ? null : limit(quotes[US.S5][UAG.G1859] / 100.0, 3),
              [UAG.G60pl]: quotes[US.S5][UAG.G60pl] === null ? null : limit(quotes[US.S5][UAG.G60pl] / 100.0, 3),
            },
          },
          */
        },
        [SN[US.S6]]: {
          vaccinated: quotes.vaccination.secondBooster,
          vaccination: {
            [UV.V1]: actual[US.S6][UV.V1],
            [UV.V2]: actual[US.S6][UV.V2],
            [UV.V3]: actual[US.S6][UV.V3],
            [UV.V4]: actual[US.S6][UV.V4],
            [UV.V5]: actual[US.S6][UV.V5],
            [UV.V6]: actual[US.S6][UV.V6],
            [UV.V7]: actual[US.S6][UV.V7],
            [UV.V8]: actual[US.S6][UV.V8],
            [UV.V9]: actual[US.S6][UV.V9],
            [UVD.V1]: actual[US.S6][UV.V1] === null && archive[US.S6][UV.V1] === null ? null : actual[US.S6][UV.V1] - archive[US.S6][UV.V1],
            [UVD.V2]: actual[US.S6][UV.V2] === null && archive[US.S6][UV.V2] === null ? null : actual[US.S6][UV.V2] - archive[US.S6][UV.V2],
            [UVD.V3]: actual[US.S6][UV.V3] === null && archive[US.S6][UV.V3] === null ? null : actual[US.S6][UV.V3] - archive[US.S6][UV.V3],
            [UVD.V4]: actual[US.S6][UV.V4] === null && archive[US.S6][UV.V4] === null ? null : actual[US.S6][UV.V4] - archive[US.S6][UV.V4],
            [UVD.V5]: actual[US.S6][UV.V5] === null && archive[US.S6][UV.V5] === null ? null : actual[US.S6][UV.V5] - archive[US.S6][UV.V5],
            [UVD.V6]: actual[US.S6][UV.V6] === null && archive[US.S6][UV.V6] === null ? null : actual[US.S6][UV.V6] - archive[US.S6][UV.V6],
            [UVD.V7]: actual[US.S6][UV.V7] === null && archive[US.S6][UV.V7] === null ? null : actual[US.S6][UV.V7] - archive[US.S6][UV.V7],
            [UVD.V8]: actual[US.S6][UV.V8] === null && archive[US.S6][UV.V8] === null ? null : actual[US.S6][UV.V8] - archive[US.S6][UV.V8],
            [UVD.V9]: actual[US.S6][UV.V9] === null && archive[US.S6][UV.V9] === null ? null : actual[US.S6][UV.V9] - archive[US.S6][UV.V9],
          },
          delta: archive[US.S6].total === null ? null : actual[US.S6].total - archive[US.S6].total,
          /* The RKI does not provide any quotes for the fourth Booster
          quote: quotes[US.S6].total === null ? null : limit(quotes[US.S6].total / 100.0, 3),
          quotes: {
            total: quotes[US.S6].total === null ? null : limit(quotes[US.S6].total / 100.0, 3),
            [UAG.G1217]: quotes[US.S6][UAG.G1217] === null ? null : limit(quotes[US.S6][UAG.G1217] / 100.0, 3),
            [UAG.G18pl]: {
              total: quotes[US.S6][UAG.G18pl] === null ? null : limit(quotes[US.S6][UAG.G18pl] / 100.0, 3),
              [UAG.G1859]: quotes[US.S6][UAG.G1859] === null ? null : limit(quotes[US.S6][UAG.G1859] / 100.0, 3),
              [UAG.G60pl]: quotes[US.S6][UAG.G60pl] === null ? null : limit(quotes[US.S6][UAG.G60pl] / 100.0, 3),
            },
          },
          */
        },
      };
    }
  }

  return {
    data: coverage,
    lastUpdate: lastUpdate,
  };
}

// for History
enum SeriesHistory {
  S1 = "firstVaccination",
  S2 = "secondVaccination",
  S3 = "firstBoosterVaccination",
  S4 = "secondBoosterVaccination",
  S5 = "thirdBoosterVaccination",
  S6 = "fourthBoosterVaccination",
}

interface VacciantionHistoryDataObject {
  [date: string]: VaccinationHistoryEntry;
}

export interface VaccinationHistoryEntry {
  date: Date;
  vaccinated: number;
  [SeriesHistory.S1]: number;
  [SeriesHistory.S2]: number;
  [SeriesHistory.S3]: number;
  [SeriesHistory.S4]: number;
  [SeriesHistory.S5]: number;
  [SeriesHistory.S6]: number;
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
        url: "https://github.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/raw/main/Deutschland_Bundeslaender_COVID-19-Impfungen.csv",
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
              thirdBoosterVaccination: null,
              fourthBoosterVaccination: null,
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
        `https://api.github.com/repos/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/commits/main`
      )
      .then((response) => {
        const apiData: ApiData = response.data;
        return new Date(apiData.commit.author.date);
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
