import {View, Text, StyleSheet, Modal} from 'react-native';
import React from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {Image} from 'react-native';
import {localImage} from '../Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewButton from '../NewButton';
const RewardModal = () => {
  return (
    <View style={styles.Container}>
      <Modal transparent>
        <View style={styles.View1}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Image
              source={localImage.Modal_img}
              style={styles.img1}
              resizeMode="stretch"
            />
            <Image
              source={localImage.ModalCoin}
              style={[styles.img2]}
              resizeMode="contain"
            />
            <Icon
              name="close"
              size={30}
              color={AppColor.BLACK}
              style={{margin: 16}}
            />
          </View>
          <View style={{marginVertical: 30}}>
            <Text style={styles.txt1}>
              Join the Workout Event and{' '}
              <Text style={{color: AppColor.RED}}>{'\nEarn money!'}</Text>
            </Text>
            <NewButton
              pV={15}
              title={'Get Earn'}
              ButtonWidth={DeviceWidth * 0.6}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'red',
  },
  //view
  View1: {
    backgroundColor: AppColor.WHITE,
    // height: 300,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 4,
  },
  //img
  img1: {
    height: 100,
    width: 100,
  },
  img2: {
    height: DeviceHeigth * 0.2,
    width: DeviceWidth * 0.45,
    right: DeviceWidth * 0.04,
  },
  //texts
  txt1: {
    color: AppColor.BLACK,
    fontSize: 22,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginBottom: 20,
  },
});
export default RewardModal;
