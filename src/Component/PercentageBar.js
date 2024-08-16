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
            borderRadius: 15,

            backgroundColor: '#E7E7E7B2',
          }}
        />

        <LinearGradient
          colors={['#f0013b', '#f0013b']}
          style={{
            width: percentage > 10 ? `${percentage}%` : '10%',
            height: getheight,
            marginVertical: 15,
            //  borderRadius:15,
            borderBottomLeftRadius: 15,
            borderTopLeftRadius: 15,
            borderTopRightRadius: percentage >= 100 ? 15 : 0,
            borderBottomRightRadius: percentage >= 100 ? 15 : 0,
            position: 'absolute',
            bottom: 20,
          }}></LinearGradient>
        <View
          style={{
            width: percentage > 10 ? `${percentage}%` : '10%',
            height: getheight,
            // position: 'absolute',
            bottom: 35,

            // top:
            //   Platform.OS == 'ios'
            //     ? DeviceHeigth >= 1024
            //       ? -DeviceHeigth * 0.03
            //       : -DeviceHeigth * 0.033
            //     : -DeviceHeigth * 0.037,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>
            {`${percentage}%`}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default PercentageBar;
