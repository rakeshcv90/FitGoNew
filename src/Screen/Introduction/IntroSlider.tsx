import {StyleSheet, Text, View} from 'react-native';
import React, {FC, ReactElement, useEffect, useState} from 'react';
import {IntroductionData} from './IntroductionScreenData';
import Wave from './Wave';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {snapPoint, useVector} from 'react-native-redash';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';

interface SliderProps {
  index: number;
  setIndex: (value: number) => void;
  children: ReactElement<any>;
  prev?: ReactElement<any>;
  next?: ReactElement<any>;
}
export enum Side {
  LEFT,
  RIGHT,
  NONE,
}
export const MIN_LEDGE = 15;
export const MARGIN_WIDTH = MIN_LEDGE + 40;
const IntroSlider: FC<SliderProps> = ({
  children,
  index,
  setIndex,
  next,
  prev,
}) => {
  const activeSide = useSharedValue(Side.NONE);
  const left = useVector(0, DeviceHeigth / 2);
  const right = useVector(0, DeviceHeigth / 2);
  const isTransitioningLeft = useSharedValue(false);
  const isTransitioningRight = useSharedValue(false);
  useEffect(() => {
    left.x.value = withSpring(MIN_LEDGE);
    right.x.value = withSpring(MIN_LEDGE);
  }, [left.x, left.y]);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: ({x}) => {
      if (x < MARGIN_WIDTH && index != 0) activeSide.value = Side.LEFT;
      else if (x > DeviceWidth - MARGIN_WIDTH) activeSide.value = Side.RIGHT;
      else activeSide.value = Side.NONE;
    },
    onActive: ({x, y}) => {
      if (activeSide.value === Side.LEFT) {
        left.x.value = x;
        left.y.value = y;
      } else if (activeSide.value === Side.RIGHT) {
        right.x.value = DeviceWidth - x;
        right.y.value = y;
      }
    },
    onEnd: ({x, velocityX, velocityY}) => {
      if (activeSide.value === Side.LEFT) {
        const snapPoints = [MIN_LEDGE, DeviceWidth];
        const destination = snapPoint(x, velocityX, snapPoints);
        isTransitioningLeft.value = destination === DeviceWidth;
        left.x.value = withSpring(
          destination,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningLeft.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningLeft.value) {
              runOnJS(setIndex)(index - 1);
            }
          },
        );
        left.y.value = withSpring(DeviceHeigth / 2, {velocity: velocityY});
      } else if (activeSide.value === Side.RIGHT) {
        const snapPoints = [DeviceWidth - MIN_LEDGE, 0];
        const destination = snapPoint(x, velocityX, snapPoints);
        isTransitioningRight.value = destination === 0;
        right.x.value = withSpring(
          DeviceWidth - destination,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningRight.value ? true : false,
            restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningRight.value) {
              runOnJS(setIndex)(index + 1);
            }
          },
        );
        right.y.value = withSpring(DeviceHeigth / 2, {velocity: velocityY});
      }
    },
  });

  const leftStyle = useAnimatedStyle(() => ({
    zIndex: activeSide.value === Side.LEFT ? 100 : 0,
  }));

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        {children}
        {prev && (
          <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
            <Wave
              currentIndex={index}
              isTransitioning={isTransitioningLeft}
              position={left}
              side={Side.LEFT}>
              {prev}
            </Wave>
          </Animated.View>
        )}
        {next && (
          <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
            <Wave
              currentIndex={index}
              isTransitioning={isTransitioningRight}
              position={right}
              side={Side.RIGHT}>
              {next}
            </Wave>
          </Animated.View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default IntroSlider;

const styles = StyleSheet.create({});
