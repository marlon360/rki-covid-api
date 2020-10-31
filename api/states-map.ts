import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import generateXML from '@mapbox/geojson-mapnikify';
var mapnik = require('mapnik');
var Jimp = require("jimp");

const rangeSettings = {
    ranges: [
        {
            min: 0,
            max: 231,
            color: "#CACDD8"
        },
        {
            min: 231,
            max: 326,
            color: "#A8BACA"
        },
        {
            min: 326,
            max: 491,
            color: "#88ACBE"
        },
        {
            min: 491,
            max: 652,
            color: "#5C94B5"
        },
        {
            min: 652,
            max: 738,
            color: "#2D70A0"
        },
        {
            min: 738,
            max: Infinity,
            color: "#0D4785"
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
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson");
    const geojson = repsonse.data;

    for (const feature of geojson.features) {
        feature.properties.fill = mapCasesToColor(feature.properties.faelle_100000_EW);
        feature.properties["stroke-opacity"] = 0.8;
        feature.properties["stroke-width"] = 1;
        feature.properties["fill-opacity"] = 1;
    }

    const lastUpdate = geojson.features[0].properties.Aktualisierung;

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
                im.encode('png', async (err, mapbuffer) => {
                    if (err) throw err;
                    const image = await Jimp.read(mapbuffer);
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                    const font12 = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);

                    drawLegend(image, font, 20, 100);

                    image.print(font, 10, 30, "COVID-19-Fälle/100.000 Einwohner");
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
    if (range.min == 0) {
        return `bis unter ${range.max}`;
    } else if (range.max == Infinity) {
        return `${range.min} und mehr`;
    } else {
        return `${range.min} bis unter ${range.max}`;
    }
}
