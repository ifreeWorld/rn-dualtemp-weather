import { View, Text } from 'react-native';
import { DailyForecastExtendedItemStyles } from './DailyForecastExtendedItemStyles.Styles';
import { DailyEntity } from '../../types/WeatherTypes';
import React, { useContext, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { palette } from '../../Styles/Palette';
import moment from 'moment';
import WeatherIcon, { IconSizeTypes } from '../WeatherIcon/WeatherIcon';
import { displayWeatherIcon } from '../../utils/Images';
import DailyExpandedFeelInfo from './DailyExpandedFeelInfo';
import { AppStateContext } from '../../utils/AppStateContext';
import { translate } from '../../i18n';

type DailyForecastItemExpandedPropTypes = {
  day: DailyEntity;
};

const DailyForecastExpanded = ({ day }: DailyForecastItemExpandedPropTypes) => {
  const graphScale = [
    translate('清晨'),
    translate('中午'),
    translate('傍晚'),
    translate('夜晚'),
  ];
  const [cardWidth, setCardWidth] = useState(0);

  const context = useContext(AppStateContext);
  const tempScale = context?.tempScale;

  return (
    <>
      <View
        style={DailyForecastExtendedItemStyles.container}
        onLayout={({ nativeEvent }) => setCardWidth(nativeEvent.layout.width)}
      >
        <View>
          <LineChart
            data={{
              labels: graphScale,
              datasets: [
                {
                  data: [
                    day.feels_like['morn'],
                    day.feels_like['day'],
                    day.feels_like['eve'],
                    day.feels_like['night'],
                  ],
                },
              ],
            }}
            width={cardWidth / 1.5} // from react-native
            height={265}
            withVerticalLines={false}
            yAxisSuffix="°"
            yAxisInterval={1} // optional, defaults to 1
            fromZero
            formatYLabel={(temp) =>
              tempScale === 'F'
                ? (parseInt(temp) * 1.8 + 32).toFixed(0).toString()
                : temp
            }
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientTo: 'white',
              backgroundGradientFromOpacity: 0,
              backgroundGradientFrom: 'white',
              backgroundGradientToOpacity: 0,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => palette.textColor,
              labelColor: (opacity = 1) => palette.textColor,
              propsForDots: {
                r: '5',
                strokeWidth: '1',
                stroke: palette.textColor,
              },
            }}
            bezier
            style={{
              marginBottom: 10,
              borderRadius: 16,
              marginLeft: -30,
              marginRight: 0,
            }}
          />
        </View>
        <View style={DailyForecastExtendedItemStyles.InfoSectionContainer}>
          <View style={DailyForecastExtendedItemStyles.InfoSectionTextUnit}>
            <WeatherIcon
              icon={displayWeatherIcon('01d')}
              iconSize={IconSizeTypes.TINY}
            />
            <Text
              style={DailyForecastExtendedItemStyles.InfoSectionText}
              allowFontScaling={false}
            >
              {translate('日升')}:
            </Text>
            <Text
              style={DailyForecastExtendedItemStyles.InfoSectionText}
              allowFontScaling={false}
            >
              {moment.unix(day.sunrise).format('hh:mm')}
            </Text>
          </View>
          <View style={DailyForecastExtendedItemStyles.InfoSectionTextUnit}>
            <WeatherIcon
              icon={displayWeatherIcon('sunset')}
              iconSize={IconSizeTypes.TINY}
            />
            <Text
              style={DailyForecastExtendedItemStyles.InfoSectionText}
              allowFontScaling={false}
            >
              {translate('日落')}:
            </Text>
            <Text
              style={DailyForecastExtendedItemStyles.InfoSectionText}
              allowFontScaling={false}
            >
              {moment.unix(day.sunset).format('hh:mm')}
            </Text>
          </View>

          <Text style={DailyForecastExtendedItemStyles.infoFeelTitle}>
            {translate('体感温度')}
          </Text>
          <DailyExpandedFeelInfo
            temp={day.feels_like.morn}
            label={translate('清晨')}
          />
          <DailyExpandedFeelInfo
            temp={day.feels_like.day}
            label={translate('中午')}
          />
          <DailyExpandedFeelInfo
            temp={day.feels_like.eve}
            label={translate('傍晚')}
          />
          <DailyExpandedFeelInfo
            temp={day.feels_like.night}
            label={translate('夜晚')}
          />

          <Text style={DailyForecastExtendedItemStyles.infoFeelTitle}>
            {translate('最低/最高')}
          </Text>
          <DailyExpandedFeelInfo
            temp={day.temp.max}
            label={translate('最高')}
          />
          <DailyExpandedFeelInfo
            temp={day.temp.min}
            label={translate('最低')}
          />
        </View>
      </View>
    </>
  );
};

export default DailyForecastExpanded;
