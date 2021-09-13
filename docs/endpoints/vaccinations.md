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

`vaccination.janssen` Number of people who were vaccinated with Janssen

`delta` New first vaccination compared to yesterday

`quote` Quote of first vaccinated people

`secondVaccination.vaccinated` Number of people who got the second vaccination

`secondVaccination.delta` New second vaccinations compared to yesterday

`secondVaccination.quote` Quote of full vaccinated people

`secondVaccination.vaccination.biontech` Number of people who received their second dose of BioNTech

`secondVaccination.vaccination.moderna` Number of people who received their second dose of Moderna

`secondVaccination.vaccination.astraZeneca` Number of people who received their second dose of AstraZeneca

`boosterVaccination.vaccination.biontech` Number of people who received their booster dose of BioNTech

`boosterVaccination.vaccination.moderna` Number of people who received their booster dose of Moderna

`boosterVaccination.vaccination.janssen` Number of people who received their booster dose of Janssen

`boosterVaccination.delta` New booster vaccinations compared to yesterday

_ATTENTION_ since 2021-04-08 the RKI dropped the indication information!

```json
{
  "data": {
    "administeredVaccinations":103814560,
    "vaccinated":55144235,
    "vaccination": {
      "biontech":38539475,
      "moderna":4420627,
      "astraZeneca":9226749,
      "janssen":2957384
    },
    "delta":97944,
    "quote":0.6629999999999999,
    "secondVaccination": {
      "vaccinated":51465242,
      "vaccination": {
        "biontech":40000635,
        "moderna":5066122,
        "astraZeneca":3441101
      },
      "delta":118952,
      "quote":0.619},
      "boosterVaccination": {
        "vaccinated":162467,
        "vaccination": {
          "biontech":152383,
          "moderna":9534,
          "janssen":498
        },
        "delta":26896
      },
      "latestDailyVaccinations": {
        "date":"2021-09-09T00:00:00.000Z",
        "vaccinated":97944,
        "firstVaccination":97944,
        "secondVaccination":118952,
        "boosterVaccination":26896
      },
      "indication": {
        "age":null,
        "job":null,
        "medical":null,
        "nursingHome":null,
        "secondVaccination": {
          "age":null,
          "job":null,
          "medical":null,
          "nursingHome":null
        }
      },
      "states": {
        "BW": {
          "name":"Baden-Württemberg",
          "administeredVaccinations":13452010,
          "vaccinated":7059693,
          "vaccination": {
            "biontech":4957525,
            "moderna":548708,
            "astraZeneca":1174218,
            "janssen":379242
          },
          "delta":12951,
          "quote":0.636,
          "secondVaccination": {
            "vaccinated":6739559,
            "vaccination": {
              "biontech":5318060,
              "moderna":645030,
              "astraZeneca":397227
            },
            "delta":12400,
            "quote":0.607
          },
          "boosterVaccination": {
            "vaccinated":32000,
            "vaccination": {
              "biontech":30952,
              "moderna":1047,
              "janssen":1
            },
            "delta":4552
          },
          "indication": {
            "age":null,
            "job":null,
            "medical":null,
            "nursingHome":null,
            "secondVaccination": {
              "age":null,
              "job":null,
              "medical":null,
              "nursingHome":null
            }
          }
        },
        // ...
        "Bund": {
          "name":"ImpfzentrenBund",
          "administeredVaccinations":360252,
          "vaccinated":187858,
          "vaccination": {
            "biontech":80905,
            "moderna":82127,
            "astraZeneca":19590,
            "janssen":5236
          },
          "delta":123,
          "quote":null,
          "secondVaccination": {
            "vaccinated":177597,
            "vaccination": {
              "biontech":79462,
              "moderna":84337,
              "astraZeneca":8562
            },
            "delta":194,
            "quote":null
          },
          "boosterVaccination": {
            "vaccinated":33,
            "vaccination": {
              "biontech":23,
              "moderna":10,
              "janssen":0
            },
            "delta":2
          },
          "indication": {
            "age":null,
            "job":null,
            "medical":null,
            "nursingHome":null,
            "secondVaccination": {
              "age":null,
              "job":null,
              "medical":null,
              "nursingHome":null
            }
          }
        }
      }
    },
    "meta": {
      "source":"Robert Koch-Institut",
      "contact":"Marlon Lueckert (m.lueckert@me.com)",
      "info":"https://github.com/marlon360/rki-covid-api",
      "lastUpdate":"2021-09-10T08:05:30.000Z",
      "lastCheckedForUpdate":"2021-09-12T19:05:52.074Z"
    }
  }
}
```

## `/vaccinations/history`

### Request

`GET https://api.corona-zahlen.org/vaccinations/history`
[Open](/vaccinations/history)

### Response

```json
{"data": {
  "history": [
    {
      "date":"2020-12-27T00:00:00.000Z",
      "vaccinated":24343,
      "firstVaccination":24343,
      "secondVaccination":0,
      "boosterVaccination":0
    },
    {
      "date":"2020-12-28T00:00:00.000Z",
      "vaccinated":18035,
      "firstVaccination":18035,
      "secondVaccination":0,
      "boosterVaccination":0
    },
    // ...
    {
      "date":"2021-09-08T00:00:00.000Z",
      "vaccinated":101815,
      "firstVaccination":101815,
      "secondVaccination":127310,
      "boosterVaccination":26017
    },
    {
      "date":"2021-09-09T00:00:00.000Z",
      "vaccinated":97944,
      "firstVaccination":97944,
      "secondVaccination":118952,
      "boosterVaccination":26896
    }
  ]
},
"meta": {
  "source":"Robert Koch-Institut",
  "contact":"Marlon Lueckert (m.lueckert@me.com)",
  "info":"https://github.com/marlon360/rki-covid-api",
  "lastUpdate":"2021-09-10T08:05:30.000Z",
  "lastCheckedForUpdate":"2021-09-12T19:11:29.601Z"
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
