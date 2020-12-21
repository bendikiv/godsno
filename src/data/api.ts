import { YrWeatherData } from "./contracts";
import { firebaseFunctions } from "../firebase";
// import { varsomMockData } from "./varsomMockData";

const USE_STATIC_DATA = false;

const varsomBaseUrl =
  "https://api01.nve.no/hydrology/forecast/avalanche/v6.0.0/api/AvalancheWarningByCoordinates";

const varsomDetailedUrl = "Detail";

const googleMapsApiKey = "AIzaSyBXOqcLadhK_VfFAJxnDn5mue4gQD_Sl20";

const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

export async function getWeatherFromYr(
  coordinates: GoogleMapsCoordinates | null
): Promise<YrWeatherData | null> {
  if (!coordinates) return null;

  var getWeather = firebaseFunctions.httpsCallable("getWeatherDataFromYr");

  return await getWeather({
    lat: coordinates.lat,
    lon: coordinates.lon,
  }).then((res) => res.data);
}

export interface IAvyAdvice {
  text: string;
  imgUrl: string;
}

export interface IAvyProblem {
  avyProblemTypeId: number;
  name: string;
  description: string;
}

export interface IDagsVarsel {
  mainText: string;
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

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (!res) return null;

      // if (USE_STATIC_DATA) res = varsomMockData;

      const varsomVarsel: IDagsVarsel[] = res.map((r: any) => {
        const dagsVarsel: IDagsVarsel = {
          dangerLevel: r.DangerLevel,
          mainText: r.MainText,
          regionId: r.RegionId,
          regionName: r.RegionName,
          validFrom: r.ValidFrom,
          validTo: r.ValidTo,
          avyProblems: r.AvalancheProblems
            ? r.AvalancheProblems.map(
                (avyProb: any): IAvyProblem => {
                  return {
                    avyProblemTypeId: avyProb.AvalancheProblemTypeId,
                    name: avyProb.AvalancheProblemTypeName,
                    description: avyProb.AvalCauseName,
                  };
                }
              )
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
  // const hemsedalCoordinates: GoogleMapsCoordinates = {
  //   lat: "60.86306479999999",
  //   lon: "8.552375999999999",
  // };

  const jotunheimenCoordinates: GoogleMapsCoordinates = {
    lat: "61.6333333",
    lon: "8.2999999",
  };

  if (USE_STATIC_DATA) return jotunheimenCoordinates;

  if (!address || address === "") return null;

  const url = `${googleMapsBaseUrl}?address=${address}&key=${googleMapsApiKey}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (!res) return null;
      console.log(res);
      const lon = res.results[0].geometry.location.lng;
      const lat = res.results[0].geometry.location.lat;
      const coordinates: GoogleMapsCoordinates = {
        lat,
        lon,
      };
      return coordinates;
    });
}
