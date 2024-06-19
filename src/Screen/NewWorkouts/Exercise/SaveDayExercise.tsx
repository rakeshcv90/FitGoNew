import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../../Component/Color';
import {localImage} from '../../../Component/Image';
import GradientText from '../../../Component/GradientText';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import GradientButton from '../../../Component/GradientButton';
import analytics from '@react-native-firebase/analytics';
import {ReviewApp} from '../../../Component/ReviewApp';
import axios from 'axios';
import {
  setAllExercise,
  setChallengesData,
} from '../../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber, {appVersion} from 'react-native-version-number';
import moment from 'moment';
import {BannerAdd} from '../../../Component/BannerAdd';
import {bannerAdId} from '../../../Component/AdsId';
import {AnalyticsConsole} from '../../../Component/AnalyticsConsole';
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
  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const enteredCurrentEvent = useSelector(
    (state: any) => state.enteredCurrentEvent,
  );
  let fire = 0,
    clock = 0,
    action;
  const [workoutName, setWorkooutName] = useState('');
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
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
      fire = fire + parseInt(item?.exercise_calories);
      clock = clock + parseInt(item?.exercise_rest?.split(' ')[0]);
    });
    if (type == 'weekly') getWeeklyAPI();
  }
  const TESTAPI = async () => {
    try {
      const data = await axios(`${NewAppapi.POST_API_FOR_COIN_CALCULATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails?.id,
          user_day: WeekArray[day],
        },
      });

      if (data?.data?.msg == 'coin added successfully') {
        navigation.navigate('MyPlans');
        console.log('TEST API DATA', data.data);
      }
    } catch (error) {
      navigation.navigate('MyPlans');
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
  const getAllChallangeAndAllExerciseData = async () => {
    let responseData = 0;
    if (Object.keys(getUserDataDetails).length > 0) {
      try {
        responseData = await axios.get(
          `${NewAppapi.ALL_USER_WITH_CONDITION}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
        );
        dispatch(setChallengesData(responseData.data.challenge_data));
        dispatch(setAllExercise(responseData.data.data));
        navigation.navigate('WorkoutDays', {data, challenge});
      } catch (error) {
        console.log('GET-USER-Challange and AllExerciseData DATA', error);
        dispatch(setChallengesData([]));
        dispatch(setAllExercise([]));
        navigation.navigate('WorkoutDays', {data, challenge});
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
  let categoryExercise: Array<any> = [];

  const onPresh = () => {
    AnalyticsConsole(`SBA_Exer_Com`);
    if (enteredCurrentEvent) TESTAPI();
    else {
      if (type == 'focus') {
        categoryExercise = getAllExercise?.filter((item: any) =>
          data.category.split('/').includes(item?.exercise_bodypart),
        );
      }
      type == 'custom'
        ? navigation.navigate('CustomWorkoutDetails', {item: data})
        : challenge
        ? getAllChallangeAndAllExerciseData()//ChallengesDataAPI()
        : type == 'focus'
        ? navigation.navigate('WorkoutCategories', {
            categoryExercise,
            CategoryDetails: data,
          })
        : type == 'bodypart'
        ? navigation.navigate('NewFocusWorkouts', {
            focusExercises: allExercise,
            focusedPart: data?.title,
            searchCriteria: data?.searchCriteria,
            searchCriteriaRedux: data?.searchCriteriaRedux,
            CategoryDetails: data,
          })
        : navigation.navigate('MyPlans'); //add here
    }
  };
  // const bannerAdsDisplay = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return <BannerAdd bannerAdId={bannerAdId} />;
  //     }
  //   } else {
  //     return <BannerAdd bannerAdId={bannerAdId} />;
  //   }
  // };

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
        style={{flex: 0.6, marginTop: DeviceHeigth * 0.02}}
        resizeMode="contain"
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            color: AppColor.RED1,
            fontSize: 28,
            lineHeight: 40,
            fontWeight: '600',
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
          }}>
          Congratulations!
        </Text>
      </View>
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
        You have completed your{' '}
        {type != 'weekly'
          ? data?.workout_title == undefined
            ? data?.title == undefined
              ? data?.workout_name + ' Exercise'
              : data?.title
            : data?.workout_title + ' Exercise'
          : workoutName + ' Exercises'}
      </Text>

      <View
        style={{
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: DeviceHeigth * 0.02,
        }}>
        <View style={styles.container}>
          <Image
            source={localImage.Step1}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: AppColor.RED1,
              fontWeight: '500',
            }}>
            {fire}
          </Text>
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
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: AppColor.RED1,
              fontWeight: '500',
            }}>
            {clock}
          </Text>
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
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              lineHeight: 30,
              color: AppColor.RED1,
              fontWeight: '500',
            }}>
            {action}
          </Text>
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
      <View
        style={{marginBottom: DeviceHeigth * 0.002, top: DeviceHeigth * 0.1}}>
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
      </View>
      <View style={{position: 'absolute', bottom: 0}}>
        {/* {bannerAdsDisplay()} */}
        <BannerAdd bannerAdId={bannerAdId} />
      </View>
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
