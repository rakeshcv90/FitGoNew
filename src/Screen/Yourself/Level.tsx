import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';

const Level = ({data, selectedImage, setSelectedImage}: any) => {
  const RenderImage = ({tint}: any) => {
    return (
      <Image
        tintColor={tint}
        source={localImage.PathChargeLevel}
        resizeMode="contain"
        style={{
          height: 25,
          width: 25,
          marginRight: 1,
        }}
      />
    );
  };
  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}>
      {data &&
        data?.map((item: any, index: number) => {
          return (
            <TouchableOpacity
            activeOpacity={1}
              key={index}
              onPress={() => setSelectedImage(index)}>
                <ImageBackground
                  source={item.image}
                  style={[
                      styles.box,
                    {
                        padding: index == selectedImage ? 18 : 20,
                        // paddingRight: index == 0 ? 20 : 0,
                        borderWidth: index == selectedImage ? 3 : 0,
                    },
                  ]}>
                    <LinearGradient
                      start={{x: 0, y: 1}}
                      end={{x: 1, y: 0}}
                      colors={['rgba(41, 47, 69, 0.6)', 'rgba(41, 47, 69, 0.6)']}
                      style={[
                        styles.box2,
                        {
                          padding: index == selectedImage ? 18 : 20,
                          // paddingRight: index == 0 ? 20 : 0,
                          borderWidth: index == selectedImage ? 3 : 0,
                        },
                      ]}>
                  <Text
                    style={{
                      color: AppColor.WHITE,
                      fontSize: 18,
                      fontWeight: '600',
                      fontFamily: 'Poppins',
                      lineHeight: 27,
                    }}>
                    {item.name}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {index == 0 ? (
                      <>
                        <RenderImage />
                        <RenderImage tint={'rgba(255, 255, 255, 0.4)'} />
                        <RenderImage tint={'rgba(255, 255, 255, 0.4)'} />
                      </>
                    ) : index == 1 ? (
                      <>
                        <RenderImage />
                        <RenderImage />
                        <RenderImage tint={'rgba(255, 255, 255, 0.4)'} />
                      </>
                    ) : (
                      <>
                        <RenderImage />
                        <RenderImage />
                        <RenderImage />
                      </>
                    )}
                  </View>
              </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default Level;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 8,
    borderColor: AppColor.BORDERCOLOR2,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  box2: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 8,
    borderColor: AppColor.BORDERCOLOR2,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
