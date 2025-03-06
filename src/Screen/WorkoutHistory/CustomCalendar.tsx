import {StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import {DeviceWidth} from '../../Component/Config';
import moment from 'moment';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {Calendar} from 'react-native-calendars';
import {Theme} from 'react-native-calendars/src/types';

type Props = {
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
};

const CustomCalendar = ({date, setDate}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const today = moment().format('YYYY-MM-DD');
  const theme: Theme = useMemo(() => {
    return {
      calendarBackground: AppColor.WHITE,
      selectedDayBackgroundColor: AppColor.RED,
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.BLACK,
      arrowColor: '#000',
      monthTextColor: '#000',
      indicatorColor: '#000',
      textMonthFontSize: 17,
      textDayFontFamily: Fonts.MONTSERRAT_BOLD,
      textMonthFontFamily: Fonts.MONTSERRAT_BOLD,
      dayTextColor: AppColor.BLACK,
      disabledMonthTextColor: AppColor.GRAY, // Add disabled month text color
      disabledDayTextColor: AppColor.GRAY, // Add disabled day text color
    };
  }, []);

  const getDisabledDays = () => {
    const disabledDays: any = {};
    const today = moment();
    const maxDate = today.clone().add(100, 'years'); // Prevent infinite loop.

    for (
      let m = today.clone();
      m.isSameOrBefore(maxDate, 'month');
      m.add(1, 'month')
    ) {
      const monthStr = m.format('YYYY-MM');
      const daysInMonth = m.daysInMonth();

      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${monthStr}-${d < 10 ? '0' + d : d}`;
        if (moment(dayStr).isAfter(today, 'day')) {
          disabledDays[dayStr] = {disabled: true};
        }
      }
    }
    return disabledDays;
  };

  const disabledDays = useMemo(() => getDisabledDays(), []);
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
        ...disabledDays,
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
