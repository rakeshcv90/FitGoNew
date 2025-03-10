import React, {useEffect, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, Dimensions, Pressable, Keyboard} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

type FitSheetProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  initialSnapPoint?: number; // Value between 0 and 1 representing percentage of screen
  minHeight?: number; // Minimum height of the bottom sheet in pixels
  backdropOpacity?: number;
  handleIndicatorStyle?: object;
  style?: object;
  bottomTabHeight?: number;
};

export type FitSheetRefProps = {
  open: () => void;
  close: () => void;
};

const FitSheet = forwardRef<FitSheetRefProps, FitSheetProps>(
  (
    {
      children,
      isOpen = false,
      onOpenChange,
      initialSnapPoint = 0.5,
      minHeight = 100,
      backdropOpacity = 0.5,
      handleIndicatorStyle = {},
      style = {},
      bottomTabHeight = 70, // Default height for bottom tabs
    },
    ref,
  ) => {
    // Ensure initialSnapPoint is between 0 and 1
    const validSnapPoint = Math.max(0, Math.min(1, initialSnapPoint));

    // Convert initialSnapPoint to negative translate value
    const initialTranslateY =
      -(SCREEN_HEIGHT - bottomTabHeight) * validSnapPoint;

    // Calculate minimum translate Y based on minHeight
    const MIN_TRANSLATE_Y = -Math.min(
      minHeight,
      SCREEN_HEIGHT - bottomTabHeight,
    );

    // Animation values
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const backdropActive = useSharedValue(false);
    const context = useSharedValue({y: 0});

    // Handle external open/close through props
    useEffect(() => {
      if (isOpen) {
        active.value = true;
        backdropActive.value = true;
        translateY.value = withTiming(initialTranslateY, {duration: 300});
      } else {
        translateY.value = withTiming(0, {duration: 300}, () => {
          runOnJS(resetSheet)();
        });
      }
    }, [isOpen, initialSnapPoint]);

    // External control methods
    useImperativeHandle(ref, () => ({
      open: () => {
        active.value = true;
        backdropActive.value = true;
        translateY.value = withTiming(initialTranslateY, {duration: 300});
        onOpenChange?.(true);
      },
      close: () => {
        translateY.value = withTiming(0, {duration: 300}, () => {
          runOnJS(resetSheet)();
        });
        onOpenChange?.(false);
      },
    }));

    const resetSheet = () => {
      active.value = false;
      backdropActive.value = false;
      Keyboard.dismiss();
    };

    // Create pan gesture using Gesture.Pan()
    const panGesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: translateY.value};
      })
      .onUpdate(event => {
        // Calculate new position but limit it to stay within bounds
        const newTranslateY = context.value.y + event.translationY;

        // Ensure it doesn't go beyond MAX_TRANSLATE_Y (full screen)
        // or above MIN_TRANSLATE_Y (minimum height)
        if (newTranslateY <= 0 && newTranslateY >= MAX_TRANSLATE_Y) {
          translateY.value = newTranslateY;
        }
      })
      .onEnd(event => {
        // Determine if the sheet should close, snap to middle, or open fully
        if (translateY.value > -minHeight / 2) {
          // Close the sheet
          translateY.value = withTiming(0, {duration: 300}, () => {
            runOnJS(resetSheet)();
            runOnJS(onOpenChange ?? (() => {}))(false);
          });
        } else if (event.velocityY < -500) {
          // Fast swipe up - open fully
          translateY.value = withTiming(MAX_TRANSLATE_Y, {duration: 300});
          runOnJS(onOpenChange ?? (() => {}))(true);
        } else if (event.velocityY > 500) {
          // Fast swipe down - close or snap to minimum
          if (
            Math.abs(translateY.value) <
            (SCREEN_HEIGHT - bottomTabHeight) * 0.3
          ) {
            // Close if near bottom
            translateY.value = withTiming(0, {duration: 300}, () => {
              runOnJS(resetSheet)();
              runOnJS(onOpenChange ?? (() => {}))(false);
            });
          } else {
            // Snap to middle
            translateY.value = withTiming(initialTranslateY, {duration: 300});
            runOnJS(onOpenChange ?? (() => {}))(true);
          }
        } else {
          // Normal end of gesture - snap to nearest point
          const snapToFullScreen =
            Math.abs(translateY.value) >
            (SCREEN_HEIGHT - bottomTabHeight) * 0.7;
          const snapToMiddle = Math.abs(translateY.value) > minHeight;

          if (snapToFullScreen) {
            translateY.value = withTiming(MAX_TRANSLATE_Y, {duration: 300});
          } else if (snapToMiddle) {
            translateY.value = withTiming(initialTranslateY, {duration: 300});
          } else {
            translateY.value = withTiming(0, {duration: 300}, () => {
              runOnJS(resetSheet)();
              runOnJS(onOpenChange ?? (() => {}))(false);
            });
          }
        }
      });

    // Animated styles
    const bottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: translateY.value}],
      };
    });

    const backdropStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          translateY.value,
          [0, initialTranslateY],
          [0, backdropOpacity],
          //   Extrapolate.CLAMP
        ),
        display: backdropActive.value ? 'flex' : 'none',
      };
    });

    return (
      <>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={styles.backdropPressable}
            onPress={() => {
              translateY.value = withTiming(0, {duration: 300}, () => {
                runOnJS(resetSheet)();
              });
              onOpenChange?.(false);
            }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheetContainer,
            bottomSheetStyle,
            style,
            {
              height: SCREEN_HEIGHT - bottomTabHeight,
              top: SCREEN_HEIGHT - bottomTabHeight,
            },
          ]}>
          {/* Handle indicator - only this part will respond to gestures */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleIndicatorWrapper}>
              <View style={[styles.handleIndicator, handleIndicatorStyle]} />
            </View>
          </GestureDetector>

          <View style={styles.contentContainer}>{children}</View>
        </Animated.View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  handleIndicatorWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleIndicator: {
    width: 100,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
  },
});

export default FitSheet;
