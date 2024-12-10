import {
  StatesAgeGroupsResponse,
  StatesCasesChangesHistoryResponse,
  StatesCasesHistoryResponse,
  StatesCasesLastChangeHistoryResponse,
  StatesDeathsHistoryResponse,
  StatesFrozenIncidenceHistoryResponse,
  StatesHospitalizationHistoryResponse,
  StatesRecoveredHistoryResponse,
  StatesResponse,
  StatesWeekIncidenceHistoryResponse,
} from "./responses/states";
import { app, queuedCache, cache } from "./server";
import { checkDateParameter, getStateIdByAbbreviation as gSIBA } from "./utils";

app.get("/states", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesResponse();
  res.json(response);
});

app.get("/states/history", async function (req, res) {
  res.redirect("/states/history/cases");
});

app.get("/states/history/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesCasesHistoryResponse();
  res.json(response);
});

app.get("/states/history/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesCasesHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/states/history/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesDeathsHistoryResponse();
  res.json(response);
});

app.get("/states/history/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/states/history/recovered", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesRecoveredHistoryResponse();
  res.json(response);
});

app.get("/states/history/recovered/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/states/history/incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesWeekIncidenceHistoryResponse();
  res.json(response);
});

app.get("/states/history/incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesWeekIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/states/history/frozen-incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesFrozenIncidenceHistoryResponse();
  res.json(response);
});

app.get("/states/history/frozen-incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesFrozenIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/states/history/hospitalization", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesHospitalizationHistoryResponse();
  res.json(response);
});

app.get("/states/history/hospitalization/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesHospitalizationHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/states/history/changes/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesCasesChangesHistoryResponse();
  res.json(response);
});

app.get("/states/:states/history/changes/cases", queuedCache(), cache.route(), async function (req, res) {
  const stateId = gSIBA(req.params.states) != null ? gSIBA(req.params.states).toString().padStart(2, "0") : null;
  if (stateId == null) throw new TypeError(`${req.params.states} is not a valid abbreviation for a state`);
  const response = await StatesCasesChangesHistoryResponse(stateId);
  res.json(response);
});

app.get("/states/history/changes/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesChangesHistoryResponse(null, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/:state/history/changes/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const stateId = gSIBA(req.params.state) != null ? gSIBA(req.params.state).toString().padStart(2, "0") : null;
  if (stateId == null) throw new TypeError(`${req.params.state} is not a valid abbreviation for a state`);
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesChangesHistoryResponse(stateId, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/history/changesofreportday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesChangesHistoryResponse(null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/:state/history/changesofreportday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const stateId = gSIBA(req.params.state) != null ? gSIBA(req.params.state).toString().padStart(2, "0") : null;
  if (stateId == null) throw new TypeError(`${req.params.state} is not a valid abbreviation for a state`);
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesChangesHistoryResponse(stateId, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/history/changesofchangeday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesChangesHistoryResponse(null, null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/:state/history/changesofchangeday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const stateId = gSIBA(req.params.state) != null ? gSIBA(req.params.state).toString().padStart(2, "0") : null;
  if (stateId == null) throw new TypeError(`${req.params.state} is not a valid abbreviation for a state`);
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesChangesHistoryResponse(stateId, null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/history/lastchange/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesCasesLastChangeHistoryResponse();
  res.json(response);
});

app.get("/states/:state/history/lastchange/cases", queuedCache(), cache.route(), async function (req, res) {
  const stateId = gSIBA(req.params.state) != null ? gSIBA(req.params.state).toString().padStart(2, "0") : null;
  if (stateId == null) throw new TypeError(`${req.params.state} is not a valid abbreviation for a state`);
  const response = await StatesCasesLastChangeHistoryResponse(stateId);
  res.json(response);
});

app.get("/states/history/lastchange/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesLastChangeHistoryResponse(null, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/:state/history/lastchange/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const stateId = gSIBA(req.params.state) != null ? gSIBA(req.params.state).toString().padStart(2, "0") : null;
  if (stateId == null) throw new TypeError(`${req.params.state} is not a valid abbreviation for a state`);
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await StatesCasesLastChangeHistoryResponse(stateId, new Date(checkedDateString));
  res.json(response);
});

app.get("/states/age-groups", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesAgeGroupsResponse();
  res.json(response);
});

app.get("/states/:state", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesResponse(req.params.state);
  res.json(response);
});

app.get("/states/:state/history", async function (req, res) {
  res.redirect(`/states/${req.params.state}/history/cases`);
});

app.get("/states/:state/history/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesCasesHistoryResponse(null, req.params.state);
  res.json(response);
});

app.get("/states/:state/history/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesCasesHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response);
});

app.get("/states/:state/history/incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesWeekIncidenceHistoryResponse(null, req.params.state);
  res.json(response);
});

app.get("/states/:state/history/incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesWeekIncidenceHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response);
});

app.get("/states/:state/history/frozen-incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesFrozenIncidenceHistoryResponse(null, req.params.state);
  res.json(response);
});

app.get("/states/:state/history/frozen-incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesFrozenIncidenceHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response);
});

app.get("/states/:state/history/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesDeathsHistoryResponse(null, req.params.state);
  res.json(response);
});

app.get("/states/:state/history/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesDeathsHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response);
});

app.get("/states/:state/history/recovered", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesRecoveredHistoryResponse(null, req.params.state);
  res.json(response);
});

app.get("/states/:state/history/recovered/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesRecoveredHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response);
});

app.get("/states/:state/history/hospitalization", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesHospitalizationHistoryResponse(null, req.params.state);
  res.json(response);
});

app.get("/states/:state/history/hospitalization/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesHospitalizationHistoryResponse(parseInt(req.params.days), req.params.state);
  res.json(response);
});

app.get("/states/:state/age-groups", queuedCache(), cache.route(), async function (req, res) {
  const response = await StatesAgeGroupsResponse(req.params.state);
  res.json(response);
});
