import { UTMCoordinates } from "./contracts";
var utm = require("utm");

export const convertFromLatLonToUtm33N = (lat: string, lon: string) => {
  const res = utm.fromLatLon(lat, lon, 33);
  const utmCoordinates: UTMCoordinates = {
    easting: removeDecimal(`${res.easting}`),
    northing: removeDecimal(`${res.northing}`),
    zoneNum: res.zoneNum,
    zoneLetter: res.zoneLetter,
  };

  return utmCoordinates;
};

const removeDecimal = (num: string) => {
  return num.substr(0, num.indexOf("."));
};
