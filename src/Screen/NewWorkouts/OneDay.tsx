import {
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor} from '../../Component/Color';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../../Component/GradientButton';
import {useFocusEffect} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';
import {setCount} from '../../Component/ThemeRedux/Actions';
import {localImage} from '../../Component/Image';
import WorkoutDescription from '../NewWorkouts/WorkoutsDescription';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';

const OneDay = ({navigation, route}: any) => {
  const {data, dayData, day, trainingCount} = route.params;
  const [exerciseData, setExerciseData] = useState([]);
  const [currentExercise, setCurrentExercise] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [open, setOpen] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const {allWorkoutData, getUserDataDetails} = useSelector(
    (state: any) => state,
  );
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      allWorkoutApi();
      getExerciseTrackAPI();
    }, []),
  );
  const allWorkoutApi = async () => {
    setLoader(true);
    try {
      const res = await axios({
        url:
          NewAppapi.Get_DAYS +
          '?day=' +
          day +
          '&workout_id=' +
          data?.workout_id,
      });
      if (res.data) {
        // console.log(res.data, 'DaysData', data);
        setExerciseData(res.data);
        setOpen(true);
        setLoader(false);
        // dispatch(setCount(res.data?.length));
      }
    } catch (error) {
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
      setOpen(true);
      setLoader(false);
    }
  };

  const getExerciseTrackAPI = async () => {
    const payload = new FormData();
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('workout_id', data?.workout_id);
    payload.append('user_day', day);
    payload.append('version', VersionNumber.appVersion);

    try {
      const res = await axios({
        url: NewAppapi.TRACK_CURRENT_DAY_EXERCISE,
        method: 'Post',
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
      } else if (res.data?.user_details) {
        setTrackerData(res.data?.user_details);
      } else {
        setTrackerData([]);
      }
      setOpen(true);
    } catch (error) {
      setOpen(true);
      console.error(error, 'PostDaysAPIERror');
      setTrackerData([]);
    }
  };

  const postCurrentDayAPI = async () => {
    // const payload = new FormData();
    // payload.append('user_exercise_id', current?.exercise_id);
    // payload.append('user_id', getUserDataDetails?.id);
    // payload.append('workout_id', data?.workout_id);
    // payload.append('user_day', day);
    let datas = [];
    let trainingCount = -1;
    trainingCount = trackerData.findIndex(
      item => item?.exercise_status == 'undone',
    );
    console.log(trainingCount);
    for (const exercise of exerciseData) {
      datas.push({
        user_id: getUserDataDetails?.id,
        workout_id: data?.workout_id,
        user_day: day,
        user_exercise_id: exercise?.exercise_id,
      });
    }
    try {
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE,
        method: 'Post',
        data: {user_details: datas},
      });
      if (res.data) {
        console.log(res.data, 'Post', trackerData);
        // getExerciseTrackAPI();
        setOpen(false);
        navigation.navigate('Exercise', {
          allExercise: exerciseData,
          currentExercise:
            trainingCount != -1 ? exerciseData[trainingCount] : exerciseData[0],
          data: data,
          day: day,
          exerciseNumber: trainingCount != -1 ? trainingCount : 0,
          trackerData: trackerData,
        });
      }
    } catch (error) {
      console.error(error, 'PostDaysAPIERror');
    }
  };

  const Box = ({selected, item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setOpen(false);
          setCurrentExercise(item);
          setVisible(true);
        }}
        style={[
          styles.box,
          {
            backgroundColor: AppColor.WHITE,
            height: DeviceHeigth * 0.1,
            marginVertical:Platform.OS=="android"?DeviceHeigth*0.005:DeviceHeigth>667?0:DeviceHeigth*0.019,
          },
        ]}>
          {console.log("SJSNSKN",DeviceHeigth)}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 80,
              width: 80,
              backgroundColor: AppColor.WHITE,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: DeviceWidth * 0.07,
              borderRadius: 10,
              ...Platform.select({
                ios: {
                  shadowColor: AppColor.BLACK,
                  shadowOffset: {width: 1, height: 1},
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 5,
                },
              }),
            }}>
            <Image
              source={{uri: item?.exercise_image}}
              style={{height: 75, width: 75,alignSelf:'center'}}
              resizeMode="contain"
            />
          </View>
          {trackerData[index - 1]?.exercise_status == 'completed' && (
            <Image
              source={localImage.Complete}
              style={{
                height: 40,
                width: 40,
                marginLeft: -DeviceWidth * 0.1,
                marginTop: -DeviceWidth * 0.09,
              }}
              resizeMode="contain"
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10,
              width: '65%',
            }}>
            <View>
              <Text style={[styles.small, {fontSize: 14}]}>
                {item?.exercise_title}
              </Text>
              <Text style={styles.small}>{item?.exercise_rest}</Text>
            </View>
            <Icons
              name={'chevron-right'}
              size={25}
              color={AppColor.INPUTTEXTCOLOR}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
        padding: 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          setOpen(false);
          navigation.goBack();
        }}
        style={{
          marginTop: DeviceHeigth * 0.03,
        }}>
        <Icons
          name={'chevron-left'}
          size={30}
          color={AppColor.INPUTTEXTCOLOR}
        />
      </TouchableOpacity>
      <Image
        source={{uri: data?.workout_image_link}}
        style={{
          height: DeviceWidth * 0.5,
          width: DeviceWidth,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      {/* <View style={{height: DeviceHeigth * 0.4, marginLeft: 5}}>
         
        </View> */}
      <View style={styles.container}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 30,
            lineHeight: 40,
            fontFamily: 'Poppins-SemiBold',
            color: AppColor.BLACK,
          }}>
          Day {day}
        </Text>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 14,
            lineHeight: 30,
            fontFamily: 'Poppins',
            color: AppColor.BoldText,
            marginVertical: 5,
          }}>
          <Icons
            name={'clock-outline'}
            size={15}
            color={AppColor.INPUTTEXTCOLOR}
          />
          {dayData?.total_rest > 60
            ? ` ${(dayData?.total_rest / 60).toFixed(0)} min `
            : ` ${dayData?.total_rest} sec `}
          <Icons name={'fire'} size={15} color={AppColor.INPUTTEXTCOLOR} />
          {` ${dayData?.total_calories} Kcal`}
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 50}}>
          {exerciseData.map((item, index) => (
            <Box selected={-1} index={index + 1} item={item} key={index} />
          ))}
        </ScrollView>
        <GradientButton
          // disabled={trackerData.length != 0}
          text={`Start Day ${day}`}
          h={80}
          alignSelf
          bR={40}
          mB={40}
          onPress={() => {
            postCurrentDayAPI();
            // setOpen(false);
            // navigation.navigate('Exercise', {
            //   allExercise: exerciseData,
            //   currentExercise: exerciseData[0],
            //   data: data,
            //   day: day,
            //   exerciseNumber: trainingCount != -1 ? trainingCount - 1 : 0,
            // });
          }}
        />
      </View>
      {loader && <ActivityLoader visible={loader} />}
      <WorkoutDescription
        data={currentExercise}
        open={visible}
        setOpen={setVisible}
      />
    </View>
  );
};

export default OneDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    // alignItems: 'center',
    height: DeviceHeigth * 0.6,
    width: DeviceWidth,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: 0,
    position: 'absolute',
    padding: 20,
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
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  box: {
    // flex: 1,
    width: DeviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 0,
    paddingRight: 20,
    borderRadius: 15,
    marginLeft: -10,
    // marginVertical: 5,
  },
});
