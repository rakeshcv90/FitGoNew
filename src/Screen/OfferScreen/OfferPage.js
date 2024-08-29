import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import OfferHeader from './OfferHeader';
import EventBanner from './EventBanner';
import OfferCards from './OfferCards';
import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import VersionNumber from 'react-native-version-number';
import RNFetchBlob from 'rn-fetch-blob';
import ActivityLoader from '../../Component/ActivityLoader';
import Loader from '../../Component/Loader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {setVideoLocation} from '../../Component/ThemeRedux/Actions';
import {useFocusEffect} from '@react-navigation/native';
const OfferPage = ({navigation, route}) => {
  const type = route?.params?.type;
  const WeekArrayWithEvent = Array(5)
    .fill(0)
    .map(
      (item, index) =>
        (item = moment()
          .add(index, 'days')
          .subtract(moment().isoWeekday() - 1, 'days')
          .format('dddd')),
    );
  const [breatheStatus, setBreatheStatus] = useState(false);
  const [cardioStatus, setCardioStatus] = useState(false);
  const [exerciseStatus, setExerciseStatus] = useState(false);
  const [breatheCoins, setBreatheCoins] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [workoutLoaded, setWokroutLoaded] = useState(true);
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [cardioExxercise, setCardioExercise] = useState([]);
  const getAllExercise = useSelector(state => state.getAllExercise);
  const [breatheCompleteStatus, setBreatheCompleteStatus] = useState(false);
  const [downloaded, setDownloade] = useState(0);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getBreatheAPI();
      filterCardioExercise();
      getEventEarnedCoins();
    }, []),
  );
  const getEventEarnedCoins = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append(
      'user_day',
      WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1],
    );
    payload.append('type', 'cardio');
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
      getCardioStatus();
    } catch (error) {
      console.log('ERRRRRR', error);
      getCardioStatus();
    }
  };
  const getBreatheAPI = async () => {
    try {
      const result = await axios({
        url: `${NewAppapi.GET_BREATH_SESSION}?user_id=${getUserDataDetails?.id}`,
      });

      if (result?.data) {
       enteredCurrentEvent && getEarnedCoins();
        const activeIndex = result?.data?.sessions?.findIndex(
          item => item.status == 'open',
        );
        if (activeIndex != -1) {
          setBreatheStatus(true);
          setBreatheCoins(result?.data?.sessions[activeIndex]?.fit_coins);
          setBreatheCompleteStatus(
            result?.data?.sessions[activeIndex]?.complete_status,
          );
        }
      }
    } catch (error) {
      console.log(error, 'Breathe session api error');
     enteredCurrentEvent && getEarnedCoins();
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
        //
        if (
          response.data?.responses[
            WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
          ] > 0
        ) {
          setExerciseStatus(true);
        }
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
  const getCardioStatus = async () => {
    try {
      const response = await axios(
        `${NewAppapi.GET_CARDIO_STATUS}`,{
          method:'post',
          // headers:{
          //   'Content-Type':'multipart/form-data'
          // },
          data:{
            user_id:getUserDataDetails?.id
          }
        }
        
      );
      if (response?.data?.status == true) {
        setCardioStatus(true);
        setLoaded(true);
      } else {
        setLoaded(true);
      }
    } catch (error) {
      console.log('error caridio status api ', error);
      showMessage({
        message: 'Something went wrong.',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
      setLoaded(true);
    }
  };
  // cardio download logic
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
      // console.log('Downloding');
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
    setWokroutLoaded(false);
    const url =
      'https://fitme.cvinfotech.in/adserver/public/api/test_user_event__exercise_status';
    for (const item of cardioExxercise) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: -13,
        user_day: WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1],
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
      if (
        res.data?.msg == 'Exercise Status for All Users Inserted Successfully'
      ) {
        setDownloade(0);
        setWokroutLoaded(true);
        navigation.navigate('CardioExercise', {
          allExercise: cardioExxercise,
          currentExercise: cardioExxercise[0],
          data: [],
          day: getPurchaseHistory?.currentDay - 1,
          exerciseNumber: 0,
          trackerData: res?.data?.inserted_data,
          type: 'cardio',
          offerType: true,
        });
        // }
      } else {
        setWokroutLoaded(true);
        navigation.navigate('CardioExercise', {
          allExercise: cardioExxercise,
          currentExercise: cardioExxercise[0],
          data: [],
          day: getPurchaseHistory?.currentDay - 1,
          exerciseNumber: 0,
          trackerData: res?.data?.existing_data,
          type: 'cardio',
          offerType: true,
        });
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
      setDownloade(0);
      setWokroutLoaded(true);
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
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      {loaded ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: -DeviceHeigth * 0.1}}>
          {workoutLoaded ? null : <ActivityLoader />}
          <OfferHeader />
          <EventBanner navigation={navigation} />
          <OfferCards
            imgSource={localImage.cardio_banner}
            header={'Cardio Point'}
            text1={'Cardio point'}
            text1Color={AppColor.WHITE}
            text2={'Do a few minutes of cardio and earn extra FitCoins'}
            text3={`${cardioExxercise[0]?.fit_coins} coins`}
            coinTextColor={AppColor.YELLOW}
            isactive={!cardioStatus && exerciseStatus && enteredCurrentEvent}
            onPress={() => handleStart()}
            withAnimation
            downloaded={downloaded}
          />
          <OfferCards
            imgSource={localImage.reffer_banner}
            header={'Refer and earn'}
            text1={'Refer and earn'}
            text1Color={AppColor.BLACK}
            text2={'Invite your friends & earn bonus FitCoins.'}
            text3={'7 coins'}
            coinTextColor={AppColor.BLACK}
            onPress={() => navigation.navigate('Referral')}
            isactive={enteredCurrentEvent}
            buttonText={'Refer now'}
          />
          <OfferCards
            imgSource={localImage.breathe_banner}
            header={'Breathe in and out'}
            text1={'Breathe in and out'}
            text1Color={AppColor.WHITE}
            text2={'Join the Breathing session & earn bonus FitCoins'}
            text3={`${breatheCoins} coins`}
            coinTextColor={AppColor.WHITE}
            bannerType={'breathe'}
            isactive={
              breatheStatus && enteredCurrentEvent && !breatheCompleteStatus
            }
            onPress={() => navigation.navigate('Breathe', {type: 'OfferPage'})}
          />
        </ScrollView>
      ) : (
        <ActivityLoader />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.GRAY,
  },
});
export default OfferPage;
