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

`vaccination.novavax` Number of people who were vaccinated with Novavax

`delta` New first vaccination compared to yesterday

`quote` Quote of first vaccinated people (legacy)

`quotes` Quotes by agegroups

`quotes.total` Quote of first vaccinated people (same as `quote`)

`quotes.A05-A17` Quote of first vaccinated people in age-group < 18 years

`quotes.A05-A17.total` Quote of first vaccinated people with age < 18 years

`quotes.A05-A17.A05-A11` Quote of first vaccinated people with age >=5 to <=11 years

`quotes.A05-A17.A12-A17` Quote of first vaccinated people with age >=12 to <=17 years

`quotes.A18+` Quote of first vaccinated people in agegroup >= 18 years

`quotes.A18+.total` Quote of first vaccinated people with age >= 18 years

`quotes.A18+.A18-A59` Quote of first vaccinated people with age >= 18 to <= 59 years

`quotes.A18+.A60+` Quote of first vaccinated people with age >= 60 years

`secondVaccination.vaccinated` Number of people who got the second vaccination

`secondVaccination.vaccination.biontech` Number of people who received their second dose of BioNTech

`secondVaccination.vaccination.moderna` Number of people who received their second dose of Moderna

`secondVaccination.vaccination.astraZeneca` Number of people who received their second dose of AstraZeneca

`secondVaccination.vaccination.novavax` Number of people who received their second dose of Novavax

`secondVaccination.delta` New second vaccinations compared to yesterday

`secondVaccination.quote` Quote of full vaccinated people (legacy)

`secondVaccination.quotes` Quotes of full vaccinated people by agegroups

`secondVaccination.quotes.total` Quote of full vaccinated people (same as `secondVaccination.quote`)

`secondVaccination.quotes.A05-A17` Quote of full vaccinated people in age-group < 18 years

`secondVaccination.quotes.A05-A17.total` Quote of full vaccinated people with age < 18 years

`secondVacciantion.quotes.A05-A17.A05-A11` Quote of full vaccinated people with age >=5 to <=11 years

`secondVaccination.quotes.A05-A17.A12-A17` Quote of full vaccinated people with age >=12 to <=17 years

`secondVaccination.quotes.A18+` Quote of full vaccinated people with agegroup >= 18 years

`secondVaccination.quotes.A18+.total` Quote of full vaccinated people with age >= 18 years

`secondVaccination.quotes.A18+.A18-A59` Quote of full vaccinated people with age >= 18 to <= 59 years

`secondVaccination.quotes.A18+.A60+` Quote of full vaccinated people with age >= 60 years

`boostervaccination.vaccinated` Number of people who got the booster vaccination

`boosterVaccination.vaccination.biontech` Number of people who received their booster dose of BioNTech

`boosterVaccination.vaccination.moderna` Number of people who received their booster dose of Moderna

`boosterVaccination.vaccination.janssen` Number of people who received their booster dose of Janssen

`boosterVaccination.delta` New booster vaccinations compared to yesterday

`boosterVaccination.quote` Quote of boostered people (legacy)

`boosterVaccination.quotes` Quotes of boostered people by agegroups

`boosterVaccination.quotes.total` Quote of boostered people (same as `boosterVaccination.quote`)

`boosterVaccination.quotes.A05-A17` Quote of boostered people in age-group < 18 years

`boosterVacciantion.quotes.A05-A17.total` Quote of boostered people with age < 18 years

`boosterVaccination.quotes.A05-A17.A05-A11` Quote of boostered people with age >=5 to <=11 years

`boosterVaccination.quotes.A05-A17.A12-A17` Quote of boostered people with age >=12 to <=17 years

`boosterVaccination.quotes.A18+` Quote of boostered people with agegroup >= 18 years

`boosterVaccination.quotes.A18+.total` Quote of boostered people with age >= 18 years

`boosterVaccination.quotes.A18+.A18-A59` Quote of boostered people with age >= 18 to <= 59 years

`boosterVaccination.quotes.A18+.A60+` Quote of boostered people with age >= 60 years

_ATTENTION_ since 2021-04-08 the RKI dropped the indication information!

