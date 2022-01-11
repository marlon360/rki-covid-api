export function getStateAbbreviationById(id: number): string | null {
  switch (id) {
    case 1:
      return "SH";
    case 2:
      return "HH";
    case 3:
      return "NI";
    case 4:
      return "HB";
    case 5:
      return "NW";
    case 6:
      return "HE";
    case 7:
      return "RP";
    case 8:
      return "BW";
    case 9:
      return "BY";
    case 10:
      return "SL";
    case 11:
      return "BE";
    case 12:
      return "BB";
    case 13:
      return "MV";
    case 14:
      return "SN";
    case 15:
      return "ST";
    case 16:
      return "TH";
    default:
      return null;
  }
}

export function getStateIdByAbbreviation(abbreviation: string): number | null {
  switch (abbreviation) {
    case "SH":
      return 1;
    case "HH":
      return 2;
    case "NI":
      return 3;
    case "HB":
      return 4;
    case "NW":
      return 5;
    case "HE":
      return 6;
    case "RP":
      return 7;
    case "BW":
      return 8;
    case "BY":
      return 9;
    case "SL":
      return 10;
    case "BE":
      return 11;
    case "BB":
      return 12;
    case "MV":
      return 13;
    case "SN":
      return 14;
    case "ST":
      return 15;
    case "TH":
      return 16;
    default:
      return null;
  }
}

export function getStateAbbreviationByName(name: string): string | null {
  switch (name) {
    case "Baden-Württemberg":
      return "BW";
    case "Bayern":
      return "BY";
    case "Berlin":
      return "BE";
    case "Brandenburg":
      return "BB";
    case "Bremen":
      return "HB";
    case "Hamburg":
      return "HH";
    case "Hessen":
      return "HE";
    case "Mecklenburg-Vorpommern":
      return "MV";
    case "Niedersachsen":
      return "NI";
    case "Nordrhein-Westfalen":
      return "NW";
    case "Rheinland-Pfalz":
      return "RP";
    case "Saarland":
      return "SL";
    case "Sachsen":
      return "SN";
    case "Sachsen-Anhalt":
      return "ST";
    case "Schleswig-Holstein":
      return "SH";
    case "Thüringen":
      return "TH";
    default:
      return null;
  }
}

export function getStateNameByAbbreviation(
  abbreviation: string
): string | null {
  switch (abbreviation) {
    case "BW":
      return "Baden-Württemberg";
    case "BY":
      return "Bayern";
    case "BE":
      return "Berlin";
    case "BB":
      return "Brandenburg";
    case "HB":
      return "Bremen";
    case "HH":
      return "Hamburg";
    case "HE":
      return "Hessen";
    case "MV":
      return "Mecklenburg-Vorpommern";
    case "NI":
      return "Niedersachsen";
    case "NW":
      return "Nordrhein-Westfalen";
    case "RP":
      return "Rheinland-Pfalz";
    case "SL":
      return "Saarland";
    case "SN":
      return "Sachsen";
    case "ST":
      return "Sachsen-Anhalt";
    case "SH":
      return "Schleswig-Holstein";
    case "TH":
      return "Thüringen";
    default:
      return null;
  }
}

export function getStateIdByName(name: string): number | null {
  switch (name) {
    case "Baden-Württemberg":
      return 8;
    case "Bayern":
      return 9;
    case "Berlin":
      return 11;
    case "Brandenburg":
      return 12;
    case "Bremen":
      return 4;
    case "Hamburg":
      return 2;
    case "Hessen":
      return 6;
    case "Mecklenburg-Vorpommern":
      return 13;
    case "Niedersachsen":
      return 3;
    case "Nordrhein-Westfalen":
      return 5;
    case "Rheinland-Pfalz":
      return 7;
    case "Saarland":
      return 10;
    case "Sachsen":
      return 14;
    case "Sachsen-Anhalt":
      return 15;
    case "Schleswig-Holstein":
      return 1;
    case "Thüringen":
      return 16;
    default:
      return null;
  }
}

export function getDateBefore(days: number): string {
  let offsetDate = new Date();
  offsetDate.setHours(0, 0, 0, 0);
  offsetDate.setDate(new Date().getDate() - days);
  return offsetDate.toISOString().split("T").shift();
}

export function getDayDifference(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function AddDaysToDate(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 1000 * 60 * 60 * 24);
}

export function cleanupString(input: string): string {
  // only keep latin characters, umlaute, ß, -
  return input.replace(/[^a-zA-ZäöüÄÖÜß\-]/g, "");
}

export interface RKIErrorResponse {
  code: number;
  message: string;
  details: string[];
}

export class RKIError extends Error {
  public url?: string;
  public rkiError: RKIErrorResponse;

  constructor(error: RKIErrorResponse, url?: string) {
    super(error.message);
    this.name = "RKIError";
    this.rkiError = error;
    this.url = url;
  }
}

export interface ParamErrorResponse {
  code: number;
  message: string;
  details: string;
}

export class ParamError extends Error {
  public url?: string;
  public paramError: ParamErrorResponse;

