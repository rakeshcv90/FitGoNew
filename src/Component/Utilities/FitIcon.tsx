import {ColorValue, TextStyle, View} from 'react-native';
import React, {FC} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppColor} from '../Color';

export type FitIconTypes = {
  type:
    | 'MaterialCommunityIcons'
    | 'AntDesign'
    | 'Ionicons'
    | 'MaterialIcons'
    | 'FontAwesome5';
  color?: string;
  size: number;
  onPress?: () => void;
  name: string;
  mL?: number;
  mR?: number;
  style?: TextStyle;
  roundIcon?: boolean;
  bR?: number;
  bC?: ColorValue;
  roundBackground?: ColorValue;
  bW?: number;
  roundPadding?: number;
};

const FitIcon: FC<FitIconTypes> = ({
  size,
  type,
  color,
  onPress,
  name,
  mR,
  mL,
  style,
  bC,
  bR,
  bW,
  roundPadding,
  roundIcon = false,
  roundBackground,
}) => {
  const TEXT_THEME = AppColor.BLACK;
  const BACKGROUND_THEME = AppColor.RED;
  return (
    <View
      style={[
        roundIcon && {
          padding: roundPadding ?? 10,
          borderRadius: bR ?? 100,
          borderWidth: bW ?? 1,
          borderColor: bC ?? color,
          backgroundColor: roundBackground ?? BACKGROUND_THEME,
        },
      ]}>
      {type == 'AntDesign' ? (
        <AntDesign
          name={name}
          size={size}
          onPress={onPress}
          color={color ?? TEXT_THEME}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      ) : type == 'MaterialIcons' ? (
        <MaterialIcons
          name={name}
          size={size}
          onPress={onPress}
          color={color ?? TEXT_THEME}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      ) : type == 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons
          name={name}
          size={size}
          onPress={onPress}
          color={color ?? TEXT_THEME}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      ) : type == 'Ionicons' ? (
        <Ionicons
          name={name}
          size={size}
          onPress={onPress}
          color={color ?? TEXT_THEME}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      ) : (
        <FontAwesome5
          name={name}
          size={size}
          onPress={onPress}
          color={color ?? TEXT_THEME}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      )}
    </View>
  );
};

export default FitIcon;