```json
{
  "data":{
    "administeredVaccinations":165778972,
    "vaccinated":63091660,
    "vaccination":{
      "biontech":45148040,
      "moderna":5068927,
      "astraZeneca":9274331,
      "janssen":3600362,
      "novavax":null
    },
    "delta":28255,
    "quote":0.759,
    "quotes":{
      "total":0.759,
      "A05-A17":{
        "total":0.394,
        "A05-A11":0.185,
        "A12-A17":0.639
      },
      "A18+":{
        "total":0.854,
        "A18-A59":0.788,
        "A60+":0.886
      }
    },
    "secondVaccination":{
      "vaccinated":61692608,
      "vaccination":{
        "biontech":48513441,
        "moderna":6105850,
        "astraZeneca":3472955,
        "novavax":null
      },
      "delta":61342,
      "quote":0.742,
      "quotes":{
        "total":0.742,
        "A05-A17":{
          "total":0.329,
          "A05-A11":0.103,
          "A12-A17":0.592
        },
        "A18+":{
          "total":0.843,
          "A18-A59":0.822,
          "A60+":0.882
        }
      }
    },
    "boosterVaccination":{
      "vaccinated":44595066,
      "vaccination":{
        "biontech":27354329,
        "moderna":17221883,
        "janssen":13940
      },
      "delta":244327,
      "quote":0.536,
      "quotes":{
        "total":0.536,
        "A05-A17":{
          "total":0.224,
          "A05-A11":null,
          "A12-A17":0.224
        },
        "A18+":{
          "total":0.628,
          "A18-A59":0.564,
          "A60+":0.747
        }
      }
    },
    "latestDailyVaccinations":{
      "date":"2022-02-02T00:00:00.000Z",
      "vaccinated":28255,
      "firstVaccination":28255,
      "secondVaccination":61342,
      "boosterVaccination":244327
    },
    "states":{
      "BW":{
        "name":"Baden-Württemberg",
        "administeredVaccinations":21653961,
        "vaccinated":8147963,
        "vaccination":{
          "biontech":5854442,
          "moderna":634312,
          "astraZeneca":1179774,
          "janssen":479435,
          "novavax":null
        },
        "delta":3253,
        "quote":0.734,
        "quotes":{
          "total":0.734,
          "A05-A17":{
            "total":0.372,
            "A05-A11":0.165,
            "A12-A17":0.608
          },
          "A18+":{
            "total":0.829,
            "A18-A59":0.767,
            "A60+":0.874
          }
        },
        "secondVaccination":{
          "vaccinated":8058055,
          "vaccination":{
            "biontech":6400109,
            "moderna":778778,
            "astraZeneca":399733,
            "novavax":null
          },
          "delta":6900,
          "quote":0.726,
          "quotes":{
            "total":0.726,
            "A05-A17":{
              "total":0.312,
              "A05-A11":0.09,
              "A12-A17":0.564
            },
            "A18+":{
              "total":0.829,
              "A18-A59":0.81,
              "A60+":0.868
            }
          }
        },
        "boosterVaccination":{
          "vaccinated":5927378,
          "vaccination":{
            "biontech":3603852,
            "moderna":2321635,
            "janssen":395
          },
          "delta":22633,
          "quote":0.534,
          "quotes":{
            "total":0.534,
            "A05-A17":{
              "total":0.245,
              "A05-A11":null,
              "A12-A17":0.312
            },
            "A18+":{
              "total":0.626,
              "A18-A59":0.575,
              "A60+":0.73
            }
          }
        }
      },
      ...
      "Bund":{
        "name":"Bundesressorts",
        "administeredVaccinations":522103,
        "vaccinated":201333,
        "vaccination":{
          "biontech":89660,
          "moderna":83274,
          "astraZeneca":20261,
          "janssen":8138,
          "novavax":null
        },
        "delta":21,
        "quote":null,
        "quotes":{
          "total":null,
          "A05-A17":{
            "total":null,
            "A05-A11":null,
            "A12-A17":null
          },
          "A18+":{
            "total":null,
            "A18-A59":null,
            "A60+":null
          }
        },
        "secondVaccination":{
          "vaccinated":193648,
          "vaccination":{
            "biontech":88886,
            "moderna":86782,
            "astraZeneca":9842,
            "novavax":null
          },
          "delta":66,
          "quote":null,
          "quotes":{
            "total":null,
            "A05-A17":{
              "total":null,
              "A05-A11":null,
              "A12-A17":null
            },
            "A18+":{
              "total":null,
              "A18-A59":null,
              "A60+":null
            }
          }
        },
        "boosterVaccination":{
          "vaccinated":135260,
          "vaccination":{
            "biontech":103136,
            "moderna":32105,
            "janssen":2
          },
          "delta":521,
          "quote":null,
          "quotes":{
            "total":null,
            "A05-A17":{
              "total":null,
              "A05-A11":null,
              "A12-A17":null
            },
            "A18+":{
              "total":null,
              "A18-A59":null,
              "A60+":null
            }
          }
        }
      }
    }
  },
  "meta":{
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2022-02-03T08:17:51.000Z",
    "lastCheckedForUpdate":"2022-02-03T15:06:37.103Z"
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
