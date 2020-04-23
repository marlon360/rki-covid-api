import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import cheerio from 'cheerio';
import State from '../model';

interface APIData {
    features: Feature[]
}
interface Feature {
    attributes: {
        Fallzahl: number,
        Death: number,
        LAN_ew_GEN: string
    }
}

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');

    const repsonse = await axios.get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronafälle_in_den_Bundesländern/FeatureServer/0/query?where=1%3D1&outFields=Fallzahl,Aktualisierung,faelle_100000_EW,Death,LAN_ew_GEN&returnGeometry=false&outSR=4326&f=json");
    const apidata: APIData = repsonse.data;

    let states: State[] = [];

    for (const feature of apidata.features) {
        let state = new State();
        state.name = feature.attributes.LAN_ew_GEN;
        state.count = feature.attributes.Fallzahl;
        state.difference = 0;
        state.deaths = feature.attributes.Death;
        state.code = getAbbreviation(state.name);
    
        states.push(state);
    }

    res.json({ states: states })
}

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
