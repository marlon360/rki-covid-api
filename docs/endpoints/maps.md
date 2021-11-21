# Maps

## `/map`

Redirects to `/map/districts`.

## `/map/districts`

Returns a Heatmap (PNG) of week incidences for districts.

### Request

`GET http://api.fritz.box:8080/map/districts`
[Open](/map/districts)

** All map links can be extended with the following parameters **

| Parameter               | Description                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| ?palette=default        | use the default palette (colors/ranges since 2021-11-12) is the same as without |
| ?palette=old            | use the old default palette (bevor 2021-11-12)                                  |
| ?palette=rki            | use rki palette (colors/ranges like the rki on their webside use)               |
| ?userpalette=0,0,...... | use a userpalette example and rules below                                       |

this is a example userpalette witch must be given after ?userpalette=

0,0,CDCDCD;0,5,FFFCCC;5,25,FFF380;25,50,FFB534;50,100,D43624;100,250,951214;250,500,671212;500,1000,DD0085;1000,Infinity,7A0077;

witch meens the following

| Stringpart            | >min | <=max    | Color  | Remark or Rule                                                          |
| --------------------- | ---- | -------- | ------ | ----------------------------------------------------------------------- |
| 0,0,CDCDCD;           | 0    | 0        | CDCDCD | special range min=max=0 can be used but this is not a must!             |
| 0,5,FFFCCC;           | 0    | 5        | FFFCCC | first range must start with min=0                                       |
| 5,25,FFF380;          | 5    | 25       | FFF380 | min next range must be max last range                                   |
| 25,50,FFB534;         | 25   | 50       | FFB534 | hex values for color must be 6 gigit without prefix, upper or lowercase |
| 50,100,D43624;        | 50   | 100      | D43624 |                                                                         |
| 100,250,951214;       | 100  | 250      | 951214 |                                                                         |
| 250,500,671212;       | 250  | 500      | 671212 |                                                                         |
| 500,1000,DD0085;      | 500  | 1000     | DD0085 |                                                                         |
| 1000,Infinity,7A0077; | 1000 | Infinity | 7A0077 | last range max must be "Infinity".                                      |

every range needs 3 values (min, max, color) separated by , and terminated by ; after the last range the ; is a option!

### Response

<img alt="districts map" src="http://api.fritz.box:8080/map/districts?palette=default" width="300">

## `/map/districts-legend`

Returns a Heatmap (PNG) of week incidences for districts with a legend and headline.

### Request

`GET http://api.fritz.box:8080/map/districts-legend?palette=rki`
[Open](/map/districts-legend?palette=rki)

### Response

<img alt="districts legend map" src="http://api.fritz.box:8080/map/districts-legend?palette=rki" width="300">

## `/map/districts/legend`

Returns the incident ranges for the colors.

### Request

`GET http://api.fritz.box:8080/map/districts/legend?palette=default`
[Open](/map/districts/legend?palette=default)

### Response

```json
{
  "incidentRanges": [
    {
      "min": 0,
      "max": 0,
      "color": "#E2E2E2",
      "label": "keine Fälle übermittelt"
    },
    {
      "min": 0,
      "max": 1,
      "color": "#25BA94"
    },
    {
      "min": 1,
      "max": 15,
      "color": "#76D985"
    },
    {
      "min": 15,
      "max": 25,
      "color": "#FFFFA8"
    },
    {
      "min": 25,
      "max": 35,
      "color": "#FECA81"
    },
    {
      "min": 35,
      "max": 50,
      "color": "#F1894A"
    },
    {
      "min": 50,
      "max": 100,
      "color": "#F21620"
    },
    {
      "min": 100,
      "max": 200,
      "color": "#A9141A"
    },
    {
      "min": 200,
      "max": 350,
      "color": "#B275DD"
    },
    {
      "min": 350,
      "max": 500,
      "color": "#5D179B"
    },
    {
      "min": 500,
      "max": 1000,
      "color": "#17179B"
    },
    {
      "min": 1000,
      "max": 1500,
      "color": "#68463B"
    },
    {
      "min": 1500,
      "max": 2500,
      "color": "#6D6D6D"
    },
    {
      "min": 2500,
      "max": null,
      "color": "#020003"
    }
  ]
}
```

