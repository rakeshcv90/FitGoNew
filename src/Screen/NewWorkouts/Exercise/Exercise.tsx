import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
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

const Exercise = ({navigation, route}: any) => {
  const {allExercise, currentExercise, data, day, exerciseNumber, trackerData} =
    route.params;
  const VideoRef = useRef();
  const [visible, setVisible] = useState(false);
  const [playW, setPlayW] = useState(0);
  const [number, setNumber] = useState(0);
  const [defaultPre, setDefaultPre] = useState(1);
  const [pause, setPause] = useState(false);
  const [open, setOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [timer, setTimer] = useState(15);
  const [restStart, setRestStart] = useState(false);
  const [exerciseDoneIDs, setExerciseDoneIDs] = useState<Array<any>>([]);
  const [skipCount, setSkipCount] = useState(0);
  const [currentData, setCurrentData] = useState(currentExercise);
  const [isLoading, setIsLoading] = useState(true);
  const {allWorkoutData, getUserDataDetails, getSoundOffOn} = useSelector(
    (state: any) => state,
  );
  const [separateTimer, setSeparateTimer] = useState(timer);
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const restTimerRef = useRef(null);
  const seprateTimerRef = useRef(null);
  useEffect(() => {
    const initTts = async () => {
      const ttsStatus = await Tts.getInitStatus();
      if (!ttsStatus.isInitialized) {
        await Tts.setDefaultLanguage('en-US');
        await Tts.setDucking(true);
        await Tts.setIgnoreSilentSwitch('ignore');
        await Tts.addEventListener('tts-start', event =>
          console.log('Start', event),
        );
        await Tts.addEventListener('tts-finish', event =>
          console.log('Finish', event),
        );
        await Tts.addEventListener('tts-cancel', event =>
          console.log('Cancel', event),
        );
        setTtsInitialized(true);
      }
    };

    initTts();
  }, []);
  // console.log("currentDatatatata",allExercise.length,exerciseNumber)
  // useEffect(() => {
  //   const TTStimer = async () => {
  //     if (
  //       restStart &&
  //       allExercise.length - 1 != number &&
  //       getSoundOffOn == true
  //     ) {
  //       if (separateTimer > 0&&timer==separateTimer) {
  //         seprateTimerRef.current= setTimeout(() => {
  //           setSeparateTimer(separateTimer - 1);
  //           Tts.speak(`${separateTimer}`);
  //         }, 1000);
  //         return () => clearInterval(seprateTimerRef.current);
  //       }
  //     } else {
  //       setSeparateTimer(timer);
  //     }
  //   };
  //   TTStimer();
  // }, [separateTimer, restStart]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!back) {
      restStart
        ? (restTimerRef.current = setTimeout(() => {
            if (timer === 0) {
              if (number == allExercise?.length - 1) return;
              setRestStart(false);
              setIsLoading(true)
              Tts.stop();
              const index = allExercise?.findIndex(
                (item: any) => item?.exercise_id == currentData?.exercise_id,
              );
              console.log(allExercise[index + 1], 'allExercise[index + 1]');
              setCurrentData(allExercise[index + 1]);
              // setPre(15);
              setNumber(number + 1);
              setTimer(15);
            } else if (timer == 15) {
              const index = allExercise?.findIndex(
                (item: any) => item?.exercise_id == currentData?.exercise_id,
              );
              postCurrentExerciseAPI(index);
              setTimer(timer - 1);
              setPlayW(0);
            } else {
              setTimer(timer - 1);
            }
            getSoundOffOn && Tts.speak(`${timer - 1}`);
          }, 1000))
        : setTimeout(() => {
            if (pause)
              setPlayW(playW + 100 / parseInt(currentData?.exercise_rest));
            if (playW >= 100 && number == allExercise?.length - 1) {
              console.log(number + 1, allExercise?.length);
              setPause(false);
              postCurrentExerciseAPI(number);
              if (skipCount == 0)
                navigation.navigate('SaveDayExercise', {data, day});
              else navigation.goBack();
            } else if (playW >= 100 && number < allExercise?.length - 1) {
              console.log(number + 1, allExercise?.length);
              setPause(false);
              setRestStart(true);
            }
          }, 1000);
    } else {
      console.log('MESSSSS', back, restStart);
    }
    return () => {
      clearInterval(restTimerRef.current);
    };
  }, [playW, pause, currentData, timer, back]);
  useEffect(() => {
    if (exerciseNumber != -1 && number == 0) {
      setNumber(exerciseNumber);
      setCurrentData(currentExercise);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      // Check if goBack has been called
      if (!e.data.action) {
        setPause(false);
        console.log('navigation.goBack was called');
        setBack(true);
      }
    });

    return unsubscribe;
  }, [navigation]);

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
          marginTop: restStart ? 25 : 5,
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

  const postCurrentExerciseAPI = async (index: number) => {
    const payload = new FormData();
    payload.append('id', trackerData[index]?.id);
    payload.append('day', day);
    payload.append('workout_id', data?.workout_id);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('version', VersionNumber.appVersion);
    try {
      const res = await axios({
        url: NewAppapi.POST_EXERCISE,
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
        setCurrentData(allExercise[index]);
        setRestStart(true);
        setPlayW(0);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
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
              width={300}
              x={6}
            />
            <GradientText
              // x={DeviceWidth * 0.32}
              width={400}
              text={`Don't give up!`}
              fontWeight={'700'}
              fontSize={32}
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
              onPress={() => navigation.goBack()}>
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
        backgroundColor: restStart ? AppColor.RED : AppColor.WHITE,
        paddingHorizontal: 20,
      }}>
      <ExerciseProgressBar
        ExerciseData={allExercise}
        INDEX={number}
        time={currentData?.exercise_rest == 1 ? 60 : 1}
        w={restStart ? '100%' : `${playW}%`}
        color={restStart ? AppColor.WHITE : AppColor.RED}
      />
      {restStart ? (
        <View style={{flex: 1}}>
          <FAB icon="format-list-bulleted" />
          <View style={{alignSelf: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: 'Poppins',
                lineHeight: 30,
                color: AppColor.WHITE,
                fontWeight: '700',
              }}>
              Rest
            </Text>
            <Text
              style={{
                fontSize: 48,
                fontFamily: 'Poppins',
                lineHeight: 60,
                color: AppColor.WHITE,
                fontWeight: '700',
              }}>
              {'00:' + timer}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  // Tts.stop();
                  setTimer(prevTimer => prevTimer + 30);
                  setSeparateTimer(prevTimer => prevTimer + 30);
                  // Tts.speak(`${separateTimer}`);
                }}
                style={{
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FCFCFC61',
                  paddingHorizontal: 20,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    lineHeight: 30,
                    color: AppColor.WHITE,
                    fontWeight: '700',
                  }}>
                  +30s
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={number == allExercise?.length - 1}
                onPress={() => {
                  
                  if (number == allExercise?.length - 1) return;
                  else {
                    setRestStart(prev => false);
                    const index = allExercise?.findIndex(
                      (item: any) =>
                        item?.exercise_id == currentData?.exercise_id,
                    );
                    setExerciseDoneIDs([
                      ...exerciseDoneIDs,
                      currentData?.exercise_id,
                    ]);
                   // postCurrentExerciseAPI(index + 1);
                    setNumber(number + 1);
                    setTimer(15);
                    setSkipCount(skipCount+1)
                    setPlayW(prevTimer => 0);
                    Tts.stop();
                  }
                  setIsLoading(true)
                }}
                style={{
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    number == allExercise?.length - 1 ? '#d9d9d9' : '#Fff',
                  paddingHorizontal: 20,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    lineHeight: 30,
                    color: AppColor.RED,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
                width: DeviceWidth,
                marginLeft: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  lineHeight: 30,
                  marginTop: DeviceHeigth * 0.1,
                  color: AppColor.WHITE,
                }}>
                {`Next `}
                {number + 1 + '/' + allExercise?.length}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  lineHeight: 30,
                  color: AppColor.WHITE,
                }}>
                {allExercise[number + 1]?.exercise_title + ' '}
                <AntIcons
                  name="questioncircleo"
                  color={AppColor.WHITE}
                  size={15}
                  onPress={() => setOpen(true)}
                />
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <Image
              source={{uri: allExercise[number + 1]?.exercise_image}}
              style={StyleSheet.absoluteFillObject}
              resizeMode="contain"
            />
          </View>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: DeviceHeigth * 0.04,
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
              {/* <FAB icon="music" /> */}
            </View>
          </View>
          <View
            style={{
              height: DeviceHeigth * 0.5,
              marginTop: -DeviceHeigth * 0.04,
            }}>
            {/* <Text>{trackerData[number]?.id}</Text> */}

            {isLoading && (
              <ActivityIndicator
                style={[styles.loader,{ transform: [{ scaleX: 2 }, { scaleY: 2}] }]}
                // size={Platform.OS=='android'?DeviceHeigth*0.1:DeviceHeigth*0.1}
                size="large"
                color="red"
              />
          )}
            <Video
              source={{
                uri: currentData?.exercise_video,
              }}
              onReadyForDisplay={() => {
                setPause(true);
              }}
              onLoad={() => {
                setIsLoading(false)
                setPause(true);
              }}
          
              onVideoLoad={() => console.log('third')}
              onVideoLoadStart={() => console.log('forth')}
              paused={!pause}
              onPlaybackResume={() => {
                console.log(pause);
                setPause(true);
              }}
              repeat={true}
              resizeMode="contain"
              style={{
                width: DeviceWidth,
                height: DeviceHeigth * 0.5,
                alignSelf: 'center',
              }}
            />
          </View>
          <Text style={styles.head}>Get Ready</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={[styles.name, {width: DeviceWidth * 0.7}]}>
              {currentData?.exercise_title}
            </Text>
            <Text style={[styles.name, {color: '#505050'}]}>
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
            fill={`${100 - playW}%`}
            h={80}
            playy={() => {
              setPause(!pause);
            }}
            next={() => {
              setPause(!pause);
              // setDefaultPre(0);
              setPlayW(prevTimer => 0);
              setPause(false);
              setTimeout(() => {
                if (number == allExercise?.length - 1) return;
                const index = allExercise?.findIndex(
                  (item: any) => item?.exercise_id == currentData?.exercise_id,
                );
                // postCurrentExerciseAPI(index + 1);
                setNumber(number + 1);
                setSkipCount(skipCount + 1);
                setCurrentData(allExercise[index + 1]);
              }, 1500);
            }}
            back={() => {
              if (number == 0) return;
              setPlayW(prevTimer => 0);
              setPause(false);
              const index = allExercise?.findIndex(
                (item: any) => item?.exercise_id == currentData?.exercise_id,
              );
              // postCurrentExerciseAPI(index - 1);
              setCurrentData(allExercise[index - 1]);
              setNumber(number - 1);
            }}
            colors={pause ? ['#941000', '#941000'] : ['#999999', '#D5191A']}
          />
          <BottomSheetExercise
            isVisible={visible}
            setVisible={setVisible}
            exerciseData={allExercise}
            setCurrentData={setCurrentData}
          />
        </>
      )}
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
    lineHeight: 40,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins',
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
    alignSelf:'center',

   marginVertical:DeviceHeigth*0.2,

   

  },
});
