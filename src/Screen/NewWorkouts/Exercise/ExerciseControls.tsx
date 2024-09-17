import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppColor, Fonts} from '../../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import {ShadowStyle} from '../../../Component/Utilities/ShadowStyle';
import CircleProgress from '../../../Component/Utilities/ProgressCircle';
import FitIcon from '../../../Component/Utilities/FitIcon';
import FitText from '../../../Component/Utilities/FitText';
import {localImage} from '../../../Component/Image';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import TrackPlayer, {Capability} from 'react-native-track-player';
import KeepAwake from 'react-native-keep-awake';
import VersionNumber from 'react-native-version-number';
import Tts from 'react-native-tts';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import NativeAddTest from '../../../Component/NativeAddTest';
import ProgreesButton from '../../../Component/ProgressButton';
import {ActivityIndicator} from 'react-native';
import axios from 'axios';
import {setSoundOnOff} from '../../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {NewInterstitialAd} from '../../../Component/BannerAdd';

type ExerciseData = {
  exercise_bodypart: string;
  exercise_calories: string;
  exercise_equipment: string;
  exercise_gender: string;
  exercise_goal: string;
  exercise_id: number;
  exercise_image: string;
  exercise_image_link: string;
  exercise_injury: string;
  exercise_instructions: any;
  exercise_level: number;
  exercise_maxage: number;
  exercise_minage: number;
  exercise_reps: string;
  exercise_rest: string;
  exercise_sets: string;
  exercise_tips: string;
  exercise_title: string;
  exercise_video: string;
  exercise_workoutarea: string;
  fit_coins: number;
  video: string;
  week_day: string;
};

type ExerciseControlsProps = {
  pause: boolean;
  setPause: Function;
  setNum: Function;
  back: boolean;
  setBack: Function;
  allExercise: Array<ExerciseData>;
  currentExercise: ExerciseData;
  data?: any;
  day: number;
  exerciseNumber: number;
  trackerData: Array<any>;
  type: string;
  challenge?: boolean;
  getStoreVideoLoc?: any;
};
type ExerciseHookProps = {
  pause: boolean;
  back: boolean;
  setPause: Function;
  setShowSet: Function;
  currentSet: number;
  setCurrentSet: Function;
  allExercise: Array<ExerciseData>;
  progressPercent: number;
  setProgressPercent: Function;
  StartAnimation: Function;
  outNavigation: Function;
  getStoreVideoLoc?: any;
};

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
const StartAudio = async () => {
  await TrackPlayer.play();
};
const PauseAudio = async () => {
  await TrackPlayer.reset();
};

const initTts = async () => {
  const ttsStatus: any = await Tts.getInitStatus();
  if (!ttsStatus.isInitialized) {
    await Tts.setDefaultLanguage('en-IN');
    await Tts.setDucking(true);
    await Tts.setIgnoreSilentSwitch(true);
    await Tts.addEventListener('tts-finish', event => {
      Tts.stop();
    });
  }
};

const handleExerciseChange = (exerciseName: string, getStoreVideoLoc: any) => {
  if (getStoreVideoLoc.hasOwnProperty(exerciseName)) {
    // setCurrentVideo(getStoreVideoLoc[exerciseName]);
  } else {
    // setCurrentVideo('');
    console.error(`Exercise "${exerciseName}" video not found.`);
  }
};

const getReadyTime = 10;

