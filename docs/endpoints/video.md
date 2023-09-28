# VideoMaps

The following links return mp4 videos of the course of the pandemic.
At this time (2023-09-28) for each "category" (districts, states) 2720 single frames must be calculated initialy (1360 with legend, 1360 without legend). This will be done for every category at the first time someone requests this category (with or without legend).
This initial run takes for states frames approx. 3 minutes and for districts frames approx. 7 minutes on a server with a 4 core Intel(R) Core(TM) i5-7600 @ 3.50Ghz processor.
If you are running this api at home on not so performant hardware you have to expect significantly longer times. On my raspberryPi4 (4 cores 1.5 Ghz, 4GB RAM) this will take for states frames approx 24 minutes and for districts frames 55 minutes!
After that initial run on next day only the frames that have changed colors are recalculated (maybe the week incidence is changed but the rangecolor not!). This changes are typicaly 2 - 20 frames for districts and 2 - 4 for states. This takes only a few seconds is depend on the number of changed days (the minimum for each category is 2, because of the new day).
If all frames are calculated for the day the rendering of the video (if not requested on this day bevor) takes only a few seconds on a server with a 4 core Intel(R) Core(TM) i5-7600 @ 3.50Ghz processor and approx. 1.5 minutes on my raspberryPi 4 with 4GB RAM for a full video with 1360 frames. All requested videos are saved as long as no newer data is availible.

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

Returns a Heatmap Video (MP4) of week incidences for districts without legend, from the past :days days (lowest value is 100)

### Request

`GET https://api.corona-zahlen.org/video/districts/100`
[Open](/video/districts/100)

All endpoints mentioned above also apply to states e.g. /video/states-legend/, /video/states, /video/states-legend/:days and /video/states/:days
