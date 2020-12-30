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

import { StatesCasesHistoryResponse, StatesDeathsHistoryResponse, StatesRecoveredHistoryResponse, StatesResponse } from './responses/states';
import { GermanyCasesHistoryResponse, GermanyResponse } from './responses/germany';

const cache = require('express-redis-cache')({ expire: 60, host: process.env.REDIS_URL });

Date.prototype.toJSON = function() {
  return this.toISOString()
}

const app = express()
const port = 3000

app.use(cors())

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
})

app.get('/germany', cache.route(), async (req, res) => {
  const response = await GermanyResponse();
  res.json(response)
})

app.get('/germany/history', cache.route(), async (req, res) => {
  res.redirect('/germany/history/cases')
})

app.get('/germany/history/cases', cache.route(), async (req, res) => {
  const response = await GermanyCasesHistoryResponse();
  res.json(response)
})

app.get('/germany/history/cases/:days',cache.route(), async (req, res) => {
  const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/germany/history/deaths',cache.route(), async (req, res) => {
  // const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  // res.json(response)
})

app.get('/germany/history/deaths/:days',cache.route(), async (req, res) => {
  // const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  // res.json(response)
})

app.get('/germany/history/recovered',cache.route(), async (req, res) => {
  // const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  // res.json(response)
})

app.get('/germany/history/recovered/:days',cache.route(), async (req, res) => {
  // const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  // res.json(response)
})

app.get('/states', cache.route(), async (req, res) => {
  const response = await StatesResponse();
  res.json(response)
})

app.get('/states/history/cases', cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse();
  res.json(response)
})

app.get('/states/history/cases/:days', cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/history/deaths', cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse();
  res.json(response)
})

app.get('/states/history/deaths/:days', cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/history/recovered', cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse();
  res.json(response)
})

app.get('/states/history/recovered/:days', cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/:state', cache.route(), async (req, res) => {
  // const response = await StatesResponse();
  // res.json(response)
})

app.get('/states/:state/history/cases', cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/cases/:days', cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.get('/states/:state/history/deaths', cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/deaths/:days', cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.get('/states/:state/history/recovered', cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/recovered/:days', cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})


