import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Easing,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import moment from 'moment';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import NewButton from '../../Component/NewButton';
import AnimatedNumber from 'react-native-animated-numbers';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ArrowRight} from '../../Component/Utilities/Arrows/Arrow';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
const WorkoutCard = ({cardHeader, cardType, onPress}) => {
  const streakDays = [50, -5, -5, 50, null];
  const WeekArray = Array(5)
    .fill(0)
    .map(
      (item, index) =>
        (item = moment()
          .add(index, 'days')
          .subtract(moment().isoWeekday() - 1, 'days')
          .format('dddd')),
    );
  useEffect(() => {
    scaleOffset.value = withRepeat(withTiming(1, {duration: 400}), -1, true);
  }, []);
  const scaleOffset = useSharedValue(0.7);
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleOffset.value}],
    };
  });
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{cardHeader ?? 'Exercise Completed'}</Text>
      <Text style={styles.txt1}>
        Congratulations, You have completed exercise. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit.
      </Text>
      {cardType == 'streak' && (
        <View style={styles.streakView}>
          {streakDays.map((v, i) => (
            <View style={{alignItems: 'center'}}>
              <Animated.View style={[v > 0 ? scaleAnimation : undefined]}>
                <ImageBackground
                  source={
                    v > 0
                      ? localImage.Streak
                      : v == null
                      ? localImage.greyStreak
                      : localImage.StreakBreak
                  }
                  style={styles.img2}
                  resizeMode="contain">
                  {v > 0 && (
                    <Icons name="check-bold" color={AppColor.WHITE} size={22} />
                  )}
                </ImageBackground>
              </Animated.View>
              <Text style={{color: AppColor.GRAAY6, fontFamily: 'Helvetica'}}>
                {WeekArray[i]?.substring(0, 3)}
              </Text>
            </View>
          ))}
        </View>
      )}
      {cardType == 'cardio' && (
        <View style={styles.cardioView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.FitCoin}
              style={{height: 30, width: 30, marginRight: 5}}
            />
            <Text style={styles.txt3}>20 coin</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: AppColor.GRAAY6,
                marginRight: 10,
                fontFamily: 'Helvetica-Bold',
              }}>
              Skip
            </Text>
            <NewButton
              ButtonWidth={DeviceWidth * 0.4}
              pV={10}
              title={'Start Cardio'}
              fontFamily={'Helvetica-Bold'}
              svgArrowRight
              svgArrowColor={AppColor.WHITE}
              onPress={onPress}
            />
          </View>
        </View>
      )}
      {cardType == 'breathe' && (
        <View style={styles.cardioView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.FitCoin}
              style={{height: 30, width: 30, marginRight: 5}}
            />
            <Text style={styles.txt3}>20 coin</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: AppColor.GRAAY6,
                marginRight: 10,
                fontFamily: 'Helvetica-Bold',
              }}>
              Skip
            </Text>
            <NewButton
              ButtonWidth={DeviceWidth * 0.4}
              pV={10}
              title={'Start Cardio'}
              fontFamily={'Helvetica-Bold'}
              svgArrowRight
              svgArrowColor={AppColor.WHITE}
              onPress={onPress}
            />
          </View>
        </View>
      )}
      {cardType == 'complete' && (
        <>
          <View style={styles.completeView}>
            <View style={{alignItems: 'center', width: DeviceWidth * 0.4}}>
              <Image
                source={localImage.FitCoin}
                style={{height: 45, width: 45}}
                resizeMode="contain"
              />
              <Text style={styles.txt4}>+50 Earned</Text>
            </View>
            <Image
              source={localImage.line}
              style={{height: DeviceHeigth * 0.12}}
              resizeMode="contain"
            />
            <View style={{alignItems: 'center', width: DeviceWidth * 0.4}}>
              <Image
                source={localImage.trophyIcon}
                style={{height: 50, width: 50}}
                resizeMode="contain"
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AntDesign
                  name="caretup"
                  color={AppColor.NEW_GREEN}
                  size={12}
                />
                <Text
                  style={{
                    color: AppColor.NEW_GREEN,
                    fontFamily: 'Helvetica-Bold',
                    marginLeft: 3,
                  }}>
                  169
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              backgroundColor: AppColor.GRAY,
              paddingHorizontal: 6,
              paddingVertical: 14,
              borderRadius: 8,
            }}>
            <ArrowRight />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.95,
    backgroundColor: AppColor.WHITE,
    borderRadius: 14,
    alignSelf: 'center',
    paddingBottom: DeviceHeigth * 0.03,
    paddingHorizontal: 10,
  },
  header: {
    color: AppColor.BLACK,
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  txt1: {
    color: AppColor.GRAAY6,
    textAlign: 'center',
  },
  img2: {
    height: 45,
    width: 45,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  txt2: {
    top: DeviceHeigth * 0.06,
    color: AppColor.GRAAY6,
    fontFamily: 'Helvetica',
    fontSize: 15,
    position: 'absolute',
  },
  streakView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: DeviceHeigth * 0.04,
  },
  cardioView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: DeviceHeigth * 0.04,
    bottom: -DeviceHeigth * 0.04,
  },
  txt3: {color: AppColor.YELLOW, fontFamily: 'Helvetica-Bold', fontSize: 18},
  completeView: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: DeviceHeigth * 0.01,
    alignItems: 'center',
    marginBottom: DeviceHeigth * 0.03,
  },
  txt4: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: AppColor.YELLOW,
  },
});
export default WorkoutCard;
