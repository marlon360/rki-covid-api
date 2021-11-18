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
  [palette: string]: ColorRange[];
}

export const weekIncidenceColorRanges: weekIncidenceColorRanges = {
  default: [
    new ColorRange({
      min: 0,
      max: 0,
      color: "#E2E2E2",
      compareFn: (value: number, range: ColorRange) => value === range.min,
      label: "keine Fälle übermittelt",
    }),
    new ColorRange({ min: 0, max: 1, color: "#25BA94" }),
    new ColorRange({ min: 1, max: 15, color: "#76D985" }),
    new ColorRange({ min: 15, max: 25, color: "#FFFFA8" }),
    new ColorRange({ min: 25, max: 35, color: "#FECA81" }),
    new ColorRange({ min: 35, max: 50, color: "#F1894A" }),
    new ColorRange({ min: 50, max: 100, color: "#F21620" }),
    new ColorRange({ min: 100, max: 200, color: "#A9141A" }),
    new ColorRange({ min: 200, max: 350, color: "#B275DD" }),
    new ColorRange({ min: 350, max: 500, color: "#5D179B" }),
    new ColorRange({ min: 500, max: 1000, color: "#17179B" }),
    new ColorRange({ min: 1000, max: 1500, color: "#68463B" }),
    new ColorRange({ min: 1500, max: 2500, color: "#6D6D6D" }),
    new ColorRange({ min: 2500, max: Infinity, color: "#020003" }),
  ],
  old: [
    new ColorRange({
      min: 0,
      max: 0,
      color: "#CDCDCD",
      compareFn: (value: number, range: ColorRange) => value === range.min,
      label: "keine Fälle übermittelt",
    }),
    new ColorRange({ min: 0, max: 1, color: "#3BEB47" }),
    new ColorRange({ min: 1, max: 15, color: "#7FD38D" }),
    new ColorRange({ min: 15, max: 25, color: "#FEFFB1" }),
    new ColorRange({ min: 25, max: 35, color: "#FECA81" }),
    new ColorRange({ min: 35, max: 50, color: "#F08A4B" }),
    new ColorRange({ min: 50, max: 100, color: "#EB1A1D" }),
    new ColorRange({ min: 100, max: 200, color: "#AB1316" }),
    new ColorRange({ min: 200, max: 350, color: "#B374DD" }),
    new ColorRange({ min: 350, max: 500, color: "#5B189B" }),
    new ColorRange({ min: 500, max: 1000, color: "#543D35" }),
    new ColorRange({ min: 1000, max: Infinity, color: "#020003" }),
  ],
  rki: [
    new ColorRange({
      min: 0,
      max: 0,
      color: "#CDCDCD",
      compareFn: (value: number, range: ColorRange) => value === range.min,
      label: "keine Fälle übermittelt",
    }),
    new ColorRange({ min: 0, max: 5, color: "#FFFCCC" }),
    new ColorRange({ min: 5, max: 25, color: "#FFF380" }),
    new ColorRange({ min: 25, max: 50, color: "#FFB534" }),
    new ColorRange({ min: 50, max: 100, color: "#D43624" }),
    new ColorRange({ min: 100, max: 250, color: "#951214" }),
    new ColorRange({ min: 250, max: 500, color: "#671212" }),
    new ColorRange({ min: 500, max: 1000, color: "#DD0085" }),
    new ColorRange({ min: 1000, max: Infinity, color: "#7A0077" }),
  ],
};

// example string for user palette
// 0,0,CDCDCD;0,5,FFFCCC;5,25,FFF380;25,50,FFB534;50,100,D43624;100,250,951214;250,500,671212;500,1000,DD0085;1000,Infinity,7A0077

