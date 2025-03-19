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

let IsTesting = false;

export const BannerAdd = ({bannerAdId}) => {
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const DeviceID = useSelector(state => state.getDeviceID);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);

  IsTesting = true
  // IsTesting = PLATFORM_IOS
  //   ? getUserDataDetails?.social_id != null &&
  //     ADS_IOS.includes(getUserDataDetails?.social_id)
  //   : DeviceID != '' && ADS_IDs.includes(DeviceID);
  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
  // State to keep track of retries
  const [adLoadAttempt, setAdLoadAttempt] = useState(0);

  // Function to handle ad reload logic
  const handleAdFailedToLoad = error => {
    console.error('Banner ad failed to load:', error);
    if (adLoadAttempt < 3) {
      // Limit retries to avoid infinite loops
      setTimeout(() => {
        setAdLoadAttempt(prevAttempt => prevAttempt + 1);
      }, 3000); // Retry after 3 seconds
    }
  };

  // Reset ad load attempt when component renders successfully
  useEffect(() => {
    if (adLoadAttempt > 0) {
      console.log('Retrying to load the banner ad. Attempt:', adLoadAttempt);
    }
  }, [adLoadAttempt]);
  return (
    <>
      <BannerAd
        key={adLoadAttempt}
        unitId={
          __DEV__ ? bannerAdIdTest : IsTesting ? bannerAdIdTest : bannerAdId
        }
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={handleAdFailedToLoad}
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
// let interstitialAdRef1 = null; // Persistent ad reference
// let interstitialAdStatus = null; // Persistent ad status
// let interstitialJustClosed = false;
// export const MyInterstitialAd = () => {
//   const initInterstitial = async isTesting => {
//     if (interstitialAdRef1?._loaded) return;
//     const interstitialAd = InterstitialAd.createForAdRequest(
//       isTesting ? interstitialAdIdTest : interstitialAdId,
//       {
//         requestNonPersonalizedAdsOnly: true,
//       },
//     );
//     interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//       interstitialAdStatus = interstitialAd;
//       interstitialAdRef1 = interstitialAd;
//     });
//     interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//       interstitialAd.load();
//       interstitialJustClosed = true;
//       setTimeout(() => {
//         interstitialJustClosed = false;
//       }, 3000);
//     });
//     interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
//     interstitialAd.addAdEventListener(AdEventType.ERROR, error => {});
//     interstitialAd.load();
//     console.log('INTER LOADER');
//   };

//   const showInterstitialAd = async () => {
//     if (interstitialAdStatus?._loaded) {
//       await interstitialAdStatus?.show();
//     }
//   };
//   return {initInterstitial, showInterstitialAd};
// };

var isRewardAdBeingShown = false;
let rewardAdStatusRef = null;

export const MyRewardedAd = () => {
  const initRewarded = testing => {
    return new Promise((resolve, reject) => {
      if (rewardAdStatusRef) return resolve(); // Ad is already initialized
      console.error("init ",rewardAdStatusRef)
      const reward = RewardedAd.createForAdRequest(
        testing ? rewardedAdIdTest : rewardedAdId,
      );
      reward.addAdEventListener(AdEventType.LOADED, () => {
        // console.error(reward,"LOADED")
        rewardAdStatusRef = reward;
        resolve(); // Resolve when the ad is loaded
      });
      reward.addAdEventListener(AdEventType.ERROR, error => {
        // console.error('INIT ERRR',error)
        resolve(); // resolve the promise in case of an error
      });
      reward.addAdEventListener(AdEventType.CLOSED, () => {
        isRewardAdBeingShown = false;
        reward.load();
      });
      reward.addAdEventListener(AdEventType.OPENED, () => {
        isRewardAdBeingShown = true;
      });
      reward.load();
    });
  };

  const showRewardedAd = async () => {
    return new Promise((resolve, reject) => {
      console.log("RE SHOW ",rewardAdStatusRef),isRewardAdBeingShown
      if (isRewardAdBeingShown) return resolve(); // Return if ad shouldn't be shown
      if (rewardAdStatusRef?._loaded) {
        rewardAdStatusRef.addAdEventListener(AdEventType.OPENED, () => {});
        // resovlve or fail listeners
        rewardAdStatusRef.addAdEventListener(AdEventType.CLOSED, () => {
          resolve();
        });
        rewardAdStatusRef.addAdEventListener(AdEventType.ERROR, error => {
          // initRewarded(__DEV__ ?? IsTesting);
          resolve(); // resolve the promise if there's an error showing the ad
        });
        rewardAdStatusRef.show();
      } else {
        // initRewarded(__DEV__ ?? IsTesting);
        resolve(); // Resolve if no ad is available
      }
    });
  };
  const rewardAdClosed = async () => {
    return new Promise(resolve => {
      rewardAdStatusRef.addAdEventListener(AdEventType.CLOSED, () => {
        resolve(true);
      });
    });
  };
  return {initRewarded, showRewardedAd, rewardAdClosed};
};

var isInterAdBeingShown = false;
let interAdStatusRef = null;

export const MyInterstitialAd = () => {
  const initInterstitial = testing => {
    return new Promise((resolve, reject) => {
      // console.error("init ",interAdStatusRef)
      if (interAdStatusRef) return resolve(); // Ad is already initialized
      const interstitialAd = InterstitialAd.createForAdRequest(
        testing ? interstitialAdIdTest : interstitialAdId,
      );
      interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        // console.error(interstitialAd,"LOADED")
        interAdStatusRef = interstitialAd;
        resolve(); // Resolve when the ad is loaded
      });
      interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
        // console.error('INIT ERRR',error)
        resolve(); // resolve the promise in case of an error
      });
      interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        isInterAdBeingShown = false;
        interstitialAd.load();
      });
      interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
        isInterAdBeingShown = true;
      });
      interstitialAd.load();
    });
  };

  const showInterstitialAd = async () => {
    return new Promise((resolve, reject) => {
      if (isInterAdBeingShown) return resolve(); // Return if ad shouldn't be shown
      if (interAdStatusRef?._loaded) {
        interAdStatusRef.addAdEventListener(AdEventType.OPENED, () => {});
        // resovlve or fail listeners
        interAdStatusRef.addAdEventListener(AdEventType.CLOSED, () => {
          resolve();
        });
        interAdStatusRef.addAdEventListener(AdEventType.ERROR, error => {
          initInterstitial(__DEV__ ?? IsTesting);
          resolve(); // resolve the promise if there's an error showing the ad
        });
        interAdStatusRef.show();
      } else {
        initInterstitial(__DEV__ ?? IsTesting);
        resolve(); // Resolve if no ad is available
      }
    });
  };
  return {initInterstitial, showInterstitialAd};
};

