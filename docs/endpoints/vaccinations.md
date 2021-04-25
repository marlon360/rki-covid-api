# Vaccinations

## `/vaccinations`

### Request

`GET https://api.corona-zahlen.org/vaccinations`
[Open](/vaccinations)

### Response

`administeredVaccinations` The total number of administered vaccine doses (sum of first and second vaccination)

`vaccinated` Number of people who got the first of two vaccinations.

`vaccination.biontech` Number of people who were vaccinated with BioNTech

`vaccination.moderna` Number of people who were vaccinated with Moderna

`vaccination.astraZeneca` Number of people who were vaccinated with AstraZeneca

`delta` New first vaccination compared to yesterday

`secondVaccination.vaccinated` Number of people who got the second vaccination

`secondVaccination.delta` New second vaccinations compared to yesterday

`secondVaccination.vacciantion.biontech` Number of people who received their second dose of BioNTech

`secondVaccination.vacciantion.moderna` Number of people who received their second dose of Moderna

`secondVaccination.vacciantion.astraZeneca` Number of people who received their second dose of AstraZeneca

-ATTENTION- since 2021-04-08 the RKI droped the indication information!

```json
{
  "data": {
    "administeredVaccinations": 3116122,
    "vaccinated": 2212851,
    "vaccination": {
      "biontech": 2160072,
      "moderna": 52779,
      "astraZeneca": 15
    },
    "delta": 49890,
    "quote": 0.026607412670196853,
    "secondVaccination": {
      "vaccinated": 903271,
      "vaccination": {
        "biontech": 903263,
        "moderna": 8,
        "astraZeneca": 0
      },
      "delta": 61132,
      "quote": 0.010860968158281503
    },
    "indication": {
      "age": 774875,
      "job": 1038877,
      "medical": 79857,
      "nursingHome": 636362,
      "secondVaccination": {
        "age": 300861,
        "job": 436339,
        "medical": 35389,
        "nursingHome": 307312
      }
    },
    "states": {
      "BW": {
        "name": "Baden-Württemberg",
        "administeredVaccinations": 365886,
        "vaccinated": 269728,
        "vaccination": {
          "biontech": 262064,
          "moderna": 7664,
          "astraZeneca": 15
        },
        "delta": 9495,
        "quote": 0.024298957316289855,
        "secondVaccination": {
          "vaccinated": 96158,
          "vaccination": {
            "biontech": 96150,
            "moderna": 8,
            "astraZeneca": 0
          },
          "delta": 6537,
          "quote": 0.008662575400476775
        },
        "indication": {
          "age": 154667,
          "job": 92072,
          "medical": 9113,
          "nursingHome": 51870,
          "secondVaccination": {
            "age": 57142,
            "job": 31510,
            "medical": 1583,
            "nursingHome": 17543
          }
        }
      },
      // ...
      "TH": {
        "name": "Thüringen",
        "administeredVaccinations": 85878,
        "vaccinated": 65341,
        "vaccination": {
          "biontech": 63489,
          "moderna": 1852,
          "astraZeneca": 15
        },
        "delta": 2798,
        "quote": 0.030627952477245007,
        "secondVaccination": {
          "vaccinated": 20537,
          "vaccination": {
            "biontech": 20537,
            "moderna": 0,
            "astraZeneca": 0
          },
          "delta": 2007,
          "quote": 0.009626517194796234
        },
        "indication": {
          "age": 27465,
          "job": 29894,
          "medical": 2603,
          "nursingHome": 7818,
          "secondVaccination": {
            "age": 5801,
            "job": 13396,
            "medical": 500,
            "nursingHome": 2485
          }
        }
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-18T16:52:07.000Z",
    "lastCheckedForUpdate": "2021-01-18T19:58:00.401Z"
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
        "vaccinated": 24080,
        "firstVaccination": 24080,
        "secondVaccination": 0
      },
      {
        "date": "2020-12-28T00:00:00.000Z",
        "vaccinated": 19501,
        "firstVaccination": 19501,
        "secondVaccination": 0
      },
      {
        "date": "2020-12-29T00:00:00.000Z",
        "vaccinated": 42692,
        "firstVaccination": 42692,
        "secondVaccination": 0
      },
      // ...
            {
        "date": "2021-01-16T00:00:00.000Z",
        "vaccinated": 52098,
        "firstVaccination": 52098,
        "secondVaccination": 62
      },
      {
        "date": "2021-01-17T00:00:00.000Z",
        "vaccinated": 31152,
        "firstVaccination": 31152,
        "secondVaccination": 6464
      }
    ]
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-18T16:52:07.000Z",
    "lastCheckedForUpdate": "2021-01-18T19:59:48.164Z"
  }
}
```
