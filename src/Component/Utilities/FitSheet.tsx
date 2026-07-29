import React, {useEffect, useImperativeHandle, forwardRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Keyboard,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type FitSheetProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  initialSnapPoint?: number;
  minHeight?: number;
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
      bottomTabHeight = 70,
    },
    ref,
  ) => {
    const validSnapPoint = Math.max(0, Math.min(1, initialSnapPoint));
    const initialTranslateY =
      -(SCREEN_HEIGHT - bottomTabHeight) * validSnapPoint;
    const MAX_TRANSLATE_Y = -(SCREEN_HEIGHT - bottomTabHeight);

    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const backdropActive = useSharedValue(false);
    const context = useSharedValue({y: 0});

    const springConfig = {
      damping: 24,
      stiffness: 240,
      mass: 0.8,
    };

    useEffect(() => {
      if (isOpen) {
        active.value = true;
        backdropActive.value = true;
        translateY.value = withSpring(initialTranslateY, springConfig);
      } else {
        translateY.value = withTiming(0, {duration: 250}, () => {
          runOnJS(resetSheet)();
        });
      }
    }, [isOpen, initialSnapPoint]);

    useImperativeHandle(ref, () => ({
      open: () => {
        active.value = true;
        backdropActive.value = true;
        translateY.value = withSpring(initialTranslateY, springConfig);
        onOpenChange?.(true);
      },
      close: () => {
        translateY.value = withTiming(0, {duration: 250}, () => {
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

    const panGesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: translateY.value};
      })
      .onUpdate(event => {
        const newTranslateY = context.value.y + event.translationY;
        // Clamp position so sheet cannot be dragged higher than fixed initialTranslateY
        if (newTranslateY <= 0 && newTranslateY >= initialTranslateY) {
          translateY.value = newTranslateY;
        }
      })
      .onEnd(event => {
        // Close if pulled down past 50% of height, otherwise snap to fixed height
        if (translateY.value > initialTranslateY / 2) {
          translateY.value = withTiming(0, {duration: 250}, () => {
            runOnJS(resetSheet)();
            runOnJS(onOpenChange ?? (() => {}))(false);
          });
        } else {
          translateY.value = withSpring(initialTranslateY, springConfig);
          runOnJS(onOpenChange ?? (() => {}))(true);
        }
      });

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
              translateY.value = withTiming(0, {duration: 250}, () => {
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    zIndex: 998,
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 999,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {
          width: 0,
          height: -8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handleIndicatorWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 14,
  },
  handleIndicator: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
});

export default FitSheet;
