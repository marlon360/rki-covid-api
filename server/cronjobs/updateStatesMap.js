const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.updateStatesMap =  async () => {
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson");
    const geojson = repsonse.data;

    let data = JSON.stringify(geojson);
    fs.writeFileSync(path.resolve(__dirname, '../cache/statesMap.json'), data, { flag: 'w' });
}
