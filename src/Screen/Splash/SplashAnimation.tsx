import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { DeviceWidth } from '../../Component/Config';
import { localImage } from '../../Component/Image';

const SplashAnimation = () => {
  const circleRef = useSharedValue(1);
  const logoRef = useSharedValue(0);
  const logoLeftRef = useSharedValue(0);
  const logoOpacityRef = useSharedValue(0);
  const textWidthRef = useSharedValue(0);
  const textOpacityRef = useSharedValue(0);
  
  useEffect(() => {
    logoOpacityRef.value = withTiming(1, {duration: 800});
    circleRef.value = withTiming(0, {duration: 1000});
    logoRef.value = withTiming(
      -150,
      {easing: Easing.out(Easing.cubic), duration: 1000},
      () =>
        (logoRef.value = withSpring(
          0,
          {stiffness: 150},
          () =>
            (logoLeftRef.value = withTiming(-50, {duration: 1000}, () => {
              textWidthRef.value = withTiming(DeviceWidth, {
                duration: 2000,
              });
              textOpacityRef.value = 1;
              //  withTiming(1, {
              //   duration: 3000,
              // });
            })),
        )),
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{scale: circleRef.value}],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{translateY: logoRef.value}, {translateX: logoLeftRef.value}],
    opacity: logoOpacityRef.value,
  }));
  const textViewStyle = useAnimatedStyle(() => ({
    transform: [{translateX: textWidthRef.value}],
    // width: textWidthRef.value,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacityRef.value,
  }));

  const AnimatedImage = Animated.createAnimatedComponent(Image);
  return (
    <View style={styles.main}>
      <AnimatedImage
        source={localImage.CircleSplash}
        style={[styles.circle, circleStyle]}
        resizeMode={'contain'}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AnimatedImage
          source={localImage.LogoSplash}
          style={[styles.logo, logoStyle]}
          resizeMode={'contain'}
        />
        <Animated.View
          style={[
            styles.textView,
            textStyle,
            {
              // backgroundColor: 'white',
            },
          ]}>
          <Animated.View
            style={[
              textViewStyle,
              styles.textView,
              {
                backgroundColor: 'white',
                zIndex: 1,
              },
            ]}
          />
          <AnimatedImage
            source={localImage.SplashText}
            style={[styles.text, textStyle]}
            resizeMode={'contain'}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.6,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: DeviceWidth * 0.6,
    height: 100,
    // backgroundColor: 'red',
  },
  circle: {
    width: DeviceWidth / 2,
    height: 40,
    position: 'absolute',
  },
  logo: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  text: {
    height: 80,
    width: DeviceWidth / 4,
    zIndex: -1,
  },
  textView: {
    position: 'absolute',
    width: DeviceWidth / 4,
    left: -5,
    height: 80,
  },
});