## `/map/states`

Returns a Heatmap (PNG) of week incidences for states.

### Request

`GET http://api.fritz.box:8080/map/states`
[Open](/map/states)

### Response

<img alt="states map" src="http://api.fritz.box:8080/map/states?userpalette=0,0,CDCDCD;0,5,FFFCCC;5,25,FFF380;25,50,FFB534;50,100,D43624;100,250,951214;250,500,671212;500,1000,DD0085;1000,Infinity,7A0077" width="300">

## `/map/states-legend`

Returns a Heatmap (PNG) of week incidences for states with a legend and headline.

### Request

`GET http://api.fritz.box:8080/map/states-legend`
[Open](/map/states-legend)

### Response

<img alt="states legend map" src="http://api.fritz.box:8080/map/states-legend" width="300">

## `/map/states/legend`

Returns the incident ranges for the colors.

### Request

`GET http://api.fritz.box:8080/map/states/legend?palette=rki`
[Open](/map/states/legend?palette=rki)

### Response

```json
{
  "incidentRanges": [
    {
      "min": 0,
      "max": 0,
      "color": "#CDCDCD",
      "label": "keine Fälle übermittelt"
    },
    {
      "min": 0,
      "max": 5,
      "color": "#FFFCCC"
    },
    {
      "min": 5,
      "max": 25,
      "color": "#FFF380"
    },
    {
      "min": 25,
      "max": 50,
      "color": "#FFB534"
    },
    {
      "min": 50,
      "max": 100,
      "color": "#D43624"
    },
    {
      "min": 100,
      "max": 250,
      "color": "#951214"
    },
    {
      "min": 250,
      "max": 500,
      "color": "#671212"
    },
    {
      "min": 500,
      "max": 1000,
      "color": "#DD0085"
    },
    {
      "min": 1000,
      "max": null,
      "color": "#7A0077"
    }
  ]
}
```

## `/map/states/hospitalization`

Returns a Heatmap (PNG) of hospitalization incidences for states.

| Parameter               | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| ?palette=default        | use the default palette, thats the same as without              |
| ?palette=grey           | use a grayscale palette                                         |
| ?palette=greenred       | use a palette which runs from green (0) to red (> 15)           |
| ?userpalette=0,0,...... | use a userpalette example and rules at the top of this document |

### Request

`GET http://api.fritz.box:8080/map/states/hospitalization`
[Open](/map/states/hospitalization)

### Response

<img alt="states legend map" src="http://api.fritz.box:8080/map/states/hospitalization" width="300">

## `/map/states-legend/hospitalization`

Returns a Heatmap (PNG) of hospitalization incidences for states with a legend and headline.

### Request

`GET http://api.fritz.box:8080/map/states-legend/hospitalization`
[Open](/map/states-legend/hospitalization)

### Response

<img alt="states legend map" src="http://api.fritz.box:8080/map/states-legend/hospitalization" width="300">

## `/map/states/hospitalization/legend`

Returns the incident ranges for the colors.

### Request

`GET http://api.fritz.box:8080/map/states/hospitalization/legend`
[Open](/map/states/hospitalization/legend)

### Response

```json
{
  "incidentRanges": [
    {
      "min": 0,
      "max": 0,
      "color": "#E2E2E2",
      "label": "keine Fälle übermittelt"
    },
    {
      "min": 0,
      "max": 1,
      "color": "#FCF9CA"
    },
    {
      "min": 1,
      "max": 3,
      "color": "#FFDA9C",
      "label": "> 1 - 3: keine einheitl. Regeln"
    },
    {
      "min": 3,
      "max": 6,
      "color": "#F7785B",
      "label": "> 3 - 6: 2G-Regel"
    },
    {
      "min": 6,
      "max": 9,
      "color": "#FF3A25",
      "label": "> 6 - 9: 2G-Plus-Regel"
    },
    {
      "min": 9,
      "max": 12,
      "color": "#D80182",
      "label": "> 9 - 12: > 9 weitere Maßnah."
    },
    {
      "min": 12,
      "max": 15,
      "color": "#770175"
    },
    {
      "min": 15,
      "max": null,
      "color": "#000000"
    }
  ]
}
```
