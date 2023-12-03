import React, { useState } from 'react';
import DailyForecastItem from './DailyForecastItem';
import Subtitle from '../Subtitle/Subtitle';

import { View } from 'react-native';
import { DailyEntity } from '../../types/WeatherTypes';
import { DailyForecastStyles } from './DailyForecast.Styles';
import { translate } from '../../i18n';

type DailyForecastPropTypes = {
  dailyForecast: DailyEntity[];
};

const DailyForecast = ({ dailyForecast }: DailyForecastPropTypes) => {
  const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(0);

  const setSelectedIndex = (index: number) => {
    index !== currentlySelectedIndex
      ? setCurrentlySelectedIndex(index)
      : setCurrentlySelectedIndex(NaN);
  };

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
