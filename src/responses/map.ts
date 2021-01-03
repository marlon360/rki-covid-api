import { stringify } from 'svgson';
import DistrictsMap from '../maps/districts.json';
import { getDistrictsData } from '../data-requests/districts';
import { weekIncidenceColorRanges } from '../configuration/colors'
import sharp from 'sharp'; 

export async function DistrictsMapResponse() {

    const mapData = DistrictsMap;

    const districtsData = await getDistrictsData();
    
    // create hashmap for faster access
    const districtsDataHashMap = districtsData.data.reduce(function(map, obj) {
        map[obj.ags] = obj;
        return map;
    }, {});

    // add fill color to every districts
    for (const districtPathElement of mapData.children) {
        const idAttribute = districtPathElement.attributes.id;
        const id = idAttribute.split("-")[1];
        const district = districtsDataHashMap[id];
        const weekIncidence = district.casesPerWeek / district.population * 100000;
        districtPathElement.attributes["fill"] = getColorForWeekIncidence(weekIncidence);
        districtPathElement.attributes["stroke"] = "#DBDBDB";
        districtPathElement.attributes["stroke-width"] = "0.9";
    }

    const svgBuffer = Buffer.from(
        stringify(mapData)
    );    

    return sharp(svgBuffer).png({ quality: 1 }).toBuffer();
}

function getColorForWeekIncidence(weekIncidence: number): string {
    for (const range of weekIncidenceColorRanges.ranges) {
        if (weekIncidence >= range.min && weekIncidence < range.max) {
            return range.color
        }
    }
    return "#FFF";
}