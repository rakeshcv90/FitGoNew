import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';

const Goal = ({data, selectedImage, setSelectedImage}: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}>
      {data &&
        data?.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedImage(index)}
              style={[
                styles.box,
                {
                  padding: index == selectedImage ? 18 : 20,
                  paddingRight: index == 0 ? 20 : 0,
                  borderWidth: index == selectedImage ? 3 : 0,
                  backgroundColor: item.color,
                },
              ]}>
              <Text
                style={{
                  color: '#505050',
                  fontSize: 18,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 27,
                }}>
                {item.name}
              </Text>
              <Image
                source={item.image}
                resizeMode="contain"
                style={{
                  height: index == 0 ? DeviceHeigth * 0.17 : DeviceHeigth * 0.2,
                  width: DeviceWidth * 0.3,
                }}
              />
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 6,
    borderColor: AppColor.BORDERCOLOR2,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
