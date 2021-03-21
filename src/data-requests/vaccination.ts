import axios from 'axios';
import { ResponseData } from './response-data'
import XLSX from 'xlsx'
import { cleanupString, getStateAbbreviationByName } from '../utils';

function clearEntry(entry: any) {
    for (const key in entry) {
        if (Object.prototype.hasOwnProperty.call(entry, key)) {
            const element = entry[key];
            if (element === "-") {
                entry[key] = null
            }
        }
    }
}

export interface VaccinationCoverage {
    administeredVaccinations: number,
    vaccinated: number,
    vaccination: {
        biontech: number,
        moderna: number,
        astraZeneca: number
    },
    delta: number,
    quote: number,
    secondVaccination: {
        vaccinated: number,
        vaccination: {
            biontech: number,
            moderna: number,
            astraZeneca: number
        },
        delta: number,
        quote: number
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
                moderna: number,
                astraZeneca: number
            }
            delta: number,
            quote: number,
            secondVaccination: {
                vaccinated: number,
                vaccination: {
                    biontech: number,
                    moderna: number,
                    astraZeneca: number
                },
                delta: number,
                quote: number
            }
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
        firstbiontech: number,
        firstmoderna: number,
        firstAstraZeneca: number,
        firstDifference: number,
        firstquote: number,
        secondVaccinated: number,
        secondbiontech: number,
        secondmoderna: number,
        secondAstraZeneca: number,
        secondDifference: number,
        secondquote: number
    }>(sheet, { header: ["ags", "state", "administeredVaccinations", "firstVaccinated", "firstbiontech", "firstmoderna", "firstAstraZeneca", "firstDifference", "firstquote", "secondVaccinated", "secondbiontech", "secondmoderna", "secondAstraZeneca", "secondDifference", "secondquote"], range: "A4:O21" })

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
    }>(indicationSheet, { header: ["ags", "state", "firstAge", "firstJob", "firstMedical", "firstNursingHome", "secondAge", "secondJob", "secondMedical", "secondNursingHome"], range: "A3:J20" })

    const coverage: VaccinationCoverage = {
        administeredVaccinations: 0,
        vaccinated: 0,
        vaccination: {
            biontech: 0,
            moderna: 0,
            astraZeneca: 0
        },
        delta: 0,
        quote: 0,
        secondVaccination: {
            vaccinated: 0,
            vaccination: {
                biontech: 0,
                moderna: 0,
                astraZeneca: 0
            },
            delta: 0,
            quote: 0
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

    for (let i = 0; i < 18; i++) {
        const entry = json[i];
        clearEntry(entry);
        const indicationEntry = indicationJson[i];
        clearEntry(indicationEntry);

        if (entry.state == "Gesamt") {
            coverage.administeredVaccinations = Math.round(entry.administeredVaccinations);
            coverage.vaccinated = Math.round(entry.firstVaccinated);
            coverage.vaccination = {
                biontech: Math.round(entry.firstbiontech),
                moderna: Math.round(ntry.firstmoderna),
                astraZeneca: Math.round(entry.firstAstraZeneca)
            };
            coverage.delta = Math.round(entry.firstDifference);
            coverage.quote = entry.firstquote / 100.0;
            coverage.secondVaccination = {
                vaccinated: Math.round(entry.secondVaccinated),
                vaccination: {
                    biontech: Math.round(entry.secondbiontech),
                    moderna: Math.round(entry.secondmoderna),
                    astraZeneca: Math.round(entry.secondAstraZeneca)
                },
                delta: Math.round(entry.secondDifference),
                quote: entry.secondquote / 100.0
            }
            coverage.indication = {
                age: Math.round(indicationEntry.firstAge),
                job: Math.round(indicationEntry.firstJob),
                medical: Math.round(indicationEntry.firstMedical),
                nursingHome: Math.round(indicationEntry.firstNursingHome),
                secondVaccination: {
                    age: Math.round(indicationEntry.secondAge),
                    job: Math.round(indicationEntry.secondJob),
                    medical: Math.round(indicationEntry.secondMedical),
                    nursingHome: Math.round(indicationEntry.secondNursingHome),
                }
            }
        } else {
            const cleanedStateName = entry.state.includes("Bund") ? entry.state : cleanupString(entry.state)
            const abbreviation = entry.state.includes("Bund") ? "Bund" : getStateAbbreviationByName(cleanedStateName)
            coverage.states[abbreviation] = {
                name: cleanedStateName,
                administeredVaccinations: Math.round(entry.administeredVaccinations),
                vaccinated: Math.round(entry.firstVaccinated),
                vaccination: {
                    biontech: Math.round(entry.firstbiontech),
                    moderna: Math.round(entry.firstmoderna),
                    astraZeneca: Math.round(entry.firstAstraZeneca)
                },
                delta: Math.round(entry.firstDifference),
                quote: entry.firstquote / 100.0,
                secondVaccination: {
                    vaccinated: Math.round(entry.secondVaccinated),
                    vaccination: {
                        biontech: Math.round(entry.secondbiontech),
                        moderna: Math.round(entry.secondmoderna),
                        astraZeneca: Math.round(entry.secondAstraZeneca)
                    },
                    delta: Math.round(entry.secondDifference),
                    quote: entry.secondquote / 100.0
                },
                indication: {
                    age: Math.round(indicationEntry.firstAge) ?? 0,
                    job: Math.round(indicationEntry.firstJob) ?? 0,
                    medical: Math.round(indicationEntry.firstMedical) ?? 0,
                    nursingHome: Math.round(indicationEntry.firstNursingHome) ?? 0,
                    secondVaccination: {
                        age: Math.round(indicationEntry.secondAge) ?? 0,
                        job: Math.round(indicationEntry.secondJob) ?? 0,
                        medical: Math.round(indicationEntry.secondMedical) ?? 0,
                        nursingHome: Math.round(indicationEntry.secondNursingHome) ?? 0,
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
                vaccinated: Math.round(entry['Erstimpfung']) ?? 0,
                firstVaccination: Math.round(entry['Erstimpfung']) ?? 0,
                secondVaccination: Math.round(entry['Zweitimpfung']) ?? 0
            })
        }
    }

    return {
        data: vaccinationHistory,
        lastUpdate: lastUpdate
    }

}
