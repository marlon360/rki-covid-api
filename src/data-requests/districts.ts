import axios from "axios";
import {
  getDateBefore,
  RKIError,
  getAlternateDataSource,
  parseDate,
  shouldUseAlternateDataSource,
} from "../utils";
import { ResponseData } from "./response-data";
import { AgeGroupsData } from "./states";

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
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    data = await getAlternateDataSource(url);
    datenstand = parseDate(data.features[0].attributes.Datenstand);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: districts,
    lastUpdate: datenstand,
  };
}

export async function getNewDistrictCases(): Promise<
  ResponseData<{ ags: string; cases: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  if (data.features.length == 0) {
    // This meens there are no new cases in all districts!
    // but we need the field "Datenstand" from the rki Data Base so
    // lets request the total cases (there is always a result!)
    // and "build" a result with "total cases Datenstand" and "new cases = 0"
    const url2 = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
    const response2 = await axios.get(url2);
    const data2 = response2.data;
    if (data2.error) {
      throw new RKIError(data2.error, response2.config.url);
    }
    data.features[0] = {
      attributes: {
        IdLandkreis: 1001,
        cases: 0,
        Datenstand: data2.features[0].attributes.Datenstand,
      },
    };
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    data = await getAlternateDataSource(url);
    datenstand = parseDate(data.features[0].attributes.Datenstand);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      cases: feature.attributes.cases,
    };
  });
  return {
    data: districts,
    lastUpdate: datenstand,
  };
}

export async function getNewDistrictDeaths(): Promise<
  ResponseData<{ ags: string; deaths: number }[]>
> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  // check if there is a result
  if (data.features.length == 0) {
    // This meens there are no new deaths in all districts!
    // if not, we need the field "Datenstand" from the rki Data Base so
    // lets request the total deaths (there is always a result!)
    // and "build" one result with "total deaths Datenstand" and "new deaths = 0" and "IdLandkreis=1001"
    const url2 = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerTodesfall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
    const response2 = await axios.get(url2);
    const data2 = response2.data;
    if (data2.error) {
      throw new RKIError(data2.error, response2.config.url);
    }
    data.features[0] = {
      attributes: {
        IdLandkreis: 1001,
        deaths: 0,
        Datenstand: data2.features[0].attributes.Datenstand,
      },
    };
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const data2 = await getAlternateDataSource(url);
    if (data2.features.length > 0) {
      data = data2;
      datenstand = parseDate(data2.features[0].attributes.Datenstand);
    }
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      deaths: feature.attributes.deaths,
    };
  });
  return {
    data: districts,
    lastUpdate: datenstand,
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
  if (data.features.length == 0) {
    // This meens there are no new recovered in all districts!
    // if not, we need the field "Datenstand" from the rki Data Base so
    // lets request the total deaths (there is always a result!)
    // and "build" one result with "total recovereds Datenstand" and "new recovered = 0" and "IdLandkreis=1001"
    const url2 = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdLandkreis,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
    const response2 = await axios.get(url2);
    const data2 = response2.data;
    if (data2.error) {
      throw new RKIError(data2.error, response2.config.url);
    }
    data.features[0] = {
      attributes: {
        IdLandkreis: 1001,
        recovered: 0,
        Datenstand: data2.features[0].attributes.Datenstand,
      },
    };
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    data = await getAlternateDataSource(url);
    datenstand = parseDate(data.features[0].attributes.Datenstand);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis.toString().padStart(5, "0"),
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: districts,
    lastUpdate: datenstand,
  };
}

export async function getLastDistrictCasesHistory(
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; cases: number; date: Date }[]>
> {
  const whereParams = [`NeuerFall IN(1,0)`];
  if (ags) {
    whereParams.push(`IdLandkreis = '${parseInt(ags)}'`);
  }
  if (days) {
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
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand, data.exceededTransferLimit)) {
    const blId = ags ? ags.padStart(5, "0").substring(0, 2) : null;
    data = await getAlternateDataSource(url, blId);
    datenstand = parseDate(data.features[0].attributes.Datenstand);
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
    lastUpdate: datenstand,
  };
}

