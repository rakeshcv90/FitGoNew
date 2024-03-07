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
import {useDispatch, useSelector} from 'react-redux';

const FocuseAreaMale = ({selectedItems, setSelectedItems}) => {
  const dispatch = useDispatch();
  // const {defaultTheme, completeProfileData, getUserID} = useSelector(
  //   state => state,
  // );
  const defaultTheme = useSelector(state => state.defaultTheme);
  const completeProfileData = useSelector(state => state.completeProfileData);
  const getUserID = useSelector(state => state.getUserID);
  
  const [imageView, setImageVIew] = useState([]);
  const [bodyPart, setBordyPart] = useState(
    completeProfileData?.focusarea.filter(
      part =>
        part.bodypart_title !== 'Quads' &&
        part.bodypart_title !== 'Back' &&
        part.bodypart_title !== 'Legs' &&
        part.bodypart_title !== 'Triceps' &&
        part.bodypart_title !== 'Abs',
    ),
  );

  const [bodyPart2, setBordyPart2] = useState(
    completeProfileData?.focusarea.filter(
      part =>
        part.bodypart_title !== 'Quads' &&
        part.bodypart_title !== 'Back' &&
        part.bodypart_title !== 'Shoulders' &&
        part.bodypart_title !== 'Chest' &&
        part.bodypart_title !== 'Biceps',
    ),
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
          <View style={{top: DeviceHeigth * 0.005, height: DeviceHeigth * 0.7}}>
            <FlatList
              data={bodyPart}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
              
                const isSelected = selectedItems.includes(item.bodypart_id);
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.buttonView,
                      {
                        marginVertical: DeviceHeigth * 0.04,
                        left: -10,
                        borderWidth: isSelected ? 1 : 0,
                        borderColor: isSelected ? 'red' : AppColor.WHITE,
                      },
                    ]}
                    onPress={() => {
                      setImageFocusArea(item.bodypart_id, item.bodypart_title);
                    }}>
                    <Text
                      style={{
                        color: '#505050',
                        fontFamily: 'Poppins',
                        fontWeight: '500',
                      }}>
                      {item.bodypart_title}
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
              left: -DeviceWidth * 0.09,
            }}>
            <Image
              source={{
                uri: 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/25357fb6-c174-4a3d-995c-77641d9ea900/public',
              }}
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
                          ? -DeviceHeigth * 0.05
                          : DeviceHeigth == 1024
                          ? -DeviceHeigth * 0.09
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.06
                          : -DeviceHeigth * 0.05,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.53
                          : DeviceHeigth == 1024
                          ? -DeviceHeigth * 0.56
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.56
                          : -DeviceHeigth * 0.53,
                    }}>
                    <Image
                      source={localImage.Chest}
                      style={[
                        styles.Image2,
                        {width: DeviceWidth * 0.4, height: DeviceHeigth * 0.07},
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View>
             
                {imageView.find(num => num === 'Shoulders') && (
                  <View
                    style={{
                      width: DeviceWidth * 0,
                      height: DeviceHeigth * 0.35,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? DeviceHeigth <= 807.2727272727273
                            ? -DeviceHeigth * 0.04
                            : DeviceHeigth <= 845.7142857142857
                            ? -DeviceHeigth * 0.045
                            : -DeviceHeigth * 0.042
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.058
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.057
                          : -DeviceHeigth * 0.044,
                      top:
                        Platform.OS == 'android'
                          ? DeviceHeigth == 800
                            ? -DeviceHeigth * 0.52
                            : DeviceHeigth <= 807.2727272727273
                            ? -DeviceHeigth * 0.53
                            : DeviceHeigth <= 845.7142857142857
                            ? -DeviceHeigth * 0.53
                            : -DeviceHeigth * 0.52
                          : DeviceHeigth == 1024
                          ? -DeviceHeigth * 0.561
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.56
                          : -DeviceHeigth * 0.525,
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
                {imageView.find(num => num === 'Shoulders') && (
                  <View
                    style={{
                      width: DeviceWidth * 0.31,
                      height: DeviceHeigth * 0.35,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? DeviceHeigth <= 807.2727272727273
                            ? DeviceHeigth * 0.039
                            : DeviceHeigth <= 845.7142857142857
                            ? DeviceHeigth * 0.045
                            : DeviceHeigth * 0.035
                          : DeviceHeigth == '1024'
                          ? DeviceHeigth * 0.049
                          : DeviceHeigth == 667
                          ? DeviceHeigth * 0.055
                          : DeviceHeigth * 0.035,
                      top:
                        Platform.OS == 'android'
                          ? DeviceHeigth == 800
                            ? -DeviceHeigth * 0.523
                            : DeviceHeigth <= 807.2727272727273
                            ? -DeviceHeigth * 0.54
                            : -DeviceHeigth * 0.523
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.58
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.56
                          : -DeviceHeigth * 0.53,
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
                          ? DeviceHeigth * 0.12
                          : DeviceHeigth == 667
                          ? DeviceHeigth * 0.11
                          : DeviceHeigth * 0.09,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.525
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.53
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.53
                          : -DeviceHeigth * 0.5,
                    }}>
                    <Image
                      source={localImage.Leg}
                      style={[
                        styles.Image2,
                        {
                          height: DeviceHeigth * 0.07,
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
                          ? -DeviceHeigth * 0.019
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.02
                          : -DeviceHeigth * 0.015,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.46
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.47
                          : -DeviceHeigth * 0.46,
                    }}>
                    <Image
                      source={localImage.Abs2}
                      style={[
                        styles.Image2,
                        {
                          height: DeviceHeigth * 0.065,
                          width: DeviceWidth * 0.2,
                        },
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
                          ? DeviceHeigth * 0.12
                          : DeviceHeigth == 667
                          ? DeviceHeigth * 0.11
                          : DeviceHeigth * 0.09,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.525
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.53
                          : DeviceHeigth == 667
                          ? -DeviceHeigth * 0.53
                          : -DeviceHeigth * 0.5,
                    }}>
                    <Image
                      source={localImage.Leg}
                      style={[
                        styles.Image2,
                        {
                          height: DeviceHeigth * 0.07,
                          width: DeviceWidth * 0.09,
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
                      width: DeviceWidth * 0,
                      height: DeviceHeigth * 0.4,
                      position: 'absolute',
                      left:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.055
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.084
                          : -DeviceHeigth * 0.048,
                      top:
                        Platform.OS == 'android'
                          ? -DeviceHeigth * 0.34
                          : DeviceHeigth == '1024'
                          ? -DeviceHeigth * 0.32
                          : -DeviceHeigth * 0.34,
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
                <View>
                  {imageView.find(num => num === 'Legs') && (
                    <View
                      style={{
                        width: DeviceWidth * 0.2,
                        height: DeviceHeigth * 0.4,
                        position: 'absolute',
                        left:
                          Platform.OS == 'android'
                            ? DeviceHeigth <= 807.2727272727273
                              ? -DeviceHeigth * 0.04
                              : DeviceHeigth <= 845.7142857142857
                              ? -DeviceHeigth * 0.04
                              : -DeviceHeigth * 0.037
                            : DeviceHeigth == '1024'
                            ? -DeviceHeigth * 0.085
                            : DeviceHeigth == 667
                            ? -DeviceHeigth * 0.055
                            : -DeviceHeigth * 0.04,
                        top:
                          Platform.OS == 'android'
                            ? -DeviceHeigth * 0.26
                            : DeviceHeigth == '1024'
                            ? -DeviceHeigth * 0.24
                            : DeviceHeigth == 667
                            ? -DeviceHeigth * 0.23
                            : -DeviceHeigth * 0.27,
                      }}>
                      <Image
                        source={localImage.Leg2}
                        style={[
                          styles.Image2,
                          {
                            height: DeviceHeigth * 0.1,
                            width: DeviceWidth * 0.55,
                          },
                        ]}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </View>
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
              top: DeviceHeigth * 0.08,
              height: DeviceHeigth * 0.7,
              left: -DeviceWidth * 0.11,
            }}>
            <FlatList
              data={bodyPart2}
              scrollEnabled={false}
              extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                const isSelected = selectedItems.includes(item.bodypart_id);
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
                      setImageFocusArea(item.bodypart_id, item.bodypart_title);
                    }}>
                    <Text
                      style={{
                        color: '#505050',
                        fontFamily: 'Poppins',
                        fontWeight: '500',
                      }}>
                      {item.bodypart_title}
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
    width: DeviceWidth * 0.28,
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
    width: DeviceWidth * 0.4,
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
export default FocuseAreaMale;