var isAdBeingShown = false;
let adStatusRef = null;

export const OpenAppAds = () => {
  const initOpenApp = testing => {
    return new Promise((resolve, reject) => {
      if (adStatusRef) return resolve(); // Ad is already initialized
      const OpenAds = AppOpenAd.createForAdRequest(
        testing ? OPENAPP_IDTest : OPENAPP_ID,
      );
      OpenAds.addAdEventListener(AdEventType.LOADED, () => {
        adStatusRef = OpenAds;
        resolve(); // Resolve when the ad is loaded
      });
      OpenAds.addAdEventListener(AdEventType.ERROR, error => {
        resolve(); // resolve the promise in case of an error
      });
      OpenAds.addAdEventListener(AdEventType.CLOSED, () => {
        isAdBeingShown = false;
        OpenAds.load();
      });
      OpenAds.addAdEventListener(AdEventType.OPENED, () => {
        isAdBeingShown = true;
      });
      OpenAds.load();
    });
  };

  const showOpenAppAd = async () => {
    return new Promise((resolve, reject) => {
      if (interstitialJustClosed || isAdBeingShown) return resolve(); // Return if ad shouldn't be shown
      if (adStatusRef?._loaded) {
        adStatusRef.addAdEventListener(AdEventType.OPENED, () => {});
        // resovlve or fail listeners
        adStatusRef.addAdEventListener(AdEventType.CLOSED, () => {
          resolve();
        });
        adStatusRef.addAdEventListener(AdEventType.ERROR, error => {
          resolve(); // resolve the promise if there's an error showing the ad
        });
        adStatusRef.show();
      } else {
        resolve(); // Resolve if no ad is available
      }
    });
  };
  // to explicitly track if the ad has been closed
  const openAdClosed = async () => {
    return new Promise(resolve => {
      adStatusRef.addAdEventListener(AdEventType.CLOSED, () => {
        resolve(true);
      });
    });
  };
  return {initOpenApp, showOpenAppAd, openAdClosed};
};
