import React from 'react';
import moment from 'moment';
import {AppColor, Fonts} from '../../Component/Color';
import {Platform, StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceWidth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';

export const WeekTabWithoutEvent = ({
  day,
  dayIndex,
  selectedDay,
  setSelectedDay,
  WeekStatus,
  WeekArray,
}) => {
  const isSelected = dayIndex === selectedDay;
  const isToday = day === moment().format('dddd');
  const isCompleted = WeekStatus.includes(WeekArray[dayIndex]);

  return (
    <TouchableOpacity
      key={dayIndex}
      activeOpacity={0.8}
      onPress={() => setSelectedDay(dayIndex)}
      style={styles.tabWrapper}>
      {isSelected ? (
        <LinearGradient
          colors={['#FF2A54', '#E11D48']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.tabCard, styles.tabCardSelected]}>
          <Text style={styles.dayLabelSelected}>
            {day === 'Thursday' ? day.substring(0, 2) : day.substring(0, 1)}
          </Text>
          {isCompleted ? (
            <View style={styles.iconCircleSelected}>
              <Icon name="check-bold" size={14} color="#E11D48" />
            </View>
          ) : (
            <View style={styles.activeDotSelected} />
          )}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.tabCard,
            styles.tabCardInactive,
            isToday && styles.tabCardToday,
            isCompleted && styles.tabCardCompleted,
          ]}>
          <Text
            style={[
              styles.dayLabelInactive,
              isToday && styles.dayLabelToday,
              isCompleted && styles.dayLabelCompletedText,
            ]}>
            {day === 'Thursday' ? day.substring(0, 2) : day.substring(0, 1)}
          </Text>
          {isCompleted ? (
            <View style={styles.iconCircleCompleted}>
              <Icon name="check" size={13} color="#FFFFFF" />
            </View>
          ) : isToday ? (
            <View style={styles.todayIndicatorDot} />
          ) : (
            <View style={styles.inactiveDot} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const WeekTabWithEvents = ({
  day,
  dayIndex,
  setSelectedDay,
  WeekArray,
  dayObject,
  dayWiseCoins,
  selectedDay,
}) => {
  const sameDay = day === WeekArray[selectedDay];
  const coinsVal = dayWiseCoins[WeekArray[dayIndex]];
  const isMissed = coinsVal < 0 || coinsVal === 0;
  const isCompleted = coinsVal > 0;

  return (
    <View key={dayIndex} style={styles.eventTabWrap}>
      <Text style={[styles.eventLabel, sameDay && styles.eventLabelActive]}>
        {day.substring(0, 3)}
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.eventBtnTouch}
        onPress={() => setSelectedDay(dayIndex)}>
        {sameDay ? (
          <LinearGradient
            colors={isCompleted ? ['#10B981', '#059669'] : ['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.eventCardSelected}>
            <Text style={styles.eventCoinsTextSelected}>
              {coinsVal ?? dayObject[WeekArray[dayIndex]]?.total_coins ?? '--'}
            </Text>
            <Image
              source={
                isMissed
                  ? localImage.Missed
                  : isCompleted
                  ? localImage.completed
                  : localImage.FitCoin
              }
              style={styles.eventIcon}
              resizeMode="contain"
            />
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.eventCardInactive,
              isCompleted && styles.eventCardCompletedBg,
              isMissed && styles.eventCardMissedBg,
            ]}>
            <Text
              style={[
                styles.eventCoinsTextInactive,
                isCompleted && {color: '#059669'},
                isMissed && {color: '#EF4444'},
              ]}>
              {coinsVal ?? dayObject[WeekArray[dayIndex]]?.total_coins ?? '--'}
            </Text>
            <Image
              source={
                isMissed
                  ? localImage.Missed
                  : isCompleted
                  ? localImage.completed
                  : localImage.FitCoin
              }
              style={styles.eventIcon}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const WeekTabHistory = ({
  day,
  dayIndex,
  setSelectedDay,
  WeekArray,
  dayWiseCoins,
  selectedDay,
  currentDay,
}) => {
  const sameDay = day === WeekArray[selectedDay];
  const isFutureDay = dayIndex > currentDay;

  return (
    <View style={styles.historyTabWrap}>
      <Text style={[styles.eventLabel, sameDay && styles.eventLabelActive]}>
        {day.substring(0, 3)}
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.historyBtnTouch}
        onPress={() => {
          if (isFutureDay) {
            showMessage({
              message: `No data available for the day`,
              type: 'info',
              animationDuration: 500,
              floating: true,
              icon: {icon: 'auto', position: 'left'},
            });
          } else {
            setSelectedDay(dayIndex);
          }
        }}>
        {sameDay ? (
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.historyCardSelected}>
            <Text style={styles.historyCoinsTextSelected}>
              {dayWiseCoins[WeekArray[dayIndex]] < 0
                ? 0
                : dayWiseCoins[WeekArray[dayIndex]] ?? 0}
            </Text>
            <Image
              source={localImage.FitCoin}
              style={styles.historyIcon}
              resizeMode="contain"
            />
          </LinearGradient>
        ) : (
          <View style={styles.historyCardInactive}>
            <Text style={styles.historyCoinsTextInactive}>
              {dayWiseCoins[WeekArray[dayIndex]] < 0
                ? 0
                : dayWiseCoins[WeekArray[dayIndex]] ?? 0}
            </Text>
            <Image
              source={localImage.FitCoin}
              style={styles.historyIcon}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  tabCard: {
    width: 44,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tabCardSelected: {
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tabCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabCardToday: {
    borderColor: '#FF2A54',
    borderWidth: 1.5,
  },
  tabCardCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  dayLabelSelected: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayLabelInactive: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
  },
  dayLabelToday: {
    color: '#FF2A54',
  },
  dayLabelCompletedText: {
    color: '#059669',
  },
  activeDotSelected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  iconCircleSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleCompleted: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF2A54',
    marginBottom: 2,
  },
  inactiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5E7EB',
    marginBottom: 2,
  },

  // Event Tab Styles
  eventTabWrap: {
    alignItems: 'center',
    marginHorizontal: 3,
  },
  eventLabel: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  eventLabelActive: {
    color: '#FF2A54',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
  },
  eventBtnTouch: {
    borderRadius: 20,
  },
  eventCardSelected: {
    width: 56,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventCardInactive: {
    width: 56,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eventCardCompletedBg: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  eventCardMissedBg: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  eventCoinsTextSelected: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventCoinsTextInactive: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  eventIcon: {
    width: 22,
    height: 22,
    marginTop: 4,
  },

  // History Tab Styles
  historyTabWrap: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  historyBtnTouch: {
    borderRadius: 22,
  },
  historyCardSelected: {
    width: 54,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  historyCardInactive: {
    width: 54,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  historyCoinsTextSelected: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyCoinsTextInactive: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  historyIcon: {
    width: 22,
    height: 22,
    marginTop: 4,
  },
});
