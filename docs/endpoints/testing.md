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
  "data": {
    "history": [
      {
        "calendarWeek": "10/2020",
        "performedTests": 69493,
        "positiveTests": 1722,
        "positivityRate": 0.0248,
        "laboratoryCount": null
      },
      {
        "calendarWeek": "11/2020",
        "performedTests": 129291,
        "positiveTests": 7502,
        "positivityRate": 0.058,
        "laboratoryCount": 119
      },
      {
        "calendarWeek": "12/2020",
        "performedTests": 374534,
        "positiveTests": 25886,
        "positivityRate": 0.0691,
        "laboratoryCount": 154
      },
      ...
      {
        "calendarWeek": "10/2023",
        "performedTests": 56415,
        "positiveTests": 17614,
        "positivityRate": 0.3122,
        "laboratoryCount": 72
      },
      {
        "calendarWeek": "11/2023",
        "performedTests": 54080,
        "positiveTests": 18130,
        "positivityRate": 0.3352,
        "laboratoryCount": 72
      },
      {
        "calendarWeek": "12/2023",
        "performedTests": 47813,
        "positiveTests": 15385,
        "positivityRate": 0.3218,
        "laboratoryCount": 72
      }
    ]
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2023-03-30T10:00:05.000Z",
    "lastCheckedForUpdate": "2023-04-05T16:41:31.125Z"
  }
}
```

## `/testing/history/:weeks`

### Request

`GET https://api.corona-zahlen.org/testing/history/7`
[Open](/testing/history/7)

**Parameters**

| Parameter | Description                            |
| --------- | -------------------------------------- |
| :weeks    | Number of weeks in the past from today |
