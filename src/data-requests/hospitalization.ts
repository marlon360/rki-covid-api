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
    cases7Days: number; //legacy
    fixedCases7Days: number;
    updatedCases7Days: number;
    adjustedLowerCases7Days: number;
    adjustedCases7Days: number;
    adjustedUpperCases7Days: number;
    incidence7Days: number; //legacy
    fixedIncidence7Days: number;
    updatedIncidence7Days: number;
    adjustedLowerIncidence7Days: number;
    adjustedIncidence7Days: number;
    adjustedUpperIncidence7Days: number;
    ageGroups: AgeGroups;
    states: {
      [state: string]: {
        cases7Days: number; //legacy
        fixedCases7Days: number;
        updatedCases7Days: number;
        adjustedLowerCases7Days: number;
        adjustedCases7Days: number;
        adjustedUpperCases7Days: number;
        incidence7Days: number; // legacy
        fixedIncidence7Days: number;
        updatedIncidence7Days: number;
        adjustedLowerIncidence7Days: number;
        adjustedIncidence7Days: number;
        adjustedUpperIncidence7Days: number;
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
              fixedCases7Days: null,
              updatedCases7Days: null,
              adjustedLowerCases7Days: null,
              adjustedCases7Days: null,
              adjustedUpperCases7Days: null,
              incidence7Days: undefined,
              fixedIncidence7Days: null,
              updatedIncidence7Days: null,
              adjustedLowerIncidence7Days: null,
              adjustedIncidence7Days: null,
              adjustedUpperIncidence7Days: null,
              ageGroups: {} as AgeGroups,
              states: {},
            };
          }

          // default hospitalization data entry
          let hospitalizationDataEntry = {
            cases7Days: undefined,
            fixedCases7Days: null,
            updatedCases7Days: null,
            adjustedLowerCases7Days: null,
            adjustedCases7Days: null,
            adjustedUpperCases7Days: null,
            incidence7Days: undefined,
            fixedIncidence7Days: null,
            updatedIncidence7Days: null,
            adjustedLowerIncidence7Days: null,
            adjustedIncidence7Days: null,
            adjustedUpperIncidence7Days: null,
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

      // now add the adjusted values
      // Create the adjusted values data parser
      const adjParser = parse({
        delimiter: ",",
        from: 2,
      });

      // get adjusted values csv as stream
      const adjResponse = await axios({
        method: "get",
        url: "https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/Aktuell_Deutschland_adjustierte-COVID-19-Hospitalisierungen.csv",
        responseType: "stream",
      });

      // pipe adjusted values csv stream to adjusted values csv parser
      adjResponse.data.pipe(adjParser);

      // read the adjusted values parser stream and add values to hospitalizationDataObject
      adjParser.on("readable", function () {
        let record;
        while ((record = adjParser.read())) {
          let [
            date,
            state,
            id,
            ageGroup,
            fixedCases7Days,
            updatedCases7Days,
            adjustedCases7Days,
            adjustedLowerCases7Days,
            adjustedUpperCases7Days,
            population,
            fixedIncidence7Days,
            updatedIncidence7Days,
            adjustedIncidence7Days,
            adjustedLowerIncidence7Days,
            adjustedUpperIncidence7Days,
          ] = record;

          date = new Date(date).toISOString();

          if (id === "00") {
            hospitalizationDataObject[date].fixedCases7Days =
              parseInt(fixedCases7Days);
            hospitalizationDataObject[date].updatedCases7Days =
              parseInt(updatedCases7Days);
            hospitalizationDataObject[date].adjustedLowerCases7Days = parseInt(
              adjustedLowerCases7Days
            );
            hospitalizationDataObject[date].adjustedCases7Days =
              parseInt(adjustedCases7Days);
            hospitalizationDataObject[date].adjustedUpperCases7Days = parseInt(
              adjustedUpperCases7Days
            );
            hospitalizationDataObject[date].fixedIncidence7Days =
              parseFloat(fixedIncidence7Days);
            hospitalizationDataObject[date].updatedIncidence7Days = parseFloat(
              updatedIncidence7Days
            );
            hospitalizationDataObject[date].adjustedLowerIncidence7Days =
              parseFloat(adjustedLowerIncidence7Days);
            hospitalizationDataObject[date].adjustedIncidence7Days = parseFloat(
              adjustedIncidence7Days
            );
            hospitalizationDataObject[date].adjustedUpperIncidence7Days =
              parseFloat(adjustedUpperIncidence7Days);
          } else {
            hospitalizationDataObject[date].states[state].fixedCases7Days =
              parseInt(fixedCases7Days);
            hospitalizationDataObject[date].states[state].updatedCases7Days =
              parseInt(updatedCases7Days);
            hospitalizationDataObject[date].states[
              state
            ].adjustedLowerCases7Days = parseInt(adjustedLowerCases7Days);
            hospitalizationDataObject[date].states[state].adjustedCases7Days =
              parseInt(adjustedCases7Days);
            hospitalizationDataObject[date].states[
              state
            ].adjustedUpperCases7Days = parseInt(adjustedUpperCases7Days);
            hospitalizationDataObject[date].states[state].fixedIncidence7Days =
              parseFloat(fixedIncidence7Days);
            hospitalizationDataObject[date].states[
              state
            ].updatedIncidence7Days = parseFloat(updatedIncidence7Days);
            hospitalizationDataObject[date].states[
              state
            ].adjustedLowerIncidence7Days = parseFloat(
              adjustedLowerIncidence7Days
            );
            hospitalizationDataObject[date].states[
              state
            ].adjustedIncidence7Days = parseFloat(adjustedIncidence7Days);
            hospitalizationDataObject[date].states[
              state
            ].adjustedUpperIncidence7Days = parseFloat(
              adjustedUpperIncidence7Days
            );
          }
        }
      });
      // Catch any error
      adjParser.on("error", function (err) {
        console.error(err.message);
        reject(err.message);
      });
      // When we are done, test that the parsed output matched what expected
      adjParser.on("end", function () {
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
