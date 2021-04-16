# Testing History

## `/testing/history`

### Request

`GET https://api.corona-zahlen.org/testing/history`
[Open](/testing/history)

### Response

`calendarWeek` CalendarWeek

`countTesting` Number PCR-tests executed.

`positiveTesting` Number PCR-tests witch are COVID-19 positiv

`positiveQuote` Ouote of COVID-19 positive tests

`countLaboratories` Number Laboratories witch transmitted Data to RKI

```json
{
    "data":{
        "history":[
            {
                "calendarWeek":"until CW10, 2020",
                "countTesting":69184,
                "positiveTesting":1722,
                "positiveQuote":null,
                "countLaboratories":null
            },
            {
                "calendarWeek":"11/2020",
                "countTesting":128008,
                "positiveTesting":7470,
                "positiveQuote":0.05835572776701456,
                "countLaboratories":118
            },
            {
                "calendarWeek":"12/2020",
                "countTesting":374534,
                "positiveTesting":25886,
                "positiveQuote":0.06911522051402542,
                "countLaboratories":154
            },
            // ...
            {
                "calendarWeek":"12/2021",
                "countTesting":1415220,
                "positiveTesting":131857,
                "positiveQuote":0.09317067311089441,
                "countLaboratories":206
            },
            {
                "calendarWeek":"13/2021",
                "countTesting":1167760,
                "positiveTesting":128266,
                "positiveQuote":0.10983935055148318,
                "countLaboratories":204
            },
            {
                "calendarWeek":"14/2021",
                "countTesting":1152511,
                "positiveTesting":138738,
                "positiveQuote":0.12037889443137637,
                "countLaboratories":201
            }
        ]
    },
    "meta":
        {
            "source":"Robert Koch-Institut",
            "contact":"Marlon Lueckert (m.lueckert@me.com)",
            "info":"https://github.com/marlon360/rki-covid-api",
            "lastUpdate":"2021-04-14T14:54:08.000Z",
            "lastCheckedForUpdate":"2021-04-14T20:59:21.345Z"
        }
}
```
