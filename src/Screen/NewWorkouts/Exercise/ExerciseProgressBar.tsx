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
        width: DeviceWidth,
        flexDirection: 'row',
        // height: Platform.OS == 'ios' ? 0 : DeviceHeigth * 0.05,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
      }}>
      {ExerciseData.map((_: any, index: number) => (
        <View
          key={index}
          style={{
            height: 4,
            overflow: 'hidden',
          }}>
          <Animated.View
            style={{
              height: 4,
              width: index == INDEX ? w : DeviceWidth / ExerciseData.length,
              backgroundColor: index <= INDEX ? color : AppColor.WHITE,
            }}></Animated.View>
        </View>
      ))}
    </View>
  );
};

export default ExerciseProgressBar;
