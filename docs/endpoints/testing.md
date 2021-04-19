# Testing History

## `/testing/history`

### Request

`GET https://api.corona-zahlen.org/testing/history`
[Open](/testing/history)

### Response

`CalendarWeek` CalendarWeek

`performedTests` Number PCR-tests executed.

`positiveTests` Number of positive PCR-tests

`positivityRate` The rate of positive PCR-tests

`laboratoryCount` Number of laboratories which transmitted data to the RKI

```json
{
    "data":{
        "history":[
            {
                "calendarWeek":     "until CW10, 2020",
                "performedTests":   69184,
                "positiveTests":    1722,
                "positivityRate":   null,
                "laboratoryCount":  null,
            },
            {
                "calendarWeek":     "11/2020",
                "performedTests":   128008,
                "positiveTests":    7470,
                "positivityRate":   0.05835572776701456,
                "laboratoryCount":  118
            },
            {
                "calendarWeek":     "12/2020",
                "performedTests":   374534,
                "positiveTests":    25886,
                "positivityRate":   0.06911522051402542,
                "laboratoryCount":  154
            },
            // ...
            {
                "calendarWeek":     "12/2021",
                "performedTests":   1415220,
                "positiveTests":    131857,
                "positivityRate":   0.09317067311089441,
                "laboratoryCount":  206
            },
            {
                "calendarWeek":     "13/2021",
                "performedTests":   1167760,
                "positiveTests":    128266,
                "positivityRate":   0.10983935055148318,
                "laboratoryCount":  204
            },
            {
                "calendarWeek":     "14/2021",
                "performedTests":   1152511,
                "positiveTests":    138738,
                "positivityRate":   0.12037889443137637,
                "laboratoryCount":  201
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
