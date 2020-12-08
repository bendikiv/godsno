// Need to be a copy of "../functions/src/contracts.ts"!!!
// Models for backend types

export interface YrWeatherData {
  next6Hours: WeatherDataForTimeInterval;
  next3Days: WeatherDataForTimeInterval;
}

export interface WeatherDataForTimeInterval {
  weatherSymbol: string;
  precAmount: number;
  windData: YrWindData;
  tempData: YrTempData;
}

export interface YrWindData {
  windMin: number;
  windMinDirection: number;
  windMax: number;
  windMaxDirection: number;
}

export interface YrTempData {
  tempMin: number;
  tempMax: number;
}
