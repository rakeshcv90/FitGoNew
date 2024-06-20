import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, FlatList} from 'react-native';
import Svg, {Line, Defs, Stop} from 'react-native-svg';
import {DeviceHeigth, DeviceWidth} from './Config';
import LinearGradient from 'react-native-linear-gradient';
import { AppColor } from './Color';
import App from '../../App';
const CustomBarChart = ({data, barColor, barWidth, barSpacing}) => { 
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    data.forEach((value, index) => {
      Animated.timing(animatedValues[index], {
        toValue: value?.weight,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  }, []);
  const maxValue = Math.max(...data.map(item => parseFloat(item?.weight)));
  return (
    <View
      style={{
        borderBottomWidth: 1,
        alignSelf: 'center',
        marginTop: 40,
        height: DeviceHeigth * 0.29,
        alignItems: 'center',
      }}>
      <Svg style={styles.svg}>
        {Array.from({length: 5}).map((_, index) => (
          <Line
            key={index}
            x1="0"
            y1={((DeviceHeigth * 0.3) / 5) * index}
            x2="100%"
            y2={((DeviceHeigth * 0.3) / 5) * index}
            stroke="gray"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}
      </Svg>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={[styles.barContainer, {width: barWidth + barSpacing}]}>
            <Text style={styles.label}>{item?.weight}</Text>
            <Animated.View
              style={[
                styles.bar,
                {
                  height: animatedValues[index]?.interpolate({
                    inputRange: [0, maxValue],
                    outputRange: [0, 200],
                  }),
                  backgroundColor: barColor,
                  width: barWidth + barSpacing,
                },
              ]}>
              <LinearGradient
                colors={[AppColor.RED1, AppColor.RED]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={{
                  width: barSpacing+barWidth,
                  height: 200,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}
              />
            </Animated.View>
          </View>
        )}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    elevation: 5,
    width: DeviceWidth * 0.95,
  },
  barContainer: {
    alignItems: 'center',
    marginRight: 10, // Add some spacing between bars
  },
  bar: {
    width: 20,
  },
  label: {
    marginBottom:3,
    fontSize: 14,
    color:AppColor.RED,
    fontWeight:'700'
  },
  svg: {
    position: 'absolute',
    width: DeviceWidth * 0.95,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CustomBarChart;