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
      "population": 2903773,
      "cases": 25751,
      "deaths": 446,
      "casesPerWeek": 2272,
      "deathsPerWeek": 9,
      "recovered": 19434,
      "abbreviation": "SH",
      "weekIncidence": 78.24303070522386,
      "casesPer100k": 886.8117445819628,
      "delta": {
        "cases": 211,
        "deaths": 3,
        "recovered": 258
      }
    },
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
    },
    // ...
    "TH": {
      "id": 16,
      "name": "Thüringen",
      "population": 2133378,
      "cases": 44696,
      "deaths": 1054,
      "casesPerWeek": 5364,
      "deathsPerWeek": 42,
      "recovered": 32643,
      "abbreviation": "TH",
      "weekIncidence": 251.43223563756632,
      "casesPer100k": 2095.081134238752,
      "delta": {
        "cases": 330,
        "deaths": 24,
        "recovered": 811
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-04T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:44:55.187Z"
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
