import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';

export const ADS_IDs = [
  // Device_IDs
  '311fb49b3ce6550f',
  '92982e3a291815c2',
  '3ef616890f6a402b',
  '8d3ebdca6951807b',
  '0695a8250663f8b6',
  // '421ccabce91103f0',  // Vivo LIVE DEVICE ALWAYS COMMENTED
  'd21a4be384ec19bf',
  // '84b935069781fa18',  // Huawei LIVE DEVICE ALWAYS COMMENTED
  '5e7dd1b045daf6ae',
  '574a7ef0e979217a',
  '8e95036375aa56c4',
  'e2fd7fb50154f6a9',
  '171a4ea7fccd8a28',
  '68c70c162994d5f8',
  'c87c56528508709e', //android 14 samsung
  'fccf6c54a494e29f', // android 14 debug
  '8a0a218772cd72ed', // pixel 3xl debug
  '8454b6dd3a6df800', // pixel 3xl release
  'efafdb802eeaa67a',
  '2632a909404f1496', // samsung Fold
  '550dd03a07868f3f', // Moto Debug
  '9ef5942cb9404e65', // Samsung m10-debug devices
  '1dad2e8c8b9c8232', // Manoj Lala
  '35c64759de0db5f8', //rakesh phone
  '8d54921a7c6b740f', //rakesh phone'
  '9c105cf5d167e9ca', // Vivo Coordinator
];
export const ADS_IOS = [
  // SOCIAL_IDs
  '001477.ab2010ce7baf4388bddca64e18eb7c5b.0652', // Apple Ipad
  '000975.31c6b9db0ce44512954fc43c26ca20a1.0909', // iPhone X nandita@cvinfotech.com ID
  '000577.1a615fb9865b4030a0941abcfec38391.0421', // iPhone 12
  '000443.cbdb762d9ae448999b21de3eadaceecf.1118', // iPhone 14 maybe
];
//Live Ads
export const bannerAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-7924921064490662/8398163879'
    : 'ca-app-pub-7924921064490662/3145837191';

export const interstitialAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-7924921064490662/2464639909'
    : 'ca-app-pub-7924921064490662/9065707273'
export const rewardedAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-7924921064490662/2702628841'
    : 'ca-app-pub-7924921064490662/7525394893';

export const adUnitIDs = {
  image:
    Platform.OS === 'ios'
      ? 'ca-app-pub-7924921064490662/1305029494'
      : 'ca-app-pub-7924921064490662/5433978208',

  video:
    Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/2521693316'
      : 'ca-app-pub-7924921064490662/5433978208',
};
export const OPENAPP_ID =
  Platform.OS == 'android'
    ? 'ca-app-pub-7924921064490662/4617349230'
    : 'ca-app-pub-7924921064490662/2653530871';

//For Test Ads

export const bannerAdIdTest =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-3940256099942544/2934735716';

export const interstitialAdIdTest =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/1033173712'
    : 'ca-app-pub-3940256099942544/4411468910';

export const rewardedAdIdTest =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-3940256099942544/1712485313';

export const adUnitIDsTest = {
  image:
    Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/3986624511'
      : 'ca-app-pub-3940256099942544/2247696110',
  video:
    Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/2521693316'
      : 'ca-app-pub-3940256099942544/1044960115',
};
export const OPENAPP_IDTest =
  Platform.OS == 'ios'
    ? TestIds.APP_OPEN
    : 'ca-app-pub-3940256099942544/9257395921';
