# Germany

## `/germany`

### Request

`GET https://v2.rki.marlon-lueckert.de/germany`
[Open](/germany)

### Response

```json
{
  "cases": 1765666,
  "deaths": 34272,
  "recovered": 1381937,
  "weekIncidence": 139.59190955621654,
  "casesPer100k": 2123.044158858224,
  "casesPerWeek": 116094,
  "delta": {
    "cases": 10315,
    "deaths": 312,
    "recovered": 13802
  },
  "r": {
    "value": 0.91,
    "date": "2020-12-29T00:00:00.000Z"
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-03T22:55:41.850Z"
  }
}
```