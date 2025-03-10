import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {ADS_IDs, ADS_IOS} from '../../Component/AdsId';
import {PLATFORM_IOS} from '../../Component/Color';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {
  setDeviceID,
  setExerciseInTime,
  setExerciseOutTime,
  setFitmeAdsCount,
  setPopUpSeen,
} from '../../Component/ThemeRedux/Actions';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import {requestPermissionforNotification} from '../../Component/Helper/PushNotification';
import useOpenAd from '../../Utils/Ads/useOpenAd';

type Props = {
  afterAdFunction: () => void;
  setLoader: Dispatch<SetStateAction<boolean>>;
};
const useSetupAds = ({afterAdFunction}: Props) => {
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  const {initInterstitial} = MyInterstitialAd();
  const {isAdReady, loadAd, showAd} = useOpenAd();

  useEffect(() => {
    loadAd();
    if (PLATFORM_IOS) {
      if (getUserDataDetails && getUserDataDetails.social_id != null) {
        if (ADS_IOS.includes(getUserDataDetails.social_id)) {
          callAds();
        } else {
          callAds();
        }
      } else {
        // callAds(__DEV__ ? true : false); // load live ad if null
        callAds(); // load live ad if null
      }
    } else {
      // For non-iOS platforms, fetch the unique ID
      DeviceInfo.syncUniqueId().then(uniqueId => {
        dispatch(setDeviceID(uniqueId));
        if (ADS_IDs.includes(uniqueId) || __DEV__) {
          callAds();
        } else {
          // callAds(__DEV__ ? true : false);
          callAds();
        }
      });
    }
    dispatch(setExerciseOutTime(''));
    dispatch(setExerciseInTime(''));
    requestPermissionforNotification(dispatch);
    dispatch(setPopUpSeen(false));
    dispatch(setFitmeAdsCount(0));
  }, []);
  // function to call ads
  const callAds = async () => {
    await showAd(afterAdFunction);
    // afterAdFunction()
  };
  
  return {};
};

export default useSetupAds;
