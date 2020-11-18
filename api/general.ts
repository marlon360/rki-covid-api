import { NowRequest, NowResponse } from '@now/node'
const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');

superagentJsonapify(superagent);

interface APIData {
    features: Feature[]
}

interface Feature {
    properties: {
        Landkreis: string,
        AnzahlGenesen: number,
        Meldedatum: string,
        AnzahlFall: number,
        AnzahlTodesfall: number,
        Datenstand: string
    }
}

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');

    const response = await superagent.get("https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson").maxResponseSize(500 * 1024 * 1024);
    
    const apidata: APIData = response.body;

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

    res.json({
        lastUpdate,
        ...cumulative,
    })
}
