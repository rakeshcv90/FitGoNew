import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';

import PercentageBar from '../PercentageBar';
const WorkoutChallengeZone = ({day, currentChallenge}) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: '100%',
            height: '80%',
            backgroundColor: AppColor.WHITE,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '85%',
              height: '100%',
              backgroundColor: AppColor.WHITE,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#D9D9D9',
                alignItems: 'center',
                justifyContent: 'center',

                marginVertical: 10,
              }}>
              <Image
                //  source={{uri: currentChallenge[0]?.workout_image}}
                source={require('../../Icon/Images/NewImage2/back.png')}
                style={{
                  width: 70,
                  height: 75,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 14,
                  fontWeight: '700',
                  lineHeight: 18,
                  marginVertical: DeviceHeigth * 0.025,
                  marginHorizontal: 5,
                  marginHorizontal: 15,
                  color: AppColor.HEADERTEXTCOLOR,
                }}>
                {/* {currentChallenge[0]?.title} */}
                Daily Pushup Challenge
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: 20,
                  marginHorizontal: 5,
                  top: -10,
                  marginHorizontal: 15,
                  color: AppColor.SecondaryTextColor,
                }}>
                {/* {currentChallenge[0]?.sub_title} */}
                6/14 Days
              </Text>

              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 12,
                  fontWeight: '400',
                  lineHeight: 15,
                  marginHorizontal: 15,
                  color: AppColor.PrimaryTextColor,
                }}>
                {/* {`${day}/${currentChallenge[0]?.total_days} Days`} */}
                You have to do 30 Push
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '15%',
              height: '100%',
            }}>
            <View
              style={{
                width: '100%',
                height: 90,

                borderColor: '#D9D9D9',
                alignItems: 'center',
                justifyContent: 'center',

                marginVertical: 10,
              }}>
              <Image
                //  source={{uri: currentChallenge[0]?.workout_image}}
                source={require('../../Icon/Images/NewHome/Play.png')}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: '20%',
            backgroundColor: AppColor.WHITE,
          }}>
          <PercentageBar
            height={30}
            percentage={60}
            // percentage={(
            //   (day / currentChallenge[0]?.total_days) *
            //   100
            // ).toFixed(0)}
          />
        </View>
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.2,
    backgroundColor: AppColor.WHITE,
    marginVertical: 10,
  },
  box: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
  },
});
export default WorkoutChallengeZone;
