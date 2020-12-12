class State {

    name;
    code;
    count;
    difference;
    weekDifference;
    weekIncidence;
    casesPer100k;
    deaths;

}

module.exports.State = State

class District {

    name;
    county;
    count;
    deaths;
    weekIncidence;
    casesPer100k;
    casesPerPopulation;

}

module.exports.District = District