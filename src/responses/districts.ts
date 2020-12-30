import { IResponseMeta, ResponseMeta } from './meta'
import {  } from '../data-requests/districts';
import { ResponseData } from '../data-requests/response-data';
import { getDistrictsData, getNewDistrictCases, getNewDistrictDeaths, IDistrictData, getLastDistrictCasesHistory, getLastDistrictDeathsHistory, getLastDistrictRecoveredHistory } from '../data-requests/districts';

interface DistrictData extends IDistrictData {
    weekIncidence: number,
    casesPer100k: number,
    delta: {
        cases: number,
        deaths: number
    }
}

interface DistrictsData extends IResponseMeta {
    data: {
        [key: string]: DistrictData
    }
}

export async function DistrictsResponse(ags?: string): Promise<DistrictsData> {

    const districtsData = await getDistrictsData();
    const districtNewCasesData = await getNewDistrictCases();
    const districtNewDeathsData = await getNewDistrictDeaths();

    function getDistrictByAgs (data: ResponseData<any[]>, ags: string): any | null {
        for (const district of data.data) {
            if (district.ags == ags) return district;
        }
        return null
    }    

    let districts = districtsData.data.map((district) => {
        return {
            ...district,
            weekIncidence: district.casesPerWeek / district.population * 100000,
            casesPer100k: district.cases / district.population * 100000,
            delta: {
                cases: getDistrictByAgs(districtNewCasesData, district.ags)?.cases ?? 0,
                deaths: getDistrictByAgs(districtNewDeathsData, district.ags)?.deaths ?? 0
            }
        }
    })

    if (ags != null) {
        districts = districts.filter((districts) => {
            return districts.ags == ags
        })
    }

    const districtsKey = {}
    for (const district of districts) {
        districtsKey[district.ags] = district
    }

    return {
        data: districtsKey,
        meta: new ResponseMeta(districtsData.lastUpdate)
    }

}

interface DistrictHistory<T> {
    ags: string,
    name: string,
    history: T[]
}
interface DistrictsHistoryData<T> extends IResponseMeta {
    data: T
}

interface DistrictsCasesHistory {
    [key: string]: DistrictHistory<{cases: number, date: Date}>
}
export async function DistrictsCasesHistoryResponse(days?: number, ags?: string): Promise<DistrictsHistoryData<DistrictsCasesHistory>> {
    
    const statesHistoryData = await getLastDistrictCasesHistory(days, ags);

    const data: DistrictsCasesHistory = {}

    for (const historyData of statesHistoryData.data) {
        if (data[historyData.ags] == null) {
            data[historyData.ags] = {
                ags: historyData.ags, 
                name: historyData.name,
                history: []
            }            
        }
        data[historyData.ags].history.push({
            cases: historyData.cases,
            date: new Date(historyData.date)
        })
    }
    return {
        data,
        meta: new ResponseMeta(statesHistoryData.lastUpdate)
    };
}

interface DistrictsDeathsHistory {
    [key: string]: DistrictHistory<{deaths: number, date: Date}>
}
export async function DistrictsDeathsHistoryResponse(days?: number, ags?: string): Promise<DistrictsHistoryData<DistrictsDeathsHistory>> {
    
    const statesHistoryData = await getLastDistrictDeathsHistory(days, ags);

    const data: DistrictsDeathsHistory = {}

    for (const historyData of statesHistoryData.data) {
        if (data[historyData.ags] == null) {
            data[historyData.ags] = {
                ags: historyData.ags, 
                name: historyData.name,
                history: []
            }
        }
        data[historyData.ags].history.push({
            deaths: historyData.deaths,
            date: new Date(historyData.date)
        })
    }
    return {
        data,
        meta: new ResponseMeta(statesHistoryData.lastUpdate)
    };
}

interface DistrictsRecoveredHistory {
    [key: string]: DistrictHistory<{recovered: number, date: Date}>
}
export async function DistrictsRecoveredHistoryResponse(days?: number, ags?: string): Promise<DistrictsHistoryData<DistrictsRecoveredHistory>> {
    
    const statesHistoryData = await getLastDistrictRecoveredHistory(days, ags);

    const data: DistrictsRecoveredHistory = {}

    for (const historyData of statesHistoryData.data) {
        if (data[historyData.ags] == null) {
            data[historyData.ags] = {
                ags: historyData.ags, 
                name: historyData.name,
                history: []
            }
        }
        data[historyData.ags].history.push({
            recovered: historyData.recovered,
            date: new Date(historyData.date)
        })
    }
    return {
        data,
        meta: new ResponseMeta(statesHistoryData.lastUpdate)
    };
}