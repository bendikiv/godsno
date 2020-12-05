import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

interface Coordinates {
  lat: string;
  long: string;
}

export const getWeatherDataFromYr = functions.https.onRequest(
  async (req, res) => {
    const yrbaseUrl =
      "https://api.met.no/weatherapi/locationforecast/2.0/compact";

    const coordinates: Coordinates = {
      lat: req.query.lat?.toString() || "",
      long: req.query.long?.toString() || "",
    };
    // const sognefjellshytta = {
    //   lat: "61.5650219",
    //   long: "7.997901800000001",
    // };
    const url = `${yrbaseUrl}?lat=${coordinates.lat}&long=${coordinates.long}`;

    const result = await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        return {
          next6hoursSymbol:
            res.properties.timeseries[0].data.next_6_hours.summary.symbol_code,
          next6hoursPrecAmount:
            res.properties.timeseries[0].data.next_6_hours.details
              .precipitation_amount,
        };
      });

    res.json(result);
  }
);
