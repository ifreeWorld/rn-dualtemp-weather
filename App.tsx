import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
// import { simpleUpdate } from 'react-native-update';
import * as Localization from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { fetchForecast } from './src/utils/fetchWeather';
import CurrentWeatherCard from './src/components/CurrentWeatherCard/CurrentWeatherCard';
import { Weather } from './src/types/WeatherTypes';
import { palette } from './src/Styles/Palette';
import HourlyForecast from './src/components/HourlyForecast/HourlyForecast';
import AppHeader from './src/components/AppHeader/AppHeader';
import _updateConfig from './update.json';
import _admobConfig from './admob.json';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  AdEventType,
  AppOpenAd,
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import DailyForecast from './src/components/DailyForecast/DailyForecast';
import { AppStateContext } from './src/utils/AppStateContext';
import { getSelectedTempScale } from './src/utils/AsyncStorageHelper';
import AppFooter from './src/components/AppFooter/AppFooter';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const lang = Localization.locale;
moment.locale(lang);

const { appKey } = _updateConfig[Platform.OS];
const { openAdId, bannerAdId } = _admobConfig[Platform.OS];

// https://developers.google.com/admob/android/test-ads?hl=zh-cn
const openAdRef = AppOpenAd.createForAdRequest(
  __DEV__
    ? // 测试广告ID，先写死
      'ca-app-pub-3940256099942544/9257395921'
    : // 生产广告ID
      openAdId,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

// 整个应用的根组件，class 或函数组件都可以

function App() {
  const [forecast, setForecast] = useState<Weather>();
  const [tempScale, setTempScale] = useState<'C' | 'F'>('F');
  const [location, setLocation] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [date, setDate] = useState(moment());
  const [appIsReady, setAppIsReady] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  useEffect(() => {
    async function prepare() {
      try {
        //Load Forecast data
        await loadForecast();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    console.log('prepare before');
    prepare();
    // Google ADMob 广告
    const unsubscribeOpenEvents = loadADMobOpenAd();
    return () => {
      unsubscribeOpenEvents();
    };
  }, []);

  useEffect(() => {
    if (adLoaded) {
      openAdRef.show();
    }
  }, [adLoaded]);

  const loadADMobOpenAd = () => {
    console.log('loadADMobOpenAd');
    const unsubscribeLoaded = openAdRef.addAdEventListener(
      AdEventType.LOADED,
      async () => {
        console.log('Open ads loaded');
        setAdLoaded(true);
      }
    );
    const unsubscribeError = openAdRef.addAdEventListener(
      AdEventType.ERROR,
      async (e) => {
        console.log('Open ads error', e.message);
      }
    );

    const unsubscribeClosed = openAdRef.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('Open ads closed');
        openAdRef.load();
      }
    );

    openAdRef.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
    };
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const loadForecast = async () => {
    setTempScale(await getSelectedTempScale());
    setRefreshing(true);
    const fetched = await fetchForecast();
    setForecast(fetched?.data);
    setLocation(fetched?.location?.district ?? fetched?.location.city);
    setDate(moment());
    setRefreshing(false);
  };

  const onRefresh = React.useCallback(async () => {
    loadForecast();
  }, []);

  if (!fontsLoaded || !appIsReady || !forecast) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={styles.container}>
        <View onLayout={onLayoutRootView}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <AppStateContext.Provider
              value={{ forecast, date, tempScale, setTempScale }}
            >
              <AppHeader location={location} />
              <CurrentWeatherCard
                temp={forecast.current.temp}
                weather={forecast.current.weather[0]}
              />
              <View style={styles.bannerAd}>
                <BannerAd
                  unitId={bannerAdId}
                  size={BannerAdSize.BANNER}
                  requestOptions={{
                    networkExtras: {
                      collapsible: 'bottom',
                    },
                  }}
                />
              </View>
              <HourlyForecast hourlyForecast={forecast.hourly?.slice(0, 24)} />
              <DailyForecast dailyForecast={forecast.daily} />
            </AppStateContext.Provider>
            {/* <AppFooter /> */}
          </ScrollView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

// 对根组件使用simpleUpdate方法封装后导出
// export default simpleUpdate(App, {
//   appKey,
//   onPushyEvents: ({ type, data }) => {
//     // 热更成功或报错的事件回调
//     // 可上报自有或第三方数据统计服务
//     console.log('simpleUpdate', type, data);
//   },
// });
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primaryDark,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerAd: {
    paddingHorizontal: 20,
  },
});
