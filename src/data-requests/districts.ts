import axios from "axios";
import { getDateBefore, RKIError } from "../utils";
import { ResponseData } from "./response-data";

function parseDate(dateString: string): Date {
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
  const response = await axios.get(
    `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.features[0].attributes.date),
  };
}

export async function getNewDistrictCases(): Promise<
  ResponseData<{ ags: string; cases: number }[]>
> {
  const response = await axios.get(
    `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`
  );
  const data = response.data;
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      cases: feature.attributes.cases,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.features[0].attributes.date),
  };
}

export async function getNewDistrictDeaths(): Promise<
  ResponseData<{ ags: string; deaths: number }[]>
> {
  const response = await axios.get(
    `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`
  );
  const data = response.data;
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      deaths: feature.attributes.deaths,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.features[0].attributes.date),
  };
}

export async function getNewDistrictRecovered(): Promise<
  ResponseData<{ ags: string; recovered: number }[]>
> {
  const response = await axios.get(
    `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis&groupByFieldsForStatistics=IdLandkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const districts = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      recovered: feature.attributes.recovered,
    };
  });
  return {
    data: districts,
    lastUpdate: new Date(data.features[0].attributes.date),
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
    whereParams.push(`IdLandkreis = '${ags}'`);
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
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Landkreis,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Landkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const history: {
    ags: string;
    name: string;
    cases: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      name: feature.attributes.Landkreis,
      cases: feature.attributes.cases,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: history[history.length - 1]
      ? history[history.length - 1].date
      : new Date(),
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
    whereParams.push(`IdLandkreis = '${ags}'`);
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
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Landkreis,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Landkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const history: {
    ags: string;
    name: string;
    deaths: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      name: feature.attributes.Landkreis,
      deaths: feature.attributes.deaths,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: history[history.length - 1]
      ? history[history.length - 1].date
      : new Date(),
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
    whereParams.push(`IdLandkreis = '${ags}'`);
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
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,Landkreis,IdLandkreis&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdLandkreis,MeldeDatum&groupByFieldsForStatistics=IdLandkreis,MeldeDatum,Landkreis&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const history: {
    ags: string;
    name: string;
    recovered: number;
    date: Date;
  }[] = data.features.map((feature) => {
    return {
      ags: feature.attributes.IdLandkreis,
      name: feature.attributes.Landkreis,
      recovered: feature.attributes.recovered,
      date: new Date(feature.attributes.MeldeDatum),
    };
  });

  return {
    data: history,
    lastUpdate: history[history.length - 1]
      ? history[history.length - 1].date
      : new Date(),
  };
}
