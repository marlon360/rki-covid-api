# Vaccinations

## `/vaccinations`

### Request

`GET https://api.fritz.box:8080/vaccinations`
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

`quote` Quote of first vaccinated people (legacy)

`quotes` Quotes by agegroups

`quotes.total` Quote of first vaccinated people (same as `quote`)

`quotes.A12-A17` Quote of first vaccinated people with age >=12 to <=17 years

`quotes.A18+` Quote of first vaccinated people with agegroup >= 18 years

`quotes.A18+.total` Quote of first vaccinated people with age >= 18 years

`quotes.A18+.A18-A59` Quote of first vaccinated people with age >= 18 to <= 59 years

`quotes.A18+.A60+` Quote of first vaccinated people with age >= 60 years

`secondVaccination.vaccinated` Number of people who got the second vaccination

`secondVaccination.delta` New second vaccinations compared to yesterday

`secondVaccination.quote` Quote of full vaccinated people (legacy)

`secondVaccination.quotes` Quotes of full vaccinated people by agegroups

`secondVaccination.quotes.total` Quote of full vaccinated people (same as `secondVaccination.quote`)

`secondVaccination.quotes.A12-A17` Quote of full vaccinated people with age >=12 to <=17 years

`secondVaccination.quotes.A18+` Quote of full vaccinated people with agegroup >= 18 years

`secondVaccination.quotes.A18+.total` Quote of full vaccinated people with age >= 18 years

`secondVaccination.quotes.A18+.A18-A59` Quote of full vaccinated people with age >= 18 to <= 59 years

`secondVaccination.quotes.A18+.A60+` Quote of full vaccinated people with age >= 60 years

`secondVaccination.vaccination.biontech` Number of people who received their second dose of BioNTech

`secondVaccination.vaccination.moderna` Number of people who received their second dose of Moderna

`secondVaccination.vaccination.astraZeneca` Number of people who received their second dose of AstraZeneca

`boosterVaccination.vaccination.biontech` Number of people who received their booster dose of BioNTech

`boosterVaccination.vaccination.moderna` Number of people who received their booster dose of Moderna

`boosterVaccination.vaccination.janssen` Number of people who received their booster dose of Janssen

`boosterVaccination.delta` New booster vaccinations compared to yesterday

`boosterVaccination.quote` Quote of boostered people (legacy)

`boosterVaccination.quotes` Quotes of boostered people by agegroups

`boosterVaccination.quotes.total` Quote of boostered people (same as `boosterVaccination.quote`)

`boosterVaccination.quotes.A12-A17` Quote of boostered people with age >=12 to <=17 years

`boosterVaccination.quotes.A18+` Quote of boostered people with agegroup >= 18 years

`boosterVaccination.quotes.A18+.total` Quote of boostered people with age >= 18 years

`boosterVaccination.quotes.A18+.A18-A59` Quote of boostered people with age >= 18 to <= 59 years

`boosterVaccination.quotes.A18+.A60+` Quote of boostered people with age >= 60 years

_ATTENTION_ since 2021-04-08 the RKI dropped the indication information!

