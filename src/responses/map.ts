import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import { weekIncidenceColorRanges } from "../configuration/colors";
import sharp from "sharp";

export async function DistrictsMapResponse() {
  const mapData = DistrictsMap;

  const districtsData = await getDistrictsData();

  // create hashmap for faster access
  const districtsDataHashMap = districtsData.data.reduce(function (map, obj) {
    map[obj.ags] = obj;
    return map;
  }, {});

  // add fill color to every districts
  for (const districtPathElement of mapData.children) {
    const idAttribute = districtPathElement.attributes.id;
    const id = idAttribute.split("-")[1];
    const district = districtsDataHashMap[id];
    const weekIncidence =
      (district.casesPerWeek / district.population) * 100000;
    districtPathElement.attributes["fill"] = getColorForWeekIncidence(
      weekIncidence
    );
    districtPathElement.attributes["stroke"] = "#DBDBDB";
    districtPathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(svgBuffer).png({ quality: 5 }).toBuffer();
}

export async function StatesMapResponse() {
  const mapData = StatesMap;

  const statesData = await getStatesData();

  // create hashmap for faster access
  const statesDataHashMap = statesData.data.reduce(function (map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  // add fill color to every districts
  for (const statePathElement of mapData.children) {
    const idAttribute = statePathElement.attributes.id;
    const id = idAttribute.split("-")[1];
    const district = statesDataHashMap[id];
    const weekIncidence =
      (district.casesPerWeek / district.population) * 100000;
    statePathElement.attributes["fill"] = getColorForWeekIncidence(
      weekIncidence
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(svgBuffer).png({ quality: 5 }).toBuffer();
}

export function IncidenceColorsResponse() {
  return {
    incidentRanges: weekIncidenceColorRanges.ranges,
  };
}

function getColorForWeekIncidence(weekIncidence: number): string {
  for (const range of weekIncidenceColorRanges.ranges) {
    if (weekIncidence >= range.min && weekIncidence < range.max) {
      return range.color;
    }
  }
  return "#FFF";
}
