import { getDateBefore, getData, MetaData, Files, baseUrlRD5 } from "../utils";
import { ResponseData } from "./response-data";
import { AgeGroupsData } from "./states";
import LK_Names from "../configuration/LK_Names.json";

export interface IDistrictData {
  ags: string;
  name: string;
  county: string;
  state: string;
  population: number;
  cases: number;
  deaths: number;
  recovered: number;
  casesPerWeek: number;
  deathsPerWeek: number;
}

interface IDistrictDataFile {
  data: {
    IdLandkreis: string;
    Bundesland: string;
    Landkreis: string;
    Meldedatum: Date;
    Datenstand: Date;
    accuCases: number;
    newCases: number;
    accuCasesPerWeek: number;
    newCasesPerWeek: number;
    accuDeaths: number;
    newDeaths: number;
    accuDeathsPerWeek: number;
    newDeathsPerWeek: number;
    accuRecovered: number;
    newRecovered: number;
    population: number;
  }[];
  metaData: MetaData;
}

export async function getDistrictsData(
  metaData: MetaData
): Promise<ResponseData<IDistrictData[]>> {
  const json: IDistrictDataFile = await getData(metaData, Files.D_Data);
  const districts = json.data.map((dist) => {
    return {
      ags: dist.IdLandkreis,
      name: LK_Names.names[dist.Landkreis].GEN,
      county: dist.Landkreis,
      state: dist.Bundesland,
      population: dist.population,
      cases: dist.accuCases,
      deaths: dist.accuDeaths,
      recovered: dist.accuRecovered,
      casesPerWeek: dist.accuCasesPerWeek,
      deathsPerWeek: dist.accuDeathsPerWeek,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_NewCases {
  ags: string;
  cases: number;
}

export async function getDistrictsNewCases(
  metaData: MetaData
): Promise<ResponseData<D_NewCases[]>> {
  let json: IDistrictDataFile = await getData(metaData, Files.D_NewCases);
  const districts = json.data.map((dist) => {
    return {
      ags: dist.IdLandkreis,
      cases: dist.newCases,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_NewDeaths {
  ags: string;
  deaths: number;
}

export async function getDistrictsNewDeaths(
  metaData: MetaData
): Promise<ResponseData<D_NewDeaths[]>> {
  let json: IDistrictDataFile = await getData(metaData, Files.D_NewDeaths);
  const districts = json.data.map((dist) => {
    return {
      ags: dist.IdLandkreis,
      deaths: dist.newDeaths,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_NewRecovered {
  ags: string;
  recovered: number;
}

export async function getDistrictsNewRecovered(
  metaData: MetaData
): Promise<ResponseData<D_NewRecovered[]>> {
  let json: IDistrictDataFile = await getData(metaData, Files.D_NewRecovered);
  const districts = json.data.map((dist) => {
    return {
      ags: dist.IdLandkreis,
      recovered: dist.newRecovered,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_CasesHistory {
  ags: string;
  name: string;
  cases: number;
  date: Date;
}

interface D_CasesHistoryFile {
  data: {
    i: string; // AGS
    m: Date; // Meldedatum
    t: string; // Bezeichnung zum AGS
    c: number; // Fälle
  }[];
  metaData: MetaData;
}

export async function getDistrictsCasesHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<ResponseData<D_CasesHistory[]>> {
  let json: D_CasesHistoryFile = await getData(metaData, Files.D_CasesHistory);
  let history: D_CasesHistory[] = json.data.map((dist) => {
    return {
      ags: dist.i,
      name: dist.t,
      cases: dist.c,
      date: new Date(dist.m),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_DeathsHistory {
  ags: string;
  name: string;
  deaths: number;
  date: Date;
}

interface D_DeathsHistoryFile {
  data: {
    i: string; // AGS
    m: Date; // Meldedatum
    t: string; // Bezeichnung zum AGS
    d: number; // Todesfälle
  }[];
  metaData: MetaData;
}

export async function getDistrictsDeathsHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<ResponseData<D_DeathsHistory[]>> {
  let json: D_DeathsHistoryFile = await getData(
    metaData,
    Files.D_DeathsHistory
  );
  let history: D_DeathsHistory[] = json.data.map((dist) => {
    return {
      ags: dist.i,
      name: dist.t,
      deaths: dist.d,
      date: new Date(dist.m),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_RecoveredHistory {
  ags: string;
  name: string;
  recovered: number;
  date: Date;
}

interface D_RecoveredHistoryFile {
  data: {
    i: string; // AGS
    m: Date; // Meldedatum
    t: string; // Bezeichnung zum AGS
    r: number; // Genesen
  }[];
  metaData: MetaData;
}

export async function getDistrictsRecoveredHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<ResponseData<D_RecoveredHistory[]>> {
  let json: D_RecoveredHistoryFile = await getData(
    metaData,
    Files.D_RecoveredHistory
  );
  let history: D_RecoveredHistory[] = json.data.map((dist) => {
    return {
      ags: dist.i,
      name: dist.t,
      recovered: dist.r,
      date: new Date(dist.m),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_IncidenceHistory {
  ags: string;
  name: string;
  incidence: number;
  date: Date;
}

export interface D_IncidenceHistoryFile {
  data: {
    i: string; // AGS
    m: Date; // Meldedatum
    t: string; // Bezeichnung zum AGS
    c7: number; // Fälle7Tage
    i7: number; // Incidence 7 Tage
  }[];
  metaData: MetaData;
}

export async function getDistrictsIncidenceHistory(
  metaData: MetaData,
  days?: number,
  ags?: string
): Promise<ResponseData<D_IncidenceHistory[]>> {
  let json: D_IncidenceHistoryFile = await getData(
    metaData,
    Files.D_IncidenceHistory
  );
  let history: D_IncidenceHistory[] = json.data.map((dist) => {
    return {
      ags: dist.i,
      name: dist.t,
      incidence: dist.i7,
      date: new Date(dist.m),
    };
  });
  if (days) {
    const reference_date = new Date(getDateBefore(days));
    history = history.filter((entry) => new Date(entry.date) > reference_date);
  }
  if (ags) {
    ags = ags.padStart(5, "0");
    history = history.filter((entry) => entry.ags == ags);
  }
  return {
    data: history,
    lastUpdate: new Date(json.metaData.modified),
  };
}

interface D_AgeGrpFile {
  data: {
    IdLandkreis: string;
    Altersgruppe: string;
    casesMale: number;
    casesFemale: number;
    deathsMale: number;
    deathsFemale: number;
    casesMalePer100k: number;
    casesFemalePer100k: number;
    deathsMalePer100k: number;
    deathsFemalePer100k: number;
  }[];
  metaData: MetaData;
}

export async function getDistrictsAgeGroups(
  metaData: MetaData,
  paramAgs?: string
): Promise<ResponseData<AgeGroupsData>> {
  let json: D_AgeGrpFile = await getData(metaData, Files.D_AgeGroups);
  if (paramAgs) paramAgs = paramAgs.padStart(5, "0");
  const districts: AgeGroupsData = {};
  json.data.forEach((entry) => {
    const ags = entry.IdLandkreis;
    if (paramAgs && paramAgs != ags) return;
    if (!districts[ags]) districts[ags] = {};
    districts[ags][entry.Altersgruppe] = {
      casesMale: entry.casesMale,
      casesFemale: entry.casesFemale,
      deathsMale: entry.deathsMale,
      deathsFemale: entry.deathsFemale,
      casesMalePer100k: entry.casesMalePer100k,
      casesFemalePer100k: entry.casesFemalePer100k,
      deathsMalePer100k: entry.deathsMalePer100k,
      deathsFemalePer100k: entry.deathsFemalePer100k,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(json.metaData.modified),
  };
}

export interface D_CasesChangesHistory {
  [id: string]: {
    [date: string]: {
      cases: number;
      changeDate: Date;
    }[];
  };
}

export interface D_CasesHistoryChangesFile {
  data: {
    m: Date; // Meldedatum
    i: string; // id Bundesland
    c: number; // Fälle
    cD: Date; // ÄnderungsDatum
  }[];
  metaData: MetaData;
}

export async function getDistrictsCasesChangesHistory(
  metaDataRD5: MetaData,
  tillReportDate?: Date,
  oneReportDate?: Date,
  changeDate?: Date,
  districtId?: string
): Promise<ResponseData<D_CasesChangesHistory>> {
  const json: D_CasesHistoryChangesFile = await getData(
    metaDataRD5,
    Files.D_CasesHistoryLastChangesFile,
    baseUrlRD5
  );
  // filter id
  if (districtId) {
    json.data = json.data.filter((district) => district.i == districtId);
    if (json.data.length == 0){
      throw new TypeError(
        `${districtId} is not a valid ags for a district`
      );
    }
  }
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
    json.data = json.data.filter(
      (changeDates) => changeDates.cD.getTime() == changeDate.getTime()
    );
  }
  const casesChangesHistory: D_CasesChangesHistory = json.data.reduce(
    (district, entry) => {
      const dateStr = new Date(entry.m).toISOString().split("T").shift();
      if (district[entry.i]) {
        if (district[entry.i][dateStr]) {
          district[entry.i][dateStr].push({
            cases: entry.c,
            changeDate: new Date(entry.cD),
          });
        } else {
          district[entry.i][dateStr] = [
            { cases: entry.c, changeDate: new Date(entry.cD) },
          ];
        }
      } else {
        district[entry.i] = {
          [dateStr]: [{ cases: entry.c, changeDate: new Date(entry.cD) }],
        };
      }
      return district;
    },
    {}
  );

  Object.keys(casesChangesHistory).forEach((district) => {
    Object.keys(casesChangesHistory[district]).forEach((date) => {
      casesChangesHistory[district][date].sort((a, b) => {
        const dateA = new Date(a.changeDate);
        const dateB = new Date(b.changeDate);
        return dateA.getTime() - dateB.getTime();
      });
    });
  });

  return {
    lastUpdate: new Date(json.metaData.modified),
    data: casesChangesHistory,
  };
}
