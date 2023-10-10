# Vaccinations

## `/vaccinations`

Since 2023-06-14 the data is updated monthly, on the second Tuesday of each month !

### Request

`GET https://api.corona-zahlen.org/vaccinations`
[Open](/vaccinations)

### Response

`administeredVaccinations` The total number of administered vaccine doses (sum of first, second, 1st booster, 2nd booster, 3rd booster and 4th booster vaccination)

`vaccinated` Number of people who got the first vaccination.

`vaccination.biontech` Number of people who were vaccinated with BioNTech, trade name: `Comirnaty - BioNTech/Pfizer`

`vaccination.moderna` Number of people who were vaccinated with Moderna, trade name: `Spikevax - Moderna`

`vaccination.astraZeneca` Number of people who were vaccinated with AstraZeneca, trade name: `Vaxzevria - AstraZeneca`

`vaccination.janssen` Number of people who were vaccinated with Janssen, trade name: `Jcovden - Janssen‑Cilag/Johnson & Johnson`

`vaccination.novavax` Number of people who were vaccinated with Novavax, trade name: `Nuvaxovid - Novavax`

`vaccination.valneva` Number of people who were vaccinated with Valneva, trade name: `Valneva - Valneva`

`vaccination.biontechBivalent` Number of people who are vaccinated with biontechBivalent, trade name: `Comirnaty bivalent (Original/Omikron)` or `Comirnaty Original/Omicron BA.1` or `Comirnaty Original/Omicron BA.4-5` - `BioNTech/Pfizer` or `Comirnaty Omicron XBB.1.5`

`vacciantion.modernaBivalent` Number of people who are vaccinated with modernaBivalent, trade name: `Spikevax bivalent (Original/Omikron)` or `Spikevax bivalent Original/Omicron BA.1` or `Spikevax bivalent Original/Omicron BA.4-5` - `Moderna`

`vaccination.biontechInfant` Number of people who are vaccinated with biontechInfant, trade name: `Comirnaty-Kleinkinder: BioNTech/Pfizer`

`vaccination.vidPrevtynBeta` Number of people who are vaccinated with VidPrevtynBeta, trade name: `VidPrevtyn Beta - Sanofi Pasteur`

`vaccination.deltaBiontech` New first vaccination with biontech vaccine compared to last reporting day

`vaccination.deltaModerna` New first vaccination with moderna vaccine compared to last reporting day

`vaccination.deltaAstraZeneca` New first vaccination with astra zeneca vaccine compared to last reporting day

`vaccination.deltaJanssen` New first vaccination with janssen vaccine compared to last reporting day

`vaccination.deltaNovavax` New first vaccination with novavax vaccine compared to last reporting day

`vaccination.deltaValneva` New first vaccination with valneva vaccine compared to last reporting day

`vaccination.deltaBiontechBivalent` New first vaccination with biontechBivalent vaccine compared to last reporting day

`vacciantion.deltaModernaBivalent` New first vaccination with modernaBivalent vaccine compared to last reporting day

`vaccination.deltaBiontechInfant` New first vaccination with biontechInfant vaccine compared to last reporting day

`vaccination.deltaVidPrevtynBeta` New first vaccination with vidPrevtynBeta vaccine compared to last reporting day

`delta` New first vaccination compared to last reporting day

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

`secondVaccination` as described above

`boostervaccination` as described above

`2ndBoosterVaccination` as described above

`3rdBoosterVacciantion` as described above, but no quotes are provided

`4thBoosterVaccination` as described above, but no quotes are provided