const useExerciseHook = ({
  pause,
  setPause,
  allExercise,
  progressPercent,
  setProgressPercent,
  back,
  StartAnimation,
  currentSet,
  setCurrentSet,
  setShowSet,
  outNavigation,
  getStoreVideoLoc,
}: ExerciseHookProps) => {
  const [restStart, setRestStart] = useState(false);
  const [number, setNumber] = useState(0);
  const resetTime = parseInt(allExercise[number]?.exercise_rest.split(' ')[0]);
  const NUMBER_OF_SETS = parseInt(allExercise[number]?.exercise_sets);
  const EXERCISE_LENGTH = allExercise.length - 1;
  const hasSets = parseInt(allExercise[number]?.exercise_sets) >= 0;

  const [seconds, setSeconds] = useState(!restStart ? getReadyTime : resetTime);
  const [addClosed, setAddClosed] = useState(false);
  const exerciseTimerRef = useRef<any>(null);
  const animatedProgress = useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);

  const {initInterstitial, showInterstitialAd} =
    NewInterstitialAd(setAddClosed);

  const SPEAK = (words: string) => {
    getSoundOffOn && Tts.speak(words);
  };
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue:
        Math.round(progressPercent) == 100 ? 0 : Math.round(progressPercent),
      duration: 500, // Duration of the animation (500ms)
      useNativeDriver: true,
    }).start();
  }, [progressPercent]);

  const showBetweenADD = () => {
    if (addClosed) {
      console.log('TIMER', moment().format('mm:ss'), addClosed);
      setNumber(number + 1);
      setRestStart(true);
      setSeconds(getReadyTime);
      animatedProgress.setValue(0);
      handleExerciseChange(
        allExercise[number]?.exercise_title,
        getStoreVideoLoc,
      );
      setPause(true);
      setAddClosed(false);
      Platform.OS == 'android'
        ? Platform.Version != 34 && setupPlayer()
        : setupPlayer();
    } else {
      showInterstitialAd();
      console.log(
        'TIMER',
        moment().format('mm:ss'),
        number,
        restStart,
        addClosed,
        seconds,
      );
    }
  };

  useEffect(() => {
    if (pause) {
      if (exerciseTimerRef.current) {
        clearTimeout(exerciseTimerRef.current);
      }
      if (seconds > 0) {
        exerciseTimerRef.current = setTimeout(() => {
          if (restStart) {
            if (seconds == 4) StartAudio();
            if (seconds == getReadyTime && restStart) {
              SPEAK(
                `Get Ready for ${allExercise[number]?.exercise_title} Exercise`,
              );
            }
          } else {
            if (seconds == resetTime) SPEAK('Lets Go');
            if (seconds == 4) SPEAK('three.            two.');
            if (seconds == 2) SPEAK('one.    Done');
            if (seconds == 11) SPEAK('10 seconds to go');
          }
          if (!hasSets && seconds == 10) {
            initInterstitial();
          }
          if (seconds > 0) {
            setSeconds(seconds - 1);
            setProgressPercent(
              progressPercent + 100 / (restStart ? getReadyTime : resetTime),
            );
          }
        }, 1000);
      } else {
        console.log('ELSEASDAS');
        if (seconds == 0 && restStart) reset();
        else {
          if (hasSets) {
            if (currentSet < NUMBER_OF_SETS) {
              console.log('LESSS');
              if (currentSet + 1 == NUMBER_OF_SETS) initInterstitial();
              setShowSet(true);
              setCurrentSet(currentSet + 1);
              setSeconds(restStart ? getReadyTime : resetTime);
              clearTimeout(exerciseTimerRef.current);
              animatedProgress.setValue(0)
              StartAnimation();
            } else {
              if (number == EXERCISE_LENGTH) {
                console.log('DONE');
                clearTimeout(exerciseTimerRef.current);
                showInterstitialAd();
                outNavigation();
              } else {
                console.log('SET CO');
                setCurrentSet(0);
                showBetweenADD();
              }
            }
          } else {
            if (number == EXERCISE_LENGTH) {
              clearTimeout(exerciseTimerRef.current);
              showInterstitialAd();
              outNavigation();
            } else {
              console.log('No way');
              showBetweenADD();
            }
          }
        }
      }
    }
    console.warn(seconds, restStart, number, addClosed, currentSet);
    return () => clearTimeout(exerciseTimerRef.current);
  }, [
    seconds,
    pause,
    progressPercent,
    restStart,
    addClosed,
    number,
    currentSet,
  ]);

  const reset = () => {
    PauseAudio();
    animatedProgress.setValue(0);
    setRestStart(false);
    setProgressPercent(0);
    setSeconds(resetTime);
    console.log('RESET');
  };

  const prev = () => {
    if (number == 0) return;
    setShowSet(true);
    setCurrentSet(1);
    setPause(false);
    animatedProgress.setValue(0);
    setProgressPercent(0);
    clearTimeout(exerciseTimerRef.current);
    handleExerciseChange(
      allExercise[number - 1]?.exercise_title,
      getStoreVideoLoc,
    );
    setNumber(number - 1);
    setSeconds(resetTime);
  };
  const next = () => {
    setShowSet(true);
    setCurrentSet(1);
    setPause(false);
    setTimeout(() => {
      if (number == allExercise?.length - 1) return;
      animatedProgress.setValue(0);
      setProgressPercent(0);
      clearTimeout(exerciseTimerRef.current);
      handleExerciseChange(
        allExercise[number - 1]?.exercise_title,
        getStoreVideoLoc,
      );
      setNumber(number - 1);
      setSeconds(resetTime);
    }, 1500);
  };

  return {
    seconds,
    number,
    setNumber,
    animatedProgress,
    reset,
    prev,
    next,
    restStart,
    setRestStart,
  };
};

