import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated as NativeAnimated,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {clamp, mix, polar2Canvas, withBouncing} from 'react-native-redash';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import TrackPlayer, {
  Capability,
  usePlaybackState,
  useProgress,
  State,
  RepeatMode,
} from 'react-native-track-player';
import {localImage} from '../../Component/Image';
import {Button} from 'react-native-paper';
import NewButton from '../../Component/NewButton';
const Radius = DeviceWidth / 4;
import CircularProgress, {
  CircularProgressBase,
} from 'react-native-circular-progress-indicator';
import AnimatedLottieView from 'lottie-react-native';
import {duration} from 'moment';
import {Image} from 'react-native';
import backgroundServer from 'react-native-background-actions';
import QuitModal from './QuitModal';
import {useSelector} from 'react-redux';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ActivityLoader from '../../Component/ActivityLoader';
interface CircleProps {
  index: number;
  progress: Animated.SharedValue<number>;
  goesDown: Animated.SharedValue<boolean>;
}

const transform = (progress: number, index: number) => {
  'worklet';
  const theta = (index * Math.PI) / 3;
  const {x, y} = polar2Canvas({theta, radius: Radius}, {x: 0, y: 0});
  const translateX = mix(progress, 0, x);
  const translateY = mix(progress, 0, y);
  const scale = mix(progress, 0.3, 1);

  return [{translateX}, {translateY}, {scale}];
};

