import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';
import generateXML from '@mapbox/geojson-mapnikify';
var mapnik = require('mapnik');
var Jimp = require("jimp");

export default async (req: NowRequest, res: NowResponse) => {

    res.setHeader('Cache-Control', 's-maxage=3600');
    
    const repsonse = await axios.get("https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson");
    const geojson = repsonse.data;

    for (const feature of geojson.features) {
        feature.properties.fill = mapCasesToColor(feature.properties.cases7_per_100k);
        feature.properties["stroke-opacity"] = 0.8;
        feature.properties["stroke-width"] = 0.5;
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
                im.encode('png', function(err,buffer) {
                    if (err) throw err;
                    Jimp.read(buffer).then(image => {
                        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) => {
                            image.print(font, 10, 30, "Fälle der letzten 7 Tage/100.000 Einwohner");
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
    if (cases == 0) {
        return "#D8D8D8"
    }
    if (cases <= 5) {
        return "#D8D4AE"
    }
    if (cases <= 25) {
        return "#D8D385"
    }
    if (cases <= 50) {
        return "#D39805"
    }
    if (cases <= 100) {
        return "#B32632"
    }
    return "#900519";
    
}
