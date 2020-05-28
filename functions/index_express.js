const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));
admin.initializeApp();
const { google } = require("googleapis");
const ml = google.ml("v1");

app.post("/getPrediction", (req, res) => {
  (async () => {
    const adc = await google.auth.getApplicationDefault();
    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    }
    // create the full model name which includes the project ID
    const model = "BookReviewsSentiment";
    const modelName = "projects/" + adc.projectId + "/models/" + model;

    const mleRequestJson = {
      auth: adc.credential,
      name: modelName,
      resource: { instances: req.body.instances },
    };

    ml.projects.predict(mleRequestJson, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send("400: ", error.status);
      } else {
        res.status(200).send(result.data["predictions"]);
      }
    });
  })();
});

exports.app = functions.region("europe-west1").https.onRequest(app);
