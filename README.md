# Robert-Koch Institut API

This is a JSON API to easily get the data from this website:
https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html

## Endpoint

`https://rki-covid-api.now.sh/api/states`

## Project Showcase (project using this API)

[Add your project by openening an issue with your project details!](https://github.com/marlon360/rki-covid-api/issues/new)

- https://coronafallzahlen.de

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
