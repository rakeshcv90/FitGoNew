import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Carousel from 'react-native-snap-carousel';
import {AppColor} from '../../Component/Color';

const Gender = ({data, selectedImage, setSelectedImage}: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}>
      {/* <Carousel
          data={data.data}
          sliderWidth={DeviceWidth}
          itemWidth={DeviceWidth * 0.75}
          enableSnap
          firstItem={selectedImage}
          onSnapToItem={(index: number) => setSelectedImage(index)}
          renderItem={({item, index}: any) => (
            <View
              key={index}
              style={{
                flexDirection: index == 0 ? 'row' : 'row-reverse',
                width: '55%',
                opacity: index == selectedImage ? 1 : 0.4,
                // backgroundColor: 'blue',
              }}>
              {index == 0 && (
                <View
                  style={{
                    width: '70%',
                  }}
                />
              )}
              <View
                key={index}
                style={{
                  width: '60%',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                {index < 2 && (
                  <Image
                    source={localImage.GENDER}
                    resizeMode="contain"
                    style={{
                      position: 'absolute',
                      top: DeviceHeigth * 0.2,
                      alignSelf: 'center',
                      left: -DeviceWidth * 0.1,
                      opacity: index == selectedImage ? 1 : 0,
                    }}
                  />
                )}
                {index <= 2 && (
                  <>
                    <Image
                      source={item.image}
                      resizeMode="contain"
                      style={{
                        height: DeviceHeigth * 0.5,
                        width: DeviceWidth * 0.5,
                        zIndex: index === 0 ? 1 : 0,
                      }}
                    />
                    <Text
                      style={{
                        color: AppColor.RED,
                        fontSize: 16,
                        fontWeight: '700',
                        fontFamily: 'Verdana',
                        marginTop: -DeviceWidth * 0.1,
                      }}>
                      {item.name}
                    </Text>
                  </>
                )}
              </View>

              {index == 2 && (
                <View
                  style={{
                    width: '70%',
                  }}
                />
              )}
            </View>
          )}
        /> */}
      {data &&
        data?.map((item: any, index: number) => {
          // if (item.gender != selectedGender) return;
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
                  borderWidth: index == selectedImage ? 1 : 0,
                  borderColor:
                    index == selectedImage
                      ? AppColor.RED
                      : AppColor.WHITE,
                  marginVertical: 10,
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
                defaultSource={1}
                resizeMode="contain"
                style={{
                  height: DeviceHeigth * 0.17,
                  width: DeviceWidth * 0.3,
                  marginBottom: 25,
                  // marginRight:
                  //   selectedGender == 'Female' && index != 0 ? 25 : 0,
                }}
              />
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default Gender;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 7,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // overflow: 'hidden',
    backgroundColor: AppColor.WHITE,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
