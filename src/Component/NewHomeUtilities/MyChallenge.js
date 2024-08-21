import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import LinearGradient from 'react-native-linear-gradient';
import {ImageBackground} from 'react-native';
import {localImage} from '../Image';
import {showMessage} from 'react-native-flash-message';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import moment from 'moment';

const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const MyChallenge = ({coins}) => {
  const getWeeklyPlansData = useSelector(state => state.getWeeklyPlansData);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const navigation = useNavigation();
  const handelClick = index => {
    if (index == 1) {
      AnalyticsConsole('PW');

      navigation.navigate('PastWinner');
    } else {
      AnalyticsConsole('LB');
      navigation.navigate('Leaderboard');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: '100%',
          }}>
          <Text
            style={{
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 20,
              color: AppColor.PrimaryTextColor,
            }}>
            My Challenge
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',

            marginTop: DeviceHeigth * 0.01,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: AppColor.WHITE,
              alignSelf: 'center',
              borderRadius: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              {WeekArrayWithEvent.map((item, index) => {
                const sameDay =
                  WeekArrayWithEvent[getPurchaseHistory.currentDay - 1] ==
                  WeekArrayWithEvent[index];
                return (
                  <View
                    style={{
                      width: '18%',

                      backgroundColor:
                        coins[item] < 0
                          ? '#FFCBCB'
                          : coins[item] == null
                          ? sameDay
                            ? '#FFF9E7'
                            : '#F5F5F5'
                          : '#E3FFEE',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor:
                        coins[item] < 0
                          ? '#FFCBCB'
                          : coins[item] == null
                          ? sameDay
                            ? '#FFF0CB'
                            : '#E8E8E8'
                          : '#C3F1C2',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 10,
                        fontFamily: Fonts.HELVETICA_REGULAR,
                        fontSize: 12,
                        lineHeight: 12,
                        color:
                          coins[item] < 0
                            ? '#FF3B30'
                            : coins[item] == null
                            ? sameDay
                              ? '#FF9500'
                              : '#6B7280'
                            : '#34C759',
                      }}>
                      {coins[item] < 0
                        ? 'Missed'
                        : coins[item] == null
                        ? 'Earn Upto'
                        : 'Earned'}
                    </Text>
                    <Image
                      source={
                        coins[item] < 0
                          ? require('../../Icon/Images/NewHome/groupCoin2.png')
                          : coins[item] == null
                          ? require('../../Icon/Images/NewHome/groupCoin1.png')
                          : require('../../Icon/Images/NewHome/groupCoin1.png')
                      }
                      resizeMode="contain"
                      style={{width: 30, height: 30, marginTop: 10}}
                    />
                    <Text
                      style={{
                        marginTop: 10,
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 14,
                        lineHeight: 20,
                        color:
                          coins[item] < 0
                            ? '#FF3B30'
                            : coins[item] == null
                            ? sameDay
                              ? '#FF9500'
                              : '#6B7280'
                            : '#34C759',
                      }}>
                      {coins[item] ?? getWeeklyPlansData[item]?.total_coins}
                    </Text>
                  </View>
                );
              })}
            </View>
            {WeekArrayWithEvent.map((item, index) => {
              const sameDay =
                WeekArrayWithEvent[getPurchaseHistory.currentDay - 1];
              return index == 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',

                      width: '100%',
                      height: 50,
                      alignItems: 'center',
                      paddingLeft:
                        DeviceHeigth >= 1024
                          ? DeviceWidth * 0.07
                          : DeviceHeigth >= 807
                          ? DeviceWidth * 0.05
                          : DeviceWidth * 0.05,

                      paddingRight: 5,
                    }}>
                    <Image
                      source={
                        coins['Monday'] < 0
                          ? require('../../Icon/Images/NewHome/f2.png')
                          : coins['Monday'] == null
                          ? sameDay
                            ? require('../../Icon/Images/NewHome/f3.png')
                            : require('../../Icon/Images/NewHome/f4.png')
                          : require('../../Icon/Images/NewHome/f1.png')
                      }
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.15
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.12
                            : DeviceWidth * 0.1,
                        height: 5,
                        backgroundColor:
                          coins['Tuesday'] < 0
                            ? 'green'
                            : coins['Tuesday'] == null
                            ? '#EBEDF0'
                            : 'green',
                      }}></View>
                    <Image
                      source={
                        coins['Tuesday'] < 0
                          ? require('../../Icon/Images/NewHome/f2.png')
                          : coins['Tuesday'] == null
                          ? sameDay
                            ? require('../../Icon/Images/NewHome/f3.png')
                            : require('../../Icon/Images/NewHome/f4.png')
                          : require('../../Icon/Images/NewHome/f1.png')
                      }
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.16
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.12
                            : DeviceWidth * 0.12,
                        height: 5,
                        backgroundColor:
                          coins['Wednesday'] < 0
                            ? 'green'
                            : coins['Wednesday'] == null
                            ? '#EBEDF0'
                            : 'green',
                      }}></View>
                    <Image
                      source={
                        coins['Wednesday'] < 0
                          ? require('../../Icon/Images/NewHome/f2.png')
                          : coins['Wednesday'] == null
                          ? sameDay
                            ? require('../../Icon/Images/NewHome/f3.png')
                            : require('../../Icon/Images/NewHome/f4.png')
                          : require('../../Icon/Images/NewHome/f1.png')
                      }
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.15
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.12
                            : DeviceWidth * 0.1,
                        height: 5,
                        backgroundColor:
                          coins['Thursday'] < 0
                            ? 'green'
                            : coins['Thursday'] == null
                            ? '#EBEDF0'
                            : 'green',
                      }}></View>
                    <Image
                      source={
                        coins['Thursday'] < 0
                          ? require('../../Icon/Images/NewHome/f2.png')
                          : coins['Thursday'] == null
                          ? sameDay
                            ? require('../../Icon/Images/NewHome/f3.png')
                            : require('../../Icon/Images/NewHome/f4.png')
                          : require('../../Icon/Images/NewHome/f1.png')
                      }
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.155
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.12
                            : DeviceWidth * 0.1,
                        height: 5,
                        backgroundColor:
                          coins['Friday'] < 0
                            ? 'green'
                            : coins['Friday'] == null
                            ? '#EBEDF0'
                            : 'green',
                      }}></View>
                    <Image
                      source={
                        coins['Friday'] < 0
                          ? require('../../Icon/Images/NewHome/f2.png')
                          : coins['Friday'] == null
                          ? sameDay
                            ? require('../../Icon/Images/NewHome/f3.png')
                            : require('../../Icon/Images/NewHome/f4.png')
                          : require('../../Icon/Images/NewHome/f1.png')
                      }
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 0,
                      width: '100%',
                      height: 10,
                      alignItems: 'center',
                      paddingLeft:
                        DeviceHeigth >= 1024
                          ? DeviceWidth * 0.07
                          : DeviceHeigth >= 807
                          ? DeviceWidth * 0.03
                          : DeviceWidth * 0.03,

                      paddingRight: 5,
                    }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        marginLeft: 20,
                        borderRadius: 8,
                        backgroundColor:
                          sameDay == 'Monday' ? 'black' : 'white',
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.15
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.12
                            : DeviceWidth * 0.1,
                        height: 5,
                      }}
                    />

                    <View
                      style={{
                        width: 8,
                        height: 8,
                        marginLeft: 20,
                        borderRadius: 8,
                        backgroundColor:
                          sameDay == 'Tuesday' ? 'black' : 'white',
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.16
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.12
                            : DeviceWidth * 0.12,
                        height: 5,
                      }}
                    />

                    <View
                      style={{
                        width: 8,
                        height: 8,
                        marginLeft: 20,
                        borderRadius: 8,
                        backgroundColor:
                          sameDay == 'Wednesday' ? 'black' : 'white',
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.15
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.11
                            : DeviceWidth * 0.1,
                        height: 5,
                      }}
                    />

                    <View
                      style={{
                        width: 8,
                        height: 8,
                        marginLeft: 20,
                        borderRadius: 8,
                        backgroundColor:
                          sameDay == 'Thursday' ? 'black' : 'white',
                      }}
                    />
                    <View
                      style={{
                        width:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.155
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.11
                            : DeviceWidth * 0.1,
                        height: 5,
                      }}
                    />

                    <View
                      style={{
                        width: 8,
                        height: 8,
                        marginLeft: 20,
                        borderRadius: 8,
                        right:DeviceHeigth>=1024?-DeviceWidth*0.0:-DeviceWidth*0.04,
                        backgroundColor:
                          sameDay == 'Friday' ? 'black' : 'white',
                      }}
                    />
                  </View>
                </>
              ) : (
                <></>
              );
            })}

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginVertical: 0,
                paddingBottom: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '68%',
                  padding: 5,
                  marginVertical: 5,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    color: AppColor.SecondaryTextColor,
                    lineHeight: 20,
                    fontWeight: '500',
                  }}>
                  Kickstart your workout challenge and {'\n'}win ₹1,000/-
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  // navigation?.navigate('NewSubscription', {upgrade: true});
                  navigation.navigate('BottomTab', {screen: 'MyPlans'});
                }}
                style={{
                  // height: 38,
                  padding: 10,
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: AppColor.WHITE,
                    lineHeight: 18,
                    fontWeight: '500',
                  }}>
                  Start New
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,

    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
    alignSelf: 'center',
  },
  box: {
    width: DeviceWidth * 0.95,

    alignSelf: 'center',
    alignItems: 'center',
  },
});
export default MyChallenge;
