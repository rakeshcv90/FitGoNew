import React, {useEffect, useRef, useState} from 'react';
import {Animated, Platform, View} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../../Component/Config';
import {AppColor} from '../../../Component/Color';

const ExerciseProgressBar = ({INDEX, ExerciseData, time, w, color}: any) => {
//   const progressAnimation = useRef(new Animated.Value(0)).current;
//   const progressBarWidth = progressAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', w],
//     extrapolate: 'extend',
//   });
//   useEffect(() => {
//     Animated.timing(progressAnimation, {
//       toValue: 1,
//       duration: time ? time * 1000 : 5000,
//       useNativeDriver: false,
//     }).start();
//   }, [progressAnimation]);
  return (
    <View
      style={{
        width: DeviceWidth * 0.9,
        flexDirection: 'row',
        justifyContent: 'center',
        height: Platform.OS == 'ios' ? 0 : DeviceHeigth * 0.05,
        alignSelf: 'center',
        marginTop: DeviceHeigth * 0.02,
      }}>
      {ExerciseData.map((_: any, index: number) => (
        <View
          key={index}
          style={{
            height: 4,
            marginBottom: DeviceHeigth * 0.5,
            marginHorizontal: 2, ///used as masking for the progress bar
            width: (DeviceWidth * 0.9) / ExerciseData.length,
            backgroundColor: '#D9D9D9',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <Animated.View
            style={{
              height: 4,
              width:
                index == INDEX
                  ? w
                  : (DeviceWidth * 0.9) / ExerciseData.length,
              backgroundColor: index<= INDEX ? color : '#D9D9D9',
            }}></Animated.View>
        </View>
      ))}
    </View>
  );
};

export default ExerciseProgressBar;
