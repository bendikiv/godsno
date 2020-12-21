import { GoogleMapsCoordinates } from "../../data/api";
import { NveSnowDepthData } from "../../data/contracts";
import { firebaseFunctions } from "../../firebase";

export async function getSnowDepth(
  coordinates: GoogleMapsCoordinates | null
): Promise<NveSnowDepthData | null> {
  if (!coordinates) return null;

  var getSnowDepth = firebaseFunctions.httpsCallable(
    "getSnowDepthAtDateFromNve"
  );

  const today = new Date();
  const dateParam = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getUTCFullYear()}`;

  return await getSnowDepth({
    lat: coordinates.lat,
    lon: coordinates.lon,
    date: dateParam,
  }).then((res) => res.data);
}
