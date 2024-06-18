import {StyleSheet, Image, StatusBar, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
   // getAllChallangeAndAllExerciseData();
    getPlanData();

    // getProfileData(getUserDataDetails?.id),
    // getCustomWorkout();
    // getOffertermsStatus();
    // PurchaseDetails();
    dispatch(setFitmeAdsCount(0));
    initInterstitial();
    // getAllExerciseData();
    // ChallengesDataAPI();
  }, []);

  const getOffertermsStatus = async () => {
    try {
      const ApiCall = await axios(NewAppapi.GET_AGR_STATUS, {
        method: 'POST',
        data: {
          user_id: getUserDataDetails?.id,
          version: VersionNumber.appVersion,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (
        ApiCall?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: ApiCall?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        setApiDataLoaded(true);
      } else if (ApiCall?.data?.message == 'user not found') {
        // console.log('heloo',ApiCall.data)

        setApiDataLoaded(true);
      } else {
        console.log('MSDMMMSMSM', ApiCall?.data);
        dispatch(setOfferAgreement(ApiCall?.data));
      }
    } catch (error) {
      console.log(error);
      setApiDataLoaded(true);
    }
  };

  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion,
      });
      if (res.data?.msg != 'version  is required') {
        dispatch(setChallengesData(res.data));
      } else {
        dispatch(setChallengesData([]));
      }
    } catch (error) {
      console.error(error, 'ChallengesDataAPI ERRR');
    }
  };
  const getAllExerciseData = async () => {
    try {
      const exerciseData = await axios.get(
        `${NewAppapi.ALL_EXERCISE_DATA}?version=${VersionNumber.appVersion}`,
      );

      if (
        exerciseData?.data?.msg == 'Please update the app to the latest version'
      ) {
        dispatch(setAllExercise([]));
      } else if (exerciseData?.data?.length > 0) {
        // console.log(' getStoreVideoLoc',exerciseData.data?.length)
        Promise.all(
          exerciseData.data?.map((item, index) =>
            downloadVideos(item, index, exerciseData.data?.length),
          ),
        );
      } else {
        dispatch(setAllExercise([]));
      }
    } catch (error) {
      dispatch(setAllExercise([]));
      console.log('All-EXCERSIE-ERROR', error);
    }
  };
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
      // loadScreen();
    });
  };
  const loadScreen = () => {
    if (
      getUserDataDetails?.id &&
      getUserDataDetails?.profile_compl_status == 1
    ) {
      if (getOfferAgreement?.term_conditon) {
        navigation.replace('BottomTab');
      } else {
        if (
          !getUserDataDetails?.id &&
          getOfferAgreement?.term_conditon != 'Accepted'
        ) {
          navigation.replace('OfferTerms');
        } else {
          navigation.replace('BottomTab');
        }
      }
    } else {
      navigation.replace('LetsStart');
    }
  };
  const isValid = getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
  if (loaded) {
    setLoaded(false);
    if (getPurchaseHistory?.plan != null) {
      if (getPurchaseHistory?.plan == 'premium' && isValid) {
        loadScreen();
      } else {
        loaded.show();
        loadScreen();
      }
    } else {
      loaded.show();
      loadScreen();
    }
  }
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

  const getProfileData = async user_id => {
    try {
      const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: user_id,
          version: VersionNumber.appVersion,
        },
      });

      if (data?.data?.profile) {
        dispatch(setUserProfileData(data.data.profile));
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setUserProfileData([]));
      }
    } catch (error) {
      console.log('User Profile Error123', error);
    }
  };

  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData = {};
  const downloadVideos = async (data, index, len) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.jpg`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title + 'Image'] = filePath;
        // setDownloade(true);
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          // IOSBackgroundTask: true, // Add this for iOS background downloads
          path: filePath,
          appendExt: '.jpg',
        })
          .fetch('GET', data?.exercise_image_link, {
            'Content-Type': 'image/jpg',
            // key: 'Config.REACT_APP_API_KEY',
          })
          .then(res => {
            StoringData[data?.exercise_title + 'Image'] = res.path();
            // setDownloade(true);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };
  const getCustomWorkout = async () => {
    try {
      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${getUserDataDetails.id}`,
      );

      if (data?.data?.msg != 'data not found.') {
        dispatch(setCustomWorkoutData(data?.data?.data));
      } else {
        dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
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
        Object.keys(getUserDataDetails).length > 0 &&
          getUserDetailData(getUserDataDetails?.id);
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));

      Object.keys(getUserDataDetails).length > 0 &&
        getUserDetailData(getUserDataDetails?.id);
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
        loadScreen();
      } catch (error) {
        console.log('GET-USER-Challange and AllExerciseData DATA', error);
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
        loadScreen();
      }
    } else {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
        loadScreen();
      } catch (error) {
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
        loadScreen();
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
