import {IntroductionData} from './IntroductionScreenData';
import React, {useEffect, useRef, useState} from 'react';
import { Animated,Platform,View } from 'react-native';
import { DeviceWidth,DeviceHeigth } from '../../Component/Config';
import { AppColor } from '../../Component/Color';
const IntroProgressBar=({INDEX})=>{
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressBarWidth = progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'extend',
    });
    useEffect(() => {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }, [progressAnimation]);
    return(
        <View
        style={{
          width: DeviceWidth * 0.1,
          flexDirection: 'row',
          justifyContent: 'center',
          flexDirection: 'row',
          height:Platform.OS=='ios'? 0: DeviceHeigth*0.09,
        }}>
        {IntroductionData.map((value, index) => (
          <View
            key={index}
            style={{
              height: 3,
              marginBottom: DeviceHeigth*0.5,
              marginHorizontal: 2, ///used as masking for the progress bar
              width: index == INDEX ? 40 : 20,
              backgroundColor: AppColor.WHITE,
            }}>
            <Animated.View
              style={{
                height: 3,
                width: index == INDEX? progressBarWidth : 20,
                backgroundColor:
                  index == INDEX ? AppColor.RED : AppColor.WHITE,
              }}></Animated.View>
          </View>
        ))}
      </View>
    )
}
export default IntroProgressBar;