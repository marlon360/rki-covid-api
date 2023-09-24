# VideoMaps

The following links return mp4 videos of the incidences. The calculation is very time consuming if the link is not requested on today. The basis is the dynamic (i.e. daily updated) incidence numbers, so that the calculated videos are only valid for one day. They have to be recalculated every day. The calculation of the district/legend video takes approx. 4 - 5 minutes on a server with a 4 core Intel(R) Core(TM) i5-7600 @ 3.50Ghz processor. There is a built-in simple test and the calculation will be refused if at least a 4 core CPU with at least 2 GHz is used!
This simple test can be disabled by prepending /nocpucheck/ e.g. http://server:port/nocpucheck/video/districts-legend but should only be done in non-production environments!

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