const Breathe = ({navigation, route}) => {
  const slotCoins = route?.params?.slotCoins;
  const type = route?.params?.type;
  const offerType = route?.params?.offerType;
  const progress = useSharedValue(0);
  const goesDown = useSharedValue(false);
  const [pause, setPause] = useState(true);
  const [loaded, setLoaded] = useState(true);
  const [start, setStart] = useState(3);
  const scaleAnimation = useSharedValue(0);
  const fadeAnimation = useSharedValue(0.5);
  const textFadeAnimation = useSharedValue(1);
  const textYAimation1 = useSharedValue(50);
  const textFadeAnimation1 = useSharedValue(1);
  const textYAimation2 = useSharedValue(50);
  const textFadeAnimation2 = useSharedValue(0);
  const textYAimation3 = useSharedValue(50);
  const textFadeAnimation3 = useSharedValue(0);
  const [startBreathing, setStartbreathing] = useState(false);
  const movecircleonAnimationEndX = useSharedValue(0);
  const movecircleonAnimationEndY = useSharedValue(0);
  const wellDoneTextFade = useSharedValue(0);
  const wellDoneTextMove = useSharedValue(0);
  const fadetimer = useSharedValue(1);
  const [enableClick, setEnableClick] = useState(false);
  const scale3 = useSharedValue(0.9);
  const fade3 = useSharedValue(1);
  const cardFallAnimation1 = useSharedValue(-DeviceHeigth);
  const cardFallAnimation2 = useSharedValue(-DeviceHeigth);
  const fallLetsStart = useSharedValue(-DeviceHeigth);
  const collectButtonOffset = useSharedValue(0);
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const quitCardAnimation = useSharedValue(-DeviceHeigth);
  const AddCoinsApi = async () => {
    setLoaded(false);
    let payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('status', 'done');
    try {
      const res = await axios(NewAppapi.SEND_BREATHE_COINS, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (res?.data) {
        getLeaderboardDataAPI();
      }
    } catch (error) {
      console.log(error, 'breathe coin add api ');
      setLoaded(true);
    }
  };
  const getLeaderboardDataAPI = async () => {
    try {
      const url =
        'https://fitme.cvinfotech.in/adserver/public/api/test_leader_board';
      const result = await axios({
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });

      if (result?.data) {
        const myRank = result.data?.data?.findIndex(
          item => item?.id == getUserDataDetails?.id, // static for testing purpose
        );
        setLoaded(true);
        if (type == 'OfferPage') {
          navigation.navigate('OfferPage');
        } else {
          navigation.navigate('WorkoutCompleted', {
            type: 'complete',
            rank: result.data?.data[myRank]?.rank,
            slotCoins: slotCoins,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  const songs = [
    {
      title: 'Breathing Sound',
      artist: '---',
      artwork: localImage.breathingSound,
      url: localImage.breathingSound,
      // url: getStoreVideoLoc[route.params.item.id],
    },
  ];
  const setupPlayer = async () => {
    try {
      await TrackPlayer.reset()
      await TrackPlayer.add(songs);
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    } catch (error) {
      console.log('Music Player Error Meditation Exercise', error);
    }
  };

  const buttonClick = () => {
    setEnableClick(true);
  };
  const play = async () => {
    await TrackPlayer.play();
  };
  const pauseMusic = async () => {
    await TrackPlayer.stop();
  };
  const countdownAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleAnimation.value}],
      opacity: fadeAnimation.value,
    };
  }, [start]);
  const EnableTimer = () => {
    setStartbreathing(true);
  };
  // last function of countdown
  const handleFallLetsStart = () => {
    setTimeout(() => {
      fallLetsStart.value = withTiming(DeviceHeigth, {duration: 500}, () => {
        runOnJS(EnableTimer)();
      });
    }, 500);
  };
  const handlecardAnimation2 = () => {
    setTimeout(() => {
      cardFallAnimation2.value = withTiming(
        DeviceHeigth,
        {duration: 500},
        () => {
          fallLetsStart.value = withSpring(0, {}, () => {
            runOnJS(handleFallLetsStart)();
          });
        },
      );
    }, 1500);
  };
  const handleCardAnimation1 = () => {
    setTimeout(() => {
      cardFallAnimation1.value = withTiming(
        DeviceHeigth,
        {duration: 500},
        () => {
          cardFallAnimation2.value = withSpring(0, {}, () => {
            runOnJS(handlecardAnimation2)();
          });
        },
      );
    }, 1500);
  };
  const handleGetStarted = () => {
    scale3.value = withTiming(0, {duration: 500});
    fade3.value = withTiming(0, {duration: 500});
    textFadeAnimation.value = withTiming(0, {duration: 500}, () => {
      cardFallAnimation1.value = withSpring(0, {}, () => {
        runOnJS(handleCardAnimation1)();
      });
    });
  };
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (start > 0 && startBreathing) {
      scaleAnimation.value = withTiming(3, {duration: 1000});
      fadeAnimation.value = withTiming(1, {duration: 1000});
      intervalId = setInterval(() => {
        setStart(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setPause(false); // Start the main animation after countdown
            return 0;
          }
          // reseting animation for next cycle
          scaleAnimation.value = 0;
          fadeAnimation.value = 0.5;
          return prev - 1;
        });
      }, 1000);
    } else {
      scale3.value = withRepeat(withTiming(1.3, {duration: 500}), -1, true);
    }
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [start, startBreathing]);
  useEffect(() => {
    if (!pause) {
      setupPlayer();
      play();
      textYAimation1.value = withTiming(0, {duration: 2500});
      //fade for text1
      textFadeAnimation1.value = withTiming(0, {duration: 2500}, () => {
        // when fade ends text2 will be visible
        textYAimation2.value = withTiming(0, {duration: 2500});
        // to fade in & fade out text2
        textFadeAnimation2.value = withTiming(1, {duration: 300}, () => {
          textFadeAnimation2.value = withTiming(0, {duration: 2000}, () => {
            //now text3 will be visible
            textYAimation3.value = withTiming(0, {duration: 2000});
            textFadeAnimation3.value = withTiming(1, {duration: 2000});
          });
        });
      });
      progress.value = withRepeat(
        withTiming(
          1,
          {duration: 2650, easing: Easing.bezier(0.5, 0, 0.5, 1)},
          () => {
            goesDown.value = !goesDown.value;
          },
        ),
        12,
        true,
        () => {
          runOnJS(pauseMusic)();
          movecircleonAnimationEndY.value = withTiming(
            -DeviceHeigth * 0.15,
            {
              duration: 1000,
            },
            () => {
              progress.value = withTiming(0.15, {duration: 1000});
            },
          );
          wellDoneTextFade.value = withTiming(1, {duration: 1000});
          wellDoneTextMove.value = withTiming(
            -DeviceHeigth * 0.27,
            {
              duration: 1000,
            },
            () => {
              runOnJS(buttonClick)();
              collectButtonOffset.value = withTiming(1, {duration: 500});
            },
          );
          textFadeAnimation3.value = withTiming(0, {duration: 1000});
          textYAimation3.value = withTiming(-50, {duration: 1000});
          fadetimer.value = withTiming(0, {duration: 200});
        },
      );
    } else {
      pauseMusic();
    }
  }, [progress, goesDown, pause]);
  const Circle = ({index, progress, goesDown}: CircleProps) => {
    const animationStyle = useAnimatedStyle(() => {
      return {
        transform: transform(progress.value, index),
      };
    });
    const animationStyle2 = useAnimatedStyle(() => {
      const progress1 = goesDown.value
        ? clamp(progress.value + 0.1, 0, 1)
        : progress.value;
      const opacity = interpolate(progress.value, [0.6, 1], [0, 0.5]);
      return {opacity, transform: transform(progress1, index)};
    });

    return (
      <>
        <Animated.View style={[styles.container, animationStyle2]}>
          <View style={styles.circle} />
        </Animated.View>
        <Animated.View style={[styles.container, animationStyle]}>
          <View style={styles.circle} />
        </Animated.View>
      </>
    );
  };
  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${mix(progress.value, -Math.PI, 0)}rad`}],
  }));
  // inhale exhale animation
  const textAnimationStyle = useAnimatedStyle(() => ({
    opacity: textFadeAnimation.value,
  }));
  const textAnimationStyle1 = useAnimatedStyle(() => ({
    opacity: textFadeAnimation1.value,
    transform: [{translateY: textYAimation1.value}],
  }));
  const textAnimationStyle2 = useAnimatedStyle(() => ({
    opacity: textFadeAnimation2.value,
    transform: [{translateY: textYAimation2.value}],
  }));
  const textAnimationStyle3 = useAnimatedStyle(() => ({
    opacity: textFadeAnimation3.value,
    transform: [{translateY: textYAimation3.value}],
  }));
  const circleMoveAnimation = useAnimatedStyle(() => ({
    transform: [
      {translateY: movecircleonAnimationEndY.value},
      {rotate: `${mix(progress.value, -Math.PI, 0)}rad`},
    ],
  }));
  const moveWellDoneText = useAnimatedStyle(() => ({
    opacity: wellDoneTextFade.value,
    transform: [{translateY: wellDoneTextMove.value}],
  }));
  const fadeTimer = useAnimatedStyle(() => ({
    opacity: fadetimer.value,
  }));
  const animate3 = useAnimatedStyle(() => ({
    transform: [{scale: scale3.value}],
  }));
  const AnimateCard = useAnimatedStyle(() => ({
    transform: [{translateY: cardFallAnimation1.value}],
  }));
  const AnimateCard1 = useAnimatedStyle(() => ({
    transform: [{translateY: cardFallAnimation2.value}],
  }));
  const AnimateLetsStart = useAnimatedStyle(() => ({
    transform: [{translateY: fallLetsStart.value}],
  }));
  const AnimatedCollectButton = useAnimatedStyle(() => ({
    opacity: collectButtonOffset.value,
  }));
  const QuitCardAnimation = useAnimatedStyle(() => ({
    transform: [{translateY: quitCardAnimation.value}],
  }));
  const Cards = ({animation, lottie, text1, text2, speed}: any) => {
    return (
      <Animated.View style={[styles.cardContainer, animation]}>
        <AnimatedLottieView
          source={lottie}
          speed={speed}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: '100%',
            height: DeviceHeigth * 0.2,
            marginBottom: 10,
          }}
        />
        <View style={{alignSelf: 'center'}}>
          <Text style={{color: AppColor.WHITE, fontFamily: 'Helvetica'}}>
            {text1}
          </Text>
          <Text style={styles.txt4}>{text2}</Text>
        </View>
      </Animated.View>
    );
  };
  const handleBack = useCallback(() => {
    quitCardAnimation.value = withSpring(0, {});
  }, []);
  const BackButton = () => {
    return (
      <TouchableOpacity
        style={{marginTop:getStatusBarHeight(), marginLeft: 16}}
        onPress={handleBack}>
        <ArrowLeft fillColor={AppColor.WHITE} />
      </TouchableOpacity>
    );
  };
  const CountdownTimer = memo(() => {
    const [seconds, setSeconds] = useState(30);
    useEffect(() => {
      const timer = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: AppColor.BREATHE_CIRCLE_COLOR,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 6,
          flexDirection: 'row',
        }}>
        <CircularProgressBase
          value={seconds}
          radius={10}
          maxValue={30}
          initialValue={30}
          activeStrokeWidth={4}
          inActiveStrokeWidth={4}
        />
        <Text
          style={{
            color: AppColor.WHITE,
            marginLeft: 6,
          }}>{`00:${seconds > 9 ? seconds : `0${seconds}`}`}</Text>
      </View>
    );
  });
  
  return (
    <View style={styles.container1}>
      <StatusBar backgroundColor={AppColor.BLACK} barStyle={'light-content'} translucent={false}/>
      <BackButton />
      <Animated.View
        style={[
          QuitCardAnimation,
          {zIndex: 10, justifyContent: 'center', alignItems: 'center'},
        ]}>
        <QuitModal type={type} cardAnimation={quitCardAnimation} />
      </Animated.View>
      {loaded ? null : <ActivityLoader />}
      {start > 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{}}>
            {startBreathing ? (
              <View style={{}}>
                <Animated.View
                  style={[
                    countdownAnimationStyle,
                    {alignItems: 'center', top: `55%`},
                  ]}>
                  <Text style={[styles.startup]}>{start}</Text>
                </Animated.View>
              </View>
            ) : (
              <View style={{justifyContent: 'center'}}>
                <Animated.View style={[animate3, {}]}>
                  <AnimatedLottieView
                    source={localImage.heartAnimation}
                    style={{height: DeviceHeigth * 0.35, width: '100%'}}
                  />
                </Animated.View>
                <Animated.View
                  style={[
                    AnimateLetsStart,
                    {
                      position: 'absolute',
                      alignSelf: 'center',

                      top: `55%`,
                    },
                  ]}>
                  <Text style={[styles.startup, {}]}>Let's start</Text>
                </Animated.View>
              </View>
            )}

            <Animated.View
              style={[
                textAnimationStyle,
                {width: DeviceWidth * 0.78, alignSelf: 'center'},
              ]}>
              <Text
                style={{
                  color: AppColor.WHITE,
                  fontFamily: 'Helvetica-Bold',
                  textAlign: 'center',
                  fontSize: 22,
                }}>
                WELCOME
              </Text>
              <Text style={styles.txt3}>to your breathe exercise session!</Text>
              <Text style={[styles.txt2]}>
                Follow the animation to guide your breathing. Let's get started
                with calming breaths.
              </Text>
            </Animated.View>
          </View>
          <Animated.View
            style={[
              textAnimationStyle,
              {
                position: 'absolute',
                bottom: DeviceHeigth * 0.03,
                alignSelf: 'center',
              },
            ]}>
            <NewButton
              title={'Get Started'}
              ButtonWidth={DeviceWidth * 0.9}
              pV={12}
              buttonColor={AppColor.BREATHE_CIRCLE_COLOR}
              fontFamily={'Helvetica-Bold'}
              onPress={() => handleGetStarted()}
            />
          </Animated.View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Animated.Text
            style={[textAnimationStyle1, styles.txt1, {alignSelf: 'center'}]}>
            {'Now Inhale....'}
          </Animated.Text>
          <Animated.Text
            style={[
              textAnimationStyle2,
              styles.txt1,
              {
                position: 'absolute',
                alignSelf: 'center',
              },
            ]}>
            and Exhale....
          </Animated.Text>
          <Animated.Text
            style={[
              textAnimationStyle3,
              styles.txt1,
              {
                position: 'absolute',
                borderColor: 'red',
                alignSelf: 'center',
              },
            ]}>
            Be still and bring your attention to breath.
          </Animated.Text>
          <Animated.View
            style={[
              {...StyleSheet.absoluteFillObject},
              rotationStyle,
              circleMoveAnimation,
            ]}>
            {Array(6)
              .fill(0)
              .map((_, index: number) => (
                <Circle
                  key={index}
                  index={index}
                  progress={progress}
                  goesDown={goesDown}
                />
              ))}
          </Animated.View>
          <Animated.View
            style={[
              fadeTimer,
              {
                position: 'absolute',
                bottom: DeviceHeigth * 0.12,
                alignSelf: 'center',
              },
            ]}>
            <CountdownTimer />
          </Animated.View>

          <Animated.View
            style={[
              moveWellDoneText,
              {
                width: DeviceWidth * 0.85,
                alignItems: 'center',
                alignSelf: 'center',
                position: 'absolute',
                bottom: 0,
              },
            ]}>
            <Text
              style={{
                color: AppColor.WHITE,
                //  width: DeviceWidth * 0.9,
                fontFamily: 'Helvetica-Bold',
                fontSize: 33,
              }}>
              WELL DONE!
            </Text>
            <Text
              style={{
                color: AppColor.WHITE,
                // textAlign: 'center',
                fontFamily: 'Helvetica',
                fontSize: 15,
                lineHeight: 23.5,
                textAlign: 'center',
              }}>
              {
                "You've completed your breathing exercise.\nTake a moment to appreciate your progress."
              }
            </Text>
            <Text
              style={{
                color: AppColor.WHITE,
                // textAlign: 'center',
                fontFamily: 'Helvetica-Bold',
                fontSize: 15,
                lineHeight: 20,
                textAlign: 'center',
                marginTop: DeviceHeigth * 0.03,
                marginBottom: 8,
              }}>
              You've earned
            </Text>
            <View
              style={{
                backgroundColor: '#FFCC28',
                paddingHorizontal: 14,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={localImage.FitCoin}
                resizeMode="contain"
                style={{width: 40, height: 40}}
              />
              <Text
                style={{
                  color: '#1E1E1E',
                  fontFamily: 'Helvetica-Bold',
                  fontSize: 20,
                }}>
                {`+${slotCoins ?? 1}`}
              </Text>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              AnimatedCollectButton,
              {
                position: 'absolute',
                bottom: DeviceHeigth * 0.03,
                alignSelf: 'center',
              },
            ]}>
            <NewButton
              buttonColor={AppColor.BREATHE_CIRCLE_COLOR}
              title={'Collect'}
              fontFamily={'Helvetica-Bold'}
              pV={12}
              onPress={() => {
                console.log('clicked');
                AddCoinsApi();
              }}
            />
          </Animated.View>
        </View>
      )}

      <Cards
        animation={AnimateCard}
        lottie={localImage.VolumeUp}
        text1={'Please increase volume for'}
        text2={'seamless experience'}
        speed={5}
      />
      <Cards
        animation={AnimateCard1}
        lottie={localImage.focusAnimation}
        text1={'Now close your eyes and start'}
        text2={'taking deep breaths'}
        speed={3}
      />
    </View>
  );
};

export default Breathe;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  circle: {
    backgroundColor: AppColor.BREATHE_CIRCLE_COLOR,
    width: 2 * Radius,
    height: 2 * Radius,
    borderRadius: Radius,
    opacity: 0.6,
  },
  text: {
    color: AppColor.BLACK,
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  startup: {
    color: AppColor.BREATHE_CIRCLE_COLOR,
    fontSize: 35,
    fontFamily: 'Helvetica-Bold',
  },
  timer: {
    marginVertical: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A4A4A4',
    padding: 10,
    paddingVertical: 5,
  },
  countdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  txt1: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica',
    fontSize: 16,
    marginTop: DeviceHeigth * 0.1,
  },
  txt2: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  txt3: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 16,
  },
  cardContainer: {
    width: DeviceWidth * 0.6,
    backgroundColor: AppColor.BoldText,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
    paddingBottom: 20,
  },
  txt4: {
    textAlign: 'center',
    color: AppColor.BREATHE_CIRCLE_COLOR,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
  },
});
