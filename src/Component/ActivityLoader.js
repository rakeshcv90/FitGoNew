import {
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Portal } from 'react-native-paper';

import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth, DeviceWidth} from './Config';
import { AppColor } from './Color';

const ActivityLoader = props => {
  const [icon, showIcon] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      showIcon(!icon);
    }, 100);
  }, [icon]);
  const {visible} = props;
  
  if (!visible) return null;

  return (
    <Portal>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            elevation: 9999,
          }
        ]}>
        <View
          style={{
            height: DeviceHeigth *0.1,
            width: DeviceWidth  *0.2,
            backgroundColor:AppColor.INPUTLABLECOLOR,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 15,
          }}>
          <AnimatedLottieView
            source={require('../Icon/Images/NewImage/activityindicater.json')}
            speed={2}
            autoPlay
            loop
            style={{width: DeviceWidth  *0.2, height: DeviceHeigth *0.1}}
          />
        </View>
      </View>
    </Portal>
  );
};

export default ActivityLoader;

const styles = StyleSheet.create({});
