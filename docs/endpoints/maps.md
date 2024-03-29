# Maps

## `/map`

Redirects to `/map/districts`.

## `/map/districts`

Returns a Heatmap (PNG) of week incidences for districts.

### Request

`GET https://api.corona-zahlen.org/map/districts`
[Open](/map/districts)

### Response

<img alt="districts map" src="https://api.corona-zahlen.org/map/districts" width="300">

## `/map/districts-legend`

Returns a Heatmap (PNG) of week incidences for districts with a legend and headline.

### Request

`GET https://api.corona-zahlen.org/map/districts-legend`
[Open](/map/districts-legend)

### Response

<img alt="districts legend map" src="https://api.corona-zahlen.org/map/districts-legend" width="300">

## `/map/districts/history/:date`

Returns a Heatmap (PNG) of week incidences for districts for a specific date or x days in the past.

### Request

`GET https://api.corona-zahlen.org/map/districts/history/2021-11-01`
[Open](/map/districts/history/2021-11-01)

**Parameters**

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| :date     | a date in the past format: YYYY-MM-DD or |
| :date     | Number of days in the past from today    |

### Response

<img alt="districts history map" src="https://api.corona-zahlen.org/map/districts/history/2021-11-01" width="300">

## `/map/districts-legend/history/:date`

Returns a Heatmap (PNG) of week incidences for districts with a legend and headline for a specific date or x days in the past.

### Request

`GET https://api.corona-zahlen.org/map/districts-legend/history/30`
[Open](/map/districts-legend/history/30)

### Response

<img alt="districts legend history map" src="https://api.corona-zahlen.org/map/districts-legend/history/30" width="300">

**Parameters**

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| :date     | a date in the past format: YYYY-MM-DD or |
| :date     | Number of days in the past from today    |

## `/map/districts/legend`

Returns the incident ranges for the colors.

### Request

`GET https://api.corona-zahlen.org/map/districts/legend`
[Open](/map/districts/legend)

### Response

```json
{
  "incidentRanges": [
    {
      "min": 0,
      "max": 1,
      "color": "#2D81B8"
    },
    {
      "min": 1,
      "max": 5,
      "color": "#7FD38D"
    },
    {
      "min": 15,
      "max": 25,
      "color": "#FEFFB1"
    },
    {
      "min": 25,
      "max": 35,
      "color": "#FECA81"
    },
    {
      "min": 35,
      "max": 50,
      "color": "#F08A4B"
    },
    {
      "min": 50,
      "max": 100,
      "color": "#EB1A1D"
    },
    {
      "min": 100,
      "max": 200,
      "color": "#AB1316"
    },
    {
      "min": 200,
      "max": 350,
      "color": "#B374DD"
    },
    {
      "min": 350,
      "max": 500,
      "color": "#5B189B"
    },
    {
      "min": 500,
      "max": 1000,
      "color": "#543D35"
    },
    {
      "min": 1000,
      "max": null,
      "color": "#020003"
    }
  ]
}
```

## `/map/states`

Returns a Heatmap (PNG) of week incidences for states.

### Request

`GET https://api.corona-zahlen.org/map/states`
[Open](/map/states)

### Response

<img alt="states map" src="https://api.corona-zahlen.org/map/states" width="300">

## `/map/states-legend`

Returns a Heatmap (PNG) of week incidences for states with a legend and headline.

### Request

`GET https://api.corona-zahlen.org/map/states-legend`
[Open](/map/states-legend)

### Response

<img alt="states legend map" src="https://api.corona-zahlen.org/map/states-legend" width="300">

## `/map/districts/history/:date`

Returns a Heatmap (PNG) of week incidences for states for a specific date or x days in the past.

### Request

`GET https://api.corona-zahlen.org/map/states/history/2021-11-01`
[Open](/map/states/history/2021-11-01)

**Parameters**

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| :date     | a date in the past format: YYYY-MM-DD or |
| :date     | Number of days in the past from today    |

