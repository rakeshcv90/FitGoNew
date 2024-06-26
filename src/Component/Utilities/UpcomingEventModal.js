import {View, Text, Modal, StyleSheet, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {localImage} from '../Image';
import NewButton from '../NewButton';

const UpcomingEventModal = ({visible, onCancel, onConfirm}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
        <View style={styles.View1}>
          <Icon
            name="close"
            size={25}
            color={AppColor.WHITE}
            style={{
              margin: 16,
              position: 'absolute',
              right: 0,
              zIndex: 1,
              overflow: 'hidden',
            }}
            onPress={onCancel}
          />
          <Image
            source={localImage.cornerCircle}
            style={{height: 60, width: 60}}
          />
          <View style={{alignSelf: 'center', top: -25}}>
            <Image
              source={localImage.earnText}
              style={{height: DeviceHeigth * 0.09, width: DeviceWidth * 0.7}}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              top: -25,
            }}>
            <Image
              source={localImage.CoinsL}
              style={{height: 65, width: 65, left: 20, top: -4}}
              resizeMode="contain"
            />
            <Text
              style={{
                color: AppColor.WHITE,
                fontFamily: Fonts.MONTSERRAT_BOLD,
                fontSize: 20,
                textAlign: 'center',
                width: DeviceWidth * 0.65,
              }}>
              Join the challenge today and earn reward
            </Text>
            <Image
              source={localImage.CoinsR}
              style={{height: 65, width: 65, right: 20, top: -4}}
              resizeMode="contain"
            />
          </View>
          <View style={{top: -15}}>
            <NewButton
              buttonColor={AppColor.WHITE}
              titleColor={'#FF005C'}
              title={'EARN NOW'}
              mV={8}
              pH={10}
              ButtonWidth={DeviceWidth * 0.4}
              elevation={{
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: {width: 5, height: 5},
                    shadowOpacity: 1,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 5,
                  },
                }),
              }}
              onPress={onConfirm}
            />
          </View>
          <Image
            source={localImage.MadamG}
            style={{
              height: DeviceHeigth * 0.35,
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'flex-end',
            }}
            resizeMode="contain"
          />
          <Image
            source={localImage.bottomCircle}
            style={{
              height: 60,
              width: 60,
              alignSelf: 'flex-end',
              position: 'absolute',
              bottom: 0,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  View1: {
    backgroundColor: '#FF005C',
    // height: 300,
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 8,
    overflow: 'hidden',
    position: 'absolute',
  },
});
export default UpcomingEventModal;
