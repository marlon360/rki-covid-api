import fs from "fs";
import { VideoResponse, Region } from "./responses/mapvideo";
import { app, queuedCache } from "./server";

app.get("/video", async function (req, res) {
  res.redirect("/video/districts");
});
app.get("/video/districts", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.districts, 60);
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/:duration/districts", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.districts, parseInt(req.params.duration));
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/districts/:days", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.districts, 60, parseInt(req.params.days));
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/:duration/districts/:days", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.districts, parseInt(req.params.duration), parseInt(req.params.days));
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/states", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.states, 60);
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/:duration/states", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.states, parseInt(req.params.duration));
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/states/:days", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.states, 60, parseInt(req.params.days));
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});

app.get("/video/:duration/states/:days", queuedCache(), async function (req, res) {
  const response = await VideoResponse(Region.states, parseInt(req.params.duration), parseInt(req.params.days));
  const videoStream = fs.createReadStream(response.filename);
  res.setHeader("Content-Type", "video/mp4");
  videoStream.pipe(res);
});
