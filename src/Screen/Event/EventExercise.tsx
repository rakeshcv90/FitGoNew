import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Button,
  BackHandler,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import GradientText from '../../Component/GradientText';
import ProgreesButton from '../../Component/ProgressButton';
import Tts from 'react-native-tts';
import {string} from 'yup';
import {showMessage} from 'react-native-flash-message';
import VersionNumber from 'react-native-version-number';
import KeepAwake from 'react-native-keep-awake';
import moment from 'moment';

import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import {MyInterstitialAd, NewInterstitialAd} from '../../Component/BannerAdd';
import {localImage} from '../../Component/Image';

import {setSoundOnOff} from '../../Component/ThemeRedux/Actions';
import {navigationRef} from '../../../App';

import CircularProgress, {
  ProgressRef,
} from 'react-native-circular-progress-indicator';
import {setScreenAwake} from '../../Component/ThemeRedux/Actions';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';
import NativeAddTest from '../../Component/NativeAddTest';
import Play from '../NewWorkouts/Exercise/Play';
import ExerciseProgressBar from '../NewWorkouts/Exercise/ExerciseProgressBar';
import BottomSheetExercise from '../NewWorkouts/Exercise/BottomSheetExercise';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const songs = [
  {
    id: 1,

    url: require('../../Icon/Images/Exercise_Timer.wav'),
  },
  {
    id: 2,

    url: require('../../Icon/Images/Exercise_Start.mp3'),
  },
];
const EventExercise = ({navigation, route}: any) => {
  const {
    allExercise,
    currentExercise,
    data,
    day,
    exerciseNumber,
    trackerData,
    type,
    challenge,
  } = route.params;

  const VideoRef = useRef();
  const [visible, setVisible] = useState(false);
  // const [playW, setPlayW] = useState(0);
  const [demoW, setDemoW] = useState(0);
  // const [demoS, setDemoS] = useState(0);
  const [number, setNumber] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [currentVideo, setCurrentVideo] = useState('');
  const [pause, setPause] = useState(false);
  const [demo, setDemo] = useState(false);
  // const [demo1, setDemo1] = useState(false);
  const [open, setOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [timer, setTimer] = useState(10);
  // const [timerS, setTimerS] = useState(10);
  const [restStart, setRestStart] = useState(false);
  const [skip, setSkip] = useState(0);
  const [next, setNext] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [randomCount, setRandomCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const ProgressRef = useRef<ProgressRef>(null);
  // const [currentData, setCurrentData] = useState(currentExercise);
  // const [isLoading, setIsLoading] = useState(true);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const allWorkoutData = useSelector((state: any) => state.allWorkoutData);
  const getScreenAwake = useSelector(state => state);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state.enteredCurrentEvent,
  );
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const [separateTimer, setSeparateTimer] = useState(false);
  const [ttsInitialized, setTtsInitialized] = useState(false);
  // const restTimerRef = useRef(0);
  // const seperateTimerRef = useRef(0);
  const playTimerRef = useRef<any>(null);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const [addClosed, setAddClosed] = useState(false);
  const {initInterstitial, showInterstitialAd} =
    NewInterstitialAd(setAddClosed);
  const [seconds, setSeconds] = useState(
    parseInt(allExercise[number + 1]?.exercise_rest.split(' ')[0]),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [quitLoader, setQuitLoader] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [showSet, setShowSet] = useState(false);
  const playbackState = usePlaybackState();
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const setupPlayer = async () => {
    try {
      await TrackPlayer.add(songs);
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    } catch (error) {
      console.log('Music Player Error Exercise', error);
    }
  };
  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [seconds, isRunning]);
  useEffect(() => {
    if (getScreenAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }, [getScreenAwake]);
  const startStopTimer = () => {
    setIsRunning(prevState => !prevState);
  };

  // Convert seconds into minutes and seconds

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  useEffect(() => {
    initInterstitial();
    const initTts = async () => {
      const ttsStatus = await Tts.getInitStatus();
      if (!ttsStatus.isInitialized) {
        await Tts.setDefaultLanguage('en-IN');
        await Tts.setDucking(true);
        await Tts.setIgnoreSilentSwitch('ignore');
        await Tts.addEventListener('tts-finish', event => {
          Tts.stop();
        });
        setTtsInitialized(true);
      }
    };

    initTts();
  }, []);
  const StartAudio = async (playbackState: any) => {
    await TrackPlayer.play();
  };
  const PauseAudio = async (playbackState: any) => {
    await TrackPlayer.reset();
  };
  const SPEAK = (words: string) => {
    getSoundOffOn && Tts.speak(words);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (!back) {
      // console.log(
      //   'END',
      //   number,
      //   timer,
      //   restStart,
      //   seconds,
      //   currentSet,
      //   addClosed,
      // );
      playTimerRef.current = setTimeout(() => {
        if (restStart) {
          if (timer === 0 && number != 0) {
            // if (number == allExercise?.length - 1) return;
            setShowSet(true);
            setCurrentSet(currentSet + 1);
            setRestStart(false);
            Tts.stop();
            setSeconds(
              parseInt(allExercise[number]?.exercise_rest.split(' ')[0]),
            );

            setTimer(10);
            // setDemoW(0);
            setDemo(!demo);
            PauseAudio(playbackState);
            Platform.OS == 'android'
              ? Platform.Version != 34 && setupPlayer()
              : setupPlayer();
            StartAnimation();
          } else if (timer === 0 && number == 0) {
            if (number == allExercise?.length - 1) return;

            setRestStart(false);
            setShowSet(true);
            setCurrentSet(currentSet + 1);
            setTimer(10);
            setDemo(!demo);
            PauseAudio(playbackState);
            Platform.OS == 'android'
              ? Platform.Version != 34 && setupPlayer()
              : setupPlayer();
            StartAnimation();
          } else if (timer == 4) {
            setTimer(timer - 1);
            // setDemoW(demoW + 100 / timer);
            StartAudio(playbackState);
          } else if (timer == 10) {
            SPEAK(
              `Get Ready for ${allExercise[number]?.exercise_title} Exercise`,
            );
            if (number != 0) {
              console.log("ERRRRR",enteredCurrentEvent,number)
              enteredCurrentEvent && !Sat && !Sun
                ? postCurrentRewardsExerciseAPI(number)
                : postCurrentExerciseAPI(number);
            }

            setTimer(timer - 1);
          } else {
            // setDemoW(demoW + 100 / timer);
            setTimer(timer - 1);
          }
        } else {
          if (pause) {
            if (seconds == 30) {
              SPEAK('Lets Go');
            }
            // setPlayW(playW + 100 / parseInt(currentData?.exercise_rest));
            if (seconds > 0) {
              if (seconds == 4) SPEAK('three.            two.');
              if (seconds == 2) SPEAK('one.    Done');
              if (seconds == 11) SPEAK('10 seconds to go');

              setSeconds(seconds - 1);
            }
          }
          if (seconds == 0 && number == allExercise?.length - 1) {
            setPause(false);
            enteredCurrentEvent && !Sat && !Sun
              ? postCurrentRewardsExerciseAPI(number)
              : postCurrentExerciseAPI(number);
            let checkAdsShow = AddCountFunction();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigation.navigate('SaveDayExercise', {
                data,
                day,
                allExercise,
                type,
                challenge,
              });
            } else {
              navigation.navigate('SaveDayExercise', {
                data,
                day,
                allExercise,
                type,
                challenge,
              });
            }

            clearTimeout(playTimerRef.current);
          } else if (
            seconds == 0 &&
            number < allExercise?.length - 1 &&
            currentSet < allExercise[number]?.exercise_sets &&
            !showSet
          ) {
            setShowSet(true);
            setCurrentSet(currentSet + 1);
            setSeconds(
              parseInt(allExercise[number]?.exercise_rest.split(' ')[0]),
            );
            clearTimeout(playTimerRef.current);
            StartAnimation();
          } else if (seconds == 0 && number < allExercise?.length - 1) {
            !addClosed && showInterstitialAd();
            if (addClosed) {
              ProgressRef.current?.play();
              setPause(false);
              setCurrentSet(0);
              const index = allExercise?.findIndex(
                (item: any) =>
                  item?.exercise_id == allExercise[number]?.exercise_id,
              );
              handleExerciseChange(allExercise[index + 1]?.exercise_title);
              setNumber(index + 1);
              setRestStart(true);
              setAddClosed(false);
            }
            Platform.OS == 'android'
              ? Platform.Version != 34 && setupPlayer()
              : setupPlayer();
          }
        }
      }, 1000);
    } else {
    }
    // return () => clearTimeout(playTimerRef.current);
  }, [pause, timer, back, demo, seconds, restStart, showSet, addClosed]);
  useEffect(() => {
    setRestStart(true);
    setTimer(10);
    if (exerciseNumber != -1 && number == 0) {
      setNumber(exerciseNumber);
      // setCurrentData(currentExercise);
      handleExerciseChange(currentExercise?.exercise_title);
      // setSeparateTimer(true);
      // ProgressRef.current?.play();
    }
    Platform.OS == 'android'
      ? Platform.Version != 34 && setupPlayer()
      : setupPlayer();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      // Check if goBack has been called
      if (!e.data.action) {
        setPause(false);
        setDemo(false);

        setBack(true);
      }
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);
  const handleBackPress = () => {
    setPause(false);
    setDemo(false);
    setBack(true);
    return true;
  };
  // Function to check if the currently opened exercise exists in the provided JSON object
  const handleExerciseChange = (exerciseName: string) => {
    if (getStoreVideoLoc.hasOwnProperty(exerciseName)) {
      setCurrentVideo(getStoreVideoLoc[exerciseName]);
    } else {
      setCurrentVideo('');
      console.error(`Exercise "${exerciseName}" video not found.`);
    }
  };

  const deleteTrackExercise = async () => {
    const payload = new FormData();
    payload.append('day', WeekArray[day]);
    payload.append('workout_id', `-${day + 1}`);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    setQuitLoader(true);
    try {
      const res = await axios({
        url:
          (enteredCurrentEvent && !Sat && !Sun
            ? NewAppapi.DELETE_EVENT_WEEKLY_DATA
            : NewAppapi.DELETE_TRACK_EXERCISE) +
          '?workout_id=' +
          `-${day + 1}` +
          '&user_id=' +
          getUserDataDetails?.id +
          '&current_date=' +
          moment().format('YYYY-MM-DD'),
      });
      setQuitLoader(false);
    } catch (error) {
      setQuitLoader(false);
      console.log('DELE TRACK ERRR', error);
    }
    navigationRef.current.goBack();
  };
  const postCurrentRewardsExerciseAPI = async (index: number) => {
    console.log("API HITTTTT",trackerData,index)
    const payload = new FormData();
    payload.append('id', trackerData[index]?.id);

    payload.append('type', 'cardio');
    payload.append('day', WeekArray[day]);
    payload.append('workout_id', `-${12 + 1}`);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    next > 0 && payload.append('next_status', next);
    previous > 0 && payload.append('prev_status', previous);
    skip > 0 && payload.append('skip_status', skip);

    try {
      const res = await axios({
        url: 'https://fitme.cvinfotech.in/adserver/public/api/testing_event_exercise_complete_status',
        // url: NewAppapi.POST_REWARDS_EXERCISE,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
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
      } else if (res.data) {
        setCompleted(completed + 1);
        // setCurrentData(allExercise[index]);
        setRestStart(true);
        // setPlayW(0);
        setSeconds(parseInt(allExercise[index]?.exercise_rest.split(' ')[0]));
      }
      setSkip(0);
      setNext(0);
      setPrevious(0);
    } catch (error) {
      console.error(error?.response, 'PostREWARDSAPIERror');
    }
  };
  const postCurrentExerciseAPI = async (index: number) => {
    const payload = new FormData();
    payload.append('id', trackerData[index]?.id);

    payload.append('day', type == 'day' ? day : WeekArray[day]);
    payload.append(
      'workout_id',
      type == 'day'
        ? data?.workout_id == undefined
          ? data?.custom_workout_id
          : data?.workout_id
        : `-${day + 1}`,
    );
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: challenge ? NewAppapi.POST_CHALLENGE : NewAppapi.POST_EXERCISE,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
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
      } else if (res.data) {
        setCompleted(completed + 1);
        // setCurrentData(allExercise[index]);
        setRestStart(true);
        // setPlayW(0);
        setSeconds(parseInt(allExercise[index]?.exercise_rest.split(' ')[0]));
      }
    } catch (error) {
      console.error(error?.response, 'PostDaysAPIERror');
    }
  };
  const PauseModal = useMemo(() => {
    return ({back, quitLoader}: any) => {
      return (
        <Modal
          visible={back}
          onRequestClose={() => setBack(false)}
          animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: AppColor.WHITE,
              justifyContent: 'center',
              alignItems: 'center',
              // marginTop: DeviceHeigth * 0.05
            }}>
            <NativeAddTest media={true} type="video" />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: DeviceWidth * 0.1,
                // marginTop: DeviceHeigth * 0.05
                // paddingLeft: DeviceWidth / 2,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 32,
                  color: '#f0013b',
                }}>
                Keep Going!
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 32,
                  color: '#f0013b',
                }}>
                Don't Give Up!
              </Text>
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                fontFamily: 'Poppins',
                lineHeight: 30,
                marginTop: 5,
                color: AppColor.BLACK,
              }}>
              {`You have finished `}
              <Text style={{color: '#f0013b'}}>
                {((number / parseInt(allExercise?.length)) * 100).toFixed(0) +
                  '%'}
              </Text>
              {'\n'}
              {' only '}
              <Text style={{color: '#f0013b'}}>
                {parseInt(allExercise?.length) - number + ' Exercises'}
              </Text>
              {' left '}
            </Text>
            <View style={{marginTop: 12}}>
              <ProgreesButton
                text="Resume"
                h={55}
                bR={30}
                flex={-1}
                mV={20}
                onPress={() => setBack(false)}
                bW={1}
              />

              <TouchableOpacity
                style={{alignSelf: 'center', marginTop: 5}}
                onPress={() => {
                  type == 'day'
                    ? navigationRef.current.goBack()
                    : type == 'custom'
                    ? navigationRef.current.goBack()
                    : deleteTrackExercise();
                }}>
                {quitLoader ? (
                  <ActivityIndicator
                    animating={quitLoader}
                    color={AppColor.NEW_DARK_RED}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Poppins',
                      lineHeight: 30,
                      color: AppColor.BLACK,
                      fontWeight: '700',
                    }}>
                    Quit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    };
  }, [back]);
  const checkMealAddCount = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const StartAnimation = () => {
    console.log(opacity, 'opacity');
    // Define the animation sequence
    Animated.sequence([
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Wait for a moment (hold the text visible and scaled up)
      Animated.delay(2000),
      // Fade out and scale down
      // Animated.parallel([
      // Animated.timing(opacity, {
      //   toValue: 0,
      //   duration: 1000,
      //   useNativeDriver: true,
      // }),
      // Animated.timing(scale, {
      //   toValue: 1,
      //   duration: 1000,
      //   useNativeDriver: true,
      // }),
      Animated.timing(translateY, {
        toValue: -DeviceHeigth,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSet(false);
      opacity.setValue(0);
      scale.setValue(1);
      translateY.setValue(0);
      console.log(opacity, 'opacity2');
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
      }}>
      {restStart ? (
        <>
          <View
            style={{
              height: DeviceHeigth * 0.6,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: DeviceWidth * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setBack(true);
                }}
                style={{
                  width: 40,
                }}>
                <AntIcons
                  name={'arrowleft'}
                  size={20}
                  color={
                    number == allExercise?.length
                      ? AppColor.WHITE
                      : AppColor.INPUTTEXTCOLOR
                  }
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: AppColor.HEADERTEXTCOLOR,
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 16,
                  lineHeight: 20,
                  fontWeight: '600',
                }}>
                Exercise {number + 1}/{allExercise?.length}
              </Text>
              <View style={{width: 10}} />
            </View>
            <View
              style={{
                height: DeviceHeigth * 0.5,
                marginTop: -DeviceHeigth * 0.03,
                zIndex: -1,
              }}>
              <Video
                source={{
                  uri: getStoreVideoLoc[allExercise[number]?.exercise_title],
                }}
                onReadyForDisplay={() => {
                  setDemo(true);
                  // setIsLoading(false);
                }}
                onLoad={() => {
                  // setIsLoading(false);
                  setDemo(true);
                }}
                // onVideoLoad={() =>() }
                // onVideoLoadStart={() => }
                paused={!demo}
                onPlaybackResume={() => {
                  setDemo(true);
                }}
                repeat={true}
                resizeMode="contain"
                style={{
                  width: DeviceWidth,
                  height: DeviceHeigth * 0.4,
                  alignSelf: 'center',
                  top: 60,
                }}
              />
            </View>
          </View>
          <View
            style={{
              height: DeviceHeigth * 0.4,
              backgroundColor: '#f9f9f9',
              paddingTop: 20,
              paddingHorizontal: 20,
            }}>
            <View style={{height: DeviceHeigth * 0.02}} />
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '600',
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  lineHeight: 54,
                  color: AppColor.LITELTEXTCOLOR,
                }}>
                Get Ready
              </Text>
              <Text
                style={{
                  color: AppColor.HEADERTEXTCOLOR,
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontWeight: '500',
                }}>
                {allExercise[number]?.exercise_title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: DeviceWidth,
                alignSelf: 'center',
                marginTop: DeviceWidth * 0.1,
              }}>
              <View style={{width: DeviceWidth * 0.2}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // alignSelf: 'center',
                  // width: '50%',
                }}>
                {/* <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 100 / 2,
                    // backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                  }}>
                  <View
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 80 / 2,
                      backgroundColor: 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60 / 2,
                        borderColor: 'red',
                        borderWidth: 1,
                        backgroundColor: 'white',
                      }}></View>
                  </View>
                </View>
                <Text>{timer}</Text> */}
                {/* <CircularProgress
                  ref={ProgressRef}
                  value={timer}
                  initialValue={10}
                  startInPausedState={true}
                  radius={40}
                  progressValueColor="#f0013b"
                  inActiveStrokeColor={'#FCECF0'}
                  activeStrokeColor="#f0013b"
                  // inActiveStrokeOpacity={0.3}
                  maxValue={10}
                  titleColor={'black'}
                  titleStyle={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '700',
                    lineHeight: 35,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  }}
                /> */}
                <CircularProgress
                  value={timer}
                  radius={40}
                  initialValue={10}
                  progressValueColor="#f0013b"
                  inActiveStrokeColor={'#FCECF0'}
                  activeStrokeColor="#f0013b"
                  // inActiveStrokeOpacity={0.3}
                  maxValue={10}
                  titleColor={'black'}
                  titleStyle={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '700',
                    lineHeight: 35,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSkip(skip + 1);
                    clearTimeout(playTimerRef.current);
                    setTimer(0);
                  }}
                  style={{
                    zIndex: 1,
                    marginLeft: 30,
                  }}>
                  <Text
                    style={{
                      color: '#333333CC',
                      fontSize: 20,
                      lineHeight: 24,
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      fontWeight: '500',
                      textDecorationStyle: 'solid',
                      textDecorationColor: '#333333CC',
                    }}>
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{width: 10}} />
            </View>
          </View>
        </>
      ) : (
        <>
          {showSet && (
            <Animated.Text
              style={{
                color: AppColor.RED,
                fontSize: 30,
                position: 'absolute',
                fontFamily: Fonts.MONTSERRAT_BOLD,
                lineHeight: 40,
                fontWeight: 'bold',
                top: DeviceHeigth * 0.4,
                alignSelf: 'center',
                zIndex: 1,
                opacity: opacity,
                transform: [{scale}, {translateY}],
              }}>
              SET {currentSet}
            </Animated.Text>
          )}
          <View
            style={{
              height: DeviceHeigth * 0.6,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: DeviceWidth * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setBack(true);
                  if (getScreenAwake) {
                    dispatch(setScreenAwake(false));
                  } else {
                    dispatch(setScreenAwake(true));
                  }
                }}
                style={{
                  width: 40,
                }}>
                <AntIcons
                  name={'arrowleft'}
                  size={20}
                  color={
                    number == allExercise?.length
                      ? AppColor.WHITE
                      : AppColor.INPUTTEXTCOLOR
                  }
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: AppColor.HEADERTEXTCOLOR,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 16,
                  lineHeight: 20,
                  fontWeight: '600',
                }}>
                Exercise {number + 1}/{allExercise?.length}
              </Text>
              <View style={{width: 10}} />
            </View>
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                right: DeviceWidth * 0.05,
                top: DeviceWidth * 0.04,
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setSoundOnOff(!getSoundOffOn));
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: restStart ? 50 : 25,
                  width: restStart ? 50 : 25,
                  height: restStart ? 50 : 25,
                  backgroundColor: restStart ? 'transparent' : '#3333331A',
                  marginVertical: 5,
                  // marginTop: restStart ? (Platform.OS == 'ios' ? 25 : 10) : 5,
                  // alignSelf: restStart ? 'flex-end' : 'auto',
                }}>
                <Image
                  source={
                    getSoundOffOn
                      ? require('../../Icon/Images/NewImage2/sound.png')
                      : require('../../Icon/Images/NewImage2/soundmute.png')
                  }
                  style={{width: 27, height: 27}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setOpen(true);
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: restStart ? 50 : 25,
                  width: restStart ? 50 : 25,
                  height: restStart ? 50 : 25,
                  backgroundColor: restStart ? 'transparent' : '#3333331A',
                  marginVertical: 5,
                  // marginTop: restStart ? (Platform.OS == 'ios' ? 25 : 10) : 5,
                  // alignSelf: restStart ? 'flex-end' : 'auto',
                }}>
                <Image
                  source={localImage.Exercise_Info}
                  style={{width: 15, height: 15}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {enteredCurrentEvent && type == 'weekly'
                ? null
                : allExercise?.length > 1 && (
                    <TouchableOpacity
                      onPress={() => {
                        setRestStart(false);
                        setVisible(true);
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: restStart ? 50 : 25,
                        width: restStart ? 50 : 25,
                        height: restStart ? 50 : 25,
                        backgroundColor: restStart
                          ? 'transparent'
                          : '#3333331A',
                        marginVertical: 5,
                      }}>
                      <Image
                        source={localImage.Exercise_List}
                        style={{width: 15, height: 15}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
            </View>
            <View
              style={{
                height: DeviceHeigth * 0.5,
                marginTop: -DeviceHeigth * 0.03,
                zIndex: -1,
              }}>
              <Video
                source={{
                  uri: currentVideo,
                }}
                onReadyForDisplay={() => {
                  setPause(true);
                  // setIsLoading(false);
                }}
                onLoad={() => {
                  // setIsLoading(false);
                  setPause(true);
                }}
                // onVideoLoad={() =>() }
                // onVideoLoadStart={() => }
                paused={!pause}
                onPlaybackResume={() => {
                  setPause(true);
                }}
                repeat={true}
                resizeMode="contain"
                style={{
                  width: DeviceWidth,
                  height: DeviceHeigth * 0.5,
                  alignSelf: 'center',
                  top: 60,
                }}
              />
            </View>
          </View>
          <View
            style={{
              height: DeviceHeigth * 0.4,
              backgroundColor: '#f9f9f9',
              paddingTop: 20,
              paddingHorizontal: 20,
            }}>
            <View style={{height: DeviceHeigth * 0.02}} />
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '600',
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  lineHeight: 54,
                  color: AppColor.LITELTEXTCOLOR,
                }}>
                {minutes < 10 ? '0' + minutes : minutes}:
                {remainingSeconds < 10
                  ? '0' + remainingSeconds
                  : remainingSeconds}
              </Text>
              <Text
                style={{
                  color: AppColor.HEADERTEXTCOLOR,
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontWeight: '500',
                }}>
                {allExercise[number]?.exercise_title}
              </Text>
            </View>
            {/* <View
              style={{
                marginVertical:
                  Platform.OS == 'ios'
                    ? DeviceHeigth >= 1024
                      ? DeviceHeigth * 0.07
                      : DeviceHeigth * 0.03
                    : DeviceHeigth * 0.01,
                top:
                  Platform.OS == 'ios'
                    ? DeviceHeigth >= 1024
                      ? DeviceHeigth * 0.06
                      : DeviceHeigth * 0.02
                    : DeviceHeigth * 0.0,
              }}>
              <Text style={[styles.head, {color: AppColor.BLACK}]}>
                {currentData?.exercise_title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={[
                  styles.name,
                  {width: DeviceWidth * 0.7, fontSize: 25, fontWeight: '700'},
                ]}>
                {minutes < 10 ? '0' + minutes : minutes}:
                {remainingSeconds < 10
                  ? '0' + remainingSeconds
                  : remainingSeconds}
              </Text>
              <Text style={[styles.name, {color: '#505050', marginLeft: -15}]}>
                <Icons
                  name={'clock-outline'}
                  size={20}
                  color={AppColor.INPUTTEXTCOLOR}
                />
                {` ${currentData?.exercise_rest}`}
              </Text>
            </View> */}
            <Play
              play={!pause}
              fill={100}
              h={80}
              mB={DeviceHeigth * 0.05}
              playy={() => {
                setPause(!pause);
              }}
              nextDisabled={number == allExercise?.length - 1}
              next={() => {
                setNext(next + 1);
                setPause(!pause);
                // setDefaultPre(0);
                // setPlayW(prevTimer => 0);
                setPause(false);
                clearTimeout(playTimerRef.current);
                setTimeout(() => {
                  if (number == allExercise?.length - 1) return;
                  const index = allExercise?.findIndex(
                    (item: any) =>
                      item?.exercise_id == allExercise[number]?.exercise_id,
                  );
                  // postCurrentExerciseAPI(index + 1);
                  setNumber(number + 1);
                  !enteredCurrentEvent && setSkipCount(skipCount + 1);
                  // setCurrentData(allExercise[index + 1]);
                  handleExerciseChange(allExercise[index + 1]?.exercise_title);
                  setSeconds(
                    parseInt(
                      allExercise[index + 1]?.exercise_rest.split(' ')[0],
                    ),
                  );
                }, 1500);
              }}
              backDisabled={number == 0}
              back={() => {
                if (number == 0) return;
                setPrevious(previous + 1);
                // setPlayW(prevTimer => 0);
                setPause(false);
                clearTimeout(playTimerRef.current);
                const index = allExercise?.findIndex(
                  (item: any) =>
                    item?.exercise_id == allExercise[number]?.exercise_id,
                );
                // postCurrentExerciseAPI(index - 1);
                // setCurrentData(allExercise[index - 1]);
                handleExerciseChange(allExercise[index - 1]?.exercise_title);
                setNumber(number - 1);
                setSeconds(
                  parseInt(allExercise[index - 1]?.exercise_rest.split(' ')[0]),
                );
              }}
            />
          </View>
          <ExerciseProgressBar
            ExerciseData={allExercise}
            INDEX={completed}
            time={allExercise[number]?.exercise_rest == 1 ? 60 : 1}
            w={restStart ? '100%' : `${100}%`}
            color={restStart ? AppColor.WHITE : '#f0013b'}
          />
        </>
      )}
      <BottomSheetExercise
        isVisible={visible}
        setVisible={setVisible}
        exerciseData={allExercise}
        // setCurrentData={setCurrentData}
        // setPlayW={setPlayW}
        setPause={setPause}
        // setRandomCount={setRandomCount}
        playTimerRef={playTimerRef}
        currentExercise={currentExercise}
        setSeconds={setSeconds}
        handleExerciseChange={handleExerciseChange}
        setNumber={setNumber}
      />
      <PauseModal back={back} quitLoader={quitLoader} />

      <WorkoutsDescription
        open={open}
        setOpen={setOpen}
        data={allExercise[number]}
      />
    </SafeAreaView>
  );
};

export default EventExercise;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  head: {
    fontSize: 30,
    fontFamily: 'Poppins',
    fontWeight: '700',
    // lineHeight: 40,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    lineHeight: 30,
    color: '#1e1e1e',
  },
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.5,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: -50,
    position: 'absolute',
    padding: 20,
    marginLeft: -20,
    // paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.9,
        // shadowRadius: 10,
      },
    }),
  },
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',

    marginVertical: DeviceHeigth * 0.2,
  },
  temp: {
    width: DeviceWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    height: Platform.OS == 'ios' ? 0 : DeviceHeigth * 0.05,
    alignSelf: 'center',
    marginTop: DeviceHeigth * 0.02,
  },
});
