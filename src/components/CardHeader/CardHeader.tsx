import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import * as Localization from 'expo-localization';
import { AppStateContext } from '../../utils/AppStateContext';

import { cardHeaderStyles } from './CardHeader.Styles';
import { typography } from '../../Styles/Typography';
import { translate } from '../../i18n';

const CardHeader = () => {
  const context = useContext(AppStateContext);
  const lang = Localization.getLocales()[0].languageCode;
  let dateFormat = 'MMMM Do YYYY';
  if (lang === 'zh') {
    dateFormat = 'MM月DD日dddd';
  }

  return (
    <View style={cardHeaderStyles.cardHeader}>
      <Text style={[typography.headerText, cardHeaderStyles.todayText]}>
        {translate('今日天气')}
      </Text>
      <Text style={[typography.headerText, cardHeaderStyles.dateText]}>
        {context?.date.format(dateFormat)}
      </Text>
    </View>
  );
};

export default CardHeader;
