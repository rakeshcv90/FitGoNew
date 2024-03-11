import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import {interstitialAdId, rewardedAdId} from './AdsId';
import {View} from 'react-native';
import {useState, useRef} from 'react';

export const BannerAdd = ({bannerAdId}) => {
  return (
    <BannerAd
      unitId={bannerAdId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

// export const MyInterstitialAd = (resetFitmeCount) => {
//   const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdId, {
//     requestNonPersonalizedAdsOnly: true,
//     keywords: ['fashion', 'clothing'],
//   });
//   const unsubscribe = interstitialAd.addAdEventListener(
//     AdEventType.LOADED,
//     () => {

//       interstitialAd.show();
//     },
//   );

//   const unsubscribe1 = interstitialAd.addAdEventListener(
//     AdEventType.CLOSED,
//     reward => {
//       resetFitmeCount()
//       //interstitialAd.load(); // Optional: Load a new ad for the next use
//     },
//   );
//   const unsubscribe2 = interstitialAd.addAdEventListener(
//     AdEventType.ERROR,
//     reward => {
//       //interstitialAd.load(); // Optional: Load a new ad for the next use
//     },
//   );
//   return interstitialAd;
// };
export const MyInterstitialAd = () => {
  const adStatus = useRef(true);
  const initInterstitial = async () => {
    const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    });
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      adStatus.current = interstitialAd;
      console.log('ad loaded');
    });
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
    });
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {
      console.log('ad clicked');
    });
    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
      console.log('load error', error.message);
    });
    interstitialAd.load();
  };

  const showInterstitialAd = async () => {
    console.log('Test Ads', adStatus.current);
    if (adStatus.current?._loaded) {
      adStatus.current.show();
      console.log('Add loade ddscdsdsvdv');
    } else {
    }
  };

  return {initInterstitial, showInterstitialAd};
};
// const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdId, {
//   requestNonPersonalizedAdsOnly: true,
//   keywords: ['fashion', 'clothing'],
// });
// interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//   setAdsStatus(interstitialAd);
// });

// interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//   interstitialAd.load(); // Optional: Load a new ad for the next use
// });
// const unsubscribe2 = interstitialAd.addAdEventListener(
//   AdEventType.ERROR,
//   () => {
//     //interstitialAd.load(); // Optional: Load a new ad for the next use
//   },
// );

// const showAds
//return interstitialAd;
export const MyRewardedAd = setreward => {
  const rewarded = RewardedAd.createForAdRequest(rewardedAdId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });
  const unsubscribeLoaded = rewarded.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      rewarded.show();
    },
  );
  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    reward => {
      setreward(1);
    },
  );
  const faild = rewarded.addAdEventListener(AdEventType.ERROR, dada => {});

  return rewarded;
};
