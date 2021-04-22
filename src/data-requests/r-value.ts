import axios from "axios";
import XLSX from 'xlsx';
import { ResponseData } from "./response-data";

function parseRValue(data: ArrayBuffer): { r: number, date: Date } | null {
    var workbook = XLSX.read(data, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const json = XLSX.utils.sheet_to_json(sheet)

    const latestEntry = json[json.length - 1];
    const dateString = latestEntry["Datum des Erkrankungsbeginns"];
    let rValue = latestEntry["Punktschätzer des 4-Tage R-Wertes"] || latestEntry["Punktschätzer der 4-Tage R-Wert"] || latestEntry["Punktschätzer des 4-Tage-R-Wertes"];

    if (typeof rValue === 'string' || rValue instanceof String) {
        rValue = parseFloat(rValue.replace(",", "."))
    }

    const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    const date = new Date(dateString.replace(pattern, '$3-$2-$1'));

    return {
        r: rValue,
        date
    }
}

export async function getRValue(): Promise<ResponseData<number>> {
    const response = await axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen.xlsx?__blob=publicationFile`, {
        responseType: 'arraybuffer'
    });
    const data = response.data;
    const rData = parseRValue(data);
    return {
        data: rData.r,
        lastUpdate: rData.date
    }
}
