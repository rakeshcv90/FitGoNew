import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {WeekTabWithEvents} from '../MyPlans/Tabs';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {DeviceWidth, NewAppapi} from '../../Component/Config';
import {showMessage} from 'react-native-flash-message';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import FitText from '../../Component/Utilities/FitText';

const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );

const EventExerciseHistory = () => {
  const [coins, setCoins] = useState({});
  const [selectedDay, setSelectedDay] = useState((moment().day() + 6) % 7);
  const fitCoins = useSelector((state: any) => state.fitCoins);
  const [refresh, setRefresh] = useState(false);

  const getWeeklyPlansData = useSelector(
    (state: any) => state.getWeeklyPlansData,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;

  useEffect(() => {
    getEarnedCoins();
  }, []);

  const getEarnedCoins = () => {
    RequestAPI.makeRequest(
      'GET',
      NewAppapi.GET_COINS,
      {
        user_id: getUserDataDetails?.id,
        day: WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1],
      },
      async (response: any) => {
        setRefresh(false);
        if (response?.error) {
          showMessage({
            message: 'Something went wrong.',
            type: 'danger',
            animationDuration: 500,
            floating: true,
          });
        } else if (
          response?.data?.msg == 'Please update the app to the latest version.'
        ) {
          showMessage({
            message: response?.data?.msg,
            type: 'danger',
            animationDuration: 500,
            floating: true,
          });
        } else {
          setCoins(response?.data?.responses);
        }
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader header="Workout History" shadow />
      <View
        style={{
          flexDirection: 'row',
          width: DeviceWidth * 0.9,
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          marginBottom: DeviceWidth * 0.05,
        }}>
        {WeekArrayWithEvent.map((item: any, index: number) => (
          <WeekTabWithEvents
            day={item}
            dayIndex={index}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            WeekArray={WeekArrayWithEvent}
            dayObject={getWeeklyPlansData}
            dayWiseCoins={coins}
          />
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginHorizontal: 16,
          flex: 1,
          backgroundColor: AppColor.LIGHTGREY2,
        }}>
        <FitText type="SubHeading" value="Overview" marginVertical={10} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventExerciseHistory;

const styles = StyleSheet.create({});
