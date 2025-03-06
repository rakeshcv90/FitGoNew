import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {API_CALLS} from '../../API/API_CALLS';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import FitText from '../../Component/Utilities/FitText';
import {DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import FitButton from '../../Component/Utilities/FitButton';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import DailyProgress from './DailyProgress';

const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const WeekArrayWithoutEvent = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const Progress = ({myPlans}: {myPlans: boolean}) => {
  const getWeeklyPlansData = useSelector(
    (state: any) => state.getWeeklyPlansData,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state.enteredCurrentEvent,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [weeklyCoins, setWeeklyCoins] = useState<Record<string, number | null>>(
    {
      Friday: null,
      Monday: null,
      Thursday: null,
      Tuesday: null,
      Wednesday: null,
    },
  );
  useEffect(() => {
    API_CALLS.getEventEarnedCoins(
      getUserDataDetails?.id,
      WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1],
      setWeeklyCoins,
    );
  }, []);
  const currentDay = enteredCurrentEvent
    ? WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
    : WeekArrayWithoutEvent[getPurchaseHistory?.currentDay - 1];

  const completeColor = '#14AE5C';
  const incompleteColor = '#EBEDF0';
  const missed = '#EC221F';
  const progressColor = '#FF9100';

  const completeImg = require('../../Icon/Images/NewHome/f1.png');
  const missedImg = require('../../Icon/Images/NewHome/f2.png');
  const incompleteImg = require('../../Icon/Images/NewHome/f3.png');
  const futureImg = require('../../Icon/Images/NewHome/f4.png');

  const EventUI = () => (
    <>
      {WeekArrayWithEvent.map((item, index) => {
        const isNull = weeklyCoins[item] == null;
        const isMissed = weeklyCoins[item] != null && weeklyCoins[item] < 0;
        const isCurrentDay = item == currentDay && isNull;
        const leftRadius = index == 0 ? 20 : 0;
        const rightRadius = index == 4 ? 20 : 0;
        const coin = getWeeklyPlansData[item]?.total_coins;
        return (
          <View style={{alignItems: 'center'}}>
            <View
              style={[
                styles.design,
                {
                  borderTopLeftRadius: leftRadius,
                  borderTopRightRadius: rightRadius,
                  borderBottomLeftRadius: leftRadius,
                  borderBottomRightRadius: rightRadius,
                  backgroundColor: isCurrentDay
                    ? progressColor
                    : isNull
                    ? incompleteColor
                    : isMissed
                    ? missed
                    : completeColor,
                },
              ]}>
              <FitText
                type="SubHeading"
                fontSize={isCurrentDay ? 14 : 16}
                color={
                  isNull && !isCurrentDay
                    ? AppColor.PrimaryTextColor
                    : AppColor.WHITE
                }
                value={
                  isCurrentDay
                    ? 'Progress'
                    : isNull
                    ? coin
                    : weeklyCoins[item] + ''
                }
              />
            </View>
            <Image
              source={
                isCurrentDay
                  ? incompleteImg
                  : isNull
                  ? futureImg
                  : isMissed
                  ? missedImg
                  : completeImg
              }
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
            <FitText
              type="SubHeading"
              fontWeight={item == currentDay ? '700' : '600'}
              color={AppColor.SecondaryTextColor}
              value={item.slice(0, 3)}
            />
            <FitText
              type="SubHeading"
              fontWeight="bold"
              fontSize={30}
              lineHeight={20}
              color={
                item == currentDay ? AppColor.PrimaryTextColor : AppColor.WHITE
              }
              value={'.'}
            />
          </View>
        );
      })}
    </>
  );

  return (
    <View>
      {enteredCurrentEvent && !myPlans && (
        <FitText
          type="SubHeading"
          fontWeight="600"
          fontSize={20}
          color="#343A40"
          value="Your Progress"
        />
      )}
      <View
        style={[
          PredefinedStyles.rowCenter,
          {alignSelf: 'center', marginTop: 20},
        ]}>
        {enteredCurrentEvent ? (
          <EventUI />
        ) : (
          <>
            {WeekArrayWithoutEvent.map((item, index) => {
              const isCurrentDay = index == getPurchaseHistory?.currentDay - 1;
              const prevDays = index < getPurchaseHistory?.currentDay - 1;
              const nextDays = index > getPurchaseHistory?.currentDay - 1;

              return (
                <View
                  style={[
                    PredefinedStyles.NormalCenter,
                    {width: DeviceWidth / 7.5, marginBottom: 10},
                  ]}>
                  <FitText
                    type="normal"
                    fontWeight={'600'}
                    color="#8A8A8A"
                    value={item.slice(0, 3)}
                  />
                  <View
                    style={[
                      {
                        width: 20,
                        height: 20,
                        borderRadius: 20,
                        backgroundColor: isCurrentDay
                          ? '#E35178'
                          : prevDays
                          ? '#3333333A'
                          : AppColor.WHITE,
                        borderWidth: nextDays ? 1.5 : 0,
                        borderColor: nextDays ? '#3333331A' : 'transparent',
                        marginVertical: 5,
                      },
                      PredefinedStyles.NormalCenter,
                    ]}>
                    {prevDays && (
                      <View
                        style={[
                          {
                            width: 11,
                            height: 11,
                            borderRadius: 11,
                            backgroundColor: '#EBEBEB',
                          },
                          PredefinedStyles.NormalCenter,
                        ]}
                      />
                    )}
                  </View>
                  <FitText
                    type="SubHeading"
                    fontWeight={'600'}
                    color={AppColor.PrimaryTextColor}
                    value={index + 1 + ''}
                  />
                </View>
              );
            })}
          </>
        )}
      </View>
      {enteredCurrentEvent && !myPlans && (
        <FitButton
          titleText={'START NOW'}
          w={'35%'}
          padV={7}
          textColor={AppColor.WHITE}
          onPress={() => navigate('MyPlans')}
        />
      )}
      {!myPlans && <DailyProgress currentEvent={enteredCurrentEvent} />}
    </View>
  );
};

export default Progress;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
  },
  design: {
    padding: 5,
    width: DeviceWidth / 5.5,
    alignItems: 'center',
    marginBottom: 5,
    marginHorizontal: 0.2,
  },
});
