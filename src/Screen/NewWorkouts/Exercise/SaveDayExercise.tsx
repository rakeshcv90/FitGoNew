import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../../Component/Color';
import {localImage} from '../../../Component/Image';
import GradientText from '../../../Component/GradientText';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import GradientButton from '../../../Component/GradientButton';
import analytics from '@react-native-firebase/analytics';
import {ReviewApp} from '../../../Component/ReviewApp';
import axios from 'axios';
import {setChallengesData} from '../../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber, {appVersion} from 'react-native-version-number';
import moment from 'moment';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const SaveDayExercise = ({navigation, route}: any) => {
  const {data, day, allExercise, type, challenge} = route?.params;
  let fire, clock, action;
  const [workoutName, setWorkooutName] = useState('');
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  const getWeeklyAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_PLANS_EXERCISE +
          '?version=' +
          VersionNumber.appVersion +
          '&day=' +
          WeekArray[day] +
          '&user_id=' +
          getUserDataDetails.id,
      });
      if (res.data?.msg != 'User not exist.') {
        setWorkooutName(res.data?.title);
      } else {
        setWorkooutName('');
      }
    } catch (error) {
      setWorkooutName('');
    }
  };
  if (type == 'day') {
    for (const d in data?.days) {
      if (d.split('day_')[1] == day) {
        action = data?.days[d]?.exercises.length;
        fire = data?.days[d]?.total_calories;
        clock = data?.days[d]?.total_rest;
      }
    }
  } else {
    allExercise?.map((item: any) => {
      action = allExercise?.length;
      fire = item?.exercise_calories;
      clock = item?.exercise_rest?.split(' ')[0];
    });
    if (type == 'weekly') getWeeklyAPI();
  }

  const TESTAPI = async () => {
    try {
      const data = await axios(`${NewAppapi.total_Calories}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: 111,
        },
      });
      if (data.data) {
        console.log('TEST API DATA', data.data);
      }
    } catch (error) {
      console.log('UCustomeCorkout details', error);
    }
  };

  const ChallengesDataAPI = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_CHALLENGES_DATA +
          '?version=' +
          VersionNumber.appVersion +
          '&user_id=' +
          getUserDataDetails?.id,
      });
      if (res.data?.msg != 'version  is required') {
        dispatch(setChallengesData(res.data));
      } else {
        dispatch(setChallengesData([]));
      }
      navigation.navigate('WorkoutDays', {data, challenge});
    } catch (error) {
      console.error(error, 'ChallengesDataAPI ERRR');
      navigation.navigate('WorkoutDays', {data, challenge});
    }
  };
  const onPresh = () => {
    type == 'custom'
      ? navigation.navigate('CustomWorkoutDetails', {item: data})
      : challenge
      ? ChallengesDataAPI()
      : navigation.navigate('DayRewards', {data, day});
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={localImage.Congrats}
        style={{flex: 0.6, marginTop: DeviceHeigth * 0.1}}
        resizeMode="contain"
      />
      <GradientText
        text="Congratulations!"
        fontSize={32}
        width={DeviceHeigth >= 1024 ? DeviceWidth * 0.4 : DeviceWidth * 0.7}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Poppins',
          lineHeight: 30,
          color: AppColor.BLACK,
          fontWeight: '600',
          width: DeviceWidth * 0.9,
          textAlign: 'center',
        }}>
        You completed your{' '}
        {type != 'weekly'
          ? data?.workout_title == undefined
            ? data?.title
            : data?.workout_title + ' Exercise'
          : workoutName + ' Exercises'}
      </Text>

      <View
        style={{
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: DeviceHeigth * 0.1,
        }}>
        <View style={styles.container}>
          <Image
            source={localImage.Step1}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <GradientText text={fire} width={50} fontSize={28} x={'15'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: '#505050',
              fontWeight: '500',
            }}>
            Kcal
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={localImage.Clock}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <GradientText text={clock} width={50} fontSize={28} x={'5'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: '#505050',
              fontWeight: '500',
            }}>
            Sec
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={localImage.Action}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <GradientText text={action} width={30} fontSize={28} x={'5'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: '#505050',
              fontWeight: '500',
            }}>
            Action
          </Text>
        </View>
      </View>
      <GradientButton
        onPress={() => {
          // analytics().logEvent(`CV_FITME_COMPLETED_DAY_${day}_EXERCISES`);
          ReviewApp(onPresh);
          // TESTAPI()
        }}
        text="Save and Continue"
        bR={10}
        h={70}
        flex={0.2}
        alignSelf
      />
    </SafeAreaView>
  );
};

export default SaveDayExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFC',
    borderRadius: 15,
    borderTopLeftRadius: 15,
    padding: 20,
    marginHorizontal: 5,
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
});
