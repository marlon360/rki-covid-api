const axios = require('axios');
const { District } = require('../models');
const fs = require('fs');
const path = require('path');

module.exports.updateDistricts =  async () => {

    let districts = [];

    const response = await axios.get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,county,cases,deaths,cases_per_100k,cases_per_population,last_update,cases7_per_100k&outSR=4326&f=json");
    const apidata = response.data;

    for (const feature of apidata.features) {
        let district = new District();
        district.name = feature.attributes.GEN;
        district.county = feature.attributes.county;
        district.count = feature.attributes.cases;
        district.deaths = feature.attributes.deaths;
        district.weekIncidence = feature.attributes.cases7_per_100k;
        district.casesPer100k = feature.attributes.cases_per_100k;
        district.casesPerPopulation = feature.attributes.cases_per_population;

        districts.push(district);
    }

    let data = JSON.stringify({ lastUpdate: apidata.features[0].attributes.last_update, districts: districts });
    fs.writeFileSync(path.resolve(__dirname, '../cache/districts.json'), data, { flag: 'w' });
}