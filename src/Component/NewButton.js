import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from './Config';
import {AppColor, Fonts} from './Color';
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
  tintColor
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.Button,
        {
          paddingHorizontal: pH ?? 0,
          paddingVertical: pV ?? 18,
          borderRadius: bR ?? 8,
          opacity: opacity ?? 1,
          width: ButtonWidth ?? DeviceWidth * 0.9,
        },
      ]}
      onPress={onPress}
      disabled={disabled}>
      {image ? (
        <Image
          source={image}
          style={{height: Ih ?? 25, width: Iw ?? 25, marginRight: 4}}
          resizeMode="contain"
          tintColor={tintColor ?? null}
        />
      ) : null}
      <Text style={styles.txt1}> {title ?? 'title'}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  Button: {
    backgroundColor: AppColor.RED,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  txt1: {
    color: AppColor.WHITE,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
});
export default NewButton;