const ExerciseControls: FC<ExerciseControlsProps> = ({
  pause,
  setPause,
  allExercise,
  currentExercise,
  day,
  type,
  challenge,
  data,
  exerciseNumber,
  trackerData,
  getStoreVideoLoc,
  back,
  setBack,
  setNum,
}) => {
  const navigation: any = useNavigation();
  const getScreenAwake = useSelector((state: any) => state.getScreenAwake);
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state.enteredCurrentEvent,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [progressPercent, setProgressPercent] = useState(0);
  const [quitLoader, setQuitLoader] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [showSet, setShowSet] = useState(false);
  const [completed, setCompleted] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  const dispatch = useDispatch();
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
  const outNavigation = () => {
    setPause(false);
    type == 'focus' || type == 'bodypart'
      ? postSingleExerciseAPI()
      : postCurrentExerciseAPI();

    navigation.navigate('SaveDayExercise', {
      data,
      day,
      allExercise,
      type,
      challenge,
    });
  };
  const {
    seconds,
    number,
    setNumber,
    animatedProgress,
    reset,
    prev,
    next,
    restStart,
    setRestStart,
  } = useExerciseHook({
    pause,
    setPause,
    allExercise,
    progressPercent,
    setProgressPercent,
    back,
    StartAnimation,
    currentSet,
    setCurrentSet,
    setShowSet,
    outNavigation,
    getStoreVideoLoc,
  });

  useEffect(() => {
    setNum(number);
  }, [number]);

  useEffect(() => {
    if (getScreenAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }, [getScreenAwake]);

  useEffect(() => {
    setRestStart(true);
    initTts();
    if (exerciseNumber != -1 && number == 0) {
      setNumber(exerciseNumber);
      handleExerciseChange(currentExercise?.exercise_title, getStoreVideoLoc);
    }
    Platform.OS == 'android'
      ? Platform.Version != 34 && setupPlayer()
      : setupPlayer();
  }, []);

  const handlePrev = useCallback(() => {
    prev(); // Call the function here instead of directly in JSX
  }, [prev]);

  const handleNext = useCallback(() => {
    next(); // Call the function here instead of directly in JSX
  }, [next]);

  const quitFunction = () => {
    type == 'day'
      ? navigation.goBack()
      : type == 'custom'
      ? navigation.goBack()
      : deleteTrackExercise();
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
                {((number / allExercise.length) * 100).toFixed(0) + '%'}
              </Text>
              {'\n'}
              {' only '}
              <Text style={{color: '#f0013b'}}>
                {allExercise?.length - number + ' Exercises'}
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
                onPress={() => {
                  setBack(false);
                  setPause(!pause);
                }}
                bW={1}
              />

              <TouchableOpacity
                style={{alignSelf: 'center', marginTop: 5}}
                onPress={quitFunction}>
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
    navigation.goBack();
  };

  const postCurrentExerciseAPI = async () => {
    const payload = new FormData();
    payload.append('id', trackerData[number]?.id);

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
          //   icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data) {
        setCompleted(completed + 1);
        setProgressPercent(0);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
    }
  };
  const postSingleExerciseAPI = async () => {
    const payload = new FormData();
    payload.append('day', day);
    payload.append('exercise_id', allExercise[number]?.exercise_id);
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
          //   icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data) {
        setCompleted(completed + 1);
        setRestStart(true);
        setProgressPercent(0);
      }
    } catch (error) {
      console.error(error, 'PostSINGLExerciseAPIERror');
    }
  };
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return (
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
        style={[
          {
            // height: DeviceHeigth * 0.28,
            paddingTop: 10,
            paddingHorizontal: 20,
            backgroundColor: AppColor.WHITE,
            width: DeviceHeigth >= 1024 ? '95%' : '90%',
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
        {restStart ? (
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
              animatedProgress={animatedProgress}
              // strokeLinecap={timer == 0 ? 'butt' : 'round'}
              strokeWidth={25}
              changingColorsArray={['#530014', '#F0013B']}
              secondayCircleColor="#F0013B">
              <TouchableOpacity onPress={reset}>
                <Image
                  source={require('../../../Icon/Images/InAppRewards/SkipButton.png')}
                  style={{width: 40, height: 40}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </CircleProgress>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '80%',
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            <TouchableOpacity disabled={number == 0} onPress={handlePrev}>
              <FitIcon
                name="skip-previous"
                type="MaterialCommunityIcons"
                size={30}
                style={{
                  color: '#6B7280',
                  // opacity: number == 0 ? 0.5 : 1,
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
              onPress={handleNext}>
              <FitIcon
                name="skip-next"
                type="MaterialCommunityIcons"
                size={30}
                style={{
                  color: '#6B7280',
                  // opacity: number == allExercise?.length - 1 ? 0.5 : 1,
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={{height: DeviceHeigth >= 1024 ? 20 : 0}} />
        {restStart ? (
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
        ) : (
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
                  value={' Sound On'}
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
                  // setOpen(true);
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
                //   setRestStart(false);
                //   setVisible(true);
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                width: 30,
                height: 30,
                //   backgroundColor: restStart ? 'transparent' : '#E9ECEF',
                marginVertical: 5,
              }}>
              <Image
                source={localImage.Exercise_List}
                style={{width: 15, height: 15}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <PauseModal back={back} quitLoader={quitLoader} />
    </>
  );
};

export default ExerciseControls;

const styles = StyleSheet.create({});
