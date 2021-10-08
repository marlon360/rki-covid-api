# States

## `/states`

### Request

`GET https://api.corona-zahlen.org/states`
[Open](/states)

### Response

```json
{
  "data": {
    "SH": {
      "id": 1,
      "name": "Schleswig-Holstein",
      "population": 2910875,
      "cases": 76683,
      "deaths": 1690,
      "casesPerWeek": 841,
      "deathsPerWeek": 1,
      "recovered": 73523,
      "abbreviation": "SH",
      "weekIncidence": 28.89165628891656,
      "casesPer100k": 2634.3625198608665,
      "delta": {
        "cases": 102,
        "deaths": 3,
        "recovered": 145
      },
      "hospitalization": {
        "cases7D": 38,
        "cases7DbyAge": {
          "A00-A04": 1,
          "A05-A14": 2,
          "A15-A34": 5,
          "A35-A59": 11,
          "A60-A79": 10,
          "A80+": 9
        },
        "incidence7D": 1.31,
        "incidence7DbyAge": {
          "A00-A04": 0.77,
          "A05-A14": 0.77,
          "A15-A34": 0.79,
          "A35-A59": 1.09,
          "A60-A79": 1.51,
          "A80+": 4.08
        },
        "lastUpdate": "2021-10-05T06:28:25.000Z"
      }
    },
    "HH": {
      "id": 2,
      "name": "Hamburg",
      "population": 1852478,
      "cases": 92396,
      "deaths": 1741,
      "casesPerWeek": 1262,
      "deathsPerWeek": 3,
      "recovered": 86712,
      "abbreviation": "HH",
      "weekIncidence": 68.12496558663585,
      "casesPer100k": 4987.697559701114,
      "delta": {
        "cases": 227,
        "deaths": 0,
        "recovered": 250
      },
      "hospitalization": {
        "cases7D": 13,
        "cases7DbyAge": {
          "A00-A04": 0,
          "A05-A14": 0,
          "A15-A34": 1,
          "A35-A59": 2,
          "A60-A79": 6,
          "A80+": 4
        },
        "incidence7D": 0.7,
        "incidence7DbyAge": {
          "A00-A04": 0,
          "A05-A14": 0,
          "A15-A34": 0.2,
          "A35-A59": 0.31,
          "A60-A79": 1.84,
          "A80+": 3.55
        },
        "lastUpdate": "2021-10-05T06:28:25.000Z"
      }
    },
    // ...
    "TH": {
      "id": 16,
      "name": "Thüringen",
      "population": 2120237,
      "cases": 136370,
      "deaths": 4416,
      "casesPerWeek": 1615,
      "deathsPerWeek": 2,
      "recovered": 129211,
      "abbreviation": "TH",
      "weekIncidence": 76.17072997028161,
      "casesPer100k": 6431.8281399673715,
      "delta": {
        "cases": 177,
        "deaths": 1,
        "recovered": 186
      },
      "hospitalization": {
        "cases7D": 59,
        "cases7DbyAge": {
          "A00-A04": 1,
          "A05-A14": 1,
          "A15-A34": 5,
          "A35-A59": 14,
          "A60-A79": 17,
          "A80+": 21
        },
        "incidence7D": 2.78,
        "incidence7DbyAge": {
          "A00-A04": 1.14,
          "A05-A14": 0.54,
          "A15-A34": 1.29,
          "A35-A59": 1.94,
          "A60-A79": 3.04,
          "A80+": 11.72
        },
        "lastUpdate": "2021-10-05T06:28:25.000Z"
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-10-04T23:00:00.000Z",
    "lastCheckedForUpdate": "2021-10-05T20:42:00.029Z"
  }
}
```

## `/states/:state`

Returns the data for a single `:state` state.

### Request

`GET https://api.corona-zahlen.org/states/HH`
[Open](/states/HH)

| Parameter | Description        |
| --------- | ------------------ |
| :state    | State abbreviation |

### Response

```json
{
  "data": {
    "HH": {
      "id": 2,
      "name": "Hamburg",
      "population": 1847253,
      "cases": 37535,
      "deaths": 661,
      "casesPerWeek": 2027,
      "deathsPerWeek": 2,
      "recovered": 27864,
      "abbreviation": "HH",
      "weekIncidence": 109.73050253538634,
      "casesPer100k": 2031.9360693960166,
      "delta": {
        "cases": 0,
        "deaths": 0,
        "recovered": 350
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-04T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:49:21.375Z"
  }
}
```

## `/states/history`

Redirects to `/states/history/cases`

## `/states/history/cases`

## `/states/history/cases/:days`

## `/states/history/incidence`

## `/states/history/incidence/:days`

## `/states/history/deaths`

## `/states/history/deaths/:days`

## `/states/history/recovered`

## `/states/history/recovered/:days`

## `/states/age-groups`

### Request

`GET https://api.corona-zahlen.org/states/age-groups`
[Open](/states/age-groups)

### Response

```json
{
  "data": {
    "SH": {
      "A00-A04": {
        "casesMale": 71,
        "casesFemale": 72,
        "deathsMale": 0,
        "deathsFemale": 1,
        "casesMalePer100k": 1225.2,
        "casesFemalePer100k": 1321.6,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 18.4
      },
      "A05-A14": {
        "casesMale": 202,
        "casesFemale": 169,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 1663.4,
        "casesFemalePer100k": 1462.7,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0
      },
      "A15-A34": {
        // ...
      },
      "A35-A59": {
        // ...
      },
      "A60-A79": {
        // ...
      },
      "A80+": {
        // ...
      }
    },
    // ...
    "TH": {
      "A00-A04": {
        "casesMale": 1228,
        "casesFemale": 1191,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 2656.9,
        "casesFemalePer100k": 2699.5,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0
      },
      // ...
    },
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-05-04T01:09:15.000Z",
    "lastCheckedForUpdate": "2021-05-04T20:42:11.340Z"
  }
}
```

## `/states/:state/history/cases`

## `/states/:state/history/cases/:days`

## `/states/:state/history/incidence`

## `/states/:state/history/incidence/:days`

## `/states/:state/history/deaths`

## `/states/:state/history/deaths/:days`

## `/states/:state/history/recovered`

## `/states/:state/history/recovered/:days`

## `/states/:state/age-groups`

### Request

`GET https://api.corona-zahlen.org/states/HH/age-groups`
[Open](/states/HH/age-groups)

### Response

```json
{
  "data": {
    "HH": {
      "A00-A04": {
        "casesMale": 1095,
        "casesFemale": 863,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 2139.3,
        "casesFemalePer100k": 1769.8,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0
      },
      "A05-A14": {
        "casesMale": 2775,
        "casesFemale": 2510,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 3267.4,
        "casesFemalePer100k": 3147,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0
      },
      "A15-A34": {
        // ...
      },
      "A35-A59": {
        // ...
      },
      "A60-A79": {
        // ...
      },
      "A80+": {
        // ...
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-05-04T01:09:15.000Z",
    "lastCheckedForUpdate": "2021-05-04T20:45:46.210Z"
  }
}
```
