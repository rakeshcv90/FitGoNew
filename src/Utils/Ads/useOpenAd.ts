import React, {useCallback, useEffect, useState} from 'react';
import {
  AdEventType,
  AppOpenAd,
} from 'react-native-google-mobile-ads';
import {useSelector} from 'react-redux';
import {PLATFORM_IOS} from '../../Component/Color';
import {
  ADS_IDs,
  ADS_IOS,
  OPENAPP_ID,
  OPENAPP_IDTest,
} from '../../Component/AdsId';

// Enum for Ad States
enum AdState {
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  ERROR = 'ERROR',
  NOT_LOADED = 'NOT_LOADED',
}

// Interface for Rewarded Ad Hook Return
interface UseOpenAdReturn {
  loadAd: () => Promise<boolean>;
  showAd: (onAdClosed?: () => void) => Promise<boolean>;
  adState: AdState;
  isAdReady: boolean;
}

// Utility class for managing Rewarded Ads
class AppOpenAdManager {
  // Store ad instances
  private static instances: {[key: string]: AppOpenAd} = {};

  // Track loading promises to prevent multiple simultaneous loads
  private static loadingInstances: {[key: string]: Promise<AppOpenAd> | null} =
    {};

  // Get or create a rewarded ad instance
  static getAdInstance(adUnitId: string): AppOpenAd {
    if (!this.instances[adUnitId]) {
      this.instances[adUnitId] = AppOpenAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['game', 'entertainment'],
      });
    }
    return this.instances[adUnitId];
  }

  // Check if an ad is already loaded
  static isAdLoaded(adUnitId: string): boolean {
    const ad = this.instances[adUnitId];
    return ad ? ad.loaded : false;
  }

  // Preload ad with robust error handling
  static async preloadAd(adUnitId: string): Promise<AppOpenAd> {
    // Check for existing loading process
    if (this.loadingInstances[adUnitId]) {
      return this.loadingInstances[adUnitId]!;
    }

    // Create a new loading promise
    const loadPromise = new Promise<AppOpenAd>((resolve, reject) => {
      try {
        const ad = this.getAdInstance(adUnitId);

        // Listener for successful load
        const loadListener = ad.addAdEventListener(
          AdEventType.LOADED,
          () => {
            loadListener();
            resolve(ad);
          },
        );

        // Listener for load errors
        const errorListener = ad.addAdEventListener(
          AdEventType.ERROR,
          error => {
            errorListener();
            reject(new Error(`Ad Load Error: ${error.message}`));
          },
        );

        // Initiate ad loading
        ad.load();
      } catch (error) {
        reject(error);
      }
    });

    // Store the loading promise
    this.loadingInstances[adUnitId] = loadPromise;

    try {
      const loadedAd = await loadPromise;
      return loadedAd;
    } catch (error) {
      throw error;
    } finally {
      // Clear the loading instance
      this.loadingInstances[adUnitId] = null;
    }
  }
}

// Custom hook for managing rewarded ads
export const useOpenAd = (): UseOpenAdReturn => {
  const [adState, setAdState] = useState<AdState>(AdState.NOT_LOADED);
  const [isAdReady, setIsAdReady] = useState(false);

  const DeviceID = useSelector((state: any) => state.DeviceID);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  // Determine the appropriate ad unit ID based on platform
  const getAdUnitId = useCallback(() => {
    const IsTesting = __DEV__
      ? true
      : PLATFORM_IOS
      ? getUserDataDetails?.social_id != null &&
        ADS_IOS.includes(getUserDataDetails?.social_id)
      : DeviceID != '' && ADS_IDs.includes(DeviceID);
    return IsTesting ? OPENAPP_IDTest : OPENAPP_ID;
  }, []);

  // Load the ad
  const loadAd = useCallback(async (): Promise<boolean> => {
    // Prevent redundant loading
    if (adState === AdState.INITIALIZING || isAdReady) {
      return isAdReady;
    }

    // Reset state
    setAdState(AdState.INITIALIZING);

    try {
      const currentAdUnitId = getAdUnitId();

      // Check if ad is already loaded
      if (AppOpenAdManager.isAdLoaded(currentAdUnitId)) {
        setIsAdReady(true);
        setAdState(AdState.READY);
        return true;
      }

      // Attempt to preload the ad
      const ad = await AppOpenAdManager.preloadAd(currentAdUnitId);

      // Verify ad is loaded
      if (ad && ad.loaded) {
        setIsAdReady(true);
        setAdState(AdState.READY);
        return true;
      } else {
        throw new Error('Ad could not be loaded');
      }
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error('Detailed error:', error.message);
      }

      // Set error state
      setAdState(AdState.ERROR);
      setIsAdReady(false);

      return false;
    }
  }, [adState, getAdUnitId, isAdReady]);

  // Show the ad
  const showAd = useCallback(
    async (onAdClosed?: () => void): Promise<boolean> => {
      // Ensure ad is ready
      if (!isAdReady) {
        const loadResult = await loadAd();
        if (!loadResult) return false;
      }

      return new Promise(resolve => {
        try {
          const ad = AppOpenAdManager.getAdInstance(getAdUnitId());

          // Handle ad close event
          const closeListener = ad.addAdEventListener(
            AdEventType.CLOSED,
            () => {
              // Remove listener
              closeListener();

              // Reset ad readiness
              setIsAdReady(false);

              // Call optional callback
              if (onAdClosed) {
                onAdClosed();
              }

              // Resolve promise
              resolve(true);

              // Immediately start preloading next ad
              loadAd();
            },
          );

          // Show the ad
          ad.show();
        } catch (error) {
          console.error('Failed to show rewarded ad:', error);
          resolve(false);
        }
      });
    },
    [isAdReady, loadAd, getAdUnitId],
  );

  // Initial load when hook is first used
  useEffect(() => {
    loadAd();
  }, [loadAd]);

  return {
    loadAd,
    showAd,
    adState,
    isAdReady,
  };
};

export default useOpenAd;
