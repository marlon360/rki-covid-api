const path = require('path');
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
const { connectToDatabase } = require('./utils/database');

const app = express()
const port = 3000

app.use(cors())

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
})

app.get('/api', async (req, res) => {
  res.redirect('/api/general');
})

app.get('/api/general', general)

app.get('/api/states', states)
app.get('/api/states-map', statesMap)
app.get('/api/districts', districts)
app.get('/api/districts-map', districtsMap)

async function updateDataSources(database) {
  try {
    await updateGeneral(database);
    await updateDistricts();
    await updateStates();
    await updateStatesMap();
    await updateDistrictsMap();
  } catch (error) {
    console.log(error);
  }
}

async function main() {

  console.log("Starting..");

  console.log("Connection to database..");
  const database = await connectToDatabase();

  console.log("Updating data sources..");
  await updateDataSources(database);

  console.log("Starting cronjob..");
  var job = new CronJob('0 */20 * * * *', () => updateDataSources(database));
  job.start();

  console.log("Starting server..");
  app.locals.database = database;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

main();