```json
{
  "data":
  {
    "administeredVaccinations":152496126,
    "vaccinated":61930498,
    "vaccination":
    {
      "biontech":44139701,
      "moderna":4942335,
      "astraZeneca":9269166,
      "janssen":3579296
    },
    "delta":43404,
    "quote":0.745,
    "quotes":
    {
      "total":0.745,
      "A12-A17":0.606,
      "A18+":
      {
        "total":0.846,
        "A18-A59":0.778,
        "A60+":0.883
      }
    },
    "secondVaccination":
    {
      "vaccinated":59574879,
      "vaccination":
      {
        "biontech":46842638,
        "moderna":5681616,
        "astraZeneca":3471329
      },
      "delta":81268,
      "quote":0.716,
      "quotes":
      {
        "total":0.716,
        "A12-A17":0.539,
        "A18+":
        {
          "total":0.823,
          "A18-A59":0.796,
          "A60+":0.874
        }
      }
    },
    "boosterVaccination":
    {
      "vaccinated":34570045,
      "vaccination":
      {
        "biontech":21575727,
        "moderna":12986294,
        "janssen":4067
      },
      "delta":470517,
      "quote":0.416,
      "quotes":
      {
        "total":0.416,
        "A12-A17":0.079,
        "A18+":
        {
          "total":0.493,
          "A18-A59":0.411,
          "A60+":0.646
        }
      }
    },
    "latestDailyVaccinations":
    {
      "date":"2022-01-06T00:00:00.000Z",
      "vaccinated":43404,
      "firstVaccination":43404,
      "secondVaccination":81268,
      "boosterVaccination":470517
    },
    "states":
    {
      "BW":
      {
        "name":"Baden-Württemberg",
        "administeredVaccinations":20047413,
        "vaccinated":8000730,
        "vaccination":
        {
          "biontech":5728206,
          "moderna":617589,
          "astraZeneca":1179235,
          "janssen":475700
        },
        "delta":4041,
        "quote":0.721,
        "quotes":
        {
          "total":0.721,
          "A12-A17":0.575,
          "A18+":
          {
            "total":0.821,
            "A18-A59":0.757,
            "A60+":0.871
          }
        },
        "secondVaccination":
        {
          "vaccinated":7771045,
          "vaccination":
          {
            "biontech":6176357,
            "moderna":719509,
            "astraZeneca":399479
          },
          "delta":4035,
          "quote":0.7,
          "quotes":
          {
            "total":0.7,
            "A12-A17":0.502,
            "A18+":
            {
              "total":0.808,
              "A18-A59":0.783,
              "A60+":0.86
            }
          }
        },
        "boosterVaccination":
        {
          "vaccinated":4751338,
          "vaccination":
          {
            "biontech":2911520,
            "moderna":1838534,
            "janssen":86
          },
          "delta":34809,
          "quote":0.428,
          "quotes":
          {
            "total":0.428,
            "A12-A17":0.502,
            "A18+":
            {
              "total":0.507,
              "A18-A59":0.442,
              "A60+":0.641
            }
          }
        }
      },
      ...
      "Bund":
      {
        "name":"Bundesressorts",
        "administeredVaccinations":484493,
        "vaccinated":200288,
        "vaccination":
        {
          "biontech":88672,
          "moderna":83224,
          "astraZeneca":20255,
          "janssen":8137
        },
        "delta":45,
        "quote":null,
        "quotes":
        {
          "total":null,
          "A12-A17":null,
          "A18+":
          {
            "total":null,
            "A18-A59":null,
            "A60+":null
          }
        },
        "secondVaccination":
        {
          "vaccinated":190434,
          "vaccination":
          {
            "biontech":85832,
            "moderna":86628,
            "astraZeneca":9837
          },
          "delta":145,
          "quote":null,
          "quotes":
          {
            "total":null,
            "A12-A17":null,
            "A18+":
            {
              "total":null,
              "A18-A59":null,
              "A60+":null
            }
          }
        },
        "boosterVaccination":
        {
          "vaccinated":101908,
          "vaccination":
          {
            "biontech":74195,
            "moderna":27695,
            "janssen":2
          },
          "delta":1135,
          "quote":null,
          "quotes":
          {
            "total":null,
            "A12-A17":null,
            "A18+":
            {
              "total":null,
              "A18-A59":null,
              "A60+":null
            }
          }
        }
      }
    }
  },
  "meta":
  {
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2022-01-07T07:58:27.000Z",
    "lastCheckedForUpdate":"2022-01-08T13:00:46.855Z"
  }
}
```

## `/vaccinations/history`

### Request

`GET https://api.fritz.box:8080/vaccinations/history`
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

`GET https://api.fritz.box:8080/vaccinations/history/7`
[Open](/vaccinations/history/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |
