import moment from 'moment';
import {AppColor, Fonts} from '../../Component/Color';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceWidth} from '../../Component/Config';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import localStorage from 'redux-persist/es/storage';
export const WeekTabWithoutEvent = ({
  day,
  dayIndex,
  selectedDay,
  setSelectedDay,
  WeekStatus,
  WeekArray,
}) => {
  return (
    <TouchableOpacity
      key={dayIndex}
      onPress={() => setSelectedDay(dayIndex)}
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor:
          WeekStatus.includes(WeekArray[dayIndex]) &&
          day == moment().format('dddd')
            ? AppColor.WHITE
            : WeekStatus.includes(WeekArray[dayIndex])
            ? '#008416'
            : AppColor.WHITE,
        borderColor:
          day == moment().format('dddd') &&
          WeekStatus.includes(WeekArray[dayIndex])
            ? '#008416'
            : day == moment().format('dddd')
            ? AppColor.ORANGE
            : AppColor.GRAY1,
        borderRadius: 12,
        padding: 5,
        borderWidth: day == moment().format('dddd') ? 1.5 : 1,
        width: 45,
        height: 70,
      }}>
      <Text
        style={[
          styles.labelStyle,
          {
            color:
              day == moment().format('dddd') &&
              WeekStatus.includes(WeekArray[dayIndex])
                ? '#008416'
                : WeekStatus.includes(WeekArray[dayIndex])
                ? AppColor.WHITE
                : day == moment().format('dddd')
                ? AppColor.ORANGE
                : AppColor.BLACK,
            fontWeight: '600',
            textTransform: 'capitalize',
          },
        ]}>
        {day.substring(0, 3)}
      </Text>
      {dayIndex == selectedDay ? (
        <View
          style={{
            width: DeviceWidth * 0.05,
            height: 2,
            backgroundColor:
              WeekStatus.includes(WeekArray[dayIndex]) &&
              day == moment().format('dddd')
                ? '#008416'
                : day == moment().format('dddd')
                ? AppColor.ORANGE
                : WeekStatus.includes(WeekArray[dayIndex])
                ? AppColor.WHITE
                : AppColor.BLACK,
            marginVertical: 12,
          }}
        />
      ) : WeekStatus.includes(WeekArray[dayIndex]) ? (
        <Icon
          name="check"
          size={20}
          color={
            day == moment().format('dddd') &&
            WeekStatus.includes(WeekArray[dayIndex])
              ? '#008416'
              : day == moment().format('dddd')
              ? AppColor.ORANGE
              : AppColor.WHITE
          }
          style={{marginVertical: 8}}
        />
      ) : (
        <Icon
          name="record-circle"
          size={20}
          color={
            day == moment().format('dddd') ? AppColor.ORANGE : AppColor.BLACK
          }
          style={{marginVertical: 6}}
        />
      )}
    </TouchableOpacity>
  );
};
export const WeekTabWithEvents = ({
  day,
  dayIndex,
  selectedDay,
  setSelectedDay,
  WeekStatus,
  WeekArray,
  dayObject,
  dayWiseCoins,
}) => {
  const sameDay = day == moment().format('dddd'); // to avoid extra lines
  return (
    <View style={{alignItems: 'center'}}>
      <Text style={[styles.labelStyle]}>{day.substring(0, 3)}</Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderWidth: sameDay ? 1 : 0,
            borderColor: sameDay?AppColor.ORANGE:AppColor.WHITE,
            backgroundColor:
              dayWiseCoins[WeekArray[dayIndex]] < 0
                ? '#F380291A'
                : dayWiseCoins[WeekArray[dayIndex]] >= 0
                ? '#008416'
                : dayWiseCoins[WeekArray[dayIndex]] == null && sameDay
                ? '#F9F9F9'
                : AppColor.WHITE,
                borderWidth:0.5,
               
          },
        ]}
        onPress={() => setSelectedDay(dayIndex)}>
        <Text
          style={[
            styles.txt1,
            {
              color:
                dayWiseCoins[WeekArray[dayIndex]] < 0
                  ? AppColor.RED
                  : dayWiseCoins[WeekArray[dayIndex]] >= 0
                  ? AppColor.WHITE
                  : dayWiseCoins[WeekArray[dayIndex]] == null && sameDay
                  ? AppColor.BLACK
                  : AppColor.BLACK,
                  fontFamily:Fonts.MONTSERRAT_MEDIUM,
                  fontSize:17
            },
          ]}>
          {dayWiseCoins[WeekArray[dayIndex]] ??
            dayObject[WeekArray[dayIndex]]?.total_coins ??
            '--'}
        </Text>
        <Image
          source={
            dayWiseCoins[WeekArray[dayIndex]] < 0
              ? localImage.Missed
              : dayWiseCoins[WeekArray[dayIndex]] >= 0
              ? localImage.completed
              : localImage.FitCoin
          }
          style={{height: 20, width: 20, marginVertical: 3,marginLeft:3}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  labelStyle: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.BLACK,
  },
  button: {
    width: 60,
    backgroundColor: '#008416',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 3,
    // ...Platform.select({
    //   android: {
    //     elevation: 5,
    //     shadowOpacity: 0.1,
    //     shadowColor: 'grey',
    //   },
    //   ios: {
    //     shadowColor: '#000000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
    //   },
    // }),
  },
  txt1: {
    textAlign: 'center',
  },
});
