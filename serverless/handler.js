'use strict';

const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');

superagentJsonapify(superagent);

module.exports.general = async event => {

  const response = await superagent.get("https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson").maxResponseSize(500 * 1024 * 1024);
    
  const apidata = response.body;

  let cumulative = {
      recovered: 0,
      cases: 0,
      deaths: 0,
  }

  for (const feature of apidata.features) {
      cumulative.recovered += Math.max(0, feature.properties.AnzahlGenesen);
      cumulative.cases += Math.max(0, feature.properties.AnzahlFall);
      cumulative.deaths += Math.max(0, feature.properties.AnzahlTodesfall);
  }

  const lastUpdate = apidata.features[0].properties.Datenstand;

  return {
    statusCode: 200,
    headers: {
      "Cache-Control": "s-maxage=3600"
    },
    body: JSON.stringify(
      {
        lastUpdate,
        ...cumulative,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
