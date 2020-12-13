const path = require('path');

async function districtsMap(req, res) {

    let {transparent, theme} = req.query;
    let isTransparent = false;
    if (transparent != null) {
        isTransparent = true;
    }
    if (theme != "light" && theme != "dark") {
        theme = "light";
    }
    const filename = `districts_map_${theme}${isTransparent ? '_transparent': ''}.png`;
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.resolve(__dirname, `../cache/${filename}`));
}

module.exports.districtsMap = districtsMap;
