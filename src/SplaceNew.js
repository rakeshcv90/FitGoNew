import {View, Text, StyleSheet,Image} from 'react-native';
import React from 'react';
import {localImage} from './Component/Image';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth, DeviceWidth} from './Component/Config';
import {CircularProgressWithChild} from 'react-native-circular-progress-indicator';
import {AppColor} from './Component/Color';
import LinearGradient from 'react-native-linear-gradient';

// import SemiCircleProgressBar from "react-progressbar-semicircle";

const SplaceNew = () => {
  return (
    <View style={styels.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#ec119a', 'transparent', 'transparent']}
        style={{
          width: '100%',

          height: '100%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: '100%',
            height: '40%',

            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 150,
          }}>
        {/* <Image
              source={localImage.SplashText}
              style={styels.Textlogo}
              resizeMode="contain"
            /> */}
            <AnimatedLottieView
            source={localImage.Splace3}
            speed={1}
            autoPlay
            loop
            resizeMode="cover"
            style={{
              width: '100%',
              height: DeviceHeigth * 0.45,
              height: DeviceHeigth * 0.4,
              position: 'absolute',
              bottom: 0, // Adjust this value based on the height of the second animation
            }}
          />
        </View>
        <View
          style={{width: '100%', height: '60%', zIndex: 1, overflow: 'hidden'}}>
          <AnimatedLottieView
            source={localImage.Splace1}
            speed={1}
            autoPlay
            loop
            resizeMode="cover"
            style={{
              width: '100%',
              height: DeviceHeigth * 0.45,
              height: DeviceHeigth * 0.4,
              position: 'absolute',
              bottom: 0, // Adjust this value based on the height of the second animation
            }}
          />
          <AnimatedLottieView
            source={localImage.Splace2}
            speed={1}
            autoPlay
            loop
            resizeMode="contain"
            style={{
              width: DeviceWidth,
              height: DeviceHeigth * 0.45,
              position: 'absolute',
              bottom: 0,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
  },
  Textlogo: {
    width: DeviceWidth * 0.6,
  },
});
export default SplaceNew;
