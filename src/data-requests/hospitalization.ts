import axios from "axios";
import { ResponseData } from "./response-data";
import parse from "csv-parse";

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

export async function getHospitalizationData(): Promise<
  ResponseData<HospitalizationData>
> {
  const hospitalizationDataPromise = new Promise<HospitalizationData>(
    async (resolve, reject) => {
      // Create the parser
      const parser = parse({
        delimiter: ",",
        from: 2,
      });

      // get csv as stream
      const response = await axios({
        method: "get",
        url: "https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/Aktuell_Deutschland_COVID-19-Hospitalisierungen.csv",
        responseType: "stream",
      });

      // pipe csv stream to csv parser
      response.data.pipe(parser);

      // empty object, that gets filled
      const hospitalizationDataObject: HospitalizationData = {};

      // read the parser stream and add record to hospitalizationDataObject
      parser.on("readable", function () {
        let record;
        while ((record = parser.read())) {
          let [date, state, id, ageGroup, cases7days, incidence7days] = record;

          date = new Date(date);
          // read entry for the date
          let dateEntry = hospitalizationDataObject[date.toISOString()];

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
          if (state === "Bundesgebiet") {
            // get the current data for "Bundesgebiet"
            hospitalizationDataEntry = {
              ...hospitalizationDataEntry,
              ...dateEntry,
            };
          } else {
            // get the current data of the state
            hospitalizationDataEntry = {
              ...hospitalizationDataEntry,
              ...dateEntry.states[state],
            };
          }

          // write to root if "00+" (all age groups combined) or if it is a specific age group to the "ageGroups" property
          switch (ageGroup) {
            case "00+":
              hospitalizationDataEntry.cases7Days = parseInt(cases7days);
              hospitalizationDataEntry.incidence7Days =
                parseFloat(incidence7days);
              break;
            case "00-04":
              hospitalizationDataEntry.ageGroups["A00-A04"] = {
                cases7Days: parseInt(cases7days),
                incidence7Days: parseFloat(incidence7days),
              };
              break;
            case "05-14":
              hospitalizationDataEntry.ageGroups["A05-A14"] = {
                cases7Days: parseInt(cases7days),
                incidence7Days: parseFloat(incidence7days),
              };
              break;
            case "15-34":
              hospitalizationDataEntry.ageGroups["A15-A34"] = {
                cases7Days: parseInt(cases7days),
                incidence7Days: parseFloat(incidence7days),
              };
              break;
            case "35-59":
              hospitalizationDataEntry.ageGroups["A35-A59"] = {
                cases7Days: parseInt(cases7days),
                incidence7Days: parseFloat(incidence7days),
              };
              break;
            case "60-79":
              hospitalizationDataEntry.ageGroups["A60-A79"] = {
                cases7Days: parseInt(cases7days),
                incidence7Days: parseFloat(incidence7days),
              };
              break;
            case "80+":
              hospitalizationDataEntry.ageGroups["A80+"] = {
                cases7Days: parseInt(cases7days),
                incidence7Days: parseFloat(incidence7days),
              };
              break;
            default:
              break;
          }

          // write data to object
          if (state === "Bundesgebiet") {
            dateEntry = {
              ...hospitalizationDataEntry,
              states: dateEntry.states,
            };
          } else {
            dateEntry.states[state] = hospitalizationDataEntry;
          }
          hospitalizationDataObject[date.toISOString()] = dateEntry;
        }
      });
      // Catch any error
      parser.on("error", function (err) {
        console.error(err.message);
        reject(err.message);
      });
      // When we are done, test that the parsed output matched what expected
      parser.on("end", function () {
        resolve(hospitalizationDataObject);
      });
    }
  );

  const [hospitalizationData, lastUpdate] = await Promise.all([
    hospitalizationDataPromise,
    axios
      .get(
        `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/.zenodo.json`
      )
      .then((response) => {
        return new Date(response.data.publication_date);
      }),
  ]);

  return {
    data: hospitalizationData,
    lastUpdate: lastUpdate,
  };
}

export function getLatestHospitalizationDataKey(
  hospitalizationData: HospitalizationData
) {
  return Object.keys(hospitalizationData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  })[0];
}
