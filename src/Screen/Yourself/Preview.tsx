import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Stop,
  Svg,
  Text as SvgText,
  LinearGradient as SvgGrad,
} from 'react-native-svg';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Graph from './Graph';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../Component/GradientText';

const Av_Cal_Per_KG = 4000; // normally 7500
const Av_Cal_Per_2_Workout = 500; // Assuming
const currentW = 70;
const targetW = 60;
const Preview = ({route, navigation}: any) => {
  const [finalDate, setFinalDate] = useState('');
  const [weightHistory, setWeightHistory] = useState<[]>([]);
  const [zeroData, setZeroData] = useState<[]>([]);
  const [currentWeight, setCurrentWeight] = useState(-1);
  const [TargetWeight, setTargetWeight] = useState(-1);
  const moment = require('moment');

  const currentDate = moment(); // Get current date
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const pastDates = Array.from({length: 7}, (_, index) => {
    const date = currentDate.clone().subtract(7 - index, 'days');
    return {
      month: date.format('MMM'),
      year: date.format('YYYY'),
      date: date.format('DD'),
      day: daysOfWeek[date.day()],
      isCurrent: false,
    };
  });
  const futureDates = Array.from({length: 7}, (_, index) => {
    const date = currentDate.clone().add(index + 1, 'days');
    return {
      month: date.format('MMM'),
      year: date.format('YYYY'),
      date: date.format('DD'),
      day: daysOfWeek[date.day()],
      isCurrent: false,
    };
  });

  const current = {
    month: currentDate.format('MMM'),
    year: currentDate.format('YYYY'),
    date: currentDate.format('DD'),
    day: daysOfWeek[currentDate.day()],
    isCurrent: true,
  };
  console.log('Dates======>', datesArray);
  const {currentExercise} = route.params;
  const {getLaterButtonData, currentWorkoutData} = useSelector(
    (state: any) => state,
  );
  useEffect(() => {
    const i = getLaterButtonData.findIndex(
      (item: any) => 'currentWeight' in item,
    );
    if (i !== -1) {
      const currentW =
        getLaterButtonData[i].type === 'kg'
          ? getLaterButtonData[i].currentWeight
          : getLaterButtonData[i].currentWeight * 2.2;
      const targetW =
        getLaterButtonData[i].type === 'kg'
          ? getLaterButtonData[i].targetWeight
          : getLaterButtonData[i].targetWeight * 2.2;
      setCurrentWeight(currentW);
      setTargetWeight(targetW);
    }
  }, [getLaterButtonData]);

  useEffect(() => {
    if (currentWeight !== null && TargetWeight !== null) {
      CalculateWeight();
    }
  }, [currentWeight, TargetWeight]);

  const CalculateWeight = () => {
    const TotalW = currentWeight - TargetWeight;
    // if (TotalW <= 0) {
    //   // Avoid unnecessary calculations when the weights are not valid
    //   return;
    // }
    const totalW_Cal = TotalW * Av_Cal_Per_KG;
    const Result_Number_Of_Days = totalW_Cal / Av_Cal_Per_2_Workout;
    let constantWeightArray = [];
    let weightHistoryArray = [];
    let currentDate = moment();

    for (let i = Result_Number_Of_Days; i > 0; i -= 15) {
      const decWeight =
        currentWeight -
        ((Result_Number_Of_Days - i) * Av_Cal_Per_2_Workout) / Av_Cal_Per_KG;
      const formattedDate = currentDate.format('YYYY-MM-DD');
      weightHistoryArray.push({
        weight: decWeight.toFixed(2),
        // i % 2 === 0
        //   ? decWeight.toFixed(2)
        //   : (currentWeight - TargetWeight >= 10 || i > 2
        //       ? decWeight - 10
        //       : decWeight
        //     ).toFixed(2),
        date: formattedDate,
      });
      constantWeightArray.push({weight: 0, date: formattedDate});

      currentDate = currentDate.add(15, 'days');
    }
    setZeroData(constantWeightArray);
    setWeightHistory(weightHistoryArray);

    weightHistoryArray[weightHistoryArray.length - 1]?.date &&
      setFinalDate(weightHistoryArray[weightHistoryArray.length - 1]?.date);
  };
  // Helper function to get all dates between start and end dates
  const getDatesBetween = () => {
    const dates: any = {};
    let currentDate = moment(moment().add(1, 'day').format('YYYY-MM-DD'));

    while (currentDate.isBefore(finalDate)) {
      dates[currentDate.format('YYYY-MM-DD')] = {
        // selected: true,
        color: 'background: rgba(148, 16, 0, 0.16)',
      };

      currentDate.add(1, 'days');
    }
    return dates;
  };
  const theme = useMemo(() => {
    return {
      backgroundColor: AppColor.WHITE,
      calendarBackground: AppColor.WHITE,
      selectedDayBackgroundColor: AppColor.RED,
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.WHITE,
      arrowColor: AppColor.RED,
    };
  }, []);

  const renderItem = ({item, index}: any) => {
    return (
      <View
        style={{
          backgroundColor: '#EFF2FA',
          height: DeviceWidth / 3,
          width: DeviceWidth / 4,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Image
          source={{uri: item?.exercise_image_link}}
          style={{height: DeviceWidth / 5, width: DeviceWidth / 5}}
          resizeMode="contain"
        />
        <GradientText
          text={`X ${item?.exercise_reps}`}
          fontWeight="600"
          fontSize={20}
          width={DeviceWidth / 4}
          x={DeviceWidth * 0.07}
        />
      </View>
    );
  };
  const FinalDate = moment(finalDate); // Get current date
  const pastFinalDates = Array.from({length: 7}, (_, index) => {
    const date = FinalDate.clone().subtract(7 - index, 'days');
    return {
      month: date.format('MMM'),
      year: date.format('YYYY'),
      date: date.format('DD'),
      day: daysOfWeek[date.day()],
      isCurrent: false,
    };
  });
  const futureFinalDates = Array.from({length: 7}, (_, index) => {
    const date = FinalDate.clone().add(index + 1, 'days');
    return {
      month: date.format('MMM'),
      year: date.format('YYYY'),
      date: date.format('DD'),
      day: daysOfWeek[date.day()],
      isCurrent: false,
    };
  });

  const Final = {
    month: FinalDate.format('MMM'),
    year: FinalDate.format('YYYY'),
    date: FinalDate.format('DD'),
    day: daysOfWeek[FinalDate.day()],
    isCurrent: true,
  };

  const datesArray = [
    ...pastDates,
    current,
    ...futureDates,
    ...pastFinalDates,
    Final,
    ...futureFinalDates,
  ];
  const RenderCalender = ({minIndex, maxIndex}) => {

    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          justifyContent:
            datesArray.slice(minIndex, maxIndex).length < 7
              ? 'flex-start'
              : 'space-between',
          marginVertical: 6,
        }}>
        {datesArray.slice(minIndex, maxIndex).map((value, index) => (
          <View
            key={index}
            style={{
              backgroundColor: value.isCurrent
                ? AppColor.RED
                : AppColor.BACKGROUNG,
              paddingVertical: value.isCurrent ? 0 : 2,
              paddingHorizontal: value.isCurrent ? 0 : 12,
              borderRadius: value.isCurrent ? 50 / 2 : 8,
              width: value.isCurrent ? 50 : undefined,
              height: value.isCurrent ? 50 : undefined,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight:
                datesArray.slice(minIndex, maxIndex).length < 7 ? 8 : 0,
            }}>
            <Text
              style={{
                color: value.isCurrent ? AppColor.WHITE : AppColor.Gray5,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                alignSelf: 'center',
              }}>
              {value.date}
            </Text>
            <Text
              key={index}
              style={{
                color: value.isCurrent ? AppColor.WHITE : AppColor.Gray5,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 10,
                alignSelf: 'center',
              }}>
              {value.month}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F8F8F8'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', backgroundColor: AppColor.WHITE}}>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 30,
              color: '#424242',
            }}>
            Based on your Answers.
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 22,
              fontWeight: '600',
              color: AppColor.BLACK,
              marginTop: 10,
            }}>
            {`You'll be ${TargetWeight} Kg by`}
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {/* <GradientText
            text={moment(finalDate || '').format('DD MMMM YYYY')}
            fontWeight="600"
            fontSize={20}
            width={200}
          /> */}
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 22,
                color: AppColor.RED,
                // marginTop: 10,
              }}>
              {moment(finalDate || '').format('DD MMMM YYYY')}
            </Text>
          </View>
        </View>
        {weightHistory.length != 0 && zeroData.length != 0 && (
          <Graph resultData={weightHistory} zeroData={zeroData} />
        )}
        <GradientText text={'Work Routine'} />
        {/* <Calendar
          onDayPress={day => {
            console.log(day.dateString);
          }}
          markedDates={{
            [moment().format('YYYY-MM-DD')]: {
              startingDay: true,
              color: AppColor.RED,
              textColor: 'white',
            },
            [finalDate]: {
              endingDay: true,
              color: AppColor.RED,
              textColor: 'white',
            },
            ...getDatesBetween(), // Mark the days in between
          }}
          minDate={moment().format('YYYY-MM-DD')}
          maxDate={moment(finalDate).format('YYYY-MM-DD')}
          markingType="period"
          enableSwipeMonths
          hideExtraDays={true}
          hideDayNames={true}
          disableAllTouchEventsForInactiveDays
          style={[
            styles.calender,
            {
              height: DeviceHeigth * 0.4,
            },
          ]}
          theme={theme}
        /> */}
        <View style={styles.CalenderView}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 22,
              marginVertical: 8,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {datesArray.slice(0, 7).map((value, index) => (
              <Text
                key={index}
                style={{
                  color: AppColor.Gray5,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  textAlign: 'center',
                  width: 30,
                }}>
                {value.day}
              </Text>
            ))}
          </View>
          <RenderCalender minIndex={0} maxIndex={7} />
          <RenderCalender minIndex={7} maxIndex={14} />
          <RenderCalender minIndex={14} maxIndex={21} />
          <RenderCalender minIndex={21} maxIndex={28} />
          <RenderCalender minIndex={28} />
        </View>
        <GradientText text={'Plan Preview'} />
        <View
          style={[styles.calender, {paddingHorizontal: 10, paddingBottom: 20}]}>
          {Object.entries(currentExercise?.days).map(
            (item: any, index: number) => {
              return (
                <>
                  <GradientText
                    text={`Day ${index + 1}`}
                    fontWeight="600"
                    fontSize={14}
                    width={100}
                  />
                  {item[1] == 'Rest' ? (
                    <GradientText
                      text={'Rest'}
                      fontWeight="600"
                      fontSize={20}
                      width={100}
                      marginTop={0}
                      height={30}
                    />
                  ) : (
                    <FlatList
                      data={item[1]}
                      renderItem={renderItem}
                      key={index}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      scrollEnabled={item[1].length > 3}
                    />
                  )}
                </>
              );
            },
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            // toNextScreen()
            navigation.navigate('BottomTab');
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#941000', '#D5191A']}
            style={[styles.nextButton]}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins',
                lineHeight: 30,
                color: AppColor.WHITE,
                fontWeight: '700',
              }}>
              Choose Your Plan
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{height: DeviceHeigth * 0.05}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preview;

const styles = StyleSheet.create({
  calender: {
    width: DeviceWidth * 0.9,
    // he: DeviceWidth * 0.9,
    alignSelf: 'center',
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nextButton: {
    // backgroundColor: 'red',
    width: DeviceWidth * 0.9,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  CalenderView: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    width: DeviceWidth * 0.9,
    backgroundColor: AppColor.WHITE,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
