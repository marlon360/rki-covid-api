import * as path from "path";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import queue from "@marlon360/express-queue";
import "express-async-errors";
import axios from "axios";

import {
  StatesCasesHistoryResponse,
  StatesDeathsHistoryResponse,
  StatesRecoveredHistoryResponse,
  StatesResponse,
  StatesWeekIncidenceHistoryResponse,
  StatesAgeGroupsResponse,
  StatesFrozenIncidenceHistoryResponse,
  StatesHospitalizationHistoryResponse,
} from "./responses/states";
import {
  GermanyAgeGroupsResponse,
  GermanyCasesHistoryResponse,
  GermanyDeathsHistoryResponse,
  GermanyRecoveredHistoryResponse,
  GermanyResponse,
  GermanyWeekIncidenceHistoryResponse,
  GermanyFrozenIncidenceHistoryResponse,
  GermanyHospitalizationHistoryResponse,
} from "./responses/germany";
import {
  DistrictsCasesHistoryResponse,
  DistrictsDeathsHistoryResponse,
  DistrictsRecoveredHistoryResponse,
  DistrictsResponse,
  DistrictsWeekIncidenceHistoryResponse,
  FrozenIncidenceHistoryResponse,
} from "./responses/districts";
import {
  VaccinationResponse,
  VaccinationHistoryResponse,
} from "./responses/vaccination";
import { TestingHistoryResponse } from "./responses/testing";
import {
  DistrictsLegendMapResponse,
  DistrictsMapResponse,
  IncidenceColorsResponse,
  StatesHospitalizationLegendMapResponse,
  StatesHospitalizationMapResponse,
  StatesLegendMapResponse,
  StatesMapResponse,
} from "./responses/map";
import {
  RKIError,
  ParamError,
  checkDays,
  checkAbbreviation,
  checkAgs,
} from "./utils";

const cache = require("express-redis-cache")({
  expire: { 200: 1800, 400: 10, 503: 60, xxx: 180 },
  host: process.env.REDISHOST || process.env.REDIS_URL,
  port: process.env.REDISPORT,
  auth_pass: process.env.REDISPASSWORD,
});

Date.prototype.toJSON = function () {
  return this.toISOString();
};

const app = express();
const port = 3000;

app.use("/docs", express.static(path.join(__dirname, "docs")));
app.use(cors());
app.use(compression());

const queuedCache = () => {
  const cacheQueue = queue({ activeLimit: 2 });
  return function (req: Request, res: Response, next: NextFunction) {
    const cacheName = req.originalUrl;
    cache.get(cacheName, function (error, entries) {
      if (error) {
        return next();
      }
      if (entries.length > 0) {
        return next();
      } else {
        return cacheQueue(req, res, next);
      }
    });
  };
};

app.get("/", async function (req, res) {
  res.redirect("docs");
});

app.get("/germany", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyResponse();
  res.json(response);
});

app.get(
  "/germany/history",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.redirect("/germany/history/cases");
  }
);

app.get(
  "/germany/history/cases",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyCasesHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/cases/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyCasesHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyWeekIncidenceHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyWeekIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/frozen-incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyFrozenIncidenceHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/frozen-incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyFrozenIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/deaths",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyDeathsHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/deaths/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyDeathsHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/recovered",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyRecoveredHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/recovered/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyRecoveredHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/hospitalization",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyHospitalizationHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/germany/history/hospitalization/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyHospitalizationHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/germany/age-groups",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await GermanyAgeGroupsResponse();
    res.json(response);
  }
);

app.get("/states", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesResponse({ abbreviation: null });
  res.json(response);
});

app.get("/states/history", async function (req, res) {
  res.redirect("/states/history/cases");
});

