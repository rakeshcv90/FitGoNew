import {requireNativeComponent, ViewProps} from 'react-native';
import React from 'react';

const RCTBannerAdView = requireNativeComponent('RCTBannerAdView');

const BannerAdView = (props) => {
  return <RCTBannerAdView {...props} />;
};

export default BannerAdView;