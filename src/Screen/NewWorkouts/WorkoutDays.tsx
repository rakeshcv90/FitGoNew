import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppColor} from '../../Component/Color';
import Header from '../../Component/Headers/NewHeader';
import GradientText from '../../Component/GradientText';
import moment from 'moment';
import {Canvas, Circle, Group, Line, vec} from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import ProgressButton from '../../Component/ProgressButton';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import ActivityLoader from '../../Component/ActivityLoader';

const WorkoutDays = ({navigation, route}: any) => {
  const {data} = route.params;
  const [selected, setSelected] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(true);
  const [day, setDay] = useState(1);
  const [trainingCount, setTrainingCount] = useState(-1);
  const [totalCount, setTotalCount] = useState(-1);
  const [trackerData, setTrackerData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  // console.log(data?.days);
  const {allWorkoutData, getUserDataDetails, getCount} = useSelector(
    (state: any) => state,
  );
  let totalTime = 0,
    restDays = [];
    for (const day in data?.days) {
      if (data?.days[day]?.total_rest == 0) {
        restDays.push(parseInt(day.split('day_')[1]));
      }
      totalTime = totalTime + parseInt(data?.days[day]?.total_rest);
    }
  useFocusEffect(
    useCallback(() => {
      getCurrentDayAPI();
      // allWorkoutApi();
    }, []),
  );
  const getCurrentDayAPI = async () => {
    try {
      setRefresh(true);
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      payload.append('workout_id', data?.workout_id);
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE_DETAILS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data, 'API DATA');
      if (res.data?.msg != 'No data found') {
        // if(res.data?.user_details)
        const result = analyzeExerciseData(res.data?.user_details);
        console.log('GET API TRACKE', result);
        if (result.two.length == 0) {
          let day = parseInt(result.one[result.one.length - 1]);
          for (const item of Object.entries(data?.days)) {
            const index = parseInt(item[0].split('day_')[1]);
            console.log(item[0], 'items', index, day + 1);
            if (item[1]?.total_rest == 0 && index == day + 1) {
              setSelected(index);
              setDay(index + 1);
              break;
            } else {
              setSelected(day + 1);
              setDay(day + 1);
              // break;
            }
          }
          const temp2 = res.data?.user_details?.filter(
            (item: any) => item?.user_day == result.one[0],
          );
          console.log(temp2);
          setOpen(true);
          // setSelected(parseInt(result.one[result.one.length - 1]));
        } else {
          const temp = res.data?.user_details?.filter(
            (item: any) =>
              item?.user_day == result.two[0] &&
              item?.exercise_status == 'undone',
          );
          const temp2 = res.data?.user_details?.filter(
            (item: any) => item?.user_day == result.two[0],
          );
          console.log('GET TRACKERw', temp, result.one, result.two, temp2);
          setTrackerData(temp2);
          setTotalCount(temp2?.length);
          setTrainingCount(temp2?.length - temp?.length);
          setSelected(result.two[0] - 1);
          setDay(result.two[0]);
          setOpen(true);
        }
      } else {
        setSelected(0);
        // console.log('first', res.data);
      }
      console.log(selected, 'SELEC', day);
      allWorkoutApi();
    } catch (error) {
      console.error(error, 'DAPIERror');
      setRefresh(false);
    }
  };
  function analyzeExerciseData(exerciseData: []) {
    const daysCompletedAll = new Set();
    const daysPartialCompletion = new Set();

    exerciseData.forEach((entry: any) => {
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

  const allWorkoutApi = async () => {
    try {
      const res = await axios({
        url:
          NewAppapi.Get_DAYS +
          '?day=' +
          day +
          '&workout_id=' +
          data?.workout_id,
      });
      console.log(res.data?.length, 'DaysData', day);
      if (res.data?.msg != 'no data found.') {
        setExerciseData(res.data);
      } else setExerciseData([]);
      setRefresh(false);
    } catch (error) {
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
      setRefresh(false);
    }
  };
  const dispatch = useDispatch();
  const BlackCircle = ({indexes, select, index}: any) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          marginRight: 10,
          marginLeft: 0,
          width: 40,
          overflow: 'hidden',
          height:
            select && trainingCount != -1
              ? DeviceHeigth * 0.2
              : DeviceHeigth * 0.1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: index == 0 || index == 4 ? DeviceHeigth * 0.05 : 0,
        }}>
        {index < selected ? (
          <Image
            source={localImage.BlackCircle}
            style={{height: 30, width: 30}}
          />
        ) : (
          <Image
            source={localImage.GreyCircle}
            style={{height: 30, width: 30}}
          />
        )}
      </View>
    );
  };

  const Phase = ({index, percent, select}: any) => {
    const gradientColors = ['#D5191A', '#941000'];
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: DeviceWidth * 0.8,
          alignSelf: 'flex-end',
        }}>
        <GradientText
          text={index == 1 ? `Phase 1: Start Easily` : `Phase 2: Warm Ups`}
          fontSize={14}
          marginTop={0}
          y={20}
          width={
            index == 1
              ? `Phase 1: Start Easily`.length * 8
              : `Phase 1: Warm Ups`.length * 10
          }
          colors={select ? gradientColors : ['#505050', '#505050']}
        />
        {select && open && (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 5,
                width: DeviceWidth * 0.2,
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#d9d9d9',
              }}>
              <LinearGradient
                colors={gradientColors}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={{
                  height: 5,
                  width: index == 1 && day > 4 ? '100%' : `${percent}%`,
                }}
              />
            </View>
            <GradientText
              text={index == 1 && day > 4 ? '100%' : `${percent}%`}
              fontSize={14}
              marginTop={0}
              y={20}
              width={50}
            />
          </View>
        )}
      </View>
    );
  };

  const Box = ({selected, item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          index - 1 == 0
            ? navigation.navigate('OneDay', {
                data: data,
                dayData: item,
                day: index,
                trainingCount: trainingCount,
              })
            : selected
            ? navigation.navigate('OneDay', {
                data: data,
                dayData: item,
                day: index,
                trainingCount: trainingCount,
              })
            : showMessage({
                message: `Please complete Day ${index - 1} Exercise First !!!`,
                type: 'danger',
              });
        }}
        style={[
          styles.box,
          {
            backgroundColor:
              index == 1 || index == 5
                ? '#F3F4F7'
                : index == 2 || index == 6
                ? '#EAEBFF'
                : index == 3 || index == 7
                ? '#FFE8E1'
                : '#CEF2F9',
            height:
              selected && trainingCount != -1
                ? DeviceHeigth * 0.2
                : DeviceHeigth * 0.1,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: data?.workout_image_link}}
            style={{height: 80, width: 60, marginLeft: DeviceWidth * 0.12}}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10,
              width: '80%',
            }}>
            <View>
              <Text
                style={[
                  styles.category,
                  {fontSize: 20},
                ]}>{`Day ${index}`}</Text>
              <Text style={styles.small}>
                {item?.total_rest > 60
                  ? `${(item?.total_rest / 60).toFixed(0)} min`
                  : `${item?.total_rest} sec`}{' '}
                | {item?.total_calories} Kcal
                {/* {moment(139).format('S')} min | {item?.total_calories} Kcal */}
              </Text>
            </View>
            <Icons
              name={'chevron-right'}
              size={25}
              color={AppColor.INPUTTEXTCOLOR}
            />
          </View>
        </View>
        {selected && trainingCount != -1 && (
          <ProgressButton
            text="Start Training"
            w={DeviceWidth * 0.75}
            bR={10}
            fill={
              totalCount == -1
                ? '0%'
                : `${100 - (trainingCount / totalCount) * 100}%`
            }
            h={DeviceHeigth * 0.08}
            onPress={() => {
              console.log(exerciseData, 'trackerData', trackerData);
              navigation.navigate('Exercise', {
                allExercise: exerciseData,
                currentExercise:
                  trainingCount == -1
                    ? exerciseData[0]
                    : exerciseData[trainingCount],
                data: data,
                day: day,
                exerciseNumber: trainingCount == -1 ? 0 : trainingCount,
                trackerData: trackerData,
              });
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const Time = () => {
    return (
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#941000', '#D5191A']}
        style={[
          {
            width: DeviceWidth,
            height: 100,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginLeft: -15,
            // justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
          },
        ]}>
        <Text
          style={{
            color: AppColor.WHITE,
            fontSize: 18,
            lineHeight: 30,
            fontFamily: 'Poppins',
            fontWeight: '500',
          }}>
          Time
        </Text>
        <Text
          style={{
            color: AppColor.WHITE,
            fontSize: 28,
            lineHeight: 30,
            fontFamily: 'Poppins',
            fontWeight: '600',
          }}>
          {totalTime > 60
            ? `${(totalTime / 60).toFixed(0)} min`
            : `${totalTime} sec`}
        </Text>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        header={
          data?.workout_title == undefined ? 'Full Body' : data?.workout_title
        }
        backButton
        SearchButton={false}
      />
      <GradientText
        text={'Today'}
        fontWeight={'500'}
        fontSize={22}
        width={150}
        x={1}
        marginTop={-10}
      />
      <Text style={[styles.category, {marginTop: 10}]}>
        {moment().format('dddd DD MMMM')}
      </Text>
      {!refresh && (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              // flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{alignSelf: 'flex-start'}}>
              {Object.values(data?.days).map((item: any, index: number) => {
                if (item?.total_rest == 0) {
                  return (
                    <View>
                      <Text>Rest</Text>
                    </View>
                  );
                }
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    {index < 8 ? (
                      <BlackCircle index={index} select={index == selected} />
                    ) : (
                      <View style={{width: 40}} />
                    )}
                    <View>
                      {(index == 0 || index == 4) && (
                        <Phase
                          index={index + 1}
                          percent={
                            index < selected && index == 0 && selected > 4
                              ? '100%'
                              : selected < 4 && index == 0
                              ? (selected / 4) * 100
                              : (selected / 2 / 4) * 100
                          }
                          select={index <= selected}
                        />
                      )}
                      <Box
                        selected={selected != 0 && index == selected}
                        index={index + 1}
                        item={item}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <Time />
        </>
      )}
      <ActivityLoader visible={refresh} />
    </View>
  );
};

export default WorkoutDays;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
    paddingHorizontal: 15,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: '600',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 30,
  },
  small: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    //   flex: 1,
    width: DeviceWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        // shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        // shadowRadius: 10,
      },
    }),
  },
});