app.get(
  "/states/history/cases",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesCasesHistoryResponse({
      days: null,
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/cases/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesCasesHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/deaths",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesDeathsHistoryResponse({
      days: null,
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/deaths/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesDeathsHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/recovered",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesRecoveredHistoryResponse({
      days: null,
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/recovered/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesRecoveredHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesWeekIncidenceHistoryResponse({
      days: null,
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesWeekIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/frozen-incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesFrozenIncidenceHistoryResponse({
      days: null,
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/frozen-incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesFrozenIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/hospitalization",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesHospitalizationHistoryResponse({
      days: null,
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/history/hospitalization/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesHospitalizationHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/age-groups",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesAgeGroupsResponse({
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/states/:state",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesResponse({
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get("/states/:state/history", async function (req, res) {
  res.redirect(`/states/${req.params.state}/history/cases`);
});

app.get(
  "/states/:state/history/cases",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesCasesHistoryResponse({
      days: null,
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/cases/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesCasesHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesWeekIncidenceHistoryResponse({
      days: null,
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesWeekIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/frozen-incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesFrozenIncidenceHistoryResponse({
      days: null,
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/frozen-incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesFrozenIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/deaths",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesDeathsHistoryResponse({
      days: null,
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/deaths/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesDeathsHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/recovered",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesRecoveredHistoryResponse({
      days: null,
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/recovered/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesRecoveredHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/hospitalization",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesHospitalizationHistoryResponse({
      days: null,
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/history/hospitalization/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesHospitalizationHistoryResponse({
      days: checkDays(req.params.days, req.url),
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/states/:state/age-groups",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await StatesAgeGroupsResponse({
      abbreviation: checkAbbreviation(req.params.state, req.url),
    });
    res.json(response);
  }
);

app.get("/districts", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsResponse({
    ags: null,
  });
  res.json(response);
});

app.get("/districts/history", async function (req, res) {
  res.redirect("/districts/history/cases");
});

app.get(
  "/districts/history/cases",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsCasesHistoryResponse({
      days: null,
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/cases/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsCasesHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsWeekIncidenceHistoryResponse({
      days: null,
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/frozen-incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await FrozenIncidenceHistoryResponse({
      days: null,
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/frozen-incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await FrozenIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsWeekIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/deaths",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsDeathsHistoryResponse({
      days: null,
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/deaths/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsDeathsHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/recovered",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsRecoveredHistoryResponse({
      days: null,
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/history/recovered/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsRecoveredHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: null,
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsResponse({
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get("/districts/:district/history", async function (req, res) {
  res.redirect(`/districts/${req.params.district}/history/cases`);
});

app.get(
  "/districts/:district/history/cases",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsCasesHistoryResponse({
      days: null,
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/cases/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsCasesHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsWeekIncidenceHistoryResponse({
      days: null,
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsWeekIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/frozen-incidence",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await FrozenIncidenceHistoryResponse({
      days: null,
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/frozen-incidence/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await FrozenIncidenceHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/deaths",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsDeathsHistoryResponse({
      days: null,
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/deaths/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsDeathsHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/recovered",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsRecoveredHistoryResponse({
      days: null,
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/districts/:district/history/recovered/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await DistrictsRecoveredHistoryResponse({
      days: checkDays(req.params.days, req.url),
      ags: checkAgs(req.params.district, req.url),
    });
    res.json(response);
  }
);

app.get(
  "/vaccinations",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await VaccinationResponse({
      abbreviation: null,
    });
    res.json(response);
  }
);

app.get(
  "/vaccinations/history",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await VaccinationHistoryResponse({
      days: null,
    });
    res.json(response);
  }
);

app.get(
  "/vaccinations/history/:days",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await VaccinationHistoryResponse({
      days: checkDays(req.params.days, req.url),
    });
    res.json(response);
  }
);

app.get("/map", async function (req, res) {
  res.redirect("/map/districts");
});

app.get(
  "/map/districts",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.setHeader("Content-Type", "image/png");
    const response = await DistrictsMapResponse();
    res.send(response);
  }
);

app.get(
  "/map/districts-legend",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.setHeader("Content-Type", "image/png");
    const response = await DistrictsLegendMapResponse();
    res.send(response);
  }
);

app.get(
  "/map/districts/legend",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.json(IncidenceColorsResponse());
  }
);

app.get("/map/states", queuedCache(), cache.route(), async function (req, res) {
  res.setHeader("Content-Type", "image/png");
  const response = await StatesMapResponse();
  res.send(response);
});

app.get(
  "/map/states-legend",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.setHeader("Content-Type", "image/png");
    const response = await StatesLegendMapResponse();
    res.send(response);
  }
);

app.get(
  "/map/states/legend",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.json(IncidenceColorsResponse());
  }
);

app.get(
  "/map/states-legend/hospitalization",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.setHeader("Content-Type", "image/png");
    const response = await StatesHospitalizationLegendMapResponse();
    res.send(response);
  }
);

app.get(
  "/map/states/hospitalization",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    res.setHeader("Content-Type", "image/png");
    const response = await StatesHospitalizationMapResponse();
    res.send(response);
  }
);

app.get(
  "/testing/history",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await TestingHistoryResponse({
      weeks: null,
    });
    res.json(response);
  }
);

app.get(
  "/testing/history/:weeks",
  queuedCache(),
  cache.route(),
  async function (req, res) {
    const response = await TestingHistoryResponse({
      weeks: checkDays(req.params.weeks, req.url),
    });
    res.json(response);
  }
);

app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof RKIError) {
    res.status(503).json({
      error: {
        message: "There is a problem with the official RKI API.",
        rkiError: error.rkiError,
        url: error.url || "",
      },
    });
  } else if (axios.isAxiosError(error)) {
    res.status(503).json({
      error: {
        message: "An error occurred while fetching external data.",
        url: error.config.url,
        details: error.message,
        stack: error.stack,
      },
    });
  } else if (error instanceof ParamError) {
    res.status(error.paramError.code).json({
      error: {
        message: error.paramError.message,
        paramError: error.paramError.details,
        url: error.url || "",
      },
    });
  } else {
    const baseError = error as Error;
    res.status(400).json({
      error: {
        message: "An error occurred.",
        details: baseError.message,
        stack: baseError.stack,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
