import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {AppColor} from './Color';
import {localImage} from './Image';

const Calories = ({type}) => {
  return (
    <>
      <View
        style={{
          backgroundColor:
            type == 'Calories' ? AppColor.LIGHTYELLOW : AppColor.PURPLELIGHT,
          width: DeviceWidth * 0.4,
          height: DeviceHeigth * 0.16,
          marginVertical: DeviceHeigth * 0.02,

          shadowColor: 'rgba(0, 0, 0, 1)',
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
          borderWidth: 0,
          borderRadius: 20,
          //overflow: PLATFORM_IOS ? 'visible' : 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 15,
            marginRight: 15,
            marginTop: 15,
          }}>
          <Text style={styles.text}>{type}</Text>
          <Image
            source={type == 'Calories' ? localImage.Calories : localImage.Step}
            style={styles.bellImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.text2}>{type == 'Calories' ? '250' : '00'}</Text>
        <Text style={styles.text3}>
          {type == 'Calories' ? 'Kcal' : 'Steps'}
        </Text>
        <View></View>
      </View>
    </>
  );
};
var styles = StyleSheet.create({
  bellImage: {
    width: 45,
    height: 45,
  
  },
  text: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: AppColor.BLACK,
    lineHeight: 21,
  },
  text2: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: AppColor.BLACK,
    lineHeight: 30,
    marginLeft: 15,
    marginVertical: 5,
  },
  text3: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: AppColor.DARKGRAY,
    lineHeight: 21,
    marginTop:-5,
    marginLeft: 15,
  },
 
});
export default Calories;
