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

const SplaceScreen = ({navigation}) => {
  const {showIntro} = useSelector(state => state);
  //fade In

  useEffect(() => {
    fadeInFirstText();
    setTimeout(() => {
      fadeInSecondText();
    }, 1000);
    setTimeout(() => {
      if (showIntro) {
        navigation.navigate('Yourself');
        //  navigation.navigate('Login');
      } else {
        navigation.navigate('IntroductionScreen');
      }
    }, 2000);
  }, []);
  // const UserAuth = async () => {
  //   try {
  //     const userData = await AsyncStorage.getItem('Data')
  //     const data = (JSON.parse(userData))
  //     if (!!data) {
  //       navigation.navigate('DrawerNavigation')
  //     } else {
  //       navigation.navigate('Login')
  //     }
  //   } catch (error) {
  //     console.log("error", error)
  //     navigation.navigate('Login')
  //   }
  // }
  const fadeAnim1 = useRef(new Animated.Value(0)).current; //first text ref
  const fadeAnim2 = useRef(new Animated.Value(0)).current; //second text ref
  const fadeInFirstText = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim1, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };
  const fadeInSecondText = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim2, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View style={styels.container}>
      <StatusBar
        translucent
        barStyle={'default'}
        backgroundColor={'transparent'}
      />
      <ImageBackground source={localImage.splash} style={styels.logo}>
        <View style={styels.LinearG}>
          <View style={styels.AnimatedView}>
            <Animated.Text
              style={[
                styels.fadingText,
                {fontWeight: '500', opacity: fadeAnim1},
              ]}>
              Weight Loss
            </Animated.Text>
            <Animated.Text
              style={[
                styels.fadingText,
                {fontWeight: '600', opacity: fadeAnim2, fontFamily: 'arial'},
              ]}>
              Home Workouts
            </Animated.Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: DeviceWidth,
    height: DeviceHeigth,
    resizeMode: 'stretch',
  },
  LinearG: {
    height: DeviceHeigth,
    width: DeviceWidth,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  fadingText: {
    fontSize: 38,
    color: '#fff',
  },
  AnimatedView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: (DeviceHeigth * 25) / 100,
  },
});
export default SplaceScreen;
