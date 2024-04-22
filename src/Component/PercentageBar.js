import React, {useState} from 'react';

import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import {DeviceHeigth} from './Config';
import LinearGradient from 'react-native-linear-gradient';

const PercentageBar = ({
  navigation,
  percentage,
  height,
  backgroundColor,
  completedColor,
}) => {
  const [getPercentage, setPercentage] = useState(percentage);
  const [getheight, setHeight] = useState(height);
  const [getBackgroundColor, setBackgroundColor] = useState(backgroundColor);
  const [getCompletedColor, setCompletedColor] = useState(completedColor);
  return (
    <View>
      <View style={{justifyContent: 'center'}}>
        <View
          style={{
            width: DeviceHeigth >= 1024 ? '95%' : '90%',
            height: getheight,
            marginVertical: 10,
            borderRadius: 50,

            backgroundColor: '#E7E7E7B2',
          }}
        />

        <LinearGradient
          colors={['#D01818', '#941000']}
          style={{
            width: getPercentage ? getPercentage : 0,
            height: getheight,
            marginVertical: 10,
            borderRadius: 50,
            position: 'absolute',
            bottom: 20,
          }}></LinearGradient>
        <View
          style={{
            width: getPercentage ? getPercentage : 0,
            height: getheight,
            bottom: 10,
            top:
              Platform.OS == 'ios'
                ? -DeviceHeigth * 0.032
                : -DeviceHeigth * 0.035,
          }}>
          <Text style={{textAlign: 'right', color: 'white'}}>
            {getPercentage}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default PercentageBar;
