import {View, Text, StyleSheet, Modal, Alert} from 'react-native';
import React, {useState} from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {Image} from 'react-native';
import {localImage} from '../Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewButton from '../NewButton';
import {setRewardModal} from '../ThemeRedux/Actions';
import { useDispatch } from 'react-redux';
const RewardModal = ({
  visible,
  imagesource,
  onCancel,
  onConfirm,
  txt1,
  txt2,
  ButtonText,
}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
        <View style={styles.View1}>
          <Icon
            name="close"
            size={25}
            color={AppColor.BLACK}
            style={{
              margin: 16,
              position: 'absolute',
              right: 0,
              zIndex: 1,
              overflow: 'hidden',
            }}
            onPress={onCancel}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // marginVertical: ,
              top: 20,
            }}>
            <Image
              source={imagesource}
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
              <Text style={{color: '#f0013b', fontSize: 20, lineHeight: 40}}>
                {txt1}
              </Text>
            {txt2}
            </Text>
            <NewButton
              pV={15}
              title={ButtonText}
              ButtonWidth={DeviceWidth * 0.6}
              onPress={onConfirm}
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
