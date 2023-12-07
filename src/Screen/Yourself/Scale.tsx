import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';

const BOX_HEIGHT = DeviceHeigth * 0.7;
const ITEM_HEIGHT = 25;

const halfItemCount = Math.floor(BOX_HEIGHT / 2 / ITEM_HEIGHT);
const weight = [
  ...Array(halfItemCount + 1).fill(''), // Empty items for the top half
  ...Array(44)
    .fill(0)
    .map((item: any, index, arr) => arr[index] + index / 2),
  ...Array(halfItemCount + 4).fill(''), // Empty items for the bottom half
];
const positions = weight.map(
  (item, index) =>
    (item = {
      start: index * ITEM_HEIGHT,
      end: index * ITEM_HEIGHT + ITEM_HEIGHT,
    }),
);
const Scale = () => {
  const ScaleRef = useRef(null);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(-1);

  const getActiveItem = (y: number) => {
    const halfBoxH = BOX_HEIGHT;
    const Inner = (BOX_HEIGHT - ITEM_HEIGHT) / 2;
    console.log(Inner, halfBoxH, BOX_HEIGHT);
    const center = y + halfBoxH - Inner;
    for (let index = 0; index < positions.length; index++) {
      const {start, end} = positions[index];
      if (center + 25 >= start && center - 25 <= end)
        setCurrentActiveIndex(index);
    }
  };

  useEffect(() => {
    getActiveItem(0);
  }, []);
  return (
    <View
      style={{
        marginTop: 100,
        height: BOX_HEIGHT * 0.7,
        flexDirection: 'row-reverse',
        alignContent: 'center',
        // justifyContent: 'center',
        backgroundColor: 'grey',
      }}>
      <View style={{width: DeviceWidth * 0.6,backgroundColor: 'red',}} />
      <Text
        style={{
          color: AppColor.RED,
          fontSize: 30,
        }}>
        {weight[currentActiveIndex]}
      </Text>
      <FlatList
        ref={ScaleRef}
        data={weight}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        windowSize={10}
        contentContainerStyle={{width: '50%', backgroundColor: 'blue'}}
        onScroll={event => {
          const y = event.nativeEvent.contentOffset.y;
          getActiveItem(y);
        }}
        renderItem={({item, index}: any) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              {index % 2 == 0 ? (
                <View
                  style={{
                    width: DeviceWidth * 0.25,
                    height: 3,
                    backgroundColor:
                      item == '' || currentActiveIndex == index
                        ? 'transparent'
                        : AppColor.RED,
                    borderRadius: 10,
                    marginBottom: currentActiveIndex == index ? 20 : 20,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: DeviceWidth * 0.1,
                    height: 3,
                    backgroundColor:
                      item == '' || currentActiveIndex == index
                        ? 'transparent'
                        : AppColor.BLACK,
                    borderRadius: 10,
                    marginBottom: currentActiveIndex == index ? 20 : 20,
                  }}
                />
              )}
              {/* {currentActiveIndex == index && item != '' && (
                // <View
                //   style={{
                //     flexDirection: 'row',
                //     marginBottom: 20,
                //     alignItems: 'center',
                //     // right: DeviceWidth/ 8,
                //   }}>
                //   <View
                //     style={{
                //       width: 150,
                //       height: 3,
                //       backgroundColor:
                //         item == '' ? 'transparent' : AppColor.RED,
                //       borderRadius: 10,
                //     }}></View>
                <Text
                  style={{
                    color: AppColor.RED,
                    fontSize: 30,
                    marginLeft: DeviceWidth * 0.3,
                    // marginTop: 20
                    marginTop: DeviceHeigth * 0.4-100,
                    position: 'absolute',
                    backgroundColor: 'grey',
                  }}>
                  {item}
                </Text>
                // </View>
              )} */}
              {/* <Text style={{marginBottom: 18}}>{item}</Text> */}
            </View>
          );
        }}
      />
    </View>
  );
};

export default Scale;

const styles = StyleSheet.create({});
