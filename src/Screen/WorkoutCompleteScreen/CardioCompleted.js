import {View, Text, StyleSheet, StatusBar, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import Wrapper from './Wrapper';
import {AppColor} from '../../Component/Color';
import WorkoutCard from './WorkoutCard';
import {Image} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import {useSelector} from 'react-redux';
import moment from 'moment';
import { NewAppapi } from '../../Component/Config';
import VersionNumber from 'react-native-version-number';

const CardioCompleted = ({navigation}) => {
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state?.getPurchaseHistory);
  const [rank,setMyRank]=useState(1)
  const [coins,setCoins]=useState(0)
  const WeekArrayWithEvent = Array(5)
    .fill(0)
    .map(
      (item, index) =>
        (item = moment()
          .add(index, 'days')
          .subtract(moment().isoWeekday() - 1, 'days')
          .format('dddd')),
    );
  useEffect(() => {
    getEventEarnedCoins();
  }, []);
  useEffect(() => {
    // Add an event listener to handle the hardware back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Remove the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  const handleBackPress = () => {
    return true;
  };
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
      console.log('WEEKLY CAL', res.data, payload);
      setCoins(res?.data?.coins);
    getLeaderboardDataAPI()
    } catch (error) {
      console.log('ERRRRRR', error);
      getLeaderboardDataAPI
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
        console.log(result.data?.data[myRank]?.rank)
        setMyRank(result.data?.data[myRank]?.rank);
      }
 
    } catch (error) {
      console.log(error);
 
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.GRAY} translucent={false}/>
      <Wrapper>
        <Text style={styles.headerText}>Cardio Completed</Text>
        <View
          style={{
            height: '60%',
            width: '95%',
            backgroundColor: AppColor.WHITE,
            borderRadius: 16,
            marginBottom: 7,
            justifyContent: 'center',
            alignSelf: 'center',
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
          cardHeader={'Cardio Completed'}
          EarnedCoins={coins}
          rank={rank}
          title={
            'Congratulations! You’ve completed your workout and earned more FitCoins. Keep working out regularly to win the fitness challenge.'
          }
          handleComplete={()=>navigation.navigate("OfferPage")}
        />
      </Wrapper>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.GRAY,
  },
  headerText: {
    color: AppColor.BLACK,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    paddingVertical: 8,
  },
});
export default CardioCompleted;
