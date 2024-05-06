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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../../Component/Color';
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
import moment from 'moment';

import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
} from 'react-native-track-player';

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
    // title: 'song 1',
    // artist: 'XYZ',
    // artwork: localImage.Play3,
    url: require('../../../Icon/Images/Exercise_Timer.wav'),
    // url: route.params.item.exercise_mindset_audio,
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
  // console.log(Tts.voices().then(voices => console.log(voices)))
  const VideoRef = useRef();
  const [visible, setVisible] = useState(false);
  const [playW, setPlayW] = useState(0);
  const [demoW, setDemoW] = useState(0);
  const [demoS, setDemoS] = useState(0);
  const [number, setNumber] = useState(0);
  const [currentVideo, setCurrentVideo] = useState('');
  const [pause, setPause] = useState(false);
  const [demo, setDemo] = useState(false);
  const [demo1, setDemo1] = useState(false);
  const [open, setOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [timer, setTimer] = useState(10);
  const [timerS, setTimerS] = useState(10);
  const [restStart, setRestStart] = useState(false);
  const [randomCount, setRandomCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [currentData, setCurrentData] = useState(currentExercise);
  const [isLoading, setIsLoading] = useState(true);
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const allWorkoutData = useSelector((state: any) => state.allWorkoutData);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getSoundOffOn = useSelector((state: any) => state.getSoundOffOn);
  const [separateTimer, setSeparateTimer] = useState(false);
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const restTimerRef = useRef(0);
  const playTimerRef = useRef<any>(null);
  const [seconds, setSeconds] = useState(
    parseInt(currentData?.exercise_rest.split(' ')[0]),
  );
  const [isRunning, setIsRunning] = useState(false);
  const playbackState = usePlaybackState();

  const setupPlayer = async () => {
    try {
      await TrackPlayer.add(songs);
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    } catch (error) {
      console.log('Music Player Error', error);
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

  const startStopTimer = () => {
    setIsRunning(prevState => !prevState);
  };

  // Convert seconds into minutes and seconds

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  useEffect(() => {
    const initTts = async () => {
      const ttsStatus = await Tts.getInitStatus();
      if (!ttsStatus.isInitialized) {
        await Tts.setDefaultLanguage('en-IN');
        await Tts.setDucking(true);
        await Tts.setIgnoreSilentSwitch('ignore');
        await Tts.addEventListener('tts-finish', event => {
          // console.log('event',event)
          Tts.stop();
        });
        setTtsInitialized(true);
      }
    };

    initTts();
  }, []);
  const StartAudio = async (playbackState: any) => {
    console.log('playbackState', playbackState);
    await TrackPlayer.play();
  };
  const PauseAudio = async (playbackState: any) => {
    console.log('playbackState', playbackState);

    await TrackPlayer.reset();
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (!back) {
      separateTimer
        ? setTimeout(() => {
            if (timerS == 0) {
              setSeparateTimer(false);
              PauseAudio(playbackState);
              setPause(true);
              setDemoS(0);
              setDemo1(!demo1);
              setTimerS(10);
            } else if (timerS == 4) {
              // Tts.speak(`${timerS}`);
              setTimerS(timerS - 1);
              setDemoS(prev => prev + 10);
              StartAudio(playbackState);
            } else if (timerS == 10) {
              Tts.speak(
                `Get Ready for ${allExercise[0]?.exercise_title} Exercise`,
              );
              setTimerS(timerS - 1);
              setDemoS(prev => prev + 10);
            } else {
              setTimerS(timerS - 1);
              setDemoS(prev => prev + 10);
            }
          }, 1000)
        : restStart
        ? (restTimerRef.current = setTimeout(() => {
            if (timer === 0) {
              if (number == allExercise?.length - 1) return;
              setRestStart(false);
              setIsLoading(true);
              Tts.stop();
              const index = allExercise?.findIndex(
                (item: any) => item?.exercise_id == currentData?.exercise_id,
              );
              setSeconds(
                parseInt(allExercise[index + 1]?.exercise_rest.split(' ')[0]),
              );
              // setPre(15);
              // console.log('VIDEO LOCATIONS', getStoreVideoLoc);
              // if (number != 0) {
              setCurrentData(allExercise[index + 1]);
              setNumber(number + 1);
              handleExerciseChange(allExercise[index + 1]?.exercise_title);
              setRandomCount(randomCount + 1);

              setTimer(10);
              setDemoW(0);
              setDemo(!demo);
              PauseAudio(playbackState);
            } else if (timer == 4) {
              setTimer(timer - 1);
              setDemoW(demoW + 100 / timer);
              StartAudio(playbackState);
            } else if (timer == 10) {
              const index = allExercise?.findIndex(
                (item: any) => item?.exercise_id == currentData?.exercise_id,
              );
              index < allExercise?.length - 1 &&
                Tts.speak(
                  `Get Ready for ${
                    allExercise[index + 1]?.exercise_title
                  } Exercise`,
                );
              postCurrentExerciseAPI(index);
              setDemoW(demoW + 100 / timer);
              setTimer(timer - 1);
            } else if (demo) {
              setDemoW(demoW + 100 / timer);
              setTimer(timer - 1);
            }
            // getSoundOffOn && Tts.speak(`${timer - 1}`);
          }, 1000))
        : (playTimerRef.current = setTimeout(() => {
            if (playW >= 100 && randomCount == allExercise?.length) {
              navigation.goBack();
              clearTimeout(restTimerRef.current);
              clearTimeout(playTimerRef.current);
            }
            if (pause) {
              setPlayW(playW + 100 / parseInt(currentData?.exercise_rest));
              if (seconds > 1) {
                if (seconds <= 4) {
                  Tts.speak(`${seconds - 1}`);
                }
                setSeconds(prevSeconds => prevSeconds - 1);
              }
            }
            if (playW >= 65 && playW <= 68) Tts.speak('Ready to Finish');
            if (playW >= 100 && number == allExercise?.length - 1) {
              setPause(false);
              postCurrentExerciseAPI(number);
              if (skipCount == 0) {
                navigation.navigate('SaveDayExercise', {
                  data,
                  day,
                  allExercise,
                  type,
                  challenge,
                });

                clearTimeout(restTimerRef.current);
                clearTimeout(playTimerRef.current);
              } else {
                navigation.goBack();
                clearTimeout(restTimerRef.current);
                clearTimeout(playTimerRef.current);
              }
            } else if (playW >= 100 && number < allExercise?.length - 1) {
              setPause(false);
              setRestStart(true);
              setDemoW(0);
              setupPlayer();
            }
          }, 1000));
    } else {
    }
  }, [
    playW,
    pause,
    currentData,
    timer,
    back,
    separateTimer,
    timerS,
    demo,
    demo1,
  ]);
  useEffect(() => {
    if (exerciseNumber != -1 && number == 0) {
      setNumber(exerciseNumber);
      setCurrentData(currentExercise);
      handleExerciseChange(currentExercise?.exercise_title);
      setSeparateTimer(true);
    } else setRestStart(true);
    setupPlayer();
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
    const unsubscribe1 = navigation.addListener(
      'hardwareBackPress',
      (e: any) => {
        // Check if goBack has been called
        if (!e.data.action) {
          setPause(false);
          setDemo(false);
          setDemoS(false);
          setBack(true);
        }
      },
    );

    return () => {
      unsubscribe;
      unsubscribe1;
    };
  }, [navigation]);

  // Function to check if the currently opened exercise exists in the provided JSON object
  const handleExerciseChange = (exerciseName: string) => {
    if (getStoreVideoLoc.hasOwnProperty(exerciseName)) {
      setCurrentVideo(getStoreVideoLoc[exerciseName]);
      // console.log('CURRENT', getStoreVideoLoc[exerciseName]);
    } else {
      setCurrentVideo('');
      console.error(`Exercise "${exerciseName}" video not found.`);
    }
  };
  const FAB = ({icon}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (icon == 'format-list-bulleted') {
            setRestStart(false);
            setVisible(true);
          }
          if (icon == 'info-outline') {
            // setVisible(false)
            setOpen(true);
          }
          // : ÷null;
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: restStart ? 50 : 30,
          width: restStart ? 50 : 30,
          height: restStart ? 50 : 30,
          backgroundColor: restStart ? 'transparent' : '#D9D9D9B2',
          marginVertical: 5,
          marginTop: restStart ? (Platform.OS == 'ios' ? 25 : 10) : 5,
          alignSelf: restStart ? 'flex-end' : 'auto',
        }}>
        {icon == 'info-outline' ? (
          <MaterialIcons
            name={icon}
            size={restStart ? 40 : 20}
            color={AppColor.INPUTTEXTCOLOR}
          />
        ) : (
          <Icons
            name={icon}
            size={restStart ? 40 : 20}
            color={restStart ? AppColor.WHITE : AppColor.INPUTTEXTCOLOR}
          />
        )}
      </TouchableOpacity>
    );
  };
  const deleteTrackExercise = async () => {
    const payload = new FormData();
    payload.append('day', WeekArray[day]);
    payload.append('workout_id', `-${day + 1}`);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url:
          NewAppapi.DELETE_TRACK_EXERCISE +
          '?workout_id=' +
          `-${day + 1}` +
          '&user_id=' +
          getUserDataDetails?.id +
          '&current_date=' +
          moment().format('YYYY-MM-DD'),
      });
    } catch (error) {
      console.log('DELE TRACK ERRR', error);
    }
    navigation.goBack();
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

    // payload.append('day', day);
    //   payload.append(
    //     'workout_id',
    //     data?.workout_id == undefined
    //       ? data?.custom_workout_id
    //       : data?.workout_id,
    //   );

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
        // console.log(res.data, trackerData[index], payload);
        setCurrentData(allExercise[index]);
        setRestStart(true);
        setPlayW(0);
      }
    } catch (error) {
      console.error(error?.response, 'PostDaysAPIERror');
    }
  };

  const PauseModal = ({back}: any) => {
    return (
      <Modal
        visible={back}
        onRequestClose={() => setBack(false)}
        animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: AppColor.WHITE,

            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: DeviceWidth / 2,
            }}>
            <GradientText
              text={'Hold on!'}
              fontWeight={'700'}
              fontSize={32}
              width={DeviceWidth}
              x={30}
              alignSelf
            />
            <GradientText
              alignSelf
              width={DeviceWidth}
              text={`Don't give up!`}
              fontWeight={'700'}
              fontSize={32}
              x={-2}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              fontFamily: 'Poppins',
              lineHeight: 30,
              marginTop: 20,
              color: AppColor.BLACK,
            }}>
            {`You have finished `}
            <Text style={{color: AppColor.RED}}>
              {((number / parseInt(allExercise?.length)) * 100).toFixed(0) +
                '%'}
            </Text>
            {'\n'}
            {' only '}
            <Text style={{color: AppColor.RED}}>
              {parseInt(allExercise?.length) - number + ' Exercises'}
            </Text>
            {' left '}
          </Text>
          <View style={{marginTop: 30}}>
            <ProgreesButton
              text="Resume"
              h={55}
              bR={30}
              flex={-1}
              mV={20}
              onPress={() => setBack(false)}
              bW={1}
            />
            <ProgreesButton
              onPress={() => setPlayW(0)}
              text="Restart this Exercise"
              h={55}
              bR={30}
              flex={-1}
              colors={['#F3F3F3', '#F3F3F3']}
              textStyle={{
                fontSize: 20,
                fontFamily: 'Poppins',
                lineHeight: 30,
                color: AppColor.BLACK,
                fontWeight: '700',
              }}
              bC="white"
              bW={1}
            />
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: 20}}
              onPress={() => {
                type == 'day' ? navigation.goBack() : deleteTrackExercise();
              }}>
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
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
        paddingHorizontal: 20,
      }}>
      {separateTimer ? (
        <>
          <View style={styles.temp} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop:
                Platform.OS == 'ios'
                  ? DeviceHeigth * 0.02
                  : -DeviceHeigth * 0.03,
            }}>
            <TouchableOpacity
              onPress={() => {
                setBack(true);
              }}
              style={{
                width: 40,
              }}>
              <Icons
                name={'chevron-left'}
                size={30}
                color={
                  number == allExercise?.length
                    ? AppColor.WHITE
                    : AppColor.INPUTTEXTCOLOR
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: DeviceHeigth * 0.5,
              // marginTop: -DeviceHeigth * 0.06,
              zIndex: -1,
            }}>
            <Video
              source={{
                uri: separateTimer
                  ? getStoreVideoLoc[allExercise[0]?.exercise_title]
                  : getStoreVideoLoc[allExercise[number + 1]?.exercise_title],
              }}
              onReadyForDisplay={() => {
                setDemo1(true);
                setIsLoading(false);
              }}
              onLoad={() => {
                setIsLoading(false);
                setDemo1(true);
              }}
              // onVideoLoad={() =>() }
              // onVideoLoadStart={() => }
              paused={!demo1}
              onPlaybackResume={() => {
                setDemo1(true);
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

          <View
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
              GET READY
            </Text>
          </View>
          <Text
            style={[
              styles.name,
              {width: DeviceWidth * 0.7, fontSize: 25, fontWeight: '700'},
            ]}>
            {separateTimer
              ? allExercise[0]?.exercise_title
              : allExercise[number + 1]?.exercise_title}
          </Text>
          <Text
            style={[
              styles.name,
              {
                width: DeviceWidth * 0.7,
                fontSize: 25,
                fontWeight: '700',
                paddingTop: 10,
              },
            ]}>
            00:
            {timerS < 10 ? '0' + timerS : timerS}
          </Text>
          <Play
            play={!demo1}
            fill={100 - demoS}
            h={80}
            mB={DeviceHeigth * 0.02}
            playy={() => {
              setDemo1(demo1);
            }}
            next={() => {}}
            back={() => {}}
            colors={['#941000', '#941000']}
          />
        </>
      ) : restStart ? (
        <>
          <View style={styles.temp} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop:
                Platform.OS == 'ios'
                  ? DeviceHeigth * 0.02
                  : -DeviceHeigth * 0.03,
            }}>
            <TouchableOpacity
              onPress={() => {
                setBack(true);
              }}
              style={{
                width: 40,
              }}>
              <Icons
                name={'chevron-left'}
                size={30}
                color={
                  number == allExercise?.length
                    ? AppColor.WHITE
                    : AppColor.INPUTTEXTCOLOR
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: DeviceHeigth * 0.5,
              // marginTop: -DeviceHeigth * 0.06,
              zIndex: -1,
            }}>
            <Video
              source={{
                uri: separateTimer
                  ? getStoreVideoLoc[allExercise[0]?.exercise_title]
                  : getStoreVideoLoc[allExercise[number + 1]?.exercise_title],
              }}
              onReadyForDisplay={() => {
                setDemo(true);
                setIsLoading(false);
              }}
              onLoad={() => {
                setIsLoading(false);
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

          <View
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
              GET READY
            </Text>
          </View>
          <Text
            style={[
              styles.name,
              {width: DeviceWidth * 0.7, fontSize: 25, fontWeight: '700'},
            ]}>
            {separateTimer
              ? allExercise[0]?.exercise_title
              : allExercise[number + 1]?.exercise_title}
          </Text>
          <Text
            style={[
              styles.name,
              {
                width: DeviceWidth * 0.7,
                fontSize: 25,
                fontWeight: '700',
                paddingTop: 10,
              },
            ]}>
            00:
            {timer < 10 ? '0' + timer : timer}
          </Text>
          <Play
            play={!demo}
            fill={100 - demoW}
            h={80}
            mB={DeviceHeigth * 0.02}
            playy={() => {
              setDemo(demo);
            }}
            next={() => {}}
            back={() => {}}
            // colors={['blue', 'blue']}
            colors={['#941000', '#941000']}
          />
        </>
      ) : (
        <>
          <ExerciseProgressBar
            ExerciseData={allExercise}
            INDEX={number}
            time={currentData?.exercise_rest == 1 ? 60 : 1}
            w={restStart ? '100%' : `${playW}%`}
            color={restStart ? AppColor.WHITE : AppColor.RED}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop:
                Platform.OS == 'ios'
                  ? DeviceHeigth * 0.02
                  : -DeviceHeigth * 0.03,
            }}>
            <TouchableOpacity
              onPress={() => {
                setBack(true);
              }}
              style={{
                width: 40,
              }}>
              <Icons
                name={'chevron-left'}
                size={30}
                color={
                  number == allExercise?.length
                    ? AppColor.WHITE
                    : AppColor.INPUTTEXTCOLOR
                }
              />
            </TouchableOpacity>
            <View style={{alignSelf: 'flex-end'}}>
              <FAB icon="format-list-bulleted" />
              <FAB icon="info-outline" />
            </View>
          </View>
          <View
            style={{
              height: DeviceHeigth * 0.5,
              marginTop: -DeviceHeigth * 0.03,
              zIndex: -1,
            }}>
            {/* <Text>{trackerData[number]?.id}</Text> */}

            {/* {isLoading && (
              <ActivityIndicator
                style={[styles.loader, {transform: [{scaleX: 2}, {scaleY: 2}]}]}
                // size={Platform.OS=='android'?DeviceHeigth*0.1:DeviceHeigth*0.1}
                size="large"
                color="red"
              />
            )} */}
            <Video
              source={{
                uri: currentVideo,
              }}
              onReadyForDisplay={() => {
                setPause(true);
                setIsLoading(false);
              }}
              onLoad={() => {
                setIsLoading(false);
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
                height: DeviceHeigth * 0.4,
                alignSelf: 'center',
                top: 60,
              }}
            />
          </View>

          <View
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
          </View>
          <Play
            play={!pause}
            fill={100 - playW}
            h={80}
            mB={DeviceHeigth * 0.02}
            playy={() => {
              setPause(!pause);
            }}
            next={() => {
              setPause(!pause);
              // setDefaultPre(0);
              setPlayW(prevTimer => 0);
              setPause(false);
              clearInterval(playTimerRef.current);
              setTimeout(() => {
                if (number == allExercise?.length - 1) return;
                const index = allExercise?.findIndex(
                  (item: any) => item?.exercise_id == currentData?.exercise_id,
                );
                // postCurrentExerciseAPI(index + 1);
                setNumber(number + 1);
                setSkipCount(skipCount + 1);
                setCurrentData(allExercise[index + 1]);
                handleExerciseChange(allExercise[index + 1]?.exercise_title);
                setSeconds(
                  parseInt(allExercise[index + 1]?.exercise_rest.split(' ')[0]),
                );
              }, 1500);
            }}
            back={() => {
              if (number == 0) return;
              setPlayW(prevTimer => 0);
              setPause(false);
              clearInterval(playTimerRef.current);
              const index = allExercise?.findIndex(
                (item: any) => item?.exercise_id == currentData?.exercise_id,
              );
              // postCurrentExerciseAPI(index - 1);
              setCurrentData(allExercise[index - 1]);
              handleExerciseChange(allExercise[index - 1]?.exercise_title);
              setNumber(number - 1);
              setSeconds(
                parseInt(allExercise[index - 1]?.exercise_rest.split(' ')[0]),
              );
            }}
            colors={pause ? ['#941000', '#941000'] : ['#999999', '#D5191A']}
          />
        </>
      )}
      <BottomSheetExercise
        isVisible={visible}
        setVisible={setVisible}
        exerciseData={allExercise}
        setCurrentData={setCurrentData}
        setPlayW={setPlayW}
        setPause={setPause}
        setRandomCount={setRandomCount}
        playTimerRef={playTimerRef}
        currentExercise={currentExercise}
        setSeconds={setSeconds}
        handleExerciseChange={handleExerciseChange}
      />
      <PauseModal back={back} />

      <WorkoutsDescription open={open} setOpen={setOpen} data={currentData} />
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
