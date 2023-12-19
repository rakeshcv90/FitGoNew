import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
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

const GradientText = ({item, fontWeight, fontSize, width}: any) => {
  const gradientColors = ['#D5191A', '#941000'];

  return (
    <View style={{marginTop: 10}}>
      <Svg height="40" width={width ? width : item?.length * 10}>
        <SvgGrad id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </SvgGrad>
        <SvgText
          fontFamily="Poppins"
          fontWeight={fontWeight ? fontWeight : '600'}
          fontSize={fontSize ? fontSize : '16'}
          fill="url(#grad)"
          x="10"
          y="25">
          {item}
        </SvgText>
      </Svg>
    </View>
  );
};

const Av_Cal_Per_KG = 4000; // normally 7500
const Av_Cal_Per_2_Workout = 500; // Assuming
const currentW = 70;
const targetW = 60;
const Preview = () => {
  const {getLaterButtonData} = useSelector((state: any) => state);
  const [finalDate, setFinalDate] = useState('');

  useEffect(() => {
    CalculateWeight();
  }, []);

  const CalculateWeight = () => {
    const TotalW = currentW - targetW;
    const totalW_Cal = TotalW * Av_Cal_Per_KG;
    const Result_Number_Of_Days = totalW_Cal / Av_Cal_Per_2_Workout;
    const Final_Date = moment()
      .add(Result_Number_Of_Days, 'days')
      .format('YYYY-MM-DD');
    setFinalDate(Final_Date);
    // console.log(Result_Number_Of_Days, Final_Date);
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F8F8F8'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center',}}>
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
              fontFamily: 'Poppins',
              fontSize: 20,
              fontWeight: '600',
              lineHeight: 30,
              color: AppColor.BLACK,
              marginTop: 10,
            }}>
            {`You'll be ${targetW} Kg by`}
          </Text>
          <GradientText
            item={moment(finalDate).format('DD MMMM YYYY')}
            fontWeight="600"
            fontSize={20}
            width={200}
          />
        </View>
        <Graph />
        <GradientText item={'Work Routine'} />
        <Calendar
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
          style={styles.calender}
          theme={theme}
        />
        <GradientText item={'Plan Preview'} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preview;

const styles = StyleSheet.create({
  calender: {
    width: DeviceWidth * 0.9,
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
    height: DeviceHeigth * 0.4,
  },
});
