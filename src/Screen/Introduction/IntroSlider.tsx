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
import ArrowButton from './ArrowButton';
import {navigationRef} from '../../../App';
import { setShowIntro } from '../../Component/ThemeRedux/Actions';
import { useDispatch } from 'react-redux';

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

const PREV = DeviceWidth;
const NEXT = 0;
const LEFT_SNAP_POINTS = [MARGIN_WIDTH, PREV];
const RIGHT_SNAP_POINTS = [NEXT, DeviceWidth - MARGIN_WIDTH];

const IntroSlider: FC<SliderProps> = ({
  children: current,
  index,
  setIndex,
  next,
  prev,
}) => {
  const hasPrev = !!prev;
  const hasNext = !!next;
  const activeSide = useSharedValue(Side.NONE);
  const left = useVector(0, DeviceHeigth / 2);
  const right = useVector(0, DeviceHeigth / 2);
  const isTransitioningLeft = useSharedValue(false);
  const isTransitioningRight = useSharedValue(false);
  const zIndex = useSharedValue(0);
  const dispatch = useDispatch()

  useEffect(() => {
    left.x.value = withSpring(MIN_LEDGE);
    right.x.value = withSpring(MIN_LEDGE);
  }, [left.x, left.y]);

  const gotoLogin = () => {
    dispatch(setShowIntro(true));
    navigationRef.navigate('LogSignUp', {screen: 'Log In'});
  }

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: ({x}) => {
      if (x <= MARGIN_WIDTH && hasPrev) {
        activeSide.value = Side.LEFT;
        zIndex.value = 100;
      } else if (x >= DeviceWidth - MARGIN_WIDTH && hasNext) {
        activeSide.value = Side.RIGHT;
      } else {
        activeSide.value = Side.NONE;
      }
    },
    onActive: ({x, y}) => {
      if (activeSide.value === Side.LEFT) {
        left.x.value = Math.max(x, MARGIN_WIDTH);
        left.y.value = y;
      } else if (activeSide.value === Side.RIGHT) {
        right.x.value = Math.max(DeviceWidth - x, MARGIN_WIDTH);
        right.y.value = y;
      }
    },
    onEnd: ({velocityX, velocityY, x}) => {
      if (activeSide.value === Side.LEFT) {
        const dest = snapPoint(x, velocityX, LEFT_SNAP_POINTS);
        isTransitioningLeft.value = dest === PREV;
        left.x.value = withSpring(
          dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningLeft.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningLeft.value) {
              runOnJS(setIndex)(index - 1);
            } else {
              zIndex.value = 0;
              activeSide.value = Side.NONE;
            }
          },
        );
        left.y.value = withSpring(DeviceHeigth / 2, {velocity: velocityY});
      } else if (activeSide.value === Side.RIGHT) {
        const dest = snapPoint(x, velocityX, RIGHT_SNAP_POINTS);
        isTransitioningRight.value = dest === NEXT;
        right.x.value = withSpring(
          DeviceWidth - dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningRight.value ? true : false,
            restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
          },
          () => {
            if (index == 2 && isTransitioningRight.value) {
              runOnJS(gotoLogin)()
            } else if (isTransitioningRight.value) {
              runOnJS(setIndex)(index + 1);
            } else {
              activeSide.value = Side.NONE;
            }
          },
        );
        right.y.value = withSpring(DeviceHeigth / 2, {velocity: velocityY});
      }
    },
  });

  const leftStyle = useAnimatedStyle(() => ({
    zIndex: zIndex.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        {current}
        {prev && (
          <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
            <Wave
              // currentIndex={index}
              position={left}
              side={Side.LEFT}
              isTransitioning={isTransitioningLeft}>
              {prev}
            </Wave>
            <ArrowButton
              currentIndex={index}
              position={left}
              side={Side.LEFT}
              activeSide={activeSide}
            />
          </Animated.View>
        )}
        {next && (
          <Animated.View style={StyleSheet.absoluteFill}>
            <Wave
              // currentIndex={index}
              position={right}
              side={Side.RIGHT}
              isTransitioning={isTransitioningRight}>
              {next}
            </Wave>
          </Animated.View>
        )}
        <ArrowButton
          currentIndex={index}
          position={right}
          side={Side.RIGHT}
          activeSide={activeSide}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default IntroSlider;

// // const styles = StyleSheet.create({});
// import React, { ReactElement, useEffect } from "react";
// import { StyleSheet } from "react-native";
// import Animated, {
//   runOnJS,
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";
// import { PanGestureHandler } from "react-native-gesture-handler";
// import { snapPoint, useVector } from "react-native-redash";

// import Wave, { HEIGHT, MARGIN_WIDTH, Side, WIDTH } from "./Wave";
// import Button from "./ArrowButton";

// const PREV = WIDTH;
// const NEXT = 0;
// const LEFT_SNAP_POINTS = [MARGIN_WIDTH, PREV];
// const RIGHT_SNAP_POINTS = [NEXT, WIDTH - MARGIN_WIDTH];

// interface SliderProps {
//   index: number;
//   setIndex: (value: number) => void;
//   children: ReactElement<any>;
//   prev?: ReactElement<any>;
//   next?: ReactElement<any>;
// }

// const Slider = ({
//   index,
//   children: current,
//   prev,
//   next,
//   setIndex,
// }: SliderProps) => {
//   const hasPrev = !!prev;
//   const hasNext = !!next;
//   const zIndex = useSharedValue(0);
//   const left = useVector(0, HEIGHT / 2);
//   const right = useVector(0, HEIGHT / 2);
//   const activeSide = useSharedValue(Side.NONE);
//   const isTransitioningLeft = useSharedValue(false);
//   const isTransitioningRight = useSharedValue(false);
//   const onGestureEvent = useAnimatedGestureHandler({
//     onStart: ({ x }) => {
//       if (x <= MARGIN_WIDTH && hasPrev) {
//         activeSide.value = Side.LEFT;
//         zIndex.value = 100;
//       } else if (x >= WIDTH - MARGIN_WIDTH && hasNext) {
//         activeSide.value = Side.RIGHT;
//       } else {
//         activeSide.value = Side.NONE;
//       }
//     },
//     onActive: ({ x, y }) => {
//       if (activeSide.value === Side.LEFT) {
//         left.x.value = Math.max(x, MARGIN_WIDTH);
//         left.y.value = y;
//       } else if (activeSide.value === Side.RIGHT) {
//         right.x.value = Math.max(WIDTH - x, MARGIN_WIDTH);
//         right.y.value = y;
//       }
//     },
//     onEnd: ({ velocityX, velocityY, x }) => {
//       if (activeSide.value === Side.LEFT) {
//         const dest = snapPoint(x, velocityX, LEFT_SNAP_POINTS);
//         isTransitioningLeft.value = dest === PREV;
//         left.x.value = withSpring(
//           dest,
//           {
//             velocity: velocityX,
//             overshootClamping: isTransitioningLeft.value ? true : false,
//             restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
//             restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
//           },
//           () => {
//             if (isTransitioningLeft.value) {
//               runOnJS(setIndex)(index - 1);
//             } else {
//               zIndex.value = 0;
//               activeSide.value = Side.NONE;
//             }
//           }
//         );
//         left.y.value = withSpring(HEIGHT / 2, { velocity: velocityY });
//       } else if (activeSide.value === Side.RIGHT) {
//         const dest = snapPoint(x, velocityX, RIGHT_SNAP_POINTS);
//         isTransitioningRight.value = dest === NEXT;
//         right.x.value = withSpring(
//           WIDTH - dest,
//           {
//             velocity: velocityX,
//             overshootClamping: isTransitioningRight.value ? true : false,
//             restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
//             restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
//           },
//           () => {
//             if (isTransitioningRight.value) {
//               runOnJS(setIndex)(index + 1);
//             } else {
//               activeSide.value = Side.NONE;
//             }
//           }
//         );
//         right.y.value = withSpring(HEIGHT / 2, { velocity: velocityY });
//       }
//     },
//   });

//   const leftStyle = useAnimatedStyle(() => ({
//     zIndex: zIndex.value,
//   }));

//   useEffect(() => {
//     left.x.value = withSpring(MARGIN_WIDTH);
//     right.x.value = withSpring(MARGIN_WIDTH);
//   }, [index, left, right]);

//   return (
//     <PanGestureHandler onGestureEvent={onGestureEvent}>
//       <Animated.View style={StyleSheet.absoluteFill}>
//         {current}
//         {prev && (
//           <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
//             <Wave
//               position={left}
//               side={Side.LEFT}
//               isTransitioning={isTransitioningLeft}
//             >
//               {prev}
//             </Wave>
//             <Button position={left} side={Side.LEFT} activeSide={activeSide} />
//           </Animated.View>
//         )}
//         {next && (
//           <Animated.View style={StyleSheet.absoluteFill}>
//             <Wave
//               position={right}
//               side={Side.RIGHT}
//               isTransitioning={isTransitioningRight}
//             >
//               {next}
//             </Wave>
//             <Button
//               position={right}
//               side={Side.RIGHT}
//               activeSide={activeSide}
//             />
//           </Animated.View>
//         )}
//       </Animated.View>
//     </PanGestureHandler>
//   );
// };

// export default Slider;
