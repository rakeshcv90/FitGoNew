import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor} from './Color';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
const windowHeight = Dimensions.get('window').height;

const BottomSheet1 = forwardRef(({children, innerStyle}, ref) => {
  const translateY = useSharedValue(windowHeight);
  // Expose methods to parent using ref
  useImperativeHandle(ref, () => ({
    openSheet: () => {
      translateY.value = withTiming(0, {duration: 1000}); // Open the sheet
    },
    closeSheet: () => {
      translateY.value = withTiming(windowHeight, {duration: 1000}); // Close the sheet
    },
  }));
  //gesture
  const gesture = Gesture.Pan()
    .onUpdate(event => {
      translateY.value = Math.max(event.translationY, 0); // Restrict upward movement
    })
    .onEnd(() => {
      if (translateY.value > windowHeight / 10) {
        translateY.value = withTiming(windowHeight, {duration: 1000});
      }
    });
  //animation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.innerBox, animatedStyle, {...innerStyle}]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
});
export default BottomSheet1;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DeviceWidth,
    height: windowHeight,
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  innerBox: {
    width: DeviceWidth,
    backgroundColor: AppColor.GRAY,
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingBottom: 20,
  },
  closeStyle: {
   right:8,
    marginTop: 6,
    position: 'absolute',
    backgroundColor:'red'
  },
});
