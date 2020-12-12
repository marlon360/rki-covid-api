const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.updateDistrictsMap =  async () => {
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson");
    const geojson = repsonse.data;

    let data = JSON.stringify(geojson);
    fs.writeFileSync(path.resolve(__dirname, '../cache/districtsMap.json'), data, { flag: 'w' });
}
