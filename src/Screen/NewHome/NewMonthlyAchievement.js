import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import React, {useMemo, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
const NewMonthlyAchievement = () => {
  const [getDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [selected, setSelected] = useState(false);
  const Card_Data = [
    {
      id: 1,
      img: localImage.Fire1,
      txt1: '4',
      txt2: 'KCal',
    },
    {
      id: 2,
      img: localImage.Clock_p,
      txt1: '2',
      txt2: 'Min',
    },
    {
      id: 3,
      img: localImage.Biceps_p,
      txt1: '3',
      txt2: 'Actions',
    },
  ];
  const theme = useMemo(() => {
    return {
      backgroundColor: AppColor.WHITE,
      calendarBackground: AppColor.WHITE,
      selectedDayBackgroundColor: AppColor.RED,
      selectedDayTextColor: AppColor.WHITE,
      todayTextColor: AppColor.BLACK,
      arrowColor: AppColor.RED,
      monthTextColor: AppColor.RED,
      indicatorColor: AppColor.RED,
      textMonthFontSize: 17,
      textDayFontFamily: 'Poppins-SemiBold',
      textMonthFontFamily: 'Poppins-SemiBold',
      dayTextColor: AppColor.BLACK,
    };
  }, []);
  return (
    <SafeAreaView style={styles.Container}>
      <NewHeader header={'Monthly Achievement'} backButton={true} />
      <View
        style={{
          width: DeviceWidth * 0.9,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {Card_Data.map((value, index) => (
          <View key={index} style={styles.cards}>
            <Image
              source={value.img}
              style={{width: 50, height: 50, alignSelf: 'center'}}
              resizeMode="contain"
            />
            <Text style={[styles.txts, {color: AppColor.RED}]}>
              {value.txt1}
            </Text>
            <Text style={styles.txts}>{value.txt2}</Text>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Calendar
          onDayPress={day => {
            console.log(day);
            setDate(day.dateString);
            setSelected(true);
          }}
          markingType="period"
          
          enableSwipeMonths
          hideExtraDays={true}
          hideDayNames={false}
          markedDates={{
            [getDate]: {
              startingDay: true,
              color: AppColor.RED,
              endingDay: true,
              textColor: AppColor.WHITE,
            },
          }}
          style={[
            styles.calender,
            {
              width: DeviceWidth * 0.85,
            },
          ]}
          theme={theme}
        />
      </View>
      <View
        style={{
          marginVertical: 20,
          width: DeviceWidth * 0.9,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            color: AppColor.BoldText,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
          }}>
          {moment(getDate).format('MMM DD, YYYY')}
        </Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.95,
    borderRadius: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cards: {
    backgroundColor: AppColor.BACKGROUNG,
    width: (DeviceWidth * 0.9) / 3.2,
    marginRight: 5,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
    padding: 10,
    borderRadius: 10,
  },
  txts: {
    color: AppColor.BLACK,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginTop: 10,
  },
});
export default NewMonthlyAchievement;
