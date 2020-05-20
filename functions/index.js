const functions = require("firebase-functions");
const admin = require("firebase-admin");
// admin.initializeApp(functions.config().firebase);
const serviceAccount = require("./ai-platform-demo-7e3b1-firebase-adminsdk-o7da8-e1cc740609.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ai-platform-demo-7e3b1.firebaseio.com",
});
const googleapis = require("googleapis");
const ml = googleapis.google.ml("v1");

exports.getPrediction = functions
  .region("europe-west1")
  .https.onRequest(async (request, response) => {
    const review = request.body.review;
    const instance = [review];
    const model = "BookReviewsSentiment";
    const projectId = "ai-platform-demo-7e3b1";
    // const { credential } = await googleapis.google.auth.getApplicationDefault();
    const modelName = `projects/${projectId}/models/${model}`;
    const preds = await ml.projects.predict({
      auth: credential,
      name: modelName,
      requestBody: {
        instance,
      },
    });
    response.send(preds.data["predictions"][0]);
  });
