import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import generateXML from '@mapbox/geojson-mapnikify';
var mapnik = require('mapnik');
var Jimp = require("jimp");

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
            max: Infinity,
            color: "#58033C"
        },
    ]
}

function mapCasesToColor(cases: number): String {
    for (const range of rangeSettings.ranges) {
        if (cases >= range.min && cases < range.max) {
            return range.color;
        }
    }
    return "#FFFFFF"
}

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson");
    const geojson = repsonse.data;

    for (const feature of geojson.features) {
        feature.properties.fill = mapCasesToColor(feature.properties.cases7_per_100k);
        feature.properties["stroke"] = "#888";
        feature.properties["stroke-opacity"] = 0.5;
        feature.properties["stroke-width"] = 0.4;
        feature.properties["fill-opacity"] = 1;
    }

    const lastUpdate = geojson.features[0].properties.last_update;

    generateXML(geojson, true, (err, xml) => {

        // register fonts and datasource plugins
        mapnik.register_default_fonts();
        mapnik.register_default_input_plugins();

        var map = new mapnik.Map(1024, 1024);
        map.fromString(xml, function(err,map) {
            if (err) throw err;
            map.background = new mapnik.Color('white');
            map.zoomAll();
            var im = new mapnik.Image(1024, 1024);
            map.render(im, function(err,im) {
                if (err) throw err;
                im.encode('png', async function(err, mapbuffer) {
                    if (err) throw err;
                    const image = await Jimp.read(mapbuffer);
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                    const font12 = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);

                    drawLegend(image, font, 20, 100);

                    image.print(font, 10, 30, "Fälle der letzten 7 Tage/100.000 Einwohner");
                    image.print(font12, 10, 820, "Basierend auf Daten des Robert Koch-Instituts.");
                    image.print(font12, 10, 840, "Grafik von Marlon Lueckert.");
                    image.print(font12, 10, 860, "https://github.com/marlon360/rki-covid-api");
                    image.print(font12, 10, 50, "Stand vom " + lastUpdate);
                    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
                    res.setHeader('Content-Type', Jimp.MIME_PNG);
                    res.send(buffer);
                });

            });
        });
    })

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

function hexStringToHex(hex: string): number {
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
