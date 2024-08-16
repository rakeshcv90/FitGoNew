import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {Image} from 'react-native';
import {localImage} from '../Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewButton from '../NewButton';
import {setRewardModal} from '../ThemeRedux/Actions';
import {useDispatch} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {useNavigation} from '@react-navigation/native';
const RewardModal = ({
  visible,
  imagesource,
  onCancel,
  onConfirm,
  txt1,
  txt2,
  ButtonText,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <Modal transparent visible={visible} animationType="slide">
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
              width: DeviceWidth * 0.80,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: AppColor.PrimaryTextColor,
                fontSize: 20,
                fontFamily: Fonts.HELVETICA_BOLD,
                lineHeight: 25,
              }}>
              {txt1}
            </Text>

            <Text
              style={[
                styles.txt1,
                {
                  fontSize: 14,
                  lineHeight: 24,
                  textAlign: 'center',
                  color: AppColor.SecondaryTextColor,
                  fontFamily: Fonts.HELVETICA_REGULAR,
                },
              ]}>
              {txt2}
            </Text>
            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() => {
                AnalyticsConsole('CHS_OPEN');
                dispatch(setRewardModal(false));
                navigation.navigate('BottomTab', {
                  screen: 'MyPlans',
                });
              }}
              style={{
                width: 250,
                height: 50,
                backgroundColor: 'red',
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 13,
                  lineHeight: 16,
                  color: AppColor.WHITE,
                  marginHorizontal: 10,
                }}>
                StartNow
              </Text>
              <AntDesign name={'arrowright'} size={15} color={AppColor.WHITE} />
            </TouchableOpacity>
            {/* <NewButton
              pV={15}
              title={ButtonText}
              ButtonWidth={DeviceWidth * 0.6}
              onPress={onConfirm}
            /> */}
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
