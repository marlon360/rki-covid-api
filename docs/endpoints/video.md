# VideoMaps

The following links return mp4 videos of the incidences. The calculation is very time consuming if the link is not requested on today. The basis is the dynamic (i.e. daily updated) incidence numbers, so that the calculated videos are only valid for one day. 
At the first time one of this links is requested all single frames are calculated. This first calculation takes approx. 4 - 5 minutes on a server with a 4 core Intel(R) Core(TM) i5-7600 @ 3.50Ghz processor and approx. 40 minutes on my raspberryPi 4 with 4GB RAM !
After that on next day only the frames that have changed are recalculated. This takes only a few seconds on a server with a 4 core Intel(R) Core(TM) i5-7600 @ 3.50Ghz processor and approx. 5 - 10 minutes on my raspberryPi 4 with 4GB RAM, and is depend on the number of changed days.
If all frames are calculated for the day the rendering of the video (if not requested on this day bevor) takes only a few seconds on a server with a 4 core Intel(R) Core(TM) i5-7600 @ 3.50Ghz processor and 1 - 2 minutes on my raspberryPi 4 with 4GB RAM.

## `/video`

Redirects to `/video/districts-legend`.

## `/video/districts-legend`

Returns a Heatmap Video (MP4) of week incidences for districts with legend.

### Request

`GET https://api.corona-zahlen.org/video/districts-legend`
[Open](/video/districts-legend)

## `/video/districts`

Returns a Heatmap Video (MP4) of week incidences for districts without legend.

### Request

`GET https://api.corona-zahlen.org/video/districts`
[Open](/video/districts/)

## `/video/districts-legend/:days`

Returns a Heatmap Video (MP4) of week incidences for districts with legend, from the past :days days

### Request

`GET https://api.corona-zahlen.org/video/districts-legend/100`
[Open](/video/districts-legend/100)

## `/video/districts/:days`

Returns a Heatmap Video (MP4) of week incidences for districts without legend, from the past :days days

### Request

`GET https://api.corona-zahlen.org/video/districts/100`
[Open](/video/districts/100)

All endpoints mentioned above also apply to states e.g. /video/states-legend/, /video/states, /video/states-legend/:days and /video/states/:days
