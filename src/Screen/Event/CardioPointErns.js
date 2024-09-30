import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FitCoins from '../../Component/Utilities/FitCoins';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useSelector, useDispatch} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {showMessage} from 'react-native-flash-message';
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import moment from 'moment';
import axios from 'axios';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const CardioPointErns = ({navigation, route}) => {
  const {day, type, weeklyTime, weeklyCal, weeklyCoins, allExercise} =
    route?.params;
  const fitCoins = useSelector(state => state.fitCoins);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const [cardioExxercise, setCardioExercise] = useState([]);
  const [downloaded, setDownloade] = useState(0);
  const [selectedDay, setSelectedDay] = useState((moment().day() + 6) % 7);
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  useEffect(() => {
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
    // const url =
    //   'https://fitme.cvinfotechserver.com/adserver/public/api/test_user_event__exercise_status';
    for (const item of cardioExxercise) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: -13,
        user_day: WeekArray[day],
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

      //Test URl
      // const res = await axios({
      //   url: url,
      //   method: 'Post',
      //   data: {user_details: datas, type: 'cardio'},
      // });
      setDownloade(0);

      AnalyticsConsole(`SCE_ON_${getPurchaseHistory?.currentDay}`);
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
  return (
    <View style={[styles.container]}>
      <StatusBar barStyle={'default'} backgroundColor={'#7473e1'} />
      <LinearGradient
        colors={['#4348EE', '#9280F6']}
        style={[styles.container, {opacity: 0.8}]}
        start={{x: 1, y: 0}}
        end={{x: 2, y: 1}}>
        <AnimatedLottieView
          source={require('../../Icon/Images/CardioScreenImage/backgroung.json')}
          speed={1}
          autoPlay
          loop
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <View style={{position: 'absolute', flex: 1, alignSelf: 'center'}}>
          <View
            style={{
              flex: 0.8,
              justifyContent: 'center',
              paddingTop: Platform.OS == 'ios' ? DeviceHeigth * 0.07 : 0,
            }}>
            <View
              style={{
                alignSelf: 'flex-end',
                marginRight: 16,
                marginVertical: 10,
                marginRight: -5,
              }}>
              <FitCoins coins={fitCoins > 0 ? fitCoins : 0} disable={true} />
            </View>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: 'center',
              alignItems: 'center',

              marginVertical: 10,
            }}>
            <ImageBackground
              source={require('../../Icon/Images/CardioScreenImage/CardioBanner.png')}
              style={{
                width: DeviceWidth * 0.9,
                height: 80,
                alignSelf: 'center',
                marginVertical: 10,
              }}
              resizeMode="contain">
              <AnimatedLottieView
                source={require('../../Icon/Images/CardioScreenImage/watch.json')}
                speed={1}
                autoPlay
                loop
                resizeMode="cover"
                style={{
                  width: 80,
                  height: 80,
                  left: -DeviceWidth * 0.05,
                  top: -DeviceWidth * 0.1,
                }}
              />
            </ImageBackground>
          </View>
          <View style={{flex: 5.5}}>
            <AnimatedLottieView
              source={require('../../Icon/Images/CardioScreenImage/runing.json')}
              speed={1}
              autoPlay
              loop
              resizeMode="cover"
              style={{
                width: '100%',
                height: DeviceHeigth * 0.5,
                marginTop: -70,
              }}
            />
          </View>
          <View style={{flex: 2.2, flexDirection: 'column'}}>
            <TouchableOpacity
              onPress={() => {
                handleStart();
              }}
              style={{
                width: DeviceWidth * 0.7,
                marginVertical: 10,
                alignSelf: 'center',
              }}>
              <Image
                source={require('../../Icon/Images/CardioScreenImage/CardioCoin.png')}
                style={{
                  width: DeviceWidth * 0.9,
                  height: DeviceHeigth * 0.08,
                  alignSelf: 'center',
                  marginVertical: 20,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation?.navigate('BreathSessionInfo', {
                  type: type,
                  day: day,
                  weeklyTime: weeklyTime,
                  weeklyCal: weeklyCal,
                  weeklyCoins: weeklyCoins,
                  allExercise: allExercise,
                })
              }
              style={{
                width: 268,
                height: 40,

                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: AppColor.WHITE,
                  fontWeight: '700',
                  lineHeight: 25,
                  fontSize: 20,
                  fontFamily: Fonts.MONTSERRAT_BOLD,
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FDFDFD',
  },
});
export default CardioPointErns;
