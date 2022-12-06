import axios from "axios";

export function getStateAbbreviationById(id: number): string | null {
  switch (id) {
    case 0:
      return "Bund";
    case 1:
      return "SH";
    case 2:
      return "HH";
    case 3:
      return "NI";
    case 4:
      return "HB";
    case 5:
      return "NW";
    case 6:
      return "HE";
    case 7:
      return "RP";
    case 8:
      return "BW";
    case 9:
      return "BY";
    case 10:
      return "SL";
    case 11:
      return "BE";
    case 12:
      return "BB";
    case 13:
      return "MV";
    case 14:
      return "SN";
    case 15:
      return "ST";
    case 16:
      return "TH";
    default:
      return null;
  }
}

export function getStateIdByAbbreviation(abbreviation: string): number | null {
  switch (abbreviation) {
    case "Bund":
      return 0;
    case "SH":
      return 1;
    case "HH":
      return 2;
    case "NI":
      return 3;
    case "HB":
      return 4;
    case "NW":
      return 5;
    case "HE":
      return 6;
    case "RP":
      return 7;
    case "BW":
      return 8;
    case "BY":
      return 9;
    case "SL":
      return 10;
    case "BE":
      return 11;
    case "BB":
      return 12;
    case "MV":
      return 13;
    case "SN":
      return 14;
    case "ST":
      return 15;
    case "TH":
      return 16;
    default:
      return null;
  }
}

export function getStateAbbreviationByName(name: string): string | null {
  switch (name) {
    case "Baden-Württemberg":
      return "BW";
    case "Bayern":
      return "BY";
    case "Berlin":
      return "BE";
    case "Brandenburg":
      return "BB";
    case "Bremen":
      return "HB";
    case "Hamburg":
      return "HH";
    case "Hessen":
      return "HE";
    case "Mecklenburg-Vorpommern":
      return "MV";
    case "Niedersachsen":
      return "NI";
    case "Nordrhein-Westfalen":
      return "NW";
    case "Rheinland-Pfalz":
      return "RP";
    case "Saarland":
      return "SL";
    case "Sachsen":
      return "SN";
    case "Sachsen-Anhalt":
      return "ST";
    case "Schleswig-Holstein":
      return "SH";
    case "Thüringen":
      return "TH";
    case "Bundesgebiet":
      return "Bund";
    default:
      return null;
  }
}

export function getStateNameByAbbreviation(
  abbreviation: string
): string | null {
  switch (abbreviation) {
    case "BW":
      return "Baden-Württemberg";
    case "BY":
      return "Bayern";
    case "BE":
      return "Berlin";
    case "BB":
      return "Brandenburg";
    case "HB":
      return "Bremen";
    case "HH":
      return "Hamburg";
    case "HE":
      return "Hessen";
    case "MV":
      return "Mecklenburg-Vorpommern";
    case "NI":
      return "Niedersachsen";
    case "NW":
      return "Nordrhein-Westfalen";
    case "RP":
      return "Rheinland-Pfalz";
    case "SL":
      return "Saarland";
    case "SN":
      return "Sachsen";
    case "ST":
      return "Sachsen-Anhalt";
    case "SH":
      return "Schleswig-Holstein";
    case "TH":
      return "Thüringen";
    case "Bund":
      return "Bundesgebiet";
    default:
      return null;
  }
}

export function getStateIdByName(name: string): number | null {
  switch (name) {
    case "Baden-Württemberg":
      return 8;
    case "Bayern":
      return 9;
    case "Berlin":
      return 11;
    case "Brandenburg":
      return 12;
    case "Bremen":
      return 4;
    case "Hamburg":
      return 2;
    case "Hessen":
      return 6;
    case "Mecklenburg-Vorpommern":
      return 13;
    case "Niedersachsen":
      return 3;
    case "Nordrhein-Westfalen":
      return 5;
    case "Rheinland-Pfalz":
      return 7;
    case "Saarland":
      return 10;
    case "Sachsen":
      return 14;
    case "Sachsen-Anhalt":
      return 15;
    case "Schleswig-Holstein":
      return 1;
    case "Thüringen":
      return 16;
    case "Bundesgebiet":
      return 0;
    default:
      return null;
  }
}

export function getDateBefore(days: number): string {
  let offsetDate = new Date();
  offsetDate.setHours(0, 0, 0, 0);
  offsetDate.setDate(new Date().getDate() - days);
  return offsetDate.toISOString().split("T").shift();
}

export function getDayDifference(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function AddDaysToDate(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 1000 * 60 * 60 * 24);
}

export function cleanupString(input: string): string {
  // only keep latin characters, umlaute, ß, -
  return input.replace(/[^a-zA-ZäöüÄÖÜß\-]/g, "");
}

export interface RKIErrorResponse {
  code: number;
  message: string;
  details: string[];
}

export class RKIError extends Error {
  public url?: string;
  public rkiError: RKIErrorResponse;

  constructor(error: RKIErrorResponse, url?: string) {
    super(error.message);
    this.name = "RKIError";
    this.rkiError = error;
    this.url = url;
  }
}

