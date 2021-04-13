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

    const sheet = workbook.Sheets[workbook.SheetNames[2]];
    const json = XLSX.utils.sheet_to_json<{
        ags: number,
        state: string,
        VC1vaccination: number,
        VC1biontech: number,
        VC1moderna: number,
        VC1AstraZeneca: number,
        VC1Difference: number,
        VCfullVaccinated: number,
        VCfullbiontech: number,
        VCfullmoderna: number,
        VCfullAstraZeneca: number,
        VCfullDifference: number,
        GP1vaccination: number,
        GP1biontech: number,
        GP1moderna: number,
        GP1AstraZeneca: number,
        GP1Difference: number,
        GPfullVaccinated: number,
        GPfullbiontech: number,
        GPfullmoderna: number,
        GPfullAstraZeneca: number,
        GPfullDifference: number
    }>(sheet, { header: [
        "ags",
        "state",
        "VC1vaccination",
        "VC1biontech",
        "VC1moderna",
        "VC1AstraZeneca",
        "VC1Difference",
        "VCfullVaccinated",
        "VCfullbiontech",
        "VCfullmoderna",
        "VCfullAstraZeneca",
        "VCfullDifference",
        "GP1vaccination",
        "GP1biontech",
        "GP1moderna",
        "GP1AstraZeneca",
        "GP1Difference",
        "GPfullVaccinated",
        "GPfullbiontech",
        "GPfullmoderna",
        "GPfullAstraZeneca",
        "GPfullDifference"
    ], range: "A5:V22" })

    const quoteSheet = workbook.Sheets[workbook.SheetNames[1]];
    const quoteJson = XLSX.utils.sheet_to_json<{
        ags: number,
        state: string,
        totalvaccination: number,
        total1: number,
        totalfull: number,
        quote1: number,
        quote1ls60: number,
        quote1gq60: number,
        quotefull: number,
        quotefullls60: number,
        quotefullgq60: number,
        VC1ls60: number,
        VC1gq60: number,
        VCfullls60: number,
        VCfullgq60: number,
        GP1ls60: number,
        GP1gq60: number,
        GPfullls60: number,
        GPfullgq60: number
    }>(quoteSheet, { header: [
        "ags",
        "state",
        "totalvaccination",
        "total1",
        "totalfull",
        "quote1",
        "quote1ls60",
        "quote1gq60",
        "quotefull",
        "quotefullls60",
        "quotefullgq60",
        "VC1ls60",
        "VC1gq60",
        "VCfullls60",
        "VCfullgq60",
        "GP1ls60",
        "GP1gq60",
        "GPfullls60",
        "GPfullgq60"
    ], range: "A5:S22" })


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
            age: null,
            job: null,
            medical: null,
            nursingHome: null,
            secondVaccination: {
                age: null,
                job: null,
                medical: null,
                nursingHome: null
            }
        },
        states: {}
    }

    for (let i = 0; i < 18; i++) {
        const entry = json[i];
        clearEntry(entry);
        const quoteEntry = quoteJson[i];
        clearEntry(quoteEntry);

        if (entry.state == "Gesamt") {
            coverage.administeredVaccinations = quoteEntry.totalvaccination;
            coverage.vaccinated = quoteEntry.total1;
            coverage.vaccination = {
                biontech: entry.VC1biontech + entry.GP1biontech,
                moderna: entry.VC1moderna + entry.GP1moderna,
                astraZeneca: entry.VC1AstraZeneca + entry.GP1AstraZeneca
            };
            coverage.delta = entry.VC1Difference + entry.GP1Difference;
            coverage.quote = quoteEntry.quote1 === null ? null: quoteEntry.quote1 / 100.0;
            coverage.secondVaccination = {
                vaccinated: quoteEntry.totalfull,
                vaccination: {
                    biontech: entry.VCfullbiontech + entry.GPfullbiontech,
                    moderna: entry.VCfullmoderna + entry.GPfullmoderna,
                    astraZeneca: entry.VCfullAstraZeneca + entry.GPfullAstraZeneca
                },
                delta: entry.VCfullDifference + entry.GPfullDifference,
                quote: quoteEntry.quotefull === null ? null: quoteEntry.quotefull / 100.0
            }
            coverage.indication = {
                age: null,
                job: null,
                medical: null,
                nursingHome: null,
                secondVaccination: {
                    age: null,
                    job: null,
                    medical: null,
                    nursingHome: null,
                }
            }
        } else {
            const cleanedStateName = entry.state.includes("Bund") ? entry.state : cleanupString(entry.state)
            const abbreviation = entry.state.includes("Bund") ? "Bund" : getStateAbbreviationByName(cleanedStateName)
            coverage.states[abbreviation] = {
                name: cleanedStateName,
                administeredVaccinations: quoteEntry.totalvaccination,
                vaccinated: quoteEntry.total1,
                vaccination: {
                    biontech: entry.VC1biontech + entry.GP1biontech,
                    moderna: entry.VC1moderna + entry.GP1moderna,
                    astraZeneca: entry.VC1AstraZeneca + entry.GP1AstraZeneca
                },
                delta: entry.VC1Difference + entry.GP1Difference,
                quote: quoteEntry.quote1 === null ? null: quoteEntry.quote1 / 100.0,
                secondVaccination: {
                    vaccinated: quoteEntry.totalfull,
                    vaccination: {
                        biontech: entry.VCfullbiontech + entry.GPfullbiontech,
                        moderna: entry.VCfullmoderna + entry.GPfullmoderna,
                        astraZeneca: entry.VCfullAstraZeneca + entry.GPfullAstraZeneca
                    },
                    delta: entry.VCfullDifference + entry.GPfullDifference,
                    quote: quoteEntry.quotefull === null ? null: quoteEntry.quotefull / 100.0
                },
                indication: {
                    age: null,
                    job: null,
                    medical: null,
                    nursingHome: null,
                    secondVaccination: {
                        age: null,
                        job: null,
                        medical: null,
                        nursingHome: null,
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
        'Einmal geimpft': number,
        'Vollständig geimpft': number,
    }>(sheet)

    const vaccinationHistory: VaccinationHistoryEntry[] = []

    for (const entry of json) {
        if ((entry.Datum as any) instanceof Date) {
            vaccinationHistory.push({
                date: entry.Datum,
                vaccinated: entry['Einmal geimpft'] ?? 0,
                firstVaccination: entry['Einmal geimpft'] ?? 0,
                secondVaccination: entry['Vollständig geimpft'] ?? 0
            })
        }
    }

    return {
        data: vaccinationHistory,
        lastUpdate: lastUpdate
    }

}
