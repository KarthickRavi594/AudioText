const axios = require("axios");
const API = require("./const");
const fs = require("fs");
var bodyParser = require("body-parser");
const port = process.env.PORT || 3456;
var express = require("express");
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: API.API_Key,
    "transfer-encoding": "chunked",
  },
});
const file = "./Audio/Audio Text.wav";
var app = express();
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Running in ", port);
  }
});
app.use(bodyParser.json());
app.get("/uploadStatus", (req, response) => {
  try {
    fs.readFile(file, (err, data) => {
      if (err) return console.error(err);

      assembly
        .post("/upload", data)
        .then((res) => {
          response.send({ upload_url: res.data.upload_url });
        })
        .catch((err) => {
          console.log("Err", err);
        });
    });
  } catch (err) {}
});
app.post("/submit", (request, response) => {
  try {
    console.log("submit => ", request.body);
    assembly
      .post("/transcript", {
        audio_url: request.body.url,
      })
      .then((res) => {
        response.send({ submittedData: res.data });
      })
      .catch((err) => console.error(err));
  } catch (err) {}
});
app.post("/transcription", (request, response) => {
  try {
    console.log("transcription => ", request.body);
    assembly
      .get(`/transcript/${request.body.id}`)
      .then((res) => {
        response.send({ uploadedData: res.data });
      })
      .catch((err) => console.error(err));
  } catch (err) {}
});
