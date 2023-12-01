import {View, Text} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';

const Calories = ({backgroundColor}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: backgroundColor,
          width: DeviceWidth * 0.4,
          height: DeviceHeigth * 0.18,
          marginVertical: DeviceHeigth * 0.03,

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
          borderRadius: 25,
          //overflow: PLATFORM_IOS ? 'visible' : 'hidden',
        }}>
      
      </View>
    </>
  );
};

export default Calories;
