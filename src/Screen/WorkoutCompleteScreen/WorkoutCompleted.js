import {View, Text, StyleSheet, StatusBar, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import WorkoutCard from './WorkoutCard';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import axios from 'axios';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber from 'react-native-version-number';
import RNFetchBlob from 'rn-fetch-blob';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {
  setExerciseInTime,
  setVideoLocation,
} from '../../Component/ThemeRedux/Actions';
import {useIsFocused} from '@react-navigation/native';
import OverExerciseModal from '../../Component/Utilities/OverExercise';
import Wrapper from './Wrapper';
import AnimatedLottieView from 'lottie-react-native';
import LoadingScreen from '../../Component/NewHomeUtilities/LoadingScreen';
import { ReviewApp } from '../../Component/ReviewApp';
const format = 'hh:mm:ss';

const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const WorkoutCompleted = ({navigation, route}) => {
  const day = route?.params?.day;
  const type = route?.params?.type;
  const rank = route?.params?.rank;
  const slotCoins = route?.params?.slotCoins;
  const streakCardOffset = useSharedValue(0);
  const cardioCardOffset = useSharedValue(DeviceWidth);
  const breatheCardOffset = useSharedValue(DeviceWidth);
  const completeCardOffset = useSharedValue(DeviceWidth);
  const [coins, setCoins] = useState({});
  const [myRank, setMyRank] = useState('');
  const [cardioExxercise, setCardioExercise] = useState([]);
  const [downloaded, setDownloade] = useState(0);
  const [loader, setLoader] = useState(true);
  const [breatheSessionAvailabel, setBraetheSessionAvailable] = useState(false);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [earnedCoin, setEarnedCoin] = useState(0);
  const [breatheCoins, setBreatheCoins] = useState(0);
  const [slotDetails, setSlotDetails] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    filterCardioExercise();
    if (type == 'complete') {
      completeCardOffset.value = withSpring(0);
    } else if (type == 'cardio' || type == 'weekly') {
      getEventEarnedCoins();
    }
  }, [type]);
  const streakAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: streakCardOffset.value}],
    };
  });
  const cardioAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: cardioCardOffset.value}],
    };
  });
  const breatheAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: breatheCardOffset.value}],
    };
  });
  const completeAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: completeCardOffset.value}],
    };
  });
  const handleBreatheSkip = () => {
    breatheCardOffset.value = withSpring(0);
  };
  const handleCompleteSkip = () => {
    completeCardOffset.value = withSpring(0);
  };
  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData = {},
    downloadCounter = 0;
  const downloadVideos = async (data, index, len) => {
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
      console.log('Downloding');
    } catch (error) {
      console.log('ERRRR', error);

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
    Promise.all(
      cardioExxercise.map((item, index) => {
        return downloadVideos(item, index, cardioExxercise.length);
      }),
    ).finally(() => {
      RewardsbeforeNextScreen();
    });
  };
  const getExerciseInTime = useSelector(state => state.getExerciseInTime);
  const getExerciseOutTime = useSelector(state => state.getExerciseOutTime);
  const [overExerciseVisible, setOverExerciseVisible] = useState(false);
  const getEquipmentExercise = useSelector(
    state => state?.getEquipmentExercise,
  );
  const focused = useIsFocused();

  useEffect(() => {
    // Add an event listener to handle the hardware back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Remove the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  useEffect(() => {
    if (
      getExerciseOutTime != '' &&
      moment().format(format) > getExerciseOutTime
      // moment(getExerciseInTime, format).isAfter(
      //   moment(getExerciseOutTime, format),
      // )
    ) {
      setOverExerciseVisible(true);
    } else {
    }
  }, [focused]);
  const handleBackPress = () => {
    return true;
  };
  const RewardsbeforeNextScreen = async () => {
    downloadCounter = 0;
    for (const item of cardioExxercise) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: -13,
        user_day: WeekArrayWithEvent[day],
        user_exercise_id: item?.exercise_id,
        fit_coins: item?.fit_coins,
      });
    }
    try {
      //LIVE URL
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EVENT_EXERCISE,
        method: 'Post',
        data: {user_details: datas, type: 'cardio'},
      });
      setDownloade(0);
      AnalyticsConsole(`SCE_ON_${getPurchaseHistory?.currentDay}`);
      // setStart(false);
      // if (moment().format(format) < getExerciseOutTime) {
      //   console.warn('COMPLETEE', moment().format(format));
      //   dispatch(setExerciseInTime(moment().format(format)));
      // }
      if (res.data?.msg == 'Required keys are missing in user_details') {
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
      } else if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        setDownloade(0);
        cardioCardOffset.value = withSpring(-DeviceWidth);
        navigation.navigate('CardioExercise', {
          allExercise: cardioExxercise,
          currentExercise: cardioExxercise[0],
          data: [],
          day: day,
          exerciseNumber: 0,
          trackerData: res?.data?.inserted_data,
          type: 'cardio',
          offerType: false,
          challenge: false,
          isEventPage: true
        });
        // }
      } else {
        cardioCardOffset.value = withSpring(-DeviceWidth);
        navigation.navigate('CardioExercise', {
          allExercise: cardioExxercise,
          currentExercise: cardioExxercise[0],
          data: [],
          day: day,
          exerciseNumber: 0,
          trackerData: res?.data?.existing_data,
          type: 'cardio',
          offerType: false,
          challenge: false,
          isEventPage: true
        });
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setDownloade(0);

      showMessage({
        message: 'Error, Please try again later',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const filterCardioExercise = () => {
    let exercises = getAllExercise?.filter(item => {
      if (getEquipmentExercise == 0) {
        return (
          item?.exercise_bodypart == 'Cardio' &&
          item?.exercise_equipment != 'No Equipment'
        );
      } else {
        return (
          item?.exercise_bodypart == 'Cardio' &&
          item?.exercise_equipment == 'No Equipment'
        );
      }
    });
    setCardioExercise(exercises);
  };
  const getEventEarnedCoins = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('user_day', WeekArrayWithEvent[day]);
    payload.append('type', type);
    try {
      const res = await axios(
        // 'https://fitme.cvinfotechserver.com/adserver/public/api/testing_add_coins',
        NewAppapi.POST_API_FOR_COIN_CALCULATION,
        {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        },
      );
      console.log('WEEKLY CAL', res.data, payload);
      setEarnedCoin(res?.data?.coins);
      getEarnedCoins();
    } catch (error) {
      getEarnedCoins();
      console.log('ERRRRRR', error);
    }
  };
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
        getLeaderboardDataAPI();
      }
    } catch (error) {
      getLeaderboardDataAPI();
      showMessage({
        message: 'Something went wrong.',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  const getLeaderboardDataAPI = async () => {
    try {
      const url =
        'https://fitme.cvinfotechserver.com/adserver/public/api/test_leader_board';
      const result = await axios({
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });

      if (result.data) {
        const myRank = result.data?.data?.findIndex(
          item => item?.id == getUserDataDetails?.id,
        );
        setMyRank(result.data?.data[myRank]?.rank);
      }
      getBreatheAPI();
    } catch (error) {
      console.log(error);
      getBreatheAPI();
    }
  };
  const getBreatheAPI = async () => {
    try {
      const result = await axios({
        url: `${NewAppapi.GET_BREATH_SESSION}?user_id=${getUserDataDetails?.id}`,
      });
      setLoader(false);
      if (result.data) {
        const openIndex = result?.data?.sessions?.findIndex(
          item => item.status == 'open',
        );
        if (openIndex == -1 && type == 'cardio') {
          handleCompleteSkip();
        } else if (type == 'weekly' && openIndex != -1) {
          setBraetheSessionAvailable(
            result?.data?.sessions[openIndex]?.complete_status,
          );
          setBreatheCoins(result?.data?.sessions[openIndex]?.fit_coins);
        } else if (type == 'cardio') {
          setBreatheCoins(result?.data?.sessions[openIndex]?.fit_coins);
          handleBreatheSkip();
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const onPress = () => navigation.navigate('MyPlans')
  
  return (
    <>
      {!loader ? (
        <LoadingScreen />
      ) : (
        <Wrapper>
          <View style={styles.container}>
            <StatusBar
              backgroundColor={AppColor.GRAY}
              barStyle={'dark-content'}
            />
            <Text style={styles.headerText}>Workout Completed</Text>
            <View style={{flex: 1, marginTop: 5}}>
              <Animated.View style={[styles.imgView, streakAnimation]}>
                <View
                  style={{
                    height: '96%',
                    width: '100%',
                    backgroundColor: AppColor.WHITE,
                    borderRadius: 16,
                    marginBottom: 7,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={localImage.celebrationTrophy}
                    style={{height: '70%'}}
                    resizeMode="contain"
                  />
                  <AnimatedLottieView
                    source={localImage.celebrationAnimation}
                    speed={1.5}
                    autoPlay
                    loop
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <WorkoutCard
                  cardType={'streak'}
                  streakCoins={coins}
                  cardioCoins={cardioExxercise[0]?.fit_coins}
                  download={0}
                  title={`You’ve completed your workout for the day. Workout regularly to increase your chances of winning exciting prizes!`}
                  cardHeader={'Fitcoins Earned'}
                  handleSkip={() => {
                    if (
                      WeekArrayWithEvent[getPurchaseHistory - 1] == 'Thursday'
                    ) {
                      if (breatheSessionAvailabel) {
                        streakCardOffset.value = withSpring(-DeviceWidth);
                        breatheCardOffset.value = withSpring(0);
                      } else {
                        streakCardOffset.value = withSpring(-DeviceWidth);
                        completeCardOffset.value = withSpring(0);
                      }
                    } else {
                      streakCardOffset.value = withSpring(-DeviceWidth);
                      cardioCardOffset.value = withSpring(0);
                    }
                  }}
                />
              </Animated.View>
              <Animated.View style={[styles.imgView, cardioAnimation]}>
                <Image
                  source={localImage.cardioImage}
                  style={styles.imgStyle1}
                  resizeMode="stretch"
                />
                <WorkoutCard
                  cardType={'cardio'}
                  cardHeader={'Cardio Point'}
                  onPress={() => handleStart()}
                  streakCoins={coins}
                  cardioCoins={cardioExxercise[0]?.fit_coins}
                  handleSkip={() => {
                    if (!breatheSessionAvailabel) {
                      cardioCardOffset.value = withSpring(-DeviceWidth);
                      breatheCardOffset.value = withSpring(0);
                    } else {
                      cardioCardOffset.value = withSpring(-DeviceWidth);
                      completeCardOffset.value = withSpring(0);
                    }
                  }}
                  download={downloaded}
                  EarnedCoins={earnedCoin}
                  title={`Complete the 15-minute cardio session and increase your chances of winning fantastic prizes!`}
                />
              </Animated.View>
              <Animated.View style={[styles.imgView, breatheAnimation]}>
                <Image
                  source={localImage.breahteImage}
                  style={styles.imgStyle1}
                />
                <WorkoutCard
                  cardType={'breathe'}
                  cardHeader={'Breathe in & out'}
                  onPress={() => {
                    breatheCardOffset.value = withSpring(-DeviceWidth); //removing the card before navigation
                    navigation.navigate('Breathe', {slotCoins: breatheCoins});
                  }}
                  streakCoins={coins}
                  cardioCoins={cardioExxercise[0]?.fit_coins}
                  download={0}
                  handleSkip={() => {
                    breatheCardOffset.value = withSpring(-DeviceWidth);
                    completeCardOffset.value = withSpring(0);
                  }}
                  EarnedCoins={earnedCoin}
                  breatheCoins={breatheCoins}
                  title={
                    'Increase your chances to grab the amazing prizes! Complete a quick breathing exercise and earn Extra FitCoins.'
                  }
                />
              </Animated.View>
              <Animated.View style={[styles.imgView, completeAnimation]}>
                <View
                  style={{
                    height: '96%',
                    width: '100%',
                    backgroundColor: AppColor.WHITE,
                    borderRadius: 16,
                    marginBottom: 7,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={localImage.celebrationTrophy}
                    style={{height: '70%'}}
                    resizeMode="contain"
                  />
                  <AnimatedLottieView
                    source={localImage.celebrationAnimation}
                    speed={1.5}
                    autoPlay
                    loop
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <WorkoutCard
                  cardType={'complete'}
                  cardHeader={'Exercise Completed'}
                  streakCoins={coins}
                  cardioCoins={cardioExxercise[0]?.fit_coins}
                  download={0}
                  EarnedCoins={slotCoins ?? earnedCoin}
                  rank={rank ?? myRank}
                  title={
                    'Congratulations! You’ve completed your workout and earned more FitCoins. Keep working out regularly to win the fitness challenge.'
                  }
                  handleComplete={() => ReviewApp(onPress)}
                />
              </Animated.View>
            </View>
          </View>
        </Wrapper>
      )}
      <OverExerciseModal
        setOverExerciseVisible={setOverExerciseVisible}
        overExerciseVisible={overExerciseVisible}
        handleBreakButton={() => setOverExerciseVisible(false)}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: AppColor.GRAY,
  },
  imgView: {
    height: DeviceHeigth >= 1024 ? DeviceHeigth * 0.65 : DeviceHeigth * 0.5,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    marginBottom: 10,
    position: 'absolute',
  },
  imgStyle1: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    marginBottom: 10,
  },
  cardHolder: {position: 'absolute', bottom: 15, alignSelf: 'center'},
  headerText: {
    color: AppColor.BLACK,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    paddingVertical: 8,
  },
});
export default WorkoutCompleted;
