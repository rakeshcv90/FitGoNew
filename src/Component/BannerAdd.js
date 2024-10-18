import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  AppOpenAd,
} from 'react-native-google-mobile-ads';
import {
  ADS_IDs,
  ADS_IOS,
  bannerAdIdTest,
  interstitialAdId,
  interstitialAdIdTest,
  OPENAPP_ID,
  OPENAPP_IDTest,
  rewardedAdId,
  rewardedAdIdTest,
} from './AdsId';
import {useState, useRef, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {store} from './ThemeRedux/Store';
import {PLATFORM_IOS} from './Color';

const DeviceID = store.getState().getDeviceID;
const getUserDataDetails = store.getState().getUserDataDetails;
const IsTesting = __DEV__
  ? true
  : PLATFORM_IOS
  ? getUserDataDetails?.social_id != null &&
    ADS_IOS.includes(getUserDataDetails?.social_id)
  : DeviceID != '' && ADS_IDs.includes(DeviceID);
export const BannerAdd = ({bannerAdId}) => {
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
  return (
    <>
      <BannerAd
        unitId={IsTesting ? bannerAdIdTest : bannerAdId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      {/* {getPurchaseHistory?.plan != null ? (
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
      )} */}
    </>
  );
};
export const NewInterstitialAd = setClosed => {
  // Created specially for Splash Screen by Sahil
  const interstitialAdRef = useRef(false);
  const adStatus = useRef(true);
  const initInterstitial = async () => {
    if (interstitialAdRef.current) return;
    console.log('ADDD CALLED');
    const interstitialAd = InterstitialAd.createForAdRequest(
      IsTesting ? interstitialAdIdTest : interstitialAdId,
      {},
    );
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      adStatus.current = interstitialAd;
      interstitialAdRef.current = true;
    });
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
      setClosed(true);
      console.log('CLOSED');
    });
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
      console.log('eerrr', error);
      setClosed(true);
    });
    interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
      // setClosed(true);
    });
    interstitialAd.load();
  };

  const showInterstitialAd = async () => {
    if (adStatus.current?._loaded) {
      adStatus.current.show();
    }
  };

  return {initInterstitial, showInterstitialAd};
};
let interstitialAdRef1 = null; // Persistent ad reference
let interstitialAdStatus = null; // Persistent ad status
let interstitialJustClosed = false;
export const MyInterstitialAd = () => {
  const initInterstitial = async isTesting => {
    if (interstitialAdRef1?._loaded) return;
    const interstitialAd = InterstitialAd.createForAdRequest(
      isTesting
        ? interstitialAdIdTest
        : IsTesting
        ? interstitialAdIdTest
        : interstitialAdId,
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      interstitialAdStatus = interstitialAd;
      interstitialAdRef1 = interstitialAd;
    });
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
      interstitialJustClosed = true;
      setTimeout(() => {
        interstitialJustClosed = false;
      }, 3000);
    });
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {});
    interstitialAd.load();
    console.log('INTER LOADER');
  };

  const showInterstitialAd = async isTesting => {
    console.log('isTesting', interstitialAdRef1, interstitialAdStatus);
    if (isTesting == -1) return;
    if (interstitialAdStatus?._loaded) {
      await interstitialAdStatus?.show();
    }
  };
  return {initInterstitial, showInterstitialAd};
};

export const MyRewardedAd = () => {
  const adStatus = useRef(null);
  const rewardAdsLoad = useCallback(async () => {
    const rewarded = RewardedAd.createForAdRequest(
      IsTesting ? rewardedAdIdTest : rewardedAdId,
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );

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

    rewarded.load(); // Ensure the ad starts loading
  }, []);

  const showRewardAds =
    (async () => {
      if (adStatus.current && adStatus.current) {
        console.log('Showing ad');
        await adStatus.current.show();
      } else {
        console.log('Ad not ready');
      }
    },
    []);
  return {rewardAdsLoad, showRewardAds};
};
var isAdBeingShown = false;
export const OpenAppAds = () => {
  const adStatusRef = useRef(null);
  const initOpenApp = async () => {
    if (adStatusRef.current) return; // remove deviceId in live
    const OpenAds = AppOpenAd.createForAdRequest(
      IsTesting ? OPENAPP_IDTest : OPENAPP_ID,
    );
    OpenAds.addAdEventListener(AdEventType.LOADED, () => {
      adStatusRef.current = OpenAds;
    });
    OpenAds.addAdEventListener(AdEventType.CLOSED, () => {
      isAdBeingShown = false;
      OpenAds.load();
    });
    OpenAds.addAdEventListener(AdEventType.CLICKED, () => {});
    OpenAds.addAdEventListener(AdEventType.ERROR, error => {
      console.log('Error loading app open ad');
    });
    OpenAds.addAdEventListener(AdEventType.OPENED, () => {
      isAdBeingShown = true;
    });
    OpenAds.load();
  };
  const showOpenAppAd = async () => {
    if (interstitialJustClosed || isAdBeingShown) return; // remove DevidId in live
    if (adStatusRef.current?._loaded) {
      adStatusRef.current.show();
    }
  };
  return {initOpenApp, showOpenAppAd};
};
