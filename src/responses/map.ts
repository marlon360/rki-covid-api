import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import { weekIncidenceColorRanges } from "../configuration/colors";
import sharp from "sharp";

export async function DistrictsMapResponse(
  legend: boolean = false
): Promise<Buffer> {
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
    districtPathElement.attributes["fill"] =
      getColorForWeekIncidence(weekIncidence);
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  if (legend) {
    // map with legend is requested
    return sharp(
      getMapBackground(
        "7-Tage-Inzidenz der Landkreise",
        districtsData.lastUpdate,
        weekIncidenceColorRanges.ranges
      )
    )
      .composite([{ input: svgBuffer, top: 100, left: 180 }])
      .png({ quality: 75 })
      .toBuffer();
  } else {
    // map without legend is requested
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

export async function StatesMapResponse(
  legend: boolean = false
): Promise<Buffer> {
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

  if (legend) {
    return sharp(
      getMapBackground(
        "7-Tage-Inzidenz der Bundesländer",
        statesData.lastUpdate,
        weekIncidenceColorRanges.ranges
      )
    )
      .composite([{ input: svgBuffer, top: 100, left: 180 }])
      .png({ quality: 75 })
      .toBuffer();
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
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

function getMapBackground(
  headline: string,
  lastUpdate: Date,
  ranges: any
): Buffer {
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
          <rect fill="${
            ranges[0].color
          }" x="0" y="0" width="30" height="30"></rect>
          <rect fill="${
            ranges[1].color
          }" x="0" y="40" width="30" height="30"></rect>
          <rect fill="${
            ranges[2].color
          }" x="0" y="80" width="30" height="30"></rect>
          <rect fill="${
            ranges[3].color
          }" x="0" y="120" width="30" height="30"></rect>
          <rect fill="${
            ranges[4].color
          }" x="0" y="160" width="30" height="30"></rect>
          <rect fill="${
            ranges[5].color
          }" x="0" y="200" width="30" height="30"></rect>
          <rect fill="${
            ranges[6].color
          }" x="0" y="240" width="30" height="30"></rect>
          <rect fill="${
            ranges[7].color
          }" x="0" y="280" width="30" height="30"></rect>
          <rect fill="${
            ranges[8].color
          }" x="0" y="320" width="30" height="30"></rect>
          <rect fill="${
            ranges[9].color
          }" x="0" y="360" width="30" height="30"></rect>
          <rect fill="${
            ranges[10].color
          }" x="0" y="400" width="30" height="30"></rect>
          <text x="48" y="20" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>&lt; ${ranges[0].max}</tspan>
          </text>
          <text x="48" y="60" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[1].min} - &lt; ${ranges[1].max}</tspan>
          </text>
          <text x="48" y="100" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[2].min} - &lt; ${ranges[2].max}</tspan>
          </text>
          <text x="48" y="140" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[3].min} - &lt; ${ranges[3].max}</tspan>
          </text>
          <text x="48" y="180" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[4].min} - &lt; ${ranges[4].max}</tspan>
          </text>
          <text x="48" y="220" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[5].min} - &lt; ${ranges[5].max}</tspan>
          </text>
          <text x="48" y="260" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[6].min} - &lt; ${ranges[6].max}</tspan>
          </text>
          <text x="48" y="300" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[7].min} - &lt; ${ranges[7].max}</tspan>
          </text>
          <text x="48" y="340" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[8].min} - &lt; ${ranges[8].max}</tspan>
          </text>
          <text x="48" y="380" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>${ranges[9].min} - &lt; ${ranges[9].max}</tspan>
          </text>
          <text x="48" y="420" font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
            <tspan>&gt; ${ranges[10].min}</tspan>
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
