import axios from 'axios';

interface ResponseData<T> {
  data: T,
  lastUpdate: Date
}

function getDateBefore(days: number): string {
  let offsetDate = new Date()
  offsetDate.setDate(new Date().getDate() - days)
  return offsetDate.toISOString().split('T').shift()
}

export async function getCases(): Promise<ResponseData<number>> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  return {
    data: data.features[0].attributes.cases,
    lastUpdate: new Date(data.features[0].attributes.date)
  }
}

export async function getNewCases(): Promise<ResponseData<number>> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  return {
    data: data.features[0].attributes.cases,
    lastUpdate: new Date(data.features[0].attributes.date)
  }
}

export async function getLastCasesHistory(days?: number): Promise<{cases: number, date: number}[]> {
  let url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=MeldeDatum&groupByFieldsForStatistics=MeldeDatum&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`
  if (days != null) {
    const dateString = getDateBefore(days);
    url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,0) AND MeldeDatum >= TIMESTAMP '${dateString}'&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=MeldeDatum&groupByFieldsForStatistics=MeldeDatum&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`
  }
  const response = await axios.get(url);
  const data = response.data;
  return data.features.map((feature) => {
    return {
      cases: feature.attributes.cases,
      date: feature.attributes.date
    }
  });
}

export async function getDeaths(): Promise<ResponseData<number>> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  return {
    data: data.features[0].attributes.deaths,
    lastUpdate: new Date(data.features[0].attributes.date)
  }
}

export async function getNewDeaths(): Promise<ResponseData<number>> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  return {
    data: data.features[0].attributes.deaths,
    lastUpdate: new Date(data.features[0].attributes.date)
  }
}

export async function getRecovered(): Promise<ResponseData<number>> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  return {
    data: data.features[0].attributes.recovered,
    lastUpdate: new Date(data.features[0].attributes.date)
  }
}

export async function getNewRecovered(): Promise<ResponseData<number>> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.data;
  return {
    data: data.features[0].attributes.recovered,
    lastUpdate: new Date(data.features[0].attributes.date)
  }
}

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
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronafälle_in_den_Bundesländern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_EWZ,OBJECTID,Fallzahl,Aktualisierung,Death,cases7_bl,death7_bl,LAN_ew_GEN&returnGeometry=false&outSR=4326&f=json`);
  const data = response.data;
  const states = data.features.map((feature) => {
    return {
      id: feature.attributes.OBJECTID,
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
    lastUpdate: new Date(data.features[0].attributes.Aktualisierung)
  };
}