import {
  FlatList,
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

const Focus = ({data, selectedImage, setSelectedImage, data2}: any) => {
  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <FlatList
        data={data2}
        showsVerticalScrollIndicator={false}
        renderItem={({item}: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedImage(item?.bodypart_id)}
              style={[
                styles.box,
                {
                  padding: item?.bodypart_id == selectedImage ? 18 : 20,
                  paddingRight: index == 0 ? 20 : 0,
                  borderColor:
                    item?.bodypart_id == selectedImage
                      ? AppColor.BORDERCOLOR2
                      : AppColor.LITELTEXTCOLOR,
                },
              ]}>
              <Text
                style={{
                  color: AppColor.LITELTEXTCOLOR,
                  fontSize: 16,
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  lineHeight: 24,
                }}>
                {item.bodypart_title}
              </Text>
              <Image
                source={{
                  uri: item.bodypart_image,
                }}
                resizeMode="contain"
                style={{
                  height: index == 0 ? DeviceHeigth * 0.17 : DeviceHeigth * 0.2,
                  width: DeviceWidth * 0.3,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Focus;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.8,
    height: DeviceHeigth / 12,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
  },
});