export async function getLastDistrictDeathsHistory(
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; deaths: number; date: Date }[]>
> {
  const whereParams = [`NeuerTodesfall IN(1,0,-9)`];
  if (ags) {
    whereParams.push(`IdLandkreis = '${parseInt(ags)}'`);
  }
  if (days) {
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
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand, data.exceededTransferLimit)) {
    const blId = ags ? ags.padStart(5, "0").substring(0, 2) : null;
    data = await getAlternateDataSource(url, blId);
    datenstand = parseDate(data.features[0].attributes.Datenstand);
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
    lastUpdate: datenstand,
  };
}

export async function getLastDistrictRecoveredHistory(
  days?: number,
  ags?: string
): Promise<
  ResponseData<{ ags: string; name: string; recovered: number; date: Date }[]>
> {
  const whereParams = [`NeuGenesen IN(1,0,-9)`];
  if (ags) {
    whereParams.push(`IdLandkreis = '${parseInt(ags)}'`);
  }
  if (days) {
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
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand, data.exceededTransferLimit)) {
    const blId = ags ? ags.padStart(5, "0").substring(0, 2) : null;
    data = await getAlternateDataSource(url, blId);
    datenstand = parseDate(data.features[0].attributes.Datenstand);
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
    lastUpdate: datenstand,
  };
}

export async function getDistrictsAgeGroups(
  paramAgs?: string
): Promise<ResponseData<AgeGroupsData>> {
  // The server response is limited to 1000 datasets! We await 411 districts with 6 aga-groups each = 2466 datasets
  // so wee need 3 requests (822 datasets each)
  // if ags is given make a single request
  let features = [];
  let lastUpdate: Date;
  if (paramAgs) {
    const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/rki_altersgruppen_hubv/FeatureServer/0/query?where=AdmUnitId%3D${paramAgs}&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
    const response = await axios.get(url);
    const data = response.data.features;
    if (data.error) {
      throw new RKIError(data.error, response.config.url);
    }
    const lastModified = response.headers["last-modified"];
    lastUpdate = lastModified != null ? new Date(lastModified) : new Date();
    features = data;
  } else {
    const url1 =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/rki_altersgruppen_hubv/FeatureServer/0/query?where=AdmUnitId%3E%3D01001+AND+AdmUnitId%3C%3D06631&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=";
    const url2 =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/rki_altersgruppen_hubv/FeatureServer/0/query?where=AdmUnitId%3E%3D06632+AND+AdmUnitId%3C%3D09473&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=";
    const url3 =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/rki_altersgruppen_hubv/FeatureServer/0/query?where=AdmUnitId%3E%3D09474+AND+AdmUnitId%3C%3D16077&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=";
    const responses = await Promise.all([
      axios.get(url1).then((response) => {
        return response;
      }),
      axios.get(url2).then((response) => {
        return response;
      }),
      axios.get(url3).then((response) => {
        return response;
      }),
    ]);
    const features0 = responses[0].data.features;
    if (features0.error) {
      throw new RKIError(features0.error, responses[0].config.url);
    }
    const features1 = responses[1].data.features;
    if (features1.error) {
      throw new RKIError(features1.error, responses[1].config.url);
    }
    const features2 = responses[2].data.features;
    if (features2.error) {
      throw new RKIError(features2.error, responses[2].config.url);
    }
    // concatenate the data
    features = [...features0, ...features1, ...features2];
    const lastModified = responses[0].headers["last-modified"];
    lastUpdate = lastModified != null ? new Date(lastModified) : new Date();
  }
  const districts: AgeGroupsData = {};
  features.forEach((feature) => {
    const ags = feature.attributes.AdmUnitId.toString().padStart(5, "0");
    if (!districts[ags]) districts[ags] = {};
    districts[ags][feature.attributes.Altersgruppe] = {
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
    data: districts,
    lastUpdate,
  };
}
