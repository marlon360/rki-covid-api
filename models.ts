export class State {

    public name: string;
    public code: string;
    public count: number;
    public difference: number;
    public weekDifference: number;
    public weekIncidence: number;
    public casesPer100k: number;
    public deaths: number;

}

export class District {

    public name: string;
    public type: string;
    public count: number;
    public deaths: number;
    public weekIncidence: number;
    public casesPer100k: number;
    public casesPerPopulation: number;

}
