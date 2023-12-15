import React, {useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

const CustomAnimatedChart = () => {
  const data = [40, 70, 90, 60, 80]; // Replace this with your data points

  const chartHeight = 200; // Height of the chart

  const chartWidth = 300; // Width of the chart

  const animatedValues = data.map(() => new Animated.Value(0));

  const animateChart = () => {
    Animated.stagger(
      200,
      animatedValues.map(value =>
        Animated.timing(value, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ),
    ).start();
  };

  useEffect(() => {
    animateChart();
  }, []);

  const RenderLines = () => {
    const step = chartWidth / (data.length - 1);
    const lines = [];

    for (let i = 0; i < data.length - 1; i++) {
      const lineStart = i * step;
      const lineEnd = (i + 1) * step;

      const animatedLineHeight = animatedValues[i]?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, chartHeight - (data[i] / 100) * chartHeight],
      });

      lines.push(
        <Animated.View
          key={i}
          style={[
            styles.line,
            {
              height: animatedLineHeight,
              left: lineStart,
              width: lineEnd - lineStart,
              margin:2
            },
          ]}
        />,
      );
    }

    return lines;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.chartContainer,
          {width: chartWidth, height: chartHeight,},
        ]}>
       <renderLines/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'blue', // Change color as needed
  },
});

export default CustomAnimatedChart;
