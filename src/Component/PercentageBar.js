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
            width: '100%',
            height: getheight,
            marginVertical: 10,
            borderRadius: 50,
            borderColor: getBackgroundColor,
            borderWidth: 1,
          }}
        />
        {/* <View
          style={{
            width: getPercentage ? getPercentage : 0,
            height: getheight,
            marginVertical: 10,
            borderRadius: 50,
            backgroundColor:{['rgba(255, 95, 109, 1)', 'rgba(255, 195, 113, 1)']},
            position: 'absolute',
            bottom:20
          }}
        /> */}
        <LinearGradient
          colors={['rgba(255, 95, 109, 1)', 'rgba(255, 195, 113, 1)']}
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
