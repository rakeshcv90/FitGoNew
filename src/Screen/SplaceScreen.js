import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const SplaceScreen = ({navigation}) => {
  const {showIntro} = useSelector(state => state);
  useEffect(() => {
    setTimeout(() => {
      if (showIntro) {
        navigation.navigate('PredictionScreen');
      } else {
        navigation.navigate('IntroductionScreen1');
      }
    }, 4000);
  }, []);

  return (
    <LinearGradient
      style={styels.container}
      start={{x: 0, y: 0}}
      end={{x: 0.5, y: 0.5}}
      colors={['#D01818', '#941000']}
       >
        <StatusBar backgroundColor={'transparent'} translucent/>
      <Image
        source={localImage.SplashText}
        style={styels.Textlogo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.4,
  },

});
export default SplaceScreen;

