export interface IResponseMeta {
  meta: ResponseMeta;
}

export class ResponseMeta {
  source: string;
  contact: string;
  info: string;
  lastUpdate: Date;
  lastCheckedForUpdate: Date;

  constructor(lastUpdate: Date) {
    this.source = "Robert Koch-Institut";
    this.contact = "Marlon Lueckert (m.lueckert@me.com)";
    this.info = "https://github.com/marlon360/rki-covid-api";
    this.lastUpdate = lastUpdate;
    this.lastCheckedForUpdate = new Date();
  }
}
