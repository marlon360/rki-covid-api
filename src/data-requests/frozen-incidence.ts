import axios from "axios";
import XLSX from "xlsx";
import {
  AddDaysToDate,
  getDateBefore,
  getDayDifference,
  getStateAbbreviationByName,
  getStateIdByName,
  RKIError,
} from "../utils";
import { ResponseData } from "./response-data";

function getDateFromString(dateString: string): Date {
  if (dateString.indexOf("/") > -1) {
    // probably this format: 8/25/21: m/d/y
    const parts = dateString.split("/");
    return new Date(
      `20${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
    );
  } else {
    // probably this format: 01.12.2020: dd.mm.yyyy
    const date_pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    return new Date(dateString.replace(date_pattern, "$3-$2-$1"));
  }
}

export interface DistrictsFrozenIncidenceData {
  ags: string;
  name: string;
  history: {
    date: Date;
    weekIncidence: number;
  }[];
}

async function getDistrictsFrozenIncidenceHistoryArchive(): Promise<
  DistrictsFrozenIncidenceData[]
> {
  const response = await axios.get(
    "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_Archiv.xlsx?__blob=publicationFile",
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets["LK_7-Tage-Inzidenz (fixiert)"];
  // table starts in row 5 (parameter is zero indexed)
  const json = XLSX.utils.sheet_to_json(sheet, { range: 4 });

  let districts = json
    .filter((district) => !!district["NR"])
    .map((district) => {
      const name = district["LK"];
      const ags = district["LKNR"].toString().padStart(5, "0");

      let history = [];

      // get all date keys
      const dateKeys = Object.keys(district);
      // ignore the first three elements (rowNumber, LK, LKNR)
      dateKeys.splice(0, 3);
      dateKeys.forEach((dateKey) => {
        const date = getDateFromString(dateKey.toString());
        history.push({ weekIncidence: district[dateKey], date });
      });

      return { ags, name, history };
    });
  return districts;
}

export async function getDistrictsFrozenIncidenceHistory(
  days?: number,
  ags?: string
): Promise<ResponseData<DistrictsFrozenIncidenceData[]>> {
  const response = await axios.get(
    "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_aktuell.xlsx?__blob=publicationFile",
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets["LK_7-Tage-Inzidenz (fixiert)"];
  // table starts in row 5 (parameter is zero indexed)
  const json = XLSX.utils.sheet_to_json(sheet, { range: 4 });

  let lastUpdate = new Date(response.headers["last-modified"]);

  let districts = json.map((district) => {
    const name = district["LK"];
    const ags = district["LKNR"].toString().padStart(5, "0");

    let history = [];

    // get all date keys
    const dateKeys = Object.keys(district);
    // ignore the first two elements (LK, LKNR)
    dateKeys.splice(0, 2);
    dateKeys.forEach((dateKey) => {
      const date = getDateFromString(dateKey.toString());
      history.push({ weekIncidence: district[dateKey], date });
    });

    if (days) {
      const reference_date = new Date(getDateBefore(days));
      history = history.filter((element) => element.date > reference_date);
    }

    return { ags, name, history };
  });

  if (ags) {
    districts = districts.filter((district) => district.ags === ags);
  }

  // The Excel sheet with fixed incidence data is only updated on mondays
  // check witch date is the last date in history
  const lastDate: Date =
    districts[0].history[districts[0].history.length - 1].date;
  const today: Date = new Date(new Date().setHours(0, 0, 0));
  // get lastUpdate from github
  const lastGithubDate = await axios
    .get(
      `https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/RKI_COVID19_meta.json`
    )
    .then((response) => {
      return new Date(response.data.modified);
    });
  // if lastDate < today and lastDate <= lastGithubDate get the missing dates from github
  // the gihub data is updated by github actions daily, triggert at ~ 1:58 GMT, running ?
  let missingDatesData = [];
  if (
    lastDate.getTime() < today.getTime() &&
    lastDate.getTime() <= lastGithubDate.getTime()
  ) {
    lastUpdate = lastGithubDate;
    const numberOfmissingDays = getDayDifference(today, lastDate) - 1;
    const numberOfmissingDaysMax =
      getDayDifference(lastGithubDate, lastDate) - 1;
    const maxNumberOfDays = Math.min(
      numberOfmissingDays,
      numberOfmissingDaysMax
    );
    // collect the missing date(s)
    let dayNumber = 1;
    const range = [];
    while (dayNumber <= maxNumberOfDays) {
      range[dayNumber - 1] = new Date(AddDaysToDate(lastDate, dayNumber));
      dayNumber += 1;
    }
    // build promise(s)
    const missingDatesPromises = [];
    for (let i = 1; i <= maxNumberOfDays; i++) {
      const baseurl =
        "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/FixFallzahlen_XXXX-XX-XX_LK.json";
      const url = baseurl.replace(
        "XXXX-XX-XX",
        range[i - 1].toISOString().split("T").shift()
      );
      missingDatesPromises[i - 1] = axios.get(url).then((response) => {
        return response.data;
      });
    }
    // request the missing date(s)
    missingDatesData = await Promise.all(missingDatesPromises);
    // add the missing date(s) to districts
    for (let day = 0; day < maxNumberOfDays; day++) {
      districts = districts.map((district) => {
        if (missingDatesData[day][district.ags]) {
          district.history.push({
            weekIncidence: missingDatesData[day][district.ags].incidence_7d,
            date: new Date(missingDatesData[day][district.ags].Datenstand),
          });
        }
        return district;
      });
    }
  }

  // do we need to fetch archive data as well?
  const fetchArchiveData = !days
    ? districts.length > 0 && districts[0].history.length > 0
    : districts.length > 0 &&
      districts[0].history.length > 0 &&
      districts[0].history[0].date > new Date(getDateBefore(days - 1));

  if (fetchArchiveData) {
    let archiveData = await getDistrictsFrozenIncidenceHistoryArchive();
    // filter by abbreviation
    if (ags != null) {
      archiveData = archiveData.filter((district) => district.ags === ags);
    }
    // filter by days
    if (days != null) {
      const reference_date = new Date(getDateBefore(days));
      archiveData = archiveData.map((district) => {
        district.history = district.history.filter(
          (element) => element.date > reference_date
        );
        return district;
      });
    }
    // merge archive data with current data
    districts = districts.map((district) => {
      district.history.unshift(
        ...archiveData.find((element) => element.ags === district.ags).history
      );
      return district;
    });
  }

  return {
    data: districts,
    lastUpdate: lastUpdate,
  };
}

export interface StatesFrozenIncidenceData {
  abbreviation: string;
  name: string;
  history: {
    date: Date;
    weekIncidence: number;
  }[];
}

async function getStatesFrozenIncidenceHistoryArchive(): Promise<
  StatesFrozenIncidenceData[]
> {
  const response = await axios.get(
    "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_Archiv.xlsx?__blob=publicationFile",
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets["BL_7-Tage-Inzidenz (fixiert)"];
  // table starts in row 5 (parameter is zero indexed)
  const json = XLSX.utils.sheet_to_json(sheet, { range: 4 });

  let states = json.map((states) => {
    const name = states["__EMPTY"]; //there is no header
    const abbreviation = getStateAbbreviationByName(name);

    let history = [];

    // get all date keys
    const dateKeys = Object.keys(states);
    // ignore the first element (witch is the state)
    dateKeys.splice(0, 1);
    dateKeys.forEach((dateKey) => {
      const date = getDateFromString(dateKey.toString());
      history.push({ weekIncidence: states[dateKey], date });
    });

    return { abbreviation, name, history };
  });

  return states;
}

export async function getStatesFrozenIncidenceHistory(
  days?: number,
  abbreviation?: string
): Promise<ResponseData<StatesFrozenIncidenceData[]>> {
  const response = await axios.get(
    "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab_aktuell.xlsx?__blob=publicationFile",
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }

  var workbook = XLSX.read(data, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets["BL_7-Tage-Inzidenz (fixiert)"];
  // table starts in row 5 (parameter is zero indexed)
  const json = XLSX.utils.sheet_to_json(sheet, { range: 4 });

  let lastUpdate = new Date(response.headers["last-modified"]);

  let states = json.map((states) => {
    const name = states["MeldeLandkreisBundesland"];
    const abbreviation = getStateAbbreviationByName(name);

    let history = [];

    // get all date keys
    const dateKeys = Object.keys(states);
    // ignore the first element (witch is the state)
    dateKeys.splice(0, 1);
    dateKeys.forEach((dateKey) => {
      const date = getDateFromString(dateKey.toString());
      history.push({ weekIncidence: states[dateKey], date });
    });

    if (days) {
      const reference_date = new Date(getDateBefore(days));
      history = history.filter((element) => element.date > reference_date);
    }

    return { abbreviation, name, history };
  });

  if (abbreviation) {
    states = states.filter((states) => states.abbreviation === abbreviation);
  }

  // The Excel sheet with fixed incidence data is only updated on mondays
  // check witch date is the last date in history
  const lastDate: Date = states[0].history[states[0].history.length - 1].date;
  const today: Date = new Date(new Date().setHours(0, 0, 0));
  // get lastUpdate from github
  const lastGithubDate = await axios
    .get(
      `https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/RKI_COVID19_meta.json`
    )
    .then((response) => {
      return new Date(response.data.modified);
    });
  // if lastDate < today and lastDate <= lastGithubDate try to get the missing dates from github
  // the gihub data is updated by github actions daily, triggert at 1:58 GMT, running ?
  let missingDatesData = [];
  if (
    lastDate.getTime() < today.getTime() &&
    lastDate.getTime() <= lastGithubDate.getTime()
  ) {
    lastUpdate = lastGithubDate;
    const numberOfmissingDays = getDayDifference(today, lastDate) - 1;
    const numberOfmissingDaysMax =
      getDayDifference(lastGithubDate, lastDate) - 1;
    const maxNumberOfDays = Math.min(
      numberOfmissingDays,
      numberOfmissingDaysMax
    );
    // collect the missing date(s)
    let dayNumber = 1;
    const range = [];
    while (dayNumber <= maxNumberOfDays) {
      range[dayNumber - 1] = new Date(AddDaysToDate(lastDate, dayNumber));
      dayNumber += 1;
    }
    // build promise(s)
    const missingDatesPromises = [];
    for (let i = 1; i <= maxNumberOfDays; i++) {
      const baseurl =
        "https://raw.githubusercontent.com/Rubber1Duck/RD_RKI_COVID19_DATA/master/Fallzahlen/FixFallzahlen_XXXX-XX-XX_BL.json";
      const url = baseurl.replace(
        "XXXX-XX-XX",
        range[i - 1].toISOString().split("T").shift()
      );
      missingDatesPromises[i - 1] = axios.get(url).then((response) => {
        return response.data;
      });
    }
    // request the missing date(s)
    missingDatesData = await Promise.all(missingDatesPromises);
    // add the missing date(s) to states
    for (let day = 0; day < maxNumberOfDays; day++) {
      states = states.map((state) => {
        const id = getStateIdByName(state.name)
          ? getStateIdByName(state.name)
          : 0;
        state.history.push({
          weekIncidence: missingDatesData[day][id].incidence_7d,
          date: new Date(missingDatesData[day][id].Datenstand),
        });
        return state;
      });
    }
  }

  // do we need to fetch archive data as well?
  const fetchArchiveData = !days
    ? states.length > 0 && states[0].history.length > 0
    : states.length > 0 &&
      states[0].history.length > 0 &&
      states[0].history[0].date > new Date(getDateBefore(days - 1));

  if (fetchArchiveData) {
    // load all archive data
    let archiveData = await getStatesFrozenIncidenceHistoryArchive();
    // filter by abbreviation
    if (abbreviation != null) {
      archiveData = archiveData.filter(
        (state) => state.abbreviation === abbreviation
      );
    }
    // filter by days
    if (days) {
      const reference_date = new Date(getDateBefore(days));
      archiveData = archiveData.map((state) => {
        state.history = state.history.filter(
          (element) => element.date > reference_date
        );
        return state;
      });
    }
    // merge archive data with current data
    states = states.map((state) => {
      state.history.unshift(
        ...archiveData.find(
          (element) => element.abbreviation === state.abbreviation
        ).history
      );
      return state;
    });
  }

  return {
    data: states,
    lastUpdate: lastUpdate,
  };
}
