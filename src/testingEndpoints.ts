import { TestingHistoryResponse } from "./responses/testing";
import { app, queuedCache, cache } from "./server";

app.get("/testing/history", queuedCache(), cache.route(), async function (req, res) {
  const response = await TestingHistoryResponse();
  res.json(response);
});

app.get("/testing/history/:weeks", queuedCache(), cache.route(), async function (req, res) {
  const response = await TestingHistoryResponse(parseInt(req.params.weeks));
  res.json(response);
});
