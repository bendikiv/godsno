import { varsomMockData } from "./varsomMockData";

const varsomBaseUrl =
  "https://api01.nve.no/hydrology/forecast/avalanche/v6.0.0/api/AvalancheWarningByCoordinates";

const varsomSimpleUrl = "Simple";
const varsomDetailedUrl = "Detail";

const googleMapsApiKey = "AIzaSyBXOqcLadhK_VfFAJxnDn5mue4gQD_Sl20";

const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

const yrLocationForecastUrl =
  "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const sognefjellshytta = {
  lat: "61.5650219",
  long: "7.997901800000001",
};

export interface IDayWeatherForecast {
  next6hoursSymbol: string;
  next6hoursPrecAmount: number;
}

export async function getWeatherFromYr() {
  const url = `${yrLocationForecastUrl}?lat=${sognefjellshytta.lat}&long=${sognefjellshytta.long}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const dayForecast: IDayWeatherForecast = {
        next6hoursSymbol:
          res.properties.timeseries[0].data.next_6_hours.summary.symbol_code,
        next6hoursPrecAmount:
          res.properties.timeseries[0].data.next_6_hours.details
            .precipitation_amount,
      };

      return dayForecast;
    });
}

export interface IAvyAdvice {
  text: string;
  imgUrl: string;
}

export interface IDagsVarsel {
  dangerLevel: string;
  regionName: string;
  regionId: number;
  validFrom: Date;
  validTo: Date;
  advices: IAvyAdvice[];
}

export async function getVarselFromVarsomSimple(
  coordinates: GoogleMapsCoordinates | null
) {
  if (!coordinates) return null;

  const url = `${varsomBaseUrl}/${varsomDetailedUrl}/${coordinates.long}/${coordinates.lat}/1`;

  const mockData = varsomMockData;

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const varsomVarsel: IDagsVarsel[] = mockData.map((r: any) => {
        const dagsVarsel: IDagsVarsel = {
          dangerLevel: r.DangerLevel,
          regionId: r.RegionId,
          regionName: r.RegionName,
          validFrom: r.ValidFrom,
          validTo: r.ValidTo,
          advices: r.AvalancheAdvices
            ? r.AvalancheAdvices.map((a: any) => {
                const advice: IAvyAdvice = { text: a.Text, imgUrl: a.ImageUrl };
                return advice;
              })
            : [],
        };
        return dagsVarsel;
      });
      console.log(varsomVarsel);
      return varsomVarsel;
    });
}

export interface GoogleMapsCoordinates {
  long: string;
  lat: string;
}

export async function getCoordinatesFromAddress(address: string) {
  const hemsedalCoordinates: GoogleMapsCoordinates = {
    long: "60.86306479999999",
    lat: "8.552375999999999",
  };

  return hemsedalCoordinates;

  if (!address || address === "") return null;

  const url = `${googleMapsBaseUrl}?address=${address}&key=${googleMapsApiKey}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (!res) return null;
      const long = res.results[0].geometry.location.lng;
      const lat = res.results[0].geometry.location.lat;
      const coordinates: GoogleMapsCoordinates = {
        lat,
        long,
      };
      return coordinates;
    });
}
