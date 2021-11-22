export class ColorRange {
  min: number; // minimum number of range (number not included >)
  max: number; // maximum number of range (number included <=)
  color: string; // the color on the map
  label?: string; // the label of this range on the legend
  compareFn?: (value: number, range: ColorRange) => boolean; // how to evaluate if a value is in the range

  constructor(options: {
    min: number;
    max: number;
    color: string;
    label?: string;
    compareFn?: (value: number, range: ColorRange) => boolean;
  }) {
    this.min = options.min;
    this.max = options.max;
    this.color = options.color;
    this.label = options.label;
    this.compareFn = options.compareFn;
  }

  // this string is displayed in the legend (can be overwritten with the label option)
  toString() {
    if (this.label) {
      return this.label;
    } else {
      if (this.max === Infinity) {
        return `> ${this.min}`;
      } else {
        return `> ${this.min} - ${this.max}`;
      }
    }
  }

  // this function is used to evaluate if a value is inside this range
  // can be overwritten with the compareFn option e.g. for a range that needs an exact match of a number
  isValueInRange(value: number): boolean {
    if (this.compareFn) {
      return this.compareFn(value, this);
    } else {
      return value > this.min && value <= this.max;
    }
  }
}

interface weekIncidenceColorRanges {
  [paletteType: string]: {
    [palette: string]: ColorRange[];
  };
}

export const weekIncidenceColorRanges: weekIncidenceColorRanges = {
  incidenceMap: {
    default: [
      new ColorRange({
        min: 0,
        max: 0,
        color: "#E2E2E2",
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      }),
      new ColorRange({
        min: 0,
        max: 1,
        color: "#25BA94",
      }),
      new ColorRange({
        min: 1,
        max: 15,
        color: "#76D985",
      }),
      new ColorRange({
        min: 15,
        max: 25,
        color: "#FFFFA8",
      }),
      new ColorRange({
        min: 25,
        max: 35,
        color: "#FECA81",
      }),
      new ColorRange({
        min: 35,
        max: 50,
        color: "#F1894A",
      }),
      new ColorRange({
        min: 50,
        max: 100,
        color: "#F21620",
      }),
      new ColorRange({
        min: 100,
        max: 200,
        color: "#A9141A",
      }),
      new ColorRange({
        min: 200,
        max: 350,
        color: "#B275DD",
      }),
      new ColorRange({
        min: 350,
        max: 500,
        color: "#5D179B",
      }),
      new ColorRange({
        min: 500,
        max: 1000,
        color: "#17179B",
      }),
      new ColorRange({
        min: 1000,
        max: 1500,
        color: "#68463B",
      }),
      new ColorRange({
        min: 1500,
        max: 2500,
        color: "#6D6D6D",
      }),
      new ColorRange({
        min: 2500,
        max: Infinity,
        color: "#020003",
      }),
    ],
    old: [
      new ColorRange({
        min: 0,
        max: 0,
        color: "#CDCDCD",
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      }),
      new ColorRange({
        min: 0,
        max: 1,
        color: "#3BEB47",
      }),
      new ColorRange({
        min: 1,
        max: 15,
        color: "#7FD38D",
      }),
      new ColorRange({
        min: 15,
        max: 25,
        color: "#FEFFB1",
      }),
      new ColorRange({
        min: 25,
        max: 35,
        color: "#FECA81",
      }),
      new ColorRange({
        min: 35,
        max: 50,
        color: "#F08A4B",
      }),
      new ColorRange({
        min: 50,
        max: 100,
        color: "#EB1A1D",
      }),
      new ColorRange({
        min: 100,
        max: 200,
        color: "#AB1316",
      }),
      new ColorRange({
        min: 200,
        max: 350,
        color: "#B374DD",
      }),
      new ColorRange({
        min: 350,
        max: 500,
        color: "#5B189B",
      }),
      new ColorRange({
        min: 500,
        max: 1000,
        color: "#543D35",
      }),
      new ColorRange({
        min: 1000,
        max: Infinity,
        color: "#020003",
      }),
    ],
    rki: [
      new ColorRange({
        min: 0,
        max: 0,
        color: "#CDCDCD",
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      }),
      new ColorRange({
        min: 0,
        max: 5,
        color: "#FFFCCC",
      }),
      new ColorRange({
        min: 5,
        max: 25,
        color: "#FFF380",
      }),
      new ColorRange({
        min: 25,
        max: 50,
        color: "#FFB534",
      }),
      new ColorRange({
        min: 50,
        max: 100,
        color: "#D43624",
      }),
      new ColorRange({
        min: 100,
        max: 250,
        color: "#951214",
      }),
      new ColorRange({
        min: 250,
        max: 500,
        color: "#671212",
      }),
      new ColorRange({
        min: 500,
        max: 1000,
        color: "#DD0085",
      }),
      new ColorRange({
        min: 1000,
        max: Infinity,
        color: "#7A0077",
      }),
    ],
  },
  hospitalizationMap: {
    default: [
      new ColorRange({
        min: 0,
        max: 0,
        color: "#E2E2E2",
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      }),
      new ColorRange({
        min: 0,
        max: 1,
        color: "#FCF9CA",
      }),
      new ColorRange({
        min: 1,
        max: 3,
        color: "#FFDA9C",
        label: "> 1 - 3: keine einheitl. Regeln",
      }),
      new ColorRange({
        min: 3,
        max: 6,
        color: "#F7785B",
        label: "> 3 - 6: 2G-Regel",
      }),
      new ColorRange({
        min: 6,
        max: 9,
        color: "#FF3A25",
        label: "> 6 - 9: 2G-Plus-Regel",
      }),
      new ColorRange({
        min: 9,
        max: 12,
        color: "#D80182",
        label: "> 9 - 12: > 9 weitere Maßnah.",
      }),
      new ColorRange({
        min: 12,
        max: 15,
        color: "#770175",
      }),
      new ColorRange({
        min: 15,
        max: Infinity,
        color: "#000000",
      }),
    ],
    grey: [
      new ColorRange({
        min: 0,
        max: 0,
        color: "#F0F0F0",
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      }),
      new ColorRange({
        min: 0,
        max: 1,
        color: "#E1E1E1",
      }),
      new ColorRange({
        min: 1,
        max: 3,
        color: "#BEBEBE",
        label: "> 1 - 3: keine einheitl. Regeln",
      }),
      new ColorRange({
        min: 3,
        max: 6,
        color: "#9B9B9B",
        label: "> 3 - 6: 2G-Regel",
      }),
      new ColorRange({
        min: 6,
        max: 9,
        color: "#787878",
        label: "> 6 - 9: 2G-Plus-Regel",
      }),
      new ColorRange({
        min: 9,
        max: 12,
        color: "#555555",
        label: "> 9 - 12: > 9 weitere Maßnah.",
      }),
      new ColorRange({
        min: 12,
        max: 15,
        color: "#323232",
      }),
      new ColorRange({
        min: 15,
        max: Infinity,
        color: "#0F0F0F",
      }),
    ],
    greenred: [
      new ColorRange({
        min: 0,
        max: 0,
        color: "#046010",
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      }),
      new ColorRange({
        min: 0,
        max: 1,
        color: "#28520E",
      }),
      new ColorRange({
        min: 1,
        max: 3,
        color: "#4C450B",
        label: "> 1 - 3: keine einheitl. Regeln",
      }),
      new ColorRange({
        min: 3,
        max: 6,
        color: "#703709",
        label: "> 3 - 6: 2G-Regel",
      }),
      new ColorRange({
        min: 6,
        max: 9,
        color: "#932907",
        label: "> 6 - 9: 2G-Plus-Regel",
      }),
      new ColorRange({
        min: 9,
        max: 12,
        color: "#B71B05",
        label: "> 9 - 12: > 9 weitere Maßnah.",
      }),
      new ColorRange({
        min: 12,
        max: 15,
        color: "#DB0E02",
      }),
      new ColorRange({
        min: 15,
        max: Infinity,
        color: "#FF0000",
      }),
    ],
  },
};

