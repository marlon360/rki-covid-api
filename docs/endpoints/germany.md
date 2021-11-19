# Germany

## `/germany`

### Request

`GET https://api.corona-zahlen.org/germany`
[Open](/germany)

### Response

```json
{
  "cases": 4472730,
  "deaths": 95117,
  "recovered": 4215170,
  "weekIncidence": 110.06189150479662,
  "casesPer100k": 5378.7845981321325,
  "casesPerWeek": 91522,
  "delta": {
    "cases": 6573,
    "deaths": 17,
    "recovered": 8811
  },
  "r": {
    "value": 1.18,
    "rValue4Days": {
      "value": 1.18,
      "date": "2021-10-21T00:00:00.000Z"
    },
    "rValue7Days": {
      "value": 1.17,
      "date": "2021-10-20T00:00:00.000Z"
    },
    "lastUpdate": "2021-10-24T23:48:33.000Z"
  },
  "hospitalization": {
    "cases7Days": 2303,
    "incidence7Days": 2.77,
    "date": "2021-10-25T00:00:00.000Z",
    "lastUpdate": "2021-10-25T02:01:53.000Z"
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-10-24T23:00:00.000Z",
    "lastCheckedForUpdate": "2021-10-25T11:06:58.517Z"
  }
}
```

## `/germany/history`

Redirects to `/germany/history/cases`

## `/germany/history/cases`

Returns the total cases in germany for every day.

### Request

`GET https://api.corona-zahlen.org/germany/history/cases`
[Open](/germany/history/cases)

### Response

```json
{
  "data": [
    {
      "cases": 2,
      "date": "2020-01-01T00:00:00.000Z"
    },
    {
      "cases": 5,
      "date": "2020-01-02T00:00:00.000Z"
    },
    // ...
    {
      "cases": 5409,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:20:30.694Z"
  }
}
```

## `/germany/history/cases/:days`

Returns the total cases in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/cases/7`
[Open](/germany/history/cases)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "cases": 15587,
      "date": "2020-12-28T00:00:00.000Z"
    },
    {
      "cases": 27130,
      "date": "2020-12-29T00:00:00.000Z"
    },
    {
      "cases": 30295,
      "date": "2020-12-30T00:00:00.000Z"
    },
    {
      "cases": 18902,
      "date": "2020-12-31T00:00:00.000Z"
    },
    {
      "cases": 10031,
      "date": "2021-01-01T00:00:00.000Z"
    },
    {
      "cases": 8540,
      "date": "2021-01-02T00:00:00.000Z"
    },
    {
      "cases": 5409,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:26:36.595Z"
  }
}
```

## `/germany/history/incidence`

Returns the history of week incidences in germany.

### Request

`GET https://api.corona-zahlen.org/germany/history/incidence`
[Open](/germany/history/incidence)

### Response

```json
{
  "data": [
    {
      "weekIncidence": 162.7502138445754,
      "date": "2021-01-13T00:00:00.000Z"
    },
    {
      "weekIncidence": 155.7810792830319,
      "date": "2021-01-14T00:00:00.000Z"
    },
    {
      "weekIncidence": 148.2901013122907,
      "date": "2021-01-15T00:00:00.000Z"
    },
    {
      "weekIncidence": 144.20914156386442,
      "date": "2021-01-16T00:00:00.000Z"
    },
    {
      "weekIncidence": 141.81034524739113,
      "date": "2021-01-17T00:00:00.000Z"
    },
    {
      "weekIncidence": 131.50093190531484,
      "date": "2021-01-18T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-18T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-19T10:58:20.854Z"
  }
}
```

## `/germany/history/incidence/:days`

Returns the week incidence in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/incidence/3`
[Open](/germany/history/incidence/3)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "weekIncidence": 144.20914156386442,
      "date": "2021-01-16T00:00:00.000Z"
    },
    {
      "weekIncidence": 141.81034524739113,
      "date": "2021-01-17T00:00:00.000Z"
    },
    {
      "weekIncidence": 131.50093190531484,
      "date": "2021-01-18T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-18T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-19T11:02:29.069Z"
  }
}
```

## `/germany/history/deaths`

Returns the number of deaths in germany for every day.

### Request

