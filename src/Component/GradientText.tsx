import {StyleSheet, View} from 'react-native';
import React from 'react';
import {LinearGradient, Stop, Svg, Text} from 'react-native-svg';

const GradientText = ({
  text,
  fontWeight,
  fontSize,
  width,
  x,
  y,
  height,
  marginTop,
  colors,
  alignSelf,
}: any) => {
  const gradientColors = colors ? colors : ['#D5191A', '#941000'];

  return (
    <View
      style={{
        marginTop: marginTop ? marginTop : 10,
        alignSelf: alignSelf ? 'auto' : 'center',
      }}>
      <Svg
        height={height ? height : '40'}
        width={width ? width : text?.length * 10}>
        <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} />
          <Stop offset="1" stopColor={gradientColors[1]} />
        </LinearGradient>
        <Text
          fontFamily="Poppins"
          fontWeight={fontWeight ? fontWeight : '600'}
          fontSize={fontSize ? fontSize : '16'}
          fill="url(#grad)"
          x={x ? x : '10'}
          y={y ? y : '25'}>
          {text}
        </Text>
      </Svg>
    </View>
  );
};

export default GradientText;

const styles = StyleSheet.create({});
