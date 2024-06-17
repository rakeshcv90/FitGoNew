import React, {PureComponent} from 'react';
import analytics from '@react-native-firebase/analytics';

export const AnalyticsConsole = (clickName: string) => {
  return analytics().logEvent(`FITME_${clickName}`);
};
// 42 times						