  constructor(error: ParamErrorResponse, url?: string) {
    super(error.message);
    this.name = "ParameterError";
    this.paramError = error;
    this.url = url;
  }
}

export function checkDays(paramDays: string, url: string): number {
  if (isNaN(parseInt(paramDays))) {
    throw new ParamError(
      {
        code: 400,
        message: "Wrong Parameter",
        details: `This -> ${paramDays} is not a number`,
      },
      url
    );
  }
  const days = parseInt(paramDays);
  return days;
}

export function checkAbbreviation(
  paramAbbreviation: string,
  url: string
): string {
  if (!abbreviationList.includes(paramAbbreviation.toUpperCase())) {
    throw new ParamError(
      {
        code: 400,
        message: "Wrong Parameter",
        details: `${paramAbbreviation} is not a valid abbreviation! Select one of: ${abbreviationList}`,
      },
      url
    );
  }
  return paramAbbreviation.toUpperCase();
}

export function checkAgs(paramAgs: string, url: string): string {
  if (!agsList.includes(paramAgs)) {
    throw new ParamError(
      {
        code: 400,
        message: "Wrong Parameter",
        details: `${paramAgs} is not a valid ags! Use one of ${agsList}`,
      },
      url
    );
  }
  return paramAgs;
}

// prettier-ignore
const abbreviationList = [
  "BW","BY","BE","BB","HB","HH","HE","MV",
  "NI","NW","RP","SL","SN","ST","SH","TH",
];

//The following is a complete list of used ags since 2020-01-01
// prettier-ignore
const agsList = [
  "01001","01002","01003","01004","01051","01053","01054","01055","01056",
  "01057","01058","01059","01060","01061","01062","02000","03101","03102",
  "03103","03151","03152","03153","03154","03155","03157","03158","03159",
  "03241","03251","03252","03254","03255","03256","03257","03351","03352",
  "03353","03354","03355","03356","03357","03358","03359","03360","03361",
  "03401","03402","03403","03404","03405","03451","03452","03453","03454",
  "03455","03456","03457","03458","03459","03460","03461","03462","04011",
  "04012","05111","05112","05113","05114","05116","05117","05119","05120",
  "05122","05124","05154","05158","05162","05166","05170","05314","05315",
  "05316","05334","05354","05358","05362","05366","05370","05374","05378",
  "05382","05512","05513","05515","05554","05558","05562","05566","05570",
  "05711","05754","05758","05762","05766","05770","05774","05911","05913",
  "05914","05915","05916","05954","05958","05962","05966","05970","05974",
  "05978","06411","06412","06413","06414","06431","06432","06433","06434",
  "06435","06436","06437","06438","06439","06440","06531","06532","06533",
  "06534","06535","06611","06631","06632","06633","06634","06635","06636",
  "07111","07131","07132","07133","07134","07135","07137","07138","07140",
  "07141","07143","07211","07231","07232","07233","07235","07311","07312",
  "07313","07314","07315","07316","07317","07318","07319","07320","07331",
  "07332","07333","07334","07335","07336","07337","07338","07339","07340",
  "08111","08115","08116","08117","08118","08119","08121","08125","08126",
  "08127","08128","08135","08136","08211","08212","08215","08216","08221",
  "08222","08225","08226","08231","08235","08236","08237","08311","08315",
  "08316","08317","08325","08326","08327","08335","08336","08337","08415",
  "08416","08417","08421","08425","08426","08435","08436","08437","09161",
  "09162","09163","09171","09172","09173","09174","09175","09176","09177",
  "09178","09179","09180","09181","09182","09183","09184","09185","09186",
  "09187","09188","09189","09190","09261","09262","09263","09271","09272",
  "09273","09274","09275","09276","09277","09278","09279","09361","09362",
  "09363","09371","09372","09373","09374","09375","09376","09377","09461",
  "09462","09463","09464","09471","09472","09473","09474","09475","09476",
  "09477","09478","09479","09561","09562","09563","09564","09565","09571",
  "09572","09573","09574","09575","09576","09577","09661","09662","09663",
  "09671","09672","09673","09674","09675","09676","09677","09678","09679",
  "09761","09762","09763","09764","09771","09772","09773","09774","09775",
  "09776","09777","09778","09779","09780","10041","10042","10043","10044",
  "10045","10046","11001","11002","11003","11004","11005","11006","11007",
  "11008","11009","11010","11011","11012","12051","12052","12053","12054",
  "12060","12061","12062","12063","12064","12065","12066","12067","12068",
  "12069","12070","12071","12072","12073","13003","13004","13071","13072",
  "13073","13074","13075","13076","14511","14521","14522","14523","14524",
  "14612","14625","14626","14627","14628","14713","14729","14730","15001",
  "15002","15003","15081","15082","15083","15084","15085","15086","15087",
  "15088","15089","15090","15091","16051","16052","16053","16054","16055",
  "16056","16061","16062","16063","16064","16065","16066","16067","16068",
  "16069","16070","16071","16072","16073","16074","16075","16076","16077",
];
