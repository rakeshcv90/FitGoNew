import { NativeModules } from 'react-native';

const { AdmobInterstitial } = NativeModules;

const InterstitialAdManager = {
  loadAd: (): Promise<boolean> => {
    return AdmobInterstitial.loadAd();
  },

  showAd: (): Promise<boolean> => {
    return AdmobInterstitial.showAd();
  }
};
export default InterstitialAdManager;