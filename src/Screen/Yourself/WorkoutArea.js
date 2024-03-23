import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import {localImage} from '../../Component/Image';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';
import { showMessage } from 'react-native-flash-message';
import analytics from '@react-native-firebase/analytics';
import { image } from 'd3';
const WorkoutArea = ({route, navigation}) => {
  const {nextScreen} = route.params;
  const [screen, setScreen] = useState(nextScreen);
  const [selectedItems, setSelectedItems] = useState([]);
  const [imageView, setImageVIew] = useState([]);
  const dispatch = useDispatch();
  const {getLaterButtonData, completeProfileData, getUserID} = useSelector(
    state => state,
  );

  useEffect(() => {
    setScreen(nextScreen);
  }, []);
  const toNextScreen = () => {
    const currentData = {
      workoutArea: imageView,
    };
    dispatch(setLaterButtonData([...getLaterButtonData, currentData]));
    navigation.navigate('PredictionScreen', {nextScreen: screen + 1});
    analytics().logEvent(`CV_FITME_WORKOUT_AREA_${imageView[0]?.replace(" ","_")}`)
   
  };

  useEffect(() => {
    animateElement();
    animateElement1();
    animateElement2();
    animateElement3();
  }, []);
  const translateValue = useRef(
    new Animated.ValueXY({x: -DeviceWidth, y: -DeviceHeigth}),
  ).current;
  const animateElement = () => {
    Animated.timing(translateValue, {
      toValue: {x: 0, y: 0}, // Destination position (top: 100, left: 100)
      duration: 1500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start();
  };
  const translateValue1 = useRef(
    new Animated.ValueXY({x: DeviceWidth, y: DeviceHeigth}),
  ).current;
  const animateElement1 = () => {
    Animated.timing(translateValue1, {
      toValue: {x: 0, y: 0},
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };
  const translateValue2 = useRef(
    new Animated.ValueXY({x: DeviceWidth, y: -DeviceHeigth}),
  ).current;
  const animateElement2 = () => {
    Animated.timing(translateValue2, {
      toValue: {x: 0, y: 0},
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };
  const translateValue3 = useRef(
    new Animated.ValueXY({x: -DeviceWidth, y: DeviceHeigth}),
  ).current;
  const animateElement3 = () => {
    Animated.timing(translateValue3, {
      toValue: {x: 0, y: 0},
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };
  const setImageFocusArea = item => {
    const index = selectedItems.indexOf(item);
    const newSelectedItems = [...selectedItems];
    const newImageVIew = [...imageView];
    if (index === -1) {
      if (newImageVIew.length <1) {
        newSelectedItems.push(item);
        newImageVIew.push(item);
      } else {
        showMessage({
          message: 'You Can select only One Item',
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      }
     
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
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          //position: 'absolute',
          marginTop:
             DeviceHeigth * 0.07,
        }}>
        <ProgressBar screen={screen} />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop:-(Platform.OS=='android'?DeviceHeigth * 0.035:DeviceHeigth * 0.04)
          
        }}>
        <Bulb
          screen={'What’s your comfort place to workout ?'}
          header={'This will help us to create your personalized workout'}
        />
      </View>
      {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          //position: 'absolute',
        marginTop:
             DeviceHeigth * 0.07,
        }}>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

         
        }}>
           <ProgressBar screen={screen} />
        <Bulb
          screen={'What’s your comfort place to workout ?'}
          header={'You can select any 2 options among below given options'}
        />
      </View> */}

      <View
        style={{
          height: DeviceHeigth * 0.57,
          marginVertical: DeviceHeigth * 0.02,
        }}>
        <ScrollView
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          // style={{bottom: 10}}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              top: DeviceHeigth * 0.03,
            }}>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue.x},
                  {translateY: translateValue.y},
                ],
              }}>
              <TouchableOpacity
                style={[
                  styles.shadowProp,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: imageView.find(num => num === 'At Home') && 1,
                    borderColor: imageView.find(num => num === 'At Home')
                      ? 'red'
                      : 'white',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setImageFocusArea(
                    completeProfileData.workoutarea[3].workoutarea_title,
                  );
                }}>
                <Image
              source={{
                uri: completeProfileData.workoutarea[3].workoutarea_image,
              }}
                  style={styles.Image23}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: '#505050',
                    fontWeight: '500',
                    textAlign: 'center',
                    marginVertical: 8,
                    lineHeight: 21,
                  }}>
                  {completeProfileData.workoutarea[3].workoutarea_title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue2.x},
                  {translateY: translateValue2.y},
                ],
              }}>
              <TouchableOpacity
                style={[
                  styles.shadowProp,
                  {
                    borderWidth: imageView.find(num => num === 'At Gym') && 1,
                    borderColor: imageView.find(num => num === 'At Gym')
                      ? 'red'
                      : 'white',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setImageFocusArea(
                    completeProfileData.workoutarea[1].workoutarea_title,
                  );
                }}>
                <Image
                  source={{
                    uri: completeProfileData.workoutarea[1].workoutarea_image,
                  }}
                  style={styles.Image23}
                  resizeMode={DeviceHeigth == '1024' ? 'stretch' : 'cover'}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: '#505050',
                    fontWeight: '500',
                    textAlign: 'center',
                    marginVertical: 8,
                    lineHeight: 21,
                  }}>
                  {completeProfileData.workoutarea[1].workoutarea_title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              top: DeviceHeigth * 0.05,
            }}>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue3.x},
                  {translateY: translateValue3.y},
                ],
              }}>
              <TouchableOpacity
                style={[
                  styles.shadowProp,
                  {
                    borderWidth: imageView.find(num => num === 'Outdoor') && 1,
                    borderColor: imageView.find(num => num === 'Outdoor')
                      ? 'red'
                      : 'white',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setImageFocusArea(
                    completeProfileData.workoutarea[2].workoutarea_title,
                  );
                }}>
                <Image
                   source={{
                    uri: completeProfileData.workoutarea[2].workoutarea_image,
                  }}
                  style={styles.Image23}
                  resizeMode={DeviceHeigth == '1024' ? 'stretch' : 'stretch'}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: '#505050',
                    fontWeight: '500',
                    textAlign: 'center',
                    marginVertical: 8,
                    lineHeight: 21,
                  }}>
                  {completeProfileData.workoutarea[2].workoutarea_title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue1.x},
                  {translateY: translateValue1.y},
                ],
              }}>
              <TouchableOpacity
                style={[
                  styles.shadowProp,
                  {
                    borderWidth: imageView.find(num => num === 'Anywhere') && 1,
                    borderColor: imageView.find(num => num === 'Anywhere')
                      ? 'red'
                      : 'white',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setImageFocusArea(
                    completeProfileData.workoutarea[0].workoutarea_title,
                  );
                }}>
                <Image
                  source={{
                    uri: completeProfileData.workoutarea[0].workoutarea_image,
                  }}
                  style={styles.Image23}
                  resizeMode={DeviceHeigth == '1024' ? 'stretch' : 'stretch'}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: '#505050',
                    fontWeight: '500',
                    textAlign: 'center',
                    marginVertical: 8,
                    lineHeight: 21,
                  }}>
                  {completeProfileData.workoutarea[0].workoutarea_title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View
            style={{
              height:
                Platform.OS == 'android'
                  ? DeviceHeigth * 0.1
                  : DeviceHeigth * 0.08,
            }}></View>
        </ScrollView>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>

        {imageView.length !== 0 && (
          <TouchableOpacity
            onPress={() => {
              toNextScreen();
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
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
    width: 106,
    height: 106,
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
  TextView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',

    bottom: DeviceHeigth * 0.02,
    position: 'absolute',
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image23: {
    width:
      Platform.OS == 'android'
        ? DeviceWidth * 0.392
        : DeviceHeigth == '1024'
        ? DeviceWidth * 0.395
        : DeviceWidth * 0.395,
    height: DeviceHeigth * 0.2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // borderRadius: 20,
    borderColor: 'red',
  },
  shadowProp: {
    width: DeviceWidth * 0.399,
    //height: DeviceHeigth * 0.3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#171717',
    backgroundColor: 'white',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default WorkoutArea;
