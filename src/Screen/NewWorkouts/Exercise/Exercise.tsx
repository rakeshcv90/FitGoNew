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
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../../Component/Color';
import ExerciseProgressBar from './ExerciseProgressBar';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import Play from './Play';
import BottomSheetExercise from './BottomSheetExercise';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import WorkoutsDescription from '../WorkoutsDescription';
import GradientText from '../../../Component/GradientText';
import ProgreesButton from '../../../Component/ProgressButton';
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
import {
  MyInterstitialAd,
  NewInterstitialAd,
} from '../../../Component/BannerAdd';
import {localImage} from '../../../Component/Image';

import {setSoundOnOff} from '../../../Component/ThemeRedux/Actions';
import {navigationRef} from '../../../../App';

import CircularProgress, {
  CircularProgressWithChild,
  ProgressRef,
} from 'react-native-circular-progress-indicator';
import {setScreenAwake} from '../../../Component/ThemeRedux/Actions';
import {AddCountFunction} from '../../../Component/Utilities/AddCountFunction';
import NativeAddTest from '../../../Component/NativeAddTest';
import {ShadowStyle} from '../../../Component/Utilities/ShadowStyle';
import FitIcon from '../../../Component/Utilities/FitIcon';
import FitText from '../../../Component/Utilities/FitText';
import {StatusBar} from 'react-native';
import {ArrowLeft} from '../../../Component/Utilities/Arrows/Arrow';
import CircleProgress from '../../../Component/Utilities/ProgressCircle';

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

    url: require('../../../Icon/Images/Exercise_Timer.wav'),
  },
  {
    id: 2,

    url: require('../../../Icon/Images/Exercise_Start.mp3'),
  },
];
const Exercise = ({navigation, route}: any) => {
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
  const [playW, setPlayW] = useState(0);
  const [demoW, setDemoW] = useState(0);
  const [demoS, setDemoS] = useState(0);
  const [number, setNumber] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [currentVideo, setCurrentVideo] = useState('');
  const [pause, setPause] = useState(false);
  const [demo, setDemo] = useState(false);
  const [demo1, setDemo1] = useState(false);
  const [open, setOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [timer, setTimer] = useState(10);
  const [timerS, setTimerS] = useState(10);
  const [restStart, setRestStart] = useState(false);
  const [skip, setSkip] = useState(0);
  const [next, setNext] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [randomCount, setRandomCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const ProgressRef = useRef<ProgressRef>(null);
  const [currentData, setCurrentData] = useState(currentExercise);
  const [isLoading, setIsLoading] = useState(true);
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
  const restTimerRef = useRef(0);
  const seperateTimerRef = useRef(0);
  const playTimerRef = useRef<any>(null);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const [addClosed, setAddClosed] = useState(false);
  const {initInterstitial, showInterstitialAd} =
    NewInterstitialAd(setAddClosed);
  const [seconds, setSeconds] = useState(
    parseInt(allExercise[number]?.exercise_rest.split(' ')[0]),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [quitLoader, setQuitLoader] = useState(false);
  const playbackState = usePlaybackState();
  const [currentSet, setCurrentSet] = useState(0);
  const [showSet, setShowSet] = useState(false);
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const animatedProgress = useRef(new Animated.Value(0)).current; // Animated value for progress
  const timerProgress = useRef(new Animated.Value(0)).current; // Animated value for progress

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

  useEffect(() => {
    // Add an event listener to handle the hardware back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Remove the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
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
      // console.log('END', seconds);
      playTimerRef.current = setTimeout(() => {
        if (restStart) {
          if (timer === 0 && number != 0) {
            setCurrentSet(1);
            setRestStart(false);
            Tts.stop();
            setSeconds(
              parseInt(allExercise[number]?.exercise_rest.split(' ')[0]),
            );

            setTimer(10);
            // setDemoW(0);
            setDemo(!demo);
            timerProgress.setValue(0);
            setDemoW(0);
            PauseAudio(playbackState);
            Platform.OS == 'android'
              ? Platform.Version != 34 && setupPlayer()
              : setupPlayer();
            StartAnimation();
          } else if (timer === 0 && number == 0) {
            // if (number == allExercise?.length - 1) return;
            setRestStart(false);
            setShowSet(true);
            setCurrentSet(currentSet + 1);
            setTimer(10);
            setDemo(!demo);
            PauseAudio(playbackState);
            timerProgress.setValue(0);
            setDemoW(0);
            Platform.OS == 'android'
              ? Platform.Version != 34 && setupPlayer()
              : setupPlayer();
            StartAnimation();
          } else if (timer == 4) {
            setTimer(timer - 1);
            setDemoW(demoW + 10);
            // setDemoW(demoW + 100 / timer);
            StartAudio(playbackState);
          } else if (timer == 10) {
            SPEAK(
              `Get Ready for ${allExercise[number]?.exercise_title} Exercise`,
            );
            if (number != 0) {
              type == 'focus' || type == 'bodypart'
                ? postSingleExerciseAPI(number - 1)
                : postCurrentExerciseAPI(number - 1);
            }

            setTimer(timer - 1);
            setDemoW(demoW + 10);
          } else {
            // setDemoW(demoW + 100 / timer);
            setTimer(timer - 1);
            setDemoW(demoW + 10);
          }
        } else {
          if (pause) {
            if (
              seconds ==
              parseInt(allExercise[number]?.exercise_rest.split(' ')[0])
            ) {
              SPEAK('Lets Go');
            }
            // setPlayW(playW + 100 / parseInt(currentData?.exercise_rest));
            if (seconds > 0) {
              if (seconds == 4) SPEAK('three.            two.');
              if (seconds == 2) SPEAK('one.    Done');
              if (seconds == 11) SPEAK('10 seconds to go');
              if (allExercise[number]?.exercise_sets == 0 && seconds == 10) {
                initInterstitial();
                console.log('ADD INITIALISE NO SET');
              }
              setSeconds(seconds - 1);
              setPlayW(
                playW +
                  100 /
                    parseInt(allExercise[number]?.exercise_rest.split(' ')[0]),
              );
            }
          }
          if (allExercise[number]?.exercise_sets != 0) {
            if (
              seconds == 0 &&
              number == allExercise?.length - 1 &&
              currentSet == allExercise[number]?.exercise_sets
            ) {
              setPause(false);
              type == 'focus' || type == 'bodypart'
                ? postSingleExerciseAPI(number)
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
            } else if (
              seconds == 0 &&
              number <= allExercise?.length - 1 &&
              currentSet < allExercise[number]?.exercise_sets &&
              !showSet
            ) {
              animatedProgress.setValue(0);
              setPlayW(0);
              if (currentSet + 1 == allExercise[number]?.exercise_sets) {
                initInterstitial();
                console.log('ADD INITIALISE');
              }
              setShowSet(true);
              setCurrentSet(currentSet + 1);
              setSeconds(
                parseInt(allExercise[number]?.exercise_rest.split(' ')[0]),
              );
              clearTimeout(playTimerRef.current);
              StartAnimation();
            } else if (seconds == 0 && number < allExercise?.length - 1) {
              //   console.log('NUMBER', number);
              //   setCurrentSet(0);
              //   const index = allExercise?.findIndex(
              //     (item: any) =>
              //       item?.exercise_id == allExercise[number]?.exercise_id,
              //   );
              //   handleExerciseChange(allExercise[index + 1]?.exercise_title);
              //   setNumber(index + 1);
              //   setRestStart(true);
              //   !addClosed && showInterstitialAd();
              //   if (addClosed) {
              //     ProgressRef.current?.play();
              //     setPause(false);
              //     setAddClosed(false);
              //   }
              // }
              !addClosed && showInterstitialAd();
              if (addClosed) {
                ProgressRef.current?.play();
                setPause(false);
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
          } else {
            if (seconds == 0 && number == allExercise?.length - 1) {
              setPause(false);
              type == 'focus' || type == 'bodypart'
                ? postSingleExerciseAPI(number)
                : postCurrentExerciseAPI(number);
              let checkAdsShow = AddCountFunction();
              clearTimeout(playTimerRef.current);
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
            } else if (seconds == 0 && number <= allExercise?.length - 1) {
              animatedProgress.setValue(0);
              setPlayW(0);
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
        }
      }, 1000);
    } else {
    }
    // return () => clearTimeout(playTimerRef.current);
  }, [
    pause,
    timer,
    back,
    demo,
    seconds,
    restStart,
    showSet,
    addClosed,
    playW,
    demoW,
  ]);
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: Math.round(playW) == 100 ? 0 : Math.round(playW),
      duration: 500, // Duration of the animation (500ms)
      useNativeDriver: true,
    }).start();
    Animated.timing(timerProgress, {
      toValue: Math.round(demoW) == 100 ? 0 : Math.round(demoW),
      duration: 500, // Duration of the animation (500ms)
      useNativeDriver: true,
    }).start();
  }, [playW, demoW]);

  useEffect(() => {
    setRestStart(true);
    setTimer(10);
    if (exerciseNumber != -1 && number == 0) {
      setNumber(exerciseNumber);
      handleExerciseChange(currentExercise?.exercise_title);
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
    setDemoS(0);
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
        setCurrentData(allExercise[index]);
        // setRestStart(true);
        setPlayW(0);
      }
    } catch (error) {
      console.error(error?.response, 'PostDaysAPIERror');
    }
  };
  const postSingleExerciseAPI = async (index: number) => {
    const payload = new FormData();
    payload.append('day', day);
    payload.append('exercise_id', currentData?.exercise_id);
    payload.append('workout_id', data?.id);

    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.POST_SINGLE_EXERCISE_COMPLETE,
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
        setCurrentData(allExercise[index]);
        setRestStart(true);
        setPlayW(0);
      }
    } catch (error) {
      console.error(error, 'PostSINGLExerciseAPIERror');
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

  const StartAnimation = () => {
    // console.log(opacity, 'opacity');
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
      Animated.delay(2000),
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
      // console.log(opacity, 'opacity2');
    });
  };
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F7F7F7',
      }}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 10}}>
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
                  <ArrowLeft />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#1F2937',
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 18,
                    lineHeight: 20,
                    fontWeight: '600',
                  }}>
                  {allExercise[number]?.exercise_title}
                </Text>
                <View
                  style={{
                    padding: 2,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#EBEDF0',
                  }}>
                  <Text
                    style={{
                      color: '#6B7280',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      fontSize: 16,
                      lineHeight: 20,
                      fontWeight: '600',
                    }}>
                    {number + 1}/{allExercise?.length}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  {
                    height: DeviceHeigth * 0.5,
                    marginTop: DeviceHeigth * 0.02,
                    zIndex: -1,
                    backgroundColor: AppColor.WHITE,
                    borderRadius: 10,
                    overflow: 'hidden',
                  },
                  ShadowStyle,
                ]}>
                <Video
                  source={{
                    uri: getStoreVideoLoc[allExercise[number]?.exercise_title],
                  }}
                  onReadyForDisplay={() => {
                    setDemo(true);
                  }}
                  onLoad={() => {
                    setDemo(true);
                  }}
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
                    top: 30,
                  }}
                />
              </View>
            </View>
            <View
              style={[
                {
                  // height: DeviceHeigth * 0.28,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: AppColor.WHITE,
                  width: DeviceHeigth >= 1024 ? '90%' : '90%',
                  alignSelf: 'center',
                  borderRadius: 10,
                },
                ShadowStyle,
              ]}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '600',
                    fontFamily: Fonts.HELVETICA_BOLD,
                    lineHeight: 54,
                    color: '#1F2937',
                  }}>
                  {timer == 10 ? '00:' + timer : '00:0' + timer}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: DeviceWidth,
                  alignSelf: 'center',
                  marginVertical: 10,
                }}>
                <CircleProgress
                  radius={50}
                  animatedProgress={timerProgress}
                  strokeLinecap={timer == 0 ? 'butt' : 'round'}
                  strokeWidth={25}
                  changingColorsArray={['#530014', '#F0013B']}
                  secondayCircleColor="#F0013B">
                  <TouchableOpacity
                    onPress={() => {
                      setSkip(skip + 1);
                      clearTimeout(playTimerRef.current);
                      setTimer(0);
                      setDemoW(0);
                      timerProgress.setValue(0);
                    }}>
                    <Image
                      source={require('../../../Icon/Images/InAppRewards/SkipButton.png')}
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </CircleProgress>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  fontFamily: Fonts.HELVETICA_BOLD,
                  lineHeight: 25,
                  color: '#1F2937',
                  textAlign: 'center',
                }}>
                Get Ready
              </Text>
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
                  }}
                  style={{
                    width: 40,
                  }}>
                  <ArrowLeft />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#1F2937',
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 18,
                    lineHeight: 20,
                    fontWeight: '600',
                  }}>
                  {allExercise[number]?.exercise_title}
                </Text>
                <View
                  style={{
                    padding: 2,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#EBEDF0',
                  }}>
                  <Text
                    style={{
                      color: '#6B7280',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      fontSize: 16,
                      lineHeight: 20,
                      fontWeight: '600',
                    }}>
                    {number + 1}/{allExercise?.length}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  {
                    height: DeviceHeigth * 0.5,
                    marginTop: DeviceHeigth * 0.02,
                    zIndex: -1,
                    backgroundColor: AppColor.WHITE,
                    borderRadius: 10,
                    overflow: 'hidden',
                  },
                  ShadowStyle,
                ]}>
                <Video
                  source={{
                    uri: getStoreVideoLoc[allExercise[number]?.exercise_title],
                  }}
                  onReadyForDisplay={() => {
                    setPause(true);
                  }}
                  onLoad={() => {
                    setPause(true);
                  }}
                  paused={!pause}
                  onPlaybackResume={() => {
                    setPause(true);
                  }}
                  repeat={true}
                  resizeMode="contain"
                  style={{
                    width: DeviceWidth,
                    height: DeviceHeigth * 0.4,
                    alignSelf: 'center',
                    top: 30,
                  }}
                />
              </View>
            </View>
            <View
              style={[
                {
                  // height: DeviceHeigth * 0.28,
                  paddingTop: 10,
                  paddingHorizontal: 20,
                  backgroundColor: AppColor.WHITE,
                  width: DeviceHeigth >= 1024 ? '90%' : '90%',
                  alignSelf: 'center',
                  borderRadius: 10,
                },
                ShadowStyle,
              ]}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '600',
                    fontFamily: Fonts.HELVETICA_BOLD,
                    lineHeight: 54,
                    color: '#1F2937',
                  }}>
                  {remainingSeconds > 9
                    ? `0${minutes}:${remainingSeconds}`
                    : `0${minutes}:0${remainingSeconds}`}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '80%',
                  alignSelf: 'center',
                  marginVertical: 10,
                }}>
                <TouchableOpacity
                  disabled={number == 0}
                  onPress={() => {
                    if (number == 0) return;
                    setPrevious(previous + 1);
                    setShowSet(true);
                    setCurrentSet(1);
                    setPause(false);
                    animatedProgress.setValue(0);
                    setPlayW(0);
                    clearTimeout(playTimerRef.current);
                    const index = allExercise?.findIndex(
                      (item: any) =>
                        item?.exercise_id == allExercise[number]?.exercise_id,
                    );
                    handleExerciseChange(
                      allExercise[index - 1]?.exercise_title,
                    );
                    setNumber(number - 1);
                    setSeconds(
                      parseInt(
                        allExercise[index - 1]?.exercise_rest.split(' ')[0],
                      ),
                    );
                  }}>
                  <FitIcon
                    name="skip-previous"
                    type="MaterialCommunityIcons"
                    size={30}
                    style={{
                      color: '#6B7280',
                      opacity: number == 0 ? 0.5 : 1,
                    }}
                  />
                </TouchableOpacity>
                <CircleProgress
                  radius={50}
                  animatedProgress={animatedProgress}
                  strokeLinecap={seconds == 0 ? 'butt' : 'round'}
                  strokeWidth={25}
                  changingColorsArray={['#530014', '#F0013B']}
                  secondayCircleColor="#F0013B">
                  <TouchableOpacity onPress={() => setPause(!pause)}>
                    <FitIcon
                      name={!pause ? 'play' : 'pause'}
                      type="MaterialCommunityIcons"
                      size={40}
                      color="#1F2937"
                    />
                  </TouchableOpacity>
                </CircleProgress>
                <TouchableOpacity
                  disabled={number == allExercise?.length - 1}
                  onPress={() => {
                    setNext(next + 1);
                    setPause(!pause);
                    setShowSet(true);
                    setCurrentSet(1);
                    setPause(false);
                    clearTimeout(playTimerRef.current);
                    setTimeout(() => {
                      if (number == allExercise?.length - 1) return;
                      animatedProgress.setValue(0);
                      setPlayW(0);
                      const index = allExercise?.findIndex(
                        (item: any) =>
                          item?.exercise_id == allExercise[number]?.exercise_id,
                      );
                      setNumber(number + 1);
                      !enteredCurrentEvent && setSkipCount(skipCount + 1);
                      // setCurrentData(allExercise[index + 1]);
                      handleExerciseChange(
                        allExercise[index + 1]?.exercise_title,
                      );
                      setSeconds(
                        parseInt(
                          allExercise[index + 1]?.exercise_rest.split(' ')[0],
                        ),
                      );
                    }, 1500);
                  }}>
                  <FitIcon
                    name="skip-next"
                    type="MaterialCommunityIcons"
                    size={30}
                    style={{
                      color: '#6B7280',
                      opacity: number == allExercise?.length - 1 ? 0.5 : 1,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{height: DeviceHeigth >= 1024 ? 20 : 0}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: DeviceHeigth >= 1024 ? '50%' : '70%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setSoundOnOff(!getSoundOffOn));
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 5,
                      flexDirection: 'row',
                      paddingLeft: 5,
                    }}>
                    <Image
                      source={
                        !getSoundOffOn
                          ? require('../../../Icon/Images/InAppRewards/SoundOn.png')
                          : require('../../../Icon/Images/InAppRewards/SoundOff.png')
                      }
                      style={{width: 15, height: 15}}
                      resizeMode="contain"
                    />
                    <FitText
                      type="normal"
                      value={getSoundOffOn ? ' Sound Off' : ' Sound On'}
                      color="#6B7280"
                      fontFamily={Fonts.HELVETICA_REGULAR}
                      lineHeight={30}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: '#6B7280',
                      width: 1,
                      height: 20,
                      opacity: 0.5,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setOpen(true);
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 5,
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={require('../../../Icon/Images/InAppRewards/Exercise_Info1.png')}
                      style={{width: 15, height: 15}}
                      resizeMode="contain"
                    />
                    <FitText
                      type="normal"
                      value=" Exercise Info"
                      color="#6B7280"
                      fontFamily={Fonts.HELVETICA_REGULAR}
                      lineHeight={30}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setRestStart(false);
                    setVisible(true);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    width: 30,
                    height: 30,
                    backgroundColor: restStart ? 'transparent' : '#E9ECEF',
                    marginVertical: 5,
                  }}>
                  <Image
                    source={localImage.Exercise_List}
                    style={{width: 15, height: 15}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <BottomSheetExercise
        isVisible={visible}
        setVisible={setVisible}
        exerciseData={allExercise}
        timerProgress={timerProgress}
        setPlayW={setPlayW}
        setPause={setPause}
        animatedProgress={animatedProgress}
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

export default Exercise;

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
