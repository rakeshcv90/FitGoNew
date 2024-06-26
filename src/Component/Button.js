import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {StyleSheet} from 'react-native';
import {AppColor} from './Color';
import LinearGradient from 'react-native-linear-gradient';

const Button = ({buttonText, onPresh}) => {
  return (
    <View activeOpacity={0.5} onPress={onPresh}>
      <View
        // colors={['#941000', '#D01818']}

        style={styles.buttonStyle}>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={onPresh}>
          <Text style={styles.button}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#f0013b',
    width: DeviceWidth * 0.8,
    height: DeviceHeigth * 0.07,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // marginTop: DeviceHeigth * 0.065,
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

export default Button;
