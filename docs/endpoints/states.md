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

### Request

`GET https://api.corona-zahlen.org/states/history/hospitalization/7`
[Open](/states/history/hospitalization/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

`cases7Days` updated number of hospitalization cases of the last 7 days.

`incidence7Days` updated 7 day incidence of hospitalization.

`date` publishing date of all values.

Since 2021-03-09 the RKI is publisching adjusted (predicted) values for cases7Days and incidence7Days. If these values ​​are available, they are output below. These values are unavailable bevor 2021-03-09 and for the last 3 days.

`fixedCases7Days` the number of 7 day cases witch is published at `date` first (fixed, that will never change!).

`updatedCases7Days` the today updated number of 7 day cases and the same as `cases7Days`.

`adjustedLowerCases7Days` the 95% lower limit adjusted (predicted) number of 7 day cases.

`adjustedCases7Days` the adjusted (predicted) number of 7 day cases.

`adjustedUpperCases7Days` the 95% upper limit adjusted (predicted) number of 7 day cases.

`fixedIncidence7Days` the 7 day incidence witch is published at `date` first (fixed, that will never change!).

`updatedIncidence7Days` the today updated 7 day incidence and the same as `incidence7Days`.

`adjustedLowerIncidence7Days` the 95% lower limit adjusted (predicted) 7 day incidence.

`adjustedIncidence7Days` the adjusted (predicted) 7 day incidence.

`adjustedUpperIncidence7Days` the 95% upper limit adjusted (predicted) 7 day incidence.

```json
{
  "data":{
    "SH":{
      "id":1,
      "name":"Schleswig-Holstein",
      "history":[
        {
          "cases7Days":229,
          "incidence7Days":7.87,
          "date":"2022-02-19T00:00:00.000Z",
          "fixedCases7Days":176,
          "updatedCases7Days":229,
          "adjustedLowerCases7Days":277,
          "adjustedCases7Days":283,
          "adjustedUpperCases7Days":291,
          "fixedIncidence7Days":6.05,
          "updatedIncidence7Days":7.87,
          "adjustedLowerIncidence7Days":9.53,
          "adjustedIncidence7Days":9.74,
          "adjustedUpperIncidence7Days":10.02
        },
        {
          "cases7Days":232,
          "incidence7Days":7.97,
          "date":"2022-02-20T00:00:00.000Z",
          "fixedCases7Days":181,
          "updatedCases7Days":232,
          "adjustedLowerCases7Days":283,
          "adjustedCases7Days":289,
          "adjustedUpperCases7Days":298,
          "fixedIncidence7Days":6.22,
          "updatedIncidence7Days":7.97,
          "adjustedLowerIncidence7Days":9.74,
          "adjustedIncidence7Days":9.96,
          "adjustedUpperIncidence7Days":10.25
        },
        {
          "cases7Days":234,
          "incidence7Days":8.04,
          "date":"2022-02-21T00:00:00.000Z",
          "fixedCases7Days":181,
          "updatedCases7Days":234,
          "adjustedLowerCases7Days":287,
          "adjustedCases7Days":294,
          "adjustedUpperCases7Days":303,
          "fixedIncidence7Days":6.22,
          "updatedIncidence7Days":8.04,
          "adjustedLowerIncidence7Days":9.87,
          "adjustedIncidence7Days":10.1,
          "adjustedUpperIncidence7Days":10.41
        },
        {
          "cases7Days":224,
          "incidence7Days":7.7,
          "date":"2022-02-22T00:00:00.000Z",
          "fixedCases7Days":176,
          "updatedCases7Days":224,
          "adjustedLowerCases7Days":285,
          "adjustedCases7Days":292,
          "adjustedUpperCases7Days":302,
          "fixedIncidence7Days":6.05,
          "updatedIncidence7Days":7.7,
          "adjustedLowerIncidence7Days":9.8,
          "adjustedIncidence7Days":10.04,
          "adjustedUpperIncidence7Days":10.39
        },
        {
          "cases7Days":209,
          "incidence7Days":7.18,
          "date":"2022-02-23T00:00:00.000Z",
          "fixedCases7Days":169,
          "updatedCases7Days":209,
          "adjustedLowerCases7Days":null,
          "adjustedCases7Days":null,
          "adjustedUpperCases7Days":null,
          "fixedIncidence7Days":5.81,
          "updatedIncidence7Days":7.18,
          "adjustedLowerIncidence7Days":null,
          "adjustedIncidence7Days":null,
          "adjustedUpperIncidence7Days":null
        },
        {
          "cases7Days":196,
          "incidence7Days":6.73,
          "date":"2022-02-24T00:00:00.000Z",
          "fixedCases7Days":172,
          "updatedCases7Days":196,
          "adjustedLowerCases7Days":null,
          "adjustedCases7Days":null,
          "adjustedUpperCases7Days":null,
          "fixedIncidence7Days":5.91,
          "updatedIncidence7Days":6.73,
          "adjustedLowerIncidence7Days":null,
          "adjustedIncidence7Days":null,
          "adjustedUpperIncidence7Days":null
        },
        {
          "cases7Days":187,
          "incidence7Days":6.42,
          "date":"2022-02-25T00:00:00.000Z",
          "fixedCases7Days":187,
          "updatedCases7Days":187,
          "adjustedLowerCases7Days":null,
          "adjustedCases7Days":null,
          "adjustedUpperCases7Days":null,
          "fixedIncidence7Days":6.42,
          "updatedIncidence7Days":6.42,
          "adjustedLowerIncidence7Days":null,
          "adjustedIncidence7Days":null,
          "adjustedUpperIncidence7Days":null
        }
      ]
    },
    ...
    "TH":{
      "id":16,
      "name":"Thüringen",
      "history":[
        {
          "cases7Days":268,
          "incidence7Days":12.64,
          "date":"2022-02-19T00:00:00.000Z",
          "fixedCases7Days":214,
          "updatedCases7Days":268,
          "adjustedLowerCases7Days":321,
          "adjustedCases7Days":328,
          "adjustedUpperCases7Days":334,
          "fixedIncidence7Days":10.09,
          "updatedIncidence7Days":12.64,
          "adjustedLowerIncidence7Days":15.18,
          "adjustedIncidence7Days":15.5,
          "adjustedUpperIncidence7Days":15.8
        },
        {
          "cases7Days":261,
          "incidence7Days":12.31,
          "date":"2022-02-20T00:00:00.000Z",
          "fixedCases7Days":196,
          "updatedCases7Days":261,
          "adjustedLowerCases7Days":318,
          "adjustedCases7Days":324,
          "adjustedUpperCases7Days":332,
          "fixedIncidence7Days":9.24,
          "updatedIncidence7Days":12.31,
          "adjustedLowerIncidence7Days":15.01,
          "adjustedIncidence7Days":15.33,
          "adjustedUpperIncidence7Days":15.68
        },
        {
          "cases7Days":271,
          "incidence7Days":12.78,
          "date":"2022-02-21T00:00:00.000Z",
          "fixedCases7Days":198,
          "updatedCases7Days":271,
          "adjustedLowerCases7Days":334,
          "adjustedCases7Days":342,
          "adjustedUpperCases7Days":350,
          "fixedIncidence7Days":9.34,
          "updatedIncidence7Days":12.78,
          "adjustedLowerIncidence7Days":15.8,
          "adjustedIncidence7Days":16.13,
          "adjustedUpperIncidence7Days":16.52
        },
        {
          "cases7Days":288,
          "incidence7Days":13.58,
          "date":"2022-02-22T00:00:00.000Z",
          "fixedCases7Days":212,
          "updatedCases7Days":288,
          "adjustedLowerCases7Days":364,
          "adjustedCases7Days":372,
          "adjustedUpperCases7Days":382,
          "fixedIncidence7Days":10,
          "updatedIncidence7Days":13.58,
          "adjustedLowerIncidence7Days":17.21,
          "adjustedIncidence7Days":17.58,
          "adjustedUpperIncidence7Days":18.03
        },
        {
          "cases7Days":275,
          "incidence7Days":12.97,
          "date":"2022-02-23T00:00:00.000Z",
          "fixedCases7Days":221,
          "updatedCases7Days":275,
          "adjustedLowerCases7Days":null,
          "adjustedCases7Days":null,
          "adjustedUpperCases7Days":null,
          "fixedIncidence7Days":10.42,
          "updatedIncidence7Days":12.97,
          "adjustedLowerIncidence7Days":null,
          "adjustedIncidence7Days":null,
          "adjustedUpperIncidence7Days":null
        },
        {
          "cases7Days":249,
          "incidence7Days":11.74,
          "date":"2022-02-24T00:00:00.000Z",
          "fixedCases7Days":203,
          "updatedCases7Days":249,
          "adjustedLowerCases7Days":null,
          "adjustedCases7Days":null,
          "adjustedUpperCases7Days":null,
          "fixedIncidence7Days":9.57,
          "updatedIncidence7Days":11.74,
          "adjustedLowerIncidence7Days":null,
          "adjustedIncidence7Days":null,
          "adjustedUpperIncidence7Days":null
        },
        {
          "cases7Days":225,
          "incidence7Days":10.61,
          "date":"2022-02-25T00:00:00.000Z",
          "fixedCases7Days":225,
          "updatedCases7Days":225,
          "adjustedLowerCases7Days":null,
          "adjustedCases7Days":null,
          "adjustedUpperCases7Days":null,
          "fixedIncidence7Days":10.61,
          "updatedIncidence7Days":10.61,
          "adjustedLowerIncidence7Days":null,
          "adjustedIncidence7Days":null,
          "adjustedUpperIncidence7Days":null
        }
      ]
    }
  },
  "meta":{
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2022-02-25T04:05:31.000Z",
    "lastCheckedForUpdate":"2022-02-25T07:24:43.163Z"
  }
}
```

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
