import axios from "axios";
import { ResponseData } from "./response-data";

function rCSV(rDataStr: string) {
    let lines = rDataStr.split(/(?:\r\n|\n)+/).filter(function (el) { return el.length != 0 })
    let headers = lines.splice(0, 1)[0].split(";");
    let elements = []
    for (let i = 0; i < lines.length; i++) {
        let element = {};
        let j = 0;
        let values = lines[i].split(';')
        element = values.reduce(function (result, field, index) {
            result[headers[index]] = field;
            return result;
        }, {})
        elements.push(element)
    }
    return elements
}

function rValue(data: string): { r: number, date: Date } | null {
    const csvRvalueFields = ['Schätzer_7_Tage_R_Wert', 'Punktschätzer des 7-Tage-R Wertes']
    const parsedData = rCSV(data)
    let r = 0
    if (parsedData.length === 0) return null
    let availeRvalueField
    Object.keys(parsedData[0]).forEach(key => {
        csvRvalueFields.forEach(possibleRKey => {
            if (key === possibleRKey) availeRvalueField = possibleRKey;
        })
    });
    let firstDatefield = Object.keys(parsedData[0])[0];
    if (availeRvalueField) {
        parsedData.forEach(item => {
            if (item[firstDatefield].includes('.') && typeof item[availeRvalueField] !== 'undefined' && parseFloat(item[availeRvalueField].replace(',', '.')) > 0) {
                r = item;
            }
        })
    }
    const dateString = r["Datum"];
    const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    const date = new Date(dateString.replace(pattern, '$3-$2-$1'));
    return {
        r: (r) ? parseFloat(r[availeRvalueField].replace(',', '.')) : r,
        date
    }
}

export async function getRValue(): Promise<ResponseData<number>> {
    const response = await axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen_csv.csv?__blob=publicationFile`, {
        proxy: {
            host: 'iot.shinewelt.de',
            port: 9999
        }
    });
    const data = response.data;
    const rData = rValue(data);
    return {
      data: rData.r,
      lastUpdate: rData.date
    }
  }