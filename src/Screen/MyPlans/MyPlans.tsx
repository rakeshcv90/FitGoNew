import {
  FlatList,
  Image,
  PanResponder,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import Play from '../NewWorkouts/Exercise/Play';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VersionNumber from 'react-native-version-number';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../Component/GradientButton';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Timer from '../../Component/Timer';

const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );

const WeekTab = ({day, dayIndex, selectedDay, setSelectedDay}: any) => {
  return (
    <TouchableOpacity
      onPress={() => setSelectedDay(dayIndex)}
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: day == moment().format('dddd') ? '#FFDEDE' : 'white',
        borderColor: day == moment().format('dddd') ? '#D5191A' : 'white',
        borderRadius: day == moment().format('dddd') ? 25 : 0,
        padding: 5,
        borderWidth: day == moment().format('dddd') ? 1.5 : 0,
        width: 45,
        height: 45,
        marginLeft: DeviceWidth * 0.025,
      }}>
      <Text
        style={[
          styles.labelStyle,
          {
            color: selectedDay == dayIndex ? AppColor.RED1 : AppColor.BoldText,
            fontWeight: '600',
            textTransform: 'capitalize'
          },
        ]}>
        {day.substring(0,2)}
      </Text>
      <View>
        {selectedDay == dayIndex ? (
          <>
            <View
              style={{
                width: DeviceWidth * 0.05,
                height: 1,
              }}
            />
            <LinearGradient
              colors={['#D5191A', '#941000']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                width: DeviceWidth * 0.03,
                height: 2,
                backgroundColor: 'red',
                alignSelf: 'center',
              }}
            />
          </>
        ) : (
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 5,
              backgroundColor: AppColor.BoldText,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const Box = ({item, index}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = React.createRef();

  return (
    <TouchableOpacity style={styles.box} activeOpacity={0.9} onPress={() => {}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <View
          style={{
            height: 60,
            width: 60,
            // backgroundColor: AppColor.WHITE,
            // borderRadius: 10,
          }}> */}
        {/* {isLoading && (
            <ShimmerPlaceholder
              style={{height: 75, width: 75, alignSelf: 'center'}}
              autoRun
              ref={avatarRef}
            />
          )} */}
        <Image
          source={{uri: item?.exercise_image_link}}
          onLoad={() => setIsLoading(false)}
          style={{
            height: 50,
            width: 50,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontSize: 14,
                fontWeight: '500',
                color: AppColor.LITELTEXTCOLOR,
                lineHeight: 20,
              }}>
              {item?.exercise_title}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 12,
                  fontWeight: '600',
                  color: AppColor.BoldText,
                  lineHeight: 30,
                }}>
                Set:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
                Reps:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
                Time:
                <Text style={styles.small}>
                  {' '}
                  {item?.exercise_rest}
                  {'   '}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const MyPlans = ({navigation}: any) => {
  const [exerciseData, setExerciseData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  useEffect(() => {
    WeekArray.map((item) => 
    allWorkoutApi(item))
  }, []);

  const allWorkoutApi = async (day: string) => {
    try {
      const res = await axios({
        url:
          NewAppapi.GET_PLANS_EXERCISE + '?version=' + VersionNumber.appVersion+'&day='+day,
      });
      if (res.data) {
        setExerciseData(res.data?.exercise_data);
      }
    } catch (error) {
      console.error(error, 'DaysAPIERror');
      setExerciseData([]);
    }
  };
  const WeekDay = ({day, dayIndex, exerciseData}: any) => {
    return (
      <View style={{backgroundColor: AppColor.WHITE, flex: 1}}>
        <FlatList
          data={exerciseData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => <Box item={item} index={index} />}
        />
      </View>
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // You can add more sophisticated gesture detection here
      },
      onPanResponderRelease: (event, gestureState) => {
        // Determine swipe direction
        const {dx} = gestureState;
        if (dx > 50) {
          // Swiped right
          setSelectedDay(prevDay => (prevDay > 0 ? prevDay - 1 : 0));
        } else if (dx < -50) {
          // Swiped left
          setSelectedDay(prevDay =>
            prevDay < WeekArray.length - 1 ? prevDay + 1 : WeekArray.length - 1,
          );
        }
      },
    }),
  ).current;

  const handleStart = () => {
    exerciseData.map;
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: AppColor.WHITE,
      }}>
      <NewHeader
        header={'Workout Plan'}
        SearchButton={false}
        backButton={false}
      />
      <View style={{flex: 1, marginTop: -DeviceWidth * 0.1}}>
        <View
          style={{
            flexDirection: 'row',
            width: DeviceWidth,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.semiBold,
              {marginLeft: 10, width: DeviceWidth * 0.7},
            ]}>
            Get Fit{' '}
            {
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={[
                    styles.semiBold,
                    {
                      color: AppColor.NewGray,
                      lineHeight: 25,
                      fontWeight: 'bold',
                    },
                  ]}>
                  .
                </Text>
              </View>
            }{' '}
            Week 1
          </Text>
          <GradientButton
            text="Start"
            onPress={handleStart}
            w={DeviceWidth * 0.2}
            Image={localImage.StartWorkoutButton}
            ImageStyle={{
              width: DeviceWidth * 0.03,
              height: DeviceWidth * 0.03,
              marginRight: DeviceWidth * 0.01,
            }}
            h={30}
            textStyle={{
              fontSize: 12,
              fontFamily: Fonts.MONTSERRAT_REGULAR,
              lineHeight: 20,
              color: AppColor.WHITE,
              fontWeight: '700',
              zIndex: 1,
            }}
          />
        </View>
        <View {...panResponder.panHandlers} style={{flex: 1}}>
          <View style={{flexDirection: 'row', width: DeviceWidth}}>
            {WeekArray.map((item: any, index: number) => (
              <WeekTab
                day={item}
                dayIndex={index}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />
            ))}
          </View>
          <WeekDay
            day={WeekArray[selectedDay]}
            dayIndex={selectedDay}
            exerciseData={exerciseData}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyPlans;

const styles = StyleSheet.create({
  semiBold: {
    color: AppColor.NewBlack,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '700',
  },
  labelStyle: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
  },
  category: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  small: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: AppColor.BoldText,
    lineHeight: 30,
  },
  box: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FDFDFD',
    width: DeviceWidth * 0.95,
    padding: 10,
    marginVertical: 7,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