`GET https://api.corona-zahlen.org/germany/history/deaths`
[Open](/germany/history/deaths)

### Response

```json
{
  "data": [
    {
      "deaths": 0,
      "date": "2020-01-01T00:00:00.000Z"
    },
    {
      "cases": 1,
      "date": "2020-01-02T00:00:00.000Z"
    },
    // ...
    {
      "deaths": 100,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:20:30.694Z"
  }
}
```

## `/germany/history/deaths/:days`

Returns the number of deaths in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/deaths/7`
[Open](/germany/history/deaths/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "deaths": 171,
      "date": "2020-12-28T00:00:00.000Z"
    },
    {
      "deaths": 199,
      "date": "2020-12-29T00:00:00.000Z"
    },
    {
      "deaths": 141,
      "date": "2020-12-30T00:00:00.000Z"
    },
    {
      "deaths": 57,
      "date": "2020-12-31T00:00:00.000Z"
    },
    {
      "deaths": 28,
      "date": "2021-01-01T00:00:00.000Z"
    },
    {
      "deaths": 17,
      "date": "2021-01-02T00:00:00.000Z"
    },
    {
      "deaths": 7,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:29:52.846Z"
  }
}
```

## `/germany/history/recovered`

Returns the number of recovered people in germany for every day.

### Request

`GET https://api.corona-zahlen.org/germany/history/recovered`
[Open](/germany/history/recovered)

### Response

```json
{
  "data": [
    {
      "recovered": 0,
      "date": "2020-01-01T00:00:00.000Z"
    },
    {
      "recovered": 1,
      "date": "2020-01-02T00:00:00.000Z"
    },
    // ...
    {
      "recovered": 100,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:20:30.694Z"
  }
}
```

## `/germany/history/recovered/:days`

Returns the number of recovered people in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/recovered/7`
[Open](/germany/history/recovered/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "recovered": 1638,
      "date": "2020-12-28T00:00:00.000Z"
    },
    {
      "recovered": 1546,
      "date": "2020-12-29T00:00:00.000Z"
    },
    {
      "recovered": 1059,
      "date": "2020-12-30T00:00:00.000Z"
    },
    {
      "recovered": 317,
      "date": "2020-12-31T00:00:00.000Z"
    },
    {
      "recovered": 185,
      "date": "2021-01-01T00:00:00.000Z"
    },
    {
      "recovered": 116,
      "date": "2021-01-02T00:00:00.000Z"
    },
    {
      "recovered": 49,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:31:15.304Z"
  }
}
```

## `/germany/age-groups`

### Request

`GET https://api.corona-zahlen.org/germany/age-groups`
[Open](/germany/age-groups)

### Response

```json
{
  "data": {
    "A00-A04": {
      "casesMale": 64370,
      "casesFemale": 59621,
      "deathsMale": 4,
      "deathsFemale": 9,
      "casesMalePer100k": 3161.5,
      "casesFemalePer100k": 3084.3,
      "deathsMalePer100k": 0.2,
      "deathsFemalePer100k": 0.5,
      "hospitalization": {
        "cases7Days": 47,
        "incidence7Days": 47,
        "date": "2021-10-25T00:00:00.000Z"
      }
    },
    "A05-A14": {
      "casesMale": 213364,
      "casesFemale": 195741,
      "deathsMale": 3,
      "deathsFemale": 4,
      "casesMalePer100k": 5527.2,
      "casesFemalePer100k": 5365.1,
      "deathsMalePer100k": 0.1,
      "deathsFemalePer100k": 0.1,
      "hospitalization": {
        "cases7Days": 37,
        "incidence7Days": 37,
        "date": "2021-10-25T00:00:00.000Z"
      }
    },
    "A15-A34": {
      "casesMale": 686975,
      "casesFemale": 671273,
      "deathsMale": 143,
      "deathsFemale": 84,
      "casesMalePer100k": 6998.9,
      "casesFemalePer100k": 7371.9,
      "deathsMalePer100k": 1.5,
      "deathsFemalePer100k": 0.9,
      "hospitalization": {
        "cases7Days": 273,
        "incidence7Days": 273,
        "date": "2021-10-25T00:00:00.000Z"
      }
    },
    "A35-A59": {
      "casesMale": 803350,
      "casesFemale": 848158,
      "deathsMale": 3107,
      "deathsFemale": 1314,
      "casesMalePer100k": 5568.9,
      "casesFemalePer100k": 5955.9,
      "deathsMalePer100k": 21.5,
      "deathsFemalePer100k": 9.2,
      "hospitalization": {
        "cases7Days": 510,
        "incidence7Days": 510,
        "date": "2021-10-25T00:00:00.000Z"
      }
    },
    "A60-A79": {
      "casesMale": 296636,
      "casesFemale": 299046,
      "deathsMale": 18665,
      "deathsFemale": 9890,
      "casesMalePer100k": 3446.9,
      "casesFemalePer100k": 3132.2,
      "deathsMalePer100k": 216.9,
      "deathsFemalePer100k": 103.6,
      "hospitalization": {
        "cases7Days": 727,
        "incidence7Days": 727,
        "date": "2021-10-25T00:00:00.000Z"
      }
    },
    "A80+": {
      "casesMale": 104741,
      "casesFemale": 202238,
      "deathsMale": 28173,
      "deathsFemale": 33576,
      "casesMalePer100k": 4587.5,
      "casesFemalePer100k": 5535.9,
      "deathsMalePer100k": 1233.9,
      "deathsFemalePer100k": 919.1,
      "hospitalization": {
        "cases7Days": 709,
        "incidence7Days": 709,
        "date": "2021-10-25T00:00:00.000Z"
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-10-25T02:34:17.000Z",
    "lastCheckedForUpdate": "2021-10-25T11:07:33.049Z"
  }
}
```

