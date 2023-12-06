import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';

const RenderImage = ({tint}: any) => {
  return (
    <Image
      tintColor={tint ? tint : 'rgba(235, 148, 137, 0.79)'}
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
const Level = ({data, selectedImage, setSelectedImage}: any) => {
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
          // if (item.goal_gender != selectedGender) return;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedImage(index)}
              style={[
                styles.box,
                {
                  padding: index == selectedImage ? 18 : 20,
                  paddingRight: index == 0 ? 20 : 10,
                  borderWidth: index == selectedImage ? 1 : 0,
                  borderColor: index == selectedImage ?AppColor.RED: AppColor.WHITE,
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
              <View style={{flexDirection: 'row'}}>
                {index == 0 ? (
                  <>
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage />
                    <RenderImage />
                    <RenderImage />
                  </>
                ) : index == 1 ? (
                  <>
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage />
                    <RenderImage />
                  </>
                ) : index == 2 ? (
                  <>
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage />
                  </>
                ) : (
                  <>
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage tint={AppColor.RED} />
                    <RenderImage tint={AppColor.RED} />
                  </>
                )}
              </View>
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
    height: DeviceHeigth / 10,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // overflow: 'hidden',
    backgroundColor: '#fff',
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
