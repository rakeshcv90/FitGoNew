import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import {DeviceWidth} from './Config';
import {AppColor, Fonts} from './Color';
import {setChallengesData} from './ThemeRedux/Actions';

const NewButton = ({
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
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [isClicked, setIsClicked] = useState(false);
  const handlePress = () => {
    onPress && onPress();
    setIsClicked(true);
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsClicked(false);
    });
  };
  // not used for now
  const progressBarWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp', // Ensure the width doesn't go beyond the defined range
  });

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          paddingHorizontal: pH ?? 0,
          paddingVertical: pV ?? 18,
          borderRadius: bR ?? 8,
          opacity: opacity ?? 1,
          width: ButtonWidth ?? DeviceWidth * 0.9,
          backgroundColor: withAnimation
            ? isClicked
              ? 'darkgrey'
              : buttonColor ?? AppColor.RED
            : buttonColor ?? AppColor.RED,
          marginVertical: mV ?? 0,
          overflow: 'hidden', // Ensure contents don't overflow during animation
        },
      ]}
      onPress={handlePress} // Call handlePress
      disabled={isClicked ? true : disabled}>
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
        {image && (
          <Image
            source={image}
            style={{height: Ih ?? 25, width: Iw ?? 25, marginRight: 4}}
            resizeMode="contain"
            tintColor={tintColor ?? null}
          />
        )}
        <Text style={[styles.titleText, {color: titleColor ?? AppColor.WHITE}]}>
          {title ?? 'Title'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    position: 'relative', // Ensure the absolute positioning of buttonFill works properly
  },
  buttonFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
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
  },
});

export default NewButton;
