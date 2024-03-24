import { ResponseData } from "./response-data";
import {
  getDateBefore,
  getData,
  Files,
  MetaData,
  baseUrl,
  baseUrlRD5,
} from "../utils";
import {
  AgeGroupData,
  IStateDataFile,
  S_CasesHistoryFile,
  S_DeathsHistoryFile,
  S_RecoveredHistoryFile,
  S_IncidenceHistoryFile,
  S_AgeGrpFile,
  S_CasesHistoryChangesFile,
} from "./states";

export async function getGermanyCases(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  return {
    data: json.data[0].accuCases,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyNewCases(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  return {
    data: json.data[0].newCases,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface G_CasesHistory {
  cases: number;
  date: Date;
}

export async function getGermanyCasesHistory(
  metaData: MetaData,
  days?: number
): Promise<ResponseData<G_CasesHistory[]>> {
  const json: S_CasesHistoryFile = await getData(
    metaData,
    Files.S_CasesHistory
  );
  let history: G_CasesHistory[] = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        cases: state.c,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export interface G_CasesChangesHistory {
  [date: string]: {
    cases: number;
    changeDate: Date;
  }[];
}

export async function getGermanyCasesChangesHistory(
  metaDataRD5: MetaData,
  tillReportDate?: Date,
  oneReportDate?: Date,
  changeDate?: Date
): Promise<ResponseData<G_CasesChangesHistory>> {
  const json: S_CasesHistoryChangesFile = await getData(
    metaDataRD5,
    Files.S_CasesHistoryLastChangesFile,
    baseUrlRD5
  );
  // filter to only germany data
  json.data = json.data.filter((state) => state.i == "00");
  // if till date is given filter meldedatum
  if (tillReportDate) {
    json.data = json.data.filter(
      (dates) => dates.m.getTime() >= tillReportDate.getTime()
    );
  }
  // if oneReportDate is given filter to this date
  if (oneReportDate) {
    json.data = json.data.filter(
      (reportDates) => reportDates.m.getTime() == oneReportDate.getTime()
    );
  }
  // if a changeDate is given filter changeDate
  if (changeDate) {
    json.data = json.data.filter((changeDates) => changeDates.cD.getTime() == changeDate.getTime());
  }
  const casesChangesHistory: G_CasesChangesHistory = json.data.reduce(
    (changes, entry) => {
      const dateStr = new Date(entry.m).toISOString().split("T").shift();
      if (changes[dateStr]) {
        changes[dateStr].push({
          cases: entry.c,
          changeDate: new Date(entry.cD),
        });
      } else {
        changes[dateStr] = [{ cases: entry.c, changeDate: new Date(entry.cD) }];
      }
      return changes;
    },
    {}
  );

  Object.keys(casesChangesHistory).forEach((date) => {
    casesChangesHistory[date].sort((a, b) => {
      const dateA = new Date(a.changeDate);
      const dateB = new Date(b.changeDate);
      return dateA.getTime() - dateB.getTime();
    });
  });

  return {
    lastUpdate: new Date(json.metaData.modified),
    data: casesChangesHistory,
  };
}

interface G_DeathsHistory {
  deaths: number;
  date: Date;
}

export async function getGermanyDeathsHistory(
  metaData: MetaData,
  days?: number
): Promise<ResponseData<G_DeathsHistory[]>> {
  const json: S_DeathsHistoryFile = await getData(
    metaData,
    Files.S_DeathsHistory
  );
  let history: G_DeathsHistory[] = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        deaths: state.d,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface G_RecoveredHistory {
  recovered: number;
  date: Date;
}

export async function getGermanyRecoveredHistory(
  metaData: MetaData,
  days?: number
): Promise<ResponseData<G_RecoveredHistory[]>> {
  const json: S_RecoveredHistoryFile = await getData(
    metaData,
    Files.S_RecoveredHistory
  );
  let history: G_RecoveredHistory[] = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        recovered: state.r,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface G_IncidenceHistory {
  weekIncidence: number;
  date: Date;
}

export async function getGermanyIncidenceHistory(
  metaData: MetaData,
  days?: number
): Promise<ResponseData<G_IncidenceHistory[]>> {
  const json: S_IncidenceHistoryFile = await getData(
    metaData,
    Files.S_IncidenceHistory
  );
  let history: G_IncidenceHistory[] = json.data
    .filter((state) => state.i == "00")
    .map((state) => {
      return {
        weekIncidence: state.i7,
        date: new Date(state.m),
      };
    });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((dates) => dates.date >= reference_date);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyDeaths(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  return {
    data: json.data[0].accuDeaths,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyNewDeaths(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  return {
    data: json.data[0].newDeaths,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyRecovered(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  return {
    data: json.data[0].accuRecovered,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export async function getGermanyNewRecovered(
  metaData: MetaData
): Promise<ResponseData<number>> {
  const json: IStateDataFile = await getData(metaData, Files.S_Data);
  return {
    data: json.data[0].newRecovered,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface G_AgeGrpData {
  [ageGrp: string]: AgeGroupData;
}

export async function getGermanyAgeGroups(
  metaData: MetaData
): Promise<ResponseData<G_AgeGrpData>> {
  const json: S_AgeGrpFile = await getData(metaData, Files.S_AgeGroups);
  let data: G_AgeGrpData = {};
  json.data.forEach((entry) => {
    if (entry.Altersgruppe == "unbekannt") return;
    // germany has BundeslandId=0
    if (parseInt(entry.IdBundesland) === 0) {
      data[entry.Altersgruppe] = {
        casesMale: entry.casesMale,
        casesFemale: entry.casesFemale,
        deathsMale: entry.deathsMale,
        deathsFemale: entry.deathsFemale,
        casesMalePer100k: entry.casesMalePer100k,
        casesFemalePer100k: entry.casesFemalePer100k,
        deathsMalePer100k: entry.deathsMalePer100k,
        deathsFemalePer100k: entry.deathsFemalePer100k,
      };
    }
  });
  return {
    data: data,
    lastUpdate: new Date(json.metaData.modified),
  };
}
