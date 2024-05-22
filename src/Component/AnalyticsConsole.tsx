import React, {PureComponent} from 'react';
import analytics from '@react-native-firebase/analytics';

export const AnalyticsConsole = (clickName: string) => {
  return analytics().logEvent(`CV_FITME_CLICKED_ON_${clickName}`);
};
// 42 times						