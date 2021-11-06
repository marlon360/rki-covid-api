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
    let id = idAttribute.split("-")[1];
    const district = districtsDataHashMap[id];
    const weekIncidence =
      (district.casesPerWeek / district.population) * 100000;
    districtPathElement.attributes["fill"] =
      getColorForWeekIncidence(weekIncidence);
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
}

export async function DistrictsLegendMapResponse() {
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
    let id = idAttribute.split("-")[1];
    const district = districtsDataHashMap[id];
    const weekIncidence =
      (district.casesPerWeek / district.population) * 100000;
    districtPathElement.attributes["fill"] =
      getColorForWeekIncidence(weekIncidence);
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(
    getMapBackground("7-Tage-Inzidenz der Landkreise", districtsData.lastUpdate)
  )
    .composite([{ input: svgBuffer, top: 100, left: 180 }])
    .png({ quality: 75 })
    .toBuffer();
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
    statePathElement.attributes["fill"] =
      getColorForWeekIncidence(weekIncidence);
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
}

export async function StatesLegendMapResponse() {
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
    statePathElement.attributes["fill"] =
      getColorForWeekIncidence(weekIncidence);
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(
    getMapBackground("7-Tage-Inzidenz der Bundesländer", statesData.lastUpdate)
  )
    .composite([{ input: svgBuffer, top: 100, left: 180 }])
    .png({ quality: 75 })
    .toBuffer();
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

function getMapBackground(headline: string, lastUpdate: Date): Buffer {
  return Buffer.from(`
    <svg width="850px" height="1000px" viewBox="0 0 850 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <rect fill="#F4F8FB" x="0" y="0" width="850" height="1000"></rect>
          <text id="7-Tage-Inzidenz-der" font-family="Helvetica-Bold, Helvetica" font-size="42" font-weight="bold" fill="#010501">
              <tspan x="41" y="68">${headline}</tspan>
          </text>
          <text id="Stand:-22.11.2021" font-family="Helvetica" font-size="22" font-weight="normal" fill="#010501">
              <tspan x="41" y="103">Stand: ${lastUpdate.toLocaleDateString(
                "de-DE",
                { year: "numeric", month: "2-digit", day: "2-digit" }
              )}</tspan>
          </text>
          <g transform="translate(32.000000, 536.000000)">
              <rect fill="#D1D1D1" x="0" y="0" width="30" height="30"></rect>
              <rect fill="#7FD38D" x="0" y="40" width="30" height="30"></rect>
              <rect fill="#FEFFB1" x="0" y="80" width="30" height="30"></rect>
              <rect fill="#FECA81" x="0" y="120" width="30" height="30"></rect>
              <rect fill="#F08A4B" x="0" y="160" width="30" height="30"></rect>
              <rect fill="#EB1A1D" x="0" y="200" width="30" height="30"></rect>
              <rect fill="#AB1316" x="0" y="240" width="30" height="30"></rect>
              <rect fill="#B374DD" x="0" y="280" width="30" height="30"></rect>
              <rect fill="#5B189B" x="0" y="320" width="30" height="30"></rect>
              <rect fill="#543D35" x="0" y="360" width="30" height="30"></rect>
              <rect fill="#020003" x="0" y="400" width="30" height="30"></rect>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="19">&lt; 1</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="59">1 - 15</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="99">16 - 25</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="145">26 - 35</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="182">36 - 50</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="223">51 - 100</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="262">101 - 200</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="302">201 - 350</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="421">&gt; 1000</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="381">501 - 1000</tspan>
              </text>
              <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
                  <tspan x="48" y="341">351 - 500</tspan>
              </text>
          </g>
          <rect id="Rectangle" fill="#A2D4FA" opacity="0.218688965" x="0" y="158" width="260" height="70"></rect>
          <text id="Quelle:-Robert-Koch-" font-family="Helvetica" font-size="10" font-weight="normal" fill="#010501">
              <tspan x="576" y="987">Quelle: Robert Koch-Institut (https://api.corona-zahlen.org)</tspan>
          </text>
          <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#243645">
              <tspan x="15" y="189">Grafik von</tspan>
              <tspan x="92" y="189" font-family="Helvetica-Bold, Helvetica" font-weight="bold"> Marlon Lückert</tspan>
          </text>
          <text font-family="Helvetica-Bold, Helvetica" font-size="16" font-weight="bold" fill="#243645">
              <tspan x="15" y="211">https://api.corona-zahlen.org</tspan>
          </text>
      </g>
  </svg>
  `);
}
