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
import {useIsFocused} from '@react-navigation/native';
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
  setChallengesData,
  setIsAlarmEnabled,
  setStepCounterOnOff,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import {BlurView} from '@react-native-community/blur';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from '@miblanchard/react-native-slider';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {setPedomterData} from '../../Component/ThemeRedux/Actions';
import {AlarmNotification} from '../../Component/Reminder';
import notifee from '@notifee/react-native';
import AppleHealthKit from 'react-native-health';
import {NativeEventEmitter, NativeModules} from 'react-native';
import GradientButton from '../../Component/GradientButton';

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
      <Svg height="40" width={DeviceWidth * 0.9}>
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
  const getUserID = useSelector(state => state.getUserID);
  const getStoreData = useSelector(state => state.getStoreData);
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
  const [steps, setSteps] = useState(0);
  const stepsRef = useRef(steps);
  const [Calories, setCalories] = useState(0);
  const caloriesRef = useRef(Calories);
  const [distance, setDistance] = useState(0);
  const distanceRef = useRef(distance);
  const isAlarmEnabled = useSelector(state => state.isAlarmEnabled);
  const getCustttomeTimeCal = useSelector(state => state.getCustttomeTimeCal);
  const getStepCounterOnoff = useSelector(state => state.getStepCounterOnoff);
  const [PaddoModalShow, setPaddoModalShow] = useState(false);
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
  useEffect(() => {
    if (isFocused) {
      allWorkoutApi();
      allWorkoutData?.length == 0 && allWorkoutApi();
    }
  }, [isFocused]);
  useEffect(() => {
    ChallengesDataAPI();
  }, []);

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

          setTrackerData(temp2);
          setTotalCount(temp2?.length);
          setTrainingCount(temp2?.length - temp?.length);
          // setSelected(result.two[0] - 1);
          setDay(result.two[0]);
          // setOpen(true);
        }
      } else {
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
  useEffect(() => {
    if (!isAlarmEnabled) {
      notifee.getTriggerNotificationIds().then(res => console.log(res, 'ISDA'));
      const currenTime = new Date();
      currenTime.setHours(7);
      currenTime.setMinutes(0);
      //AlarmNotification(currenTime);
      AlarmNotification(currenTime)
        .then(res => console.log('ALARM SET', res))
        .catch(errr => {
          console.log("Alarm error",errr);
          currenTime.setDate(currenTime.getDate() + 1);
          AlarmNotification(currenTime);
        });
      dispatch(setIsAlarmEnabled(true));
    }
  }, [isAlarmEnabled]);
  useEffect(() => {
    if (isFocused) {
      getCustomeWorkoutTimeDetails();

      setTimeout(() => {
        ActivityPermission();
      }, 2000);
    }
  }, [isFocused]);
  const ActivityPermission = async () => {
    if (Platform.OS == 'android') {
      fetchData();
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
  const fetchData = async () => {
    if (!getStepCounterOnoff) {
      // setPaddoModalShow(true);
      Alert.alert('FitMe wants to track your health data !', '', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            handleAlert();
          },
        },
      ]);
    } else {
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            checkPermissions();
          } else {
          }
        })
        .catch(error => {
          console.error('Authentication error', error);
        });
    }
  };
  const handleAlert = async () => {
    setPaddoModalShow(false);
    await GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          checkPermissions();
        } else {
        }
      })
      .catch(error => {
        console.error('Authentication error', error);
      });
  };

  const locationPermission = () => {
    Platform.OS == 'ios'
      ? request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          if (result === RESULTS.GRANTED) {
            console.log('Location permission granted IOS');
            setLocationP(false);
            navigationRef.navigate('GymListing');
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
            setLocationP(false);
            navigationRef.navigate('GymListing');
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
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white">
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
              text="Do not allow"
              flex={0}
              w={DeviceWidth * 0.7}
              alignSelf
              onPress={() => setLocationP(false)}
            />
          </View>
        </BlurView>
      </Modal>
    );
  };
  const checkPermissions = async () => {
    if(Platform.Version<30){
      fetchTotalSteps()
      startRecording()
      dispatch(setStepCounterOnOff(true))
    }
    const fitnessPermissionResult = await check(
      PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
    );
    if (fitnessPermissionResult != RESULTS.GRANTED) {
      const permissionRequestResult = await request(
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      );
      if (permissionRequestResult === RESULTS.GRANTED) {


        if (getStepCounterOnoff == true) {
          fetchTotalSteps();
          startRecording();
        } else {
          fetchTotalSteps();
          // startStepUpdateBackgroundTask();
          dispatch(setStepCounterOnOff(true));
        }
      } else {
      }
    } else {
      if (getStepCounterOnoff == true) {
        fetchTotalSteps();
        startRecording();
      } else {
        fetchTotalSteps();
        //startStepUpdateBackgroundTask();
        dispatch(setStepCounterOnOff(true));
      }
    }
  };
  const startRecording = () => {
    GoogleFit.startRecording(() => {
      GoogleFit.observeSteps(() => {
        fetchTotalSteps();
      });
    });
  };
  const fetchTotalSteps = async () => {
    try {
      await AsyncStorage.setItem('hasPermissionForStepCounter', 'true');
      const dailySteps = await GoogleFit.getDailySteps();

      dailySteps.reduce(
        (total, acc) =>
          (totalSteps = total + acc.steps[0] ? acc.steps[0].value : 0),
        0,
      );
      stepsRef.current = totalSteps;
      setSteps(totalSteps);
      distanceRef.current = ((totalSteps / 20) * 0.01).toFixed(2);
      setDistance(((totalSteps / 20) * 0.01).toFixed(2));
      caloriesRef.current = ((totalSteps / 20) * 1).toFixed(1);
      setCalories(Math.round(((totalSteps / 20) * 1).toFixed(2)));
    } catch (error) {
      console.error('Error fetching total steps', error);
    }
  };
  const options = {
    scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
  };
  // const startStepUpdateBackgroundTask = async () => {
  //   try {
  //     await BackgroundService.start(veryIntensiveTask, options1);
  //   } catch (e) {
  //     console.error('Error starting step update background service:', e);
  //   }
  // };
  const PedoMeterData = async () => {
    try {
      const res = await axios({
        url: NewAppapi.PedometerAPI,
        method: 'post',
        data: {
          user_id: getUserDataDetails?.id,
          steps: stepsRef.current,
          calories: caloriesRef.current,
          distance: distanceRef.current,
          version: VersionNumber.appVersion,
        },
      });
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      console.log('PedometerAPi Error', error.response);
    }
  };
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    const isSpecificTime = (hour, minute) => {
      const now = moment.utc(); // Get current time in UTC
      const specificTimeUTC = now
        .clone()
        .set({hour, minute, second: 0, millisecond: 0});
      const istTime = moment.utc().add(5, 'hours').add(30, 'minutes');
      // Compare only the hours and minutes
      return (
        istTime.hours() === specificTimeUTC.hours() &&
        istTime.minutes() === specificTimeUTC.minutes()
      );
    };
    // Example usage with a specific time (midnight in IST)
    const specificHour = 23;
    const specificMinute = 29;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        if (isSpecificTime(specificHour, specificMinute)) {
          PedoMeterData();
        } else {
        }
        try {
          const dailySteps = await GoogleFit.getDailySteps();
          dailySteps.reduce(
            (total, acc) =>
              (totalSteps = total + acc.steps[0] ? acc.steps[0].value : 0),
            0,
          );
        } catch (error) {
          console.error('Error fetching total steps', error);
        }
        BackgroundService.updateNotification({
          taskDesc: `${totalSteps}`,
          color: AppColor.RED,
          progressBar: {
            max: stepGoalProfile,
            value: stepsRef.current,
            indeterminate: false,
            color: AppColor.RED,
          },
          parameters: {
            delay: 60000,
          },
        });

        await sleep(delay);
      }
    });
  };
  const options1 = {
    taskName: 'StepUpdateBackgroundTask',
    taskTitle: `Steps`,
    taskDesc: `${stepsRef.current}`,
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    progressBar: {
      max: stepGoalProfile,
      value: stepsRef.current,
      indeterminate: false,
    },
    color: AppColor.RED,
    linkingURI: 'yourapp://backgroundTask',
    parameters: {
      delay: 60000,
    },
  };
  const getCustomeWorkoutTimeDetails = async () => {
    try {
      const data = await axios(`${NewAppapi.Custome_Workout_Cal_Time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserID != 0 ? getUserID : getUserDataDetails.id,
        },
      });

      if (data.data.results.length > 0) {
        dispatch(setWorkoutTimeCal(data.data.results));
      } else {
        dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('UCustomeCorkout details', error);
    }
  };

  const allWorkoutApi = async () => {
    try {
      //  setRefresh(true);
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
        navigation.navigate('MeditationDetails', {item: title});
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
          style={styles.listItem2}
          onPress={() => {
            navigation.navigate('AITrainer', {item: item});
          }}>
          {/* {imageLoad && (
            <ShimmerPlaceholder
              style={{
                height: 90,
                width: 90,
                borderRadius: 180 / 2,
                alignSelf: 'center',
                top: -5,
              }}
              ref={avatarRef}
              autoRun
            />
          )} */}
          <Image
            source={item?.img}
            // onLoad={() => setImageLoad(false)}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: DeviceHeigth * 0.05,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              ChallengesDataAPI();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={styles.container}
        nestedScrollEnabled>
        <View style={styles.profileView}>
          <GradientText
            item={
              getTimeOfDayMessage() +
              ', ' +
              (Object.keys(getUserDataDetails).length > 0
                ? getUserDataDetails.name==null?'Guest':getUserDataDetails.name.split(' ')[0]
                : 'Guest')
            }
          />

        </View>
        {currentChallenge?.length > 0 && (
          <View style={{width: '95%', alignSelf: 'center', marginVertical: 10}}>
            <Text
              style={{
                color: AppColor.HEADERTEXTCOLOR,
                fontFamily: 'Montserrat-SemiBold',
                fontWeight: '600',
                lineHeight: 21,
                fontSize: 18,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              Daily Challenge
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
                shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
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
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 11,
                    marginVertical: 10,
                  }}>
                  <Image
                    source={require('../../Icon/Images/NewImage2/human.png')}
                    style={{
                      width: 70,
                      height: 70,
                    }}
                    resizeMode="contain"
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
                      marginHorizontal: 10,
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
                      marginHorizontal: 10,
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

                  <PercentageBar height={20} percentage={progressHight} />
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WorkoutDays', {
                    data: currentChallenge[0],
                    challenge: true,
                  })
                }
                style={{width: '10%', alignItems: 'center', top: 20}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/play.png')}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    //alignContent: 'flex-end',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
                          Platform.OS == 'ios' ? distance : distanceRef.current,
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
                          Platform.OS == 'ios' ? Calories : caloriesRef.current,
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
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            top: DeviceHeigth * 0.07,
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
            top: DeviceHeigth * 0.09,
            // top: DeviceHeigth >= 1024 ? -30 : -20,
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
            marginVertical: DeviceHeigth * 0.135,
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
                navigation.navigate('MeditationDetails', {
                  item: allWorkoutData?.mindset_workout_data[0],
                });
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
        <View style={[styles.meditionBox, {top: -DeviceHeigth * 0.115}]}>
          <FlatList
            data={allWorkoutData?.mindset_workout_data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={emptyComponent}
            renderItem={({item, index}) => {
              return (
                <ListItem title={item} color={colors[index % colors.length]} />
              );
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            removeClippedSubviews={true}
          />
        </View>
        <>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              top: -DeviceHeigth * 0.085,
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
              Personalized Workouts
            </Text>
          </View>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#379CBE', '#81CAF1', '#81CAF1']}
            style={{
              width: '95%',
              borderRadius: 20,
              top: -DeviceHeigth * 0.06,
              paddingVertical: 15,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('CustomWorkout');
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
                    Custom Workout
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: AppColor.WHITE,

                      fontWeight: '500',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    }}>{`A balanced diet is a healthy life`}</Text>
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
            // backgroundColor:'red',
            //top: DeviceHeigth * 0.03,
            alignItems: 'center',
            justifyContent: 'space-between',
            top: -DeviceHeigth * 0.015,
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
            width: '95%',
            alignSelf: 'center',
            backgroundColor: 'white',
            top: -DeviceHeigth * 0.004,
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
            top: DeviceHeigth * 0.01,
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
            top: DeviceHeigth * 0.03,
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
                navigation.navigate('Meals');
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
                  {'A balanced diet is \na healthy life'}
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require('../../Icon/Images/NewImage2/diet.png')}
                  resizeMode="contain"
                  style={{
                    width: DeviceHeigth >= 1024 ? 100 : 70,
                    height: DeviceHeigth >= 1024 ? 250 : 80,
                    right: DeviceHeigth >= 1024 ? 0 : 20,
                    top: DeviceHeigth >= 1024 ? -40 : 35,
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
                navigation.navigate('Store');
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
                  {'Quality over quantity for\noptimal health benefits'}
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
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  profileView: {
    width: '95%',
    marginVertical: 8,
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
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',

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

                shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
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
