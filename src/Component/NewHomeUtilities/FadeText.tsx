import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {DeviceHeigth} from '../Config';
import {AppColor, Fonts} from '../Color';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const FadeText = ({navigation}: any) => {
  const messages = ['How to join!', 'FAQ'];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnimation();
  }, []);
  const fadeAnimation = () => {
    fadeAnim.value = withTiming(1, {duration: 2000}, () => {
      runOnJS(changeValue)();
    });
  };
  const changeValue = () => {
    fadeAnim.value = withTiming(0, {duration: 2000}, () => {
      runOnJS(fadeAnimation)();
      runOnJS(change)();
    });
  };
  const change = () => setCurrentMessageIndex(prev => (prev == 0 ? 1 : 0));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const handleClick = () => {
    if (messages[currentMessageIndex] == 'How to join!') {
      navigation.navigate('IntroVideo', {type: 'home'});
    } else {
      navigation.navigate('Questions', {screenName: 'Home'});
    }
  };
  return (
    <View
      style={{
        width: '100%',
        height: '16%',
      }}>
      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          overflow: 'hidden',

          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
        source={require('../../Icon/Images/NewHome/background.png')}
        resizeMode="cover">
        <View
          style={{
            width: '100%',
            height: '100%',
            padding: 5,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClick}
            style={{
              width: '85%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: DeviceHeigth * 0.05,
            }}>
            <Animated.Text style={[styles.text, animatedStyle]}>
              {messages[currentMessageIndex]}
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClick}
            style={{
              width: '15%',
              height: '100%',
            }}>
            <Image
              source={require('../../Icon/Images/NewHome/nextarrow.png')}
              resizeMode="contain"
              style={{
                width: '85%',
                height: '100%',
              }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default FadeText;

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: AppColor.WHITE,
  },
});
