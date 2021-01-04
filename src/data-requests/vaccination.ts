import axios from 'axios';
import { ResponseData } from './response-data'
import XLSX from 'xlsx'
import { getStateAbbreviationByName } from '../utils';

export interface VaccinationCoverage {
    vaccinated: number,
    delta: number,
    vaccinatedPer1k: number,
    quote: number,
    indication: {
        age: number,
        job: number,
        medical: number,
        nursingHome: number
    },
    states: {
        [abbreviation: string]: {
            name: string,
            vaccinated: number,
            delta: number,
            vaccinatedPer1k: number,
            quote: number,
            indication: {
                age: number,
                job: number,
                medical: number,
                nursingHome: number
            }
        }
    } 
}

export async function getVaccinationCoverage(): Promise<ResponseData<VaccinationCoverage>> {
    
    const response = await axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile`, {
        responseType: 'arraybuffer'
      });
    const data = response.data;
    const lastModified = response.headers['last-modified'];
    const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

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
        vaccinatedPer1k: 0,
        quote: 0,
        indication: {
            age: 0,
            job: 0,
            medical: 0,
            nursingHome: 0
        },
        states: {}
    }

    for (const entry of json) {
        if (Object.keys(entry).length > 4) {
            if (entry.Bundesland == "Gesamt") {
                coverage.vaccinated = entry['Impfungen kumulativ']
                coverage.delta = entry['Differenz zum Vortag'],
                coverage.vaccinatedPer1k = entry['Impfungen pro 1.000 Einwohner'],
                coverage.quote = coverage.vaccinated / (coverage.vaccinated / coverage.vaccinatedPer1k * 1000)
                coverage.indication = {
                    age: entry['Indikation nach Alter*'],
                    job: entry['Berufliche Indikation*'],
                    medical: entry['Medizinische Indikation*'],
                    nursingHome: entry['Pflegeheim-bewohnerIn*']
                }
            } else {
                const abbreviation = getStateAbbreviationByName(entry.Bundesland)
                coverage.states[abbreviation] = {
                    name: entry.Bundesland,
                    vaccinated: entry['Impfungen kumulativ'],
                    delta: entry['Differenz zum Vortag'],
                    vaccinatedPer1k: entry['Impfungen pro 1.000 Einwohner'],
                    quote: entry['Impfungen kumulativ'] / (entry['Impfungen kumulativ'] / entry['Impfungen pro 1.000 Einwohner'] * 1000),
                    indication: {
                        age: entry['Indikation nach Alter*'],
                        job: entry['Berufliche Indikation*'],
                        medical: entry['Medizinische Indikation*'],
                        nursingHome: entry['Pflegeheim-bewohnerIn*']
                    }
                }
            }
        }
    }

    return {
        data: coverage,
        lastUpdate: lastUpdate
    }

}