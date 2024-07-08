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
  position,
  bottom,
  top,
  right,
  left,
  elevation,
  bb,
  alignSelf
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
  return (
    <TouchableOpacity
    activeOpacity={0.2}
      style={[
        styles.buttonContainer,
        {
          paddingHorizontal: pH ?? 0,
          alignSelf: alignSelf??'center',
          paddingVertical: pV ?? 18,
          borderRadius: bR ?? 8,
          opacity: opacity ?? 1,
          width:!bb? ButtonWidth ?? DeviceWidth * 0.9:undefined,
          backgroundColor: withAnimation
            ? isClicked
              ? 'darkgrey'
              : buttonColor ?? '#f0013b'
            : buttonColor ?? '#f0013b',
          marginVertical: mV ?? 0,
          overflow: 'hidden', // Ensure contents don't overflow during animation
          position: position ?? 'relative',
          bottom: bottom ?? undefined,
          top: top ?? undefined,
          left: left ?? undefined,
          right: right ?? undefined,
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
              backgroundColor: '#f0013b', // Change fill color to RED
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
          {withAnimation
            ? isClicked
              ? 'Downloading...'
              : title ?? 'Title'
            : title ?? 'Title'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative', // Ensure the absolute positioning of buttonFill works properly
  },
  buttonFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#f0013b',
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
