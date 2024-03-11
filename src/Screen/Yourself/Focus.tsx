import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';

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
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: DeviceWidth * 0.8,
        }}
        renderItem={({item}: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedImage(item?.bodypart_id)}
              style={{
                marginBottom: 20,
              }}>
              <View
                style={[
                  styles.box,
                  {
                    // padding: item?.bodypart_id == selectedImage ? 18 : 20,
                    marginRight: DeviceWidth * 0.2,
                    borderWidth: item?.bodypart_id == selectedImage ? 1.5 : 1,
                    borderColor:
                      item?.bodypart_id == selectedImage
                        ? AppColor.RED
                        : 'white',
                        backgroundColor: '#f5f5f5',
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
                ]}>
                <Image
                  source={{
                    uri: item.bodypart_image,
                  }}
                  resizeMode="contain"
                  style={{
                    height: DeviceWidth * 0.28,
                    width: DeviceWidth * 0.28,
                  }}
                />
              </View>
              <Text
                style={{
                  color: AppColor.LITELTEXTCOLOR,
                  fontSize: 16,
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  lineHeight: 24,
                  marginLeft: '15%',
                  marginTop: '3%',
                }}>
                {item.bodypart_title}
              </Text>
            </TouchableOpacity>
          );
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default Focus;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.3,
    height: DeviceWidth * 0.3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: 'hidden',
    // flexDirection: 'row',
  },
});
