# Germany

## `/germany`

### Request

`GET https://api.corona-zahlen.org/germany`
[Open](/germany)

### Response

```json
{
  "cases": 1765666,
  "deaths": 34272,
  "recovered": 1381937,
  "weekIncidence": 139.59190955621654,
  "casesPer100k": 2123.044158858224,
  "casesPerWeek": 116094,
  "delta": {
    "cases": 10315,
    "deaths": 312,
    "recovered": 13802
  },
  "r": {
    "value": 0.91,
    "date": "2020-12-29T00:00:00.000Z"
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-03T22:55:41.850Z"
  }
}
```

## `/germany/history`

Redirects to `/germany/history/cases`

## `/germany/history/cases`

Returns the total cases in germany for every day.

### Request

`GET https://api.corona-zahlen.org/germany/history/cases`
[Open](/germany/history/cases)

### Response

```json
{
  "data": [
    {
      "cases": 2,
      "date": "2020-01-01T00:00:00.000Z"
    },
    {
      "cases": 5,
      "date": "2020-01-02T00:00:00.000Z"
    },
    // ...
    {
      "cases": 5409,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:20:30.694Z"
  }
}
```

## `/germany/history/cases/:days`

Returns the total cases in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/cases/7`
[Open](/germany/history/cases)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "cases": 15587,
      "date": "2020-12-28T00:00:00.000Z"
    },
    {
      "cases": 27130,
      "date": "2020-12-29T00:00:00.000Z"
    },
    {
      "cases": 30295,
      "date": "2020-12-30T00:00:00.000Z"
    },
    {
      "cases": 18902,
      "date": "2020-12-31T00:00:00.000Z"
    },
    {
      "cases": 10031,
      "date": "2021-01-01T00:00:00.000Z"
    },
    {
      "cases": 8540,
      "date": "2021-01-02T00:00:00.000Z"
    },
    {
      "cases": 5409,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:26:36.595Z"
  }
}
```

## `/germany/history/incidence`

Returns the history of week incidences in germany.

### Request

`GET https://api.corona-zahlen.org/germany/history/incidence`
[Open](/germany/history/incidence)

### Response

```json
{
  "data": [
    {
      "weekIncidence": 162.7502138445754,
      "date": "2021-01-13T00:00:00.000Z"
    },
    {
      "weekIncidence": 155.7810792830319,
      "date": "2021-01-14T00:00:00.000Z"
    },
    {
      "weekIncidence": 148.2901013122907,
      "date": "2021-01-15T00:00:00.000Z"
    },
    {
      "weekIncidence": 144.20914156386442,
      "date": "2021-01-16T00:00:00.000Z"
    },
    {
      "weekIncidence": 141.81034524739113,
      "date": "2021-01-17T00:00:00.000Z"
    },
    {
      "weekIncidence": 131.50093190531484,
      "date": "2021-01-18T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-18T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-19T10:58:20.854Z"
  }
}
```

## `/germany/history/incidence/:days`

Returns the week incidence in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/incidence/3`
[Open](/germany/history/incidence/3)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "weekIncidence": 144.20914156386442,
      "date": "2021-01-16T00:00:00.000Z"
    },
    {
      "weekIncidence": 141.81034524739113,
      "date": "2021-01-17T00:00:00.000Z"
    },
    {
      "weekIncidence": 131.50093190531484,
      "date": "2021-01-18T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-18T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-19T11:02:29.069Z"
  }
}
```

## `/germany/history/deaths`

Returns the number of deaths in germany for every day.

### Request

`GET https://api.corona-zahlen.org/germany/history/deaths`
[Open](/germany/history/deaths)

### Response

```json
{
  "data": [
    {
      "deaths": 0,
      "date": "2020-01-01T00:00:00.000Z"
    },
    {
      "cases": 1,
      "date": "2020-01-02T00:00:00.000Z"
    },
    // ...
    {
      "deaths": 100,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:20:30.694Z"
  }
}
```

## `/germany/history/deaths/:days`

Returns the number of deaths in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/deaths/7`
[Open](/germany/history/deaths/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "deaths": 171,
      "date": "2020-12-28T00:00:00.000Z"
    },
    {
      "deaths": 199,
      "date": "2020-12-29T00:00:00.000Z"
    },
    {
      "deaths": 141,
      "date": "2020-12-30T00:00:00.000Z"
    },
    {
      "deaths": 57,
      "date": "2020-12-31T00:00:00.000Z"
    },
    {
      "deaths": 28,
      "date": "2021-01-01T00:00:00.000Z"
    },
    {
      "deaths": 17,
      "date": "2021-01-02T00:00:00.000Z"
    },
    {
      "deaths": 7,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:29:52.846Z"
  }
}
```

## `/germany/history/recovered`

Returns the number of recovered people in germany for every day.

### Request

`GET https://api.corona-zahlen.org/germany/history/recovered`
[Open](/germany/history/recovered)

### Response

```json
{
  "data": [
    {
      "recovered": 0,
      "date": "2020-01-01T00:00:00.000Z"
    },
    {
      "recovered": 1,
      "date": "2020-01-02T00:00:00.000Z"
    },
    // ...
    {
      "recovered": 100,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:20:30.694Z"
  }
}
```

## `/germany/history/recovered/:days`

Returns the number of recovered people in germany for the last `:days` days.

### Request

`GET https://api.corona-zahlen.org/germany/history/recovered/7`
[Open](/germany/history/recovered/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |

### Response

```json
{
  "data": [
    {
      "recovered": 1638,
      "date": "2020-12-28T00:00:00.000Z"
    },
    {
      "recovered": 1546,
      "date": "2020-12-29T00:00:00.000Z"
    },
    {
      "recovered": 1059,
      "date": "2020-12-30T00:00:00.000Z"
    },
    {
      "recovered": 317,
      "date": "2020-12-31T00:00:00.000Z"
    },
    {
      "recovered": 185,
      "date": "2021-01-01T00:00:00.000Z"
    },
    {
      "recovered": 116,
      "date": "2021-01-02T00:00:00.000Z"
    },
    {
      "recovered": 49,
      "date": "2021-01-03T00:00:00.000Z"
    }
  ],
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2021-01-03T00:00:00.000Z",
    "lastCheckedForUpdate": "2021-01-04T13:31:15.304Z"
  }
}
```

## `/germany/history/rValue`

Returns the R value of germany for every day.
