import {
  DistrictsAgeGroupsResponse,
  DistrictsCasesChangesHistoryResponse,
  DistrictsCasesHistoryResponse,
  DistrictsCasesLastChangeHistoryResponse,
  DistrictsDeathsHistoryResponse,
  DistrictsIncidenceHistoryByDate,
  DistrictsRecoveredHistoryResponse,
  DistrictsResponse,
  DistrictsWeekIncidenceHistoryResponse,
  FrozenIncidenceHistoryResponse,
} from "./responses/districts";
import { app, queuedCache, cache } from "./server";
import { checkDateParameter } from "./utils";

app.get("/districts", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsResponse();
  res.json(response);
});

app.get("/districts/history", async function (req, res) {
  res.redirect("/districts/history/cases");
});

app.get("/districts/history/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsCasesHistoryResponse();
  res.json(response);
});

app.get("/districts/history/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsCasesHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/districts/history/incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsWeekIncidenceHistoryResponse();
  res.json(response);
});

app.get("/districts/historybydate/incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsIncidenceHistoryByDate();
  res.json(response);
});

app.get("/districts/history/frozen-incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await FrozenIncidenceHistoryResponse();
  res.json(response);
});

app.get("/districts/history/frozen-incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await FrozenIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/districts/history/incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsWeekIncidenceHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/districts/history/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsDeathsHistoryResponse();
  res.json(response);
});

app.get("/districts/history/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsDeathsHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/districts/history/recovered", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsRecoveredHistoryResponse();
  res.json(response);
});

app.get("/districts/history/recovered/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsRecoveredHistoryResponse(parseInt(req.params.days));
  res.json(response);
});

app.get("/districts/history/changes/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsCasesChangesHistoryResponse();
  res.json(response);
});

app.get("/districts/:district/history/changes/cases", queuedCache(), cache.route(), async function (req, res) {
  let districtId = req.params.district.toString();
  if (districtId.length != 4 && districtId.length != 5)
    throw new TypeError(`${req.params.district} is not a valid ags for a district`);
  districtId = districtId.padStart(5, "0");
  const response = await DistrictsCasesChangesHistoryResponse(districtId);
  res.json(response);
});

app.get("/districts/history/changes/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesChangesHistoryResponse(null, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/:district/history/changes/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let districtId = req.params.district.toString();
  if (districtId.length != 4 && districtId.length != 5)
    throw new TypeError(`${req.params.district} is not a valid ags for a district`);
  districtId = districtId.padStart(5, "0");
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesChangesHistoryResponse(districtId, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/history/changesofreportday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesChangesHistoryResponse(null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/:district/history/changesofreportday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let districtId = req.params.district.toString();
  if (districtId.length != 4 && districtId.length != 5)
    throw new TypeError(`${req.params.district} is not a valid ags for a district`);
  districtId = districtId.padStart(5, "0");
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesChangesHistoryResponse(districtId, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/history/changesofchangeday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesChangesHistoryResponse(null, null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/:district/history/changesofchangeday/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let districtId = req.params.district.toString();
  if (districtId.length != 4 && districtId.length != 5)
    throw new TypeError(`${req.params.district} is not a valid ags for a district`);
  districtId = districtId.padStart(5, "0");
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesChangesHistoryResponse(districtId, null, null, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/history/lastchange/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsCasesLastChangeHistoryResponse();
  res.json(response);
});

app.get("/districts/:district/history/lastchange/cases", queuedCache(), cache.route(), async function (req, res) {
  let districtId = req.params.district.toString();
  if (districtId.length != 4 && districtId.length != 5)
    throw new TypeError(`${req.params.district} is not a valid ags for a district`);
  districtId = districtId.padStart(5, "0");
  const response = await DistrictsCasesLastChangeHistoryResponse(districtId);
  res.json(response);
});

app.get("/districts/history/lastchange/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesLastChangeHistoryResponse(null, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/:district/history/lastchange/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  let districtId = req.params.district.toString();
  if (districtId.length != 4 && districtId.length != 5)
    throw new TypeError(`${req.params.district} is not a valid ags for a district`);
  districtId = districtId.padStart(5, "0");
  let checkedDateString: string = checkDateParameter(req.params.days);
  const response = await DistrictsCasesLastChangeHistoryResponse(districtId, new Date(checkedDateString));
  res.json(response);
});

app.get("/districts/age-groups", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsAgeGroupsResponse();
  res.json(response);
});

app.get("/districts/:district", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsResponse(req.params.district);
  res.json(response);
});

app.get("/districts/:district/history", async function (req, res) {
  res.redirect(`/districts/${req.params.district}/history/cases`);
});

app.get("/districts/:district/history/cases", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsCasesHistoryResponse(null, req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/cases/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsCasesHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsWeekIncidenceHistoryResponse(null, req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsWeekIncidenceHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/frozen-incidence", queuedCache(), cache.route(), async function (req, res) {
  const response = await FrozenIncidenceHistoryResponse(null, req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/frozen-incidence/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await FrozenIncidenceHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/deaths", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsDeathsHistoryResponse(null, req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/deaths/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsDeathsHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/recovered", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsRecoveredHistoryResponse(null, req.params.district);
  res.json(response);
});

app.get("/districts/:district/history/recovered/:days", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsRecoveredHistoryResponse(parseInt(req.params.days), req.params.district);
  res.json(response);
});

app.get("/districts/:district/age-groups", queuedCache(), cache.route(), async function (req, res) {
  const response = await DistrictsAgeGroupsResponse(req.params.district);
  res.json(response);
});
