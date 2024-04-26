import {StyleSheet, Image, StatusBar, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceWidth, NewAppapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as RNIap from 'react-native-iap';
import {
  Setmealdata,
  setAllExercise,
  setChallengesData,
  setCompleteProfileData,
  setCustomWorkoutData,
  setFitmeAdsCount,
  setInappPurchase,
  setPurchaseHistory,
  setStoreData,
} from '../Component/ThemeRedux/Actions';
import VersionNumber from 'react-native-version-number';
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

const products = Platform.select({
  ios: ['fitme_monthly', 'fitme_quarterly', 'fitme_yearly'],
  android: ['fitme_monthly', 'fitme_quarterly', 'fitme_year'],
});

const SplaceScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const showIntro = useSelector(state => state.showIntro);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getUserID = useSelector(state => state.getUserID);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestPermissionforNotification(dispatch);
    DeviceInfo.syncUniqueId().then(uniqueId => {
      getCaterogy(uniqueId);

      Meal_List(uniqueId);
    });
    getPlanData();
    ProfileDataAPI();
    Object.keys(getUserDataDetails).length > 0 && PurchaseDetails(),
      getCustomWorkout();
    dispatch(setFitmeAdsCount(0));
    initInterstitial();
    // getAllExerciseData();
    ChallengesDataAPI()
  }, []);

  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion,
      });
      if(res.data?.msg != 'version  is required'){
        dispatch(setChallengesData(res.data))
      }else{
        dispatch(setChallengesData([]))
      }
    } catch (error) {
      console.error(error, 'ChallengesDataAPI ERRR');
    }
  };
  const initInterstitial = async () => {
    const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdId, {
      keywords: [
        'action',
        'puzzle',
        'adventure',
        'sports',
        'racing',
        'platformer',
        'simulation',
        'arcade',
      ],
    });
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(interstitialAd);
    });
    interstitialAd.load();
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {});
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, () => {});
  };
  const loadScreen = () => {
    if (showIntro) {
      if (
        getUserDataDetails?.id &&
        getUserDataDetails?.profile_compl_status == 1
      ) {
        navigation.replace('BottomTab');
      } else {
        navigation.replace('LogSignUp');
      }
    } else {
      navigation.replace('IntroductionScreen1');
    }
  };
  if (loaded) {
    setLoaded(false);
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
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
  // const getAllExerciseData = async () => {
  //   try {
  //     const exerciseData = await axios.get(
  //       `${NewAppapi.ALL_EXERCISE_DATA}?version=${VersionNumber.appVersion}`,
  //     );

  //     if (
  //       exerciseData?.data?.msg == 'Please update the app to the latest version'
  //     ) {
  //       dispatch(setAllExercise([]));
  //     } else if (exerciseData?.data?.length > 0) {
  //       dispatch(setAllExercise(exerciseData?.data));
  //     } else {
  //       dispatch(setAllExercise([]));
  //     }
  //   } catch (error) {
  //     dispatch(setAllExercise([]));
  //     console.log('All-EXCERSIE-ERROR', error);
  //   }
  // };
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
