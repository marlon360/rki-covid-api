import * as path from 'path';
import express from 'express';
import cors from 'cors';

import { StatesCasesHistoryResponse, StatesDeathsHistoryResponse, StatesRecoveredHistoryResponse, StatesResponse } from './responses/states';
import { GermanyCasesHistoryResponse, GermanyDeathsHistoryResponse, GermanyRecoveredHistoryResponse, GermanyResponse } from './responses/germany';
import { DistrictsCasesHistoryResponse, DistrictsDeathsHistoryResponse, DistrictsRecoveredHistoryResponse, DistrictsResponse } from './responses/districts'
import { VaccinationResponse } from './responses/vaccination'

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
  const response = await GermanyDeathsHistoryResponse();
  res.json(response)
})

app.get('/germany/history/deaths/:days',cache.route(), async (req, res) => {
  const response = await GermanyDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/germany/history/recovered',cache.route(), async (req, res) => {
  const response = await GermanyRecoveredHistoryResponse();
  res.json(response)
})

app.get('/germany/history/recovered/:days',cache.route(), async (req, res) => {
  const response = await GermanyRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states', cache.route(), async (req, res) => {
  const response = await StatesResponse();
  res.json(response)
})

app.get('/states/history', cache.route(), async (req, res) => {
  res.redirect('/states/history/cases')
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
  const response = await StatesResponse(req.params.state);
  res.json(response)
})

app.get('/states/:state/history', cache.route(), async (req, res) => {
  res.redirect(`/states/${req.params.state}/history/cases`)
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

app.get('/districts', cache.route(), async (req, res) => {
  const response = await DistrictsResponse();
  res.json(response)
})

app.get('/districts/:district', cache.route(), async (req, res) => {
  const response = await DistrictsResponse(req.params.district);
  res.json(response)
})

app.get('/districts/history', cache.route(), async (req, res) => {
  res.redirect('/districts/history/cases')
})

app.get('/districts/history/cases', cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse();
  res.json(response)
})

app.get('/districts/history/cases/:days', cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/history/deaths', cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse();
  res.json(response)
})

app.get('/districts/history/deaths/:days', cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/history/recovered', cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse();
  res.json(response)
})

app.get('/districts/history/recovered/:days', cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/:district', cache.route(), async (req, res) => {
  const response = await DistrictsResponse(req.params.district);
  res.json(response)
})

app.get('/districts/:district/history', cache.route(), async (req, res) => {
  res.redirect(`/districts/${req.params.district}/history/cases`)
})

app.get('/districts/:district/history/cases', cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/cases/:days', cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/deaths', cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/deaths/:days', cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/recovered', cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/recovered/:days', cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/vaccination', cache.route(), async (req, res) => {
  const response = await VaccinationResponse();
  res.json(response)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})


