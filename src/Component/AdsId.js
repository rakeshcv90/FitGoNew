import {Platform} from 'react-native';

export const bannerAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-3940256099942544/2934735716';

export const interstitialAdId =
  Platform.OS == 'android'
    ?'ca-app-pub-3940256099942544/8691691433' //'ca-app-pub-3940256099942544/1033173712'
    : 'ca-app-pub-3940256099942544/5135589807'//'ca-app-pub-3940256099942544/4411468910';

export const rewardedAdId =
  Platform.OS == 'android'
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-3940256099942544/1712485313';
