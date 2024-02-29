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

export const MyInterstitialAd = (resetFitmeCount) => {
  const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });
  const unsubscribe = interstitialAd.addAdEventListener(
    AdEventType.LOADED,
    () => {
      
      interstitialAd.show();
    },
  );

  const unsubscribe1 = interstitialAd.addAdEventListener(
    AdEventType.CLOSED,
    reward => {
      resetFitmeCount()
      //interstitialAd.load(); // Optional: Load a new ad for the next use
    },
  );
  const unsubscribe2 = interstitialAd.addAdEventListener(
    AdEventType.ERROR,
    reward => {
      //interstitialAd.load(); // Optional: Load a new ad for the next use
    },
  );
  return interstitialAd;
};

export const MyRewardedAd = (setreward) => {
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
  const faild = rewarded.addAdEventListener(AdEventType.ERROR, dada => {
  
  });

  return rewarded;
};
