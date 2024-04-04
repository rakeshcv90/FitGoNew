import {Platform} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  useInterstitialAd,
} from 'react-native-google-mobile-ads';
/**
 *
 * @param {string} tag
 * @param {string} type
 * @param {string} value
 */
export function Logger(tag = 'AD', type, value) {
  console.log(`[${tag}][${type}]:`, value);
}
// Native Add AdId
// export const adUnitIDs =

// Platform.OS === 'ios'
// ? 'ca-app-pub-7672988132369278/4502578793'
// : 'ca-app-pub-7672988132369278/4753860239';
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


export const Events = {
  onViewableItemsChanged: 'onViewableItemsChanged',
};