// example string for user palette (thats a copy of the rki palette)
// 0,0,CDCDCD;0,5,FFFCCC;5,25,FFF380;25,50,FFB534;50,100,D43624;100,250,951214;250,500,671212;500,1000,DD0085;1000,Infinity,7A0077;
//min,max,color,label?;min,max,color,label?; ........... ;min,Infinity,color,label?; a semicolon at the end is a option

function BuildUserPalette(
  paletteType: string,
  paletteStr: string
): { paletteType: string; palette: string } {
  //remove a semicolon at the end and/or beginning of paletteString if available
  if (paletteStr.substring(paletteStr.length - 1, paletteStr.length) == ";") {
    paletteStr = paletteStr.substring(0, paletteStr.length - 1);
  }
  if (paletteStr.substring(0, 1) == ";") {
    paletteStr = paletteStr.substring(1, paletteStr.length);
  }

  const ranges = paletteStr.split(";"); // split the string in ranges
  const countRanges = ranges.length; // number of ranges

  // first check, ranges.length must be >=3 and <=15 sein, if not throw a error
  if (countRanges < 3 || countRanges > 15) {
    throw new Error(
      `Anzahl der Bereiche! Soll: ">=3 <=15". Ist: "${countRanges}". ${paletteStr} überprüfen`
    );
  }

  let userRanges = [];
  let userRange = [];
  ranges.forEach((range, index) => {
    userRange[index] = range.split(","); // split the range into single parameters

    // errorchecks:

    // every range needs 3 or 4 elements if not throw a error
    if (userRange[index].length != 3 && userRange[index].length != 4) {
      throw new Error(
        `Fehler im ${
          index + 1
        }.Bereich. Jeder Bereich muss 3 oder 4 Werte enthalten! "${
          ranges[index]
        }" überprüfen.`
      );
    }

    // first and second element must be an number, or first a number and second "Infinity" for last range.
    // if this is not the last range it will be filtered out in one of the next tests
    if (
      isNaN(parseInt(userRange[index][0])) ||
      (isNaN(parseInt(userRange[index][1])) &&
        userRange[index][1].trim().toLowerCase() != "infinity")
    ) {
      throw new Error(
        `Fehler im ${
          index + 1
        }.Bereich. Die ersten beiden Werte müssen Zahlen oder "Infinity" im 2.Wert enthalten! ${
          ranges[index]
        } überprüfen.`
      );
    } else if (userRange[index][1].trim().toLowerCase() == "infinity") {
      var max: number = Infinity;
    } else {
      var min = parseInt(userRange[index][0]);
      max = parseInt(userRange[index][1]);
    }

    // first range min must be "0" if not throw a error
    if (index == 0 && min != 0) {
      throw new Error(
        `Fehler im ${index + 1}.Bereich. ${
          index + 1
        }.Bereich.min muss "0" sein! ${ranges[index]} überprüfen.`
      );
    }

    // dont allow min > max -> throw error
    if (min > max) {
      throw new Error(
        `Fehler im ${index + 1}.Bereich. ${index + 1}.Bereich.min > ${
          index + 1
        }.Bereich.max. ${ranges[index]} überprüfen.`
      );
    }

    // after first range check if range.min = range-1.max
    if (index > 0 && min != parseInt(userRange[index - 1][1])) {
      throw new Error(
        `Fehler im ${index + 1}.Bereich. ${
          index + 1
        }.Bereich.min != ${index}.Bereich.max! ${ranges[index]} oder ${
          ranges[index - 1]
        }`
      );
    }

    // third element must be 6 digit hex, bevor test, remove all spaces (if available)
    // and convert to upper case
    userRange[index][2] = userRange[index][2].toUpperCase().replace(/ /g, "");
    if (!userRange[index][2].match(/^[0-9A-F]{6}$/)) {
      throw new Error(
        `Fehler im ${
          index + 1
        }.Bereich. Der dritte Wert muss eine 6 stellige Hexadezimale Zahl ohne Prefix enthalten. z.B. "FFFD000". ${
          ranges[index]
        } überprüfen.`
      );
    } else {
      var color: string = `#${userRange[index][2]}`;
    }
    // all checks passed, now write the Objects to userRanges array

    // if a label is given and not empty it must be pushed too
    if (userRange[index].length == 4 && userRange[index][3].trim() != "") {
      // check if this is the first range and range.min = range.max = 0 witch meens thats a
      // fixed range for value "0" and write special Object with comparefunction and label
      const label: string = userRange[index][3].trim();
      if (index == 0 && min == 0 && max == 0) {
        userRanges.push({
          min: min,
          max: max,
          color: color,
          compareFn: (value: number, range: ColorRange) => value === range.min,
          label: label,
        });
      } else {
        // all others write "normal" objects with label
        userRanges.push({
          min: min,
          max: max,
          color: color,
          label: label,
        });
      }
    } else {
      // check if this is the first range and range.min = range.max = 0 witch meens thats a
      // fixed range for value "0" and write special Object with comparefunction and standart label
      if (index == 0 && min == 0 && max == 0) {
        userRanges.push({
          min: min,
          max: max,
          color: color,
          compareFn: (value: number, range: ColorRange) => value === range.min,
          label: "keine Fälle übermittelt",
        });
      } else {
        // all others write "normal" objects without label
        userRanges.push({
          min: min,
          max: max,
          color: color,
        });
      }
    }
  });

  //create user palette Object and write to other hard coded palettes
  weekIncidenceColorRanges[paletteType]["user"] = userRanges.map((range) => {
    return new ColorRange(range);
  });

  // return object with paletteType and palette; palette is always "user"!
  return { paletteType: paletteType, palette: "user" };
}

