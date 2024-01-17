import React, { useEffect, useState } from 'react';
import DailyForecastItem from './DailyForecastItem';
import Subtitle from '../Subtitle/Subtitle';

import { Platform, View } from 'react-native';
import { DailyEntity } from '../../types/WeatherTypes';
import { DailyForecastStyles } from './DailyForecast.Styles';
import { translate } from '../../i18n';
import _admobConfig from '../../../admob.json';
import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
} from 'react-native-google-mobile-ads';

type DailyForecastPropTypes = {
  dailyForecast: DailyEntity[];
};

const { rewardedAdId } = _admobConfig[Platform.OS];
const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  rewardedAdId,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

let cacheIndex = 0;

const DailyForecast = ({ dailyForecast }: DailyForecastPropTypes) => {
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(0);

  const setSelectedIndex = (index: number) => {
    cacheIndex = index;
    if (index === currentlySelectedIndex) {
      setCurrentlySelectedIndex(NaN);
    } else {
      rewardedInterstitial.show();
    }
    // index !== currentlySelectedIndex
    //   ? setCurrentlySelectedIndex(index)
    //   : setCurrentlySelectedIndex(NaN);
  };

  const loadADMobRewardAd = () => {
    console.log('loadADMobRewardedAd');
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      async () => {
        console.log('rewarded ads loaded');
      }
    );
    const unsubscribeError = rewardedInterstitial.addAdEventListener(
      AdEventType.ERROR,
      async (e) => {
        console.log('rewarded ads error', e.message);
      }
    );

    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('rewarded ads closed');
        rewardedInterstitial.load();
      }
    );

    const unsubscribePaid = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        console.log('rewarded ads EARNED_REWARD');
        cacheIndex !== currentlySelectedIndex
          ? setCurrentlySelectedIndex(cacheIndex)
          : setCurrentlySelectedIndex(NaN);
      }
    );

    rewardedInterstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      unsubscribePaid();
    };
  };

  useEffect(() => {
    const unsubscribeOpenEvents = loadADMobRewardAd();
    return () => {
      unsubscribeOpenEvents();
    };
  }, []);

  return (
    <View style={DailyForecastStyles.container}>
      <Subtitle text={translate('多日预报')} />
      {dailyForecast?.map((day, i) => {
        return (
          <DailyForecastItem
            day={day}
            key={day.dt}
            index={i}
            currSelected={currentlySelectedIndex}
            setSelected={setSelectedIndex}
          />
        );
      })}
    </View>
  );
};

export default DailyForecast;
