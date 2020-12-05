import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import * as fetch from "node-fetch";
let cors = require("cors");
const fetch = require("node-fetch");

admin.initializeApp();

const corsHandler = cors({ origin: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const getWeatherDataFromYr = functions.https.onRequest(
  async (req, res) => {
    corsHandler(req, res, async () => {
      const yrbaseUrl =
        "https://api.met.no/weatherapi/locationforecast/2.0/compact";

      const coordinates = {
        lat: req.query.lat?.toString() || "",
        lon: req.query.lon?.toString() || "",
      };
      const url = `${yrbaseUrl}?lat=${coordinates.lat}&lon=${coordinates.lon}`;

      const result = await fetch(url)
        .then((res: any) => res.json())
        .then((res: any) => {
          return {
            next6hoursSymbol:
              res.properties.timeseries[0].data.next_6_hours.summary
                .symbol_code,
            next6hoursPrecAmount:
              res.properties.timeseries[0].data.next_6_hours.details
                .precipitation_amount,
          };
        });

      res.json(result);
      res.send(result);
    });
  }
);
