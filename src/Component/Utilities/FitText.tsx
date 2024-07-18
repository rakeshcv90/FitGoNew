import {StyleSheet, Text, TextProps, TextStyle, View} from 'react-native';
import React, {FC, ReactNode} from 'react';
import {AppColor, Fonts} from '../Color';

type Props = TextProps & {
  customStyle?: TextStyle;
  type: 'normal' | 'SubHeading' | 'Heading' | 'none';
  color?: string;
  value: string;
  errorType?: boolean;
  textAlign?: 'center' | 'left' | 'right';
  textTransform?: 'capitalize' | 'uppercase' | 'none';
  letterSpacing?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  lineHeight?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  fontStyle?: 'normal' | 'italic';
  w?: string | any;
  textDecorationLine?: 'line-through';
  onPress?: Function;
  children?: ReactNode;
  marginTop:number;
};

const FitText: FC<Props> = ({
  value,
  color,
  customStyle,
  errorType,
  type,
  letterSpacing,
  textAlign,
  textTransform,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  marginVertical,
  fontStyle,
  w,
  textDecorationLine,
  onPress,
  children,
  marginHorizontal,
  marginTop
}) => {
  const getTypeStyle = () => {
    switch (type) {
      case 'Heading':
        return {
          fontFamily: fontFamily || Fonts.MONTSERRAT_BOLD,
          fontSize: fontSize || 24,
          fontWeight: fontWeight || '600',
          lineHeight: lineHeight || 32,
          color: color || (errorType ? AppColor.RED : '#333333'),
          textAlign: textAlign || 'auto',
          textTransform: textTransform || 'none',
          letterSpacing: letterSpacing || 0,
          marginVertical,
          marginHorizontal,
          fontStyle,
          width: w ?? 'auto',
          textDecorationLine,
          marginTop:marginTop??'undefined'
        };
      case 'SubHeading':
        return {
          fontFamily: fontFamily || Fonts.MONTSERRAT_MEDIUM,
          fontSize: fontSize || 16,
          fontWeight: fontWeight || '600',
          lineHeight: lineHeight || 24,
          color: color || (errorType ? AppColor.RED : '#1E1E1E'),
          textAlign: textAlign || 'auto',
          textTransform: textTransform || 'none',
          letterSpacing: letterSpacing || 0,
          marginVertical,
          marginHorizontal,
          fontStyle,
          width: w ?? 'auto',
          textDecorationLine,
          marginTop:marginTop??'undefined'
        };
      case 'normal':
        return {
          fontFamily: fontFamily || Fonts.MONTSERRAT_REGULAR,
          fontSize: fontSize || 14,
          fontWeight: fontWeight || '600',
          lineHeight: lineHeight || 20,
          color: color || (errorType ? AppColor.RED : AppColor.HEADERTEXTCOLOR),
          textAlign: textAlign || 'auto',
          textTransform: textTransform || 'none',
          letterSpacing: letterSpacing || 0,
          marginVertical,
          marginHorizontal,
          fontStyle,
          width: w ?? 'auto',
          textDecorationLine,
          marginTop:marginTop??'undefined'
        };
      default:
        return {};
    }
  };
  return (
    <>
      <Text onPress={onPress} style={[getTypeStyle(), customStyle]}>
        {value}
        {children}
      </Text>
    </>
  );
};

export default FitText;

const styles = StyleSheet.create({});
