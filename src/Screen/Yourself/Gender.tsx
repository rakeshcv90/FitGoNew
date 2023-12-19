import {View, Platform, TouchableOpacity, Animated, Easing} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {useDispatch, useSelector} from 'react-redux';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';

const Gender = ({route, navigation}: any) => {
  const {data, nextScreen} = route.params;

  const dispatch = useDispatch();
  const [screen, setScreen] = useState(nextScreen);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateX1 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setScreen(nextScreen);
  }, []);

  const handleImagePress = (gender: string) => {
    // Set the selected gender

    const easing = Easing.linear(1);
    console.log(gender, 'Gender');

    // Animate the translation of the unselected image
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: gender == 'Male' ? DeviceWidth * 0.2 : -DeviceWidth / 2,
        duration: 500,
        useNativeDriver: true,
        delay: gender == 'Male' ? 0 : 500, // Delay the return to center animation for a smoother effect
      }),
      Animated.timing(translateX1, {
        toValue: gender == 'Female' ? -DeviceWidth * 0.2 : DeviceWidth / 2,
        duration: 500,
        useNativeDriver: true,
        delay: gender == 'Female' ? 500 : 0, // Delay the return to center animation for a smoother effect
      }),
    ]).start();
    setTimeout(() => {
      // setSelected(gender);
      toNextScreen(gender);
    }, 1000);
  };
  const toNextScreen = (item: any) => {
    console.log(item, 'ITEM');
    if (item == 'Male') {
      setTimeout(() => {
        navigation.navigate('Goal', {
          nextScreen: screen + 1,
          data: data,
          gender: item,
        });
      }, 1000);
    } else
      navigation.navigate('Goal', {
        nextScreen: screen + 1,
        data: data,
        gender: item,
      });
  };


  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: DeviceWidth,
        backgroundColor: AppColor.WHITE,
      }}>
      <ProgressBar screen={screen} />
      {/* <Bulb screen={screen} /> */}
      <Bulb
        screen={'Select your Gender'}
        header={
          'Knowing your gender can help us for you based on different metabolic rates.'
        }
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'flex-end',
          height: DeviceHeigth * 0.6,
          width: DeviceWidth,
        }}>
        {/* {selected != 'F' ? ( */}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            handleImagePress('Male');
          }}>
          <Animated.View

            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              alignSelf: 'center',
              transform: [{translateX: translateX}],
              width: DeviceWidth / 2,
            }}>

            <Image
              source={{
                uri: 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/fc1e357f-2310-4e50-8087-519663fe9400/public',
              }}
              style={{height: DeviceHeigth * 0.6, width: DeviceWidth}}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            handleImagePress('Female');
          }}>
          <Animated.View

            style={{
              // flexDirection: 'row-reverse',
              // justifyContent: 'space-around',
              alignItems: 'center',
              alignSelf: 'center',
              transform: [{translateX: translateX1}],
              width: DeviceWidth / 2,
              // marginLeft: selected == 'F' ? 50 : 0,
            }}>

            <Image
              source={{
                uri: 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/e71b96f8-e68c-462e-baaf-a371b6fbc100/public',
              }}
              style={{
                height: DeviceHeigth * 0.6,
                width: DeviceWidth / 2,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>

      </View>
      {/* {selected != '' ? (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-start',
            marginLeft: DeviceWidth * 0.1,
            backgroundColor: '#F7F8F8',
            width: 45,
            height: 45,
            borderRadius: 15,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          
            bottom: DeviceHeigth * 0.02,
            position: 'absolute',
          }}
          onPress={() => {
            handleImagePress('');
          }}>
          <Icons name="chevron-left" size={25} color={'#000'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{alignSelf: 'flex-start', marginLeft: DeviceWidth * 0.1}}
          onPress={() => {
            null;
          }}>
          <Icons name="chevron-left" size={25} color={'#fff'} />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default Gender;
