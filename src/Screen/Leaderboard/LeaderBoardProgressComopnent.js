import {View, Text, StyleSheet, Platform, Image} from 'react-native';
import React, {useCallback} from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import NewButton from '../../Component/NewButton';

const LeaderBoardProgressComopnent = ({
  weekArray,
  coins,
  getPurchaseHistory,
  getWeeklyPlansData,
  navigation,
}) => {
  const nullCondition = useCallback(
    index => coins[weekArray[index]] == null,
    [coins],
  );

  const missedCondition = useCallback(
    index => coins[weekArray[index]] < 0,
    [coins],
  );

  const completeCondition = useCallback(
    index => coins[weekArray[index]] > 0,
    [coins],
  );
  const currentDay = weekArray[getPurchaseHistory?.currentDay - 1];
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>Your Progress</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 10,
        }}>
        {weekArray.map((item, index) => (
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                borderWidth: 1.5,
                borderRadius: 12,
                padding: 3,
                alignItems: 'center',
                borderColor: nullCondition(index)
                  ? weekArray[index] == currentDay
                    ? '#FFF0CB'
                    : '#F5F5F5'
                  : missedCondition(index)
                  ? '#FFCBCB'
                  : '#C3F1C2',

                backgroundColor: nullCondition(index)
                  ? weekArray[index] == currentDay
                    ? '#FFF9E7'
                    : '#F5F5F5'
                  : missedCondition(index)
                  ? '#FFCBCB'
                  : '#E3FFEE',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: nullCondition(index)
                    ? weekArray[index] == currentDay
                      ? '#FF9500'
                      : '#6B7280'
                    : missedCondition(index)
                    ? '#FF3B30'
                    : '#6B7280',
                }}>
                {nullCondition(index)
                  ? 'Earn Upto'
                  : missedCondition(index)
                  ? 'Missed'
                  : 'Earned'}
              </Text>
              <Image
                source={
                  nullCondition(index)
                    ? require('../../Icon/Images/NewHome/groupCoin1.png')
                    : missedCondition(index)
                    ? require('../../Icon/Images/NewHome/groupCoin2.png')
                    : require('../../Icon/Images/NewHome/groupCoin1.png')
                }
                style={{height: 50, width: 50}}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  color: nullCondition(index)
                    ? weekArray[index] == currentDay
                      ? '#FF9500'
                      : '#6B7280'
                    : missedCondition(index)
                    ? '#FF3B30'
                    : '#6B7280',
                }}>
                {nullCondition(index)
                  ? getWeeklyPlansData[item]?.total_coins
                  : coins[weekArray[index]]}
              </Text>
            </View>
            <View style={{marginVertical: 10,}}>
              <Image
                source={
                  nullCondition(index)
                    ? weekArray[index] == currentDay
                      ? require('../../Icon/Images/NewHome/f3.png')
                      : require('../../Icon/Images/NewHome/f4.png')
                    : missedCondition(index)
                    ? require('../../Icon/Images/NewHome/f2.png')
                    : require('../../Icon/Images/NewHome/f1.png')
                }
                style={{height: 35, width: 35, zIndex: 1}}
                resizeMode="contain"
              />
              {index < weekArray.length - 1 && (
                <View
                  style={[
                    styles.horizontalLine,
                    {
                      width: DeviceHeigth >= 1024 ? '230%' : '110%',
                      backgroundColor:
                        missedCondition(index) || completeCondition(index)
                          ? AppColor.NEW_GREEN
                          : AppColor.GRAY,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.dot,
                {
                  borderColor:
                    weekArray[index] == currentDay
                      ? AppColor.BLACK
                      : AppColor.WHITE,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <NewButton
        title={'Start Workout'}
        ButtonWidth={DeviceWidth * 0.35}
        pV={8}
        mV={8}
        fontFamily={Fonts.HELVETICA_BOLD}
        onPress={() => {
          navigation.navigate('BottomTab', {screen: 'MyPlans'});
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.95,
    paddingVertical: 10,
    backgroundColor: AppColor.WHITE,
    marginVertical: 10,
    borderRadius: 12,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  progressText: {
    color: AppColor.BLACK,
    fontFamily: Fonts.HELVETICA_BOLD,
    textAlign: 'center',
    fontSize: 16,
  },
  dot: {height: 0, width: 0, borderWidth: 4, borderRadius: 100},
  horizontalLine: {
    position: 'absolute',
    height: 6,
    width: '100%',
    backgroundColor: AppColor.GRAY,
    marginHorizontal: 5,
    top: 16,
    borderRadius: 20,
  },
});
export default LeaderBoardProgressComopnent;
