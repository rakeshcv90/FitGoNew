import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ExerciseCount} from '../../Icon/ExerciseCount';
import {ExerciseKcal} from '../../Icon/ExerciseKcal';
import {ExerciseTime} from '../../Icon/ExerciseTime';
import FitText from '../../Component/Utilities/FitText';
import {AppColor} from '../../Component/Color';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {API_CALLS} from '../../API/API_CALLS';
import moment from 'moment';
import {historyData} from '../../API/responseTypes';

const arr = [
  {
    id: 1,
    val: 'Exercises',
    img: <ExerciseCount size={20} stroke="#007AFF" />,
    color: '#cce4ff',
    bgColor: '#007AFF1F',
  },
  {
    id: 2,
    val: 'kcal',
    img: <ExerciseKcal size={20} stroke="#FF9500" />,
    color: '#FFC1071A',
    bgColor: '#FF95001F',
  },
  {
    id: 3,
    val: 'minutes',
    img: <ExerciseTime size={20} stroke="#34C759" />,
    color: '#EAF7ED',
    bgColor: '#34C7591F',
  },
];
const eventStatic = {
  total_calories: 0,
  total_exercise_count: 0,
  total_time: 0,
};
const normalStatic = {
  normal_exercises: {
    exercise_data: [],
    summary: {
      formatted_time: '',
      total_calories: 0,
      total_exercises: 0,
      total_time_seconds: 0,
    },
  },
  step_count: {
    steps: 0,
    calories: 0,
    distance: 0,
  },
};
const TripView = ({data, val}: {data: (typeof arr)[0]; val: number}) => (
  <View
    style={[
      {
        alignItems: 'center',
        backgroundColor: data.bgColor,
        width: '30%',
        borderRadius: 10,
        paddingBottom: 10,
      },
    ]}>
    <View
      style={[
        styles.imgContainer,
        {
          backgroundColor: data.color,
        },
      ]}>
      {data.img}
    </View>
    <FitText
      type="SubHeading"
      value={val + ''}
      color={AppColor.PrimaryTextColor}
    />
    <FitText
      type="normal"
      value={data.val}
      color={AppColor.SecondaryTextColor}
    />
  </View>
);
const DailyProgress = ({currentEvent}: any) => {
  const [eventData, setEventData] = useState(eventStatic);
  const [normalData, setNormalData] = useState<historyData>(normalStatic);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  useEffect(() => {
    currentEvent
      ? API_CALLS.getHomeHistory(getUserDataDetails?.id, setEventData)
      : API_CALLS.getHistoryDetails(
          getUserDataDetails?.id,
          moment().format('dddd'),
          setNormalData,
        );
  }, [currentEvent]);

  const setApiData = (index: number) => {
    const steps = currentEvent
      ? eventData.total_exercise_count
      : normalData.normal_exercises.summary.total_exercises +
        normalData.step_count.steps;
    const calories = currentEvent
      ? eventData.total_calories
      : normalData.normal_exercises.summary.total_calories +
        normalData.step_count.calories;
    const time = currentEvent
      ? eventData.total_time
      : normalData.normal_exercises.summary.total_time_seconds +
        normalData.step_count.distance;

    return index == 1 ? steps : index == 2 ? calories : time;
  };

  return (
    <View
      style={[
        PredefinedStyles.rowBetween,
        {width: '90%', alignSelf: 'center', marginVertical: 10},
      ]}>
      {arr.map(item => (
        <TripView key={item.id} data={item} val={setApiData(item.id)} />
      ))}
    </View>
  );
};

export default DailyProgress;

const styles = StyleSheet.create({
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
});
