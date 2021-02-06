import axios from 'axios';
import { ResponseData } from './response-data'
import XLSX from 'xlsx'
import { cleanupString, getStateAbbreviationByName } from '../utils';

export interface VaccinationCoverage {
    administeredVaccinations: number,
    vaccinated: number,
    vaccination: {
        biontech: number,
        moderna: number
    },
    delta: number,
    quote: number,
    secondVaccination: {
        vaccinated: number,
        delta: number
    }
    indication: {
        age: number,
        job: number,
        medical: number,
        nursingHome: number,
        secondVaccination: {
            age: number,
            job: number,
            medical: number,
            nursingHome: number
        }
    },
    states: {
        [abbreviation: string]: {
            name: string,
            administeredVaccinations: number,
            vaccinated: number,
            vaccination: {
                biontech: number,
                moderna: number
            },
            secondVaccination: {
                vaccinated: number,
                delta: number
            }
            delta: number,
            quote: number,
            indication: {
                age: number,
                job: number,
                medical: number,
                nursingHome: number
                secondVaccination: {
                    age: number,
                    job: number,
                    medical: number,
                    nursingHome: number
                }
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

    var workbook = XLSX.read(data, { type: 'buffer' });

    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const json = XLSX.utils.sheet_to_json<{
        ags: number,
        state: string,
        administeredVaccinations: number,
        firstVaccinated: number,
        biontech: number,
        moderna: number,
        firstDifference: number,
        quote: number,
        secondVaccinated: number,
        secondDifference: number
    }>(sheet, { header: ["ags", "state", "administeredVaccinations", "firstVaccinated", "biontech", "moderna", "firstDifference", "quote", "secondVaccinated", "secondDifference"], range: "A4:J20" })

    const indicationSheet = workbook.Sheets[workbook.SheetNames[2]];
    const indicationJson = XLSX.utils.sheet_to_json<{
        ags: number,
        state: string,
        firstAge: number,
        firstJob: number,
        firstMedical: number,
        firstNursingHome: number,
        secondAge: number,
        secondJob: number,
        secondMedical: number,
        secondNursingHome: number
    }>(indicationSheet, { header: ["ags", "state", "firstAge", "firstJob", "firstMedical", "firstNursingHome", "secondAge", "secondJob", "secondMedical", "secondNursingHome"], range: "A3:J19" })        

    const coverage: VaccinationCoverage = {
        administeredVaccinations: 0,
        vaccinated: 0,
        vaccination: {
            biontech: 0,
            moderna: 0
        },
        delta: 0,
        quote: 0,
        secondVaccination: {
            vaccinated: 0,
            delta: 0
        },
        indication: {
            age: 0,
            job: 0,
            medical: 0,
            nursingHome: 0,
            secondVaccination: {
                age: 0,
                job: 0,
                medical: 0,
                nursingHome: 0
            }
        },
        states: {}
    }

    for (let i = 0; i < 17; i++) {
        const entry = json[i];
        const indicationEntry = indicationJson[i];  
        
        if (entry.state == "Gesamt") {
            coverage.vaccinated = entry.firstVaccinated;
            coverage.administeredVaccinations = entry.administeredVaccinations;
            coverage.delta = entry.firstDifference;
            coverage.vaccination = {
                biontech: entry.biontech,
                moderna: entry.moderna
            },
            coverage.secondVaccination = {
                vaccinated: entry.secondVaccinated,
                delta: entry.secondDifference
            }
            coverage.quote = entry.quote / 100.0;
            coverage.indication = {
                age: indicationEntry.firstAge,
                job: indicationEntry.firstJob,
                medical: indicationEntry.firstMedical,
                nursingHome: indicationEntry.firstNursingHome,
                secondVaccination: {
                    age: indicationEntry.secondAge,
                    job: indicationEntry.secondJob,
                    medical: indicationEntry.secondMedical,
                    nursingHome: indicationEntry.secondNursingHome,
                }
            }
        } else {
            const cleanedStateName = cleanupString(entry.state)
            const abbreviation = getStateAbbreviationByName(cleanedStateName)
            coverage.states[abbreviation] = {
                name: cleanedStateName,
                administeredVaccinations: entry.administeredVaccinations,
                vaccinated: entry.firstVaccinated,
                vaccination: {
                    biontech: entry.biontech,
                    moderna: entry.moderna
                },
                secondVaccination: {
                    vaccinated: entry.secondVaccinated,
                    delta: entry.secondDifference
                },
                delta: entry.firstDifference,
                quote: entry.quote / 100.0,
                indication: {
                    age: indicationEntry.firstAge ?? 0,
                    job: indicationEntry.firstJob ?? 0,
                    medical: indicationEntry.firstMedical ?? 0,
                    nursingHome: indicationEntry.firstNursingHome ?? 0,
                    secondVaccination: {
                        age: indicationEntry.secondAge ?? 0,
                        job: indicationEntry.secondJob ?? 0,
                        medical: indicationEntry.secondMedical ?? 0,
                        nursingHome: indicationEntry.secondNursingHome ?? 0,
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

export interface VaccinationHistoryEntry {
    date: Date,
    vaccinated: number,
    firstVaccination: number,
    secondVaccination: number
}

export async function getVaccinationHistory(): Promise<ResponseData<VaccinationHistoryEntry[]>> {

    const response = await axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile`, {
        responseType: 'arraybuffer'
    });
    const data = response.data;
    const lastModified = response.headers['last-modified'];
    const lastUpdate = lastModified != null ? new Date(lastModified) : new Date();

    var workbook = XLSX.read(data, { type: 'buffer', cellDates: true });

    const sheet = workbook.Sheets[workbook.SheetNames[3]];

    const json = XLSX.utils.sheet_to_json<{
        Datum: Date,
        'Erstimpfung': number,
        'Zweitimpfung': number,
    }>(sheet)

    const vaccinationHistory: VaccinationHistoryEntry[] = []

    for (const entry of json) {
        if ((entry.Datum as any) instanceof Date) {
            vaccinationHistory.push({
                date: entry.Datum,
                vaccinated: entry['Erstimpfung'] ?? 0,
                firstVaccination: entry['Erstimpfung'] ?? 0,
                secondVaccination: entry['Zweitimpfung'] ?? 0
            })
        }
    }

    return {
        data: vaccinationHistory,
        lastUpdate: lastUpdate
    }

}
