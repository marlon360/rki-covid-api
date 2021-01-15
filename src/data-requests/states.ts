import axios from 'axios';
import { getDateBefore } from '../utils';
import { ResponseData } from './response-data'

export interface IStateData {
  id: number
  name: string,
  population: number,
  cases: number,
  deaths: number,
  casesPerWeek: number,
  deathsPerWeek: number,
  lastUpdated: number
}

export async function getStatesData(): Promise<ResponseData<IStateData[]>> {
  const response = await axios.get(`https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronafälle_in_den_Bundesländern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_EWZ,LAN_ew_AGS,Fallzahl,Aktualisierung,Death,cases7_bl,death7_bl,LAN_ew_GEN&returnGeometry=false&outSR=4326&f=json`);
  const data = response.data;
  const states = data.features.map((feature) => {
    return {
      id: parseInt(feature.attributes.LAN_ew_AGS),
      name: feature.attributes.LAN_ew_GEN,
      population: feature.attributes.LAN_ew_EWZ,
      cases: feature.attributes.Fallzahl,
      deaths: feature.attributes.Death,
      casesPerWeek: feature.attributes.cases7_bl,
      deathsPerWeek: feature.attributes.death7_bl,
    }
  })
  return {
    data: states,
    lastUpdate: new Date(data.features[0].attributes.Aktualisierung + 60 * 60 * 1000)
  };
}

export async function getStatesRecoveredData(): Promise<ResponseData<{id: number, recovered: number}[]>> {
  const response = await axios.get(`https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdBundeland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      recovered: feature.attributes.recovered
    }
  })
  return {
    data: states,
    lastUpdate: new Date(data.features[0].attributes.date)
  };
}

export async function getNewStateRecovered(): Promise<ResponseData<{id: number, recovered: number}[]>> {
  const response = await axios.get(`https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,IdBundeland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      recovered: feature.attributes.recovered
    }
  })
  return {
    data: states,
    lastUpdate: new Date(data.features[0].attributes.date)
  };
}

export async function getNewStateCases(): Promise<ResponseData<{id: number, cases: number}[]>> {
  const response = await axios.get(`https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,IdBundeland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      cases: feature.attributes.cases
    }
  })
  return {
    data: states,
    lastUpdate: new Date(data.features[0].attributes.date)
  };
}

export async function getNewStateDeaths(): Promise<ResponseData<{id: number, deaths: number}[]>> {
  const response = await axios.get(`https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,IdBundeland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland&groupByFieldsForStatistics=IdBundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      deaths: feature.attributes.deaths
    }
  })
  return {
    data: states,
    lastUpdate: new Date(data.features[0].attributes.date)
  };
}

export async function getLastStateCasesHistory(days?: number, id?: number): Promise<ResponseData<{id: number, name: string, cases: number, date: Date}[]>> {
  const whereParams = [`NeuerFall IN(1,0)`];
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`)
  }
  if (id != null) {
    whereParams.push(`IdBundesland = ${id}`)
  }
  const url = `https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=${whereParams.join(" AND ")}&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Bundesland,IdBundesland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland,MeldeDatum&groupByFieldsForStatistics=IdBundesland,MeldeDatum,Bundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`

  const response = await axios.get(url);
  const data = response.data;
  const history: {id: number, name: string, cases: number, date: Date}[] = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      name: feature.attributes.Bundesland,
      cases: feature.attributes.cases,
      date: new Date(feature.attributes.MeldeDatum)
    }
  });

  return {
    data: history,
    lastUpdate: history[history.length - 1] ? history[history.length - 1].date : new Date()
  }
}

export async function getLastStateDeathsHistory(days?: number, id?: number): Promise<ResponseData<{id: number, name: string, deaths: number, date: Date}[]>> {
  const whereParams = [`NeuerTodesfall IN(1,0,-9)`];
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`)
  }
  if (id != null) {
    whereParams.push(`IdBundesland = ${id}`)
  }
  const url = `https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=${whereParams.join(" AND ")}&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Bundesland,IdBundesland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland,MeldeDatum&groupByFieldsForStatistics=IdBundesland,MeldeDatum,Bundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`

  const response = await axios.get(url);
  const data = response.data;
  const history: {id: number, name: string, deaths: number, date: Date}[] = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      name: feature.attributes.Bundesland,
      deaths: feature.attributes.deaths,
      date: new Date(feature.attributes.MeldeDatum)
    }
  });

  return {
    data: history,
    lastUpdate: history[history.length - 1] ? history[history.length - 1].date : new Date()
  }
}

export async function getLastStateRecoveredHistory(days?: number, id?: number): Promise<ResponseData<{id: number, name: string, recovered: number, date: Date}[]>> {
  const whereParams = [`NeuGenesen IN(1,0,-9)`];
  if (days != null) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`)
  }
  if (id != null) {
    whereParams.push(`IdBundesland = ${id}`)
  }
  const url = `https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=${whereParams.join(" AND ")}&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,Bundesland,IdBundesland&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=IdBundesland,MeldeDatum&groupByFieldsForStatistics=IdBundesland,MeldeDatum,Bundesland&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`

  const response = await axios.get(url);
  const data = response.data;
  const history: {id: number, name: string, recovered: number, date: Date}[] = data.features.map((feature) => {
    return {
      id: feature.attributes.IdBundesland,
      name: feature.attributes.Bundesland,
      recovered: feature.attributes.recovered,
      date: new Date(feature.attributes.MeldeDatum)
    }
  });

  return {
    data: history,
    lastUpdate: history[history.length - 1] ? history[history.length - 1].date : new Date()
  }
}