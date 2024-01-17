import * as Location from 'expo-location';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { Alert } from 'react-native';
import { translate } from '../i18n/translate';

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));

export const fetchGPSLocation = () => {
  return new Promise<GeolocationResponse>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos) => {
        console.log('success', JSON.stringify(pos));
        return resolve(pos);
      },
      (error) => {
        Alert.alert(
          translate('获取位置信息失败'),
          translate('需要开启系统定位开关和应用定位权限')
        );
        return reject('GetCurrentPosition Error');
      },
      { enableHighAccuracy: false }
    );
  });
  // let location;
  // let tries = 0;
  // const MAX_NUMBER_OF_TRIES = 2;

  // console.log('try Location.getCurrentPositionAsync');
  // do {
  //   location = await Promise.race([
  //     sleep(5000),
  //     Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.Lowest,
  //     }),
  //   ]);
  //   if (location) return Promise.resolve(location);

  //   tries++;
  // } while (!location && tries < MAX_NUMBER_OF_TRIES);
  // console.log('Location.getCurrentPositionAsync failed');
  // console.log('try Location.getLastKnownPositionAsync');

  // await Location.getLastKnownPositionAsync();
  // location = await Promise.race([
  //   sleep(5000),
  //   Location.getLastKnownPositionAsync(),
  // ]);
  // console.log('Location.getLastKnownPositionAsync failed');

  // if (location) return Promise.resolve(location);

  // return Promise.reject('Unable to determin location');
};
