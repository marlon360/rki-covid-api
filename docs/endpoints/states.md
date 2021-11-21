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
      "cases": 79941,
      "deaths": 1712,
      "casesPerWeek": 1678,
      "deathsPerWeek": 1,
      "recovered": 76035,
      "abbreviation": "SH",
      "weekIncidence": 57.64589685232104,
      "casesPer100k": 2746.287628290462,
      "delta": {
        "cases": 74,
        "deaths": 0,
        "recovered": 136
      },
      "hospitalization": {
        "cases7Days": 51,
        "incidence7Days": 1.75,
        "date": "2021-10-25T00:00:00.000Z",
        "lastUpdate": "2021-10-25T02:01:53.000Z"
      }
    },
    "HH": {
      "id": 2,
      "name": "Hamburg",
      "population": 1852478,
      "cases": 96556,
      "deaths": 1793,
      "casesPerWeek": 1862,
      "deathsPerWeek": 1,
      "recovered": 90301,
      "abbreviation": "HH",
      "weekIncidence": 100.51401420151818,
      "casesPer100k": 5212.2616300976315,
      "delta": {
        "cases": 280,
        "deaths": 6,
        "recovered": 174
      },
      "hospitalization": {
        "cases7Days": 29,
        "incidence7Days": 1.57,
        "date": "2021-10-25T00:00:00.000Z",
        "lastUpdate": "2021-10-25T02:01:53.000Z"
      }
    },
    // ...
    "TH": {
      "id": 16,
      "name": "Thüringen",
      "population": 2120237,
      "cases": 146156,
      "deaths": 4462,
      "casesPerWeek": 4755,
      "deathsPerWeek": 5,
      "recovered": 134169,
      "abbreviation": "TH",
      "weekIncidence": 224.26738142952888,
      "casesPer100k": 6893.380315502464,
      "delta": {
        "cases": 252,
        "deaths": 1,
        "recovered": 368
      },
      "hospitalization": {
        "cases7Days": 164,
        "incidence7Days": 7.73,
        "date": "2021-10-25T00:00:00.000Z",
        "lastUpdate": "2021-10-25T02:01:53.000Z"
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-10-24T23:00:00.000Z",
    "lastCheckedForUpdate": "2021-10-25T11:09:21.355Z"
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

## `/states/history/frozen-incidence`

## `/states/history/frozen-incidence/:days`

### Request

`GET https://api.corona-zahlen.org/states/history/frozen-incidence/7`
[Open](/states/history/frozen-incidence/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

## `/states/history/deaths`

## `/states/history/deaths/:days`

## `/states/history/recovered`

## `/states/history/recovered/:days`

## `/states/history/hospitalization`

## `/states/history/hospitalization/:days`

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
        "casesMale": 1368,
        "casesFemale": 1305,
        "deathsMale": 0,
        "deathsFemale": 1,
        "casesMalePer100k": 2061.7,
        "casesFemalePer100k": 2064,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 1.6,
        "hospitalization": {
          "cases7Days": 1,
          "incidence7Days": 1,
          "date": "2021-10-25T00:00:00.000Z"
        }
      },
      "A05-A14": {
        "casesMale": 4448,
        "casesFemale": 4148,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 3321.9,
        "casesFemalePer100k": 3267.1,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0,
        "hospitalization": {
          "cases7Days": 5,
          "incidence7Days": 5,
          "date": "2021-10-25T00:00:00.000Z"
        }
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
        "casesMale": 1680,
        "casesFemale": 1625,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 3752.2,
        "casesFemalePer100k": 3788.4,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0,
        "hospitalization": {
          "cases7Days": 2,
          "incidence7Days": 2,
          "date": "2021-10-25T00:00:00.000Z"
        }
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

## `/states/:state/history/frozen-incidence`

## `/states/:state/history/frozen-incidence/:days`

### Request

`GET https://api.corona-zahlen.org/states/HH/history/frozen-incidence/7`
[Open](/states/HH/history/frozen-incidence/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |
| :states   | Abbreviation of the state             |

## `/states/:state/history/deaths`

## `/states/:state/history/deaths/:days`

## `/states/:state/history/recovered`

## `/states/:state/history/recovered/:days`

## `/states/:state/history/hospitalization`

## `/states/:state/history/hospitalization/:days`

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
        "casesMale": 1603,
        "casesFemale": 1316,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 3146.5,
        "casesFemalePer100k": 2719.9,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0,
        "hospitalization": {
          "cases7Days": 1,
          "incidence7Days": 1,
          "date": "2021-10-25T00:00:00.000Z"
        }
      },
      "A05-A14": {
        "casesMale": 4985,
        "casesFemale": 4594,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 5786.6,
        "casesFemalePer100k": 5663.1,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0,
        "hospitalization": {
          "cases7Days": 2,
          "incidence7Days": 2,
          "date": "2021-10-25T00:00:00.000Z"
        }
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
