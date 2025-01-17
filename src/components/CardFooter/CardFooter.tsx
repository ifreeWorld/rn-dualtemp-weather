import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { CardFooterStyles } from './CardFooter.Styles';
import { AppStateContext } from '../../utils/AppStateContext';
import { typography } from '../../Styles/Typography';
import { translate } from '../../i18n';

const CardFooter = () => {
  const context = useContext(AppStateContext);

  const [updatedString, setUpdatedString] = useState<string>();

  useEffect(() => {
    const updateStringFunc = setInterval(
      () => setUpdatedString(context?.date.fromNow()),
      100
    );

    return () => clearInterval(updateStringFunc);
  }, [updatedString, context]);

  return (
    <View style={CardFooterStyles.cardFooter}>
      <Text style={[typography.headerText, CardFooterStyles.footerText]}>
        {translate('上次更新于')}: {updatedString}
      </Text>
    </View>
  );
};

export default CardFooter;
