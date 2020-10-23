import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import generateXML from '@mapbox/geojson-mapnikify';
var mapnik = require('mapnik');
var Jimp = require("jimp");

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
                im.encode('png', function(err,buffer) {
                    if (err) throw err;
                    Jimp.read(buffer).then(image => {
                        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) => {
                            image.print(font, 10, 30, "COVID-19-Fälle/100.000 Einwohner");
                            image.print(font, 600, 1006, "Stand vom " + lastUpdate);
                            image.getBufferAsync(Jimp.MIME_PNG).then((buffer) => {
                                res.setHeader('Content-Type', Jimp.MIME_PNG);
                                res.send(buffer);
                            })
                        });
                    })
                });

            });
        });
    })

}

function mapCasesToColor(cases: number): String {
    if (cases < 166) {
        return "#CACDD8"
    }
    if (cases < 296) {
        return "#A8BACA"
    }
    if (cases < 371) {
        return "#88ACBE"
    }
    if (cases < 492) {
        return "#5C94B5"
    }
    if (cases < 586) {
        return "#2D70A0"
    }
    return "#0D4785";
    
}
