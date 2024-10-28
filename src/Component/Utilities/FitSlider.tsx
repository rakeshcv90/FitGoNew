import {
  ColorValue,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode, useEffect, useState} from 'react';
import {AppColor} from '../Color';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import FitText from './FitText';

type FitSliderProps = {
  containerVert?: number;
  slideColor?: ColorValue;
  sliderColor?: ColorValue;
  completedColor?: ColorValue;
  slideHeight?: number;
  currentPosition: number;
  duration: number;
  initialValue: number;
  autoAnimation?: boolean;
  sliderChildren?: ReactNode;
  textStyle?: TextStyle;
  textColor?: string;
  showText?: boolean;
  onCompletion: () => void;
  setPause: Function | any;
  seekTo: (position: number) => void;
  forMusicPlayer: boolean;
};

const FitSlider = ({
  autoAnimation,
  containerVert = 10,
  completedColor = 'red',
  slideColor,
  sliderColor,
  slideHeight,
  initialValue = 0,
  currentPosition,
  duration,
  textStyle,
  textColor = AppColor.BLACK,
  showText = false,
  sliderChildren,
  forMusicPlayer,
  onCompletion,
  setPause,
  seekTo,
}: FitSliderProps) => {
  const sliderHeight = slideHeight ? slideHeight * 10 : 3 * 5;

  const currentSliderPosition = useSharedValue(initialValue);
  const initialSliderPosition = useSharedValue(initialValue); // Store initial position
  const sliderWidth = useSharedValue(0); // Track the width of the slider for calculations
  const [currentTime, setCurrentTime] = useState(currentPosition);

  useEffect(() => {
    if (sliderWidth.value > 0 && autoAnimation) {
      const calculatedPosition =
        duration > 0 ? (currentPosition / duration) * sliderWidth.value : 0;

      currentSliderPosition.value = withTiming(calculatedPosition, {
        duration: 900,
      });
      setCurrentTime(currentPosition);
    }
  }, [currentPosition, autoAnimation, duration]);

  const changeTime = (time: number) => {
    seekTo(time);
    setPause(true);
  };
  const sliderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          currentSliderPosition.value > 0
            ? currentSliderPosition.value - sliderHeight / 2
            : 0,
      },
    ], // Center the slider within the track
  }));

  const completedPathStyle = useAnimatedStyle(() => ({
    borderColor:
      currentSliderPosition.value > 0
        ? completedColor
        : slideColor ?? AppColor.BLACK,
    borderRightWidth:
      currentSliderPosition.value > 0 ? currentSliderPosition.value : 0,
  }));

  const onSlidePress = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    runOnJS(setPause)(false);
    cancelAnimation(currentSliderPosition);

    // Move slider directly to the tapped location
    const tappedPosition = event.nativeEvent.locationX;
    currentSliderPosition.value = withTiming(tappedPosition, {duration: 300});
    initialSliderPosition.value = currentSliderPosition.value;
    const time = (tappedPosition / sliderWidth.value) * duration;
    runOnJS(setCurrentTime)(time);
    runOnJS(changeTime)(time);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setPause)(false);
      cancelAnimation(currentSliderPosition);
    })
    .onUpdate(event => {
      const newPosition = Math.min(
        Math.max(0, initialSliderPosition.value + event.translationX),
        sliderWidth.value,
      );
      currentSliderPosition.value = newPosition; // Update position
      const time = (newPosition / sliderWidth.value) * duration;
      runOnJS(setCurrentTime)(time);
    })
    .onEnd(() => {
      initialSliderPosition.value = currentSliderPosition.value; // Update position
      runOnJS(changeTime)(currentTime);
    });
  const secondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };
  return (
    <View
      style={[
        styles.container,
        {
          paddingVertical: containerVert ?? 10,
          minHeight: sliderHeight + containerVert,
        },
      ]}>
      {showText && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <FitText
            type="normal"
            value={secondsToTime(currentTime)}
            color={textColor}
            customStyle={textStyle}
          />
          <FitText
            type="normal"
            value={secondsToTime(duration)}
            color={textColor}
            customStyle={textStyle}
          />
        </View>
      )}
      <View style={[styles.container, {marginVertical: sliderHeight}]}>
        <TouchableOpacity
          onPress={onSlidePress}
          activeOpacity={1}
          style={{
            backgroundColor: slideColor ?? AppColor.BLACK,
            height: slideHeight ?? 5,
            justifyContent: 'center',
            borderRadius: 10,
          }}
          onLayout={event => {
            // Measure the width of the slider for accurate position calculation
            sliderWidth.value = event.nativeEvent.layout.width;
          }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                height: slideHeight ?? 5,
                // borderRightWidth: currentSliderPosition.value
              },
              completedPathStyle,
            ]}
          />
          <GestureDetector gesture={panGesture}>
            <Animated.View
              // onPress={onSliderPress}
              style={[
                {
                  height: sliderHeight,
                  width: sliderHeight,
                  borderRadius: sliderHeight,
                  backgroundColor: sliderColor ?? 'red',
                },
                sliderStyle,
              ]}>
              {sliderChildren}
            </Animated.View>
          </GestureDetector>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FitSlider;

const styles = StyleSheet.create({
  container: {width: '95%', alignSelf: 'center'},
});
