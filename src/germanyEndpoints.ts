import {
  GermanyAgeGroupsResponse,
  GermanyCasesChangesHistoryResponse,
  GermanyCasesHistoryResponse,
  GermanyCasesLastChangeHistoryResponse,
  GermanyDeathsHistoryResponse,
  GermanyFrozenIncidenceHistoryResponse,
  GermanyHospitalizationHistoryResponse,
  GermanyRecoveredHistoryResponse,
  GermanyResponse,
  GermanyWeekIncidenceHistoryResponse,
  GermanyDeathsLastChangeHistoryResponse,
} from "./responses/germany";
import { RValueHistoryHistoryResponse } from "./responses/r-value";
import { app, queuedCache, cache } from "./server";
import { checkDateParameter } from "./utils";

app.get("/germany", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyResponse();
  res.json(response);
});

app.get("/germany/history", queuedCache(), cache.route(), async function (req, res) {
  res.redirect("/germany/history/cases");
});

app.get("/germany/history/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyCasesHistoryResponse();
  res.json(response);
});

app.get("/germany/history/changes/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyCasesChangesHistoryResponse();
  res.json(response);
});

app.get("/germany/history/changes/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesChangesHistoryResponse(new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/changesofreportday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesChangesHistoryResponse(null, new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/changesofchangeday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesChangesHistoryResponse(null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/lastchange/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyCasesLastChangeHistoryResponse();
  res.json(response);
});

app.get("/germany/history/lastchange/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesLastChangeHistoryResponse(new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyCasesHistoryResponse(parseInt(req.params.days));
  res.json(response);
});
/*
app.get("/germany/history/changes/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyCasesChangesHistoryResponse();
  res.json(response);
});

app.get("/germany/history/changes/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesChangesHistoryResponse(new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/changesofreportday/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesChangesHistoryResponse(null, new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/changesofchangeday/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesChangesHistoryResponse(null, null, new Date(checkedDateString));
  res.json(response);
});
*/
app.get("/germany/history/lastchange/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyDeathsLastChangeHistoryResponse();
  res.json(response);
});

app.get("/germany/history/lastchange/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await GermanyCasesLastChangeHistoryResponse(new Date(checkedDateString));
  res.json(response);
});

app.get("/germany/history/incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyWeekIncidenceHistoryResponse();
  res.json(response);
});

app.get("/germany/history/incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyWeekIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/germany/history/frozen-incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyFrozenIncidenceHistoryResponse();
  res.json(response);
});

app.get("/germany/history/frozen-incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyFrozenIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/germany/history/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyDeathsHistoryResponse();
  res.json(response);
});

app.get("/germany/history/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/germany/history/recovered", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyRecoveredHistoryResponse();
  res.json(response);
});

app.get("/germany/history/recovered/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/germany/history/hospitalization", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyHospitalizationHistoryResponse();
  res.json(response);
});

app.get("/germany/history/rValue", queuedCache(), cache.route(), async function (req, res) {
  const response = await RValueHistoryHistoryResponse();
  res.json(response);
});

app.get("/germany/history/hospitalization/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyHospitalizationHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/germany/history/rValue/:days", queuedCache(), cache.route(), async (req, res) => {
  const response = await RValueHistoryHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/germany/age-groups", queuedCache(), cache.route(), async function (req, res) {
  const response = await GermanyAgeGroupsResponse();
  res.json(response);
});
