import * as Localization from 'expo-localization';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
// import * as Location from 'expo-location';
import type { GeolocationResponse } from '@react-native-community/geolocation';
import { fetchReverseGeocoding } from './fetchReverseGeocoding';
import { fetchGPSLocation } from './fetchUserLocation';

export const base_url = `https://api.openweathermap.org/data/3.0/`;

export const fetchForecast = async () => {
  const lang = Localization.getLocales()[0].languageCode;
  try {
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permission to access location was denied');
    // }

    const location = await fetchGPSLocation();
    console.log('location', location);

    const response = await fetch(
      `${base_url}onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Constants.expoConfig.extra.weatherAPI}&units=Metric&lang=${lang}`
    );

    const data = await response.json();
    console.log('weather-data', JSON.stringify(data));

    if (!response.ok) {
      console.log(response);
      Alert.alert(`Error retrieving weather data: ${data.message}`);
    } else {
      return {
        data: data,
        location: await fetchReverseGeocoding(
          location.coords.latitude,
          location.coords.longitude
        ),
      };
    }
  } catch (e) {
    console.error(e);
    null;
  }
};
