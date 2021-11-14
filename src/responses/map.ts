import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import { weekIncidenceColorRanges } from "../configuration/colors";
import sharp from "sharp";

export async function DistrictsMapResponse(
  colormap: string,
  legend: boolean
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
    districtPathElement.attributes["fill"] = getColorForWeekIncidence(
      weekIncidence,
      colormap
    );
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  if (legend) {
    // map with legend is requested
    return sharp(
      getMapBackground(
        "7-Tage-Inzidenz der Landkreise",
        districtsData.lastUpdate,
        weekIncidenceColorRanges[colormap].ranges
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
  colormap: string,
  legend: boolean
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
    statePathElement.attributes["fill"] = getColorForWeekIncidence(
      weekIncidence,
      colormap
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  if (legend) {
    return sharp(
      getMapBackground(
        "7-Tage-Inzidenz der Bundesländer",
        statesData.lastUpdate,
        weekIncidenceColorRanges[colormap].ranges
      )
    )
      .composite([{ input: svgBuffer, top: 100, left: 180 }])
      .png({ quality: 75 })
      .toBuffer();
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

export function IncidenceColorsResponse(colormap: string) {
  return {
    incidentRanges: weekIncidenceColorRanges[colormap].ranges,
  };
}

function getColorForWeekIncidence(
  weekIncidence: number,
  colormap: string
): string {
  for (const range of weekIncidenceColorRanges[colormap].ranges) {
    if (
      (weekIncidence >= range.min && weekIncidence < range.max) ||
      (weekIncidence == range.min && weekIncidence == range.max)
    ) {
      return range.color;
    }
  }
  return "#FFF";
}

function getMapBackground(
  headline: string,
  lastUpdate: Date,
  ranges: Object
): Buffer {
  // for better readability calculate all values outside of the string
  const overlayHigh = 1000;
  const rangeKeys = Object.keys(ranges);
  const border = 30;
  const colorRectHigh = 30;
  const countRanges = rangeKeys.length;
  const lastUpdateLocaleString = lastUpdate.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  let svg = `
    <svg width="850px" height="${overlayHigh}px" viewBox="0 0 850 ${overlayHigh}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect fill="#F4F8FB" x="0" y="0" width="850" height="${overlayHigh}"></rect>
        <text id="Headline" font-family="Helvetica-Bold, Helvetica" font-size="42" font-weight="bold" fill="#010501">
          <tspan x="41" y="68">${headline}</tspan>
        </text>
        <text id="Datenstand" font-family="Helvetica" font-size="22" font-weight="normal" fill="#010501">
          <tspan x="41" y="103">Stand: ${lastUpdateLocaleString}</tspan>
        </text>
        <g id="Legend" transform="translate(${border}, -${border})">`;
  const highKey = countRanges - 1;
  for (const key in rangeKeys) {
    const iKey = parseInt(key);
    const yPosRect = overlayHigh - colorRectHigh - iKey * 40;
    const yPosText = yPosRect + colorRectHigh / 2;
    const range =
      ranges[key].min == ranges[key].max
        ? "keine Fälle übermittelt"
        : iKey == highKey
        ? "&gt; " + ranges[key].min
        : "&gt; " + ranges[key].min + " - " + ranges[key].max;
    svg += `
          <g id="${iKey + 1}.Bereich">
            <rect fill="${
              ranges[key].color
            }" x="0" y="${yPosRect}" rx="5" ry="5" width="30" height="30" fill-opacity="0.98" fill-rule="evenodd"></rect>
            <text font-family="Helvetica" font-size="16" font-weight="normal" fill="#010501">
              <tspan x="40" y="${yPosText}" dy=".25em">${range}</tspan>
            </text>
          </g>`;
  }
  svg += `
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
