import React, {FC, memo, ReactNode, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  DimensionValue,
  TextStyle,
} from 'react-native';
import FitIcon, {FitIconTypes} from './FitIcon';
import FitText, {FitTextProps} from './FitText';
import {AppColor} from '../Color';
import {DeviceWidth} from '../Config';
import PredefinedStyles from './PredefineStyles';

export type Props = TextInputProps & {
  mV?: number;
  mH?: number;
  IconLeft?: FitIconTypes;
  IconRight?: FitIconTypes;
  IconLComp?: ReactNode;
  IconRComp?: ReactNode;
  labelText?: FitTextProps | string;
  errors?: string | any;
  touched?: boolean | any;
  bgColor?: string;
  bColor?: string;
  bR?: number;
  bW?: number;
  w?: 'half' | 'full' | '2/3' | DimensionValue;
  iconW?: DimensionValue;
  shadow?: boolean;
  bottomLine?: boolean;
  textInputStyle?: TextStyle;
};
const AppInput: FC<Props> = ({
  labelText,
  IconLeft,
  IconRight,
  IconLComp,
  IconRComp,
  w = 'full',
  bgColor,
  errors,
  touched = false,
  bColor = AppColor.GRAY,
  bR = 10,
  bW = 0,
  mH = 5,
  mV = 5,
  shadow,
  iconW,
  textInputStyle,
  bottomLine = false,
  ...props
}) => {
  const width =
    w === 'full'
      ? DeviceWidth * 0.95
      : w === 'half'
      ? DeviceWidth * 0.4
      : w === '2/3'
      ? DeviceWidth * 0.7
      : DeviceWidth * 0.9;
  return (
    <>
      {typeof labelText == 'string' ? (
        <FitText type="SubHeading" value={labelText} color={AppColor.BLACK} />
      ) : (
        <FitText {...(labelText as FitTextProps)} />
      )}
      <View
        style={[
          {
            width,
            marginVertical: mV,
            marginHorizontal: mH,
            borderRadius: bR,
            borderColor: bColor,
            borderWidth: bW,
            backgroundColor: bgColor ?? AppColor.WHITE,
          },
          shadow && PredefinedStyles.ShadowStyle,
          PredefinedStyles.rowCenter,
          styles.container,
        ]}>
        {(IconLeft || IconLComp) && (
          <View style={{width: iconW ?? '10%'}}>
            {IconLeft ? <FitIcon {...(IconLeft as FitIconTypes)} /> : IconLComp}
          </View>
        )}
        <TextInput
          {...props}
          style={[textInputStyle, {width: '80%', color: 'black'}]}
        />
        {(IconRight || IconRComp) && (
          <View style={{width: '10%'}}>
            {IconRight ? (
              <FitIcon {...(IconRight as FitIconTypes)} />
            ) : (
              IconRComp
            )}
          </View>
        )}
      </View>
      {bottomLine && (
        <View style={[PredefinedStyles.HorizontalLine, {width}]} />
      )}
      {touched && errors && (
        <FitText type="normal" value={errors} color={AppColor.NewRed} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    padding: 5,
  },
});

export default memo(AppInput);
