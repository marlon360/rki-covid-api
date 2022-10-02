# Districts

## `/districts`

### Request

`GET https://api.corona-zahlen.org/districts`
[Open](/districts)

### Response

```json
{
  "data": {
    "10041": {
      "ags": "10041",
      "name": "Regionalverband Saarbrücken",
      "county": "LK Stadtverband Saarbrücken",
      "population": 328714,
      "cases": 7716,
      "deaths": 240,
      "casesPerWeek": 149,
      "deathsPerWeek": 2,
      "recovered": 6669,
      "weekIncidence": 45.328157608133516,
      "casesPer100k": 2347.329289290995,
      "delta": {
        "cases": 0,
        "deaths": 0,
        "recovered": 159
      }
    },
    "10042": {
      "ags": "10042",
      "name": "Merzig-Wadern",
      "county": "LK Merzig-Wadern",
      "population": 103243,
      "cases": 1850,
      "deaths": 27,
      "casesPerWeek": 118,
      "deathsPerWeek": 0,
      "recovered": 1603,
      "weekIncidence": 114.29346299506987,
      "casesPer100k": 1791.889038482028,
      "delta": {
        "cases": 4,
        "deaths": 0,
        "recovered": 6
      }
    },
    // ...
    "09780": {
      "ags": "09780",
      "name": "Oberallgäu",
      "county": "LK Oberallgäu",
      "population": 156008,
      "cases": 2846,
      "deaths": 30,
      "casesPerWeek": 96,
      "deathsPerWeek": 0,
      "recovered": 2007,
      "weekIncidence": 61.53530588174966,
      "casesPer100k": 1824.2654222860367,
      "delta": {
        "cases": 0,
        "deaths": 0,
        "recovered": 14
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-04T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:56:27.430Z"
  }
}
```

## `/districts/age-groups`

### Request

`GET https://api.corona-zahlen.org/districts/age-groups`
[Open](/districts/age-groups)

### Response

```json
{
  "data": {
    "10041": {
      "A00-A04": {
        "casesMale": 1881,
        "casesFemale": 1815,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 25003.3,
        "casesFemalePer100k": 25599.4,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0
      },
      "A05-A14": {
        "casesMale": 8077,
        "casesFemale": 7593,
        "deathsMale": 0,
        "deathsFemale": 0,
        "casesMalePer100k": 57887.2,
        "casesFemalePer100k": 58479.7,
        "deathsMalePer100k": 0,
        "deathsFemalePer100k": 0
      },
      "A15-A34": {
        "casesMale": 19697,
        "casesFemale": 21265,
        "deathsMale": 1,
        "deathsFemale": 3,
        "casesMalePer100k": 48635.8,
        "casesFemalePer100k": 57507.2,
        "deathsMalePer100k": 2.5,
        "deathsFemalePer100k": 8.1
      },
      "A35-A59": {
        //...
      },
      "A60-A79": {
        //...
      },
      "A80+": {
        //...
      }
    },
    ...
    "09780": {
      "A00-A04": {
        //...
      },
      "A05-A14": {
        //...
      },
      "A15-A34": {
        //...
      },
      "A35-A59": {
        "casesMale": 12817,
        "casesFemale": 14198,
        "deathsMale": 14,
        "deathsFemale": 3,
        "casesMalePer100k": 48164.3,
        "casesFemalePer100k": 52032.1,
        "deathsMalePer100k": 52.6,
        "deathsFemalePer100k": 11
      },
      "A60-A79": {
        "casesMale": 4540,
        "casesFemale": 4672,
        "deathsMale": 46,
        "deathsFemale": 17,
        "casesMalePer100k": 26084.5,
        "casesFemalePer100k": 24713,
        "deathsMalePer100k": 264.3,
        "deathsFemalePer100k": 89.9
      },
      "A80+": {
        "casesMale": 1009,
        "casesFemale": 1305,
        "deathsMale": 57,
        "deathsFemale": 60,
        "casesMalePer100k": 20379.7,
        "casesFemalePer100k": 18650.9,
        "deathsMalePer100k": 1151.3,
        "deathsFemalePer100k": 857.5
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-10-01T01:11:26.000Z",
    "lastCheckedForUpdate": "2022-10-01T23:32:50.616Z"
  }
}
```

## `/districts/:ags`

Returns the data for a single district identified by `:ags` AGS (Allgemeiner Gemeinde Schlüssel).

### Request

`GET https://api.corona-zahlen.org/districts/02000`
[Open](/districts/02000)

| Parameter | Description                    |
| --------- | ------------------------------ |
| :ags      | Allgemeiner Gemeinde Schlüssel |

### Response

```json
{
  "data": {
    "02000": {
      "ags": "02000",
      "name": "Hamburg",
      "county": "SK Hamburg",
      "population": 1847253,
      "cases": 37535,
      "deaths": 661,
      "casesPerWeek": 2027,
      "deathsPerWeek": 2,
      "recovered": 27864,
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
    "lastCheckedForUpdate": "2021-01-04T13:59:49.832Z"
  }
}
```

## `/districts/history`

Redirects to `/districts/history/cases`

## `/districts/history/cases`

## `/districts/history/cases/:days`

## `/districts/history/frozen-incidence`

## `/districts/history/frozen-incidence/:days`

### Request

`GET https://api.corona-zahlen.org/districts/history/frozen-incidence/7`
[Open](/districts/history/frozen-incidence/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

## `/districts/history/incidence`

## `/districts/history/incidence/:days`

## `/districts/history/deaths`

## `/districts/history/deaths/:days`

## `/districts/history/recovered`

## `/districts/history/recovered/:days`

## `/districts/:ags/age-groups`

## `/districts/:ags/history/cases`

## `/districts/:ags/history/cases/:days`

## `/districts/:ags/history/incidence`

## `/districts/:ags/history/incidence/:days`

## `/districts/:ags/history/frozen-incidence`

## `/districts/:ags/history/frozen-incidence/:days`

## `/districts/:ags/history/deaths`

## `/districts/:ags/history/deaths/:days`

## `/districts/:ags/history/recovered`

## `/districts/:ags/history/recovered/:days`
