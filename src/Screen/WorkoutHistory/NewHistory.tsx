import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1, {defaultVal} from '../../Component/Headers/NewHeader1';
import {AppColor} from '../../Component/Color';
import moment from 'moment';
import {DeviceWidth} from '../../Component/Config';
import CustomCalendar from './CustomCalendar';
import StepCountView from './StepCountView';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import FitText from '../../Component/Utilities/FitText';
import {ExerciseCount} from '../../Icon/ExerciseCount';
import {ExerciseTime} from '../../Icon/ExerciseTime';
import {ExerciseKcal} from '../../Icon/ExerciseKcal';
import {API_CALLS} from '../../API/API_CALLS';
import {useSelector} from 'react-redux';
import {historyData} from '../../API/responseTypes';
import {ExerciseData} from '../NewWorkouts/Exercise/ExerciseUtilities/useExerciseHook';

const staticData = {
  normal_exercises: {
    exercise_data: [{exercise_id: 0}],
    summary: {},
  },
  step_count: {
    calories: 0,
    distance: 0,
    steps: 0,
  },
};

const NewHistory = () => {
  const [historyData, setHistoryData] = useState<historyData>(staticData);
  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const [exerciseData, setExerciseData] = useState<Array<ExerciseData>>(getAllExercise);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  useEffect(() => {
    API_CALLS.getHistoryDetails(getUserDataDetails?.id, date, setHistoryData);
    getExercises();
  }, [date]);

  const getExercises = useCallback(() => {
    
    // const newData = getAllExercise?.filter(
    //   (item: ExerciseData) => item.exercise_id == exerciseID,
    // );
    // console.log(exerciseID)
    // setExerciseData(newData);
  }, [historyData]);

  //   console.log(historyData?.normal_exercises)
  return (
    <Wrapper styles={{}}>
      <NewHeader1 header={'Custom Made'} backButton {...defaultVal} />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: '#f7f7f7',
          paddingHorizontal: 20,
        }}>
        <CustomCalendar {...{date, setDate}} />
        <StepCountView data={12} />
        {exerciseData && exerciseData.length > 0 && (
          <View style={styles.container}>
            <View style={[PredefinedStyles.rowBetween, {padding: 10}]}>
              <FitText
                type="SubHeading"
                fontWeight="700"
                value="Daily Workout Tasks"
                marginHorizontal={5}
              />

              <View style={PredefinedStyles.rowBetween}>
                <ExerciseTime />
                <FitText
                  type="normal"
                  value={13 + 's'}
                  fontSize={16}
                  marginHorizontal={5}
                  marginTop={5}
                  color={AppColor.SecondaryTextColor}
                />
              </View>
            </View>
            <View
              style={[
                PredefinedStyles.rowBetween,
                {width: '50%', paddingHorizontal: 20},
              ]}>
              <View style={PredefinedStyles.rowBetween}>
                <ExerciseCount />
                <FitText
                  type="normal"
                  value="exercise"
                  marginHorizontal={5}
                  color={AppColor.SecondaryTextColor}
                />
              </View>
              <View style={PredefinedStyles.rowBetween}>
                <ExerciseKcal />
                <FitText
                  type="normal"
                  value="kcal"
                  marginHorizontal={5}
                  color={AppColor.SecondaryTextColor}
                />
              </View>
            </View>
            {exerciseData?.map((item, index) => {
              console.log(item);
              return (
                <View style={[PredefinedStyles.rowBetween]}>
                  <Image
                    source={{uri: item.exercise_image_link}}
                    style={{width: 50, height: 50}}
                    resizeMode="contain"
                  />
                  <FitText
                    type="SubHeading"
                    fontWeight="700"
                    value={item.exercise_title}
                    marginHorizontal={5}
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Wrapper>
  );
};

export default NewHistory;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: AppColor.WHITE,
    padding: 10,
    marginTop: 10,
  },
});
