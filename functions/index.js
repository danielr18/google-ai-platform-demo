const functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp();
const { google } = require("googleapis");
const ml = google.ml("v1");

exports.getPrediction = functions
  .region("europe-west1")
  .https.onRequest((req, res) => {
    google.auth.getApplicationDefault((err, authClient, projectId) => {
      res.header("Content-Type", "application/json");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type");

      //respond to CORS preflight requests
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      if (err) {
        console.log("Authentication failed because of ", err);
        res.status(401).send("Authentication failed");
      } else {
        // create the full model name which includes the project ID
        const model = "BookReviewsSentiment";
        const modelName = "projects/" + projectId + "/models/" + model;

        const mleRequestJson = {
          auth: authClient,
          name: modelName,
          resource: { instances: req.body.instances },
        };

        ml.projects.predict(mleRequestJson, (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).send("Something broke, does that model exist?");
          } else {
            res.status(200).send(result.data["predictions"]);
          }
        });
      }
    });
  });
