import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {StyleSheet} from 'react-native';
import {AppColor} from './Color';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from './Image';

const Button2 = ({buttonText, onFBPress, onGooglePress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={onFBPress}>
        <Image
          source={localImage.FACEBOOK}
          style={{width: DeviceWidth * 0.4, height: DeviceHeigth * 0.035}}
          resizeMode="contain"
 
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
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
    width: DeviceWidth * 0.45,
    height: DeviceHeigth * 0.07,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    margin: 10,
    color: AppColor.WHITE,
    fontWeight: '700',
    backgroundColor: 'transparent',
    lineHeight: 24,
  },
});

export default Button2;
