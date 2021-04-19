# Robert Koch-Institut API (v2)

A JSON Rest API to query all relevant corona data for Germany based on the figures of the Robert Koch-Institut.

cases 🤧 - deaths ☠️ - recovered 🟢 - **R value** 📈 - week incidence 📅 - **time series** 🗓 - states - districts - **vaccinations** 💉 - **maps** 🗺 - PCR-tests

[https://api.corona-zahlen.org](https://api.corona-zahlen.org)

## Donation

If you use this API, please consider supporting me:

<a href='https://ko-fi.com/marlon360' target='_blank'><img height='35' style='border:0px;height:48px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## 🇩🇪 Übersicht

- Anzahl der Infektionen, Todesfälle, Genesenen
- 7-Tage-Inzidenz Wert
- Neuinfektionen, neue Todesfälle, neue Genesene (Differenz zum Vortag)
- R-Wert (Reproduktion)
- Impfquote
- Werte für jedes Bundesland und jeden Landkreis
- historische Daten für Deutschland, jedes Bundesland and jeden Landkreis
- Karten mit Bundesländern und Landkreisen
- Anzahl der wöchentlich durchgeführen PCR-Tests, Anzahl der positiven Tests sowie der Positiv Quote

## 🇺🇸 Overview

- cases, deaths, recovered
- week incidence
- new cases, deaths, recovered (difference to yesterday)
- R value (reproduction)
- vaccinations
- data per state and district
- time series for every state and district
- maps for states and districts
- Number of performed PCR-test, number of positive tests and positivity rate

## Endpoints

- [Germany](endpoints/germany.md)
- [States](endpoints/states.md)
- [Districts](endpoints/districts.md)
- [Vaccinations](endpoints/vaccinations.md)
- [Maps](endpoints/maps.md)
- [Testing](endpoints/testing.md) 

## Data sources

**Time series data**

[https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0)

**States data**

[https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0)

**Districts data**

[https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0)

**Vaccination data**

[https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx?__blob=publicationFile)

**R value**

[https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen.xlsx?__blob=publicationFile](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Projekte_RKI/Nowcasting_Zahlen.xlsx?__blob=publicationFile)

**Testing data**

[https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Testzahlen-gesamt.xlsx?__blob=publicationFile](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Testzahlen-gesamt.xlsx?__blob=publicationFile)

## Host it yourself

### Requirements

- Docker runtime
- Docker compose

### Start Server

1. Setup docker-compose.yml:

```yml
version: "3.8"
networks:
  redis-net:
services:
  redis:
    image: redis
    container_name: cache
    expose:
      - 6379
    networks:
      - redis-net
  rki-api:
    image: marlon360/rki-covid-server:v2
    ports:
      - "8080:3000"
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis
    networks:
      - redis-net
```

2. Start Server:

`docker-compose up`

Now you can access the server at `http://localhost:8080`.

## Project Showcase (projects using this API)

[Add your project by opening an issue with your project details!](https://github.com/marlon360/rki-covid-api/issues/new)

- CoronaBot Deutschland [https://twitter.com/CoronaBot_DEU](https://twitter.com/CoronaBot_DEU)
- Fallzahlen Aktuell - Inzidenz & mehr aus DE [https://play.google.com/store/apps/details?id=com.kokoschka.michael.casestoday&hl=de](https://play.google.com/store/apps/details?id=com.kokoschka.michael.casestoday&hl=de)
- Home Assistant Integration [https://github.com/thebino/rki_covid](https://github.com/thebino/rki_covid)
- Corona Charts für Deutschland [https://corona.maximilianhaindl.de](https://corona.maximilianhaindl.de)
- Corona Infos für das Berchtesgadener Land mit Zusatzinfos [https://covid.webreload.de/](https://covid.webreload.de/)
- Twitter bot for vaccination numbers [https://twitter.com/impfstatus](https://twitter.com/impfstatus)
- App Infektionsgeschehen [https://play.google.com/store/apps/details?id=de.geekbits.infektionsgeschehen](https://play.google.com/store/apps/details?id=de.geekbits.infektionsgeschehen)
- App: corona-wiki [https://v-braun.github.io/corona-wiki](https://v-braun.github.io/corona-wiki)
- small project to show some data [https://www.corona-zahlen.net/](https://www.corona-zahlen.net/)
- Corona Update Germany Telegram Channel [https://t.me/corona_update_germany](https://t.me/corona_update_germany), Project can be found [here](https://github.com/Nlea/camunda-cloud-corona-update-process)
- Die Corona Zahlen im Frankenjura [https://www.frankenjura.com/frankenjura/corona](https://www.frankenjura.com/frankenjura/corona)
- COVID-19 Impfdauer-Rechner [https://www.impfdauer.de](https://www.impfdauer.de)
- Discord Corona Bot [https://github.com/markxoe/covid-bot](https://github.com/markxoe/covid-bot)
- COVID-19 Dashboard [https://covid.beyerleinf.de](https://covid.beyerleinf.de)
- 7-Tage-Inzidenz Verlauf mit Vergleich beliebiger Städte/Länder [https://incidence-trend.web.app/](https://incidence-trend.web.app/)
- COVID-19 Scriptable Dashboard [https://gist.github.com/marcusraitner/a1b633625d1016498eaaab712461dfc4](https://gist.github.com/marcusraitner/a1b633625d1016498eaaab712461dfc4)
- Corona statistics with diagrams [https://corona.jnebel.de/](https://corona.jnebel.de/)
- Twitter account with this API [https://twitter.com/GermanyCovid](https://twitter.com/GermanyCovid)
- Corona, what's going on in your county or city [https://chrnoe.de/corona](https://chrnoe.de/corona)
- Wordpress Widget zur Anzeige der letzen 3 Inzidenzen für einen Landkreis [https://github.com/p-tenz/widget-7d-incidence](https://github.com/p-tenz/widget-7d-incidence)

## License

<p xmlns:dct="http://purl.org/dc/terms/" xmlns:cc="http://creativecommons.org/ns#" class="license-text"><a rel="cc:attributionURL" property="dct:title" href="https://rki.marlon-lueckert.de">rki-covid-api</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://marlon-lueckert.de">Marlon Lückert</a> is licensed under <a rel="license" href="https://creativecommons.org/licenses/by/4.0">CC BY 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" /><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" /></a></p>