### Response

<img alt="states history map" src="https://api.corona-zahlen.org/map/states/history/2021-11-01" width="300">

## `/map/states-legend/history/:date`

Returns a Heatmap (PNG) of week incidences for states with a legend and headline for a specific date or x days in the past.

### Request

`GET https://api.corona-zahlen.org/map/states-legend/history/30`
[Open](/map/states-legend/history/30)

### Response

<img alt="states history legend map" src="https://api.corona-zahlen.org/map/states-legend/history/30" width="300">

**Parameters**

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| :date     | a date in the past format: YYYY-MM-DD or |
| :date     | Number of days in the past from today    |

## `/map/states/legend`

Returns the incident ranges for the colors.

### Request

`GET https://api.corona-zahlen.org/map/states/legend`
[Open](/map/states/legend)

### Response

```json
{
  "incidentRanges": [
    {
      "min": 0,
      "max": 1,
      "color": "#2D81B8"
    },
    {
      "min": 1,
      "max": 5,
      "color": "#7FD38D"
    },
    {
      "min": 15,
      "max": 25,
      "color": "#FEFFB1"
    },
    {
      "min": 25,
      "max": 35,
      "color": "#FECA81"
    },
    {
      "min": 35,
      "max": 50,
      "color": "#F08A4B"
    },
    {
      "min": 50,
      "max": 100,
      "color": "#EB1A1D"
    },
    {
      "min": 100,
      "max": 200,
      "color": "#AB1316"
    },
    {
      "min": 200,
      "max": 350,
      "color": "#B374DD"
    },
    {
      "min": 350,
      "max": 500,
      "color": "#5B189B"
    },
    {
      "min": 500,
      "max": 1000,
      "color": "#543D35"
    },
    {
      "min": 1000,
      "max": null,
      "color": "#020003"
    }
  ]
}
```

## `/map/states/hospitalization`

Returns a Heatmap (PNG) of hospitalization incidences for states.

### Request

`GET https://api.corona-zahlen.org/map/states/hospitalization`
[Open](/map/states/hospitalization)

### Response

<img alt="states hospitalization map" src="https://api.corona-zahlen.org/map/states/hospitalization" width="300">

## `/map/states-legend/hospitalization`

Returns a Heatmap (PNG) of hospitalization incidences for states with a legend and headline.

### Request

`GET https://api.corona-zahlen.org/map/states-legend/hospitalization`
[Open](/map/states-legend/hospitalization)

### Response

<img alt="states legend hospitalization map" src="https://api.corona-zahlen.org/map/states-legend/hospitalization" width="300">

## `/map/states/hospitalization/history/:date`

Returns a Heatmap (PNG) of hospitalization incidences for states for a specific date or x days in the past.

### Request

`GET https://api.corona-zahlen.org/map/states/hospitalization/history/2021-11-01`
[Open](/map/states/hospitalization/history/2021-11-01)

**Parameters**

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| :date     | a date in the past format: YYYY-MM-DD or |
| :date     | Number of days in the past from today    |

### Response

<img alt="states hospitalization history map" src="https://api.corona-zahlen.org/map/states/hospitalization/history/2021-11-01" width="300">

## `/map/states-legend/hospitalization/history/:date`

Returns a Heatmap (PNG) of hospitalization incidences for states with a legend and headline for a specific date or x days in the past.

### Request

`GET https://api.corona-zahlen.org/map/states-legend/hospitalization/history/30`
[Open](/map/states-legend/hospitalization/history/30)

### Response

<img alt="states hospitalization history legend map" src="https://api.corona-zahlen.org/map/states-legend/hospitalization/history/30" width="300">

**Parameters**

| Parameter | Description                              |
| --------- | ---------------------------------------- |
| :date     | a date in the past format: YYYY-MM-DD or |
| :date     | Number of days in the past from today    |
