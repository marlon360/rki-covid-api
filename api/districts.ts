import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import { District } from '../models';

interface APIData {
    features: Feature[]
}

interface Feature {
    attributes: {
        GEN: string,
        county: string,
        cases: number,
        deaths: number,
        cases_per_100k: number,
        cases_per_population: number,
        cases7_per_100k: number,
        last_update: string
    }
}

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');

    let districts = [];

    const response = await axios.get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,county,cases,deaths,cases_per_100k,cases_per_population,last_update,cases7_per_100k&outSR=4326&f=json");
    const apidata: APIData = response.data;

    for (const feature of apidata.features) {
        let district = new District();
        district.name = feature.attributes.GEN;
        district.type = feature.attributes.county.substring(0,2);
        district.count = feature.attributes.cases;
        district.deaths = feature.attributes.deaths;
        district.weekIncidence = feature.attributes.cases7_per_100k;
        district.casesPer100k = feature.attributes.cases_per_100k;
        district.casesPerPopulation = feature.attributes.cases_per_population;

        districts.push(district);
    }

    res.json({ lastUpdate: apidata.features[0].attributes.last_update, districts: districts })
}
