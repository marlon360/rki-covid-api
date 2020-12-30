import axios from 'axios';
import { ResponseData } from './response-data'
import XLSX from 'xlsx'
import { getStateAbbreviationByName } from '../utils';

export interface VaccinationCoverage {
    vaccinated: number,
    delta: number,
    states: {
        [abbreviation: string]: {
            name: string,
            vaccinated: number,
            delta: number
        }
    } 
}

export async function getVaccinationCoverage(): Promise<ResponseData<VaccinationCoverage>> {
    
    const response = await axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile`, {
        responseType: 'arraybuffer'
      });
    const data = response.data;

    var workbook = XLSX.read(data, {type:'buffer'});
    
    const sheet = workbook.Sheets[workbook.SheetNames[1]];

    const json = XLSX.utils.sheet_to_json<{
        Bundesland: string,
        'Impfungen kumulativ': number,
        'Differenz zum Vortag': number,
        'Indikation nach Alter*': number,
        'Berufliche Indikation*': number,
        'Medizinische Indikation*': number,
        'Pflegeheim-bewohnerIn*': number
    }>(sheet)
    
    const coverage: VaccinationCoverage = {
        vaccinated: 0,
        delta: 0,
        states: {}
    }

    for (const entry of json) {
        if (Object.keys(entry).length == 7) {
            if (entry.Bundesland == "Gesamt") {
                coverage.vaccinated = entry['Impfungen kumulativ']
                coverage.delta = entry['Differenz zum Vortag']
            } else {
                const abbreviation = getStateAbbreviationByName(entry.Bundesland)
                coverage.states[abbreviation] = {
                    name: entry.Bundesland,
                    vaccinated: entry['Impfungen kumulativ'],
                    delta: entry['Differenz zum Vortag']
                }
            }
        }
    }

    return {
        data: coverage,
        lastUpdate: new Date()
    }

}