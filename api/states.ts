import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import cheerio from 'cheerio';
import State from '../model';

interface APIData {
    features: Feature[]
}

interface Feature {
    properties: {
        Fallzahl: number,
        Aktualisierung: number,
        faelle_100000_E: number,
        cases7_bl_per_100k: number,
        Death: number,
        LAN_ew_GEN: string
    }
}

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');

    let states = [];
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson");
    const apidata: APIData = repsonse.data;

    for (const feature of apidata.features) {
        let state = new State();
        state.name = feature.properties.LAN_ew_GEN;
        state.count = feature.properties.Fallzahl;
        state.deaths = feature.properties.Death;
        state.weekIncidence = feature.properties.cases7_bl_per_100k;
        state.code = getAbbreviation(state.name);

        states.push(state);
    }

    res.json({ lastUpdate: apidata.features[0].properties.Aktualisierung, states: states })
}

function parseNumber(text: string) {
    if (text == "") {
        return 0;
    }

    text = text.replace(".", "");
    text = text.replace("*", "");

    return parseInt(text);
}

function cleanText(text: string): string {
    text = text.replace(/[^\w- ü]+/g, "");
    return text
}

async function fetchData(url: string) {
    const result = await axios.get(url);
    return cheerio.load(result.data);
};

function getAbbreviation(name: string) {
    switch (name) {
        case "Baden-Württemberg":
            return "BW";
        case "Bayern":
            return "BY";
        case "Berlin":
            return "BE";
        case "Brandenburg":
            return "BB";
        case "Bremen":
            return "HB";
        case "Hamburg":
            return "HH";
        case "Hessen":
            return "HE";
        case "Mecklenburg-Vorpommern":
            return "MV";
        case "Niedersachsen":
            return "NI";
        case "Nordrhein-Westfalen":
            return "NW";
        case "Rheinland-Pfalz":
            return "RP";
        case "Saarland":
            return "SL";
        case "Sachsen":
            return "SN";
        case "Sachsen-Anhalt":
            return "ST";
        case "Schleswig-Holstein":
            return "SH";
        case "Thüringen":
            return "TH";
        default:
            return "Unknown";
    }
}