```json
{
  "data":{
    "administeredVaccinations":192253165,
    "vaccinated":64878097,
    "vaccination":{
      "astraZeneca":9278870,
      "biontech":46634986,
      "janssen":3713472,
      "moderna":5149687,
      "novavax":73735,
      "valneva":2787,
      "biontechBivalent":23213,
      "modernaBivalent":341,
      "biontechInfant":975,
      "vidPrevtynBeta":10,
      "deltaAstraZeneca":5,
      "deltaBiontech":209,
      "deltaJanssen":-2,
      "deltaModerna":34,
      "deltaNovavax":10,
      "deltaValneva":3,
      "deltaBiontechBivalent":450,
      "deltaModernaBivalent":0,
      "deltaBiontechInfant":0,
      "deltaVidPrevtynBeta":0
    },
    "delta":709,
    "quote":0.779,
    "quotes":{
      "total":0.779,
      "A05-A17":{
        "total":0.461,
        "A05-A11":0.224,
        "A12-A17":0.745
      },
      "A18+":{
        "total":0.869,
        "A18-A59":0.848,
        "A60+":0.909
      }
    },
    "secondVaccination":{
      // ...
    },
    "boosterVaccination":{
      // ...
    },
    "2ndBoosterVaccination":{
      // ...
    },
    "3rdBoosterVaccination":{
      "vaccinated":1174729,
      "vaccination":{
        "astraZeneca":33,
        "biontech":129496,
        "janssen":2233,
        "moderna":5351,
        "novavax":898,
        "valneva":293,
        "biontechBivalent":1020256,
        "modernaBivalent":16090,
        "biontechInfant":null,
        "vidPrevtynBeta":68,
        "deltaAstraZeneca":0,
        "deltaBiontech":89,
        "deltaJanssen":0,
        "deltaModerna":2,
        "deltaNovavax":0,
        "deltaValneva":0,
        "deltaBiontechBivalent":1383,
        "deltaModernaBivalent":29,
        "deltaBiontechInfant":null,
        "deltaVidPrevtynBeta":0
      },
      "delta":1503
    },
    "4thBoosterVaccination":{
      // ...
    },
    "states":{
      "SH":{
        "name":"Schleswig-Holstein",
        "administeredVaccinations":7518937,
        "vaccinated":2356860,
        "vaccination":{
          "astraZeneca":361982,
          "biontech":1667318,
          "janssen":134448,
          "moderna":190488,
          "novavax":2409,
          "valneva":12,
          "biontechBivalent":170,
          "modernaBivalent":5,
          "biontechInfant":28,
          "vidPrevtynBeta":null,
          "deltaAstraZeneca":0,
          "deltaBiontech":3,
          "deltaJanssen":0,
          "deltaModerna":0,
          "deltaNovavax":0,
          "deltaValneva":0,
          "deltaBiontechBivalent":0,
          "deltaModernaBivalent":0,
          "deltaBiontechInfant":0,
          "deltaVidPrevtynBeta":null
        },
        "delta":3,
        "quote":0.807,
        "quotes":{
          "total":0.807,
          "A05-A17":{
            "total":0.606,
            "A05-A11":0.308,
            "A12-A17":0.943
          },
          "A18+":{
            "total":0.878,
            "A18-A59":0.851,
            "A60+":0.923
          }
        },
        "secondVaccination":{
          // ...
        },
        "boosterVaccination":{
          // ...
        },
        "2ndBoosterVaccination":{
          // ...
        },
        "3rdBoosterVaccination":{
          "vaccinated":735769,
          "vaccination":{
            "astraZeneca":null,
            "biontech":55250,
            "janssen":13,
            "moderna":1064,
            "novavax":35,
            "valneva":null,
            "biontechBivalent":53363,
            "modernaBivalent":1374,
            "biontechInfant":null,
            "vidPrevtynBeta":null,
            "deltaAstraZeneca":null,
            "deltaBiontech":54,
            "deltaJanssen":0,
            "deltaModerna":0,
            "deltaNovavax":0,
            "deltaValneva":null,
            "deltaBiontechBivalent":69,
            "deltaModernaBivalent":4,
            "deltaBiontechInfant":null,
            "deltaVidPrevtynBeta":null
          },
          "delta":127
        },
        "4thBoosterVaccination":{
          // ...
        },
        "HH":{
          // ...
        },
        ...
        "TH":{
          // ...
        },
        "Bund":{
          "name":"Bundesressorts",
          "administeredVaccinations":549416,
          "vaccinated":202167,
          "vaccination":{
            "astraZeneca":20399,
            "biontech":90297,
            "janssen":8126,
            "moderna":83293,
            "novavax":35,
            "valneva":3,
            "biontechBivalent":14,
            "modernaBivalent":null,
            "biontechInfant":null,
            "vidPrevtynBeta":null,
            "deltaAstraZeneca":0,
            "deltaBiontech":0,
            "deltaJanssen":0,
            "deltaModerna":0,
            "deltaNovavax":0,
            "deltaValneva":3,
            "deltaBiontechBivalent":3,
            "deltaModernaBivalent":null,
            "deltaBiontechInfant":null,
            "deltaVidPrevtynBeta":null
          },
          "delta":6,
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
            // ...
          },
          "boosterVaccination":{
            // ...
          },
          "2ndBoosterVaccination":{
            // ...
          },
          "3rdBoosterVaccination":{
            // ...
          },
          "4thBoosterVaccination":{
            // ...
          }
        }
      }
  },
  "meta":{
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2023-09-13T15:23:44.000Z",
    "lastCheckedForUpdate":"2023-09-15T05:23:20.644Z"
  }
}
```

