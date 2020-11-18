import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';

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

    const response = await axios.get("https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson");
    const apidata: APIData = response.data;

    let cumulative = {
        recovered: 0,
        cases: 0,
         deaths: 0,
    }

    for (const feature of apidata.features) {
        cumulative.recovered += feature.properties.AnzahlGenesen;
        cumulative.cases += feature.properties.AnzahlFall;
        cumulative.deaths += feature.properties.AnzahlTodesfall;
    }

    const latestUpdate = apidata.features[0].properties.Datenstand;

    res.json({
        latestUpdate,
        recovered: cumulative.recovered,
        cases: cumulative.cases,
        deaths: cumulative.deaths
    })
}
