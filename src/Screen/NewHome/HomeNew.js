import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
  Alert,
  Linking,
  BackHandler,
  ToastAndroid,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import PercentageBar from '../../Component/PercentageBar';
import VersionNumber, {appVersion} from 'react-native-version-number';
import analytics from '@react-native-firebase/analytics';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';
import moment from 'moment';
import {
  Stop,
  Circle,
  Svg,
  Line,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';

import {localImage} from '../../Component/Image';
import {FlatList} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {navigationRef} from '../../../App';
import {showMessage} from 'react-native-flash-message';
import {
  setAllWorkoutData,
  setBanners,
  setChallengesData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setFitmeMealAdsCount,
  setIsAlarmEnabled,
  setPlanType,
  setPurchaseHistory,
  setRewardModal,
  setStepCounterOnOff,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import {BlurView} from '@react-native-community/blur';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from '@miblanchard/react-native-slider';
// import GoogleFit, {Scopes} from 'react-native-google-fit';
import {setPedomterData} from '../../Component/ThemeRedux/Actions';
import AppleHealthKit from 'react-native-health';
import {NativeEventEmitter, NativeModules} from 'react-native';
import GradientButton from '../../Component/GradientButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import RewardModal from '../../Component/Utilities/RewardModal';
import Banners from '../../Component/Utilities/Banner';
import {checkLocationPermission} from '../Terms&Country/LocationPermission';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';
import {handleStart} from '../../Component/Utilities/Bannerfunctions';
import FitCoins from '../../Component/Utilities/FitCoins';
import NameUpdateModal from '../../Component/Utilities/NameUpdateModal';

const GradientText = ({item}) => {
  const gradientColors = ['#D01818', '#941000'];

  return (
    <View
      style={{
        marginTop: Platform.OS == 'android' ? 10 : 0,
        //marginLeft: DeviceWidth * 0.03,
        justifyContent: 'flex-start',

        alignItems: 'flex-start',
        alignSelf: 'center',
      }}>
      <Svg
        height="40"
        style={{padding: 10, width: DeviceWidth * 0.7, borderWidth: 1}}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          // fontFamily="Montserrat-SemiBold"
          lineHeight={20}
          width={50}
          fontWeight={'700'}
          fontSize={20}
          numberOfLines={1}
          fill="url(#grad)"
          x="0"
          y="20">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};
const HomeNew = ({navigation}) => {
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const allWorkoutData = useSelector(state => state.allWorkoutData);
  const getChallengesData = useSelector(state => state.getChallengesData);
  const [progressHight, setProgressHight] = useState('0%');
  const [day, setDay] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [locationP, setLocationP] = useState(false);
  const getPedomterData = useSelector(state => state.getPedomterData);
  const [stepGoalProfile, setStepGoalProfile] = useState(
    getPedomterData[0] ? getPedomterData[0].RSteps : 5000,
  );
  const [DistanceGoalProfile, setDistanceGoalProfile] = useState(
    getPedomterData[1] ? getPedomterData[1].RDistance : 2.5,
  );
  const [CalriesGoalProfile, setCaloriesGoalProfile] = useState(
    getPedomterData[2] ? getPedomterData[2].RCalories : 250,
  );
  const getFitmeMealAdsCount = useSelector(state => state.getFitmeMealAdsCount);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [steps, setSteps] = useState(0);
  const stepsRef = useRef(steps);
  const [Calories, setCalories] = useState(0);
  const caloriesRef = useRef(Calories);
  const [distance, setDistance] = useState(0);
  const [myRankData, setMyRankData] = useState([]);
  const distanceRef = useRef(distance);
  const getRewardModalStatus = useSelector(
    state => state?.getRewardModalStatus,
  );
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const [BannerType1, setBannertype1] = useState('');
  const [Bannertype2, setBannerType2] = useState('');
  const [BannerType, setBannertype] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataType, setDatatype] = useState('');
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  // const [backPressCount, setBackPressCount] = useState(0);
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();

  const colors = [
    {color1: '#E3287A', color2: '#EE7CBA'},
    {color1: '#5A76F4', color2: '#61DFF6'},
    {color1: '#33B6C0', color2: '#9FCCA6'},
    {color1: '#08B9BF', color2: '#07F3E9'},
  ];
  let fitnessInstructor = [
    {
      id: 1,
      title: 'Mary',
      img: require('../../Icon/Images/NewImage2/mary.png'),
      language: Platform.OS == 'android' ? 'hi-IN' : 'el-GR',
      languageId:
        Platform.OS == 'android'
          ? 'hi-in-x-hia-local'
          : 'com-apple.voice.compact.el-GR.Melina',
    },
    {
      id: 2,
      title: 'Arnold',
      img: require('../../Icon/Images/NewImage2/arnold.png'),
      language: Platform.OS == 'android' ? 'en-US' : 'el-GR',
      languageId:
        Platform.OS == 'android'
          ? 'en-us-x-iol-local'
          : 'com-apple.voice.compact.en-IN.Rishi',
    },
    {
      id: 3,
      title: 'Rock',
      img: require('../../Icon/Images/NewImage2/rocky.png'),
      language: Platform.OS == 'android' ? 'en-US' : 'el-GR',
      languageId:
        Platform.OS == 'android'
          ? 'en-us-x-iol-local'
          : 'com-apple.voice.compact.en-IN.Rishi',
    },
    {
      id: 4,
      title: 'Chris',
      img: require('../../Icon/Images/NewImage2/Chris.png'),
      language: Platform.OS == 'android' ? 'en-IN' : 'en-US',
      languageId:
        Platform.OS == 'android'
          ? 'en-in-x-ene-network'
          : 'com-apple.speech.synthesis.voice.Ralph',
    },
    {
      id: 5,
      title: 'Clare',
      img: require('../../Icon/Images/NewImage2/Clare.png'),
      language: Platform.OS == 'android' ? 'en-US' : 'en-Au',
      languageId:
        Platform.OS == 'android'
          ? 'es-us-x-sfb-local'
          : 'com-apple.voice.compact.en-AU.Karen',
    },
  ];
  // banners
  useEffect(() => {
    if (getOfferAgreement?.location == 'India') {
      if (enteredCurrentEvent && enteredUpcomingEvent) {
        // show coin
        setBannertype1('upcoming_challenge');
        setBannerType2('ongoing_challenge');
      } else if (enteredCurrentEvent && !enteredUpcomingEvent) {
        //show coin
        setBannertype1('ongoing_challenge');
        setBannerType2('upcoming_challenge');
      } else if (!enteredCurrentEvent && enteredUpcomingEvent) {
        setBannertype1('joined_challenge');
      } else {
        setBannertype1('new_join');
      }
    } else if (getOfferAgreement?.location != 'India') {
      checkLocationPermission()
        .then(result => {
          if (!getOfferAgreement?.location) {
            setBannertype1('new_join');
          } else if (result == 'granted') {
            setBannertype1('coming_soon');
          } else if (result == 'blocked' || result == 'denied') {
            setBannertype1('new_join');
          }
        })
        .catch(err => {
          setBannertype1('new_join');
        });
    }
  }, []);
  //banner api
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
          objects[item.type] = item.image;
        });
        dispatch(setBanners(objects));
      }
    } catch (error) {
      console.log('BannerApiError', error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      getLeaderboardDataAPI();
      allWorkoutApi();
      initInterstitial();
      ChallengesDataAPI();
      getWorkoutStatus();
      PurchaseDetails();
      setTimeout(() => {
        ActivityPermission();
      }, 2000);
    }
  }, [isFocused]);
  const PurchaseDetails = async () => {
    try {
      setRefresh(true);
      const result = await axios(
        `${NewAppapi.EVENT_SUBSCRIPTION_GET}/${getUserDataDetails?.id}`,
      );
      setRefresh(false);
      if (result.data?.message == 'Not any subscription') {
        dispatch(setPurchaseHistory([]));
      } else {
        dispatch(setPurchaseHistory(result.data.data));
        // dispatch(setEvent(true));
        EnteringEventFunction(
          dispatch,
          result.data?.data,
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
      }
    } catch (error) {
      console.log(error);
      setRefresh(false);
    }
  };
  const checkMealAddCount = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        dispatch(setFitmeMealAdsCount(0));
        return false;
      } else {
        if (getFitmeMealAdsCount < 3) {
          dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
          return false;
        } else {
          dispatch(setFitmeMealAdsCount(0));
          return true;
        }
      }
    } else {
      if (getFitmeMealAdsCount < 3) {
        dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
        return false;
      } else {
        dispatch(setFitmeMealAdsCount(0));
        return true;
      }
    }
  };
  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion +
          '&user_id=' +
          getUserDataDetails?.id,
      });
      if (res.data?.msg != 'version  is required') {
        dispatch(setChallengesData(res.data));
        const challenge = res.data?.filter(item => item?.status == 'active');
        // console.log('challenge', challenge);
        setCurrentChallenge(challenge);
        getCurrentDayAPI(challenge);
      } else {
        dispatch(setChallengesData([]));
      }
    } catch (error) {
      console.error(error, 'ChallengesDataAPI ERRR');
    }
  };
  const getCurrentDayAPI = async challenge => {
    const data = challenge[0];
    try {
      setRefresh(true);
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      payload.append('workout_id', data?.workout_id);
      const res = await axios({
        url: challenge
          ? NewAppapi.CURRENT_CHALLENGE_DAY_EXERCISE_DETAILS
          : NewAppapi.CURRENT_DAY_EXERCISE_DETAILS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.msg != 'No data found') {
        // if(res.data?.user_details)
        const result = analyzeExerciseData(res.data?.user_details);
        setRefresh(false);
        if (result.two.length == 0) {
          let day = parseInt(result.one[result.one.length - 1]);
          for (const item of Object.entries(data?.days)) {
            const index = parseInt(item[0].split('day_')[1]);

            if (item[1]?.total_rest == 0 && index == day + 1) {
              // setSelected(index);
              setDay(index);
              break;
            } else {
              // setSelected(day + 1);
              setDay(day);
              // break;
            }
          }
          const temp2 = res.data?.user_details?.filter(
            item => item?.user_day == result.one[0],
          );

          // setOpen(true);
          // setSelected(parseInt(result.one[result.one.length - 1]));
        } else {
          const temp = res.data?.user_details?.filter(
            item =>
              item?.user_day == result.two[0] &&
              item?.exercise_status == 'undone',
          );
          const temp2 = res.data?.user_details?.filter(
            item => item?.user_day == result.two[0],
          );

          // setTrackerData(temp2);
          // setTotalCount(temp2?.length);
          // setTrainingCount(temp2?.length - temp?.length);
          // setSelected(result.two[0] - 1);
          setDay(result.two[0]);
          // setOpen(true);
        }
      } else {
        setRefresh(false);
        // setSelected(0);
      }
      const percentage = (
        (day / currentChallenge[0]?.total_days) *
        100
      ).toFixed(0);
      setProgressHight(`${percentage}%`);
    } catch (error) {
      console.error(error, 'DAPIERror');
      setRefresh(false);
    }
  };
  function analyzeExerciseData(exerciseData) {
    const daysCompletedAll = new Set();
    const daysPartialCompletion = new Set();

    exerciseData.forEach(entry => {
      const userDay = entry['user_day'];
      const exerciseStatus = entry['exercise_status'];
      if (entry['final_status'] == 'allcompleted')
        daysCompletedAll.add(parseInt(userDay));
      else {
        if (exerciseStatus === 'completed') {
          daysCompletedAll.add(parseInt(userDay));
        } else {
          daysPartialCompletion.add(parseInt(userDay));
        }
      }
    });
    const one = Array.from(daysCompletedAll);
    const two = Array.from(daysPartialCompletion);

    return {one, two};
  }

  const ActivityPermission = async () => {
    if (Platform.OS == 'android') {
    } else if (Platform.OS == 'ios') {
      AppleHealthKit.isAvailable((err, available) => {
        const permissions = {
          permissions: {
            read: [AppleHealthKit.Constants.Permissions.StepCount],
          },
        };
        if (err) {
          console.log('error initializing Healthkit: ', err);
        } else if (available == true) {
          AppleHealthKit.initHealthKit(permissions, error => {
            Promise.resolve(
              AsyncStorage.setItem('hasPermissionForStepCounter', 'true'),
            );
            if (error) {
              console.log('[ERROR] Cannot grant permissions!', error);
            } else {
              new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
                // adding a listner here to record whenever new Steps will be sent from healthkit
                'healthKit:StepCount:new',
                async () => {
                  AppleHealthKit.getStepCount(
                    options,
                    (callbackError, results) => {
                      if (callbackError) {
                        console.log('Error while getting the data');
                      }
                      setSteps(results.value);
                      setDistance(((results.value / 20) * 0.01).toFixed(2));
                      setCalories(((results.value / 20) * 1).toFixed(1));
                    },
                  );
                },
              );
              const options = {
                startDate: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                  0,
                  0,
                  0,
                ),
                endDate: new Date(),
              };
              AppleHealthKit.getStepCount(options, (callbackError, results) => {
                if (callbackError) {
                }
                setSteps(results?.value);
                setDistance(((results?.value / 20) * 0.01).toFixed(2));
                setCalories(((results?.value / 20) * 1).toFixed(1));
              });
            }
          });
        } else {
          Alert.alert(
            'Attention',
            "Health data can't be tracked in this Device due to its specifications",
            {},
          );
        }
      });
    }
  };

  const locationPermission = () => {
    Platform.OS == 'ios'
      ? request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          if (result === RESULTS.GRANTED) {
            console.log('Location permission granted IOS');
            setLocationP(false);
            analytics().logEvent(`CV_FITME_CLICKED_ON_GYM_LISTING_SCREEN`);
            let checkAdsShow = checkMealAddCount();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigationRef.navigate('GymListing');
            } else {
              navigationRef.navigate('GymListing');
            }
            // getCurrentLocation();
          } else {
            setLocationP(true);
            console.log('Location permission denied IOS', result);
          }
        })
      : requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]).then(async result => {
          if (result['android.permission.ACCESS_FINE_LOCATION'] == 'granted') {
            console.log('Location permission granted Android');
            analytics().logEvent(`CV_FITME_CLICKED_ON_GYM_LISTING_SCREEN`);
            setLocationP(false);
            let checkAdsShow = checkMealAddCount();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigationRef.navigate('GymListing');
            } else {
              navigationRef.navigate('GymListing');
            }
            // getCurrentLocation();
          } else {
            setLocationP(true);
            console.log('Location permission denied Android');
          }
        });
  };
  const PermissionModal = ({locationP, setLocationP}) => {
    return (
      <Modal
        visible={locationP}
        onRequestClose={() => setLocationP(false)}
        transparent>
        <View style={styles.modalContainer}>
          <View
            style={{
              height: DeviceWidth,
              width: DeviceWidth * 0.8,
              backgroundColor: AppColor.WHITE,
              borderRadius: 10,
              padding: 10,
              alignItems: 'center',
              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}>
            <Text
              style={{
                fontSize: 20,
                color: AppColor.LITELTEXTCOLOR,
                fontWeight: '700',
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                lineHeight: 30,
                marginTop: DeviceWidth * 0.05,
              }}>
              Enable Your Location
            </Text>
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage2/Location.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.15,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: AppColor.HEADERTEXTCOLOR,
                fontWeight: '600',
                fontFamily: Fonts.MONTSERRAT_REGULAR,
                lineHeight: 20,
                textAlign: 'center',
                marginHorizontal: DeviceWidth * 0.1,
              }}>
              Please allow us to access your location services
            </Text>
            <GradientButton
              text="Enable Location Services"
              onPress={() => {
                Linking.openSettings().finally(() => {
                  setLocationP(false);
                  locationP();
                });
              }}
              // flex={0.3}
              w={DeviceWidth * 0.7}
              mB={-DeviceWidth * 0.1}
              alignSelf
            />
            <GradientButton
              text="Do Not Allow"
              flex={0}
              w={DeviceWidth * 0.7}
              alignSelf
              onPress={() => setLocationP(false)}
              colors={['#ADA4A5', '#ADA4A5']}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const getWorkoutStatus = async () => {
    try {
      const exerciseStatus = await axios.get(
        `${NewAppapi.USER_EXERCISE_COMPLETE_STATUS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}`,
      );

      if (
        exerciseStatus?.data.msg ==
        'Please update the app to the latest version'
      ) {
      } else if (exerciseStatus?.data.length > 0) {
        dispatch(setWorkoutTimeCal(exerciseStatus?.data));
      } else {
        dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('Workout-Status', error);
    }
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
        setRefresh(false);
      } else if (res?.data) {
        setRefresh(false);
        dispatch(setAllWorkoutData(res?.data));
      } else {
        setRefresh(false);
        dispatch(setAllWorkoutData([]));
      }
    } catch (error) {
      setRefresh(false);
      console.error(error, 'customWorkoutDataApiError');
      dispatch(setAllWorkoutData([]));
    }
  };
  const getTimeOfDayMessage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };
  const ListItem = React.memo(({title, color}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        AnalyticsConsole(`MediDetails`);
        let checkAdsShow = checkMealAddCount();
        if (checkAdsShow == true) {
          showInterstitialAd();
          navigation.navigate('MeditationDetails', {item: title});
        } else {
          navigation.navigate('MeditationDetails', {item: title});
        }
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <LinearGradient
          start={{x: 0, y: 2}}
          end={{x: 1, y: 0}}
          colors={[color.color1, color.color2]}
          style={styles.listItem}>
          <Image
            source={
              title.workout_mindset_image_link != null
                ? {uri: title.workout_mindset_image_link}
                : localImage.Noimage
            }
            style={[
              styles.img,
              {
                height: 60,
                width: 60,
                alignSelf: 'center',
              },
            ]}
            resizeMode="contain"></Image>
        </LinearGradient>
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,

              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              fontWeight: '500',
              lineHeight: 15,
              color: AppColor.SUBHEADING,
            }}>
            {title?.workout_mindset_title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ));
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.3,
            height: DeviceHeigth * 0.15,
          }}
        />
      </View>
    );
  };
  const MyStoreItem = React.memo(({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.listItem2]}
          onPress={() => {
            AnalyticsConsole(`AI_TRAINER_BUTTON`);
            let checkAdsShow = checkMealAddCount();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigation.navigate('AITrainer', {item: item});
            } else {
              navigation.navigate('AITrainer', {item: item});
            }
          }}>
          <Image
            source={item?.img}
            style={[
              styles.img,
              {
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              },
            ]}
            resizeMode="cover"></Image>

          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                fontSize: 13,
                fontWeight: '600',
                lineHeight: 20,
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                width: 100,
                color: '#505050',
              },
            ]}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      </>
    );
  });

  const handleLongPress = () => {
    analytics().logEvent('CV_FITME_CLICKED_ON_PEDOMETER');
    setModalVisible(true); // Show the modal when long-press is detected
  };
  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };
  const SliderView = ({
    Visiblity,
    txt,
    Value,
    Value1,
    handleChange,
    ToggleState,
    ImgSource,
    MinimumValue,
    MaximumValue,
  }) => {
    const thumbStyle = {
      width: 35,
      height: 35,
      backgroundColor: AppColor.WHITE,
      borderRadius: 35 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: AppColor.BLACK,
          shadowOpacity: 0.5,
          shadowOffset: {width: 5, height: 0},
        },
        android: {
          elevation: 5,
        },
      }),
    };
    const ToggleVisiblity = () => {
      ToggleState(prev => !prev);
    };
    const ThumbImage = ({param}) => {
      return (
        <View style={thumbStyle}>
          <Image
            source={ImgSource}
            style={{width: 20, height: 20}}
            resizeMode="contain"
            tintColor={param == 'Steps' ? '#5FB67B' : null}
          />
        </View>
      );
    };
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={ImgSource}
              style={{width: 30, height: 30}}
              tintColor={txt == 'Steps' ? '#5FB67B' : null}
              resizeMode="contain"
            />
            <Text style={styles.txt5}>
              {txt == 'Steps'
                ? 'Steps'
                : txt == 'Distance'
                ? 'Distance'
                : txt == 'Calories'
                ? 'Calories'
                : ''}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                {
                  color: AppColor.BoldText,
                  marginLeft: 10,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                },
              ]}>
              {Value1}
            </Text>
            <TouchableOpacity
              style={styles.dropButton}
              onPress={() => ToggleVisiblity(txt)}>
              <Icons
                name={Visiblity ? 'chevron-up' : 'chevron-down'}
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 5}}>
          {
            // Step_Visible
            Visiblity ? (
              <Slider
                value={Value}
                maximumValue={MaximumValue}
                minimumValue={MinimumValue}
                step={1}
                onValueChange={handleChange}
                minimumTrackTintColor="#5FB67B"
                renderThumbComponent={() => <ThumbImage param={txt} />}
                trackStyle={{height: 10, borderRadius: 20}}
              />
            ) : null
          }
        </View>
      </>
    );
  };
  const UpdateGoalModal = () => {
    const [Steps_Goal, setSteps_Goal] = useState(
      getPedomterData[0] ? getPedomterData[0].RSteps : 500,
    );
    const [Calories_Goal, setCalories_Goal] = useState(
      getPedomterData[2] ? getPedomterData[2].RCalories : 25,
    );
    const [Distance_Goal, setDistance_Goal] = useState(
      getPedomterData[1] ? getPedomterData[1].RDistance : 0.25,
    );
    const [Step_Visible, setSteps_Visible] = useState(true);
    const [Distance_Visible, setDistance_Visible] = useState(false);
    const [Calories_Visible, setCalories_Visible] = useState(false);

    const HandleSave = () => {
      setStepGoalProfile(Steps_Goal);
      setDistanceGoalProfile(Distance_Goal);
      setCaloriesGoalProfile(Calories_Goal);
      dispatch(
        setPedomterData([
          {RSteps: Steps_Goal},
          {RDistance: Distance_Goal},
          {RCalories: Calories_Goal},
        ]),
      );
      closeModal();
    };
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={[styles.modalContent, {backgroundColor: AppColor.BACKGROUNG}]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={localImage.Target}
                style={{width: DeviceWidth * 0.07, height: DeviceHeigth * 0.03}}
                resizeMode="contain"
              />
              <Text
                style={[styles.title, {color: AppColor.BLACK, marginLeft: 10}]}>
                Set Goals
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.dropButton}>
              <Icons name={'close'} size={15} color={'#000'} />
            </TouchableOpacity>
          </View>
          <SliderView
            txt={'Steps'}
            Visiblity={Step_Visible}
            Value={Steps_Goal}
            handleChange={value => {
              setSteps_Goal(value);
              setCalories_Goal((value * 0.05).toFixed(2));
              setDistance_Goal((value * 0.0005).toFixed(2));
            }}
            Value1={`${Steps_Goal} Steps`}
            ToggleState={setSteps_Visible}
            ImgSource={localImage.Step3}
            MinimumValue={500}
            MaximumValue={10000}
          />
          <SliderView
            txt={'Distance'}
            Visiblity={Distance_Visible}
            Value={Distance_Goal}
            handleChange={value => {
              setDistance_Goal(value);
              setSteps_Goal((value * 2000).toFixed(0));
              setCalories_Goal((value * 100).toFixed(2));
            }}
            Value1={`${Distance_Goal} Km`}
            ToggleState={setDistance_Visible}
            ImgSource={localImage.Step2}
            MinimumValue={0.25}
            MaximumValue={5}
          />
          <SliderView
            txt={'Calories'}
            Visiblity={Calories_Visible}
            Value={Calories_Goal}
            handleChange={value => {
              setCalories_Goal(value);
              setDistance_Goal((value * 0.01).toFixed(2));
              setSteps_Goal(value * 20);
            }}
            Value1={`${Calories_Goal} Kcal`}
            ToggleState={setCalories_Visible}
            ImgSource={localImage.Step1}
            MinimumValue={25}
            MaximumValue={500}
          />
          <TouchableOpacity
            style={styles.Modal_Save_btton}
            activeOpacity={0.5}
            onPress={() => {
              // AnimationRef.current && AnimationRef?.current.reAnimate();

              HandleSave();
            }}>
            <LinearGradient
              colors={[AppColor.RED1, AppColor.RED1, AppColor.RED]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.04,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.title, {color: AppColor.WHITE}]}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  const getPercent = (currentData, totalData) => {
    let colorPercent = (currentData * 100) / totalData;
    // let colorPercent = 30;
    return colorPercent;
  };

  const getLeaderboardDataAPI = async () => {
    try {
      const result = await axios({
        // url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${appVersion}`,
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=1.18`,
      });
      if (result.data) {
        const myRank = result.data?.data?.findIndex(
          item => item?.id == getUserDataDetails?.id,
        );
        setMyRankData(result.data?.data[myRank]);
        // console.log('RANK DATA', myRankData);
      }
      setRefresh(false);
    } catch (error) {
      console.log(error);
      setRefresh(false);
    }
  };
  useEffect(() => {
    console.log(getUserDataDetails)
    if (getUserDataDetails.name == null && getUserDataDetails.email == null) {
      setOpenEditModal(true);
      setDatatype('both');
    } else {
      if (getUserDataDetails.name == null) {
        setOpenEditModal(true);
        setDatatype('name');
      }
      if (getUserDataDetails.email == null) {
        setOpenEditModal(true);
        setDatatype('email');
      }
    }
  }, [openEditModal, dataType]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <NameUpdateModal
        dataType={dataType}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        user_id={getUserDataDetails?.id}
      />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: DeviceHeigth * 0.1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              ChallengesDataAPI();
              bannerApi();
              getLeaderboardDataAPI();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={styles.container}
        nestedScrollEnabled>
        <View style={styles.profileView}>
          {/* <GradientText
            item={
              getTimeOfDayMessage() +
              ', ' +
              (Object.keys(getUserDataDetails).length > 0
                ? getUserDataDetails.name == null
                  ? 'Guest'
                  : getUserDataDetails.name.split(' ')[0]
                : 'Guest')
            }
          /> */}
          <Text
            style={{
              color: AppColor.RED,
              fontSize: 20,
              fontFamily: Fonts.MONTSERRAT_BOLD,
            }}>
            {getTimeOfDayMessage() +
              ', ' +
              (Object.keys(getUserDataDetails).length > 0
                ? getUserDataDetails.name == null
                  ? 'Guest'
                  : getUserDataDetails.name.split(' ')[0]
                : 'Guest')}
          </Text>
          {enteredCurrentEvent && (
            <FitCoins
              onPress={() => {
                AnalyticsConsole('LB')
                const today = moment().day();
                if (today == 0 || today == 6) {
                  navigation.navigate('Winner');
                } else {
                  navigation.navigate('Leaderboard');
                }
              }}
              coins={myRankData?.fit_coins}
            />
          )}
        </View>
        <Banners
          type1={BannerType1}
          type2={Bannertype2}
          navigation={navigation}
        />
        {currentChallenge?.length > 0 && (
          <View style={{width: '95%', alignSelf: 'center', marginVertical: 10}}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 21,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Challenge Zone
            </Text>

            <View
              style={{
                width: '100%',
                marginVertical: 15,
                flexDirection: 'row',
                borderRadius: 16,
                borderWidth: 1,
                alignSelf: 'center',
                backgroundColor: AppColor.WHITE,
                shadowColor: 'grey',
                ...Platform.select({
                  ios: {
                    //shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
                borderColor: '#D9D9D9',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '90%',
                  alignItems: 'center',
                  top: 0,
                }}>
                <View
                  style={{
                    width: 90,
                    height: 100,
                    // borderRadius: 10,
                    // borderWidth: 1,
                    //  borderColor: '#D9D9D9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 11,
                    marginVertical: 10,
                  }}>
                  <Image
                    source={{uri: currentChallenge[0]?.workout_image}}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 10,
                    }}
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: DeviceHeigth >= 1024 ? '97%' : '82%',
                    alignSelf: 'center',
                    top: 15,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      fontSize: 14,
                      fontWeight: '600',
                      lineHeight: 18,
                      //marginHorizontal: 5,
                      color: AppColor.HEADERTEXTCOLOR,
                    }}>
                    {currentChallenge[0]?.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      fontSize: 14,
                      fontWeight: '600',
                      lineHeight: 20,
                      // marginHorizontal: 5,
                      top: 5,
                      color: AppColor.HEADERTEXTCOLOR,
                    }}>
                    {currentChallenge[0]?.sub_title}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      top: 10,
                      marginRight:
                        DeviceHeigth >= 1024
                          ? DeviceWidth * 0.03
                          : DeviceWidth * 0.085,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        fontSize: 12,
                        fontWeight: '600',
                        lineHeight: 20,
                        color: AppColor.SUBHEADING,
                      }}>
                      {`${day}/${currentChallenge[0]?.total_days} Days`}
                    </Text>
                  </View>

                  <PercentageBar
                    height={20}
                    percentage={(
                      (day / currentChallenge[0]?.total_days) *
                      100
                    ).toFixed(0)}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  AnalyticsConsole(`D_Wrk_DAYS_BUTTON_FR_Home`);
                  navigation.navigate('WorkoutDays', {
                    data: currentChallenge[0],
                    challenge: true,
                  });
                }}
                style={{width: '10%', alignItems: 'center', top: 20}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/play.png')}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 20,
                    //alignContent: 'flex-end',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {Platform.OS == 'ios' && (
          <>
            <View style={{width: '95%', alignSelf: 'center'}}>
              <Text
                style={{
                  color: AppColor.HEADERTEXTCOLOR,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                  fontWeight: '600',
                  lineHeight: 19,
                  fontSize: 18,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                Health Overview
              </Text>
            </View>
            <View style={{width: '95%', alignSelf: 'center'}}>
              <View style={styles.CardBox}>
                <TouchableOpacity
                  onPress={handleLongPress}
                  activeOpacity={0.5}
                  style={{
                    width: 20,
                    height: 20,
                    right: -5,
                    top: -10,
                    margin: 10,
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <Image
                    source={require('../../Icon/Images/NewImage/editpen.png')}
                    style={[
                      styles.img,
                      {
                        height: 20,
                        width: 20,
                      },
                    ]}
                    resizeMode="contain"></Image>
                </TouchableOpacity>

                <View
                  style={{
                    width: '100%',
                    padding: 10,

                    marginTop: -40,
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <View style={styles.circle}>
                      <LinearGradient
                        style={[
                          styles.circleFill,
                          {
                            height: getPercent(
                              Platform.OS == 'ios' ? steps : stepsRef.current,
                              stepGoalProfile,
                            ),
                          },
                        ]}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        colors={['#5FB67B', '#00B53A']}
                      />
                      <Image
                        source={localImage.Step3}
                        style={[
                          styles.img,
                          {
                            height: 40,
                            width: 30,
                          },
                        ]}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={{marginVertical: 10}}>
                      <Text
                        style={[
                          styles.monetText,
                          {
                            color: '#5FB67B',
                            fontSize: 12,
                            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                          },
                        ]}>
                        {Platform.OS == 'ios' ? steps : stepsRef.current}
                        <Text
                          style={[
                            styles.monetText,
                            {
                              color: '#505050',
                              fontSize: 10,
                              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                            },
                          ]}>
                          {`/${stepGoalProfile}`}
                        </Text>
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.monetText2}>Steps</Text>
                    </View>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <View style={styles.circle}>
                      <LinearGradient
                        style={[
                          styles.circleFill,
                          {
                            height: getPercent(
                              Platform.OS == 'ios'
                                ? distance
                                : distanceRef.current,
                              DistanceGoalProfile,
                            ),
                          },
                        ]}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        colors={['#FFBA12', '#F1AC02']}
                      />
                      <Image
                        source={require('../../Icon/Images/NewImage2/Point.png')}
                        style={[
                          styles.img,
                          {
                            height: 35,
                            width: 30,
                          },
                        ]}
                        resizeMode="contain"></Image>
                    </View>
                    <View style={{marginVertical: 10}}>
                      <Text
                        style={[
                          styles.monetText,
                          {
                            color: '#FCBB1D',
                            fontSize: 12,
                            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                          },
                        ]}>
                        {Platform.OS == 'ios' ? distance : distanceRef.current}
                        <Text
                          style={[
                            styles.monetText,
                            {
                              color: '#505050',
                              fontSize: 10,
                              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                            },
                          ]}>
                          {`/${DistanceGoalProfile} km `}
                        </Text>
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.monetText2}>Distance</Text>
                    </View>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <View style={styles.circle}>
                      <LinearGradient
                        style={[
                          styles.circleFill,
                          {
                            height: getPercent(
                              Platform.OS == 'ios'
                                ? Calories
                                : caloriesRef.current,
                              CalriesGoalProfile,
                            ),
                          },
                        ]}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        colors={['#941000', '#D5191A']}
                      />
                      <Image
                        source={localImage.Step1}
                        style={[
                          styles.img,
                          {
                            height: 35,
                            width: 30,
                          },
                        ]}
                        resizeMode="contain"></Image>
                    </View>
                    <View style={{marginVertical: 10}}>
                      <Text
                        style={[
                          styles.monetText,
                          {
                            color: '#D01818',
                            fontSize: 12,
                            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                          },
                        ]}>
                        {Platform.OS == 'ios' ? Calories : caloriesRef.current}
                        <Text
                          style={[
                            styles.monetText,
                            {
                              color: '#505050',
                              fontSize: 10,
                              fontFamily: Fonts.MONTSERRAT_MEDIUM,
                            },
                          ]}>
                          {`/${CalriesGoalProfile} Kcal`}
                        </Text>
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.monetText2}>Calories</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        <>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              top: 5,
              marginVertical: Platform.OS == 'ios' ? DeviceHeigth * 0.06 : 0,
            }}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontWeight: '600',
                lineHeight: 21,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Custom Made
            </Text>
          </View>

          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#379CBE', '#81CAF1', '#81CAF1']}
            style={{
              width: '95%',
              borderRadius: 20,
              marginVertical:
                Platform.OS == 'android'
                  ? DeviceHeigth * 0.02
                  : -DeviceHeigth * 0.035,
              paddingVertical: 15,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                AnalyticsConsole(`CustomWrk_FR_Home`);
                let checkAdsShow = checkMealAddCount();
                if (checkAdsShow == true) {
                  showInterstitialAd();
                  navigation.navigate('CustomWorkout');
                } else {
                  navigation.navigate('CustomWorkout');
                }
              }}
              style={
                {
                  //  backgroundColor: AppColor.WHITE,
                }
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginHorizontal:
                      Platform.OS == 'android'
                        ? DeviceWidth * 0.03
                        : DeviceHeigth >= 1024
                        ? DeviceWidth * 0.03
                        : DeviceWidth * 0.02,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: AppColor.WHITE,
                      lineHeight: 30,
                      fontWeight: '600',
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    }}>
                    Your workouts
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: AppColor.WHITE,

                      fontWeight: '500',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    }}>{`Create your custom plans`}</Text>
                </View>
                <Image
                  source={localImage.NewWorkout}
                  style={{
                    width: DeviceWidth * 0.3,
                    height: 70,
                    //backgroundColor: 'red',
                  }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            marginVertical:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.025
                : DeviceHeigth * 0.075,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Meditation
          </Text>

          {allWorkoutData?.mindset_workout_data?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                analytics().logEvent('CV_FITME_CLICKED_ON_MEDITATION');
                let checkAdsShow = checkMealAddCount();
                if (checkAdsShow == true) {
                  showInterstitialAd();
                  navigation.navigate('MeditationDetails', {
                    item: allWorkoutData?.mindset_workout_data[0],
                  });
                } else {
                  navigation.navigate('MeditationDetails', {
                    item: allWorkoutData?.mindset_workout_data[0],
                  });
                }
              }}>
              <Text
                style={{
                  color: AppColor.BoldText,
                  fontFamily: 'Montserrat-SemiBold',
                  fontWeight: '600',
                  color: AppColor.RED1,
                  fontSize: 12,
                  lineHeight: 14,
                }}>
                View All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.meditionBox,
            {
              marginVertical:
                Platform.OS == 'ios'
                  ? -DeviceHeigth * 0.05
                  : DeviceHeigth * 0.0,
            },
          ]}>
          {allWorkoutData?.mindset_workout_data?.length > 0 ? (
            <FlatList
              data={allWorkoutData?.mindset_workout_data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={emptyComponent}
              renderItem={({item, index}) => {
                return (
                  <ListItem
                    title={item}
                    color={colors[index % colors.length]}
                  />
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
            />
          ) : (
            <View>
              <AnimatedLottieView
                source={require('../../Icon/Images/NewImage2/Adloader.json')}
                speed={2}
                autoPlay
                loop
                resizeMode="contain"
                style={{
                  width: DeviceWidth * 0.5,

                  height: DeviceHeigth * 0.1,
                }}
              />
            </View>
          )}
        </View>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            top:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.03
                : DeviceHeigth * 0.07,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Nearby Gyms
          </Text>
        </View>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#142D91', '#142D91', '#27A4C2']}
          style={{
            width: '95%',
            alignSelf: 'center',
            borderRadius: 20,
            marginVertical:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.055
                : DeviceHeigth * 0.095,

            paddingVertical: 15,
            opacity: 0.8,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={locationPermission}
            style={
              {
                //  backgroundColor: AppColor.WHITE,
              }
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  marginHorizontal:
                    Platform.OS == 'android'
                      ? DeviceWidth * 0.03
                      : DeviceHeigth >= 1024
                      ? DeviceWidth * 0.03
                      : DeviceWidth * 0.02,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: AppColor.WHITE,
                    lineHeight: 30,
                    fontWeight: '600',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  Nearby Gyms
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: AppColor.WHITE,

                    fontWeight: '500',
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  }}>{`Gyms near your location`}</Text>
              </View>
              <Image
                source={localImage.Gym}
                style={{
                  width: DeviceWidth * 0.3,
                  height: 70,
                  //backgroundColor: 'red',
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical:
              Platform.OS == 'android'
                ? -DeviceHeigth * 0.01
                : -DeviceHeigth * 0.055,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Fitness Instructor
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: 'white',
            top:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.03
                : DeviceHeigth * 0.06,
            alignItems: 'center',
          }}>
          <FlatList
            data={fitnessInstructor}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            renderItem={({item, index}) => (
              <MyStoreItem item={item} index={index} />
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            top:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.04
                : DeviceHeigth * 0.065,
          }}>
          <Text
            style={{
              color: AppColor.HEADERTEXTCOLOR,
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontWeight: '600',
              lineHeight: 21,
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            Discover More
          </Text>
        </View>
        <View
          style={{
            width: '95%',
            //padding: 10,
            top:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.06
                : DeviceHeigth * 0.08,
            alignSelf: 'center',
            flexDirection: 'row',

            justifyContent: 'space-between',
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0.5}}
            colors={['#2B4E9F', '#0A94F3']}
            style={{
              width: '47%',
              height: DeviceHeigth * 0.15,
              padding: 10,
              borderRadius: 16,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                AnalyticsConsole(`MEALS_BUTTON`);
                let checkAdsShow = checkMealAddCount();
                if (checkAdsShow == true) {
                  showInterstitialAd();
                  navigation.navigate('Meals');
                } else {
                  navigation.navigate('Meals');
                }
              }}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{zIndex: 1}}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '700',
                    lineHeight: 25,
                    fontSize: 15,
                  }}>
                  Diet
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '500',
                    lineHeight: 15,
                    fontSize: 12,
                  }}>
                  {'Achieve your goals faster with a balanced diet.'}
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/diet.png')}
                  resizeMode="contain"
                  style={{
                    width: DeviceHeigth >= 1024 ? 100 : 60,
                    height: DeviceHeigth >= 1024 ? 250 : DeviceHeigth * 0.07,
                    right: DeviceHeigth >= 1024 ? 0 : DeviceHeigth * 0.04,
                    top: DeviceHeigth >= 1024 ? -40 : DeviceHeigth * 0.065,
                  }}
                />
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            start={{x: 1.2, y: 0}}
            end={{x: 0, y: 0}}
            colors={['#8172F3', '#6BD7E3']}
            style={{
              width: '47%',
              height: DeviceHeigth * 0.15,
              padding: 10,
              borderRadius: 16,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                AnalyticsConsole(`STORE_BUTTON`);
                let checkAdsShow = checkMealAddCount();
                if (checkAdsShow == true) {
                  showInterstitialAd();
                  navigation.navigate('Store');
                } else {
                  navigation.navigate('Store');
                }
              }}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '700',
                    lineHeight: 25,
                    fontSize: 15,
                  }}>
                  Store
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '500',
                    lineHeight: 15,
                    fontSize: 12,
                  }}>
                  {'Shop top-notch fitness products.'}
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/store.png')}
                  resizeMode="contain"
                  style={{
                    width: DeviceHeigth >= 1024 ? 100 : 70,
                    height: DeviceHeigth >= 1024 ? 250 : 80,
                    right: DeviceHeigth >= 1024 ? 0 : 60,
                    top: DeviceHeigth >= 1024 ? -10 : 50,
                  }}
                />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
      {modalVisible ? <UpdateGoalModal /> : null}
      <PermissionModal locationP={locationP} setLocationP={setLocationP} />
      <RewardModal visible={getRewardModalStatus} navigation={navigation} />
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColor.WHITE,
  },
  profileView: {
    alignSelf: 'center',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DeviceWidth * 0.95,
  },
  monetText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 10,
  },
  monetText2: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    marginLeft: 10,
    color: AppColor.SUBHEADING,
  },
  CardBox: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: DeviceHeigth * 0.025,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  meditionBox: {
    width: '100%',
    alignSelf: 'center',
    // backgroundColor: 'white',

    alignItems: 'center',
  },
  listItem: {
    width: 70,
    height: 70,

    borderRadius: 70 / 2,

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      android: {
        elevation: 2,
      },
    }),
  },
  img: {
    height: 60,
    width: 60,

    borderRadius: 120 / 2,
  },
  listItem2: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
    marginBottom: 30,

    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#D9D9D9',
  },
  circleFill: {
    backgroundColor: 'orange',
    width: '100%',
    bottom: 0,
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.95,

    position: 'absolute',
    top: DeviceHeigth / 6,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {height: 5, width: 0},
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    fontFamily: 'Montserrat',
  },
  dropButton: {
    backgroundColor: AppColor.WHITE,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {height: 5, width: 0},
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  Modal_Save_btton: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.04,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 8,
  },
});
export default HomeNew;
