import React, {useRef} from 'react';
import {Animated, Text, View, StyleSheet} from 'react-native';
import {DeviceHeigth, DeviceWidth} from './Config';
import {AppColor} from './Color';
const CustomPicker = props => {
  const {
    items,
    onIndexChange,
    itemHeight,
    toggle,
    textStyle,
    width,
    outputRange,
    ActiveIndex,
  } = props;
  const scrollY = useRef(new Animated.Value(0)).current;
  const modifiedItems = ['', '', ...items, '', ' '];
  const renderItem = ({item, index}) => {
    const inputRange = [
      (index - 4) * itemHeight,
      (index - 3) * itemHeight,
      (index - 2) * itemHeight,
      (index - 1) * itemHeight,
      index * itemHeight,
    ];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: outputRange || [1, 1.4, 2.8, 1.4, 1],
    });
    return (
      <Animated.View
        style={[
          {height: itemHeight, transform: [{scale}]},
          styles.animatedContainer,
        ]}>
        <Text
          style={[
            textStyle,
            styles.pickerItem,
            {
              textAlign: 'center',
              color: ActiveIndex == index - 2 ? '#ed4530' : 'lightgrey',
            },
          ]}>
          {`${
            toggle == 'kg' || toggle == ''
              ? item
              : index == 0 ||
                index == modifiedItems.length - 1 ||
                index == 1 ||
                index == modifiedItems.length - 2
              ? ''
              : (item * 2.2).toFixed(2)
          } `}
        </Text>
      </Animated.View>
    );
  };

  const momentumScrollEnd = event => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight).toFixed(0);
    onIndexChange(index);
  };
  return (
    <View
      style={{
        height: itemHeight * 5,
        justifyContent: 'center',
        width: width || DeviceWidth,
        marginTop: toggle == '' ? DeviceWidth * 0.05 : DeviceHeigth * 0.08,
        marginRight: toggle == '' ? 20 : 0,
      }}>
      <Animated.FlatList
        data={modifiedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={30}
        initialNumToRender={5}
        keyExtractor={(_, index) => index.toString()}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
      />
      <View style={[styles.indicatorHolder, {top: itemHeight * 2}]}>
        <View
          style={[
            styles.indicator,
            {
              width: toggle == '' ? 60 : 120,
            },
          ]}
        />
        {toggle != '' && (
          <Text
            style={{
              color: AppColor.RED,
              position: 'absolute',
              fontSize: 30,
              textAlign: 'center',
              lineHeight: itemHeight,
              left: toggle == 'kg' ? 100 : 150,
              fontWeight: '700',
            }}>
            {toggle == 'kg' ? 'kg' : 'lb'}
          </Text>
        )}
        <View
          style={[
            styles.indicator,
            {marginTop: itemHeight, width: toggle == '' ? 60 : 120},
          ]}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  pickerItem: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    // textAlignVertical: 'center',
    color: AppColor.RED,
  },
  indicatorHolder: {
    position: 'absolute',
    alignSelf: 'center',
  },
  indicator: {
    height: 1,
    // backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:1,
  },
});

export default CustomPicker;
