import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {DeviceHeigth, DeviceWidth} from './Config';
import {AppColor} from './Color';

import {localImage} from './Image';
import ProgressBar from '../Screen/Yourself/ProgressBar';
import { useSelector } from 'react-redux';

const FocuseAreaFmale = ({imageView,setImageVIew}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  // const [imageView, setImageVIew] = useState([]);
  const {defaultTheme, completeProfileData, getLaterButtonData} = useSelector(
    (state) => state,
  );

  const setImageFocusArea = (itemId, item) => {
    const index = selectedItems.indexOf(itemId);
    const newSelectedItems = [...selectedItems];
    const newImageVIew = [...imageView];
    if (index === -1) {
      newSelectedItems.push(itemId);
      newImageVIew.push(item);
    } else {
      newSelectedItems.splice(index, 1);

      const imageVIewIndex = newImageVIew.indexOf(item);
      if (imageVIewIndex !== -1) {
        newImageVIew.splice(imageVIewIndex, 1);
      }
    }

    setSelectedItems(newSelectedItems);
    setImageVIew(newImageVIew);
  };

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
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
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
                const isSelected = selectedItems.includes(item.id);
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.buttonView,
                      {
                        marginVertical: DeviceHeigth * 0.04,
                        borderWidth: isSelected ? 1 : 0,
                        borderColor: isSelected ? 'red' : AppColor.WHITE,
                      },
                    ]}
                    onPress={() => {
                      setImageFocusArea(item.id, item.text1);
                    }}>
                    <Text
                      style={{
                        color: '#505050',
                        fontFamily: 'Poppins',
                        fontWeight: '500',
                      }}>
                      {item.text1}
                    </Text>
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
              source={   {uri: getLaterButtonData[0].image}}
              style={styles.Image}
              resizeMode="contain"
            />
          </View>
          {imageView != 0 && (
            <View>
              <View>
                {imageView.find(num => num === 'Chest') && (
                  <View
                    style={{
                      width: DeviceWidth * 0.3,
                      height: DeviceHeigth * 0.3,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? DeviceHeigth * 0.02
                          : DeviceHeigth == '1024'
                          ? DeviceHeigth * 0.03
                          : DeviceHeigth * 0.02,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.55
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.58
                          : -DeviceHeigth * 0.54,
                    }}>
                    <Image
                      source={localImage.Ellipse}
                      style={[
                        styles.Image2,
                        {width: DeviceWidth * 0.1, height: DeviceHeigth * 0.05},
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View>
                {imageView.find(num => num === 'Shoulder') && (
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
                )}
              </View>
              <View>
                {imageView.find(num => num === 'Shoulder') && (
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
                          : DeviceHeigth * 0.035,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.55
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.58
                          : -DeviceHeigth * 0.54,
                    }}>
                    <Image
                      source={localImage.Solder1}
                      style={[styles.Image2, {height: DeviceHeigth * 0.05}]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View>
                {imageView.find(num => num === 'Biceps') && (
                  <View
                    style={{
                      width: DeviceWidth * 0.2,
                      height: DeviceHeigth * 0.4,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? DeviceHeigth * 0.085
                          : DeviceHeigth == '1024'
                          ? DeviceHeigth * 0.11
                          : DeviceHeigth * 0.08,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.525
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.53
                          : -DeviceHeigth * 0.5,
                    }}>
                    <Image
                      source={localImage.Leg}
                      style={[
                        styles.Image2,
                        {
                          height: DeviceHeigth * 0.05,
                          width: DeviceWidth * 0.07,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View>
                {imageView.find(num => num === 'Abs') && (
                  <View
                    style={{
                      width: DeviceWidth * 0.2,
                      height: DeviceHeigth * 0.4,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? DeviceHeigth * 0.001
                          : DeviceHeigth == '1024'
                          ? DeviceHeigth * 0.0004
                          : DeviceHeigth * 0.001,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.47
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.49
                          : -DeviceHeigth * 0.47,
                    }}>
                    <Image
                      source={localImage.Abs}
                      style={[
                        styles.Image2,
                        {height: DeviceHeigth * 0.06, width: DeviceWidth * 0.2},
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View>
                {imageView.find(num => num === 'Triceps') && (
                  <View
                    style={{
                      width: DeviceWidth * 0.2,
                      height: DeviceHeigth * 0.4,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? DeviceHeigth * 0.085
                          : DeviceHeigth == '1024'
                          ? DeviceHeigth * 0.11
                          : DeviceHeigth * 0.08,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.525
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.53
                          : -DeviceHeigth * 0.5,
                    }}>
                    <Image
                      source={localImage.Leg}
                      style={[
                        styles.Image2,
                        {
                          height: DeviceHeigth * 0.05,
                          width: DeviceWidth * 0.07,
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View>
                {imageView.find(num => num === 'Legs') && (
                  <View
                    style={{
                      width: DeviceWidth * 0.2,
                      height: DeviceHeigth * 0.4,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.09
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.142
                          : -DeviceHeigth * 0.085,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.41
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.41
                          : -DeviceHeigth * 0.41,
                    }}>
                    <Image
                      source={localImage.Leg}
                      style={[
                        styles.Image2,
                        {height: DeviceHeigth * 0.1, width: DeviceWidth * 0.5},
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
            </View>
          )}
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
                const isSelected = selectedItems.includes(item.id);
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.buttonView,
                      {
                        marginVertical: DeviceHeigth * 0.04,
                        borderWidth: isSelected ? 1 : 0,
                        borderColor: isSelected ? 'red' : AppColor.WHITE,
                      },
                    ]}
                    onPress={() => {
                      setImageFocusArea(item.id, item.text1);
                    }}>
                    <Text
                      style={{
                        color: '#505050',
                        fontFamily: 'Poppins',
                        fontWeight: '500',
                      }}>
                      {item.text1}
                    </Text>
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
    backgroundColor: 'white',
  },
  buttonView: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.04,
    backgroundColor: AppColor.WHITE,

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
export default FocuseAreaFmale;
