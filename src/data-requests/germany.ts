import axios from "axios";
import { ResponseData } from "./response-data";
import {
  getDateBefore,
  RKIError,
  parseDate,
  getAlternateDataSource,
  shouldUseAlternateDataSource,
} from "../utils";

export async function getCases(): Promise<ResponseData<number>> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&groupByFieldsForStatistics=Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    let cases = 0;
    for (const feature of dataTemp.features) {
      cases += feature.attributes.cases;
    }
    data.features[0].attributes.cases = cases;
    data.features[0].attributes.Datenstand =
      dataTemp.features[0].attributes.Datenstand;
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  return {
    data: data.features[0].attributes.cases,
    lastUpdate: datenstand,
  };
}

export async function getNewCases(): Promise<ResponseData<number>> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&groupByFieldsForStatistics=Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    let cases = 0;
    for (const feature of dataTemp.features) {
      cases += feature.attributes.cases;
    }
    data.features[0].attributes.cases = cases;
    data.features[0].attributes.Datenstand =
      dataTemp.features[0].attributes.Datenstand;
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  return {
    data: data.features[0].attributes.cases,
    lastUpdate: datenstand,
  };
}

export async function getLastCasesHistory(
  days?: number
): Promise<{ history: { cases: number; date: Date }[]; lastUpdate: Date }> {
  const whereParams = ["NeuerFall IN(1,0)"];
  if (days) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=MeldeDatum&groupByFieldsForStatistics=MeldeDatum,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  let data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    // dataTemp must be aggregated and summed
    data.features = [];
    dataTemp.features.reduce(function (res, feature) {
      if (!res[feature.attributes.date]) {
        res[feature.attributes.date] = {
          attributes: {
            date: feature.attributes.date,
            cases: 0,
            Datenstand: feature.attributes.Datenstand,
          },
        };
        data.features.push(res[feature.attributes.date]);
      }
      res[feature.attributes.date].attributes.cases += feature.attributes.cases;
      return res;
    }, {});
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  const history = data.features
    .map((feature) => {
      return {
        cases: feature.attributes.cases,
        date: new Date(feature.attributes.date),
      };
    })
    .sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      return dateA.getTime() - dateB.getTime();
    });
  return {
    history: history,
    lastUpdate: datenstand,
  };
}

export async function getLastDeathsHistory(
  days?: number
): Promise<{ history: { deaths: number; date: Date }[]; lastUpdate: Date }> {
  const whereParams = ["NeuerTodesfall IN(1,0,-9)"];
  if (days) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=MeldeDatum&groupByFieldsForStatistics=MeldeDatum,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    // dataTemp must be aggregated and summed
    data.features = [];
    dataTemp.features.reduce(function (res, feature) {
      if (!res[feature.attributes.date]) {
        res[feature.attributes.date] = {
          attributes: {
            date: feature.attributes.date,
            deaths: 0,
            Datenstand: feature.attributes.Datenstand,
          },
        };
        data.features.push(res[feature.attributes.date]);
      }
      res[feature.attributes.date].attributes.deaths +=
        feature.attributes.deaths;
      return res;
    }, {});
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  const history = data.features
    .map((feature) => {
      return {
        deaths: feature.attributes.deaths,
        date: new Date(feature.attributes.date),
      };
    })
    .sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      return dateA.getTime() - dateB.getTime();
    });
  return {
    history: history,
    lastUpdate: datenstand,
  };
}

export async function getLastRecoveredHistory(
  days?: number
): Promise<{ history: { recovered: number; date: Date }[]; lastUpdate: Date }> {
  const whereParams = ["NeuGenesen IN(1,0,-9)"];
  if (days) {
    const dateString = getDateBefore(days);
    whereParams.push(`MeldeDatum >= TIMESTAMP '${dateString}'`);
  }
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=${whereParams.join(
    " AND "
  )}&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=MeldeDatum&groupByFieldsForStatistics=MeldeDatum,Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;

  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    // dataTemp must be aggregated and summed
    data.features = [];
    dataTemp.features.reduce(function (res, feature) {
      if (!res[feature.attributes.date]) {
        res[feature.attributes.date] = {
          attributes: {
            date: feature.attributes.date,
            recovered: 0,
            Datenstand: feature.attributes.Datenstand,
          },
        };
        data.features.push(res[feature.attributes.date]);
      }
      res[feature.attributes.date].attributes.recovered +=
        feature.attributes.recovered;
      return res;
    }, {});
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  const history = data.features
    .map((feature) => {
      return {
        recovered: feature.attributes.recovered,
        date: new Date(feature.attributes.date),
      };
    })
    .sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      return dateA.getTime() - dateB.getTime();
    });
  return {
    history: history,
    lastUpdate: datenstand,
  };
}

