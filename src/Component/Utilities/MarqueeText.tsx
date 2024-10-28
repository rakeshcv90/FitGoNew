import {ScrollView, StyleSheet, Text, TextStyle, View} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';

type Props = {
  text: String;
  animDuration?: number;
  textStyle?: TextStyle;
};

const MarqueeText = ({animDuration, text, textStyle}: Props) => {
  const marqueeRef = useSharedValue(DeviceWidth);

  useEffect(() => {
    marqueeRef.value = withRepeat(
      withTiming(-DeviceWidth, {
        duration: animDuration || 7000,
        easing: Easing.linear,
      }),
      -1,
      false,
      () => {
        marqueeRef.value = DeviceWidth;
      },
    );
  }, []);

  const marqueStyle = useAnimatedStyle(() => ({
    transform: [{translateX: marqueeRef.value}],
  }));

  const Animate = () => (
    <Animated.View
      style={[
        marqueStyle,
        {
          width: DeviceWidth * 2,
        },
      ]}>
      <Text
        numberOfLines={1}
        style={[
          textStyle,
          {
            color: AppColor.PrimaryTextColor,
            fontFamily: Fonts.HELVETICA_REGULAR,
          },
        ]}>
        {text}
      </Text>
    </Animated.View>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      {[1, 2].map(() => (
        <Animate />
      ))}
    </View>
  );
};

export default MarqueeText;

const styles = StyleSheet.create({
  hidden: {opacity: 0, zIndex: -9999},
});