export function parseDate(dateString: string): Date {
  const parts = dateString.split(",");
  const dateParts = parts[0].split(".");
  const timeParts = parts[1].replace("Uhr", "").split(":");
  return new Date(
    parseInt(dateParts[2]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[0]),
    parseInt(timeParts[0]),
    parseInt(timeParts[1])
  );
}

export async function getAlternateDataSource(url: string, blId?: string) {
  // If a specific table is given download this state data only
  let stateIdList = [];
  for (let id = 1; id <= 16; id++) {
    stateIdList[id - 1] = id.toString().padStart(2, "0");
  }
  if (blId && stateIdList.includes(blId)) {
    url = url.replace("Covid19_hubv", `Covid19_${blId}_hubv`);
    const response = await axios.get(url);
    var data = response.data;
  }
  // else download all 16 state data
  else {
    const blPromises = [];
    // build Promises
    for (let i = 0; i <= 15; i++) {
      const id = (i + 1).toString().padStart(2, "0");
      const blUrl = url.replace("Covid19_hubv", `Covid19_${id}_hubv`);
      blPromises[i] = axios.get(blUrl).then((response) => {
        return response.data;
      });
    }
    const blData = await Promise.all(blPromises);
    var data = blData[0];
    for (let i = 1; i <= 15; i++) {
      // append the data
      // 3 times faster than the for loop
      data.features.push.apply(data.features, blData[i].features);
    }
  }
  return data;
}

export function shouldUseAlternateDataSource(
  datenstand: Date,
  exceededTransferLimit = false
): boolean {
  const now = new Date();
  const nowTime = now.getTime();
  const actualDate = now.setHours(0, 0, 0, 0);
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const datenstandMs = datenstand.getTime();
  return (
    exceededTransferLimit ||
    actualDate - datenstandMs > 24 * 60 * 60000 ||
    (datenstandMs != actualDate && nowTime > threeOclock)
  );
}

export enum RequestType {
  cases = "cases",
  recovered = "recovered",
  deaths = "deaths",
}

export enum RegionType {
  distrits = "ags",
  states = "id",
}

export function fill0CasesDays(
  sourceData: any,
  lowDate: Date,
  highDate: Date,
  regionType: RegionType,
  requestType: RequestType
) {
  const targetData = {};
  for (const historyData of sourceData.data) {
    const regionKey =
      regionType == "id"
        ? getStateAbbreviationById(historyData.id)
        : historyData.ags;
    if (!targetData[regionKey]) {
      targetData[regionKey] = {
        [regionType]: historyData[regionType],
        name: historyData.name,
        history: [],
      };
    }
    // if history is empty and lowDate is missing insert lowDate
    if (
      historyData.date > lowDate &&
      targetData[regionKey].history.length == 0
    ) {
      targetData[regionKey].history.push({
        [requestType]: 0,
        date: lowDate,
      });
    }
    if (targetData[regionKey].history.length > 0) {
      const nextDate: Date = historyData.date;
      while (
        getDayDifference(
          nextDate,
          targetData[regionKey].history[
            targetData[regionKey].history.length - 1
          ].date
        ) > 1
      ) {
        targetData[regionKey].history.push({
          [requestType]: 0,
          date: AddDaysToDate(
            targetData[regionKey].history[
              targetData[regionKey].history.length - 1
            ].date,
            1
          ),
        });
      }
    }
    targetData[regionKey].history.push({
      [requestType]: historyData[requestType],
      date: historyData.date,
    });
  }
  // now fill top dates to highDate (datenstand -1) for each ags
  for (const regionKey of Object.keys(targetData)) {
    while (
      targetData[regionKey].history[targetData[regionKey].history.length - 1]
        .date < highDate
    ) {
      targetData[regionKey].history.push({
        [requestType]: 0,
        date: AddDaysToDate(
          targetData[regionKey].history[
            targetData[regionKey].history.length - 1
          ].date,
          1
        ),
      });
    }
  }
  return targetData;
}

export function fill0CasesDaysGermany(
  sourceData: any,
  lowDate: Date,
  highDate: Date,
  requestType: RequestType
) {
  const targetData = [];
  for (const historyData of sourceData.history) {
    // if history is empty and lowDate is missing insert lowDate
    if (historyData.date > lowDate && targetData.length == 0) {
      targetData.push({
        [requestType]: 0,
        date: lowDate,
      });
    }
    if (targetData.length > 0) {
      const nextDate = historyData.date;
      while (
        getDayDifference(nextDate, targetData[targetData.length - 1].date) > 1
      ) {
        targetData.push({
          [requestType]: 0,
          date: AddDaysToDate(targetData[targetData.length - 1].date, 1),
        });
      }
    }
    targetData.push({
      [requestType]: historyData[requestType],
      date: historyData.date,
    });
  }
  // now fill top dates to highDate (datenstand -1) for each ags
  while (targetData[targetData.length - 1].date < highDate) {
    targetData.push({
      [requestType]: 0,
      date: AddDaysToDate(targetData[targetData.length - 1].date, 1),
    });
  }
  return targetData;
}

export function limit(value: number, decimals: number): number {
  return parseFloat(value.toFixed(decimals));
}