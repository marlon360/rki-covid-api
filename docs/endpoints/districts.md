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
