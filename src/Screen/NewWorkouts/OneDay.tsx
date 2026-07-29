import {
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StatusBar,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../Component/Color';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../../Component/GradientButton';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import {
  setCount,
  setExerciseInTime,
  setExerciseOutTime,
  setSubscriptiomModal,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import {localImage} from '../../Component/Image';
import WorkoutDescription from '../NewWorkouts/WorkoutsDescription';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';

import analytics from '@react-native-firebase/analytics';

import moment from 'moment';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  Stop,
  Circle,
  Svg,
  Line,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {MyRewardedAd} from '../../Component/BannerAdd';
import RNFetchBlob from 'rn-fetch-blob';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OverExerciseModal from '../../Component/Utilities/OverExercise';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';

const format = 'hh:mm:ss';

const AnimatedExerciseCard = ({entryIndex = 0, style, onPress, children}: any) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = Math.min(entryIndex, 10) * 45;
    opacity.value = withDelay(delay, withTiming(1, {duration: 280}));
    translateY.value = withDelay(delay, withTiming(0, {duration: 280}));
  }, []);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={enterStyle}>
      <Animated.View style={pressStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={style}
          onPressIn={() => {
            scale.value = withTiming(0.97, {duration: 100});
          }}
          onPressOut={() => {
            scale.value = withSpring(1, {damping: 14, stiffness: 220});
          }}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const Box = ({item, index, isNext, trackerData, onPress}: any) => {
  const time = parseInt(item?.exercise_rest.split(' ')[0]);
  const isCompleted = trackerData[index - 1]?.exercise_status == 'completed';
  const isCurrent = isNext && !isCompleted;

  const cardTint = isCompleted
    ? ['#F2FBF8', AppColor.WHITE]
    : isCurrent
    ? ['#FFF3F2', AppColor.WHITE]
    : [AppColor.WHITE, AppColor.WHITE];
  const accentColor = isCompleted
    ? AppColor.NEW_SUBS_GREEN
    : isCurrent
    ? AppColor.RED1
    : 'transparent';

  return (
    <AnimatedExerciseCard
      entryIndex={index - 1}
      style={[
        styles.exerciseCard,
        {borderLeftWidth: 4, borderLeftColor: accentColor},
      ]}
      onPress={() => {
        analytics().logEvent(
          `CV_FITME_${item?.exercise_title?.split(' ')[0]}_FR_Day`,
        );
        onPress(item);
      }}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={cardTint}
        style={styles.exerciseCardGradient}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View
            style={[
              styles.exerciseThumb,
              isCurrent && {borderColor: AppColor.RED1, borderWidth: 1.5},
            ]}>
            <Image
              style={{height: 68, width: 68, alignSelf: 'center'}}
              source={{
                uri:
                  item.exercise_image_link != ''
                    ? item.exercise_image
                    : item.exercise_image_link ?? localImage.NOWORKOUT,
              }}
              resizeMode={'contain'}
            />
            {isCompleted && (
              <View style={styles.exerciseCompletedBadge}>
                <Icons name="check-bold" size={12} color={AppColor.WHITE} />
              </View>
            )}
          </View>
          <View style={styles.exerciseInfo}>
            <Text numberOfLines={1} style={styles.small2}>
              {item?.exercise_title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
              }}>
              <Icons
                name="timer-outline"
                size={13}
                color={AppColor.RED1}
                style={{marginRight: 3}}
              />
              <Text style={[styles.small, {lineHeight: 16}]}>
                {'1 x ' +
                  (time > 60 ? Math.floor(time / 60) + ' min' : time + ' sec')}
              </Text>
              <View style={styles.exerciseDivider} />
              <Icons
                name="repeat"
                size={13}
                color={AppColor.RED1}
                style={{marginRight: 3}}
              />
              <Text style={[styles.small, {lineHeight: 16}]}>
                {'Set - ' + item?.exercise_sets}
              </Text>
            </View>
            {isCompleted ? (
              <Text
                style={[
                  styles.exerciseStateLabel,
                  {color: AppColor.NEW_SUBS_GREEN},
                ]}>
                Completed
              </Text>
            ) : isCurrent ? (
              <Text
                style={[styles.exerciseStateLabel, {color: AppColor.RED1}]}>
                Up next
              </Text>
            ) : null}
          </View>
        </View>
        {isCompleted ? (
          <Icons name="check-circle" size={22} color={AppColor.NEW_SUBS_GREEN} />
        ) : (
          <Icons
            name={'chevron-right'}
            size={22}
            color={isCurrent ? AppColor.RED1 : '#33333380'}
          />
        )}
      </LinearGradient>
    </AnimatedExerciseCard>
  );
};

