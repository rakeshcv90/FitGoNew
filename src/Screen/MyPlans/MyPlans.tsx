import {
  Animated,
  FlatList,
  Image,
  Modal,
  PanResponder,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import Play from '../NewWorkouts/Exercise/Play';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VersionNumber from 'react-native-version-number';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../Component/GradientButton';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Timer from '../../Component/Timer';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAllWorkoutData,
  setCurrentSelectedDay,
  setFitmeMealAdsCount,
  setHomeGraphData,
  setIsAlarmEnabled,
  setVideoLocation,
  setWeeklyPlansData,
} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import WorkoutsDescription from '../NewWorkouts/WorkoutsDescription';
import Carousel from 'react-native-snap-carousel';
import AnimatedLottieView from 'lottie-react-native';
import {AlarmNotification} from '../../Component/Reminder';
import notifee from '@notifee/react-native';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import analytics from '@react-native-firebase/analytics';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const All_Weeks_Data = {};
const WeekTab = ({
  day,
  dayIndex,
  selectedDay,
  setSelectedDay,
  WeekStatus,
}: any) => {
  return (
    <TouchableOpacity
      key={dayIndex}
      onPress={() => setSelectedDay(dayIndex)}
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: day == moment().format('dddd') ? '#92E3A94D' : 'white',
        borderColor:
          day == moment().format('dddd') ? AppColor.NEW_GREEN_DARK : 'white',
        borderRadius: day == moment().format('dddd') ? 25 : 0,
        padding: 5,
        borderWidth: day == moment().format('dddd') ? 1.5 : 0,
        width: 45,
        height: 45,
      }}>
      <Text
        style={[
          styles.labelStyle,
          {
            color:
              selectedDay == dayIndex
                ? AppColor.NEW_GREEN_DARK
                : AppColor.BoldText,
            fontWeight: '600',
            textTransform: 'capitalize',
          },
        ]}>
        {day.substring(0, 3)}
      </Text>
      <View>
        {WeekStatus?.includes(WeekArray[dayIndex]) ? (
          <Image
            source={localImage.RedTick}
            style={{width: 10, height: 10, marginBottom: -8}}
            resizeMode="contain"
          />
        ) : selectedDay == dayIndex ? (
          <>
            <View
              style={{
                width: DeviceWidth * 0.05,
                height: 1,
              }}
            />
            <LinearGradient
              colors={[AppColor.NEW_GREEN_DARK, AppColor.NEW_GREEN_DARK]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                width: DeviceWidth * 0.03,
                height: 2,
                alignSelf: 'center',
              }}
            />
          </>
        ) : (
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 5,
              backgroundColor: AppColor.BoldText,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const Box = ({item, index}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const avatarRef = React.createRef();
  return (
    <TouchableOpacity
      key={index}
      onPress={() => setVisible(true)}
      activeOpacity={1}
      style={{flexDirection: 'row', padding: 10, marginVertical: 5}}>
      {/* <View
          style={{
            height: 60,
            width: 60,
            // backgroundColor: AppColor.WHITE,
            // borderRadius: 10,
          }}> */}
      {/* {isLoading && (
            <ShimmerPlaceholder
              style={{height: 75, width: 75, alignSelf: 'center'}}
              autoRun
              ref={avatarRef}
            />
          )} */}
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 5,
          borderWidth: 0.5,
          borderColor: 'lightgrey',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item?.exercise_image_link}}
          onLoad={() => setIsLoading(false)}
          style={{
            height: 40,
            width: 40,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: 20,
          marginTop: 5,
        }}>
        <View>
          <Text
            style={{
              fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              fontSize: 16,
              fontWeight: '600',
              color: '#202020',
              lineHeight: 20,
            }}>
            {item?.exercise_title}
            {/* {item?.exercise_id} */}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontSize: 12,
                fontWeight: '600',
                color: AppColor.BoldText,
                lineHeight: 30,
              }}>
              Time:
              <Text style={styles.small}>
                {' '}
                {item?.exercise_rest}
                {'   '}
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <WorkoutsDescription data={item} open={visible} setOpen={setVisible} />
    </TouchableOpacity>
  );
};
const MyPlans = ({navigation}: any) => {
  const [downloaded, setDownloade] = useState(false);
  const [hasAds, setHasAds] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedDay, setSelectedDay] = useState((moment().day() + 6) % 7);
  const [WeekStatus, setWeekStatus] = useState([]);
  const getFitmeMealAdsCount = useSelector(
    (state: any) => state.getFitmeMealAdsCount,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getWeeklyPlansData = useSelector(
    (state: any) => state.getWeeklyPlansData,
  );
  const getStoreVideoLoc = useSelector((state: any) => state.getStoreVideoLoc);
  const isAlarmEnabled = useSelector((state: any) => state.isAlarmEnabled);
  const dispatch = useDispatch();
  useEffect(() => {
    initInterstitial();
    allWorkoutApi1();
    getGraphData();
    Promise.all(WeekArray.map(item => getWeeklyAPI(item))).finally(() =>
      dispatch(setWeeklyPlansData(All_Weeks_Data)),
    );
    checkMealAddCount()
  }, []);

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
          console.log('Alarm error', errr);
          currenTime.setDate(currenTime.getDate() + 1);
          AlarmNotification(currenTime);
        });
      dispatch(setIsAlarmEnabled(true));
    }
  }, [isAlarmEnabled]);
  useFocusEffect(
    useCallback(() => {
      WeeklyStatusAPI();
    }, [selectedDay]),
  );

  const allWorkoutApi1 = async () => {
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
  const getWeeklyAPI = async (day: string) => {
    setLoader(true);
    try {
      const res = await axios({
        url:
          NewAppapi.GET_PLANS_EXERCISE +
          '?version=' +
          VersionNumber.appVersion +
          '&day=' +
          day +
          '&user_id=' +
          getUserDataDetails.id,
      });
      if (res.data?.msg != 'User not exist.') {
        All_Weeks_Data[day] = res.data;
        // setExerciseData();
        // console.log('All_Weeks_Data', All_Weeks_Data);
      } else {
        All_Weeks_Data[day] = [];
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error, 'DaysAPIERror');
    }
  };
  const getGraphData = async () => {
    try {
      const res = await axios({
        url: NewAppapi.HOME_GRAPH_DATA,
        method: 'post',
        data: {
          user_id: getUserDataDetails?.id,
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
      } else if (res.data?.message != 'No data found') {
        dispatch(setHomeGraphData(res.data));
      } else {
        dispatch(setHomeGraphData([]));
      }
    } catch (error) {
      console.error(error, 'GraphError');
      dispatch(setHomeGraphData([]));
    }
  };
  const WeeklyStatusAPI = async () => {
    setRefresh(true);
    try {
      const res = await axios({
        url: NewAppapi.WEEKLY_STATUS + '?user_id=' + getUserDataDetails.id,
      });
      if (res?.data?.msg != 'No data found.') {
        const days = new Set(); // Use a Set to store unique days
        res?.data?.forEach((item: any) => {
          days.add(item?.user_day);
        });
        console.log('DAYs', days);
        setWeekStatus([...days]);
      } else {
        setWeekStatus([]);
      }
      setRefresh(false);
    } catch (error) {
      console.error(error, 'WEEKLYSTATUS ERRR');
      setRefresh(false);
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
        setDownloade(true);
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
            setDownloade(true);
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
  let datas = [];
  const handleStart = () => {
    Promise.all(
      getWeeklyPlansData[WeekArray[selectedDay]]?.exercises?.map(
        (item: any, index: number) => {
          return downloadVideos(
            item,
            index,
            getWeeklyPlansData[WeekArray[selectedDay]]?.exercises?.length,
          );
        },
      ),
    ).finally(() => beforeNextScreen(selectedDay));
  };

  const beforeNextScreen = async (selectedDay: any) => {
    for (const item of getWeeklyPlansData[WeekArray[selectedDay]]?.exercises) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: `-${selectedDay + 1}`,
        user_day: WeekArray[selectedDay],
        user_exercise_id: item?.exercise_id,
      });
    }
    try {
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: {user_details: datas},
      });
      if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        setDownloade(false);
        let checkAdsShow = checkMealAddCount();

        if (checkAdsShow == true) {
          showInterstitialAd();
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_WEEKLY_PLAN`,
          );
          navigation.navigate('Exercise', {
            allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
            currentExercise:
              // trainingCount != -1
              //   ? exerciseData[trainingCount]
              getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
            data: [],
            day: selectedDay,
            exerciseNumber: 0,
            trackerData: res?.data?.inserted_data,
            type: 'weekly',
          });
        } else {
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_WEEKLY_PLAN`,
          );
          navigation.navigate('Exercise', {
            allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
            currentExercise:
              // trainingCount != -1
              //   ? exerciseData[trainingCount]
              getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
            data: [],
            day: selectedDay,
            exerciseNumber: 0,
            trackerData: res?.data?.inserted_data,
            type: 'weekly',
          });
        }
      } else {
        toNextScreen(selectedDay);
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setDownloade(false);
    }
  };
  const toNextScreen = async (selectedDay: any) => {
    setDownloade(false);
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', `-${selectedDay + 1}`);
    payload.append('user_day', WeekArray[selectedDay]);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
        method: 'Post',
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
      } else if (res.data?.user_details) {
        setDownloade(false);
        let checkAdsShow = checkMealAddCount();
        if (checkAdsShow == true) {
          showInterstitialAd();
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_WEEKLY_PLAN`,
          );
          navigation.navigate('Exercise', {
            allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
            currentExercise:
              // trainingCount != -1
              //   ? exerciseData[trainingCount]
              getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
            data: [],
            day: selectedDay,
            exerciseNumber: 0,
            trackerData: res?.data?.user_details,
            type: 'weekly',
          });
        } else {
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_WEEKLY_PLAN`,
          );
          navigation.navigate('Exercise', {
            allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
            currentExercise:
              // trainingCount != -1
              //   ? exerciseData[trainingCount]
              getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
            data: [],
            day: selectedDay,
            exerciseNumber: 0,
            trackerData: res?.data?.user_details,
            type: 'weekly',
          });
        }
      } else {
      }
    } catch (error) {
      setDownloade(false);
      console.error(error, 'PostDaysAPIERror');
    }
  };
  const DownloadingWorkout = (props: any) => {
    const progressAnimation = new Animated.Value(0);
    const progressBarWidth = progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['100%', '0%'],
      extrapolate: 'extend',
    });
    useEffect(() => {
      if (downloaded) {
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }).start();
      }
    }, [downloaded, progressAnimation]);
    return (
      <Modal visible={downloaded} transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: DeviceWidth * 0.95,
              height: 40,
              backgroundColor: AppColor.WHITE,
              alignSelf: 'center',

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
              borderRadius: 5,
              padding: 5,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              position: 'absolute',
              bottom: props.hasAds ? DeviceHeigth * 0.15 : DeviceHeigth * 0.1,
              // bottom:
              //   DeviceHeigth >= 812
              //     ? props.hasAds
              //       ? DeviceHeigth * 0.15
              //       : DeviceHeigth * 0.1
              //     : props.hasAds
              //     ? DeviceHeigth * 0.15
              //     : DeviceHeigth * 0.1,
            }}>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              colors={['#941000', '#D5191A']}
              style={{
                width: DeviceWidth * 0.95,
                height: 6,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: -10,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}>
              <Animated.View
                style={{
                  backgroundColor: '#D9D9D9',
                  height: 6,
                  width: progressBarWidth,
                  marginTop: -50,
                  right: 0,
                  position: 'absolute',
                  zIndex: -1,
                }}
              />
            </LinearGradient>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text style={styles.small}>Downloading Workouts</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage2/Adloader.json')}
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
  const checkMealAddCount = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        dispatch(setFitmeMealAdsCount(0));
        setHasAds(false);
        return false;
      } else {
        setHasAds(true);
        if (getFitmeMealAdsCount < 3) {
          dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
          return false;
        } else {
          dispatch(setFitmeMealAdsCount(0));
          return true;
        }
      }
    } else {
      setHasAds(true);
      if (getFitmeMealAdsCount < 3) {
        dispatch(setFitmeMealAdsCount(getFitmeMealAdsCount + 1));
        return false;
      } else {
        dispatch(setFitmeMealAdsCount(0));
        return true;
      }
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
      }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <NewHeader header={'Week Plan'} SearchButton={false} backButton={false} />
      <View
        style={{
          flex: 1,
          marginTop:
            Platform.OS == 'ios'
              ? DeviceHeigth < 1024
                ? -DeviceWidth * 0.1
                : -DeviceWidth * 0.05
              : -DeviceWidth * 0.05,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: DeviceWidth,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: -DeviceWidth * 0.05,
          }}>
          <Text
            style={[
              styles.semiBold,
              {
                marginLeft:
                  DeviceHeigth >= 1024
                    ? DeviceWidth * 0.03
                    : DeviceWidth * 0.05,
                width: DeviceWidth * 0.7,
                // marginBottom: DeviceWidth * 0.05,
              },
            ]}>
            Get Fit{' '}
          </Text>
        </View>
        {/* <View {...panResponder.panHandlers} style={{flex: 1}}> */}
        <View
          style={{
            flexDirection: 'row',
            width: DeviceWidth * 0.95,
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: DeviceWidth * 0.05,
          }}>
          {WeekArray.map((item: any, index: number) => (
            <WeekTab
              day={item}
              dayIndex={index}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              WeekStatus={WeekStatus}
            />
          ))}
        </View>
        {loader ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage2/Adloader.json')}
              speed={2}
              autoPlay
              loop
              style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.4}}
            />
          </View>
        ) : getWeeklyPlansData[WeekArray[selectedDay]] &&
          getWeeklyPlansData[WeekArray[selectedDay]]?.exercises &&
          getWeeklyPlansData[WeekArray[selectedDay]]?.exercises?.length > 0 ? (
          <Carousel
            data={WeekArray}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            itemWidth={DeviceWidth}
            sliderWidth={DeviceWidth}
            onSnapToItem={index => setSelectedDay(index)}
            onBeforeSnapToItem={index => setSelectedDay(index)}
            enableSnap
            firstItem={selectedDay}
            renderItem={({current, currentIndex}: any) => (
              <View style={styles.box}>
                {WeekStatus?.includes(WeekArray[selectedDay]) ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 5,
                    }}>
                    <AnimatedLottieView
                      source={require('../../Icon/Images/RedTick.json')}
                      speed={1}
                      autoPlay
                      loop
                      resizeMode="contain"
                      style={{
                        width: DeviceWidth * 0.2,
                        height: DeviceHeigth * 0.2,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.MONTSERRAT_BOLD,
                        fontSize: 18,
                        fontWeight: '600',
                        top: -20,
                        color: AppColor.LITELTEXTCOLOR,
                        lineHeight: 30,
                      }}>
                      Workout Completed
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.MONTSERRAT_MEDIUM,
                        fontSize: 14,
                        fontWeight: '500',
                        top: -10,
                        color: AppColor.LITELTEXTCOLOR,
                        lineHeight: 20,
                      }}>
                      {WeekArray[selectedDay]}
                    </Text>
                    <View
                      style={{
                        width: DeviceWidth * 0.8,
                        height: 1,
                        backgroundColor: 'lightgrey',
                        marginTop: DeviceWidth * 0.05,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: DeviceWidth * 0.05,
                      }}>
                      <Image
                        source={{
                          uri: getWeeklyPlansData[WeekArray[selectedDay]]
                            ?.image,
                        }}
                        // onLoad={() => setIsLoading(false)}
                        style={{
                          height: 40,
                          width: 40,
                          alignSelf: 'center',
                          marginRight: 20,
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.MONTSERRAT_BOLD,
                          fontSize: 16,
                          fontWeight: '700',
                          color: AppColor.RED1,
                          lineHeight: 30,
                          left: -20,
                        }}>
                        {getWeeklyPlansData[WeekArray[selectedDay]]?.title}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 10,
                        marginVertical: 5,
                      }}>
                      <Image
                        source={{
                          uri: getWeeklyPlansData[WeekArray[selectedDay]]
                            ?.image,
                        }}
                        // onLoad={() => setIsLoading(false)}
                        style={{
                          height: 50,
                          width: 50,
                          alignSelf: 'center',
                        }}
                        resizeMode="contain"
                      />
                      <View
                        style={{
                          justifyContent: 'center',
                          marginHorizontal: 20,
                          flex: 1,
                          // width: DeviceWidth * 0.55,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.MONTSERRAT_BOLD,
                            fontSize: 16,
                            fontWeight: '700',
                            color: AppColor.LITELTEXTCOLOR,
                            lineHeight: 30,
                          }}>
                          {getWeeklyPlansData[WeekArray[selectedDay]]?.title}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.MONTSERRAT_MEDIUM,
                            fontSize: 12,
                            fontWeight: '600',
                            color: AppColor.BoldText,
                            lineHeight: 15,
                            opacity: 0.7,
                          }}>
                          {
                            getWeeklyPlansData[WeekArray[selectedDay]]
                              ?.exercises?.length
                          }{' '}
                          Exercises
                        </Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handleStart()}>
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          colors={['#0A93F1', '#2B4E9F']}
                          style={{
                            width: DeviceHeigth >= 1024 ? 50 : 35,
                            height: DeviceHeigth >= 1024 ? 50 : 35,
                            borderRadius:
                              DeviceHeigth >= 1024 ? 50 / 2 : 35 / 2,
                            overflow: 'hidden',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginLeft: 5,
                          }}>
                          <Image
                            source={localImage.PlayIcon}
                            style={{
                              height: DeviceHeigth >= 1024 ? 15 : 10,
                              width: DeviceHeigth >= 1024 ? 15 : 10,
                            }}
                            resizeMode="contain"
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={
                        getWeeklyPlansData[WeekArray[selectedDay]]?.exercises
                      }
                      keyExtractor={(item, index) => index.toString()}
                      refreshControl={
                        <RefreshControl
                          refreshing={refresh}
                          onRefresh={() => WeeklyStatusAPI()}
                          colors={[AppColor.RED, AppColor.WHITE]}
                        />
                      }
                      renderItem={({item, index}) => (
                        <Box item={item} index={index} />
                      )}
                      showsVerticalScrollIndicator={false}
                      initialNumToRender={10}
                      maxToRenderPerBatch={10}
                      updateCellsBatchingPeriod={100}
                      removeClippedSubviews={true}
                    />
                  </>
                )}
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          emptyComponent()
        )}
      </View>
      <DownloadingWorkout hasAds={hasAds} />
    </SafeAreaView>
  );
};

export default MyPlans;

const styles = StyleSheet.create({
  semiBold: {
    color: AppColor.NewBlack,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '700',
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    marginBottom: DeviceHeigth * 0.07,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FDFDFD',
    width: DeviceWidth * 0.95,
    // padding: 5,
    // paddingTop: 1,
    marginTop: 7,
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
});
