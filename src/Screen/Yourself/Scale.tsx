import {FlatList, StyleSheet, Vibration, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';

const BOX_HEIGHT = DeviceHeigth * 0.7;
const ITEM_HEIGHT = 25;

const Scale = ({setActiveIndex, activeIndex, data, posData, type}: any) => {
  const ScaleRef = useRef(null);

  const getActiveItem = (y: number) => {
    const halfBoxH = BOX_HEIGHT;
    const Inner = (BOX_HEIGHT - ITEM_HEIGHT) * 0.7;
    const center = y + halfBoxH - Inner;
    for (let index = 0; index < posData.length; index++) {
      const {start, end} = posData[index];
      if (center + 25 >= start && center - 25 <= end) {
        console.log(center, index);
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    getActiveItem(0);
  }, []);
  return (
    <View
      style={{
        height: BOX_HEIGHT * 0.7,
        flexDirection: 'row',
        alignItems: 'center',
        width: DeviceWidth * 0.3,
        alignSelf: 'flex-start',
      }}>
      {/* <View style={{width: DeviceWidth * 0.6}} /> */}
      <FlatList
        ref={ScaleRef}
        data={data}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        windowSize={10}
        contentContainerStyle={{width: '50%'}}
        onScroll={event => {
          Vibration.vibrate(100)
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
              {index % 12 == 0 ? (
                <View
                  style={{
                    width: DeviceWidth * 0.25,
                    height: 3,
                    backgroundColor: item == '' ? 'transparent' : AppColor.RED,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: DeviceWidth * 0.1,
                    // width:
                    //   activeIndex == index
                    //     ? DeviceWidth * 0.3
                    //     : DeviceWidth * 0.1,
                    height: 3,
                    backgroundColor:
                      item == '' ? 'transparent' : AppColor.BLACK,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default Scale;

const styles = StyleSheet.create({});
