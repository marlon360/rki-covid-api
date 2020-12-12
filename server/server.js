const express = require('express')
const cors = require('cors');
const { CronJob } = require('cron');

const { general } = require('./api/general');
const { states } = require('./api/states');
const { statesMap } = require('./api/states-map');
const { districts } = require('./api/districts');
const { districtsMap } = require('./api/districts-map');

const { updateGeneral } = require('./cronjobs/updateGeneral');
const { updateDistricts } = require('./cronjobs/updateDistricts');
const { updateStates } = require('./cronjobs/updateStates');
const { updateDistrictsMap } = require('./cronjobs/updateDistrictsMap');
const { updateStatesMap } = require('./cronjobs/updateStatesMap');

const app = express()
const port = 3000

app.use(cors())

app.get('/general', async (req, res) => {
  general().then((response) => {
    res.statusCode = response.statusCode;
    res.send(response.body);
  }).catch((error) => {
    res.statusCode = error.statusCode;
    res.send(error.body);
  })
})

app.get('/states', states)
app.get('/states-map', statesMap)
app.get('/districts', districts)
app.get('/districts-map', districtsMap)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

async function updateDataSources() {
  try {
    await updateGeneral();
    await updateDistricts();
    await updateStates();
    await updateStatesMap();
    await updateDistrictsMap();
  } catch (error) {
    console.log(error);
  }
}

updateDataSources();

var job = new CronJob('0 */15 * * * *', updateDataSources);
job.start();