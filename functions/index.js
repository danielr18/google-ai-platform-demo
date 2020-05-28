const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const { google } = require("googleapis");
const ml = google.ml("v1");

exports.getPrediction = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');

    //respond to CORS preflight requests
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
  
    res.header("Content-Type", "application/json");
    res.status(200).send("{}");
  });
