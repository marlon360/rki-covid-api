import axios from "axios";
import XLSX from 'xlsx';
import { ResponseData } from "./response-data";

export interface testingHistoryEntry{
    calendarWeek: string,
    countTesting: number,
    positiveTesting: number,
    positiveQuote: number,
    countLaboratories: number
} 

export async function getTestingHistory(): Promise<ResponseData<testingHistoryEntry[]>> {

    const response = await axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Testzahlen-gesamt.xlsx?__blob=publicationFile`, {
        responseType: 'arraybuffer'
    });
    const data = response.data;
    const lastModified = response.headers['last-modified'];
    const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

    var workbook = XLSX.read(data, { type: 'buffer' });

    const sheet = workbook.Sheets[workbook.SheetNames[1]];

    const json = XLSX.utils.sheet_to_json<{
        Kalenderwoche: string,
        'Anzahl Testungen': number,
        'Positiv getestet': number,
        'Positivenanteil (%)': number,
        'Anzahl übermittelnder Labore': number
    }>(sheet)
    
    const testingHistory: testingHistoryEntry[] = []
    
    for (const entry of json) {
        if (entry.Kalenderwoche === "Bis einschließlich KW10, 2020") {
            testingHistory.push({
                calendarWeek: "until CW10, 2020",
                countTesting: entry['Anzahl Testungen'],
                positiveTesting: entry['Positiv getestet'],
                positiveQuote: null,
                countLaboratories: null
            })
        } else if (entry.Kalenderwoche === "Summe") {
        // do nothing, skip this entry
        }  
        else { 
            testingHistory.push({
            calendarWeek: entry.Kalenderwoche,
            countTesting: entry['Anzahl Testungen'],
            positiveTesting: entry['Positiv getestet'],
            positiveQuote: entry['Positivenanteil (%)'] / 100,
            countLaboratories: entry['Anzahl übermittelnder Labore']
            })
        }  
    }
    return {
        data: testingHistory,
        lastUpdate: lastUpdate
    }

}