## `/vaccinations/states`

### Request

`GET https://api.corona-zahlen.org/vaccinations/states`
[Open](/vaccinations/states)

### Response

This responses only the states data (but not all of Germany)

```json
{
  "data":{
    "SH":{
      "name":"Schleswig-Holstein",
      "administeredVaccinations":7518937,
      "vaccinated":2356860,
      "vaccination":{
        "astraZeneca":361982,
        "biontech":1667318,
        "janssen":134448,
        "moderna":190488,
        "novavax":2409,
        "valneva":12,
        "biontechBivalent":170,
        "modernaBivalent":5,
        "biontechInfant":28,
        "vidPrevtynBeta":null,
        "deltaAstraZeneca":0,
        "deltaBiontech":3,
        "deltaJanssen":0,
        "deltaModerna":0,
        "deltaNovavax":0,
        "deltaValneva":0,
        "deltaBiontechBivalent":0,
        "deltaModernaBivalent":0,
        "deltaBiontechInfant":0,
        "deltaVidPrevtynBeta":null
      },
      "delta":3,
      "quote":0.807,
      "quotes":{
        "total":0.807,
        "A05-A17":{
          "total":0.606,
          "A05-A11":0.308,
          "A12-A17":0.943
        },
        "A18+":{
          "total":0.878,
          "A18-A59":0.851,
          "A60+":0.923
        }
      },
      "secondVaccination":{
        // ...
      },
      "boosterVaccination":{
        // ...
      },
      "2ndBoosterVaccination":{
        // ...
      },
      "3rdBoosterVaccination":{
        "vaccinated":735769,
        "vaccination":{
          "astraZeneca":null,
          "biontech":55250,
          "janssen":13,
          "moderna":1064,
          "novavax":35,
          "valneva":null,
          "biontechBivalent":53363,
          "modernaBivalent":1374,
          "biontechInfant":null,
          "vidPrevtynBeta":null,
          "deltaAstraZeneca":null,
          "deltaBiontech":54,
          "deltaJanssen":0,
          "deltaModerna":0,
          "deltaNovavax":0,
          "deltaValneva":null,
          "deltaBiontechBivalent":69,
          "deltaModernaBivalent":4,
          "deltaBiontechInfant":null,
          "deltaVidPrevtynBeta":null
        },
        "delta":127
      },
      "4thBoosterVaccination":{
        // ...
      }
    },
    ...
    "TH":{
      // ...
    }
  },
  "meta":{
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2023-09-13T15:23:44.000Z",
    "lastCheckedForUpdate":"2023-09-15T07:55:43.754Z"
  }
}
```

## `/vaccinations/states/:state`

### Request

`GET https://api.corona-zahlen.org/vaccinations/states/HH`
[Open](/vaccinations/states/HH)

### Response

```json
{
  "data": {
    "HH": {
      "name": "Hamburg",
      "administeredVaccinations": 4698138,
      "vaccinated": 1607235,
      "vaccination": {
        "astraZeneca": 198265,
        "biontech": 1160160,
        "janssen": 115604,
        "moderna": 131182,
        "novavax": 1425,
        "valneva": 14,
        "biontechBivalent": 553,
        "modernaBivalent": 6,
        "biontechInfant": 26,
        "vidPrevtynBeta": null,
        "deltaAstraZeneca": 0,
        "deltaBiontech": 0,
        "deltaJanssen": 0,
        "deltaModerna": 0,
        "deltaNovavax": 0,
        "deltaValneva": 0,
        "deltaBiontechBivalent": 0,
        "deltaModernaBivalent": 0,
        "deltaBiontechInfant": 0,
        "deltaVidPrevtynBeta": null
      },
      "delta": 0,
      "quote": 0.867,
      "quotes": {
        "total": 0.867,
        "A05-A17": {
          "total": 0.524,
          "A05-A11": 0.298,
          "A12-A17": 0.801
        },
        "A18+": {
          "total": 0.971,
          "A18-A59": 0.967,
          "A60+": 0.98
        }
      },
      "secondVaccination": {
        // ...
      },
      "boosterVaccination": {
        // ...
      },
      "2ndBoosterVaccination": {
        // ...
      },
      "3rdBoosterVaccination": {
        "vaccinated": 301073,
        "vaccination": {
          "astraZeneca": null,
          "biontech": 1686,
          "janssen": 3,
          "moderna": 34,
          "novavax": 28,
          "valneva": null,
          "biontechBivalent": 36936,
          "modernaBivalent": 983,
          "biontechInfant": null,
          "vidPrevtynBeta": 23,
          "deltaAstraZeneca": null,
          "deltaBiontech": 0,
          "deltaJanssen": 0,
          "deltaModerna": 0,
          "deltaNovavax": 0,
          "deltaValneva": null,
          "deltaBiontechBivalent": 48,
          "deltaModernaBivalent": 0,
          "deltaBiontechInfant": null,
          "deltaVidPrevtynBeta": 0
        },
        "delta": 48
      },
      "4thBoosterVaccination": {
        // ...
      }
    },
    "meta": {
      "source": "Robert Koch-Institut",
      "contact": "Marlon Lueckert (m.lueckert@me.com)",
      "info": "https://github.com/marlon360/rki-covid-api",
      "lastUpdate": "2023-09-13T15:23:44.000Z",
      "lastCheckedForUpdate": "2023-09-15T17:55:04.388Z"
    }
  }
}
```

**Parameters**

| Parameter | Description                         |
| --------- | ----------------------------------- |
| :state    | abbreviation of the requested state |

## `/vaccinations/germany`

### Request

`GET https://api.corona-zahlen.org/vaccinations/germany`
[Open](/vaccinations/germany)

### Response

This responses only the germany data

```json
{
  "data": {
    "administeredVaccinations": 192253165,
    "vaccinated": 64878097,
    "vaccination": {
      "astraZeneca": 9278870,
      "biontech": 46634986,
      "janssen": 3713472,
      "moderna": 5149687,
      "novavax": 73735,
      "valneva": 2787,
      "biontechBivalent": 23213,
      "modernaBivalent": 341,
      "biontechInfant": 975,
      "vidPrevtynBeta": 10,
      "deltaAstraZeneca": 5,
      "deltaBiontech": 209,
      "deltaJanssen": -2,
      "deltaModerna": 34,
      "deltaNovavax": 10,
      "deltaValneva": 3,
      "deltaBiontechBivalent": 450,
      "deltaModernaBivalent": 0,
      "deltaBiontechInfant": 0,
      "deltaVidPrevtynBeta": 0
    },
    "delta": 709,
    "quote": 0.779,
    "quotes": {
      "total": 0.779,
      "A05-A17": {
        "total": 0.461,
        "A05-A11": 0.224,
        "A12-A17": 0.745
      },
      "A18+": {
        "total": 0.869,
        "A18-A59": 0.848,
        "A60+": 0.909
      }
    },
    "secondVaccination": {
      // ...
    },
    "boosterVaccination": {
      // ...
    },
    "2ndBoosterVaccination": {
      // ...
    },
    "3rdBoosterVaccination": {
      "vaccinated": 1174729,
      "vaccination": {
        "astraZeneca": 33,
        "biontech": 129496,
        "janssen": 2233,
        "moderna": 5351,
        "novavax": 898,
        "valneva": 293,
        "biontechBivalent": 1020256,
        "modernaBivalent": 16090,
        "biontechInfant": null,
        "vidPrevtynBeta": 68,
        "deltaAstraZeneca": 0,
        "deltaBiontech": 89,
        "deltaJanssen": 0,
        "deltaModerna": 2,
        "deltaNovavax": 0,
        "deltaValneva": 0,
        "deltaBiontechBivalent": 1383,
        "deltaModernaBivalent": 29,
        "deltaBiontechInfant": null,
        "deltaVidPrevtynBeta": 0
      },
      "delta": 1503
    },
    "4thBoosterVaccination": {
      // ...
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2023-09-13T15:23:44.000Z",
    "lastCheckedForUpdate": "2023-09-15T18:03:49.552Z"
  }
}
```

## `/vaccinations/history`

### Request

`GET https://api.corona-zahlen.org/vaccinations/history`
[Open](/vaccinations/history)

### Response

`date` the Date of the following values

`vaccinated` for legacy resons, this is the same as `firstVaccination`

`firstVaccination` First vaccinations of the day

`secondVaccination` Second vaccinations of the day

`firstBoosterVacciation` First booster vaccinations of the day

`secondBoosterVaccination` Second booster vaccinations of the day

`thirdBoosterVaccinations` Third booster vaccinations of the day

`fourthBoosterVaccinations` Fourth booster vaccinations of the day

`totalVaccinationOfTheDay` Total vaccinations of the day

```json
{
  "data":{
    "history":[
      {
        "date":"2020-12-27T00:00:00.000Z",
        "vaccinated":24427,
        "firstVaccination":24427,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "thirdBoosterVaccination":null,
        "fourthBoosterVaccination":null,
        "totalVacciantionOfTheDay":24427
      },{
        "date":"2020-12-28T00:00:00.000Z",
        "vaccinated":18073,
        "firstVaccination":18073,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "thirdBoosterVaccination":null,
        "fourthBoosterVaccination":null,
        "totalVacciantionOfTheDay":18073
      },{
        "date":"2020-12-29T00:00:00.000Z",
        "vaccinated":50229,
        "firstVaccination":50229,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "thirdBoosterVaccination":null,
        "fourthBoosterVaccination":null,
        "totalVacciantionOfTheDay":50229
      },{
        ...
      },{
        "date":"2023-09-10T00:00:00.000Z",
        "vaccinated":null,
        "firstVaccination":null,
        "secondVaccination":1,
        "firstBoosterVaccination":3,
        "secondBoosterVaccination":25,
        "thirdBoosterVaccination":55,
        "fourthBoosterVaccination":10,
        "totalVacciantionOfTheDay":94
      },{
        "date":"2023-09-11T00:00:00.000Z",
        "vaccinated":2,
        "firstVaccination":2,
        "secondVaccination":1,
        "firstBoosterVaccination":2,
        "secondBoosterVaccination":4,
        "thirdBoosterVaccination":2,
        "fourthBoosterVaccination":null,
        "totalVacciantionOfTheDay":11
      }
    ]
  },
  "meta":{
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2023-09-13T15:23:44.000Z",
    "lastCheckedForUpdate":"2023-09-15T17:56:31.170Z"
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

### Response

```json
{
  "data": {
    "history": [
      {
        "date": "2023-09-08T00:00:00.000Z",
        "vaccinated": 7,
        "firstVaccination": 7,
        "secondVaccination": 1,
        "firstBoosterVaccination": 3,
        "secondBoosterVaccination": 21,
        "thirdBoosterVaccination": 59,
        "fourthBoosterVaccination": 10,
        "totalVacciantionOfTheDay": 101
      },
      {
        "date": "2023-09-09T00:00:00.000Z",
        "vaccinated": null,
        "firstVaccination": null,
        "secondVaccination": null,
        "firstBoosterVaccination": null,
        "secondBoosterVaccination": 2,
        "thirdBoosterVaccination": 2,
        "fourthBoosterVaccination": null,
        "totalVacciantionOfTheDay": 4
      },
      {
        "date": "2023-09-10T00:00:00.000Z",
        "vaccinated": null,
        "firstVaccination": null,
        "secondVaccination": 1,
        "firstBoosterVaccination": 3,
        "secondBoosterVaccination": 25,
        "thirdBoosterVaccination": 55,
        "fourthBoosterVaccination": 10,
        "totalVacciantionOfTheDay": 94
      },
      {
        "date": "2023-09-11T00:00:00.000Z",
        "vaccinated": 2,
        "firstVaccination": 2,
        "secondVaccination": 1,
        "firstBoosterVaccination": 2,
        "secondBoosterVaccination": 4,
        "thirdBoosterVaccination": 2,
        "fourthBoosterVaccination": null,
        "totalVacciantionOfTheDay": 11
      }
    ]
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2023-09-13T15:23:44.000Z",
    "lastCheckedForUpdate": "2023-09-15T18:23:18.595Z"
  }
}
```
