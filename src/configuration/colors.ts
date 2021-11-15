export const weekIncidenceColorRanges = {
  old: {
    ranges: [
      { min: 0, max: 0, color: "#ADADAD" },
      { min: 0, max: 1, color: "#3BEB47" },
      { min: 1, max: 15, color: "#7FD38D" },
      { min: 15, max: 25, color: "#FEFFB1" },
      { min: 25, max: 35, color: "#FECA81" },
      { min: 35, max: 50, color: "#F08A4B" },
      { min: 50, max: 100, color: "#EB1A1D" },
      { min: 100, max: 200, color: "#AB1316" },
      { min: 200, max: 350, color: "#B374DD" },
      { min: 350, max: 500, color: "#5B189B" },
      { min: 500, max: 1000, color: "#543D35" },
      { min: 1000, max: Infinity, color: "#020003" },
    ],
  },
  default: {
    ranges: [
      { min: 0, max: 0, color: "#E2E2E2" },
      { min: 0, max: 1, color: "#25BA94" },
      { min: 1, max: 15, color: "#76D985" },
      { min: 15, max: 25, color: "#FFFFA8" },
      { min: 25, max: 35, color: "#FECA81" },
      { min: 35, max: 50, color: "#F1894A" },
      { min: 50, max: 100, color: "#F21620" },
      { min: 100, max: 200, color: "#A9141A" },
      { min: 200, max: 350, color: "#B275DD" },
      { min: 350, max: 500, color: "#5D179B" },
      { min: 500, max: 1000, color: "#17179B" },
      { min: 1000, max: 1500, color: "#68463B" },
      { min: 1500, max: 2500, color: "#6D6D6D" },
      { min: 2500, max: Infinity, color: "#020003" },
    ],
  },
  rki: {
    ranges: [
      { min: 0, max: 0, color: "#ADADAD" },
      { min: 0, max: 5, color: "#FFFCCC" },
      { min: 5, max: 25, color: "#FFF380" },
      { min: 25, max: 50, color: "#FFB534" },
      { min: 50, max: 100, color: "#D43624" },
      { min: 100, max: 250, color: "#951214" },
      { min: 250, max: 500, color: "#671212" },
      { min: 500, max: 1000, color: "#DD0085" },
      { min: 1000, max: Infinity, color: "#7A0077" },
    ],
  },
};

// for further enhancment user definable colors and ranges
export const userweekIncidenceColorRanges = {
  ranges: [
    { min: 0, max: 0, color: "#000000" },
    { min: 0, max: undefined, color: "#000000" },
    { min: undefined, max: Infinity, color: "#000000" },
  ],
};
