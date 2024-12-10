import {
  VaccinationGermanyResponse,
  VaccinationHistoryResponse,
  VaccinationResponse,
  VaccinationStatesResponse,
} from "./responses/vaccination";
import { app, queuedCache, cache } from "./server";

app.get("/vaccinations", queuedCache(), cache.route(), async function (req, res) {
  const response = await VaccinationResponse();
  res.json(response);
});

app.get("/vaccinations/germany", queuedCache(), cache.route(), async function (req, res) {
  const response = await VaccinationGermanyResponse();
  res.json(response);
});

app.get("/vaccinations/states", queuedCache(), cache.route(), async function (req, res) {
  const response = await VaccinationStatesResponse(req.params.state);
  res.json(response);
});

app.get("/vaccinations/states/:state", queuedCache(), cache.route(), async function (req, res) {
  const response = await VaccinationStatesResponse(req.params.state);
  res.json(response);
});

app.get("/vaccinations/history", queuedCache(), cache.route(), async function (req, res) {
  const response = await VaccinationHistoryResponse();
  res.json(response);
});

app.get("/vaccinations/history/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await VaccinationHistoryResponse(parseInt(req.params.days));
  res.json(response);
});
