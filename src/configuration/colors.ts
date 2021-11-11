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

export const weekIncidenceColorRanges: ColorRange[] = [
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
    color: "#88F89B",
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
];
