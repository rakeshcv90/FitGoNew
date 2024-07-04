import {StyleSheet, Text, View} from 'react-native';
import React, {FC, ReactNode} from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import {Path, Svg} from 'react-native-svg';
import {AppColor, PLATFORM_IOS} from '../../Component/Color';
import Animated, {
  clamp,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {MARGIN_WIDTH, MIN_LEDGE, Side} from './IntroSlider';
import {Vector} from 'react-native-redash';

interface WaveProps {
  side: Side;
  children: ReactNode;
  position: Vector<Animated.SharedValue<number>>;
  isTransitioning: Animated.SharedValue<boolean>;
  currentIndex: number;
}
const AnimatedPath = Animated.createAnimatedComponent(Path);

const vec2 = (x: number, y: number) => {
  'worklet';
  return {x, y};
};
const curve = (c1: Vector, c2: Vector, to: Vector) => {
  'worklet';
  return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
};

const Wave: FC<WaveProps> = ({
  children,
  side,
  position,
  isTransitioning,
  currentIndex,
}) => {
  const stepX = useDerivedValue(() => {
    const R = clamp(
      position.x.value,
      MARGIN_WIDTH - MIN_LEDGE,
      DeviceWidth / 3,
    );
    return withSpring(isTransitioning.value ? 0 : R / 2);
  });

  const animatedProps = useAnimatedProps(() => {
    const R = clamp(
      position.x.value,
      MARGIN_WIDTH - MIN_LEDGE,
      DeviceWidth / 3,
    );
    const stepY = Math.max(position.x.value, MARGIN_WIDTH - MIN_LEDGE);
    // 0.5522847498 is taken from https://spencermortensen.com/articles/bezier-circle/
    const C = R * 0.5522847498;
    const p1 = vec2(position.x.value, position.y.value - 2 * stepY);
    const p2 = vec2(p1.x + stepX.value, p1.y + stepY);
    const p3 = vec2(p2.x + stepX.value, p2.y + stepY);
    const p4 = vec2(p3.x - stepX.value, p3.y + stepY);
    const p5 = vec2(p4.x - stepX.value, p4.y + stepY);

    const c21 = vec2(p1.x, p1.y + C);
    const c22 = vec2(p2.x, p2.y);

    const c31 = vec2(p2.x, p2.y);
    const c32 = vec2(p3.x, p3.y - C);

    const c41 = vec2(p3.x, p3.y + C);
    const c42 = vec2(p4.x, p4.y);

    const c51 = vec2(p4.x, p4.y);
    const c52 = vec2(p5.x, p5.y - C);

    const d = [
      'M 0 0',
      `H ${p1.x}`,
      `V ${p1.y}`,
      curve(c21, c22, p2),
      curve(c31, c32, p3),
      curve(c41, c42, p4),
      curve(c51, c52, p5),
      //   `L ${p2.x} ${p2.y}`,
      //   `L ${p3.x} ${p3.y}`,
      //   `L ${p4.x} ${p4.y}`,
      //   `L ${p5.x} ${p5.y}`,
      `V ${DeviceHeigth}`,
      'H 0',
      'Z',
    ];
    return {
      d: d.join(' '),
    };
  });

  const MaskedComponent = (
    <Svg
      style={[
        StyleSheet.absoluteFill,
        {transform: [{rotateY: side === Side.RIGHT ? '180deg' : '0deg'}]},
      ]}>
      <AnimatedPath
        animatedProps={animatedProps}
        fill={
          PLATFORM_IOS
            ? AppColor.BLACK
            : currentIndex == 1
            ? AppColor.WHITE
            : AppColor.RED
        }
      />
    </Svg>
  );

  const androidStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            // eslint-disable-next-line no-nested-ternary
            isTransitioning.value
              ? withTiming(0)
              : side === Side.RIGHT
              ? DeviceWidth - MIN_LEDGE
              : -DeviceWidth + MIN_LEDGE,
        },
      ],
    };
  });
  return (
    <>
      {PLATFORM_IOS ? (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={MaskedComponent}>
          {children}
        </MaskedView>
      ) : (
        <View style={StyleSheet.absoluteFill}>
          {MaskedComponent}
          <Animated.View style={[StyleSheet.absoluteFill, androidStyle]}>
            {children}
          </Animated.View>
        </View>
      )}
    </>
  );
};

export default Wave;

const styles = StyleSheet.create({});
