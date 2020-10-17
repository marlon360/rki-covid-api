import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import cheerio from 'cheerio';
import State from '../model';

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');

    let states = [];
    
    const $ = await fetchData('https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html');

    let lastUpdate = $('#main > .text > p').first().text().substr(7);

    $('table > tbody > tr').each((index, element) => {
        if (index < 16) {

            let name = $(element).find("td").get(0);
            let count = $(element).find("td").get(1);
            let difference = $(element).find("td").get(2);
            let weekDifference = $(element).find("td").get(3);
            let weekIncidence = $(element).find("td").get(4);
            let deaths = $(element).find("td").get(5);

            let state = new State();
            state.name = cleanText($(name).text());
            state.count = parseNumber($(count).text());
            state.difference = parseNumber($(difference).text());
            state.weekDifference = parseNumber($(weekDifference).text());
            state.weekIncidence = parseNumber($(weekIncidence).text());
            state.deaths = parseNumber($(deaths).text());
            state.code = getAbbreviation(state.name);

            states.push(state);
        }
    });
    res.json({ lastUpdate: lastUpdate, states: states,  })
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