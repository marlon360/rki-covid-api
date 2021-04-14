import * as path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression'
import queue from '@marlon360/express-queue'
import 'express-async-errors';

import { StatesCasesHistoryResponse, StatesDeathsHistoryResponse, StatesRecoveredHistoryResponse, StatesResponse, StatesWeekIncidenceHistoryResponse } from './responses/states';
import { GermanyCasesHistoryResponse, GermanyDeathsHistoryResponse, GermanyRecoveredHistoryResponse, GermanyResponse, GermanyWeekIncidenceHistoryResponse } from './responses/germany';
import { DistrictsCasesHistoryResponse, DistrictsDeathsHistoryResponse, DistrictsRecoveredHistoryResponse, DistrictsResponse, DistrictsWeekIncidenceHistoryResponse } from './responses/districts'
import { VaccinationResponse, VaccinationHistoryResponse } from './responses/vaccination'
import { TestingHistoryResponse} from './responses/testing' 
import { DistrictsMapResponse, IncidenceColorsResponse, StatesMapResponse } from './responses/map';
import { RKIError } from './utils';

const cache = require('express-redis-cache')({ expire: 1800, host: process.env.REDIS_URL });

Date.prototype.toJSON = function() {
  return this.toISOString()
}

const app = express()
const port = 3000

app.use('/docs', express.static(path.join(__dirname, 'docs')))
app.use(cors())
app.use(compression())

const queuedCache = () => {
  const cacheQueue = queue({activeLimit: 2});
  return function(req: Request, res: Response, next: NextFunction) {
    const cacheName = req.originalUrl;
    cache.get(cacheName, function (error, entries) {
      if (error) {
        return next();
      }
      if (entries.length > 0) {
        return next()
      } else {
        return cacheQueue(req, res, next);
      }
    });
  }
}

app.get('/', async (req, res) => {
  res.redirect('docs')
})

app.get('/germany', queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyResponse();
  res.json(response)
})

app.get('/germany/history',  queuedCache(), cache.route(), async (req, res) => {
  res.redirect('/germany/history/cases')
})

app.get('/germany/history/cases', queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyCasesHistoryResponse();
  res.json(response)
})

app.get('/germany/history/cases/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/germany/history/incidence', queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyWeekIncidenceHistoryResponse();
  res.json(response)
})

app.get('/germany/history/incidence/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyWeekIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/germany/history/deaths', queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyDeathsHistoryResponse();
  res.json(response)
})

app.get('/germany/history/deaths/:days',queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/germany/history/recovered',queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyRecoveredHistoryResponse();
  res.json(response)
})

app.get('/germany/history/recovered/:days',queuedCache(), cache.route(), async (req, res) => {
  const response = await GermanyRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesResponse();
  res.json(response)
})

app.get('/states/history', async (req, res) => {
  res.redirect('/states/history/cases')
})

app.get('/states/history/cases', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse();
  res.json(response)
})

app.get('/states/history/cases/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/history/deaths', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse();
  res.json(response)
})

app.get('/states/history/deaths/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/history/recovered', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse();
  res.json(response)
})

app.get('/states/history/recovered/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/history/incidence', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesWeekIncidenceHistoryResponse();
  res.json(response)
})

app.get('/states/history/incidence/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesWeekIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/states/:state', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesResponse(req.params.state);
  res.json(response)
})

app.get('/states/:state/history', async (req, res) => {
  res.redirect(`/states/${req.params.state}/history/cases`)
})

app.get('/states/:state/history/cases', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/cases/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesCasesHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.get('/states/:state/history/incidence', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesWeekIncidenceHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/incidence/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesWeekIncidenceHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.get('/states/:state/history/deaths', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/deaths/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesDeathsHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.get('/states/:state/history/recovered', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse(null, req.params.state);
  res.json(response)
})

app.get('/states/:state/history/recovered/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await StatesRecoveredHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response)
})

app.get('/districts', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsResponse();
  res.json(response)
})

app.get('/districts/:district', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsResponse(req.params.district);
  res.json(response)
})

app.get('/districts/history', async (req, res) => {
  res.redirect('/districts/history/cases')
})

app.get('/districts/history/cases', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse();
  res.json(response)
})

app.get('/districts/history/cases/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/history/incidence', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsWeekIncidenceHistoryResponse();
  res.json(response)
})

app.get('/districts/history/incidence/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsWeekIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/history/deaths', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse();
  res.json(response)
})

app.get('/districts/history/deaths/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/history/recovered', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse();
  res.json(response)
})

app.get('/districts/history/recovered/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response)
})

app.get('/districts/:district', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsResponse(req.params.district);
  res.json(response)
})

app.get('/districts/:district/history', async (req, res) => {
  res.redirect(`/districts/${req.params.district}/history/cases`)
})

app.get('/districts/:district/history/cases', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/cases/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsCasesHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/incidence', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsWeekIncidenceHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/incidence/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsWeekIncidenceHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/deaths', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/deaths/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsDeathsHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/recovered', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse(null, req.params.district);
  res.json(response)
})

app.get('/districts/:district/history/recovered/:days', queuedCache(), cache.route(), async (req, res) => {
  const response = await DistrictsRecoveredHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response)
})

app.get('/vaccinations', queuedCache(), cache.route(), async (req, res) => {
  const response = await VaccinationResponse();
  res.json(response)
})

app.get('/vaccinations/history', queuedCache(), cache.route(), async (req, res) => {
  const response = await VaccinationHistoryResponse();  
  res.json(response)
})

app.get('/map', async (req, res) => {
  res.redirect('/map/districts')
})

app.get('/map/districts', queuedCache(), cache.route(), async (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  const response = await DistrictsMapResponse();
  res.send(response)
})

app.get('/map/districts/legend', queuedCache(), cache.route(), async (req, res) => {
  res.json(IncidenceColorsResponse());
})

app.get('/map/states', queuedCache(), cache.route(), async (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  const response = await StatesMapResponse();
  res.send(response)
})

app.get('/map/states/legend', queuedCache(), cache.route(), async (req, res) => {
  res.json(IncidenceColorsResponse());
})

app.get('/testing/history',queuedCache(), cache.route(), async (req, res) => {
  const response = await TestingHistoryResponse();
  res.json(response)
})

app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof RKIError) {
    res.json({
      error: {
        message: "There is a problem with the official RKI API.",
        rkiError: error.rkiError,
        url: error.url || ""
      }
    })
  } else {
    const baseError = error as Error;
    res.json({
      error: {
        message: "An error occurred.",
        details: baseError.message,
        stack: baseError.stack
      }
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