export async function getDeaths(): Promise<ResponseData<number>> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerTodesfall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&groupByFieldsForStatistics=Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    let deaths = 0;
    for (const feature of dataTemp.features) {
      deaths += feature.attributes.deaths;
    }
    data.features[0].attributes.deaths = deaths;
    data.features[0].attributes.Datenstand =
      dataTemp.features[0].attributes.Datenstand;
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  return {
    data: data.features[0].attributes.deaths,
    lastUpdate: datenstand,
  };
}

export async function getNewDeaths(): Promise<ResponseData<number>> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&groupByFieldsForStatistics=Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    let deaths = 0;
    for (const feature of dataTemp.features) {
      deaths += feature.attributes.deaths;
    }
    data.features[0].attributes.deaths = deaths;
    data.features[0].attributes.Datenstand =
      dataTemp.features[0].attributes.Datenstand;
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  return {
    data: data.features[0].attributes.deaths,
    lastUpdate: datenstand,
  };
}

export async function getRecovered(): Promise<ResponseData<number>> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum,Datenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&groupByFieldsForStatistics=Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    let recovered = 0;
    for (const feature of dataTemp.features) {
      recovered += feature.attributes.recovered;
    }
    data.features[0].attributes.recovered = recovered;
    data.features[0].attributes.Datenstand =
      dataTemp.features[0].attributes.Datenstand;
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  return {
    data: data.features[0].attributes.recovered,
    lastUpdate: datenstand,
  };
}

export async function getNewRecovered(): Promise<ResponseData<number>> {
  const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatumDatenstand&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&groupByFieldsForStatistics=Datenstand&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  let datenstand = parseDate(data.features[0].attributes.Datenstand);
  if (shouldUseAlternateDataSource(datenstand)) {
    const dataTemp = await getAlternateDataSource(url);
    let recovered = 0;
    for (const feature of dataTemp.features) {
      recovered += feature.attributes.recovered;
    }
    data.features[0].attributes.recovered = recovered;
    data.features[0].attributes.Datenstand =
      dataTemp.features[0].attributes.Datenstand;
    datenstand = parseDate(dataTemp.features[0].attributes.Datenstand);
  }
  return {
    data: data.features[0].attributes.recovered,
    lastUpdate: datenstand,
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

export async function getGermanyAgeGroups(): Promise<
  ResponseData<{ [ageGroup: string]: AgeGroupData }>
> {
  const response = await axios.get(
    "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_altersgruppen_hubv/FeatureServer/0/query?where=BundeslandId=0&outFields=*&outSR=4326&f=json"
  );
  const data = response.data;
  if (data.error) {
    throw new RKIError(data.error, response.config.url);
  }
  const lastModified = response.headers["last-modified"];
  const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

  let germany_data: { [ageGroup: string]: AgeGroupData } = {};
  data.features.forEach((feature) => {
    // germany has BundeslandId=0
    if (feature.attributes.BundeslandId === 0) {
      germany_data[feature.attributes.Altersgruppe] = {
        casesMale: feature.attributes.AnzFallM,
        casesFemale: feature.attributes.AnzFallW,
        deathsMale: feature.attributes.AnzTodesfallM,
        deathsFemale: feature.attributes.AnzTodesfallW,
        casesMalePer100k: feature.attributes.AnzFall100kM,
        casesFemalePer100k: feature.attributes.AnzFall100kW,
        deathsMalePer100k: feature.attributes.AnzTodesfall100kM,
        deathsFemalePer100k: feature.attributes.AnzTodesfall100kW,
      };
    }
  });

  return {
    data: germany_data,
    lastUpdate,
  };
}