const Box2 = () => {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseCardGradient}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <ShimmerPlaceholder
            style={{height: 68, width: 68, borderRadius: 12}}
            autoRun
          />
          <View style={styles.exerciseInfo}>
            <ShimmerPlaceholder style={{height: 12, width: '70%'}} autoRun />
            <ShimmerPlaceholder
              style={{height: 10, width: '50%', marginTop: 8}}
              autoRun
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const OneDay = ({navigation, route}: any) => {
  const {data, dayData, day, trainingCount, challenge} = route.params;
  const [exerciseData, setExerciseData] = useState([]);
  const [currentExercise, setCurrentExercise] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [open, setOpen] = useState(true);
  const [downloaded, setDownloade] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reward, setreward] = useState(0);
  const [forLoading, setForLoading] = useState(true);
  const [overExerciseVisible, setOverExerciseVisible] = useState(false);
  const [start, setStart] = useState(false);

  const [loader, setLoader] = useState(false);

  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getSubscriptionModal = useSelector(
    (state: any) => state.getSubscriptionModal,
  );
  const dispatch = useDispatch();
  let isFocuse = useIsFocused();
  let simerData = [1, 2, 3, 4, 5];
  let downloadCounter = 0;
  useEffect(() => {
    if (isFocuse) {
      allWorkoutApi();
      getExerciseTrackAPI();
      setreward(0);
    }
  }, []);
  const allWorkoutApi = async () => {
    // setLoader(true);
    setForLoading(true);
    if (challenge) {
      data?.days['day_' + day] &&
        data?.days['day_' + day]?.exercises &&
        setExerciseData(data?.days['day_' + day]?.exercises);
      setForLoading(false);
    } else {
      try {
        const res = await axios({
          // url:'https://fitme.cvinfotechserver.com/adserver/public/api/days?day=1&workout_id=44'
          url:
            NewAppapi.Get_DAYS +
            '?day=' +
            day +
            '&workout_id=' +
            data?.workout_id,
        });
        if (res.data?.msg != 'no data found.') {
          setLoader(false);
          setExerciseData(res.data);
          setForLoading(false);
          setOpen(true);
        } else {
          setLoader(false);
          data?.days['day_' + day] &&
            data?.days['day_' + day]?.exercises &&
            setExerciseData(data?.days['day_' + day]?.exercises);
          setForLoading(false);
          setOpen(true);
        }
      } catch (error) {
        setLoader(false);
        console.error(error, 'DaysAPIERror');
        setExerciseData([]);
        setForLoading(false);
        setOpen(true);
      }
    }
  };
  const sanitizeFileName = (fileName: string) => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData: Object = {};
  const downloadVideos = async (data: any, index: number, len: number) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title] = filePath;
        downloadCounter++;
        setDownloade((downloadCounter / len) * 100);
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          // IOSBackgroundTask: true, // Add this for iOS background downloads
          path: filePath,
          appendExt: '.mp4',
        })
          .fetch('GET', data?.exercise_video, {
            'Content-Type': 'application/mp4',
            // key: 'Config.REACT_APP_API_KEY',
          })
          .then(res => {
            StoringData[data?.exercise_title] = res.path();
            downloadCounter++;
            setDownloade((downloadCounter / len) * 100);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
  };
  const getExerciseTrackAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', data?.workout_id);
    payload.append('user_day', day);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: challenge
          ? NewAppapi.TRACK_CURRENT_DAY_CHALLENGE_EXERCISE
          : NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        lang: 'en',
      });

      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data?.user_details) {
        setTrackerData(res.data?.user_details);
      } else {
        setTrackerData([]);
      }
      setOpen(true);
    } catch (error) {
      setOpen(true);
      console.error(error, 'PostDaysAPIERror');
      setTrackerData([]);
    }
  };

  const getExerciseInTime = useSelector(
    (state: any) => state.getExerciseInTime,
  );
  const getExerciseOutTime = useSelector(
    (state: any) => state.getExerciseOutTime,
  );
  useEffect(() => {
    if (start && getExerciseOutTime == '') {
      dispatch(setExerciseInTime(moment().format(format)));
      dispatch(setExerciseOutTime(moment().add(45, 'minutes').format(format)));
      console.warn('STARTING', moment().format(format), getExerciseOutTime);
    }
    if (
      getExerciseInTime < getExerciseOutTime &&
      !start &&
      getExerciseOutTime != ''
    ) {
      console.warn('COMPLETEE', moment().format(format), getExerciseOutTime);
      dispatch(setExerciseInTime(moment().format(format)));
    }
  }, [getExerciseInTime, getExerciseOutTime, start]);

  const postCurrentDayAPI = async () => {
    let datas = [];
    let trainingCount = -1;
    setStart(true);
    trainingCount = trackerData.findIndex(
      item => item?.exercise_status == 'undone',
    );

    for (const exercise of exerciseData) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: data?.workout_id,
        user_day: day,
        user_exercise_id: exercise?.exercise_id,
      });
    }
    setDownloade(5);
    Promise.all(
      exerciseData.map((item: any, index: number) =>
        downloadVideos(item, index, exerciseData.length),
      ),
    ).finally(async () => {
      setStart(false);
      try {
        const res = await axios({
          url: challenge
            ? NewAppapi.CURRENT_DAY_CHALLENGE_EXERCISE
            : NewAppapi.CURRENT_DAY_EXERCISE,
          method: 'Post',
          data: {user_details: datas, type: 'day'},
          lang: 'en',
        });
        if (res.data) {
          if (
            res.data?.msg ==
            'Exercise Status for All Users Inserted Successfully'
          ) {
            setOpen(false);
            setDownloade(0);
            navigation.navigate('Exercise', {
              allExercise: exerciseData,
              currentExercise:
                trainingCount != -1
                  ? exerciseData[trainingCount]
                  : exerciseData[0],
              data: data,
              day: day,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: res?.data?.inserted_data,
              type: 'day',
              challenge: true,
              isEventPage: false,
            });
          } else {
            setOpen(false);
            setDownloade(0);
            navigation.navigate('Exercise', {
              allExercise: exerciseData,
              currentExercise:
                trainingCount != -1
                  ? exerciseData[trainingCount]
                  : exerciseData[0],
              data: data,
              day: day,
              exerciseNumber: trainingCount != -1 ? trainingCount : 0,
              trackerData: trackerData,
              type: 'day',
              challenge: true,
              isEventPage: false,
            });
          }
        }
      } catch (error) {
        console.error(error, 'PostDaysAPIERror');
      }
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  if (reward == 1) {
    postCurrentDayAPI();
    setreward(0);
  }
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/NoData.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: DeviceWidth * 0.5,

            height: DeviceHeigth * 0.5,
          }}
        />
      </View>
    );
  };
  const PaddoMeterPermissionModal = () => {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={getSubscriptionModal}
        onRequestClose={() => {
          dispatch(setSubscriptiomModal(false));
        }}>
        <View style={styles.modalBackGround}>
          <View
            style={[
              styles.modalContainer,
              {
                // height:
                //   Platform.OS == 'android'
                //     ? DeviceHeigth * 0.6
                //     : DeviceHeigth >= 932
                //     ? DeviceHeigth * 0.45
                //     : DeviceHeigth * 0.55,
              },
            ]}>
            <Icon
              name="close"
              color={AppColor.DARKGRAY}
              size={30}
              onPress={() => {
                dispatch(setSubscriptiomModal(false));
              }}
              style={{
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                padding: 10,
              }}
            />
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage/Subscription.json')}
              speed={2}
              autoPlay
              resizeMode="cover"
              loop
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.2,
                top: -DeviceHeigth * 0.06,
              }}
            />
            <View
              style={{
                height: 40,
                alignItems: 'center',
                alignSelf: 'center',
                top: -DeviceHeigth * 0.05,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins',
                  textAlign: 'center',
                  color: '#D5191A',
                  fontWeight: '700',
                  backgroundColor: 'transparent',
                  lineHeight: 30,
                }}>
                Premium Feature
              </Text>
              <View
                style={{
                  marginVertical: 10,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textAlign: 'center',
                    color: '#696969',
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                    lineHeight: 15,
                  }}>
                  This feature is locked
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins',
                    textAlign: 'center',
                    color: '#696969',
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                    lineHeight: 15,
                    marginTop: 5,
                  }}>
                  {' '}
                  please subscribe to access
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.buttonPaddo]}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('Subscription');
                dispatch(setSubscriptiomModal(false));
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#D5191A', '#941000']}
                style={[
                  styles.buttonPaddo,
                  {
                    justifyContent: 'space-evenly',
                  },
                ]}>
                <Image
                  source={require('../../Icon/Images/NewImage/vip.png')}
                  style={{width: 25, height: 25}}
                  tintColor={AppColor.WHITE}
                />
                <Text style={[styles.buttonText, {left: 10}]}>Subscribe</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{marginVertical: 10}}>
              <Text style={[styles.buttonText, {color: '#505050'}]}>OR</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buttonPaddo2,
                {
                  justifyContent: 'space-evenly',
                },
              ]}
              activeOpacity={0.5}
              onPress={() => {
                // MyRewardedAd(setreward).load();
                dispatch(setSubscriptiomModal(false));
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#D9D9D9', '#D9D9D9']}
                style={[
                  styles.buttonPaddo2,
                  {
                    justifyContent: 'space-evenly',
                  },
                ]}>
                <Image
                  source={require('../../Icon/Images/NewImage/ads.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={[styles.buttonText, {color: '#505050', left: 10}]}>
                  Watch Ads to unlock Workouts
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const nextExerciseIdx = trackerData.length
    ? trackerData.findIndex((item: any) => item?.exercise_status == 'undone')
    : 0;
  const handleExercisePress = (item: any) => {
    setOpen(false);
    setCurrentExercise(item);
    setVisible(true);
  };
  return (
    <View style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <View style={{width: '100%', height: DeviceHeigth * 0.4}}>
        <ImageBackground
          translucent={true}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
          source={{
            uri:
              getStoreVideoLoc[data?.workout_title + 'Image'] != undefined
                ? 'file://' + getStoreVideoLoc[data?.workout_title + 'Image']
                : // : data?.workout_image_link != ''
                  // ? data?.workout_image_link
                  data?.workout_image,
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)']}
          style={styles.heroTopScrim}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(255,255,255,0)', AppColor.WHITE]}
          style={styles.heroBottomScrim}
          pointerEvents="none"
        />
      </View>
      <View
        style={{
          position: 'absolute',
          top: Platform.OS == 'ios' ? DeviceHeigth * 0.05 : DeviceHeigth * 0.03,
          width: DeviceWidth,
          paddingLeft: 15,

          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (downloaded > 0) {
              showMessage({
                message:
                  'Please wait, downloading in progress. Do not press back.',
                type: 'info',
                animationDuration: 500,
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
            } else {
              navigation.goBack();
              setOpen(false);
            }
          }}
          style={[styles.backButtonBackdrop, {marginTop: -DeviceWidth * 0.06}]}>
          <ArrowLeft fillColor={AppColor.WHITE} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.grabber} />
        <Text style={styles.dayTitle}>Day {day}</Text>
        <View style={styles.dayStatsRow}>
          <View style={styles.dayStatChip}>
            <Icons name="clock-time-four-outline" size={14} color={AppColor.RED1} />
            <Text style={styles.dayStatChipText}>
              {dayData?.total_rest > 60
                ? `${((dayData?.total_rest * 3) / 60).toFixed(0)} min`
                : `${dayData?.total_rest} sec`}
            </Text>
          </View>
          <View style={styles.dayStatChip}>
            <Icons name="fire" size={14} color={AppColor.RED1} />
            <Text style={styles.dayStatChipText}>
              {dayData?.total_calories} Kcal
            </Text>
          </View>
          <View style={styles.dayStatChip}>
            <Icons name="dumbbell" size={14} color={AppColor.RED1} />
            <Text style={styles.dayStatChipText}>
              {forLoading ? '...' : exerciseData.length} Exercises
            </Text>
          </View>
        </View>

        {forLoading ? (
          <FlatList
            data={simerData}
            renderItem={({item, index}: any) => <Box2 />}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 100, flex: 1}}
          />
        ) : (
          <FlatList
            data={exerciseData}
            renderItem={({item, index}: any) => (
              <Box
                index={index + 1}
                item={item}
                key={index}
                isNext={index === nextExerciseIdx}
                trackerData={trackerData}
                onPress={handleExercisePress}
              />
            )}
            ListEmptyComponent={emptyComponent}
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 100, flex: 1}}
          />
        )}

        <GradientButton
          // play={false}
          // oneDay
          flex={0.01}
          text={downloaded ? `Downloading` : `Start Day ${day}`}
          h={60}
          textStyle={{
            fontSize: 20,
            fontFamily: 'Montserrat-SemiBold',
            lineHeight: 40,
            fontWeight: '700',
            zIndex: 1,
            color: AppColor.WHITE,
          }}
          disabled={downloaded > 0}
          // mB={80}
          bottm={40}
          // weeklyAnimation={downloaded}
          colors={['#f0013b', '#f0013b']}
          alignSelf
          bR={6}
          normalAnimation={downloaded > 0}
          normalFill={`${100 - downloaded}%`}
          // fillBack="#EB1900"
          // fill={downloaded > 0 ? `${100 / downloaded}%` : '0%'}
          onPress={() => {
            analytics().logEvent(`CV_FITME_STARTED_DAY_${day}_EXERCISES`);
            if (
              getExerciseOutTime != '' &&
              moment().format(format) > getExerciseOutTime
            ) {
              setOverExerciseVisible(true);
            } else {
              postCurrentDayAPI();
            }
          }}
        />
      </View>
      {loader && <ActivityLoader visible={loader} />}
      <WorkoutDescription
        data={currentExercise}
        open={visible}
        setOpen={setVisible}
      />
      <PaddoMeterPermissionModal />
      <OverExerciseModal
        setOverExerciseVisible={setOverExerciseVisible}
        overExerciseVisible={overExerciseVisible}
        handleBreakButton={() => setOverExerciseVisible(false)}
      />
    </View>
  );
};

export default OneDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: 0,
    position: 'absolute',
    padding: 20,
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
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  small2: {
    fontSize: 15,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '400',
    lineHeight: 25,
    color: '#434343',
  },
  heroTopScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
  },
  heroBottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  backButtonBackdrop: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3E3E3',
    alignSelf: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 32,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.BLACK,
  },
  dayStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  dayStatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  dayStatChipText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 11,
    fontWeight: '600',
    color: '#505050',
    marginLeft: 4,
  },
  exerciseCard: {
    width: '100%',
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: AppColor.WHITE,
    shadowColor: 'grey',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  exerciseCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  exerciseStateLabel: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  exerciseThumb: {
    height: 68,
    width: 68,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: AppColor.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCompletedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: AppColor.NEW_SUBS_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColor.WHITE,
  },
  exerciseInfo: {
    marginLeft: 14,
    flexShrink: 1,
  },
  exerciseDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 6,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    paddingBottom: 30,
    backgroundColor: 'white',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPaddo: {
    height: 45,
    borderRadius: 10,
    //width: DeviceWidth * 0.4,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        // shadowRadius: 4,
      },
      android: {
        elevation: 200,
      },
    }),
  },
  buttonPaddo2: {
    flexDirection: 'row',
    height: 45,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    //bottom: DeviceHeigth * 0.05,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        // shadowRadius: 4,
      },
      android: {
        elevation: 100,
      },
    }),
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: AppColor.WHITE,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  headerstyle: {
    fontSize: 19,
    color: AppColor.WHITE,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '700',

    width: DeviceWidth * 0.8,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
