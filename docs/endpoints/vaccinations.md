# Vaccinations

## `/vaccinations`

### Request

`GET https://api.corona-zahlen.org/vaccinations`
[Open](/vaccinations)

### Response

```json
{
  "data": {
    "vaccinated": 265986,
    "delta": 22892,
    "vaccinatedPer1k": 3.1982267520474625,
    "quote": 0.0031982267520474623,
    "indication": {
      "age": 62805,
      "job": 123103,
      "medical": 7999,
      "nursingHome": 114654
    },
    "states": {
      "BW": {
        "name": "Baden-Württemberg",
        "vaccinated": 27454,
        "delta": 3390,
        "vaccinatedPer1k": 2.473245544257258,
        "quote": 0.002473245544257258,
        "indication": {
          "age": 12584,
          "job": 8739,
          "medical": 1469,
          "nursingHome": 4932
        }
      },
      "BY": {
        "name": "Bayern",
        "vaccinated": 66258,
        "delta": 8425,
        "vaccinatedPer1k": 5.048329730340502,
        "quote": 0.0050483297303405015,
        "indication": {
          "age": 15480,
          "job": 31755,
          "medical": 1280,
          "nursingHome": 23823
        }
      },
      // ...
      "TH": {
        "name": "Thüringen",
        "vaccinated": 810,
        "vaccinatedPer1k": 0.37967955045941226,
        "quote": 0.00037967955045941227,
        "indication": {
          "age": 232,
          "job": 297,
          "medical": 0,
          "nursingHome": 413
        }
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-04T14:32:08.399Z",
    "lastCheckedForUpdate": "2021-01-04T14:32:08.400Z"
  }
}
```

## `/vaccinations/history`

### Request

`GET https://api.corona-zahlen.org/vaccinations/history`
[Open](/vaccinations/history)

### Response

```json
{
  "data": {
    "history": [
      {
        "date": "2020-12-27T00:00:00.000Z",
        "vaccinated": 23672
      },
      {
        "date": "2020-12-28T00:00:00.000Z",
        "vaccinated": 19084
      },
      {
        "date": "2020-12-29T00:00:00.000Z",
        "vaccinated": 42268
      },
      // ...
      {
        "date": "2021-01-10T00:00:00.000Z",
        "vaccinated": 32069
      },
      {
        "date": "2021-01-11T00:00:00.000Z",
        "vaccinated": 62871
      },
      {
        "date": "2021-01-12T00:00:00.000Z",
        "vaccinated": 69178
      }
    ]
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-13T14:44:14.000Z",
    "lastCheckedForUpdate": "2021-01-13T15:43:03.880Z"
  }
}
```