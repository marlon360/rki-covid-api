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
