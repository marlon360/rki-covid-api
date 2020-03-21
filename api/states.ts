import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import cheerio from 'cheerio';
import State from '../model';

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');

    let states = [];
    
    const $ = await fetchData('https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html');
    $('table > tbody > tr').each((index, element) => {
        if (index < 16) {

            let name = $(element).find("td").get(0);
            let count = $(element).find("td").get(1);
            let difference = $(element).find("td").get(2);
            let deaths = $(element).find("td").get(3);
            
            let state = new State();
            state.name = $(name).text();
            state.count = parseNumber($(count).text());
            state.difference = parseInt($(difference).text());
            state.deaths = parseNumber($(deaths).text());
            state.code = getAbbreviation(state.name);
            
            states.push(state);
        }
    });
    res.json({ states: states })
}

function parseNumber(text: string) {
    text = text.replace(".", "");
    return parseInt(text);
}

async function fetchData(url: string) {
    const result = await axios.get(url);
    return cheerio.load(result.data);
};

function getAbbreviation(name: string) {
    switch (name) {
        case "Baden-Württem­berg":
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
            return "HB";
        case "Hessen":
            return "HE";
        case "Mecklenburg-Vor­pommern":
            return "MV";
        case "Niedersachsen":
            return "NI";
        case "Nordrhein-West­falen":
            return "NW";
        case "Rhein­land-Pfalz":
            return "RP";
        case "Saarland":
            return "SL";
        case "Sachsen":
            return "SN";
        case "Sachsen-Anhalt":
            return "ST";
        case "Schles­wig-Holstein":
            return "SH";
        case "Thüringen":
            return "TH";
        default:
            return "Unknown";
    }
}