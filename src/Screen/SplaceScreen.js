import {StyleSheet, Image, StatusBar, Platform, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Appapi, DeviceWidth, NewApi, NewAppapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as RNIap from 'react-native-iap';
import {
  Setmealdata,
  setAgreementContent,
  setAllExercise,
  setBanners,
  setChallengesData,
  setCompleteProfileData,
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setFitmeAdsCount,
  setInappPurchase,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setStoreData,
  setUserProfileData,
  setVideoLocation,
} from '../Component/ThemeRedux/Actions';
import VersionNumber, {appVersion} from 'react-native-version-number';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {requestPermissionforNotification} from '../Component/Helper/PushNotification';

import moment from 'moment';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {interstitialAdId} from '../Component/AdsId';
import {LogOut} from '../Component/LogOut';
import RNFetchBlob from 'rn-fetch-blob';
import {EnteringEventFunction} from './Event/EnteringEventFunction';

const products = Platform.select({
  ios: ['fitme_noob', 'fitme_pro', 'fitme_legend'],
  android: ['fitme_monthly', 'a_monthly', 'fitme_legend'],
});

const SplaceScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const showIntro = useSelector(state => state.showIntro);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const planType = useSelector(state => state.planType);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [loaded, setLoaded] = useState(false);
  const [ApiDataloaded, setApiDataLoaded] = useState(false);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  useEffect(() => {
    requestPermissionforNotification(dispatch);
    getUserAllInData();
    getPlanData();

    dispatch(setFitmeAdsCount(0));
    initInterstitial();
  }, []);
  useEffect(() => {
    if (Object.keys(getUserDataDetails).length > 0) {
      getUserDetailData(getUserDataDetails?.id);
    } else {
      DisplayAds(getOfferAgreement);
    }
  }, [loaded]);

  const initInterstitial = async () => {
    const interstitialAd = InterstitialAd.createForAdRequest(
      interstitialAdId,
      {},
    );
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(interstitialAd);
    });
    interstitialAd.load();
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {});
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      loadScreen();
    });
  };
  const loadScreen = agreement => {
    if (showIntro) {
      if (getUserDataDetails?.id) {
        console.log('zxdfdsfds', getOfferAgreement);
        if (agreement?.term_condition == 'Accepted') {
          navigation.replace('BottomTab');
        } else {
          navigation.replace('OfferTerms');
        }
      } else {
        navigation.replace('LogSignUp');
      }
    } else {
      navigation.replace('IntroductionScreen1');
    }
  };
  //check cancel subscription
  const checkCancel = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases?.length == 0) {
        cancelSubscription();
      } else {
        const activeSubs = purchases.filter(item => {
          if (item?.autoRenewingAndroid == true) {
          } else {
            cancelSubscription();
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelSubscription = async () => {
    try {
      const data = await axios(
        `${NewAppapi.CANCEL_SUBSCRIPTION}?user_id=${getUserDataDetails?.id}&status=delete`,
      );
      if (data.data?.msg == 'plan deleted successfully') {
        console.log(data.data, 'CANCELLED');
        dispatch(setPurchaseHistory([]));
        EnteringEventFunction(
          dispatch,
          [],
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
      }
    } catch (error) {
      console.log('User Profile Error123', error);
    }
  };
  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');

  const DisplayAds = agremment => {
    console.log('Display  ADs Caal');
    if (loaded) {
      setLoaded(false);

      if (getPurchaseHistory?.plan != null) {
        if (getPurchaseHistory?.plan == 'premium' && isValid) {
          loadScreen(agremment);
          Platform.OS == 'android' && checkCancel();
        } else {
          loaded.show();
          loadScreen(agremment);
        }
      } else {
        loaded.show();
        loadScreen(agremment);
      }
    }
  };

  const getPlanData = () => {
    Platform.OS === 'ios'
      ? RNIap.initConnection()
          .catch(() => {
            console.log('error connecting to store');
          })
          .then(() => {
            RNIap.getProducts({skus: products})
              .catch(() => {
                console.log('error finding purchase');
              })
              .then(res => {
                dispatch(setInappPurchase(res));
              });
          })
      : RNIap.initConnection()
          .catch(() => {
            console.log('error connecting to store');
          })
          .then(() => {
            RNIap.getSubscriptions({skus: products})
              .catch(() => {
                console.log('error finding purchase');
              })
              .then(res => {
                dispatch(setInappPurchase(res));
              });
          });
  };

  const PurchaseDetails = async () => {
    try {
      const result = await axios(
        `${NewAppapi.EVENT_SUBSCRIPTION_GET}/${getUserDataDetails?.id}`,
      );

      if (result.data?.message == 'Not any subscription') {
        dispatch(setPurchaseHistory([]));
        EnteringEventFunction(
          dispatch,
          [],
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
      } else {
        dispatch(setPurchaseHistory(result.data.data));
        EnteringEventFunction(
          dispatch,
          result.data?.data,
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
      }
    } catch (error) {
      console.log('PURCHASEHIS SPL ERR', error);
      dispatch(setPurchaseHistory([]));
    }
  };

  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (responseData?.data?.msg == 'version is required') {
        console.log('version error', responseData?.data?.msg);
      } else {
        const objects = {};
        responseData.data.data.forEach(item => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
        getAllChallangeAndAllExerciseData();
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
      getAllChallangeAndAllExerciseData();
    }
  };

  const getUserDetailData = async userId => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userId}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        DisplayAds(responseData?.data?.additional_data);
        dispatch(setUserProfileData(responseData?.data?.profile));
        if (responseData?.data.event_details == 'Not any subscription') {
          dispatch(setPurchaseHistory([]));
          EnteringEventFunction(
            dispatch,
            [],
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
        } else {
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
        }
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      dispatch(setPurchaseHistory([]));
      dispatch(setUserProfileData([]));
      dispatch(setCustomWorkoutData([]));
      DisplayAds((response = null));
    }
  };
  const getAllChallangeAndAllExerciseData = async () => {
    let responseData = 0;
    if (Object.keys(getUserDataDetails).length > 0) {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
      } catch (error) {
        console.log('GET-USER-Challange and AllExerciseData DATA', error);
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
      }
    } else {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
      } catch (error) {
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
        //  loadScreen();
        console.log('GET-USER-Challange and AllExerciseData DATA', error);
      }
    }
  };
  return (
    <>
      {/* {closed ? (
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <StatusBar backgroundColor={'transparent'} translucent />
        </View>
      ) : ( */}
      <LinearGradient
        style={styels.container}
        start={{x: 0, y: 0}}
        end={{x: 0.5, y: 0.5}}
        colors={['#D01818', '#941000']}>
        <StatusBar backgroundColor={'transparent'} translucent />
        <Image
          source={localImage.SplashText}
          style={styels.Textlogo}
          resizeMode="contain"
        />
      </LinearGradient>
      {/* )} */}
    </>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.4,
  },
});
export default SplaceScreen;
