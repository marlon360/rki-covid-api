import { stringify } from "svgson";
import DistrictsMap from "../maps/districts.json";
import StatesMap from "../maps/states.json";
import { getDistrictsData } from "../data-requests/districts";
import { getStatesData } from "../data-requests/states";
import {
  getDistrictsFrozenIncidenceHistory,
  getStatesFrozenIncidenceHistory,
} from "../data-requests/frozen-incidence";
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
import {
  getStateAbbreviationById,
  getStateNameByAbbreviation,
  getStateIdByName,
  getMetaData,
} from "../utils";
import { MAM, MAMGrpd } from "./mapvideo";

export enum mapTypes {
  map = "withoutLegend",
  legendMap = "withLegend",
}

// Begin normal map responses
export async function DistrictsMapResponse(mapType: mapTypes = mapTypes.map) {
  const mapData = DistrictsMap;
  const metaData = await getMetaData();
  const districtsData = await getDistrictsData(metaData);

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

  if (mapType == mapTypes.legendMap) {
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
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

export async function StatesMapResponse(mapType: mapTypes = mapTypes.map) {
  const mapData = StatesMap;
  const metaData = await getMetaData();
  const statesData = await getStatesData(metaData);

  // create hashmap for faster access
  const statesDataHashMap = statesData.data.reduce(function (map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  // add fill color to every statess
  for (const statePathElement of mapData.children) {
    const idAttribute = statePathElement.attributes.id;
    const id = idAttribute.split("-")[1];
    const state = statesDataHashMap[id];
    const weekIncidence = (state.casesPerWeek / state.population) * 100000;
    statePathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));
  if (mapType == mapTypes.legendMap) {
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
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

// Begin history map respones
export async function DistrictsHistoryMapResponse(
  mapType: mapTypes = mapTypes.map,
  dateString: string
) {
  const date = new Date(dateString);
  const mapData = DistrictsMap;
  const metaData = await getMetaData();
  const districtsIncidenceHistory = await getDistrictsFrozenIncidenceHistory(
    metaData,
    null,
    null,
    date
  );

  // check if ALL historys are empty witch meens that this date isn`t available
  let check = 0;
  districtsIncidenceHistory.data.forEach((entry) => {
    check += entry.history.length == 0 ? 1 : 0;
  });
  if (check == districtsIncidenceHistory.data.length) {
    throw new Error(
      `Das Datum ${dateString} ist zu weit in der Vergangenheit!`
    );
  }

  // create hashmap for faster access
  const districtsIncidenceDataHashMap = districtsIncidenceHistory.data.reduce(
    function (map, obj) {
      map[obj.ags] = obj;
      return map;
    },
    {}
  );

  // add fill color to every districts
  for (const districtPathElement of mapData.children) {
    const idAttribute = districtPathElement.attributes.id;
    let id = idAttribute.split("-")[1];
    const district = districtsIncidenceDataHashMap[id];
    const weekIncidence =
      district.history.length == 0 ? 0 : district.history[0].weekIncidence;
    districtPathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  if (mapType == mapTypes.legendMap) {
    return sharp(
      getMapBackground(
        "7-Tage-Inzidenz der Landkreise",
        date,
        weekIncidenceColorRanges
      )
    )
      .composite([{ input: svgBuffer, top: 100, left: 180 }])
      .png({ quality: 75 })
      .toBuffer();
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

export async function StatesHistoryMapResponse(
  mapType: mapTypes = mapTypes.map,
  dateString: string
) {
  const date = new Date(dateString);
  const mapData = StatesMap;
  const metaData = await getMetaData();
  const statesIncidenceHistory = await getStatesFrozenIncidenceHistory(
    metaData,
    null,
    null,
    date
  );

  // check if ALL historys are empty witch meens that this date isn`t available
  let check = 0;
  statesIncidenceHistory.data.forEach((entry) => {
    check += entry.history.length == 0 ? 1 : 0;
  });
  if (check == statesIncidenceHistory.data.length) {
    throw new Error(
      `Das Datum ${dateString} ist zu weit in der Vergangenheit!`
    );
  }

  // create hashmap for faster access
  const statesIncidenceHistoryDataHashMap = statesIncidenceHistory.data.reduce(
    function (map, obj) {
      map[getStateIdByName(obj.name)] = obj;
      return map;
    },
    {}
  );

  // add fill color to every states
  for (const statePathElement of mapData.children) {
    const idAttribute = statePathElement.attributes.id;
    const id = idAttribute.split("-")[1];
    const state = statesIncidenceHistoryDataHashMap[id];
    const weekIncidence =
      state.history.length == 0 ? 0 : state.history[0].weekIncidence;
    statePathElement.attributes["fill"] = getColorForValue(
      weekIncidence,
      weekIncidenceColorRanges
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  if (mapType == mapTypes.legendMap) {
    return sharp(
      getMapBackground(
        "7-Tage-Inzidenz der Bundesländer",
        date,
        weekIncidenceColorRanges
      )
    )
      .composite([{ input: svgBuffer, top: 100, left: 180 }])
      .png({ quality: 75 })
      .toBuffer();
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

//Begin hospitalisation map resonses
export async function StatesHospitalizationMapResponse(
  mapType: mapTypes = mapTypes.map
) {
  const mapData = StatesMap;

  const hospitalizationData = await getHospitalizationData();
  const latestHospitalizationData =
    hospitalizationData.data[
      getLatestHospitalizationDataKey(hospitalizationData.data)
    ];

  // // add fill color to every states
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

  if (mapType == mapTypes.legendMap) {
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
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

export function IncidenceColorsResponse() {
  return {
    incidentRanges: weekIncidenceColorRanges,
  };
}

// Begin history hospitalisation maps
export async function StatesHospitalizationHistoryMapResponse(
  mapType: mapTypes = mapTypes.map,
  dateString: string
) {
  const date = new Date(dateString).toISOString();
  const mapData = StatesMap;

  const hospitalizationData = await getHospitalizationData();
  if (!hospitalizationData.data[date]) {
    throw new Error(
      `Das Datum ${dateString} ist nicht (zu weit in der Vergangenheit), oder noch nicht vorhanden. Die Hospitalisierungs Daten des RKI werden täglich meist zwischen 3 und 5 Uhr aktualisiert. Letzte Aktualisierung: ${hospitalizationData.lastUpdate}`
    );
  }
  const hospitalizationDataDayStates = hospitalizationData.data[date].states;

  // // add fill color to every districts
  for (const statePathElement of mapData.children) {
    const stateName = statePathElement.attributes.name;
    const state = hospitalizationDataDayStates[stateName];

    statePathElement.attributes["fill"] = getColorForValue(
      state.incidence7Days,
      hospitalizationIncidenceColorRanges
    );
    statePathElement.attributes["stroke"] = "#DBDBDB";
    statePathElement.attributes["stroke-width"] = "0.9";
  }

  const svgBuffer = Buffer.from(stringify(mapData));

  if (mapType == mapTypes.legendMap) {
    return sharp(
      getMapBackground(
        "Hospitalisierungsinzidenz",
        new Date(date),
        hospitalizationIncidenceColorRanges
      )
    )
      .composite([{ input: svgBuffer, top: 100, left: 180 }])
      .png({ quality: 75 })
      .toBuffer();
  } else {
    return sharp(svgBuffer).png({ quality: 75 }).toBuffer();
  }
}

export function getColorForValue(value: number, ranges: ColorRange[]): string {
  for (const range of ranges) {
    if (range.isValueInRange(value)) {
      return range.color;
    }
  }
  return "#FFF";
}

export function getMapBackground(
  hline: string,
  date: Date,
  rngs: ColorRange[],
  mAM?: MAM[],
  mAMG?: MAMGrpd
): Buffer {
  const dbrd = 32; // down border for the legend
  const lbrd = 12; // left border for the legend
  const recS = 30; // rectangle size of the range rectagles
  const bgrC = "#F4F8FB"; // background color
  const texC = "#010501"; // text color for legend
  const ySt = 1000 - recS; // y start position from the bottom, add new ranges above
  const dLoc = date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // localized lastUpdate string
  // the first part of svg
  let svg = `
    <svg width="850px" height="1000px" viewBox="0 0 850 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect fill="${bgrC}" x="0" y="0" width="850" height="1000"></rect>
        <text font-family="Arial" font-size="42" font-weight="bold" fill="${texC}">
          <tspan x="41" y="68">${hline}</tspan>
        </text>
        <text font-family="Arial" font-size="22" font-weight="normal" fill="${texC}">
          <tspan x="41" y="103">Stand: ${dLoc}</tspan>
        </text>
        <g transform="translate(${lbrd}, -${dbrd})">
          ${rngs.map((rng, ind) => {
            return `
          <g transform="translate(0, ${ySt - ind * 40})">
            <rect fill="${
              rng.color
            }" x="20" y="0" width="${recS}" height="${recS}"></rect>
            <text x="68" y="20" font-family="Arial" font-size="16" font-weight="normal" fill="${texC}">
              <tspan>${rng.toString()}</tspan>
            </text>
          </g>`;
          })}
          ${
            mAM != null
              ? mAM.map((ety, ind) => {
                  return `
          <g id="${ety.name}" transform="translate(0, ${
                    ySt - rngs.length * 40 - ind * 20
                  })">
            <circle fill="${ety.nCol}" cx="5" cy="${
                    15 - ind * 5
                  }" r="5"></circle>
            <text x="18" y="${
              19 - ind * 5
            }" font-family="Arial" font-size="12" font-weight="normal" fill="${texC}">
              <tspan>${ety.name} incidence is in this range</tspan>
            </text>
          </g>`;
                })
              : ""
          }
          ${
            mAMG != null
              ? Object.keys(mAMG).map((clr) => {
                  let iStr = "";
                  const frtY = 15 + (mAMG[clr].length - 1) * 5;
                  mAMG[clr].map((ety, ind) => {
                    iStr += `<g id="${ety.name}" transform="translate(0, ${
                      ySt - ety.rInd * 40
                    })">
            <circle fill="${ety.nCol}" cx="5" cy="${
                      frtY - ind * 10
                    }" r="5"></circle>
          </g>
          `;
                  });
                  return iStr;
                })
              : ""
          }
        </g>
        <rect fill="#A2D4FA" opacity="0.218688965" x="0" y="158" width="260" height="70"></rect>
        <text font-family="Arial" font-size="10" font-weight="normal" fill="${texC}">
          <tspan x="576" y="987">Quelle: Robert Koch-Institut (https://api.corona-zahlen.org)</tspan>
        </text>
        <text font-family="Arial" font-size="16" font-weight="normal" fill="${texC}">
          <tspan x="15" y="189">Grafik von</tspan>
          <tspan font-family="Arial-Bold, Arial" font-weight="bold"> Marlon Lückert</tspan>
        </text>
        <text font-family="Arial" font-size="16" font-weight="bold" fill="${texC}">
          <tspan x="15" y="211">https://api.corona-zahlen.org</tspan>
        </text>
      </g>
    </svg>`;
  return Buffer.from(svg);
}