function BuildUserPalette(colorRangeString: string) {
  const ranges = colorRangeString.split(";");
  const countRanges = ranges.length;
  // ranges.length muss >=3 und <=15 sein
  if (countRanges < 3 || countRanges > 15) {
    throw new Error("Anzahl der Bereiche muss <=3 und <=15 sein!");
  }
  let userRanges = [];
  let userRange = [];
  ranges.forEach((range) => {
    const z = ranges.indexOf(range);
    userRange[z] = range.split(",");
    // some errorchecks
    // every range needs 3 elements
    if (userRange[z].length != 3) {
      throw new Error(
        `Fehler im ${z + 1}.Bereich. Jeder Bereich muss 3 Werte enthalten!`
      );
    }
    // first range min must be "0"
    if (z == 0 && parseInt(userRange[z][0]) != 0) {
      throw new Error(
        `Fehler im ${z + 1}.Bereich. ${z + 1}.Bereich.min muss "0" sein`
      );
    }
    // dont allow min > max
    if (parseInt(userRange[z][0]) > parseInt(userRange[z][1])) {
      throw new Error(
        `Fehler im ${z + 1}.Bereich. ${z + 1}.Bereich.min > ${
          z + 1
        }.Bereich.max`
      );
    }
    // first and second element must be an number, or first a number and second "Infinity" only for last range set
    if (
      isNaN(parseInt(userRange[z][0])) ||
      (isNaN(parseInt(userRange[z][1])) && userRange[z][1] != "Infinity")
    ) {
      throw new Error(
        `Fehler im ${
          z + 1
        }.Bereich. Die ersten beiden Werte müssen Zahlen oder 'Infinity' im 2.Wert enthalten!`
      );
    }
    // third element must be 6 digit hex
    if (!userRange[z][2].match(/^[0-9a-fA-F]{6}$/)) {
      throw new Error(
        `Fehler im ${
          z + 1
        }.Bereich. Der dritte Wert muss eine 6 stellige Hexadezimale Zahl enthalten. Z.B. 'FFFD00`
      );
    }
    // after first range check if range.min = range-1.max
    if (z != 0 && parseInt(userRange[z][0]) != parseInt(userRange[z - 1][1])) {
      throw new Error(
        `Fehler im ${z + 1}.Bereich. min != max im ${z}.Bereich!`
      );
    }
    // all checks passed, now write the Objects to userRanges array
    // first check if range.min = range.max witch meens thats a fixed vale e.g. "0" or any other (if another value makes sense !?) and write special Object
    if (parseInt(userRange[z][0]) == parseInt(userRange[z][1])) {
      userRanges.push({
        min: parseInt(userRange[z][0]),
        max: parseInt(userRange[z][1]),
        color: "#" + userRange[z][2],
        compareFn: (value: number, range: ColorRange) => value === range.min,
        label: "keine Fälle übermittelt",
      });
    } else if (userRange[z][1] == "Infinity") {
      // "Infinity" marks last range, write specal object
      userRanges.push({
        min: parseInt(userRange[z][0]),
        max: Infinity,
        color: "#" + userRange[z][2],
      });
    } else {
      // all others write "normal" objects
      userRanges.push({
        min: parseInt(userRange[z][0]),
        max: parseInt(userRange[z][1]),
        color: "#" + userRange[z][2],
      });
    }
  });
  weekIncidenceColorRanges["user"] = userRanges.map((range) => {
    return new ColorRange(range);
  }); //create user palette Object and write to othe hard coded palettes
  return "user"; // return name of the user palette
}

function CheckParmPalette(palette: string, ColorRanges: Object): string {
  const palettes = Object.keys(ColorRanges);
  if (palettes.includes(palette)) {
    return palette;
  } else {
    return "Wrong ':colormap' parameter! Must be one of: " + palettes;
  }
}

export function GetCheckedPalette(req) {
  let checkedPalette: string;
  if (req.query.userpalette != undefined && req.query.palette != undefined) {
    throw new Error(
      "Die Parameter 'palette=' und 'userpalette=' dürfen nicht zusammen angegeben werden!"
    );
  }
  // if parameter userpalette= is given build user palette
  if (req.query.userpalette != undefined) {
    checkedPalette = BuildUserPalette(req.query.userpalette.toString());
  } else if (req.query.palette != undefined) {
    // if parameter palette= is given check if the hard coded palette exists, if not returnvalu will be the Errortext!
    checkedPalette = CheckParmPalette(
      req.query.palette.toString(),
      weekIncidenceColorRanges
    );
    if (req.query.palette != checkedPalette) {
      //if a Errortext is returned -> error message
      throw new Error(checkedPalette);
    }
  } else {
    //if no parameter is given user default palette
    checkedPalette = "default";
  }
  return checkedPalette;
}
