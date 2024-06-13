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
    DeviceInfo.syncUniqueId().then(uniqueId => {
      getCaterogy(uniqueId);
      Meal_List(uniqueId);
    });

    getOffertermsStatus();
    bannerApi();
    PurchaseDetails();
    getPlanData();
    ProfileDataAPI();
    Object.keys(getUserDataDetails).length > 0 && PurchaseDetails2(),
      getProfileData(getUserDataDetails?.id),
      getCustomWorkout();
    dispatch(setFitmeAdsCount(0));
    initInterstitial();
    getAllExerciseData();
    ChallengesDataAPI();
  }, []);
  //offerTerms
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
        getAgreementContent();
        setApiDataLoaded(true);
      } else {
        dispatch(setOfferAgreement(ApiCall?.data));
        getAgreementContent();
      }
    } catch (error) {
      console.log(error);
      setApiDataLoaded(true);
      getAgreementContent();
    }
  };
  //getRewardTermsContent
  const getAgreementContent = async () => {
    try {
      const ApiCall = await axios(
        `${NewAppapi.GET_AGREEMENT}?version=${VersionNumber.appVersion}`,
        {
          method: 'GET',
        },
      );

      if (
        ApiCall?.data?.msg == 'Please update the app to the latest version.'
      ) {
        setLoaded(true);
        showMessage({
          message: ApiCall?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        loadScreen();
      } else {
        dispatch(setAgreementContent(ApiCall?.data?.data[0]));
        loadScreen();
      }
    } catch (error) {
      console.log(error);
      loadScreen();
    }
  };
  //banner Api
  const bannerApi = async () => {
    try {
      const response = await axios(
        `${NewAppapi.EVENT_BANNERS}?version=${VersionNumber.appVersion}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (
        response?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (response?.data?.msg == 'version is required') {
        console.log('version error', response?.data?.msg);
      } else {
        const objects = {};
        response.data.data.forEach(item => {
          objects[item?.type] = item?.image;
        });
        dispatch(setBanners(objects));
      }
    } catch (error) {
      console.log('BannerApiError', error);
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
    //to check the condtion id user is already login and have not provided consent yet

    if (
      getUserDataDetails?.id &&
      getUserDataDetails?.profile_compl_status == 1
    ) {
      if (getOfferAgreement?.term_conditon) {
        navigation.replace('BottomTab');
      } else {
        if (getUserDataDetails?.id != null) {
          navigation.replace('OfferTerms');
        } else {
          navigation.replace('BottomTab');
        }
      }
    } else {
      navigation.replace('LetsStart');
    }
  };
  if (loaded) {
    setLoaded(false);
    if (planType != -1) {
      if (
        planType >= 149 &&
        getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD')
      ) {
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

  const Meal_List = async deviceData => {
    try {
      const data = await axios(`${NewAppapi.Meal_Categorie}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          version: VersionNumber.appVersion,
        },
      });
      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (data.data.diets.length > 0) {
        dispatch(Setmealdata(data.data.diets));
      } else {
        dispatch(Setmealdata([]));
      }
    } catch (error) {
      dispatch(Setmealdata([]));
      console.log('Meal List Error', error);
    }
  };
  const getCaterogy = async deviceid => {
    try {
      const favDiet = await axios.get(
        `${NewAppapi.Get_Product_Catogery}?deviceid=${deviceid}`,
      );
      if (favDiet.data.status != 'Invalid token') {
        dispatch(setStoreData([]));
      } else {
        dispatch(setStoreData(favDiet.data.data));
      }
    } catch (error) {
      dispatch(setStoreData([]));
      console.log('Product Category Error111', error);
    }
  };

  const PurchaseDetails = async () => {
    try {
      const result = await axios(
        `${NewAppapi.EVENT_SUBSCRIPTION_GET}/${getUserDataDetails?.id}`,
      );
      console.log('SPLASHHHHSAD', result.data);
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
  const PurchaseDetails2 = async () => {
    try {
      const res = await axios(`${NewAppapi.TransctionsDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: getUserDataDetails.id,
          token: getUserDataDetails.login_token,
        },
      });
      if (res?.data?.data?.length > 0) {
        dispatch(setPurchaseHistory(res.data.data));
      }
      // else if (res?.data?.msg == 'Invalid Token') {
      //   showMessage({
      //     message: 'Please Login Again!',
      //     type: 'danger',
      //     animationDuration: 500,
      //     floating: true,
      //     icon: {icon: 'auto', position: 'left'},
      //   });
      //   LogOut(dispatch);
      // }
      else {
        dispatch(setPurchaseHistory([]));
      }
    } catch (error) {
      dispatch(setPurchaseHistory([]));
      console.log('Purchase List Error', error);
    }
  };
  const ProfileDataAPI = async () => {
    try {
      const res = await axios({
        url: NewAppapi.Get_COMPLETE_PROFILE,
        method: 'get',
      });

      if (res?.data) {
        dispatch(setCompleteProfileData(res.data));
      } else {
        dispatch(setCompleteProfileData([]));
      }
    } catch (error) {
      dispatch(setCompleteProfileData([]));

      console.log(error);
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
