import axios from "axios";
import {
  getDateBefore,
  getStateAbbreviationById,
  RKIError,
  getDataAlternateSource,
  parseDate,
} from "../utils";
import { ResponseData } from "./response-data";

export interface IStateData {
  id: number;
  name: string;
  population: number;
  cases: number;
  deaths: number;
  casesPerWeek: number;
  deathsPerWeek: number;
  lastUpdated: number;
}

export async function getStatesData(): Promise<ResponseData<IStateData[]>> {
  const response = await axios.get(
    `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronafälle_in_den_Bundesländern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_EWZ,LAN_ew_AGS,Fallzahl,Aktualisierung,Death,cases7_bl,death7_bl,LAN_ew_GEN&returnGeometry=false&outSR=4326&f=json`
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const states = data.features.map((feature) => {
    return {
      id: parseInt(feature.attributes.LAN_ew_AGS),
      name: feature.attributes.LAN_ew_GEN,
      population: feature.attributes.LAN_ew_EWZ,
      cases: feature.attributes.Fallzahl,
      deaths: feature.attributes.Death,
      casesPerWeek: feature.attributes.cases7_bl,
      deathsPerWeek: feature.attributes.death7_bl,
    };
  });
  return {
    data: states,
    lastUpdate: new Date(
      data.features[0].attributes.Aktualisierung + 60 * 60 * 1000
    ),
  };
}

export async function getStatesRecoveredData(): Promise<
  ResponseData<{ id: number; recovered: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdBundeland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime();
  const actualDate = now.setHours(0, 0, 0, 0);
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime();
  if (Datenstand != actualDate && nowTime > threeOclock) {
    data = await getDataAlternateSource(url);
  }
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: states,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getNewStateRecovered(): Promise<
  ResponseData<{ id: number; recovered: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdBundeland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime();
  const actualDate = now.setHours(0, 0, 0, 0);
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime();
  if (Datenstand != actualDate && nowTime > threeOclock) {
    data = await getDataAlternateSource(url);
  }
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: states,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getNewStateCases(): Promise<
  ResponseData<{ id: number; cases: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,IdBundeland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime();
  const actualDate = now.setHours(0, 0, 0, 0);
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime();
  if (Datenstand != actualDate && nowTime > threeOclock) {
    data = await getDataAlternateSource(url);
  }
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      cases: feature.attributes.cases,
    };
  });
  return {
    data: states,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getNewStateDeaths(): Promise<
  ResponseData<{ id: number; deaths: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,IdBundeland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime();
  const actualDate = now.setHours(0, 0, 0, 0);
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime();
  if (Datenstand != actualDate && nowTime > threeOclock) {
    data = await getDataAlternateSource(url);
  }
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      deaths: feature.attributes.deaths,
    };
  });
  return {
    data: states,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getLastStateCasesHistory(
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; cases: number; date: Date }[]>
> {
  const whereParams = [`NeuerFall IN(1,0)`];
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  if (id != null) {
    whereParams.push(`IdBundesland = ${id}`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Bundesland,IdBundesland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland,MeldeDatum&groupByFieldsForStatistics=IdBundesland,MeldeDatum,Bundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime(); //now im milliseconds
  const actualDate = now.setHours(0, 0, 0, 0); // date 0:00 GMT
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime(); // Datenstand im milliseconds
  if (Datenstand != actualDate && nowTime > threeOclock) {
    // if a state id is given get only the data from the specific states table
    if (id) {
      const blId = id.toString().padStart(2, "0").substring(0, 2);
      data = await getDataAlternateSource(url, blId);
    } else {
      data = await getDataAlternateSource(url);
    }
  }
  const history: {
    id: number;
    name: string;
    cases: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      name: feature.attributes.Bundesland,
      cases: feature.attributes.cases,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getLastStateDeathsHistory(
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; deaths: number; date: Date }[]>
> {
  const whereParams = [`NeuerTodesfall IN(1,0,-9)`];
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  if (id != null) {
    whereParams.push(`IdBundesland = ${id}`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Bundesland,IdBundesland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland,MeldeDatum&groupByFieldsForStatistics=IdBundesland,MeldeDatum,Bundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime(); //now im milliseconds
  const actualDate = now.setHours(0, 0, 0, 0); // date 0:00 GMT
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime(); // Datenstand im milliseconds
  if (Datenstand != actualDate && nowTime > threeOclock) {
    // if a state id is given get only the data from the specific states table
    if (id) {
      const blId = id.toString().padStart(2, "0").substring(0, 2);
      data = await getDataAlternateSource(url, blId);
    } else {
      data = await getDataAlternateSource(url);
    }
  }
  const history: {
    id: number;
    name: string;
    deaths: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      name: feature.attributes.Bundesland,
      deaths: feature.attributes.deaths,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getLastStateRecoveredHistory(
  days?: number,
  id?: number
): Promise<
  ResponseData<{ id: number; name: string; recovered: number; date: Date }[]>
> {
  const whereParams = [`NeuGenesen IN(1,0,-9)`];
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  if (id != null) {
    whereParams.push(`IdBundesland = ${id}`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,Bundesland,IdBundesland,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland,MeldeDatum&groupByFieldsForStatistics=IdBundesland,MeldeDatum,Bundesland,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime(); //now im milliseconds
  const actualDate = now.setHours(0, 0, 0, 0); // date 0:00 GMT
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime(); // Datenstand im milliseconds
  if (Datenstand != actualDate && nowTime > threeOclock) {
    // if a state id is given get only the data from the specific states table
    if (id) {
      const blId = id.toString().padStart(2, "0").substring(0, 2);
      data = await getDataAlternateSource(url, blId);
    } else {
      data = await getDataAlternateSource(url);
    }
  }
  const history: {
    id: number;
    name: string;
    recovered: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      name: feature.attributes.Bundesland,
      recovered: feature.attributes.recovered,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export interface AgeGroupData {
  casesMale: string;
  casesFemale: string;
  deathsMale: string;
  deathsFemale: string;
  casesMalePer100k: string;
  casesFemalePer100k: string;
  deathsMalePer100k: string;
  deathsFemalePer100k: string;
}

export interface AgeGroupsData {
  [key: string]: {
    [key: string]: AgeGroupData;
  };
}

export async function getStatesAgeGroups(
  id?: number
): Promise<ResponseData<AgeGroupsData>> {
  const response = await axios.get(
    "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_altersgruppen_hubv/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const lastModified = response.headers["last-modified"];
  const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

  const states: AgeGroupsData = {};
  data.features.forEach((feature) => {
    if (!feature.attributes.BundeslandId) return;
    if (id && feature.attributes.BundeslandId != id) return;
    const abbreviation = getStateAbbreviationById(
      feature.attributes.BundeslandId
    );
    if (!states[abbreviation]) states[abbreviation] = {};
    states[abbreviation][feature.attributes.Altersgruppe] = {
      casesMale: feature.attributes.AnzFallM,
      casesFemale: feature.attributes.AnzFallW,
      deathsMale: feature.attributes.AnzTodesfallM,
      deathsFemale: feature.attributes.AnzTodesfallW,
      casesMalePer100k: feature.attributes.AnzFall100kM,
      casesFemalePer100k: feature.attributes.AnzFall100kW,
      deathsMalePer100k: feature.attributes.AnzTodesfall100kM,
      deathsFemalePer100k: feature.attributes.AnzTodesfall100kW,
    };
  });

  return {
    data: states,
    lastUpdate,
  };
}
