import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import WorkoutCard from './WorkoutCard';
import Animated, {
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
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import LoadingScreen from '../../Component/LoadingScreen';

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
  const {day, allExercise, type} = route?.params;
  const streakCardOffset = useSharedValue(0);
  const cardioCardOffset = useSharedValue(DeviceWidth);
  const breatheCardOffset = useSharedValue(DeviceWidth);
  const completeCardOffset = useSharedValue(DeviceWidth);
  console.log('TYPEESADDAS', type);
  const [coins, setCoins] = useState({});
  const [myRank, setMyRank] = useState('');
  const [cardioExxercise, setCardioExercise] = useState([]);
  const [downloaded, setDownloade] = useState(0);
  const [loader, setLoader] = useState(true);

  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    let timeOut = setTimeout(() => {
      AnimationStart();
    }, 5000);
    return () => clearTimeout(timeOut);
  }, []);
  const AnimationStart = () => {
    streakCardOffset.value = withTiming(-DeviceWidth, {duration: 500}, () => {
      cardioCardOffset.value = withSpring(0);
    });
  };
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
  const handleCardioeSkip = () => {
    cardioCardOffset.value = withTiming(0,{duration:500})
    
  };
  const handleBreatheSkip = () => {
    breatheCardOffset.value = withTiming(0,{duration:500})
  };
  const handleCompleteSkip = () => {
    completeCardOffset.value = withTiming(0,{duration:500})
  };

  useEffect(() => {
    getEventEarnedCoins();
    filterCardioExercise();
  }, []);
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

  const RewardsbeforeNextScreen = async () => {
    downloadCounter = 0;
    const url =
      'https://fitme.cvinfotech.in/adserver/public/api/test_user_event__exercise_status';
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
      // const res = await axios({
      //   url: NewAppapi.CURRENT_DAY_EVENT_EXERCISE,
      //   method: 'Post',
      //   data: {user_details: datas, type: 'cardio'},
      // });

      //Test URl
      const res = await axios({
        url: url,
        method: 'Post',
        data: {user_details: datas, type: 'cardio'},
      });
      setDownloade(0);

      AnalyticsConsole(`SCE_ON_${getPurchaseHistory?.currentDay}`);
      console.log('cvbfghfghfgh', res.data);
      if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        setDownloade(0);

        navigation.navigate('CardioExercise', {
          allExercise: cardioExxercise,
          currentExercise: cardioExxercise[0],
          data: [],
          day: day,
          exerciseNumber: 0,
          trackerData: res?.data?.inserted_data,
          type: 'cardio',
        });
        // }
      } else {
        navigation.navigate('CardioExercise', {
          allExercise: cardioExxercise,
          currentExercise: cardioExxercise[0],
          data: [],
          day: day,
          exerciseNumber: 0,
          trackerData: res?.data?.existing_data,
          type: 'cardio',
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
      return item?.exercise_bodypart == 'Cardio';
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
        'https://fitme.cvinfotech.in/adserver/public/api/testing_add_coins',
        // NewAppapi.POST_API_FOR_COIN_CALCULATION,
        {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        },
      );
      console.log('WEEKLY CAL', res.data, payload);
      getEarnedCoins();
      // if (res.data) {
      //   console.log('WEEKLY CAL', res.data);
      //   let complete = res.data?.completed_exercise;
      //   let totalExerciseTime = 0,
      //     totalCalories = 0;
      //   allExercise?.map((item, index) => {
      //     if (index + 1 <= complete) {
      //       // Assuming exercise_rest is a string like '30 sec'
      //       let restPeriod = parseInt(item?.exercise_rest?.split(' ')[0]);
      //       let numberOfSets = 3; // Assuming each exercise has 3 sets
      //       totalExerciseTime += restPeriod * numberOfSets;
      //       totalCalories = parseInt(item?.exercise_calories) + totalCalories;
      //       console.log(totalCalories, totalExerciseTime);
      //     }
      //   });
      //   setExerciseTime(totalExerciseTime);
      //   setExerciseCal(totalCalories);
      //   (complete = 0), (totalCalories = 0), (totalExerciseTime = 0);
      //   setCount(res.data?.coins);

      //   // animate();
      // }
    } catch (error) {
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
        'https://fitme.cvinfotech.in/adserver/public/api/test_leader_board';
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
        url: `${NewAppapi.GET_BREATH_SESSION}`,
      });

      if (result.data) {
        const openIndex = result?.data?.sessions?.findIndex(
          item => item.status == 'open',
        );
        setLoader(false);
        if (openIndex == -1) {
          type == 'cardio' ? handleCompleteSkip() : handleCardioeSkip();
        } else {
          handleBreatheSkip();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {loader ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <StatusBar
            backgroundColor={AppColor.GRAY}
            barStyle={'dark-content'}
          />
          <NewHeader backButton header={'Exercise Completed'} />
          <View style={{flex: 1}}>
            <Animated.View style={[styles.imgView, streakAnimation]}>
              <Image source={localImage.offer_girl} style={styles.imgStyle1} />
              <WorkoutCard
                cardType={'streak'}
                streakCoins={coins}
                cardioCoins={cardioExxercise[0]?.fit_coins}
                download={0}
              />
            </Animated.View>
            <Animated.View style={[styles.imgView, cardioAnimation]}>
              <Image source={localImage.cardioImage} style={styles.imgStyle1} />
              <WorkoutCard
                cardType={'cardio'}
                cardHeader={'Cardio Point'}
                onPress={() => handleStart()}
                streakCoins={coins}
                cardioCoins={cardioExxercise[0]?.fit_coins}
                handleSkip={handleCardioeSkip}
                download={downloaded}
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
                onPress={() => {}}
                streakCoins={coins}
                cardioCoins={cardioExxercise[0]?.fit_coins}
                download={0}
                handleSkip={handleBreatheSkip}
              />
            </Animated.View>
            <Animated.View style={[styles.imgView, completeAnimation]}>
              <Image source={localImage.offer_girl} style={styles.imgStyle1} />
              <WorkoutCard
                cardType={'complete'}
                cardHeader={'Exercise Completed'}
                streakCoins={coins}
                cardioCoins={cardioExxercise[0]?.fit_coins}
                download={0}
              />
            </Animated.View>
          </View>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.GRAY,
  },
  imgView: {
    height: DeviceHeigth * 0.5,
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
});
export default WorkoutCompleted;
