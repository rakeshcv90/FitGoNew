import {StyleSheet, Image, StatusBar, Platform, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Appapi,
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as RNIap from 'react-native-iap';
import {
  Setmealdata,
  setAgreementContent,
  setAllExercise,
  setAllWorkoutData,
  setBanners,
  setChallengesData,
  setCompleteProfileData,
  setCustomDietData,
  setCustomWorkoutData,
  setDeviceID,
  setDownloadedImage,
  setDynamicPopupValues,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setFitmeAdsCount,
  setInappPurchase,
  setOfferAgreement,
  setPastWinners,
  setPlanType,
  setPopUpSeen,
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
import {
  ADS_IDs,
  ADS_IOS,
  interstitialAdId,
  interstitialAdIdTest,
} from '../Component/AdsId';
import {LogOut} from '../Component/LogOut';
import RNFetchBlob from 'rn-fetch-blob';
import {EnteringEventFunction} from './Event/EnteringEventFunction';
import AnimatedLottieView from 'lottie-react-native';
import codePush from 'react-native-code-push';
import {CommonActions} from '@react-navigation/native';
import {PLATFORM_IOS} from '../Component/Color';
import {RequestAPI} from '../Component/Utilities/RequestAPI';
const products = Platform.select({
  ios: ['fitme_noob', 'fitme_pro', 'fitme_legend'],
  android: ['fitme_monthly', 'a_monthly', 'fitme_legend'],
});

const SplaceScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  // console.log("routeSpalce",route.params?.data)
  const showIntro = useSelector(state => state.showIntro);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getUpdateAvailable = useSelector(state => state?.getUpdateAvailable);
  const planType = useSelector(state => state.planType);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [loaded, setLoaded] = useState(false);
  const [ApiDataloaded, setApiDataLoaded] = useState({});
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  useEffect(() => {
    PLATFORM_IOS
      ? getUserDataDetails && getUserDataDetails?.social_id != null
        ? ADS_IOS.includes(getUserDataDetails?.social_id)
          ? initInterstitial(true)
          : initInterstitial(false)
        : loadScreen()
      : DeviceInfo.syncUniqueId().then(uniqueId => {
          console.log('Device Id----', uniqueId);
          dispatch(setDeviceID(uniqueId));
          ADS_IDs.includes(uniqueId)
            ? initInterstitial(true)
            : initInterstitial(false);
        });
  }, []);
  useEffect(() => {
    requestPermissionforNotification(dispatch);
    getUserAllInData();
    getPlanData();
    allWorkoutApi();
    getPastWinner();
    dispatch(setPopUpSeen(false));
    dispatch(setFitmeAdsCount(0));
  }, []);
  useEffect(() => {
    if (
      getUserDataDetails?.length > 0 ||
      Object.keys(getUserDataDetails)?.length > 0
    ) {
      getUserDetailData(getUserDataDetails?.id);
    } else {
      DisplayAds(getOfferAgreement);
    }
  }, [loaded]);
  const initInterstitial = async isTestingDevice => {
    const ID = isTestingDevice || __DEV__ ? interstitialAdIdTest : interstitialAdId;
    const interstitialAd = InterstitialAd.createForAdRequest(ID, {});
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(interstitialAd);
    });
    interstitialAd.load();
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      // loadScreen();
      navigation.navigate('SplaceNew');
    });
    interstitialAd.addAdEventListener(AdEventType.CLICKED, () => {});
    interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      // loadScreen();
      navigation.navigate('SplaceNew');
    });
  };
  const loadScreen = agreement => {
    if (showIntro) {
      if (getUserDataDetails?.id) {
        if (getUserDataDetails?.profile_compl_status == 1) {
          if (agreement?.term_condition == 'Accepted') {
            // navigation.replace('BottomTab');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'BottomTab'}],
              }),
            );
          } else {
            navigation.replace('OfferTerms');
          }
        } else {
          navigation.navigate('Yourself');
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
    if (loaded) {
      setLoaded(false);

      if (getPurchaseHistory?.plan != null) {
        if (getPurchaseHistory?.plan == 'premium' && !isValid) {
          // loadScreen(agremment);
          Platform.OS == 'android' && checkCancel();
        } else {
          setTimeout(() => {
            loaded.show();
            //   if (getUpdateAvailable == false) {
            //   }
            //   loadScreen(agremment);
          }, 4000);
        }
      } else {
        setTimeout(() => {
          loaded.show();
          //   if (getUpdateAvailable == false) {
          //   }
          //   loadScreen(agremment);
        }, 4000);
      }
    }
  };

  const getPastWinner = () => {
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.GET_PAST_WINNERS,
      {
        version: VersionNumber.appVersion,
      },
      res => {
        if (res.error) {
        }
        if (res.data) {
          dispatch(setPastWinners(res.data?.data));
        }
      },
    );
  };

  const allWorkoutApi = async () => {
    try {
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);

      payload.append('version', VersionNumber.appVersion);
      const res = await axios({
        url: NewAppapi.ALL_WORKOUTS,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });

      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res?.data) {
        dispatch(setAllWorkoutData(res?.data));
      } else {
        // dispatch(setAllWorkoutData([]));
      }
    } catch (error) {
      console.error(error, 'customWorkoutDataApiError');
      // dispatch(setAllWorkoutData([]));
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

  const getUserAllInData = async () => {
    // const url='https://fitme.cvinfotechserver.com/adserver/public/api/test_all_in_one'
    // try {
    //   const responseData = await axios.get(
    //     `${url}?version=${VersionNumber.appVersion}`,
    //    //${NewAppapi.GET_ALL_IN_ONE}
    //   );
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
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        const objects = {};
        responseData?.data?.data?.forEach(item => {
          objects[item?.type] = item?.image;
        });
        downloadImages(responseData?.data?.custom_dailog_data[0]);
        dispatch(
          setDynamicPopupValues(responseData?.data?.custom_dailog_data[0]),
        );

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      // getAllChallangeAndAllExerciseData();
    }
  };
  // download image

  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };

  const StoringData = {};

  const downloadImages = async data => {
    try {
      const fileName = data?.image?.substring(
        data?.image?.lastIndexOf('/') + 1,
      );
      const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
        fileName,
      )}`;
      const imageExists = await RNFetchBlob.fs.exists(filePath);
      if (imageExists) {
        StoringData['popupImage'] = `file://${filePath}`;
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
        })
          .fetch('GET', data?.image, {
            'Content-Type': 'image/png', // Correct content type for PNG images
            // Add headers or other configurations if required
          })
          .then(res => {
            StoringData['popupImage'] = `file://${res.path()}`;
          })
          .catch(err => {
            console.log(err, 'image Download error');
            dispatch(setDownloadedImage({}));
          });
      }
      dispatch(setDownloadedImage(StoringData));
    } catch (error) {
      console.log('ERRRR', error);
      dispatch(setDownloadedImage({}));
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
        dispatch(setCustomDietData(responseData?.data?.diet_data));
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
        getAllChallangeAndAllExerciseData();
      }
    } catch (error) {
      console.log('GET-USER-DATA splaceScreen', error);

      DisplayAds((response = null));
    }
  };
  const getAllChallangeAndAllExerciseData = async () => {
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/testa_all_user_with_condition';
    try {
      const responseData = await axios.get(
        `${url}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
      );
      if (responseData.data?.msg != 'user id is required') {
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
      }
    } catch (error) {
      console.log('GET-USER-Challange and AllExerciseData DATA', error);
    }
  };
  return (
    <View style={styels.container}>
      <StatusBar backgroundColor="#ec119a" barStyle={'light-content'} />
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#ec119a', 'transparent', 'transparent']}
        style={{
          width: '100%',

          height: '100%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: '100%',
            height: '40%',

            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
          }}>
          <Image
            source={localImage.SplashText}
            style={styels.Textlogo}
            resizeMode="contain"
          />
          {/* <AnimatedLottieView
          source={localImage.Splace3}
          speed={1}
          autoPlay
          loop
          resizeMode="cover"
          style={{
            width: '100%',
            height: DeviceHeigth * 0.45,
            height: DeviceHeigth * 0.4,
            position: 'absolute',
            bottom: 0, // Adjust this value based on the height of the second animation
          }}
        /> */}
        </View>
        <View
          style={{width: '100%', height: '60%', zIndex: 1, overflow: 'hidden'}}>
          <AnimatedLottieView
            source={localImage.Splace1}
            speed={1}
            autoPlay
            loop
            resizeMode="cover"
            style={{
              width: '100%',
              height: DeviceHeigth * 0.45,
              height: DeviceHeigth * 0.4,
              position: 'absolute',
              bottom: 0, // Adjust this value based on the height of the second animation
            }}
          />
          <AnimatedLottieView
            source={localImage.Splace2}
            speed={1}
            autoPlay
            loop
            resizeMode="contain"
            style={{
              width: DeviceWidth,
              height: DeviceHeigth * 0.45,
              position: 'absolute',
              bottom: 0,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
  },
  Textlogo: {
    width: DeviceWidth * 0.6,
  },
});
export default SplaceScreen;
