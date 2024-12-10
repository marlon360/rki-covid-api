import {
  DistrictsHistoryMapResponse,
  DistrictsMapResponse,
  IncidenceColorsResponse,
  mapTypes,
  StatesHistoryMapResponse,
  StatesHospitalizationHistoryMapResponse,
  StatesHospitalizationMapResponse,
  StatesMapResponse,
} from "./responses/map";
import { app, queuedCache } from "./server";
import { checkDateParameter } from "./utils";

app.get("/map", async function (req, res) {
  res.redirect("/map/districts");
});

app.get("/map/districts", queuedCache(), async function (req, res) {
  const response = await DistrictsMapResponse();
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/districts/history/:date", queuedCache(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.date);
  const response = await DistrictsHistoryMapResponse(mapTypes.map, checkedDateString);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/districts-legend", queuedCache(), async function (req, res) {
  const response = await DistrictsMapResponse(mapTypes.legendMap);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/districts-legend/history/:date", queuedCache(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.date);
  const response = await DistrictsHistoryMapResponse(mapTypes.legendMap, checkedDateString);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/districts/legend", queuedCache(), async function (req, res) {
  res.json(IncidenceColorsResponse());
});

app.get("/map/states", queuedCache(), async function (req, res) {
  const response = await StatesMapResponse();
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states/history/:date", queuedCache(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.date);
  const response = await StatesHistoryMapResponse(mapTypes.map, checkedDateString);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states-legend", queuedCache(), async function (req, res) {
  const response = await StatesMapResponse(mapTypes.legendMap);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states-legend/history/:date", queuedCache(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.date);
  const response = await StatesHistoryMapResponse(mapTypes.legendMap, checkedDateString);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states/legend", queuedCache(), async function (req, res) {
  res.json(IncidenceColorsResponse());
});

app.get("/map/states-legend/hospitalization", queuedCache(), async function (req, res) {
  const response = await StatesHospitalizationMapResponse(mapTypes.legendMap);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states/hospitalization", queuedCache(), async function (req, res) {
  const response = await StatesHospitalizationMapResponse();
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states-legend/hospitalization/history/:date", queuedCache(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.date);
  const response = await StatesHospitalizationHistoryMapResponse(mapTypes.legendMap, checkedDateString);
  res.setHeader("Content-Type", "image/png").send(response);
});

app.get("/map/states/hospitalization/history/:date", queuedCache(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.date);
  const response = await StatesHospitalizationHistoryMapResponse(mapTypes.map, checkedDateString);
  res.setHeader("Content-Type", "image/png").send(response);
});
