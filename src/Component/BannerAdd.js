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
import {useSelector} from 'react-redux';
import moment from 'moment';

export const BannerAdd = ({bannerAdId}) => {
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
  return (
    <>
      {getPurchaseHistory?.plan != null ? 
        getPurchaseHistory?.plan != 'noob' && isValid ? null : (
          <BannerAd
            unitId={bannerAdId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
      ) : (
        <BannerAd
          unitId={bannerAdId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      )}
    </>
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
export const NewInterstitialAd = setClosed => {
  // Created specially for Splash Screen by Sahil
  const adStatus = useRef(true);
  const initInterstitial = async () => {
    const interstitialAd = InterstitialAd.createForAdRequest(
      interstitialAdId,
      {},
    );
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      adStatus.current = interstitialAd;
    });
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
    });
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
      setClosed(true);
    });
    interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
      setClosed(true);
    });
    interstitialAd.load();
  };

  const showInterstitialAd = async () => {
    if (adStatus.current?._loaded) {
      adStatus.current.show();
      console.log('Add loade ddscdsdsvdv');
    } else {
      console.log('ADD NOT SHOWN', adStatus);
      setClosed(true);
    }
  };

  return {initInterstitial, showInterstitialAd};
};
export const MyInterstitialAd = () => {
  const adStatus = useRef(true);
  const initInterstitial = async () => {
    const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdId, {
      requestNonPersonalizedAdsOnly: true,
    });
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      adStatus.current = interstitialAd;
    });
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
    });
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {});
    interstitialAd.load();
  };

  const showInterstitialAd = async () => {
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
