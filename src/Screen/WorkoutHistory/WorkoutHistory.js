import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor, Fonts} from '../../Component/Color';
import {WeekTabHistory, WeekTabWithEvents} from '../MyPlans/Tabs';
import moment from 'moment';
import {
  Api,
  DeviceHeigth,
  DeviceWidth,
  NewAppapi,
} from '../../Component/Config';
import Overview from './Overview';
import PointDeduction from './PointDeduction';
import SingleWorkout from './SingleWorkout';
import ExtraWorkouts from './ExtraWorkouts';
import Rewards from './Rewards';
import axios from 'axios';
import {localImage} from '../../Component/Image';
import Tooltip from './Tooltip';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import LoadingScreen from '../../Component/NewHomeUtilities/LoadingScreen';
import {useSelector} from 'react-redux';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';

const WorkoutHistory = () => {
  const [coins, setCoins] = useState({});
  const [screenObject, setScreenObject] = useState({});
  const [tooltipVisible, settooltipVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loaded1, setLoaded1] = useState(false);
  const getPurchaseHistory = useSelector(state => state?.getPurchaseHistory);
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  const [selectedDay, setSelectedDay] = useState(() => {
    if (Sat || Sun) return 4;
    return (moment().day() + 6) % 7;
  });
  const WeekArrayWithEvent = Array(5)
    .fill(0)
    .map(
      (item, index) =>
        (item = moment()
          .add(index, 'days')
          .subtract(moment().isoWeekday() - 1, 'days')
          .format('dddd')),
    );
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const sameDay = moment().format('dddd') == WeekArrayWithEvent[selectedDay];
  const currentDay = (moment().day() + 6) % 7;
  useEffect(() => {
    History(WeekArrayWithEvent[selectedDay]);
  }, [selectedDay]);
  useEffect(() => {
    setLoaded1(true);
  }, []);
  const History = async day => {
    setLoaded(true);
    try {
      const res = await axios(
        `${NewAppapi.GET_HISTORY}?user_id=${getUserDataDetails?.id} & day=${day}`,
      );
      if (res?.data) {
        setLoaded1(false);
        setLoaded(false);
        setScreenObject({
          day: day,
          date: moment(res?.data?.event_overview?.date, 'MMM-DD-YY').format(
            'MMMM DD, yyyy',
          ),
          time: res?.data?.event_overview?.time,
          exerciseCount: res?.data?.event_overview?.exercises,
          missedExercise: res?.data?.event_overview?.missed,
          duration: Math.ceil(
            ((res?.data?.event_overview?.exercises -
              res?.data?.event_overview?.missed) *
              3 *
              30) /
              60,
          ),
          //deduction
          next: res?.data?.point_deduction?.next_status,
          repeat: res?.data?.point_deduction?.prev_status,
          skip: res?.data?.point_deduction?.skip_status,
          delay: res?.data?.point_deduction?.delay,
          //workout
          cardio: res?.data?.workout?.cardio,
          breathe: res?.data?.workout?.breath_in,
          //refferal
          reffered: res?.data?.refer_rewards?.register,
          joined: res?.data?.refer_rewards?.event_register,
          total_points: res?.data?.refer_rewards?.total_rewards_points,
        });
        setCoins(res.data.points);
      }
    } catch (error) {
      console.log('history Api error--> ', error.response);
      setLoaded1(false);
      setLoaded(false);
      showMessage({
        message: 'Something error occured',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  return (
    <>
      {loaded1 == true ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
            <NewHeader1
              header={'Workout History'}
              backButton
              icon
              iconSource={localImage.infoCircle}
              onIconPress={() => settooltipVisible(prev => !prev)}
            />
            <Tooltip visible={tooltipVisible} setVisible={settooltipVisible} />
            <View style={styles.view1}>
              {WeekArrayWithEvent.map((item, index) => (
                <WeekTabHistory
                  day={item}
                  dayIndex={index}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  WeekArray={WeekArrayWithEvent}
                  dayWiseCoins={coins}
                  currentDay={currentDay}
                />
              ))}
            </View>
            {loaded ? (
              <ActivityLoader />
            ) : sameDay && coins[WeekArrayWithEvent[selectedDay]] == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localImage.daymiss_icon}
                  style={{height: DeviceHeigth * 0.3, width: DeviceWidth * 0.7}}
                  resizeMode="contain"
                />
                <Text style={styles.txt2}>
                  {
                    'You have not earned any points today, start working out to earn points'
                  }
                </Text>
              </View>
            ) : coins[WeekArrayWithEvent[selectedDay]] < 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localImage.daymiss_icon}
                  style={{height: DeviceHeigth * 0.3, width: DeviceWidth * 0.7}}
                  resizeMode="contain"
                />
                <View style={styles.view2}>
                  <Image
                    source={localImage.caution}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: AppColor.BLACK,
                      fontFamily: Fonts.HELVETICA_REGULAR,
                    }}>{` ${WeekArrayWithEvent[selectedDay]} miss`}</Text>
                </View>
                <Text style={styles.txt2}>
                  {'You miss this day and you loss the'}
                </Text>
                <Text
                  style={{
                    color: AppColor.RED,
                    fontFamily: 'Helvetica-Bold',
                    fontSize: 18,
                  }}>
                  -5 Points
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Overview data={screenObject} />
                {screenObject.next != 0 ||
                screenObject?.repeat != 0 ||
                screenObject?.skip != 0 ||
                screenObject?.delay != 0 ? (
                  <View style={styles.container1}>
                    <Text style={styles.txt1}>Points Deduction</Text>
                    {screenObject.next == 0 ? null : (
                      <PointDeduction
                        border
                        text1={'Stay on current exercise?'}
                        text2={`${screenObject.next}/${screenObject?.exerciseCount} exercise skip`}
                        icon={localImage.pause_icon}
                        coins={screenObject.next}
                      />
                    )}
                    {screenObject?.repeat == 0 ? null : (
                      <PointDeduction
                        border
                        text1={'Repeated the exericse?'}
                        text2={'Yes'}
                        icon={localImage.repeat_icon}
                        coins={screenObject.repeat}
                      />
                    )}
                    {screenObject?.skip == 0 ? null : (
                      <PointDeduction
                        border
                        text1={'Skip to the next exercise rest timer?'}
                        text2={`${screenObject.skip}/${screenObject?.exerciseCount} rest time skipped`}
                        icon={localImage.skip_icon}
                        coins={screenObject.skip}
                      />
                    )}
                    {screenObject?.delay == 0 ? null : (
                      <PointDeduction
                        text1={`Delay ${screenObject?.delay}hour`}
                        text2={`You are ${screenObject?.delay} hours behind comapred to your previous workout.`}
                        icon={localImage.delay_icon}
                        coins={screenObject.delay}
                      />
                    )}
                  </View>
                ) : null}
                {screenObject?.breathe == 0 &&
                !screenObject?.cardio == 0 ? null : (
                  <View style={styles.container1}>
                    <Text style={styles.txt1}>Workout</Text>
                    <ExtraWorkouts
                      border
                      txt={'Cardio'}
                      icon={localImage.heart_icon}
                      coins={screenObject?.cardio}
                    />
                    <ExtraWorkouts
                      txt={'Breathe in and out'}
                      icon={localImage.breath_icon}
                      coins={screenObject?.breathe}
                    />
                  </View>
                )}
                <Rewards data={screenObject} />
              </ScrollView>
            )}
          </Wrapper>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.BACKGROUNG,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  container1: {
    // width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
    paddingVertical: 15,
    marginBottom: 15,
  },
  txt1: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: AppColor.BLACK,
    alignSelf: 'center',
    width: DeviceWidth * 0.9,
  },
  txt2: {
    width: DeviceWidth * 0.7,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 15,
    lineHeight: 22,
    color: AppColor.BLACK,
  },
  view1: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
    marginBottom: 15,
    paddingVertical: 15,
  },
  view2: {
    backgroundColor: AppColor.LIGHT_RED,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 18,
    marginBottom: 10,
  },
});
export default WorkoutHistory;