function CheckParmPalette(
  paletteType: string,
  palette: string
): { paletteType: string; palette: string } {
  const palettes = Object.keys(weekIncidenceColorRanges[paletteType]);
  if (palettes.includes(palette)) {
    return { paletteType: paletteType, palette: palette };
  } else {
    throw new Error(
      `Falscher Parameter '?palette=${palette}' ! ${palette} existiert nicht, oder ist für den typ: ${paletteType} nicht vorgesehen. Gültig ist nur eine aus: ${palettes}`
    );
  }
}

export function GetCheckedPalette(
  req,
  paletteType: string
): { paletteType: string; palette: string } {
  // first check if both possible parameters are given -> Error not allowed
  if (req.query.userpalette && req.query.palette) {
    throw new Error(
      "Die Parameter 'palette=' und 'userpalette=' dürfen nicht zusammen angegeben werden!"
    );
  }
  // set palette to 'default', will be changed if a parameter is given
  let checkedPalette = { paletteType: paletteType, palette: "default" };
  // if parameter userpalette= is given build user palette, function returns new palette name
  if (req.query.userpalette) {
    checkedPalette = BuildUserPalette(
      paletteType,
      req.query.userpalette.toString()
    );
  } else if (req.query.palette) {
    // if parameter palette= is given check if the hard coded palette exists, function returns palette name!
    checkedPalette = CheckParmPalette(
      paletteType,
      req.query.palette.toString()
    );
  }
  return checkedPalette;
}
