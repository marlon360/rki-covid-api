import axios from "axios";
import {
  getDateBefore,
  RKIError,
  getDataAlternateSource,
  parseDate,
} from "../utils";
import { ResponseData } from "./response-data";

export interface IDistrictData {
  ags: string;
  name: string;
  county: string;
  state: string;
  population: number;
  cases: number;
  deaths: number;
  casesPerWeek: number;
  deathsPerWeek: number;
  lastUpdated: number;
}

export async function getDistrictsData(): Promise<
  ResponseData<IDistrictData[]>
> {
  const response = await axios.get(
    `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=RS,GEN,EWZ,cases,deaths,county,last_update,cases7_lk,death7_lk,BL&returnGeometry=false&outSR=4326&f=json`
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.RS,
      name: feature.attributes.GEN,
      county: feature.attributes.county,
      state: feature.attributes.BL,
      population: feature.attributes.EWZ,
      cases: feature.attributes.cases,
      deaths: feature.attributes.deaths,
      casesPerWeek: feature.attributes.cases7_lk,
      deathsPerWeek: feature.attributes.death7_lk,
    };
  });
  return {
    data: districts,
    lastUpdate: parseDate(data.features[0].attributes.last_update),
  };
}

export async function getDistrictsRecoveredData(): Promise<
  ResponseData<{ ags: string; recovered: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
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
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    data = await getDataAlternateSource(url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: districts,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getNewDistrictCases(): Promise<
  ResponseData<{ ags: string; cases: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime(); //now im milliseconds
  const actualDate = now.setHours(0, 0, 0, 0); // date 0:00 GMT
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime(); // Datenstand im milliseconds
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    data = await getDataAlternateSource(url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      cases: feature.attributes.cases,
    };
  });
  return {
    data: districts,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getNewDistrictDeaths(): Promise<
  ResponseData<{ ags: string; deaths: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  // check if data is updated, if not try alternate download from separately state tables
  const now = new Date();
  const nowTime = now.getTime(); //now im milliseconds
  const actualDate = now.setHours(0, 0, 0, 0); // date 0:00 GMT
  const threeOclock = now.setHours(3, 30, 0, 0); // after 3:30 GMT the RKI data update should be done
  const Datenstand = parseDate(
    data.features[0].attributes.Datenstand
  ).getTime(); // Datenstand im milliseconds
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    data = await getDataAlternateSource(url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      deaths: feature.attributes.deaths,
    };
  });
  return {
    data: districts,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getNewDistrictRecovered(): Promise<
  ResponseData<{ ags: string; recovered: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
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
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    data = await getDataAlternateSource(url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: districts,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getLastDistrictCasesHistory(
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; cases: number; date: Date }[]>
> {
  const whereParams = [`NeuerFall IN(1,0)`];
  if (ags != null) {
    whereParams.push(`IdLandkreis = '${parseInt(ags)}'`);
  } else {
    // if ags is not defined restrict days to 36
    if (days != null) {
      days = Math.min(days, 36);
    } else {
      days = 36;
    }
  }
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Landkreis,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Landkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

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
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    // if a ags is given get only the data from the specific states table
    if (ags) {
      const blId = ags.padStart(2, "0").substring(0, 2);
      data = await getDataAlternateSource(url, blId);
    } else {
      data = await getDataAlternateSource(url);
    }
  }
  const history: {
    ags: string;
    name: string;
    cases: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      name: feature.attributes.Landkreis,
      cases: feature.attributes.cases,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getLastDistrictDeathsHistory(
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; deaths: number; date: Date }[]>
> {
  const whereParams = [`NeuerTodesfall IN(1,0,-9)`];
  if (ags != null) {
    whereParams.push(`IdLandkreis = '${parseInt(ags)}'`);
  } else {
    // if ags is not defined restrict days to 30
    if (days != null) {
      days = Math.min(days, 30);
    } else {
      days = 30;
    }
  }
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Landkreis,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Landkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

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
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    // if a ags is given get only the data from the specific states table
    if (ags) {
      const blId = ags.padStart(2, "0").substring(0, 2);
      data = await getDataAlternateSource(url, blId);
    } else {
      data = await getDataAlternateSource(url);
    }
  }
  const history: {
    ags: string;
    name: string;
    deaths: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      name: feature.attributes.Landkreis,
      deaths: feature.attributes.deaths,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}

export async function getLastDistrictRecoveredHistory(
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; recovered: number; date: Date }[]>
> {
  const whereParams = [`NeuGenesen IN(1,0,-9)`];
  if (ags != null) {
    whereParams.push(`IdLandkreis = '${parseInt(ags)}'`);
  } else {
    // if ags is not defined restrict days to 30
    if (days != null) {
      days = Math.min(days, 30);
    } else {
      days = 30;
    }
  }
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,Landkreis,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Landkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

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
  if (
    actualDate - Datenstand > 24 * 60 * 60000 ||
    (Datenstand != actualDate && nowTime > threeOclock)
  ) {
    // if a ags is given get only the data from the specific states table
    if (ags) {
      const blId = ags.padStart(2, "0").substring(0, 2);
      data = await getDataAlternateSource(url, blId);
    } else {
      data = await getDataAlternateSource(url);
    }
  }
  const history: {
    ags: string;
    name: string;
    recovered: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      name: feature.attributes.Landkreis,
      recovered: feature.attributes.recovered,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: parseDate(data.features[0].attributes.Datenstand),
  };
}
