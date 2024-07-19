import {
  View,
  Text,
  Modal,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import {localImage} from '../Image';
import NewButton from '../NewButton';
import { useDispatch, useSelector } from 'react-redux';
import { setStreakModalVisible } from '../ThemeRedux/Actions';
const StreakModal = ({streakDays, setVisible, WeekArray, missedDay,visible}) => {
  const days = ['M', 'T', 'W', 'T', 'F'];
  const getStreakModalVisible=useSelector(state=>state?.getStreakModalVisible)
  // const streakDays=[50,-5,-5,50,50];
  console.log("visible------>,",getStreakModalVisible)
 
  const dispatch=useDispatch()
  return (
    <Modal transparent visible={getStreakModalVisible} animationType="slide">
      <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
        <View style={styles.View1}>
          <Icon
            name="close"
            size={25}
            color={AppColor.BLACK}
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              alignSelf: 'flex-end',
            }}
            onPress={() => {
              dispatch(setStreakModalVisible(false))
            }}
          />
          <Text style={styles.txt1}>{missedDay ?? +'Days '} missed</Text>
          <ImageBackground
            source={localImage.StreakImg}
            style={styles.img1}
            resizeMode="contain">
            <Text style={styles.txt2}>5 Days</Text>
          </ImageBackground>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            {Array.from({length: 5}).map((v, i) => (
              <ImageBackground
                source={
                  streakDays[WeekArray[i]] > 0
                    ? localImage.greenStreak
                    : streakDays[WeekArray[i]] == null
                    ? localImage.Streak
                    : localImage.StreakBreak
                }
                style={styles.img2}
                resizeMode="contain">
                <Text
                  style={{
                    color: AppColor.WHITE,
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  }}>
                  {days[i]}
                </Text>
              </ImageBackground>
            ))}
          </View>
          <Text
            style={[
              styles.txt1,
              {fontFamily: Fonts.MONTSERRAT_SEMIBOLD, marginVertical: 10},
            ]}>
            5 Days streak
          </Text>
          <Text style={styles.txt3}>
            Don’t miss the streak if you do not want to lose
            <Text
              style={{
                color: AppColor.RED,
                marginHorizontal: 4,
                fontFamily: Fonts.MONTSERRAT_BOLD,
              }}>
              {' -5 '}
            </Text>
            <Image
              source={localImage.FitCoin}
              style={{height: 14, width: 14}}
              resizeMode="contain"
            />
            {' of each day, do workout everyday to earn Fitcoins.'}
          </Text>
          <NewButton
            title={'Continue'}
            ButtonWidth={DeviceWidth * 0.6}
            mV={20}
            onPress={()=>   dispatch(setStreakModalVisible(false))}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  //view
  View1: {
    backgroundColor: AppColor.WHITE,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 5,
    overflow: 'hidden',
    position: 'absolute',
  },
  txt1: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: -5,
  },
  txt2: {
    color: AppColor.WHITE,
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    marginLeft: 10,
    marginTop: 8,
  },
  txt3: {
    width: DeviceWidth * 0.7,
    textAlign: 'center',
    alignSelf: 'center',
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    lineHeight: 20,
    fontSize: 14,
  },
  img1: {
    height: DeviceHeigth * 0.15,
    width: DeviceWidth * 0.42,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img2: {
    height: 35,
    width: 35,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
export default StreakModal;
