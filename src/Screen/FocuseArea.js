import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {AppColor} from '../Component/Color';

import {localImage} from '../Component/Image';

const FocuseArea = () => {
  const buttonName = [
    {
      id: 1,
      text1: 'Chest',
    },
    {
      id: 2,
      text1: 'Shoulder',
    },
    {
      id: 3,
      text1: 'Biceps',
    },
  ];
  const buttonName1 = [
    {
      id: 4,
      text1: 'Abs',
    },
    {
      id: 5,
      text1: 'Triceps',
    },
    {
      id: 6,
      text1: 'Legs',
    },
    // {
    //   id: 7,
    //   text1: 'Back',
    // },
  ];
  return (
    <SafeAreaView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginRight: 10,
          marginTop: 10,
        }}>
        <Text style={styles.textStyle}>Step 2 of 10</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          width: DeviceWidth * 0.9,
          height: 10,
          alignItems: 'center',
          backgroundColor: 'red',
          alignSelf: 'center',
          borderRadius: 20,
          marginTop: DeviceHeigth * 0.03,
        }}></View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: DeviceHeigth * 0.05,
        }}>
        <Text style={styles.textStyle}>Select your Focus area</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: DeviceWidth / 2.7,
            height: DeviceHeigth,
            padding: 5,
          }}>
          <View style={{top: DeviceHeigth * 0.06, height: DeviceHeigth * 0.7}}>
            <FlatList
              data={buttonName}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                //const isSelected = selectedItems.includes(item.id);
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.buttonView,
                      {
                        marginVertical: DeviceHeigth * 0.04,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      /// setImageFocusArea(item.id, item.text1);
                    }}>
                    <Text>{item.text1}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View
          style={{
            height: DeviceHeigth,
          }}>
          <View
            style={{
              height: DeviceHeigth * 0.7,
              left: -DeviceWidth * 0.15,
            }}>
            <Image
              source={localImage.FEMALE}
              style={styles.Image}
              resizeMode="contain"
            />
          </View>

          {/* <View>
            <View
              style={{
                width: DeviceWidth * 0.31,
                height: DeviceHeigth * 0.35,
                position: 'absolute',
                left: -DeviceWidth * 0.01,
                top:
                  Platform.OS == 'android'
                    ? -DeviceHeigth * 0.55
                    : DeviceHeigth == '1024'
                    ? -DeviceHeigth * 0.59
                    : -DeviceHeigth * 0.55,
              }}>
              <Image
                source={localImage.Ellipse}
                style={styles.Image2}
                resizeMode="contain"
              />
            </View>
          </View> */}
          {/* <View>
            <View
              style={{
                width: DeviceWidth * 0.31,
                height: DeviceHeigth * 0.35,
                position: 'absolute',
                left:
                  Platform.OS == 'android'
                    ? -DeviceHeigth * 0.038
                    : DeviceHeigth == '1024'
                    ? -DeviceHeigth * 0.05
                    : -DeviceHeigth * 0.035,
                top:
                  Platform.OS == 'android'
                    ? -DeviceHeigth * 0.55
                    : DeviceHeigth == '1024'
                    ? -DeviceHeigth * 0.59
                    : -DeviceHeigth * 0.54,
              }}>
              <Image
                source={localImage.Solder}
                style={[styles.Image2, {height: DeviceHeigth * 0.05}]}
                resizeMode="contain"
              />
            </View>
          </View> */}
          <View>
            <View
              style={{
                width: DeviceWidth * 0.31,
                height: DeviceHeigth * 0.35,
                position: 'absolute',
                left:
                  Platform.OS == 'android'
                  ? DeviceHeigth * 0.037
                  : DeviceHeigth == '1024'
                  ? DeviceHeigth * 0.049
                  :  DeviceHeigth * 0.035,
                top:
                Platform.OS == 'android'
                ? -DeviceHeigth * 0.55
                : DeviceHeigth == '1024'
                ? -DeviceHeigth * 0.58
                : -DeviceHeigth * 0.54,
              }}>
              <Image
                source={localImage.Solder1}
                style={[styles.Image2,{height:DeviceHeigth * 0.05}]}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: DeviceWidth / 3,
            height: DeviceHeigth,
          }}>
          <View
            style={{
              top: DeviceHeigth * 0.13,
              height: DeviceHeigth * 0.7,
              left: -DeviceWidth * 0.23,
            }}>
            <FlatList
              data={buttonName1}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                //const isSelected = selectedItems.includes(item.id);
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.buttonView,
                      {
                        marginVertical: DeviceHeigth * 0.04,
                        borderWidth: 1,
                        // marginLeft: 20,
                      },
                    ]}
                    onPress={() => {
                      /// setImageFocusArea(item.id, item.text1);
                    }}>
                    <Text>{item.text1}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  buttonView: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.06,
    backgroundColor: AppColor.WHITE,

    borderColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 50,

    // shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
        shadowRadius: 3,
      },
    }),
  },
  imageView: {
    flexDirection: 'row',
    width: DeviceWidth,
    height: DeviceHeigth * 0.7,
  },
  shadow: {
    width: DeviceWidth,
  },
  Image: {
    width: DeviceWidth / 2,
    height: DeviceHeigth * 0.7,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  LoginText2: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#3A4750',
    lineHeight: 20,
  },
  Image2: {
    width: DeviceWidth * 0.2,
    height: DeviceHeigth * 0.1,
    marginLeft: DeviceWidth * 0.02,
  },
});
export default FocuseArea;