## `/germany/history/frozen-incidence`

## `/germany/history/frozen-incidence/:days`

### Request

`GET https://api.corona-zahlen.org/germany/history/frozen-incidence/7`
[Open](/germany/history/frozen-incidence/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": {
    "abbreviation": "Bund",
    "name": "Bundesgebiet",
    "history": [
      {
        "weekIncidence": 213.65875024446805,
        "date": "2021-11-09T00:00:00.000Z"
      },
      {
        "weekIncidence": 232.1218544191271,
        "date": "2021-11-10T00:00:00.000Z"
      },
      {
        "weekIncidence": 249.11060402346553,
        "date": "2021-11-11T00:00:00.000Z"
      },
      {
        "weekIncidence": 263.69059979064883,
        "date": "2021-11-12T00:00:00.000Z"
      },
      {
        "weekIncidence": 277.35784260606,
        "date": "2021-11-13T00:00:00.000Z"
      },
      {
        "weekIncidence": 288.962672625304,
        "date": "2021-11-14T00:00:00.000Z"
      },
      {
        "weekIncidence": 302.97505390864444,
        "date": "2021-11-15T00:00:00.000Z"
      }
    ]
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-11-15T07:26:37.000Z",
    "lastCheckedForUpdate": "2021-11-15T21:12:27.928Z"
  }
}
```

## `/germany/history/hospitalization`

## `/germany/history/hospitalization/:days`

### Request

`GET https://api.corona-zahlen.org/germany/history/hospitalization/7`
[Open](/germany/history/hospitalization/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "cases7Days": 6207,
      "incidence7Days": 7.46,
      "date": "2021-11-13T00:00:00.000Z"
    },
    {
      "cases7Days": 6103,
      "incidence7Days": 7.34,
      "date": "2021-11-14T00:00:00.000Z"
    },
    {
      "cases7Days": 6060,
      "incidence7Days": 7.29,
      "date": "2021-11-15T00:00:00.000Z"
    },
    {
      "cases7Days": 5888,
      "incidence7Days": 7.08,
      "date": "2021-11-16T00:00:00.000Z"
    },
    {
      "cases7Days": 5606,
      "incidence7Days": 6.74,
      "date": "2021-11-17T00:00:00.000Z"
    },
    {
      "cases7Days": 5116,
      "incidence7Days": 6.15,
      "date": "2021-11-18T00:00:00.000Z"
    },
    {
      "cases7Days": 4437,
      "incidence7Days": 5.34,
      "date": "2021-11-19T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-11-19T03:01:47.000Z",
    "lastCheckedForUpdate": "2021-11-19T15:34:49.633Z"
  }
}
```
