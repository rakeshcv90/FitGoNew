import {FlatList, StyleSheet, Text, Vibration, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';

const BOX_HEIGHT = DeviceHeigth * 0.7;
const BOX_WEIGHT = DeviceWidth * 0.7;
const ITEM_HEIGHT = 25;

const Scale = ({setActiveIndex, activeIndex, data, posData, h}: any) => {
  const ScaleRef = useRef(null);

  const getActiveItem = (y: number) => {
    const halfBoxH = h ? BOX_WEIGHT : BOX_HEIGHT;
    const Inner = (halfBoxH - ITEM_HEIGHT) * 0.7;
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
    getActiveItem(50);
  }, []);
  return (
    <View>
      {h ? (
        <View
          style={{
            // height: BOX_HEIGHT * 0.3,
            // flexDirection: 'row',
            alignItems: 'center',
            width: DeviceWidth * 0.9,
            alignSelf: 'center',
            // backgroundColor: 'red',
          }}>
          {/* <View style={{width: DeviceWidth * 0.6}} /> */}
          <FlatList
            ref={ScaleRef}
            data={data}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            windowSize={10}
            contentContainerStyle={{
              height: DeviceHeigth * 0.3,
              alignItems: 'center',
            }}
            onScroll={event => {
              Vibration.vibrate(100);
              const y = event.nativeEvent.contentOffset.x;
              getActiveItem(y);
            }}
            renderItem={({item, index}: any) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  {/* <Text>{index}</Text> */}
                  {index % 12 == 0 ? (
                    <View
                      style={{
                        height: DeviceWidth * 0.2,
                        width: 3,
                        backgroundColor:
                          item == '' ? 'transparent' : AppColor.RED,
                        borderRadius: 10,
                        marginRight: 10,
                        marginBottom: 30
                      }}
                    />
                  ) :index % 4 == 0 ? (
                    <View
                      style={{
                        height: DeviceWidth * 0.15,
                        width: 3,
                        backgroundColor:
                          item == '' ? 'transparent' : AppColor.RED,
                        borderRadius: 10,
                        marginRight: 10,
                        marginBottom: 20
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        height: DeviceWidth * 0.1,
                        // width:
                        //   activeIndex == index
                        //     ? DeviceWidth * 0.3
                        //     : DeviceWidth * 0.1,
                        width: 3,
                        backgroundColor:
                          item == '' ? 'transparent' : AppColor.BLACK,
                        borderRadius: 10,
                        marginRight: 10,
                      }}
                    />
                  )}
                </View>
              );
            }}
          />
        </View>
      ) : (
        <View
          style={{
            height: BOX_HEIGHT * 0.7,
            flexDirection: 'row',
            alignItems: 'center',
            width: DeviceWidth * 0.3,
            alignSelf: 'flex-start',
          }}>
          <FlatList
            ref={ScaleRef}
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            windowSize={10}
            contentContainerStyle={{width: '50%'}}
            onScroll={event => {
              Vibration.vibrate(100);
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
                        backgroundColor:
                          item == '' ? 'transparent' : AppColor.RED,
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
      )}
    </View>
  );
};

export default Scale;

const styles = StyleSheet.create({});