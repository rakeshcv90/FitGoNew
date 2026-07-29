import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {ExerciseCount} from '../../Icon/ExerciseCount';
import {ExerciseKcal} from '../../Icon/ExerciseKcal';
import {ExerciseTime} from '../../Icon/ExerciseTime';
import {AppColor, Fonts} from '../../Component/Color';
import {useSelector} from 'react-redux';
import {API_CALLS} from '../../API/API_CALLS';
import moment from 'moment';
import {historyData} from '../../API/responseTypes';
import {translate} from '../Translation/TranslationService';

const arr = [
  {
    id: 1,
    val: translate('exercises'),
    img: <ExerciseCount size={22} stroke="#2563EB" />,
    bgColor: '#F0F6FF',
    borderColor: '#DBEAFE',
    accentColor: '#2563EB',
    badgeBg: '#DBEAFE',
  },
  {
    id: 2,
    val: translate('kcal'),
    img: <ExerciseKcal size={22} stroke="#EA580C" />,
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    accentColor: '#EA580C',
    badgeBg: '#FFEDD5',
  },
  {
    id: 3,
    val: translate('minutes'),
    img: <ExerciseTime size={22} stroke="#059669" />,
    bgColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    accentColor: '#059669',
    badgeBg: '#D1FAE5',
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
  <View style={[styles.card, {backgroundColor: data.bgColor, borderColor: data.borderColor}]}>
    <View style={[styles.imgBadge, {backgroundColor: '#FFFFFF', shadowColor: data.accentColor}]}>
      {data.img}
    </View>
    <Text style={styles.valueText}>{val ? val : 0}</Text>
    <Text style={styles.labelText}>{data.val}</Text>
    <View style={[styles.indicatorBar, {backgroundColor: data.accentColor}]} />
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
    <View style={styles.container}>
      {arr.map(item => (
        <TripView key={item.id} data={item} val={setApiData(item.id)} />
      ))}
    </View>
  );
};

export default DailyProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    alignSelf: 'center',
    marginVertical: 14,
  },
  card: {
    alignItems: 'center',
    width: '31%',
    borderRadius: 18,
    borderWidth: 1,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 6,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imgBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  valueText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  labelText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  indicatorBar: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginTop: 10,
    opacity: 0.8,
  },
});
