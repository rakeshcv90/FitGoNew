import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {DeviceWidth} from './Config';
import {AppColor, Fonts} from './Color';
import {setChallengesData} from './ThemeRedux/Actions';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import AntIcons from 'react-native-vector-icons/AntDesign';

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

const {width, height} = Dimensions.get('screen');

const NewButton2 = ({
  image,
  title,
  pH,
  pV,
  bR,
  onPress,
  disabled,
  opacity,
  ButtonWidth,
  Ih,
  Iw,
  tintColor,
  buttonColor,
  titleColor,
  mV,
  withAnimation,
  download,
  position,
  bottom,
  top,
  right,
  left,
  elevation,
  bb,
  alignSelf,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const handlePress = () => {
    onPress && onPress();
    setIsClicked(true);
  };
  useEffect(() => {
    if (download == 100) {
      setIsClicked(false);
    }
  }, [download]);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: translationX.value},
      {translateY: translationY.value},
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .runOnJS(true);
  return (
    <GestureHandlerRootView
      style={{
        //flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red',
        left: 20,
        right: 20,
        bottom: 0,
        position: 'absolute',
      }}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[animatedStyles, styles.box]}>
          <TouchableOpacity
            activeOpacity={0.2}
            style={[
              styles.buttonContainer,
              {
                paddingHorizontal: pH ?? 0,

                paddingVertical: pV ?? 18,

                width: 70,
                height: 70,
                backgroundColor: withAnimation
                  ? isClicked
                    ? 'darkgrey'
                    : buttonColor ?? AppColor.RED
                  : buttonColor ?? AppColor.RED,

                overflow: 'hidden', // Ensure contents don't overflow during animation
                position: 'absolute',
                bottom: 0,

                left: left ?? undefined,

                ...elevation,
              },
            ]}
            onPress={handlePress} // Call handlePress
            disabled={withAnimation ? (isClicked ? true : disabled) : false}>
            {withAnimation ? (
              <Animated.View
                style={[
                  styles.buttonFill,
                  {
                    width: `${download}%`,
                    backgroundColor: AppColor.RED, // Change fill color to RED
                  },
                ]}
              />
            ) : null}
            <View style={styles.contentContainer}>
              {/* <Text style={[styles.titleText, {color: titleColor ?? AppColor.WHITE}]}>
         Start
        </Text> */}

              {withAnimation ? (
                isClicked ? (
                  <AntIcons
                    name={'download'}
                    size={25}
                    color={AppColor.WHITE}
                  />
                ) : (
                  <AntIcons
                    name={'playcircleo'}
                    size={35}
                    color={AppColor.WHITE}
                  />
                )
              ) : (
                <AntIcons
                  name={'playcircleo'}
                  size={35}
                  color={AppColor.WHITE}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 70,
    position: 'relative', // Ensure the absolute positioning of buttonFill works properly
  },
  buttonFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: AppColor.RED,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure the content is above the buttonFill
  },
  titleText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: AppColor.WHITE,
    fontWeight: '700',
  },
  box: {
    width: 70,
    height: 70,
    backgroundColor: AppColor.RED,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default NewButton2;
