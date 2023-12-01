import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';

const Goal = ({data, selectedImage, setSelectedImage, selectedGender}: any) => {
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
          if (item.gender != selectedGender) return;
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
                  width:
                    selectedGender == 'Female' && index == 1
                      ? DeviceWidth * 0.28
                      : selectedGender == 'Female' && index == 2
                      ? DeviceWidth * 0.38
                      : DeviceWidth * 0.33,
                  marginRight:
                    selectedGender == 'Female' && index != 0 ? 25 : 0,
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
