import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import React, {FC} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type IconTypes = {
  type: 'MaterialCommunityIcons' | 'AntDesign' | 'MaterialIcons';
  color?: string;
  size: number;
  onPress?: () => void;
  name: string;
  mL?: number;
  mR?: number;
  style?: TextStyle;
};

const FitIcon: FC<IconTypes> = ({
  size,
  type,
  color,
  onPress,
  name,
  mR,
  mL,
  style,
}) => {
  return (
    <View>
      {type == 'AntDesign' ? (
        <AntDesign
          name={name}
          size={size}
          onPress={onPress}
          color={color}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      ) : type == 'MaterialIcons' ? (
        <MaterialIcons
          name={name}
          size={size}
          onPress={onPress}
          color={color}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      ) : (
        <MaterialCommunityIcons
          name={name}
          size={size}
          onPress={onPress}
          color={color}
          style={[style ? style : {marginLeft: mL ?? 0, marginRight: mR ?? 0}]}
        />
      )}
    </View>
  );
};

export default FitIcon;

const styles = StyleSheet.create({});
