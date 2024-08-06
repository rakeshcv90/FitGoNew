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
  setWinnerAnnounced,
  setWorkoutTimeCal,
} from '../../Component/ThemeRedux/Actions';
import {useIsFocused} from '@react-navigation/native';
import AppleStepCounter from '../../Component/NewHomeUtilities/AppleStepCounter';
import UserEspecially from '../../Component/NewHomeUtilities/UserEspecially';
import axios from 'axios';
import OfferZone from '../../Component/NewHomeUtilities/OfferZone';
import WithEvent from '../../Component/NewHomeUtilities/WithEvent';
import WithoutEvent from '../../Component/NewHomeUtilities/WithoutEvent';
import FocuseMind from '../../Component/NewHomeUtilities/FocuseMind';
import FitnessInstructor from '../../Component/NewHomeUtilities/FitnessInstructor';
import InviteFriends from '../../Component/NewHomeUtilities/InviteFriends';
import RewardModal from '../../Component/Utilities/RewardModal';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AlarmNotification} from '../../Component/Reminder';
import notifee from '@notifee/react-native';
import {checkLocationPermission} from '../Terms&Country/LocationPermission';
import UpcomingEventModal from '../../Component/Utilities/UpcomingEventModal';
import {showMessage} from 'react-native-flash-message';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';
import {LocationPermissionModal} from '../../Component/Utilities/LocationPermission';

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
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const [day, setDay] = useState(0);
  const isFocused = useIsFocused();
  const getRewardModalStatus = useSelector(
    state => state?.getRewardModalStatus,
  );
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [BannerType1, setBannertype1] = useState('');
  const [Bannertype2, setBannerType2] = useState('');
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 7;
  useEffect(() => {
    if (isFocused) {
      getAllChallangeAndAllExerciseData();
      getLeaderboardDataAPI();
      allWorkoutApi();
      getWorkoutStatus();
      getUserDetailData();
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
        console.log('version error', responseData?.data?.msg);
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
      return 'Good Night';
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
        // console.log('challenge', challenge);
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle={'dark-content'} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: DeviceHeigth * 0.0,
          paddingVertical:
            Platform.OS == 'ios'
              ? DeviceHeigth >= 1024
                ? DeviceHeigth * 0.06
                : DeviceHeigth * 0.04
              : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              getAllChallangeAndAllExerciseData();
              getUserAllInData();
            }}
            colors={[AppColor.RED, AppColor.WHITE]}
          />
        }
        style={[styles.container]}
        nestedScrollEnabled>
        <View style={styles.userCard}>
          <View
            style={{
              width: '69%',
              height: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={styles.imageView}>
                <Image
                  source={
                    getUserDataDetails.image_path == null
                      ? localImage.avt
                      : {uri: getUserDataDetails.image_path}
                  }
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100 / 2,
                  }}
                />
              </View>
              <View>
                <View style={{marginHorizontal: 10}}>
                  <Text
                    style={{
                      top: -5,
                      fontSize: 18,
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontWeight: '300',
                      lineHeight: 20,
                      color: AppColor.SecondaryTextColor,
                    }}>
                    {getTimeOfDayMessage()}
                  </Text>
                  <Text
                    style={{
                      top: 5,
                      fontSize: 18,
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 6,
              alignItems: 'center',
              padding: 10,

              backgroundColor: AppColor.orangeColor,
            }}>
            <Image
              source={localImage.FitCoin}
              style={{height: 30, width: 30}}
              resizeMode="contain"
            />
            <Text style={styles.cointxt}>{fitCoins} coins</Text>
          </View>
        </View>
        <TextBanner
          locationP={locationP1}
          setLocationP={setLocationP1}
          navigation={navigation}
        />
        <OfferZone />
        {enteredCurrentEvent ? <WithEvent /> : <WithoutEvent />}

        <WorkoutChallengeZone day={day} currentChallenge={currentChallenge} />
        {Platform.OS == 'ios' && <AppleStepCounter />}
        <UserEspecially />
        <FocuseMind />
        <FitnessInstructor />
        {enteredCurrentEvent && (!Sat || !Sun) && <InviteFriends />}
      </ScrollView>
      <RewardModal
        navigation={navigation}
        visible={getRewardModalStatus}
        imagesource={localImage.Reward_icon}
        ButtonText={'Start now'}
        txt1={'Challenge On!\n'}
        txt2={
          'Your fitness challenge has started! Begin now to collect FitCoins and win cash rewards!'
        }
        onCancel={() => {
          AnalyticsConsole('CHS_CAN');
          dispatch(setRewardModal(false));
        }}
        onConfirm={() => {
          AnalyticsConsole('CHS_OPEN');
          dispatch(setRewardModal(false));
          navigation.navigate('BottomTab', {
            screen: 'MyPlans',
          });
        }}
      />
      {getOfferAgreement?.location == 'India' ? (
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
    height: DeviceHeigth * 0.1,
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

    borderRadius: 120 / 2,
  },
  cointxt: {
    color: AppColor.orangeColor1,
    fontSize: 18,
    fontFamily: Fonts.HELVETICA_BOLD,
    lineHeight: 20,
    marginHorizontal: 5,
  },
});
export default NewHome;
