import React from 'react';
import { View, FlatList } from 'react-native';
import Subtitle from '../Subtitle/Subtitle';
import HourlyForecastItem from './HourlyForecastItem';

import { HourlyForecastStyles } from './HourlyForecast.Styles';

import { HourlyEntity } from '../../types/WeatherTypes';
import { translate } from '../../i18n';

type HourlyForecastPropsType = {
  hourlyForecast?: HourlyEntity[];
};

const HourlyForecast = (props: HourlyForecastPropsType) => {
  return (
    <View style={HourlyForecastStyles.container}>
      <Subtitle text={translate('24小时预报')} />
      <FlatList
        horizontal
        data={props.hourlyForecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(hour) => {
          return (
            <HourlyForecastItem
              temp={hour.item.temp}
              dt={hour.item.dt}
              icon={hour.item.weather[0].icon}
              pop={hour.item.pop}
            />
          );
        }}
      />
    </View>
  );
};

export default HourlyForecast;
