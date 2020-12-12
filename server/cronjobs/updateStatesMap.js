const axios = require('axios');
const generateXML = require('@mapbox/geojson-mapnikify');
var mapnik = require('mapnik');
// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();
var Jimp = require("jimp");
const fs = require('fs');
const path = require('path');

const generateXMLPromise = (geojson, retina) => {
    return new Promise((resolve, reject) => {
        generateXML(geojson, retina, (err, xml) => {
            if (err) {
                reject(err);
            } else {
                resolve(xml)
            }
        })
    })
};

const mapFromString = (map, xml) => {
    return new Promise((resolve, reject) => {
        map.fromString(xml, (err, map) => {
            if (err) {
                reject(err);
            } else {
                resolve(map)
            }
        })
    })
};

const renderMap = (map, image) => {
    return new Promise((resolve, reject) => {
        map.render(image, (err, image) => {
            if (err) {
                reject(err);
            } else {
                resolve(image)
            }
        })
    })
};

const encodeImage = (image, format) => {
    return new Promise((resolve, reject) => {
        image.encode(format, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer)
            }
        })
    })
};

let font16_white, font12_black, font16_black;

async function loadFonts() {
    if (font16_black == null) {
        font16_black = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    }
    if (font12_black == null) {
        font12_black = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
    }
    if (font16_white == null) {
        font16_white = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    }
}

async function updateStatesMap() {
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson");
    const geojson = repsonse.data;


    const options = [
       {
           stroke: "#BBB",
           fontColor: "white",
           transparent: true,
           fileName: "states_map_dark_transparent"
       },
       {
           stroke: "#BBB",
           fontColor: "white",
           background: "black",
           fileName: "states_map_dark"
       },
       {
           stroke: "#888",
           fontColor: "black",
           transparent: true,
           fileName: "states_map_light_transparent"
       },
       {
           stroke: "#888",
           fontColor: "black",
           background: "white",
           fileName: "states_map_light"
       },
    
    ]

    for (const option of options) {
        const map = await createMap(geojson, option)
        fs.writeFileSync(path.resolve(__dirname, `../cache/${option.fileName}.png`), map, { flag: 'w' });
        console.log("Created: " + option.fileName);
    }


}

async function createMap(geojson, options) {
    for (const feature of geojson.features) {
        feature.properties.fill = mapCasesToColor(feature.properties.faelle_100000_EW);
        feature.properties["stroke"] = options.stroke || "#BBB";
        feature.properties["stroke-opacity"] = 0.5;
        feature.properties["stroke-width"] = 0.4;
        feature.properties["fill-opacity"] = 1;
    }
    const lastUpdate = geojson.features[0].properties.Aktualisierung;

    const xml = await generateXMLPromise(geojson, true);

    let map = new mapnik.Map(1128, 1024);
    map = await mapFromString(map, xml);
    
    const transparent = options.transparent != null ? options.transparent : false;
    if (!transparent) {
        map.background = new mapnik.Color(options.background || "white");
    }
    map.zoomAll();
    let image = new mapnik.Image(1024, 1024);
    image = await renderMap(map, image);

    const buffer = await encodeImage(image, 'png');

    const jimpImage = await Jimp.read(buffer);

    await loadFonts();
    let font, font12;
    if (options.fontColor == "white") {                        
        font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
        font12 = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    } else {
        font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        font12 = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
    }

    drawLegend(jimpImage, font, 20, 100);

    jimpImage.print(font, 10, 30, "COVID-19-Fälle/100.000 Einwohner");
    jimpImage.print(font12, 10, 820, "Basierend auf Daten des Robert Koch-Instituts.");
    jimpImage.print(font12, 10, 840, "Grafik von Marlon Lueckert.");
    jimpImage.print(font12, 10, 860, "https://github.com/marlon360/rki-covid-api");
    jimpImage.print(font12, 10, 50, "Stand vom " + lastUpdate);

    const resultBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);
    return resultBuffer;

}

function makeIteratorThatFillsWithColor(color) {
    return function (x, y, offset) {
      this.bitmap.data.writeUInt32BE(color, offset, true);
    }
  };

function drawLegend(image, font, startX, startY) {
    for (const range of rangeSettings.ranges) {
        image.scan(startX, startY, 30, 30, makeIteratorThatFillsWithColor(hexStringToHex(range.color)));
        image.print(font, startX + 40, startY + 5, rangeToString(range));
        startY = startY += 35;
    }
}

function hexStringToHex(hex) {
    return parseInt(hex.replace(/^#/, '') + "FF", 16)
}

function rangeToString(range) {
    if (range.min == 0) {
        return `bis unter ${range.max}`;
    } else if (range.max == Infinity) {
        return `${range.min} und mehr`;
    } else {
        return `${range.min} bis unter ${range.max}`;
    }
}

const rangeSettings = {
    ranges: [
        {
            min: 0,
            max: 544,
            color: "#CACDD8"
        },
        {
            min: 544,
            max: 886,
            color: "#A8BACA"
        },
        {
            min: 886,
            max: 1051,
            color: "#88ACBE"
        },
        {
            min: 1051,
            max: 1372,
            color: "#5C94B5"
        },
        {
            min: 1372,
            max: 1564,
            color: "#2D70A0"
        },
        {
            min: 1564,
            max: Infinity,
            color: "#0D4785"
        },
    ]
}

function mapCasesToColor(cases) {
    for (const range of rangeSettings.ranges) {
        if (cases >= range.min && cases < range.max) {
            return range.color;
        }
    }
    return "#FFFFFF"
}

module.exports.updateStatesMap =  updateStatesMap;