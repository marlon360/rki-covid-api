const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');

superagentJsonapify(superagent);

function getCases() {
  const response = await superagent.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.body;
  return data.features[0].attributes.cases;
}

function getNewCases() {
  const response = await superagent.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerFall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlFall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlFall","outStatisticFieldName":"cases"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.body;
  return data.features[0].attributes.cases;
}

function getDeaths() {
  const response = await superagent.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.body;
  return data.features[0].attributes.deaths;
}

function getNewDeaths() {
  const response = await superagent.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuerTodesfall IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlTodesfall,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlTodesfall","outStatisticFieldName":"deaths"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.body;
  return data.features[0].attributes.deaths;
}

function getRecovered() {
  const response = await superagent.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,0)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.body;
  return data.features[0].attributes.recovered;
}

function getNewRecovered() {
  const response = await superagent.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=NeuGenesen IN(1,-1)&objectIds=&time=&resultType=standard&outFields=AnzahlGenesen,MeldeDatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&outStatistics=[{"statisticType":"sum","onStatisticField":"AnzahlGenesen","outStatisticFieldName":"recovered"},{"statisticType":"max","onStatisticField":"MeldeDatum","outStatisticFieldName":"date"}]&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`);
  const data = response.body;
  return data.features[0].attributes.recovered;
}

