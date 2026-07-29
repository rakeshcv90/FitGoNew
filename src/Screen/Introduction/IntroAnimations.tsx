import React, {useEffect} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {AppColor} from '../../Component/Color';

export const FadeSlideIn = ({
  delay = 0,
  distance = 24,
  duration = 500,
  style,
  children,
}: {
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(distance);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, {duration}));
    translateY.value = withDelay(
      delay,
      withTiming(0, {duration, easing: Easing.out(Easing.cubic)}),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

export const FloatingImage = ({
  source,
  style,
}: {
  source: any;
  style?: StyleProp<ViewStyle>;
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const float = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 550});
    scale.value = withSpring(1, {damping: 9, stiffness: 90});
    float.value = withDelay(
      650,
      withRepeat(
        withSequence(
          withTiming(-8, {duration: 1400, easing: Easing.inOut(Easing.ease)}),
          withTiming(0, {duration: 1400, easing: Easing.inOut(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}, {translateY: float.value}],
  }));

  return <Animated.Image source={source} resizeMode="contain" style={[style, animatedStyle]} />;
};

export const IntroGlow = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(
      0.6,
      {duration: 600},
      () => {
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.75, {duration: 1600, easing: Easing.inOut(Easing.ease)}),
            withTiming(0.45, {duration: 1600, easing: Easing.inOut(Easing.ease)}),
          ),
          -1,
          true,
        );
      },
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, {duration: 1600, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.92, {duration: 1600, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[styles.glow, animatedStyle]} pointerEvents="none" />
  );
};

export const PulsingButtonWrapper = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1.08, {duration: 700, easing: Easing.inOut(Easing.ease)}),
          withTiming(1, {duration: 700, easing: Easing.inOut(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: AppColor.LIGHTPINK,
  },
});
