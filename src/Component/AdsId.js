import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';

//Live Ads
// export const bannerAdId =
//   Platform.OS == 'android'
//     ?  'ca-app-pub-7924921064490662/8398163879'
//     :'ca-app-pub-7924921064490662/3145837191'

// export const interstitialAdId =
//   Platform.OS == 'android'
//     ?'ca-app-pub-7924921064490662/2464639909'
//     :'ca-app-pub-7924921064490662/9065707273'
//     ?'ca-app-pub-7924921064490662/2464639909'
//     :'ca-app-pub-7924921064490662/9065707273'

// export const rewardedAdId =
//   Platform.OS == 'android'
//     ?'ca-app-pub-7924921064490662/2702628841'
//     :'ca-app-pub-7924921064490662/7525394893'

// export const adUnitIDs = {
//   image:
//     Platform.OS === 'ios'
//       ? 'ca-app-pub-7924921064490662/1305029494'
//       : 'ca-app-pub-7924921064490662/5433978208',

//   video:
//     Platform.OS === 'ios'
//       ? 'ca-app-pub-3940256099942544/2521693316'
//       : 'ca-app-pub-7924921064490662/5433978208',
// };
// export const OPENAPP_ID =
//   Platform.OS == 'android'
//     ? 'ca-app-pub-7924921064490662/4617349230'
//     : 'ca-app-pub-7924921064490662/2653530871';


    //For Test Ads

export const bannerAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-3940256099942544/2934735716';

export const interstitialAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/1033173712'
    : 'ca-app-pub-3940256099942544/4411468910';

export const rewardedAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-3940256099942544/1712485313';

export const adUnitIDs = {
  image:
    Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/3986624511'
      : 'ca-app-pub-3940256099942544/2247696110',
  video:
    Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/2521693316'
      : 'ca-app-pub-3940256099942544/1044960115',
};
export const OPENAPP_ID = TestIds.APP_OPEN
