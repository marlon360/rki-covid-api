# Robert-Koch Institut API

This is a JSON API to easily get the data from this website:
https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html

## Endpoint

`https://rki-covid-api.now.sh/api/states`

## Data Structure

```json
{
  "states": [
    {
      "name": "Baden-Württem­berg",
      "count": 3668,
      "difference": 922,
      "deaths": 33,
      "code": "BW"
    },
    {
      "name": "Bayern",
      "count": 2960,
      "difference": 559,
      "deaths": 23,
      "code": "BY"
    },
    {
      "name": "Berlin",
      "count": 866,
      "difference": 135,
      "deaths": 23,
      "code": "BE"
    },
    {
      "name": "Brandenburg",
      "count": 254,
      "difference": 62,
      "deaths": 10,
      "code": "BB"
    },
    {
      "name": "Bremen",
      "count": 142,
      "difference": 21,
      "deaths": 21,
      "code": "HB"
    },
    {
      "name": "Hamburg",
      "count": 587,
      "difference": 1,
      "deaths": 32,
      "code": "HB"
    },
    {
      "name": "Hessen",
      "count": 1080,
      "difference": 267,
      "deaths": 17,
      "code": "HE"
    },
    {
      "name": "Mecklenburg-Vor­pommern",
      "count": 165,
      "difference": 34,
      "deaths": 10,
      "code": "MV"
    },
    {
      "name": "Niedersachsen",
      "count": 1023,
      "difference": 220,
      "deaths": 13,
      "code": "NI"
    },
    {
      "name": "Nordrhein-West­falen",
      "count": 3542,
      "difference": 45,
      "deaths": 20,
      "code": "NW"
    },
    {
      "name": "Rhein­land-Pfalz",
      "count": 938,
      "difference": 137,
      "deaths": 23,
      "code": "RP"
    },
    {
      "name": "Saarland",
      "count": 187,
      "difference": 41,
      "deaths": 19,
      "code": "SL"
    },
    {
      "name": "Sachsen",
      "count": 567,
      "difference": 173,
      "deaths": 14,
      "code": "SN"
    },
    {
      "name": "Sachsen-Anhalt",
      "count": 188,
      "difference": 8,
      "deaths": 9,
      "code": "ST"
    },
    {
      "name": "Schles­wig-Holstein",
      "count": 308,
      "difference": 42,
      "deaths": 11,
      "code": "SH"
    },
    {
      "name": "Thüringen",
      "count": 187,
      "difference": 38,
      "deaths": 9,
      "code": "TH"
    }
  ]
}
```