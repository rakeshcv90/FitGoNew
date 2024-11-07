import {
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  View,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {MyInterstitialAd, OpenAppAds} from '../Component/BannerAdd';
import {
  permissionMethods,
  trueCondition,
  UIArray,
} from '../Component/Permissions/PermissionMethods';
import {RESULTS} from 'react-native-permissions';
import {AuthorizationStatus} from '@notifee/react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const products = Platform.select({
  ios: ['fitme_noob', 'fitme_pro', 'fitme_legend'],
  android: ['fitme_monthly', 'a_monthly', 'fitme_legend'],
});

const SplaceScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const showIntro = useSelector(state => state.showIntro);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const planType = useSelector(state => state.planType);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [loaded, setLoaded] = useState(false);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const getDeviceID = useSelector(state => state?.getDeviceID);
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const {initOpenApp, showOpenAppAd} = OpenAppAds();
  const circleRef = useSharedValue(1);
  const logoRef = useSharedValue(0);
  const logoLeftRef = useSharedValue(0);
  const logoOpacityRef = useSharedValue(0);
  const textWidthRef = useSharedValue(0);
  const textOpacityRef = useSharedValue(0);

  useEffect(() => {
    if (PLATFORM_IOS) {
      if (getUserDataDetails && getUserDataDetails.social_id != null) {
        if (ADS_IOS.includes(getUserDataDetails.social_id)) {
          callAds(true);
        } else {
          callAds(false);
        }
      } else {
        // callAds(__DEV__ ? true : false); // load live ad if null
        callAds(false); // load live ad if null
      }
    } else {
      // For non-iOS platforms, fetch the unique ID
      DeviceInfo.syncUniqueId().then(uniqueId => {
        dispatch(setDeviceID(uniqueId));
        if (ADS_IDs.includes(uniqueId)) {
          callAds(true);
        } else {
          // callAds(__DEV__ ? true : false);
          callAds(false)
        }
      });
    }
  }, []);
  // function to call ads
  const callAds = condition => {
    initInterstitial(condition);
    initOpenApp(condition).then(() => {
      showOpenAppAd().then(() => {
        afterAdFunction();
      });
    });
  };

  const afterAdFunction = () => {
    requestPermissionforNotification(dispatch);
    getUserAllInData();
    getPlanData();
    allWorkoutApi();
    getPastWinner();
    dispatch(setPopUpSeen(false));
    dispatch(setFitmeAdsCount(0));
  };
  const isObject = result => {
    return !!(typeof result === 'object' && result != null);
  };
  const checkPermissions = () => {
    Promise.all(
      UIArray.map(item => {
        if (permissionMethods[item.checkPermission]) {
          return permissionMethods[item.checkPermission]().then(res => ({
            key: item.key,
            result: res,
          }));
        }
        return Promise.resolve({key: item.key, result: null});
      }),
    ).then(results => {
      const condition = results.some(result => {
        return (
          result?.result == RESULTS.DENIED ||
          result.result == RESULTS.BLOCKED ||
          (isObject(result?.result) &&
            result?.result['android.permission.ACCESS_FINE_LOCATION'] ==
              RESULTS.BLOCKED) ||
          (isObject(result?.result) &&
            result?.result['android.permission.ACCESS_FINE_LOCATION'] ==
              RESULTS.DENIED) ||
          (isObject(result?.result) &&
            result?.result['authorizationStatus'] ===
              AuthorizationStatus.DENIED)
        );
      });
      if (condition) {
        navigation.navigate('PermissionScreen');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BottomTab'}],
          }),
        );
      }
    });
  };
  useEffect(() => {
    if (
      getUserDataDetails?.length > 0 ||
      Object.keys(getUserDataDetails)?.length > 0
    ) {
      getUserDetailData(getUserDataDetails?.id);
    }
  }, []);
  const loadScreen = condition => {
    if (showIntro) {
      if (getUserDataDetails?.id) {
        if (getUserDataDetails?.profile_compl_status == 1) {
          if (getOfferAgreement?.term_condition == 'Accepted') {
            checkPermissions();
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

  const getPastWinner = () => {
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.GET_PAST_WINNERS,
      {
        version: VersionNumber.appVersion,
      },
      res => {
        if (res?.error) {
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
        loadScreen();
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      loadScreen();
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

  useEffect(() => {
    logoOpacityRef.value = withTiming(1, {duration: 800});
    circleRef.value = withTiming(0, {duration: 1000});
    logoRef.value = withTiming(
      -150,
      {easing: Easing.out(Easing.cubic), duration: 1000},
      () =>
        (logoRef.value = withSpring(
          0,
          {stiffness: 150},
          () =>
            (logoLeftRef.value = withTiming(-50, {duration: 1000}, () => {
              textWidthRef.value = withTiming(DeviceWidth, {
                duration: 2000,
              });
              textOpacityRef.value = 1;
              //  withTiming(1, {
              //   duration: 3000,
              // });
            })),
        )),
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{scale: circleRef.value}],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{translateY: logoRef.value}, {translateX: logoLeftRef.value}],
    opacity: logoOpacityRef.value,
  }));
  const textViewStyle = useAnimatedStyle(() => ({
    transform: [{translateX: textWidthRef.value}],
    // width: textWidthRef.value,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacityRef.value,
  }));

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  return (
    <ImageBackground
      source={localImage.BGSplash}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      imageStyle={styles.container}>
      <StatusBar backgroundColor="white" barStyle={'light-content'} />
      <View style={styles.main}>
        <AnimatedImage
          source={localImage.CircleSplash}
          style={[styles.circle, circleStyle]}
          resizeMode={'contain'}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AnimatedImage
            source={localImage.LogoSplash}
            style={[styles.logo, logoStyle]}
            resizeMode={'contain'}
          />
          <Animated.View
            style={[
              styles.textView,
              textStyle,
              {
                // backgroundColor: 'white',
              },
            ]}>
            <Animated.View
              style={[
                textViewStyle,
                styles.textView,
                {
                  backgroundColor: 'white',
                  zIndex: 1,
                },
              ]}
            />
            <AnimatedImage
              source={localImage.SplashText}
              style={[styles.text, textStyle]}
              resizeMode={'contain'}
            />
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.6,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: DeviceWidth * 0.6,
    height: 100,
    // backgroundColor: 'red',
  },
  circle: {
    width: DeviceWidth / 2,
    height: 40,
    position: 'absolute',
  },
  logo: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  text: {
    height: 80,
    width: DeviceWidth / 4,
    zIndex: -1,
  },
  textView: {
    position: 'absolute',
    width: DeviceWidth / 4,
    left: -5,
    height: 80,
  },
});
export default SplaceScreen;
