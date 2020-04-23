# Robert-Koch Institut API

This is a JSON API to easily get the data from this API:
https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0?geometry=-15.251%2C46.270%2C31.507%2C55.886

## Endpoint

`https://rki-covid-api.now.sh/api/states`

## Project Showcase

[Add your project by openening an issue with your project details!](https://github.com/marlon360/rki-covid-api/issues/new)

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
    ...
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

## Donation

[Buy me a coffee](https://ko-fi.com/marlon360)
