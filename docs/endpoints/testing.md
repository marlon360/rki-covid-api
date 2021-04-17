# Testing History

## `/testing/history`

### Request

`GET https://api.corona-zahlen.org/testing/history`
[Open](/testing)

### Response

`CalendarWeek` CalendarWeek

`CountTesting` Number PCR-tests executed.

`PositiveTesting` Number PCR-tests witch are COVID-19 positiv

`PositivQuote` Ouote of COVID-19 positiv tests

`CountLaboratories` Number Laboratories witch transmitted Data to RKI

```json
{
    "data":{
        "history":[
            {
                "CalendarWeek":"until CW10, 2020",
                "CountTesting":69184,
                "PositivTesting":1722,
                "PositivQuote":null,
                "CountLaboratories":null
            },
            {
                "CalendarWeek":"11/2020",
                "CountTesting":128008,
                "PositivTesting":7470,
                "PositivQuote":0.05835572776701456,
                "CountLaboratories":118
            },
            {
                "CalendarWeek":"12/2020",
                "CountTesting":374534,
                "PositivTesting":25886,
                "PositivQuote":0.06911522051402542,
                "CountLaboratories":154
            },
            // ...
            {
                "CalendarWeek":"12/2021",
                "CountTesting":1415220,
                "PositivTesting":131857,
                "PositivQuote":0.09317067311089441,
                "CountLaboratories":206
            },
            {
                "CalendarWeek":"13/2021",
                "CountTesting":1167760,
                "PositivTesting":128266,
                "PositivQuote":0.10983935055148318,
                "CountLaboratories":204
            },
            {
                "CalendarWeek":"14/2021",
                "CountTesting":1152511,
                "PositivTesting":138738,
                "PositivQuote":0.12037889443137637,
                "CountLaboratories":201
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
