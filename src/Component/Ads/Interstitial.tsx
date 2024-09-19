import {
  InterstitialAd,
  AdEventType
} from 'react-native-google-mobile-ads';
import {store} from '../ThemeRedux/Store';
import {PLATFORM_IOS} from '../Color';
import {
  ADS_IDs,
  ADS_IOS,
  interstitialAdId,
  interstitialAdIdTest,
} from '../AdsId';
import React, {useEffect, useRef} from 'react';


interface Props {
    setAddClosed: Function; // Callback function for ad closed state
  }


const DeviceID = store.getState().getDeviceID;
const getUserDataDetails: any = store.getState().getUserDataDetails;
const IsTesting = __DEV__
  ? true
  : PLATFORM_IOS
  ? getUserDataDetails?.social_id != null &&
    ADS_IOS.includes(getUserDataDetails?.social_id)
  : DeviceID != '' && ADS_IDs.includes(DeviceID);

class Interstitial {
  private interstitialAd: InterstitialAd | null = null;
  private adLoaded = false; // Global variable to track ad loading status
  private addClosed: Function // Callback for ad closed state

  constructor(addClosed: Function) {
    this.addClosed = addClosed;
  }

  initInterstitial = async () => {
    console.log('Ad INIT FUNC');
    if (this.adLoaded) return; // Prevent loading multiple times

    console.log('Ad INIT CHECK');
    this.interstitialAd = InterstitialAd.createForAdRequest(
      IsTesting ? interstitialAdIdTest : interstitialAdId,
      {},
    );

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.adLoaded = true;
      console.log('Ad Loaded');
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      // this.interstitialAd?.load(); // Load a new ad after it's closed
      this.addClosed();
      console.log('Ad Closed');
      this.adLoaded = false; // Reset to prevent showing the same ad again
    });

    this.interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
      console.log('Ad Error:', error);
      this.addClosed()
    });

    this.interstitialAd.load();
  };

  showInterstitialAd = async () => {
    if (this.adLoaded) {
      this.interstitialAd?.show();
      this.adLoaded = false; // Reset to prevent showing the same ad again
    } else {
      console.log('Ad not loaded yet');
      this.adLoaded = false; // Reset to prevent showing the same ad again
      // this.addClosed()
    }
  };
}


const useInterstitialAd = ({setAddClosed}: Props) => {
  const interstitialRef = useRef<Interstitial | null>(null);

  const addClosed = () => {
    setAddClosed(true)
  }

  useEffect(() => {
    interstitialRef.current = new Interstitial(addClosed);
  }, []);

  const initInterstitial = () => {
    interstitialRef.current?.initInterstitial();
  };
  const showInterstitialAd = () => {
    interstitialRef.current?.showInterstitialAd();
  };

  return {initInterstitial,showInterstitialAd};
};

export default useInterstitialAd;
