import {StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceWidth} from '../../Component/Config';
import moment from 'moment';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {Calendar} from 'react-native-calendars';

type Props = {
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
};

const CustomCalendar = ({date, setDate}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = useMemo(() => {
    return {
      calendarBackground: AppColor.WHITE,
      selectedDayBackgroundColor: '#f0013b',
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.BLACK,
      arrowColor: '#f0013b',
      monthTextColor: '#f0013b',
      indicatorColor: '#f0013b',
      textMonthFontSize: 17,
      textDayFontFamily: Fonts.MONTSERRAT_BOLD,
      textMonthFontFamily: Fonts.MONTSERRAT_BOLD,
      dayTextColor: AppColor.BLACK,
    };
  }, []);
  return (
    <Calendar
      onDayPress={(day: any) => {
        AnalyticsConsole(`${day.dateString.replaceAll('-', '_')}`);
        setDate(day.dateString);
        setIsLoaded(false);
      }}
      allowSelectionOutOfRange={false}
      markingType="period"
      enableSwipeMonths
      hideExtraDays={true}
      hideDayNames={false}
      markedDates={{
        [date]: {
          startingDay: true,
          color: '#f0013b',
          endingDay: true,
          textColor: AppColor.WHITE,
        },
        [moment().format('YYYY-MM-DD')]: {
          marked: true,
          startingDay: true,
          selected: true,
          color: AppColor.RED,
          endingDay: true,
          textColor: AppColor.WHITE,
          selectedDotColor: AppColor.RED,
        },
      }}
      style={[
        {
          backgroundColor: AppColor.WHITE,
          marginVertical: 20,
          borderRadius: 15,
        },
      ]}
      theme={theme}
    />
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({});
