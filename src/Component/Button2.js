import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {StyleSheet} from 'react-native';
import {AppColor} from './Color';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from './Image';

const Button2 = ({buttonText, onFBPress, onGooglePress,onApplePress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {Platform.OS == 'android' ? (
        <>
          <TouchableOpacity
            style={[styles.buttonStyle, {marginLeft: DeviceWidth * 0.07}]}
            activeOpacity={0.5}
            onPress={onFBPress}>
            <Image
              source={localImage.FACEBOOK}
              style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.buttonStyle, {marginLeft: DeviceWidth * 0.07}]}
          activeOpacity={0.5}
          onPress={onApplePress}>
          <Image
            source={localImage.AppleLogo}
            style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.buttonStyle, {marginRight: DeviceWidth * 0.07}]}
        activeOpacity={0.5}
        onPress={onGooglePress}>
        <Image
          source={localImage.GOOGLE}
          style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: AppColor.SOCIALBUTTON,
    width: DeviceWidth * 0.4,
    height: DeviceHeigth * 0.07,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Button2;
