import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
let cors = require("cors");
const fetch = require("node-fetch");

admin.initializeApp();

const corsHandler = cors({ origin: true });
const FIREBASE_REGION = "europe-west1";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
  .region(FIREBASE_REGION)
  .https.onRequest(async (request, response) => {
    corsHandler(request, response, () => {
      functions.logger.info("Hello logs!", { structuredData: true });
      response.status(200).json({ data: "Hello from Firebase!" });
    });
  });

export const getWeatherDataFromYr = functions
  .region(FIREBASE_REGION)
  .https.onRequest(async (req: functions.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
      const reqData = req.body.data;

      functions.logger.info("Running function getWeatherDataFromYr...");
      functions.logger.info(
        `Request query params: lat=${reqData.lat}, lon=${reqData.lon}}`
      );

      const yrbaseUrl =
        "https://api.met.no/weatherapi/locationforecast/2.0/compact";

      const coordinates = {
        lat: reqData.lat?.toString() || "",
        lon: reqData.lon?.toString() || "",
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
        })
        .catch((error: any) => {
          functions.logger.error(
            "Caught error while fetching from Yr api, error: ",
            error
          );
          return null;
        });

      res.status(200).json({ data: result, gotResult: result !== null });
    });
  });
