import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  Platform,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import TextBanner from '../../Component/NewHomeUtilities/TextBanner';
import WorkoutChallengeZone from '../../Component/NewHomeUtilities/WorkoutChallengeZone';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {
  setAgreementContent,
  setAllExercise,
  setAllWorkoutData,
  setBanners,
  setChallengesData,
  setCompleteProfileData,
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setFitCoins,
  setIsAlarmEnabled,
  Setmealdata,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setRewardModal,
  setRewardPopUp,
  setStoreData,
  setUserProfileData,
  setWeeklyPlansData,
  setWinnerAnnounced,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
import {useIsFocused} from '@react-navigation/native';
import AppleStepCounter from '../../Component/NewHomeUtilities/AppleStepCounter';
import UserEspecially from '../../Component/NewHomeUtilities/UserEspecially';
import axios from 'axios';

import WithoutEvent from '../../Component/NewHomeUtilities/WithoutEvent';
import FocuseMind from '../../Component/NewHomeUtilities/FocuseMind';
import FitnessInstructor from '../../Component/NewHomeUtilities/FitnessInstructor';
import InviteFriends from '../../Component/NewHomeUtilities/InviteFriends';
import RewardModal from '../../Component/Utilities/RewardModal';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AlarmNotification} from '../../Component/Reminder';
import notifee from '@notifee/react-native';

import UpcomingEventModal from '../../Component/Utilities/UpcomingEventModal';
import {showMessage} from 'react-native-flash-message';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';
import {LocationPermissionModal} from '../../Component/Utilities/LocationPermission';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Marquee} from '@animatereactnative/marquee';
import MyChallenge from '../../Component/NewHomeUtilities/MyChallenge';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import moment from 'moment';

import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import WinnerView from '../../Component/NewHomeUtilities/WinnerView';
import NewBanner from '../../Component/NewHomeUtilities/NewBanner';

