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
import {AnalyticsConsole} from '../AnalyticsConsole';
import {useNavigation} from '@react-navigation/native';
import FitText from '../Utilities/FitText';
import FitIcon from '../Utilities/FitIcon';
import CircleProgress from '../Utilities/ProgressCircle';

const WorkoutChallengeZone = ({day, currentChallenge}) => {
  const navigation = useNavigation();
  const progress = ((day / currentChallenge[0]?.total_days) * 100).toFixed(0);
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: '100%',

            backgroundColor: AppColor.WHITE,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '85%',

              backgroundColor: AppColor.WHITE,
              flexDirection: 'row',
              alignItems: 'center',
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
                source={{uri: currentChallenge[0]?.workout_image}}
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: 10,
                  overflow: 'hidden',
                  zIndex: -1,
                }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 15,
                  fontWeight: '700',
                  lineHeight: 25,
                  // marginVertical: DeviceHeigth * 0.025,
                  marginHorizontal: 5,
                  marginHorizontal: 15,
                  color: AppColor.HEADERTEXTCOLOR,
                }}>
                {currentChallenge[0]?.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 20,
                  // top: -10,
                  marginHorizontal: 15,
                  color: AppColor.SecondaryTextColor,
                }}>
                {currentChallenge[0]?.sub_title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    fontSize: 12,
                    fontWeight: '400',
                    lineHeight: 15,
                    marginHorizontal: 15,
                    color: AppColor.PrimaryTextColor,
                  }}>
                  {`${day}/${currentChallenge[0]?.total_days} Days`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    AnalyticsConsole(`D_Wrk_DAYS_FR_Home`);
                    navigation.navigate('WorkoutDays', {
                      data: currentChallenge[0],
                      challenge: true,
                    });
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <FitText
                    type="normal"
                    value="START NOW"
                    color={AppColor.RED}
                    lineHeight={25}
                    fontWeight="600"
                    marginTop={2}
                  />
                  <FitIcon
                    name="right"
                    size={16}
                    type="AntDesign"
                    color={AppColor.RED}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '15%',
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
              <CircleProgress
                progress={100 - progress}
                strokeWidth={7}
                secondayCircleColor={AppColor.GRAY2}
                radius={25}>
                <FitText type="SubHeading" value={progress + '%'} errorType />
              </CircleProgress>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    // height: DeviceHeigth * 0.2,
    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
  },
  box: {
    width: DeviceWidth * 0.95,
    // height: DeviceHeigth * 0.2,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
export default WorkoutChallengeZone;
