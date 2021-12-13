import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import {
  ColorRange,
  hospitalizationIncidenceColorRanges,
  weekIncidenceColorRanges,
} from "../configuration/colors";
import sharp from "sharp";
import {
  getHospitalizationData,
  getLatestHospitalizationDataKey,
} from "../data-requests/hospitalization";
import { getStateAbbreviationById, getStateNameByAbbreviation } from "../utils";

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
    districtPathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
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
    districtPathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(
    getMapBackground(
      "7-Tage-Inzidenz der Landkreise",
      districtsData.lastUpdate,
      weekIncidenceColorRanges
    )
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
    statePathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
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
    statePathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(
    getMapBackground(
      "7-Tage-Inzidenz der Bundesländer",
      statesData.lastUpdate,
      weekIncidenceColorRanges
    )
  )
    .composite([{ input: svgBuffer, top: 100, left: 180 }])
    .png({ quality: 75 })
    .toBuffer();
}

export async function StatesHospitalizationMapResponse() {
  const mapData = StatesMap;

  const hospitalizationData = await getHospitalizationData();
  const latestHospitalizationData =
    hospitalizationData.data[
      getLatestHospitalizationDataKey(hospitalizationData.data)
    ];

  // // add fill color to every districts
  for (const statePathElement of mapData.children) {
    const idAttribute = statePathElement.attributes.id;
    const id = idAttribute.split("-")[1];
    const state =
      latestHospitalizationData.states[
        getStateNameByAbbreviation(getStateAbbreviationById(parseInt(id)))
      ];

    statePathElement.attributes["fill"] = getColorForValue(
      state.incidence7Days,
      hospitalizationIncidenceColorRanges
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
}

export async function StatesHospitalizationLegendMapResponse() {
  const mapData = StatesMap;

  const hospitalizationData = await getHospitalizationData();
  const latestHospitalizationData =
    hospitalizationData.data[
      getLatestHospitalizationDataKey(hospitalizationData.data)
    ];

  // // add fill color to every districts
  for (const statePathElement of mapData.children) {
    const idAttribute = statePathElement.attributes.id;
    const id = idAttribute.split("-")[1];
    const state =
      latestHospitalizationData.states[
        getStateNameByAbbreviation(getStateAbbreviationById(parseInt(id)))
      ];

    statePathElement.attributes["fill"] = getColorForValue(
      state.incidence7Days,
      hospitalizationIncidenceColorRanges
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  return sharp(
    getMapBackground(
      "Hospitalisierungsinzidenz",
      hospitalizationData.lastUpdate,
      hospitalizationIncidenceColorRanges
    )
  )
    .composite([{ input: svgBuffer, top: 100, left: 180 }])
    .png({ quality: 75 })
    .toBuffer();
}

export function IncidenceColorsResponse() {
  return {
    incidentRanges: weekIncidenceColorRanges,
  };
}

function getColorForValue(value: number, ranges: ColorRange[]): string {
  for (const range of ranges) {
    if (range.isValueInRange(value)) {
      return range.color;
    }
  }
  return "#FFF";
}

function getMapBackground(
  headline: string,
  lastUpdate: Date,
  ranges: ColorRange[]
): Buffer {
  const border = 32; // for the legend, left and down
  const rectsize = 30; //x and y of the rects
  const yStartPosition = 1000 - rectsize; // start position from the bottom, add new ranges above
  const lastUpdateLocaleString = lastUpdate.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // localized lastUpdate string
  // the first part of svg
  let svg = `
    <svg width="850px" height="1000px" viewBox="0 0 850 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect fill="#F4F8FB" x="0" y="0" width="850" height="1000"></rect>
        <text id="7-Tage-Inzidenz-der" font-family="Helvetica-Bold, Helvetica" font-size="42" font-weight="bold" fill="#010501">
          <tspan x="41" y="68">${headline}</tspan>
        </text>
        <text id="Stand:-22.11.2021" font-family="Helvetica" font-size="22" font-weight="normal" fill="#010501">
          <tspan x="41" y="103">Stand: ${lastUpdateLocaleString}</tspan>
        </text>
        <g id="Legend" transform="translate(${border}, -${border})">
        ${ranges.map((range, index) => {
          return `
          <g transform="translate(0, ${yStartPosition - index * 40})">
            <rect fill="${
              range.color
            }" x="0" y="0" width="30" height="30"></rect>
            <text x="48" y="20" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
              <tspan>${range.toString()}</tspan>
            </text>
          </g>
          `;
        })}
        </g>
        <rect id="Rectangle" fill="#A2D4FA" opacity="0.218688965" x="0" y="158" width="260" height="70"></rect>
        <text id="Quelle:-Robert-Koch-" font-family="Helvetica" font-size="10" font-weight="normal" fill="#010501">
          <tspan x="576" y="987">Quelle: Robert Koch-Institut (https://api.corona-zahlen.org)</tspan>
        </text>
        <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#243645">
          <tspan x="15" y="189">Grafik von</tspan>
          <tspan font-family="Helvetica-Bold, Helvetica" font-weight="bold"> Marlon Lückert</tspan>
        </text>
        <text font-family="Helvetica-Bold, Helvetica" font-size="16" font-weight="bold" fill="#243645">
          <tspan x="15" y="211">https://api.corona-zahlen.org</tspan>
        </text>
      </g>
    </svg>`;
  return Buffer.from(svg);
}
