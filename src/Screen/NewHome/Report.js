import {View, Platform, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import {Switch} from 'react-native-switch';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import KeepAwake from 'react-native-keep-awake';
import Reminder from '../../Component/Reminder';
import {useDispatch, useSelector} from 'react-redux';


import notifee from '@notifee/react-native';

import {
  setScreenAwake,
  setSoundOnOff,
} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';

const Report = ({navigation}) => {
  const {getScreenAwake, getSoundOffOn} = useSelector(state => state);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);



  const [isAlarmEnabled, setAlarmIsEnabled] = useState(false);

  const toggleSwitch3 = () => {
    !isAlarmEnabled && setVisible(true);
    setAlarmIsEnabled(previousState => !previousState);
  };
  useEffect(() => {

    checkAlarm();

    if (getScreenAwake == true) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }, [getScreenAwake]);

  const checkAlarm = async () => {
    const trigger = await notifee.getTriggerNotifications();

    trigger.length != 0 && setAlarmIsEnabled(true);
  };

  return (
    <View style={styles.container}>
      <NewHeader header={'Settings'} SearchButton={false} backButton={true} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={styles.listItem2}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Subscription');
          }}
          activeOpacity={0.5}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
            alignItems: 'center',
          }}>
          <Text style={styles.textStyle}>Subscription</Text>
          <Icons
            name={'chevron-right'}
            size={25}
            color={AppColor.INPUTTEXTCOLOR}
          />
        </TouchableOpacity>
   
      </View>
      <Text
        style={[styles.textStyle, {marginHorizontal: 15, marginVertical: 20,fontWeight:'700'}]}>
        Timer Setting
      </Text>
      <View style={styles.listItem2}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
            alignItems: 'center',
          }}>
          <Text style={styles.textStyle}>Sound</Text>
          <Switch
            onValueChange={text => {
              if (text ==true) {
                showMessage({
                  message: 'Sound Is Unmute',
                  type: 'success',
                  animationDuration: 500,
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
              } else {
                showMessage({
                  message: 'Sound Is Mute',
                  animationDuration: 500,
                  type: 'danger',
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
              }

              dispatch(setSoundOnOff(text));
            }}
            value={getSoundOffOn}
            disabled={false}
            circleSize={19}
            barHeight={21}
            circleBorderWidth={0.1}
            backgroundActive={'#FFE3E3'}
            backgroundInactive={AppColor.GRAY2}
            circleActiveColor={AppColor.RED}
            circleInActiveColor={AppColor.WHITE}
            changeValueImmediately={true}
            outerCircleStyle={{color: AppColor.RED}}
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2.2}
            switchBorderRadius={30}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 0.2,
            backgroundColor:AppColor.BLACK,
            marginVertical: 10,
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.textStyle}>Screen Always On</Text>
          <Switch
            onValueChange={test => {

              if (test == true) {
                showMessage({
                  message: 'Alway On Screen Is On ',
                  type: 'success',
                  animationDuration: 500,
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
                dispatch(setScreenAwake(test));
              } else {
                showMessage({
                  message: 'Alway On Screen Is Off ',
                  animationDuration: 500,
                  type: 'danger',
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
                dispatch(setScreenAwake(test));
              }

         
            }}
            value={getScreenAwake}
            disabled={false}
            circleSize={19}
            barHeight={21}
            circleBorderWidth={0.1}
            backgroundActive={'#FFE3E3'}
            backgroundInactive={AppColor.GRAY2}
            circleActiveColor={AppColor.RED}
            circleInActiveColor={AppColor.WHITE}
            changeValueImmediately={true}
            outerCircleStyle={{color: AppColor.RED}}
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2.2}
            switchBorderRadius={30}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor:AppColor.BLACK,
            marginVertical: 10,
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.textStyle}>Schedule Alarm</Text>
          <Switch
            onValueChange={toggleSwitch3}
            value={isAlarmEnabled}
            disabled={false}
            circleSize={19}
            barHeight={21}
            circleBorderWidth={0.1}
            backgroundActive={'#FFE3E3'}
            backgroundInactive={AppColor.GRAY2}
            circleActiveColor={AppColor.RED}
            circleInActiveColor={AppColor.WHITE}
            changeValueImmediately={true}
            outerCircleStyle={{color: AppColor.RED}}
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2.2}
            switchBorderRadius={30}
          />
        </View>
      </View>
      <Reminder
        visible={visible}
        setVisible={setVisible}
        setAlarmIsEnabled={setAlarmIsEnabled}
      />
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },

  listItem2: {
    marginHorizontal: 15,

    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: AppColor.WHITE,
    padding: 15,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  textStyle: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 18,
    color: AppColor.BLACK,
  },
});
export default Report;
