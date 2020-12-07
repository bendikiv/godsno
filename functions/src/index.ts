import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { addDays, isBefore } from "date-fns";
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
    corsHandler(request, response, async () => {
      const hemsedalCoordinates = {
        lat: "60.86306479999999",
        lon: "8.552375999999999",
      };

      const yrbaseUrl =
        "https://api.met.no/weatherapi/locationforecast/2.0/compact";

      const url = `${yrbaseUrl}?lat=${hemsedalCoordinates.lat}&lon=${hemsedalCoordinates.lon}`;

      const result = await fetch(url)
        .then((res: any) => res.json())
        .then((res: any) => {
          return getPrecipitationNext3Days(res);
        })
        .catch((error: any) => {
          functions.logger.error(
            "Caught error while fetching from Yr api, error: ",
            error
          );
          return null;
        });

      response.status(200).json({ data: result, gotResult: result !== null });
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
            next3DaysSymbol:
              res.properties.timeseries[0].data.next_12_hours.summary
                .symbol_code,
            next3DaysPrecAmount: getPrecipitationNext3Days(res),
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

const getPrecipitationNext3Days = (yrData: any) => {
  const timeseries = yrData.properties.timeseries;
  const currentDate = timeseries[0].time;

  let totalPrecip = 0;

  timeseries.forEach((t: any) => {
    if (t.data.next_1_hours) {
      totalPrecip += t.data.next_1_hours.details.precipitation_amount;
    } else {
      if (t.data.next_6_hours && isBefore(t.time, addDays(currentDate, 3))) {
        totalPrecip += t.data.next_6_hours.details.precipitation_amount;
      }
    }
  });

  return totalPrecip;
};
