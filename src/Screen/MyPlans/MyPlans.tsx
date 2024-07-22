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
import React, {useCallback, useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import moment from 'moment';
import VersionNumber from 'react-native-version-number';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAllExercise,
  setAllWorkoutData,
  setChallengesData,
  setCurrentSelectedDay,
  setCustomWorkoutData,
  setEditedExercise,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setFitCoins,
  setFitmeMealAdsCount,
  setHomeGraphData,
  setIsAlarmEnabled,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setStreakModalVisible,
  setStreakStatus,
  setUserProfileData,
  setVideoLocation,
  setWeeklyPlansData,
  setWinnerAnnounced,
} from '../../Component/ThemeRedux/Actions';
import RNFetchBlob from 'rn-fetch-blob';
import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';

import {MyInterstitialAd} from '../../Component/BannerAdd';
import analytics from '@react-native-firebase/analytics';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';
import {WeekTabWithEvents, WeekTabWithoutEvent} from './Tabs';
import {
  ExerciseComponentWithEvent,
  ExerciseComponetWithoutEvents,
} from './ExerciseComponent';
import FitCoins from '../../Component/Utilities/FitCoins';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';
import ActivityLoader from '../../Component/ActivityLoader';
import StreakModal from '../../Component/Utilities/StreakModal';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const MyPlans = ({navigation}: any) => {
  const [downloaded, setDownloade] = useState(0);
  const [coins, setCoins] = useState({});
  const [hasAds, setHasAds] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedDay, setSelectedDay] = useState((moment().day() + 6) % 7);
  const [WeekStatus, setWeekStatus] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [myRankData, setMyRankData] = useState([]);
  const [downlodedVideoSent, setDownloadedVideoSent] = useState(false);
  const [fetchCoins, setFetchCoins] = useState(false);
  const [streakModalVisibility, setStreakModalVisibility] = useState(false);
  const getStreakStatus = useSelector(state => state?.getStreakStatus);
  const getFitmeMealAdsCount = useSelector(
    (state: any) => state.getFitmeMealAdsCount,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state.enteredCurrentEvent,
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
  const getEditedDayExercise = useSelector(
    (state: any) => state.getEditedDayExercise,
  );
  const getStreakModalVisible=useSelector(state=>state?.getStreakModalVisible)
  const fitCoins = useSelector((state: any) => state.fitCoins);
  const dispatch = useDispatch();
  useEffect(() => {
    initInterstitial();
    allWorkoutApi1();
    //getAllExerciseData();
    getAllChallangeAndAllExerciseData();
    getGraphData();
    getWeeklyAPI();
    checkMealAddCount();
    // PurchaseDetails();
    getUserDetailData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (enteredCurrentEvent) {
        getEarnedCoins();
        getLeaderboardDataAPI();
      } else {
        WeeklyStatusAPI();
      }
    }, []),
  );
  //condition to check streak modal
  useEffect(() => {
    if (
      WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1] !== 'Monday' &&
      coins[WeekArrayWithEvent[getPurchaseHistory?.currentDay - 2]] < 0 &&
      enteredCurrentEvent &&
      !getStreakStatus?.includes(
        WeekArrayWithEvent[getPurchaseHistory?.currentDay - 2],
      )
    ) {
      dispatch(setStreakModalVisible(true));
      dispatch(setStreakStatus([
      ...getStreakStatus,
      WeekArrayWithEvent[getPurchaseHistory?.currentDay - 2]
    
    ]))
    }
  }, [getStreakModalVisible,coins]);
  const getAllChallangeAndAllExerciseData = async () => {
    let responseData = 0;
    if (Object.keys(getUserDataDetails).length > 0) {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
      } catch (error) {
        console.log('GET-USER-Challange and AllExerciseData DATA', error);
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
      }
    } else {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
      } catch (error) {
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));

        console.log('GET-USER-Challange and AllExerciseData DATA', error);
      }
    }
  };
  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        setRefresh(false);
        if (responseData?.data.event_details == 'Not any subscription') {
          dispatch(setPurchaseHistory([]));
        } else {
          setRefresh(false);
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
        }
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);

      setRefresh(false);
    }
  };

  // getCoinsdetails
  const getEarnedCoins = async () => {
    try {
      const response = await axios(
        `${NewAppapi.GET_COINS}?user_id=${getUserDataDetails?.id}&day=${
          WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
        }`,
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
      } else {
        console.log('coins', response?.data?.responses);
        setCoins(response?.data?.responses);
      }
    } catch (error) {
      showMessage({
        message: 'Something went wrong.',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
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
  const getWeeklyAPI = async () => {
    setLoader(true);
    try {
      const res = await axios(`${NewAppapi.NEW_WEEKDAY_EXERCISE_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          version: VersionNumber.appVersion,
          user_id: getUserDataDetails?.id,
        },
      });
      if (res.data?.msg == 'User not exist.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setLoader(false);
      } else {
        dispatch(setWeeklyPlansData(res?.data));
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error.response, 'DaysAPIERror');
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
      if (res?.data?.message != 'data not found') {
        const days = new Set(); // Use a Set to store unique days
        res?.data?.forEach((item: any) => {
          days.add(item?.user_day);
        });
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
  let StoringData: Object = {},
    downloadCounter = 0;
  const downloadVideos = async (data: any, index: number, len: number) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.exercise_title,
    )}.mp4`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.exercise_title] = filePath;
        setButtonClicked(true);
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
            setButtonClicked(true);
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
      setButtonClicked(false);
      setVisible(false);
      showMessage({
        message: 'Download interrupted',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
    dispatch(setVideoLocation(StoringData));
  };
  let datas = [];
  const handleStart = () => {
    if (!visible) {
      setVisible(true);
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
      ).finally(() => {
        enteredCurrentEvent
          ? RewardsbeforeNextScreen(selectedDay)
          : beforeNextScreen(selectedDay);
      });
    }
  };

  const beforeNextScreen = async (selectedDay: any) => {
    downloadCounter = 0;
    setDownloadedVideoSent(true);
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
        setDownloade(0);
        setButtonClicked(false);
        setVisible(false);
        setDownloadedVideoSent(false);
        let checkAdsShow = AddCountFunction();

        AnalyticsConsole(`SE_ON_${getPurchaseHistory?.currentDay}`);
        if (checkAdsShow == true) {
          showInterstitialAd();
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_PLAN`,
          );
          navigation.navigate('Exercise', {
            allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
            currentExercise:
              getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
            data: [],
            day: selectedDay,
            exerciseNumber: 0,
            trackerData: res?.data?.inserted_data,
            type: 'weekly',
          });
        } else {
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_PLAN`,
          );
          navigation.navigate('Exercise', {
            allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
            currentExercise:
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
      setDownloade(0);
      setButtonClicked(false);
      setVisible(false);
      setDownloadedVideoSent(false);
      showMessage({
        message: 'Error, Please try again later',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const RewardsbeforeNextScreen = async (selectedDay: any) => {
    downloadCounter = 0;
    setDownloadedVideoSent(true);
    for (const item of getWeeklyPlansData[WeekArray[selectedDay]]?.exercises) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: `-${selectedDay + 1}`,
        user_day: WeekArray[selectedDay],
        user_exercise_id: item?.exercise_id,
        fit_coins: getWeeklyPlansData[WeekArray[selectedDay]]?.total_coins,
      });
    }

    try {
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EVENT_EXERCISE,
        method: 'Post',
        data: {user_details: datas},
      });
      setDownloade(0);
      setButtonClicked(false);
      setVisible(false);
      AnalyticsConsole(`SEE_ON_${getPurchaseHistory?.currentDay}`);
      if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        setDownloade(0);
        setButtonClicked(false);
        setVisible(false);
        setDownloadedVideoSent(false);

        navigation.navigate('Exercise', {
          allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
          currentExercise:
            getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
          data: [],
          day: selectedDay,
          exerciseNumber: 0,
          trackerData: res?.data?.inserted_data,
          type: 'weekly',
        });
        // }
      } else {
        setDownloadedVideoSent(false);
        navigation.navigate('Exercise', {
          allExercise: getWeeklyPlansData[WeekArray[selectedDay]]?.exercises,
          currentExercise:
            getWeeklyPlansData[WeekArray[selectedDay]]?.exercises[0],
          data: [],
          day: selectedDay,
          exerciseNumber: 0,
          trackerData: res?.data?.existing_data,
          type: 'weekly',
        });
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setDownloade(0);
      setButtonClicked(false);
      setVisible(false);
      showMessage({
        message: 'Error, Please try again later',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  //getLeaderBoardPoints
  const getLeaderboardDataAPI = async () => {
    setFetchCoins(true);
    try {
      const result = await axios({
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });
      if (result.data) {
        const myRank = result.data?.data?.findIndex(
          item => item?.id == getUserDataDetails?.id,
        );
        setFetchCoins(false);
        setMyRankData(result.data?.data[myRank]);
        dispatch(setFitCoins(result.data?.data[myRank]?.fit_coins));
        dispatch(
          setWinnerAnnounced(
            result.data?.winner_announced == true ? true : false,
          ),
        );
      }
      setRefresh(false);
      setFetchCoins(false);
    } catch (error) {
      console.log(error);
      setRefresh(false);
      setFetchCoins(false);
    }
  };
  const toNextScreen = async (selectedDay: any) => {
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
      setDownloadedVideoSent(false);
      if (res?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: res?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data?.user_details) {
        setButtonClicked(false);
        setVisible(false);
        setDownloade(0);

        let checkAdsShow = AddCountFunction();
        if (checkAdsShow == true) {
          showInterstitialAd();
          analytics().logEvent(
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_PLAN`,
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
            `CV_FITME_CLICKED_ON_${WeekArray[selectedDay]}_PLAN`,
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
      setDownloade(0);
      setButtonClicked(false);
      setVisible(false);
      setDownloadedVideoSent(false);
      console.error(error, 'PostDaysAPIERror');
      showMessage({
        message: 'Error, Please try again later',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const DownloadingWorkout = ({buttonClicked, hasAds, downloaded}: any) => {
    return (
      // <Modal visible={buttonClicked} transparent>
      //   <View
      //     style={{
      //       flex: 1,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //     }}>
      <View
        style={{
          bottom: hasAds ? DeviceHeigth * 0.05 : DeviceHeigth * 0.02,
          display: buttonClicked ? 'flex' : 'none',
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
          // bottom:
          //   DeviceHeigth >= 812
          //     ? hasAds
          //       ? DeviceHeigth * 0.15
          //       : DeviceHeigth * 0.1
          //     : hasAds
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
            zIndex: 1,
          }}>
          <Animated.View
            style={{
              backgroundColor: '#D9D9D9',
              height: 6,
              width: `${100 - downloaded}%`,
              marginTop: -50,
              right: 0,
              position: 'absolute',
              zIndex: 0,
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
          <Text style={styles.small}>{downloaded.toFixed(0)}%</Text>
        </View>
      </View>
      //   </View>
      // </Modal>
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
    if (getPurchaseHistory?.length > 0) {
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
      <NewHeader
        header={'Weekly Plan'}
        SearchButton={false}
        backButton={false}
        extraView={true}
        enteredCurrentEvent={enteredCurrentEvent}
        coins={fitCoins > 0 ? fitCoins : 0}
        coinsLoaded={fetchCoins}
      />

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
          enteredCurrentEvent &&
          WeekArray[selectedDay] !== 'Saturday' &&
          WeekArray[selectedDay] !== 'Sunday' ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  width: DeviceWidth * 0.9,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: DeviceWidth * 0.05,
                }}>
                {WeekArrayWithEvent.map((item: any, index: number) => (
                  <WeekTabWithEvents
                    day={item}
                    dayIndex={index}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    WeekStatus={WeekStatus}
                    WeekArray={WeekArrayWithEvent}
                    dayObject={getWeeklyPlansData}
                    dayWiseCoins={coins}
                  />
                ))}
              </View>
              <ExerciseComponentWithEvent
                dayObject={
                  getEditedDayExercise &&
                  getEditedDayExercise[WeekArrayWithEvent[selectedDay]]
                    ? getEditedDayExercise[WeekArrayWithEvent[selectedDay]]
                    : getWeeklyPlansData[WeekArrayWithEvent[selectedDay]]
                }
                day={WeekArrayWithEvent[selectedDay]}
                onPress={handleStart}
                navigation={navigation}
                WeekArray={WeekArrayWithEvent}
                dayWiseCoins={coins}
                getWeeklyPlansData={getWeeklyPlansData}
                selectedDay={selectedDay}
                currentDay={getPurchaseHistory?.currentDay - 1}
                download={downloaded}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  width: DeviceWidth * 0.9,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: DeviceWidth * 0.05,
                }}>
                {WeekArray.map((item: any, index: number) => (
                  <WeekTabWithoutEvent
                    day={item}
                    dayIndex={index}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    WeekStatus={WeekStatus}
                    WeekArray={WeekArray}
                  />
                ))}
              </View>
              <ExerciseComponetWithoutEvents
                dayObject={getWeeklyPlansData[WeekArray[selectedDay]]}
                day={WeekArray[selectedDay]}
                onPress={handleStart}
                WeekStatus={WeekStatus}
                WeekArray={WeekArray}
                getWeeklyPlansData={getWeeklyPlansData}
                download={downloaded}
              />
            </>
          )
        ) : (
          emptyComponent()
        )}
      </View>
      {downlodedVideoSent ? <ActivityLoader /> : null}
          <StreakModal
            streakDays={coins}
            setVisible={setStreakModalVisibility}
            WeekArray={WeekArrayWithEvent}
            missedDay={WeekArrayWithEvent[getPurchaseHistory?.currentDay - 2]}
          />
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
