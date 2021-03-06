const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const { google } = require("googleapis");
const ml = google.ml("v1");

exports.getPrediction = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.set("Accept", "application/json");
    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Allow-Credentials", "true");
    const adc = await google.auth.getApplicationDefault();

    //respond to CORS preflight requests
    if (req.method === "OPTIONS") {
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
  });
