import {
  ColorValue,
  DimensionValue,
  FlexStyle,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {AppColor} from '../Color';
import PredefinedStyles from './PredefineStyles';
import FitIcon, {FitIconTypes} from './FitIcon';
import FitText, {FitTextProps} from './FitText';

export type ButtonProps = TouchableWithoutFeedbackProps & {
  id?: number;
  bgColor?: ColorValue;
  bColor?: ColorValue;
  textColor?: ColorValue;
  bR?: number;
  bW?: number;
  w?: 'half' | 'full' | 'contain' | DimensionValue;
  mV?: number;
  mH?: number;
  padV?: number;
  titleText: FitTextProps | string;
  shadow?: boolean;
  onPress: () => void;
  IconLeft?: FitIconTypes;
  IconLComp?: ReactNode;
  iconW?: DimensionValue;
  justifyContent?: FlexStyle['justifyContent'];
  padH?: number;
  style?: ViewStyle;
  buttonProps?: TouchableOpacityProps;
  hasIcon?: boolean;
  loader?: boolean;
  loaderColor?: ColorValue;
};

const FitButton = ({
  w = 'full',
  bgColor,
  bColor = AppColor.NEW_GREY,
  bR = 30,
  bW = 0,
  mH = 5,
  mV = 5,
  titleText = '',
  shadow = false,
  textColor,
  padV = 12,
  padH = 10,
  onPress,
  IconLComp,
  IconLeft,
  iconW,
  justifyContent,
  style,
  hasIcon = false,
  loader = false,
  loaderColor,
  buttonProps,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width:
            w === 'contain'
              ? '85%'
              : w === 'half'
              ? '50%'
              : w === 'full'
              ? '100%'
              : w,
          marginVertical: mV,
          marginHorizontal: mH,
          borderRadius: bR,
          borderColor: bColor,
          borderWidth: bW,
          backgroundColor: bgColor ?? AppColor.RED,
          justifyContent: justifyContent ?? 'center',
          paddingVertical: padV,
          paddingHorizontal: padH,
        },
        shadow && PredefinedStyles.ShadowStyle,
        hasIcon && {
          flexDirection: 'row',
          alignItems: 'center',
        },
        styles.container,
        style,
      ]}
      {...buttonProps}>
      {(IconLeft || IconLComp) && (
        <View style={{width: iconW ?? '10%'}}>
          {IconLeft ? <FitIcon {...(IconLeft as FitIconTypes)} /> : IconLComp}
        </View>
      )}
      {typeof titleText == 'string' ? (
        <FitText
          type="SubHeading"
          value={titleText + ' '}
          color={textColor ?? AppColor.BLACK}
          textAlign={hasIcon ? 'center' : 'center'}>
          {loader && <FitIcon name="spinner" size={20} color={loaderColor} type="FontAwesome5" />}
        </FitText>
      ) : (
        <FitText {...(titleText as FitTextProps)} />
      )}
    </TouchableOpacity>
  );
};

export default FitButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