const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const NewHome = ({navigation}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const isAlarmEnabled = useSelector(state => state.isAlarmEnabled);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getPopUpFreuqency = useSelector(state => state?.getPopUpFreuqency);
  const fitCoins = useSelector(state => state.fitCoins);
  const [locationP1, setLocationP1] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const [day, setDay] = useState(0);
  const isFocused = useIsFocused();
  const getRewardModalStatus = useSelector(
    state => state?.getRewardModalStatus,
  );
  const [showRewardModal, setShowRewardModal] = useState(false);

  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  const [myRank, setMyRank] = useState(0);
  const [pastWinners, setPastWinners] = useState([]);
  const [coins, setCoins] = useState({});
  const [winnerAnnounce, setWinnerAnnounce] = useState();

  useEffect(() => {
    if (isFocused) {
      getAllChallangeAndAllExerciseData();
      getLeaderboardDataAPI();
      allWorkoutApi();
      getWorkoutStatus();
      getUserDetailData();
      getPastWinner();
      getWeeklyAPI();

      enteredCurrentEvent && getEarnedCoins();
    }
  }, [isFocused]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRewardModal(getRewardModalStatus);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAlarmEnabled) {
      notifee.getTriggerNotificationIds().then(res => console.log(res, 'ISDA'));
      const currenTime = new Date();
      currenTime.setHours(7);
      currenTime.setMinutes(0);
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

  const shimmerValue = useSharedValue(0);

  // Animated style for shimmer effect
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmerValue.value * 10}],
  }));

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(100, {duration: 1500}),
      -1,
      false,
    );
  }, []);
  const getWeeklyAPI = async () => {
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
      } else {
        dispatch(setWeeklyPlansData(res?.data));
      }
    } catch (error) {
      console.error(error.response, 'DaysAPIERror');
    }
  };

  const getEarnedCoins = async () => {
    // const url =
    //   'https://fitme.cvinfotechserver.com/adserver/public/api/test_exercise_points_day';
    try {
      const response = await axios(
        `${NewAppapi.GET_COINS}?user_id=${getUserDataDetails?.id}&day=${
          WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
        }`,
      );
      // const response = await axios(
      //   `${url}?user_id=${getUserDataDetails?.id}&day=${
      //     WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
      //   }`,
      // );

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
        if (responseData?.data.event_details == 'Not any subscription') {
          dispatch(setPurchaseHistory([]));
        } else {
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
    }
  };
  const getWorkoutStatus = async () => {
    try {
      const exerciseStatus = await axios.get(
        `${NewAppapi.USER_EXERCISE_COMPLETE_STATUS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails.id}`,
      );

      if (
        exerciseStatus?.data.msg ==
        'Please update the app to the latest version'
      ) {
      } else if (exerciseStatus?.data.length > 0) {
        dispatch(setWorkoutTimeCal(exerciseStatus?.data));
      } else {
        dispatch(setWorkoutTimeCal([]));
      }
    } catch (error) {
      console.log('Workout-Status', error);
    }
  };
  const allWorkoutApi = async () => {
    try {
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
  const getLeaderboardDataAPI = async () => {
    try {
      const result = await axios({
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });
      if (result.data) {
        const myRank = result.data?.data?.findIndex(
          item => item?.id == getUserDataDetails?.id,
        );
        setTotalData(result.data?.data);
        setWinnerAnnounce(result?.data);
        if (myRank != -1) {
          setMyRank(result.data?.data[myRank]?.rank);
        } else {
          setMyRank(0);
        }
        dispatch(setFitCoins(result.data?.data[myRank]?.fit_coins));
        dispatch(
          setWinnerAnnounced(
            result.data?.winner_announced == true ? true : false,
          ),
        );
      }
      setRefresh(false);
    } catch (error) {
      console.log(error);
      setRefresh(false);
    }
  };

  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
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
      } else if (responseData?.data?.msg == 'version is required') {
      } else {
        const objects = {};
        responseData.data.data.forEach(item => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
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
      return 'Good Evening';
    }
  };

  const getAllChallangeAndAllExerciseData = async () => {
    let responseData = 0;
    if (Object.keys(getUserDataDetails).length > 0) {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        const challenge = responseData?.data?.challenge_data?.filter(
          item => item?.status == 'active',
        );

        setCurrentChallenge(challenge);
        getCurrentDayAPI(challenge);
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
  const getCurrentDayAPI = async challenge => {
    const data = challenge[0];
    try {
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
        const result = analyzeExerciseData(res.data?.user_details);

        if (result.two.length == 0) {
          let day = parseInt(result.one[result.one.length - 1]);
          for (const item of Object.entries(data?.days)) {
            const index = parseInt(item[0].split('day_')[1]);

            if (item[1]?.total_rest == 0 && index == day + 1) {
              setDay(index);
              break;
            } else {
              setDay(day);
            }
          }
          const temp2 = res.data?.user_details?.filter(
            item => item?.user_day == result.one[0],
          );
        } else {
          const temp = res.data?.user_details?.filter(
            item =>
              item?.user_day == result.two[0] &&
              item?.exercise_status == 'undone',
          );
          const temp2 = res.data?.user_details?.filter(
            item => item?.user_day == result.two[0],
          );

          setDay(result.two[0]);
        }
      } else {
      }
      const percentage = (
        (day / currentChallenge[0]?.total_days) *
        100
      ).toFixed(0);
    } catch (error) {
      console.error(error, 'DAPIERror');
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
  const getPastWinner = () => {
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/past_winners';
    RequestAPI.makeRequest(
      'POST',
      // url,
      NewAppapi.GET_PAST_WINNERS,
      {
        version: VersionNumber.appVersion,
      },
      res => {
        if (res.error) {
          setPastWinners([]);
        }
        if (res.data) {
          setPastWinners(res.data?.data);
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={AppColor.Background_New}
        barStyle={'dark-content'}
      />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              getAllChallangeAndAllExerciseData();
              getUserAllInData();
              getLeaderboardDataAPI();
              getWeeklyAPI();

              enteredCurrentEvent && getEarnedCoins();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={[styles.container]}
        nestedScrollEnabled>
        <View style={styles.userCard}>
          <View
            style={{
              width: '55%',
              // height: DeviceHeigth * 0.1,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View style={styles.imageView}>
              <Image
                source={
                  getUserDataDetails.image_path == null
                    ? localImage.avt
                    : {uri: getUserDataDetails.image_path}
                }
                resizeMode="cover"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 80 / 2,
                }}
              />
            </View>
            <View>
              <View style={{marginHorizontal: -10, justifyContent: 'center'}}>
                <Text
                  style={{
                    //  top: 5,
                    fontSize: 13,
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    fontWeight: '300',
                    lineHeight: 20,
                    color: AppColor.SecondaryTextColor,
                  }}>
                  {getTimeOfDayMessage()}
                </Text>
                <Text
                  style={{
                    top: -2,
                    fontSize: 12,
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontWeight: '700',
                    lineHeight: 20,
                    color: AppColor.PrimaryTextColor,
                  }}>
                  {Object.keys(getUserDataDetails)?.length > 0 ||
                  getUserDataDetails?.length > 0
                    ? getUserDataDetails?.name == null
                      ? 'Guest'
                      : getUserDataDetails?.name.split(' ')[0]
                    : 'Guest'}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '45%',
              height: DeviceHeigth * 0.1,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {enteredCurrentEvent ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={totalData.length > 0 ? false : true}
                  onPress={() => {
                    if (totalData.length > 0) {
                      AnalyticsConsole('LB');
                      navigation.navigate('Leaderboard');
                    } else {
                      showMessage({
                        message: 'No one has joined the event yet',
                        type: 'info',
                        animationDuration: 500,
                        floating: true,
                        icon: {icon: 'auto', position: 'left'},
                      });
                    }
                  }}
                  style={{
                    width: 70,
                    height: 40,
                    borderRadius: 6,
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: '#DBEAFE',
                    marginHorizontal: 10,
                    paddingLeft: 10,
                  }}>
                  <Image
                    source={require('../../Icon/Images/NewHome/cup.png')}
                    style={{height: 15, width: 15}}
                    resizeMode="contain"
                  />
                  <Text style={styles.cointxt}>#{myRank}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={(Sat || Sun) == true}
                  onPress={() => {
                    AnalyticsConsole('HB');
                    navigation.navigate('WorkoutHistory');
                  }}
                  style={{
                    width: 70,
                    height: 40,
                    borderRadius: 6,
                    alignItems: 'center',
                    flexDirection: 'row',
                    // paddingLeft: 10,
                    justifyContent: 'center',
                    backgroundColor: AppColor.orangeColor,
                  }}>
                  <Image
                    source={localImage.FitCoin}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                  <Text style={styles.cointxt}>
                    {fitCoins <= 0 ? 0 : fitCoins}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  if (totalData.length > 0) {
                    AnalyticsConsole('LB');
                    navigation.navigate('Leaderboard');
                  } else {
                    showMessage({
                      message: 'No one has joined the event yet',
                      type: 'info',
                      animationDuration: 500,
                      floating: true,
                      icon: {icon: 'auto', position: 'left'},
                    });
                  }
                  // AnalyticsConsole('LB');
                  // navigation.navigate('Leaderboard');
                }}
                style={{
                  // width: 150,
                  height: 40,
                  borderRadius: 6,
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingLeft: 5,
                  paddingRight: 5,
                  //justifyContent: 'center',
                  backgroundColor: '#DBEAFE',
                }}>
                <Image
                  source={require('../../Icon/Images/NewHome/cup.png')}
                  style={{height: 15, width: 15}}
                  resizeMode="contain"
                />
                <Text style={styles.cointxt}>Leaderboard</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {enteredCurrentEvent && (
          <ImageBackground
            source={require('../../Icon/Images/NewHome/Banner.png')}
            resizeMode="stretch"
            style={{
              width: DeviceWidth * 0.95,
              height: DeviceHeigth * 0.07,
              alignSelf: 'center',
              flexDirection: 'row',
              marginVertical: 5,
              marginBottom: DeviceHeigth * 0.02,

              alignItems: 'center',
            }}>
            <View
              style={{
                width: '10%',
                height: '100%',
                justifyContent: 'center',

                marginLeft: 10,
              }}>
              <Image
                source={require('../../Icon/Images/NewHome/gift.png')}
                style={{height: '90%', width: '100%'}}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: DeviceHeigth >= 1024 ? '70%' : '60%',
                height: '100%',
                overflow: 'visible',
                zIndex: 1,
                justifyContent: 'center',
              }}>
              <Marquee spacing={20} speed={0.7}>
                <Text
                  style={{
                    color: AppColor.PrimaryTextColor,
                    fontFamily: Fonts.HELVETICA_REGULAR,
                  }}>
                  Explore Special Offers to Win Exciting Prizes! Check Out the
                  Upcoming Challenges!
                </Text>
              </Marquee>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('OfferPage');
                // navigation.navigate('StepGuide');
              }}
              style={{
                width: DeviceHeigth >= 1024 ? '16%' : '25%',
                height: '60%',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 8,
                paddingLeft: 10,
                backgroundColor: AppColor.RED,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 12,
                  lineHeight: 25,

                  color: AppColor.WHITE,
                }}>
                EXPLORE
              </Text>
              <Icons name={'chevron-right'} size={20} color={AppColor.WHITE} />
              <Reanimated.View style={[styles.shimmerWrapper, shimmerStyle]}>
                <LinearGradient
                  colors={['#ffffff00', '#ffffff80', '#ffffff00']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.shimmer}
                />
              </Reanimated.View>
            </TouchableOpacity>
          </ImageBackground>
        )}
        {winnerAnnounce?.winner_announced == true ? (
          <WinnerView totalData={totalData} />
        ) : enteredCurrentEvent ? (
          (Sat || Sun) != true && <MyChallenge coins={coins} />
        ) : (
          <NewBanner
            purchaseHistory={getPurchaseHistory}
            userDetails={getUserDataDetails}
            setLocation={setLocationP1}
            Sat={Sat}
            Sun={Sun}
            enteredCurrentEvent={enteredCurrentEvent}
            enteredUpcomingEvent={enteredUpcomingEvent}
          />
        )}

        <WithoutEvent pastWinners={pastWinners} />

        {currentChallenge?.length > 0 && (
          <WorkoutChallengeZone day={day} currentChallenge={currentChallenge} />
        )}
        {Platform.OS == 'ios' && <AppleStepCounter />}
        <UserEspecially />
        <FocuseMind />
        {/* <FitnessInstructor /> */}
        {enteredCurrentEvent && (!Sat || !Sun) && <InviteFriends />}
      </ScrollView>
      <RewardModal
        navigation={navigation}
        visible={getRewardModalStatus}
        imagesource={localImage.Reward_icon}
        // ButtonText={'Start now'}
        txt1={'Get Set, Go!'}
        txt2={
          'Your Fitness Challenge is NOW LIVE! Start the Challenge Now to Earn Cash Rewards.'
        }
        onCancel={() => {
          AnalyticsConsole('CHS_CAN');
          dispatch(setRewardModal(false));
        }}
        // onConfirm={() => {

        // }}
      />
      {getOfferAgreement?.location === 'India' ||
      getOfferAgreement?.location == 'United States' ? (
        (getPopUpFreuqency == 6 || getPopUpFreuqency % 5 == 0) &&
        !enteredUpcomingEvent ? (
          <UpcomingEventModal
            visible={true}
            onConfirm={() => {
              AnalyticsConsole('U_E');
              if (getPurchaseHistory) {
                if (getPurchaseHistory.plan === 'noob') {
                  navigation?.navigate('NewSubscription', {upgrade: true});
                  showMessage({
                    message:
                      'Oops! You’ve used up all your chances to join the event. Upgrade your plan to join now, or wait to renew your plan.',
                    type: 'info',
                    animationDuration: 500,
                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                  dispatch(setRewardPopUp(1));
                } else if (
                  getPurchaseHistory.plan !== 'noob' &&
                  getPurchaseHistory.used_plan < getPurchaseHistory.allow_usage
                ) {
                  navigation?.navigate('UpcomingEvent', {
                    eventType: 'upcoming',
                  });
                  dispatch(setRewardPopUp(1));
                } else {
                  navigation?.navigate('NewSubscription', {upgrade: true});
                  dispatch(setRewardPopUp(1));
                }
              } else {
                navigation?.navigate('NewSubscription', {upgrade: true});
                dispatch(setRewardPopUp(1));
              }
            }}
            onCancel={() => {
              AnalyticsConsole('JNC_D_B');
              dispatch(setRewardPopUp(1));
            }}
          />
        ) : null
      ) : null}
      <LocationPermissionModal
        locationP={locationP1}
        setLocationP={setLocationP1}
      />
      {/* <WinnerViewModal
        setWinnerAnnounced={setWinnerAnnounced}
        winnerVisible={winnerVisible}
        //mainData={mainData}
      /> */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          AnalyticsConsole(`AI_TRAINER_BUTTON`);
          navigation.navigate('AITrainer');
        }}
        style={{
          width: 56,
          height: 56,
          backgroundColor: '#F7F7F7',
          position: 'absolute',
          bottom: 20,
          right: 10,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'rgba(0, 0, 0, 1)',
          ...Platform.select({
            ios: {
              shadowColor: 'rgba(0, 0, 0, 1)',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            android: {
              elevation: 4,
              // shadowRadius: 3,
            },
          }),
        }}>
        <Image
          source={require('../../Icon/Images/NewHome/chat.png')}
          style={{
            width: 25,
            height: 25,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColor.Background_New,
  },
  userCard: {
    width: DeviceWidth * 0.95,
    //height: DeviceHeigth * 0.1,
    alignSelf: 'center',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColor.Background_New,
  },
  imageView: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 120 / 2,
  },
  cointxt: {
    color: '#1E40AF',
    fontSize: 16,
    fontFamily: Fonts.HELVETICA_BOLD,
    lineHeight: 30,
    // marginTop: 5,
    marginHorizontal: 5,
  },
  shimmerWrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  shimmer: {
    width: '20%',
    height: '100%',
  },
});
export default NewHome;
