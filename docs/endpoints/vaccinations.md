# Vaccinations

## `/vaccinations`

### Request

`GET https://api.corona-zahlen.org/vaccinations`
[Open](/vaccinations)

### Response

`administeredVaccinations` The total number of administered vaccine doses (sum of first and second vaccination)

`latestDailyVaccinations` The most recent entry of the history endpoint. Here, Janssen is counted only as first vaccination.
Hence, you may use this object to calculate the number of vaccinations on the last report day (see remark!)

`vaccinated` Number of people who got the first of two vaccinations.

`vaccination.biontech` Number of people who were vaccinated with BioNTech

`vaccination.moderna` Number of people who were vaccinated with Moderna

`vaccination.astraZeneca` Number of people who were vaccinated with AstraZeneca

`vaccination.janssen` Number of people who were vaccinated with Janssen (only one dose of Janssen is needed for full protection! see remark!)

`delta` New first vaccination compared to yesterday

`secondVaccination.vaccinated` Number of people who got the second vaccination

`secondVaccination.delta` New second vaccinations compared to yesterday

`secondVaccination.vacciantion.biontech` Number of people who received their second dose of BioNTech

`secondVaccination.vacciantion.moderna` Number of people who received their second dose of Moderna

`secondVaccination.vacciantion.astraZeneca` Number of people who received their second dose of AstraZeneca

`secondVaccination.vacciantion.janssen` Number of people who received one dose of Janssen (only one dose of Janssen is needed for full protection! see remark!)

_ATTENTION_ since 2021-04-08 the RKI dropped the indication information!

_ATTENTION_ vaccinations with Janssen are counted as both `firstVaccination` and `secondVaccination` but are only counted once in `administeredVaccinations`!

```json
{
  "data": {
    "administeredVaccinations": 59038531,
    "vaccinated": 39539170,
    "vaccination": {
      "biontech": 26409579,
      "moderna": 3156060,
      "astraZeneca": 8824431,
      "janssen": 1149100
    },
    "delta": 425836,
    "quote": 0.475,
    "secondVaccination": {
      "vaccinated": 20648461,
      "vaccination": {
        "biontech": 16923135,
        "moderna": 1535896,
        "astraZeneca": 1040330,
        "janssen": 1149100
      },
      "delta": 756442,
      "quote": 0.248
    },
    "latestDailyVaccinations": {
      "date": "2021-06-10T00:00:00.000Z",
      "vaccinated": 425836,
      "firstVaccination": 425836,
      "secondVaccination": 670685
    },
    "indication": {
      "age": null,
      "job": null,
      "medical": null,
      "nursingHome": null,
      "secondVaccination": {
        "age": null,
        "job": null,
        "medical": null,
        "nursingHome": null
      }
    },
    "states": {
      "BW": {
        "name": "Baden-Württemberg",
        "administeredVaccinations": 7711259,
        "vaccinated": 5162993,
        "vaccination": {
          "biontech": 3458328,
          "moderna": 443518,
          "astraZeneca": 1129631,
          "janssen": 131516
        },
        "delta": 54493,
        "quote": 0.465,
        "secondVaccination": {
          "vaccinated": 2679782,
          "vaccination": {
            "biontech": 2171831,
            "moderna": 211981,
            "astraZeneca": 164454,
            "janssen": 131516
          },
          "delta": 105744,
          "quote": 0.24100000000000002
        },
        "indication": {
          "age": null,
          "job": null,
          "medical": null,
          "nursingHome": null,
          "secondVaccination": {
            "age": null,
            "job": null,
            "medical": null,
            "nursingHome": null
          }
        }
      },
      // ...
      "Bund": {
        "name": "Bundesressorts",
        "administeredVaccinations": 194302,
        "vaccinated": 135585,
        "vaccination": {
          "biontech": 39751,
          "moderna": 73836,
          "astraZeneca": 18293,
          "janssen": 3705
        },
        "delta": 6622,
        "quote": null,
        "secondVaccination": {
          "vaccinated": 62422,
          "vaccination": {
            "biontech": 2038,
            "moderna": 50093,
            "astraZeneca": 6586,
            "janssen": 3705
          },
          "delta": 2140,
          "quote": null
        },
        "indication": {
          "age": null,
          "job": null,
          "medical": null,
          "nursingHome": null,
          "secondVaccination": {
            "age": null,
            "job": null,
            "medical": null,
            "nursingHome": null
          }
        }
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-06-11T07:54:35.000Z",
    "lastCheckedForUpdate": "2021-06-11T15:15:11.385Z"
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

## `/vaccinations/history/:days`

### Request

`GET https://api.corona-zahlen.org/vaccinations/history/7`
[Open](/vaccinations/history/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |
