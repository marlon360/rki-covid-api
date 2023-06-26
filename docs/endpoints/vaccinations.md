# Vaccinations

## `/vaccinations`

Since 2023-06-14 the data is updated monthly, on the second Tuesday of each month !

### Request

`GET https://api.corona-zahlen.org/vaccinations`
[Open](/vaccinations)

### Response

`administeredVaccinations` The total number of administered vaccine doses (sum of first, second, 1st booster and 2nd booster vaccination)

`vaccinated` Number of people who got the first vaccination.

`vaccination.biontech` Number of people who were vaccinated with BioNTech, trade name: `Comirnaty - BioNTech/Pfizer`

`vaccination.moderna` Number of people who were vaccinated with Moderna, trade name: `Spikevax - Moderna`

`vaccination.astraZeneca` Number of people who were vaccinated with AstraZeneca, trade name: `Vaxzevria - AstraZeneca`

`vaccination.janssen` Number of people who were vaccinated with Janssen, trade name: `Jcovden - Janssen‑Cilag/Johnson & Johnson`

`vaccination.novavax` Number of people who were vaccinated with Novavax, trade name: `Nuvaxovid - Novavax`

`vaccination.valneva` Number of people who were vaccinated with Valneva, trade name: `Valneva - Valneva`

`vaccination.biontechBivalent` Number of people who are vaccinated with biontechBivalent, trade name: `Comirnaty bivalent (Original/Omikron) - BioNTech/Pfizer`

`vacciantion.modernaBivalent` Number of people who are vaccinated with modernaBivalent, trade name: `Spikevax bivalent (Original/Omikron) - Moderna`

`vaccination.deltaBiontech` New first vaccination with biontech vaccine compared to last reporting day

`vaccination.deltaModerna` New first vaccination with moderna vaccine compared to last reporting day

`vaccination.deltaAstraZeneca` New first vaccination with astra zeneca vaccine compared to last reporting day

`vaccination.deltaJanssen` New first vaccination with janssen vaccine compared to last reporting day

`vaccination.deltaNovavax` New first vaccination with novavax vaccine compared to last reporting day

`vaccination.deltaValneva` New first vaccination with valneva vaccine compared to last reporting day

`vaccination.deltaBiontechBivalent` New first vaccination with biontechBivalent vaccine compared to last reporting day

`vacciantion.deltaModernaBivalent` New first vaccination with modernaBivalent vaccine compared to last reporting day

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

```json
{
  "data": {
    "administeredVaccinations": 185782727,
    "vaccinated": 64785920,
    "vaccination": {
      "astraZeneca": 9274063,
      "biontech": 46584833,
      "janssen": 3711950,
      "moderna": 5143735,
      "novavax": 70764,
      "valneva": 362,
      "biontechBivalent": 189,
      "modernaBivalent": 24,
      "deltaAstraZeneca": 0,
      "deltaBiontech": 478,
      "deltaJanssen": 0,
      "deltaModerna": 36,
      "deltaNovavax": 43,
      "deltaValneva": 29,
      "deltaBiontechBivalent": 11,
      "deltaModernaBivalent": 0
    },
    "delta": 597,
    "quote": 0.778,
    "quotes": {
      "total": 0.778,
      "A05-A17": { "total": 0.46, "A05-A11": 0.222, "A12-A17": 0.744 },
      "A18+": { "total": 0.868, "A18-A59": 0.847, "A60+": 0.908 }
    },
    "secondVaccination": {
      //...
    },
    "boosterVaccination": {
      //...
    },
    "2ndBoosterVaccination": {
      //...
    },
    "states": {
      "SH": {
        "name": "Schleswig-Holstein",
        "administeredVaccinations": 7173116,
        "vaccinated": 2355346,
        "vaccination": {
          "astraZeneca": 361982,
          "biontech": 1666077,
          "janssen": 134445,
          "moderna": 190472,
          "novavax": 2356,
          "valneva": 4,
          "biontechBivalent": 10,
          "modernaBivalent": null,
          "deltaAstraZeneca": 0,
          "deltaBiontech": 4,
          "deltaJanssen": 0,
          "deltaModerna": 0,
          "deltaNovavax": 2,
          "deltaValneva": 0,
          "deltaBiontechBivalent": 0,
          "deltaModernaBivalent": null
        },
        "delta": 6,
        "quote": 0.806,
        "quotes": {
          "total": 0.806,
          "A05-A17": { "total": 0.605, "A05-A11": 0.307, "A12-A17": 0.941 },
          "A18+": { "total": 0.877, "A18-A59": 0.851, "A60+": 0.923 }
        },
        "secondVaccination": {
          //...
        },
        "boosterVaccination": {
          //...
        },
        "2ndBoosterVaccination": {
          //...
      },
      ...
      "TH": {
        "name": "Thüringen",
        "administeredVaccinations": 4177743,
        "vaccinated": 1507818,
        "vaccination": {
          "astraZeneca": 171180,
          "biontech": 1096432,
          "janssen": 95976,
          "moderna": 141261,
          "novavax": 2967,
          "valneva": 2,
          "biontechBivalent": null,
          "modernaBivalent": null,
          "deltaAstraZeneca": 0,
          "deltaBiontech": 3,
          "deltaJanssen": 0,
          "deltaModerna": 0,
          "deltaNovavax": 0,
          "deltaValneva": 0,
          "deltaBiontechBivalent": null,
          "deltaModernaBivalent": null
        },
        "delta": 3,
        "quote": 0.715,
        "quotes": {
          "total": 0.715,
          "A05-A17": { "total": 0.306, "A05-A11": 0.114, "A12-A17": 0.542 },
          "A18+": { "total": 0.804, "A18-A59": 0.752, "A60+": 0.876 }
        },
        "secondVaccination": {
          //...
        },
        "boosterVaccination": {
          //...
        },
        "2ndBoosterVaccination": {
          //...
      },
      "Bund": {
        "name": "Bundesressorts",
        "administeredVaccinations": 537244,
        "vaccinated": 202070,
        "vaccination": {
          "astraZeneca": 20400,
          "biontech": 90216,
          "janssen": 8126,
          "moderna": 83293,
          "novavax": 35,
          "valneva": null,
          "biontechBivalent": null,
          "modernaBivalent": null,
          "deltaAstraZeneca": 0,
          "deltaBiontech": 0,
          "deltaJanssen": 0,
          "deltaModerna": 0,
          "deltaNovavax": 0,
          "deltaValneva": null,
          "deltaBiontechBivalent": null,
          "deltaModernaBivalent": null
        },
        "delta": 0,
        "quote": null,
        "quotes": {
          "total": null,
          "A05-A17": { "total": null, "A05-A11": null, "A12-A17": null },
          "A18+": { "total": null, "A18-A59": null, "A60+": null }
        },
        "secondVaccination": {
          //...
        },
        "boosterVaccination": {
          //...
        },
        "2ndBoosterVaccination": {
          //...
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-10-01T06:51:38.000Z",
    "lastCheckedForUpdate": "2022-10-01T21:11:50.401Z"
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
  "data": {
    "SH": {
      "name": "Schleswig-Holstein",
      "administeredVaccinations": 7173116,
      "vaccinated": 2355346,
      "vaccination": {
        "astraZeneca": 361982,
        "biontech": 1666077,
        "janssen": 134445,
        "moderna": 190472,
        "novavax": 2356,
        "valneva": 4,
        "biontechBivalent": 10,
        "modernaBivalent": null,
        "deltaAstraZeneca": 0,
        "deltaBiontech": 4,
        "deltaJanssen": 0,
        "deltaModerna": 0,
        "deltaNovavax": 2,
        "deltaValneva": 0,
        "deltaBiontechBivalent": 0,
        "deltaModernaBivalent": null
      },
      "delta": 6,
      "quote": 0.806,
      "quotes": {
        "total": 0.806,
        "A05-A17": { "total": 0.605, "A05-A11": 0.307, "A12-A17": 0.941 },
        "A18+": { "total": 0.877, "A18-A59": 0.851, "A60+": 0.923 }
      },
      "secondVaccination": {
        //...
      },
      "boosterVaccination": {
        //...
      },
      "2ndBoosterVaccination": {
        //...
      }
    },
    ...
    "TH": {
      "name": "Thüringen",
      "administeredVaccinations": 4177743,
      "vaccinated": 1507818,
      "vaccination": {
        "astraZeneca": 171180,
        "biontech": 1096432,
        "janssen": 95976,
        "moderna": 141261,
        "novavax": 2967,
        "valneva": 2,
        "biontechBivalent": null,
        "modernaBivalent": null,
        "deltaAstraZeneca": 0,
        "deltaBiontech": 3,
        "deltaJanssen": 0,
        "deltaModerna": 0,
        "deltaNovavax": 0,
        "deltaValneva": 0,
        "deltaBiontechBivalent": null,
        "deltaModernaBivalent": null
      },
      "delta": 3,
      "quote": 0.715,
      "quotes": {
        "total": 0.715,
        "A05-A17": { "total": 0.306, "A05-A11": 0.114, "A12-A17": 0.542 },
        "A18+": { "total": 0.804, "A18-A59": 0.752, "A60+": 0.876 }
      },
      "secondVaccination": {
        //...
      },
      "boosterVaccination": {
        //...
      },
      "2ndBoosterVaccination": {
        //...
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-10-01T06:51:38.000Z",
    "lastCheckedForUpdate": "2022-10-01T23:58:51.226Z"
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
      "administeredVaccinations": 4536210,
      "vaccinated": 1605625,
      "vaccination": {
        "astraZeneca": 198265,
        "biontech": 1159209,
        "janssen": 115600,
        "moderna": 131133,
        "novavax": 1406,
        "valneva": null,
        "biontechBivalent": 11,
        "modernaBivalent": 1,
        "deltaAstraZeneca": 0,
        "deltaBiontech": 5,
        "deltaJanssen": 0,
        "deltaModerna": 0,
        "deltaNovavax": 0,
        "deltaValneva": null,
        "deltaBiontechBivalent": 1,
        "deltaModernaBivalent": 0
      },
      "delta": 6,
      "quote": 0.866,
      "quotes": {
        "total": 0.866,
        "A05-A17": { "total": 0.522, "A05-A11": 0.295, "A12-A17": 0.8 },
        "A18+": { "total": 0.97, "A18-A59": 0.966, "A60+": 0.979 }
      },
      "secondVaccination": {
        //...
      },
      "boosterVaccination": {
        //...
      },
      "2ndBoosterVaccination": {
        //...
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-10-01T06:51:38.000Z",
    "lastCheckedForUpdate": "2022-10-02T00:02:49.754Z"
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
    "administeredVaccinations": 185782727,
    "vaccinated": 64785920,
    "vaccination": {
      "astraZeneca": 9274063,
      "biontech": 46584833,
      "janssen": 3711950,
      "moderna": 5143735,
      "novavax": 70764,
      "valneva": 362,
      "biontechBivalent": 189,
      "modernaBivalent": 24,
      "deltaAstraZeneca": 0,
      "deltaBiontech": 478,
      "deltaJanssen": 0,
      "deltaModerna": 36,
      "deltaNovavax": 43,
      "deltaValneva": 29,
      "deltaBiontechBivalent": 11,
      "deltaModernaBivalent": 0
    },
    "delta": 597,
    "quote": 0.778,
    "quotes": {
      "total": 0.778,
      "A05-A17": { "total": 0.46, "A05-A11": 0.222, "A12-A17": 0.744 },
      "A18+": { "total": 0.868, "A18-A59": 0.847, "A60+": 0.908 }
    },
    "secondVaccination": {
      //...
    },
    "boosterVaccination": {
      //...
    },
    "2ndBoosterVaccination": {
      //...
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-10-01T06:51:38.000Z",
    "lastCheckedForUpdate": "2022-10-02T00:11:47.619Z"
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

`totalVaccinationOfTheDay` Total vaccinations of the day

```json
{
  "data": {
    "history": [
      {
        "date":"2020-12-27T00:00:00.000Z",
        "vaccinated":24421,
        "firstVaccination":24421,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "totalVacciantionOfTheDay":24421
      },
      {
        "date":"2020-12-28T00:00:00.000Z",
        "vaccinated":18007,
        "firstVaccination":18007,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "totalVacciantionOfTheDay":18007
      },
      {
        "date":"2020-12-29T00:00:00.000Z",
        "vaccinated":50055,
        "firstVaccination":50055,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "totalVacciantionOfTheDay":50055
      },
      ...
      {
        "date":"2022-05-01T00:00:00.000Z",
        "vaccinated":241,
        "firstVaccination":241,
        "secondVaccination":318,
        "firstBoosterVaccination":991,
        "secondBoosterVaccination":2550,
        "totalVacciantionOfTheDay":4100
      }
    ]
  },
  "meta": {
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2022-05-02T06:53:48.000Z",
    "lastCheckedForUpdate":"2022-05-02T15:30:22.447Z"
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
