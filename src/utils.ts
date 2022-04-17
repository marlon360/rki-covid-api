import { rejects } from "assert";
import axios, { AxiosPromise, AxiosResponse } from "axios";

export function getStateAbbreviationById(id: number): string | null {
  switch (id) {
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

export function checkDateParameterForMaps(parmsDate: string) {
  let dateString: string;
  // Parametercheck
  if (
    parmsDate.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/) &&
    !(new Date(parmsDate).getTime() > new Date().getTime())
  ) {
    dateString = parmsDate;
  } else if (parmsDate.match(/^[0-9]+$/) && !isNaN(parseInt(parmsDate))) {
    dateString = getDateBefore(parseInt(parmsDate));
  } else {
    throw new Error(
      `Parameter bitte in der Form "JJJJ-MM-TT" wobei "JJJJ-MM-TT" < heute, oder als Ganzzahl Tage in die Vergangenheit angeben. ${parmsDate} überprüfen.`
    );
  }
  return dateString;
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
      for (const feature of blData[i].features) {
        data.features.push(feature);
      }
    }
  }
  return data;
}

export function shouldUseAlternateDataSource(datenstand: Date): boolean {
  const now = new Date();
  const nowTime = now.getTime();
  const actualDate = now.setHours(0, 0, 0, 0);
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const datenstandMs = datenstand.getTime();
  return (
    actualDate - datenstandMs > 24 * 60 * 60000 ||
    (datenstandMs != actualDate && nowTime > threeOclock)
  );
}
