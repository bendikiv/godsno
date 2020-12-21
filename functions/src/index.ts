import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { addDays, isBefore } from "date-fns";
import { YrWeatherData, NveSnowDepthData } from "./contracts";
import { convertFromLatLonToUtm33N } from "./utils";
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
          return parseWeatherData(res);
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

export const getSnowDepthAtDateFromNve = functions
  .region(FIREBASE_REGION)
  .https.onRequest(async (req: functions.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
      functions.logger.info(
        "\n\n\t\tRunning function getSnowDepthAtDateFromNve...\n\n"
      );

      const query = req.body.data; //req.query;

      functions.logger.info(
        `Request query params: lat=${query.lat}, lon=${query.lon}, date=${query.date}`
      );

      const baseUrl = "http://h-web02.nve.no:8080/api";
      const reqData = {
        lat: query.lat?.toString() || "",
        lon: query.lon?.toString() || "",
        date: query.date?.toString() || "",
      };

      const utmCoordinates = convertFromLatLonToUtm33N(
        reqData.lat,
        reqData.lon
      );

      functions.logger.info(
        `Converted from lat/lon to UTM Zone 33N: easting=${utmCoordinates.easting}, northing=${utmCoordinates.northing}`
      );

      const url = `${baseUrl}/GridTimeSeries/${utmCoordinates.easting}/${utmCoordinates.northing}/${reqData.date}/${reqData.date}/sd.json`;

      const result = await fetch(url)
        .then((res: any) => res.json())
        .then((res: any) => {
          const snowDepth: NveSnowDepthData = {
            unit: res.Unit,
            snowdepth: res.Data[0], // Data is an array, only one element if we request data on single day
            altitude: res.Altitude,
            date: res.StartDate,
          };
          return snowDepth;
        })
        .catch((error: any) => {
          functions.logger.error(
            "Caught error while fetching snødybde from NVE api, error: ",
            error
          );
          return null;
        });

      res.status(200).json({ data: result, gotResult: result !== null });
    });
  });

export const getWeatherDataFromYr = functions
  .region(FIREBASE_REGION)
  .https.onRequest(async (req: functions.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
      const reqData = req.body.data;

      functions.logger.info(
        "Running function getWeatherDataFromYr...",
        reqData
      );
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
        .then((res: any) => parseWeatherData(res))
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

const parseWeatherData = (yrData: any): YrWeatherData => {
  const timeseries = yrData.properties.timeseries;

  // --- Next 6 hours ---
  const next6hoursSymbol = timeseries[0].data.next_6_hours.summary.symbol_code;
  const next6hoursPrecAmount =
    timeseries[0].data.next_6_hours.details.precipitation_amount;
  // Temp
  let next6hoursTempMin = 0;
  let next6hoursTempMax = 0;
  let next6hoursWindMin = 0;
  let next6hoursWindMinDirection = 0;
  let next6hoursWindMax = 0;
  let next6hoursWindMaxDirection = 0;

  // Finding min and max temp and wind next 6 hours
  for (let i = 0; i < 6; i++) {
    const tempAtCurrentTime =
      timeseries[i].data.instant.details.air_temperature;
    const windAtCurrentTime = timeseries[i].data.instant.details.wind_speed;

    // Temp
    if (tempAtCurrentTime < next6hoursTempMin)
      next6hoursTempMin = tempAtCurrentTime;
    if (tempAtCurrentTime > next6hoursTempMax)
      next6hoursTempMax = tempAtCurrentTime;

    // Wind
    if (windAtCurrentTime < next6hoursWindMin) {
      next6hoursWindMin = windAtCurrentTime;
      next6hoursWindMinDirection =
        timeseries[i].data.instant.details.wind_from_direction;
    }
    if (windAtCurrentTime > next6hoursWindMax) {
      next6hoursWindMax = windAtCurrentTime;
      next6hoursWindMaxDirection =
        timeseries[i].data.instant.details.wind_from_direction;
    }
  }

  // --- Next 3 days ---
  const next3DaysSymbol = timeseries[0].data.next_12_hours.summary.symbol_code;
  let next3DaysTotalPrecip = 0;
  let next3DaysWindMin = 0;
  let next3DaysWindMinDirection = 0;
  let next3DaysWindMax = 0;
  let next3DaysWindMaxDirection = 0;
  let next3DaysTempMin = 0;
  let next3DaysTempMax = 0;

  const threeDaysFromToday = addDays(new Date(timeseries[0].time), 3);

  timeseries.forEach((t: any) => {
    const dataAtTime = t.data.instant.details;

    if (isBefore(new Date(t.time), threeDaysFromToday)) {
      // Set min/max wind and wind direction
      if (dataAtTime.wind_speed > next3DaysWindMax) {
        next3DaysWindMax = dataAtTime.wind_speed;
        next3DaysWindMaxDirection = dataAtTime.wind_from_direction;
      }
      if (dataAtTime.wind_speed < next3DaysWindMin) {
        next3DaysWindMin = dataAtTime.wind_speec;
        next3DaysWindMinDirection = dataAtTime.wind_from_direction;
      }

      // Set min/max temp
      if (dataAtTime.air_temperature > next3DaysTempMax)
        next3DaysTempMax = dataAtTime.air_temperature;
      if (dataAtTime.air_temperature < next3DaysTempMin)
        next3DaysTempMin = dataAtTime.air_temperature;

      // Accumulate precipitation
      if (t.data.next_1_hours) {
        next3DaysTotalPrecip +=
          t.data.next_1_hours.details.precipitation_amount;
      } else if (t.data.next_6_hours) {
        // After ~2 days yr data has only data each 6 hours, with "next_6_hours" value
        next3DaysTotalPrecip +=
          t.data.next_6_hours.details.precipitation_amount;
      }
    }
  });

  let weatherData: YrWeatherData = {
    next6Hours: {
      weatherSymbol: next6hoursSymbol,
      precAmount: next6hoursPrecAmount,
      tempData: {
        tempMin: next6hoursTempMin,
        tempMax: next6hoursTempMax,
      },
      windData: {
        windMin: next6hoursWindMin,
        windMinDirection: next6hoursWindMinDirection,
        windMax: next6hoursWindMax,
        windMaxDirection: next6hoursWindMaxDirection,
      },
    },
    next3Days: {
      weatherSymbol: next3DaysSymbol,
      precAmount: next3DaysTotalPrecip,
      tempData: {
        tempMin: next3DaysTempMin,
        tempMax: next3DaysTempMax,
      },
      windData: {
        windMin: next3DaysWindMin,
        windMinDirection: next3DaysWindMinDirection,
        windMax: next3DaysWindMax,
        windMaxDirection: next3DaysWindMaxDirection,
      },
    },
  };

  return weatherData;
};
