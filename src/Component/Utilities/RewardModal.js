import {View, Text, StyleSheet, Modal, Alert} from 'react-native';
import React, {useState} from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {Image} from 'react-native';
import {localImage} from '../Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BlurView} from '@react-native-community/blur';
import NewButton from '../NewButton';
import {
  openSettings,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {useSelector, useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';

import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
import ActivityLoader from '../ActivityLoader';
import { setRewardModal } from '../ThemeRedux/Actions';
const RewardModal = ({visible, navigation}) => {
  const dispatch = useDispatch();

  return (
    <Modal transparent visible={visible}>
      <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
        <View style={styles.View1}>
          <Icon
            name="close"
            size={25}
            color={AppColor.BLACK}
            style={{margin: 16, position: 'absolute', right: 0,zIndex:1,overflow:'hidden'}}
            onPress={() => {
             dispatch(setRewardModal(false))
            
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // marginVertical: ,
              top:20
            }}>
            <Image
              source={localImage.Reward_icon}
              style={[styles.img2]}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              marginVertical: 30,
              width: DeviceWidth * 0.85,
              alignSelf: 'center',
            }}>
            <Text style={[styles.txt1, {fontSize: 15, lineHeight: 20}]}>
              <Text style={{color: AppColor.RED, fontSize: 20, lineHeight: 40}}>
                {'Challenge On!\n'}
              </Text>
              Your fitness challenge has started! Begin now to collect FitCoins and win cash rewards!
            </Text>
            <NewButton
              pV={15}
              title={'Start Now'}
              ButtonWidth={DeviceWidth * 0.6}
              onPress={() => {
                dispatch(setRewardModal(false))
                navigation.navigate('BottomTab', {
              screen: 'MyPlans',
            });
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  //view
  View1: {
    backgroundColor: AppColor.WHITE,
    // height: 300,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 4,
    overflow: 'hidden',
    position: 'absolute',
  },
  //img
  img1: {
    height: 100,
    width: 100,
    overflow: 'hidden',
  },
  img2: {
    height: DeviceHeigth * 0.2,
    width: DeviceWidth * 0.45,
    // right: DeviceWidth * 0.04,
  },
  //texts
  txt1: {
    color: AppColor.BLACK,
    fontSize: 20,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
});
export default RewardModal;
