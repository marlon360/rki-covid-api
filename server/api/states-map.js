const path = require('path');

module.exports.statesMap =  async (req, res) => {

    let {transparent, theme} = req.query;
    let isTransparent = false;
    if (transparent != null) {
        isTransparent = true;
    }
    if (theme != "light" && theme != "dark") {
        theme = "light";
    }
    
    const filename = `states_map_${theme}${transparent ? '_transparent': ''}.png`;
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.resolve(__dirname, `../cache/${filename}`));
}