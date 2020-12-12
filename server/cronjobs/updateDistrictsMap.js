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

async function updateDistrictsMap() {
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson");
    const geojson = repsonse.data;


    const options = [
       {
           stroke: "#BBB",
           fontColor: "white",
           transparent: true,
           fileName: "districts_map_dark_transparent"
       },
       {
           stroke: "#BBB",
           fontColor: "white",
           background: "black",
           fileName: "districts_map_dark"
       },
       {
           stroke: "#888",
           fontColor: "black",
           transparent: true,
           fileName: "districts_map_light_transparent"
       },
       {
           stroke: "#888",
           fontColor: "black",
           background: "white",
           fileName: "districts_map_light"
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
        feature.properties.fill = mapCasesToColor(feature.properties.cases7_per_100k);
        feature.properties["stroke"] = options.stroke || "#BBB";
        feature.properties["stroke-opacity"] = 0.5;
        feature.properties["stroke-width"] = 0.4;
        feature.properties["fill-opacity"] = 1;
    }
    const lastUpdate = geojson.features[0].properties.last_update;

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

    jimpImage.print(font, 10, 30, "Fälle der letzten 7 Tage/100.000 Einwohner");
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
    if (range.min == range.max) {
        return `${range.max}`;
    } else if (range.max == Infinity) {
        return `> ${range.min}`;
    } else {
        return `> ${range.min} <= ${range.max}`;
    }
}

const rangeSettings = {
    ranges: [
        {
            min: 0,
            max: 5,
            color: "#D8D8D8"
        },
        {
            min: 5,
            max: 20,
            color: "#D8D4AE"
        },
        {
            min: 20,
            max: 35,
            color: "#D8D385"
        },
        {
            min: 35,
            max: 50,
            color: "#D39805"
        },
        {
            min: 50,
            max: 100,
            color: "#B32632"
        },
        {
            min: 100,
            max: 200,
            color: "#900519"
        },
        {
            min: 200,
            max: 500,
            color: "#58033C"
        },
        {
            min: 500,
            max: Infinity,
            color: "#EE008F"
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

module.exports.updateDistrictsMap =  updateDistrictsMap;