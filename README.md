# Robert-Koch Institut API

This is a JSON API to easily get the data from this website:

[~~https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html~~](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html)

https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0/data
## Endpoint

`https://rki-covid-api.now.sh/api/states`

## Project Showcase (project using this API)

[Add your project by openening an issue with your project details!](https://github.com/marlon360/rki-covid-api/issues/new)

- https://coronafallzahlen.de

## Data Structure

```json
{
  "lastUpdate": "17.10.2020, 00:00 Uhr (online aktualisiert um 11:20 Uhr)",
  "states": [
    {
      "name": "Baden-Württemberg",
      "count": 58653,
      "weekIncidence": 42,
      "deaths": 1927,
      "code": "BW"
    },
    {
      "name": "Bayern",
      "count": 77904,
      "weekIncidence": 39,
      "deaths": 2714,
      "code": "BY"
    },
    ...
    {
      "name": "Schleswig-Holstein",
      "count": 5600,
      "weekIncidence": 13,
      "deaths": 163,
      "code": "SH"
    },
    {
      "name": "Thüringen",
      "count": 4793,
      "weekIncidence": 18,
      "deaths": 198,
      "code": "TH"
    }
  ]
}
```

## Donation

[Buy me a coffee](https://ko-fi.com/marlon360)
