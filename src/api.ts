import { firebaseFunctions } from "./firebase";
import { varsomMockData } from "./varsomMockData";

const USE_STATIC_DATA = true;

const varsomBaseUrl =
  "https://api01.nve.no/hydrology/forecast/avalanche/v6.0.0/api/AvalancheWarningByCoordinates";

// const varsomSimpleUrl = "Simple";
const varsomDetailedUrl = "Detail";

const googleMapsApiKey = "AIzaSyBXOqcLadhK_VfFAJxnDn5mue4gQD_Sl20";

const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

export interface IDayWeatherForecast {
  next6hoursSymbol: string;
  next6hoursPrecAmount: number;
  next3DaysSymbol: string;
  next3DaysPrecAmount: number;
}

export async function getWeatherFromYr(
  coordinates: GoogleMapsCoordinates | null
) {
  if (!coordinates) return null;

  var getWeather = firebaseFunctions.httpsCallable("getWeatherDataFromYr");

  const result = await getWeather({
    lat: coordinates.lat,
    lon: coordinates.lon,
  }).then((res) => {
    return {
      next6hoursSymbol: res.data.next6hoursSymbol,
      next6hoursPrecAmount: res.data.next6hoursPrecAmount,
      next3DaysSymbol: res.data.next3DaysSymbol,
      next3DaysPrecAmount: res.data.next3DaysPrecAmount,
    };
  });

  console.log(result);
  return result;
}

export interface IAvyAdvice {
  text: string;
  imgUrl: string;
}

export interface IAvyProblem {
  avyProblemId: number;
  name: string;
  description: string;
}

export interface IDagsVarsel {
  dangerLevel: string;
  regionName: string;
  regionId: number;
  validFrom: Date;
  validTo: Date;
  avyProblems: IAvyProblem[];
  advices: IAvyAdvice[];
}

export async function getVarselFromVarsomSimple(
  coordinates: GoogleMapsCoordinates | null
) {
  if (!coordinates) return null;

  const url = `${varsomBaseUrl}/${varsomDetailedUrl}/${coordinates.lat}/${coordinates.lon}/1`;

  const mockData = varsomMockData;

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (!res) return null;

      if (USE_STATIC_DATA) res = mockData;

      const varsomVarsel: IDagsVarsel[] = res.map((r: any) => {
        const dagsVarsel: IDagsVarsel = {
          dangerLevel: r.DangerLevel,
          regionId: r.RegionId,
          regionName: r.RegionName,
          validFrom: r.ValidFrom,
          validTo: r.ValidTo,
          avyProblems: r.AvalancheProblems
            ? r.AvalancheProblems.map((avyProb: any) => {
                return {
                  avyProblemId: avyProb.AvalCauseId,
                  name: avyProb.AvalancheProblemTypeName,
                  description: avyProb.AvalCauseName,
                };
              })
            : [],
          advices: r.AvalancheAdvices
            ? r.AvalancheAdvices.map((a: any) => {
                return { text: a.Text, imgUrl: a.ImageUrl };
              })
            : [],
        };
        return dagsVarsel;
      });
      return varsomVarsel;
    });
}

export interface GoogleMapsCoordinates {
  lon: string;
  lat: string;
}

export async function getCoordinatesFromAddress(address: string) {
  const hemsedalCoordinates: GoogleMapsCoordinates = {
    lat: "60.86306479999999",
    lon: "8.552375999999999",
  };

  if (USE_STATIC_DATA) return hemsedalCoordinates;

  if (!address || address === "") return null;

  const url = `${googleMapsBaseUrl}?address=${address}&key=${googleMapsApiKey}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (!res) return null;
      const lon = res.results[0].geometry.location.lng;
      const lat = res.results[0].geometry.location.lat;
      const coordinates: GoogleMapsCoordinates = {
        lat,
        lon,
      };
      return coordinates;
    });
}
