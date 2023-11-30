import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';

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
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          height: DeviceHeigth *0.1,
          width: DeviceWidth  *0.2,
          backgroundColor:AppColor.INPUTLABLECOLOR,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 15,
          marginTop: 'auto',
          marginBottom: 'auto',
        }}>
        <AnimatedLottieView
          // source={{
          //   uri: 'https://assets7.lottiefiles.com/packages/lf20_qgq2nqsy.json',
          // }} // Replace with your animation file
          source={require('../Icon/Images/NewImage/activityindicater.json')}
          speed={2}
          autoPlay
          loop
          style={{width: DeviceWidth  *0.2, height: DeviceHeigth *0.1,}}
        />
      </View>
    </Modal>
  );
};

export default ActivityLoader;

const styles = StyleSheet.create({});
