import * as path from 'path';
import express from 'express';
import cors from 'cors';
import { CronJob } from 'cron';

import { general } from './api/general';
import { states } from './api/states';
import { statesMap } from './api/states-map';
import { districts } from './api/districts';
import { districtsMap } from './api/districts-map';

import { updateGeneral } from './cronjobs/updateGeneral';
import { updateDistricts } from './cronjobs/updateDistricts';
import { updateStates } from './cronjobs/updateStates';
import { updateDistrictsMap } from './cronjobs/updateDistrictsMap';
import { updateStatesMap } from './cronjobs/updateStatesMap';
import { connectToDatabase } from './utils/database';

const app = express()
const port = 3000

app.use(cors())

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(path.dirname('static/index.html')));
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
