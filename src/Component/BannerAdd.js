import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  AppOpenAd,
} from 'react-native-google-mobile-ads';
import {interstitialAdId, OPENAPP_ID, rewardedAdId} from './AdsId';
import {View} from 'react-native';
import {useState, useRef,useCallback} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';

export const BannerAdd = ({bannerAdId}) => {
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
  return (
    <>
      {getPurchaseHistory?.plan != null ? (
        getPurchaseHistory?.plan != 'noob' && isValid ? null : (
          <BannerAd
            unitId={bannerAdId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        )
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
    } else {
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
    } else {
    }
  };

  return {initInterstitial, showInterstitialAd};
};

export const MyRewardedAd = () => {
  const adStatus = useRef(null);
  const rewardAdsLoad = useCallback(async () => {
    const rewarded = RewardedAd.createForAdRequest(rewardedAdId, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Ad loaded');
      adStatus.current = rewarded;
    });

    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      console.log('User earned a reward:', reward);
    });

    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Ad closed');
      rewarded.load(); // Reload the ad after it is closed
    });

    rewarded.addAdEventListener(AdEventType.ERROR, error => {
      console.error('Ad error:', error);
      rewarded.load(); // Attempt to reload the ad if there is an error
    });

    await rewarded.load(); // Ensure the ad starts loading
  }, []);

  const showRewardAds = useCallback(async () => {
    if (adStatus.current && adStatus.current._loaded) {
      console.log('Showing ad');
      await adStatus.current.show();
    } else {
      console.log('Ad not ready');
    }
  }, []);
  return {rewardAdsLoad, showRewardAds};
};
export const OpenAppAds = () => {
  const adStatusRef = useRef(true);
  const initOpenApp = async () => {
    const OpenAds = AppOpenAd.createForAdRequest(OPENAPP_ID);
    OpenAds.addAdEventListener(AdEventType.LOADED, () => {
      adStatusRef.current = OpenAds;
    });
    OpenAds.addAdEventListener(AdEventType.CLOSED, () => {
      OpenAds.load();
    });
    OpenAds.addAdEventListener(AdEventType.CLICKED, () => {});
    OpenAds.addAdEventListener(AdEventType.ERROR, error => {
      console.log('Error loading app open ad');
    });
    OpenAds.addAdEventListener(AdEventType.OPENED, () => {});
    OpenAds.load();
  };
  const showOpenAppAd = async () => {
    if (adStatusRef.current?._loaded) {
      adStatusRef.current.show();
    } else {
      console.log('ADD NOT SHOWN', adStatus);
      /// setClosed(true)
    }
  };

  return {initOpenApp, showOpenAppAd};
};
