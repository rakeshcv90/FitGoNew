import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import React, {FC, ReactNode} from 'react';
import {DeviceWidth} from '../Config';
import {AppColor} from '../Color';

type Props = {
  w?: number;
  bgColor?: string;
  shadow?: boolean;
  padding?: number;
  bR?: number;
  children: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  mV?: number;
  pV?: number;
  justifyContent?: any;
  alignItems?: any;
  alignSelf?: any;
};
const ShadowCard: FC<Props> = ({
  bR,
  bgColor,
  padding,
  shadow,
  w,
  customStyle,
  children,
  mV,
  pV,
  alignItems,
  justifyContent,
  alignSelf,
}) => {
  return (
    <View
      style={[
        customStyle && customStyle,
        shadow && styles.shadow,
        {
          borderRadius: bR ?? 5,
          backgroundColor: bgColor ?? AppColor.WHITE,
          padding: padding ?? 10,
          paddingVertical: pV ?? 10,
          marginVertical: mV ?? 10,
          width: w ?? DeviceWidth * 0.9,
          flex: 1,
          justifyContent: justifyContent ?? 'center',
          alignItems: alignItems ?? 'center',
          alignSelf: alignSelf ?? 'center',
        },
      ]}>
      {children}
    </View>
  );
};

export default ShadowCard;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'grey',
    ...Platform.select({
      ios: {
        //shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
