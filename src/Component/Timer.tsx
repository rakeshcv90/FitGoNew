import React, {FC, useEffect, useState} from 'react';
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

export type Props = ViewProps & {
  boxHeight: number;
  boxData: Array<any>;
  startRangeData?: Array<any>;
  endRangeData?: Array<any>;
};

const Timer: FC<Props> = ({...Props}) => {
  const defaultTheme = useSelector((state:any) => state.defaultTheme);
  const [gestureY] = useState(new Animated.Value(0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Array<number | null>>(
    Array(Props.boxData.length).fill(null),
  );

  const handleScrollEnd = (index: number, offsetY: number) => {
    const middleIndex = Math.round(offsetY / Props.boxHeight);
    const currentValues = numberRange[index];

    if (currentValues && currentValues.length > middleIndex) {
      const selectedVal = currentValues[middleIndex];
      setSelectedValues(prevValues => {
        const newValues = [...prevValues];
        newValues[index] = selectedVal;
        return newValues;
      });
    }
   
  };
  const generateNumberRange = (start: any, end: any) => {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const numberRange = Props.boxData
    ? Props.boxData.map((item: any, index: number) => {
        if (typeof item !== 'object') {
          // If it's a number, generate a number range
          return generateNumberRange(
            Props.startRangeData[index],
            Props.endRangeData[index],
          );
        } else if (typeof item === 'object') {
          // If it's an array of numbers, use it directly
          return Object.values(item).map(item => item);
        } else {
          // Handle other cases, such as an array of objects
          // You can customize this part based on your data structure
          return [];
        }
      })
    : [];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: Animated.event([null, {dy: gestureY}]),
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dy) > 50) {
        Animated.timing(gestureY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Implement snap behavior
        Animated.spring(gestureY, {
          toValue: 0,
          velocity: gestureState.vy,
          tension: 10,
          friction: 2,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const translateY = gestureY;

  return (
    <GestureHandlerRootView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <Text
        style={{
          color: defaultTheme ? '#fff' : '#535763',
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 30,
        }}>
        Timer
      </Text> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {Props.boxData &&
          Props.boxData.map((item: any, index: number) => {
            const handlePanResponderRelease = (e: any) => {
              handleScrollEnd(index, e.nativeEvent.contentOffset.y);
            };

            return (
              <PanGestureHandler
                key={index}
                // onPanResponderRelease={handlePanResponderRelease}
                {...panResponder.panHandlers}>
                <Animated.View
                  style={[
                    styles.box,
                    {
                      borderColor: defaultTheme ? '#fff' : '#535763',
                      height: Props.boxHeight ? Props.boxHeight : 50,
                      width: '25%',
                      transform: [{translateY}],
                    },
                  ]}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}
                    contentContainerStyle={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onScroll={(event) =>
                      handleScrollEnd(index, event.nativeEvent.contentOffset.y)
                    }
                    scrollEventThrottle={16}
                    snapToInterval={Props.boxHeight} // Adjust the interval based on your design
                    snapToAlignment="center"
                    decelerationRate="fast">
                    {numberRange[index].map((num: any, i: number) => {
                      return (
                        <Text
                          style={{
                            color: defaultTheme ? '#fff' : '#535763',
                            fontSize: Props.boxHeight
                              ? Props.boxHeight - 20
                              : 30,
                            fontWeight: 'bold',
                          }}>
                          {num}
                        </Text>
                      );
                    })}
                  </ScrollView>
                </Animated.View>
              </PanGestureHandler>
            );
          })}
      </View>
    </GestureHandlerRootView>
  );
};

export default Timer;

const styles = StyleSheet.create({
  box: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden',
  },
});
