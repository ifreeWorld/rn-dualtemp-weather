import * as Localization from 'expo-localization';
import Constants from 'expo-constants';

const requestOptions = {
  method: 'GET',
};
// export const base_url = `https://open-weather-proxy-pi.vercel.app/api/v1/`;
export const base_url = `https://api.geoapify.com/v1/`;

export const fetchReverseGeocoding = async (lat: number, long: number) => {
  const lang = Localization.getLocales()[0].languageCode;
  return fetch(
    `${base_url}geocode/reverse?lat=${lat}&lon=${long}&apiKey=${Constants.expoConfig.extra.revGeoAPI}&lang=${lang}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      const data = result.features[0].properties;
      console.log('revGeo', data);
      return data;
    })
    .catch((error) => console.log('error', error));
};
