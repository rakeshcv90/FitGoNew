import {Platform} from 'react-native';

//Live Ads
export const bannerAdId =
  Platform.OS == 'android'
    ?  'ca-app-pub-7924921064490662/8398163879'
    :'ca-app-pub-7924921064490662/3145837191' 

export const interstitialAdId =
  Platform.OS == 'android'
    ?'ca-app-pub-7924921064490662/2464639909'
    :'ca-app-pub-7924921064490662/9065707273'

export const rewardedAdId =
  Platform.OS == 'android'
    ?'ca-app-pub-7924921064490662/2702628841' 
    :'ca-app-pub-7924921064490662/7525394893'

// export const bannerAdId =
//   Platform.OS == 'android'
//     ?  'ca-app-pub-3940256099942544/6300978111'
//     :  'ca-app-pub-3940256099942544/2934735716';

// export const interstitialAdId =
//   Platform.OS == 'android'
//     ?'ca-app-pub-3940256099942544/1033173712'
//     : 'ca-app-pub-3940256099942544/4411468910';

// export const rewardedAdId =
//   Platform.OS == 'android'
//     ? 'ca-app-pub-3940256099942544/5224354917'
//     : 'ca-app-pub-3940256099942544/1712485313';
