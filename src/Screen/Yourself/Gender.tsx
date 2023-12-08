import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Image} from 'react-native';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import Carousel from 'react-native-snap-carousel';
import {AppColor} from '../../Component/Color';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';

const Gender = ({route, navigation}: any) => {
  const {data, screen} = route.params;
  const [selected, setSelected] = useState('');
  const translateX = useRef(new Animated.Value(0)).current;
  const translateX1 = useRef(new Animated.Value(0)).current;
  const translateXRight = useRef(new Animated.Value(0)).current;
  const translateX1Left = useRef(new Animated.Value(0)).current;

  const handleImagePress = (gender: string) => {
    // Set the selected gender

    // Animate the translation of the unselected image

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: gender === 'Male' ? DeviceWidth / 2 : -DeviceWidth *0.4,
        duration: 500,
        useNativeDriver: true,
        delay: gender === 'Male' ? 250 : 0, // Delay the return to center animation for a smoother effect
      }),
      Animated.timing(translateX1, {
        toValue: gender === 'Female' ? -DeviceWidth *0.4 : DeviceWidth / 2,
        duration: 500,
        useNativeDriver: true,
        delay: gender === 'Female' ? 250 : 0, // Delay the return to center animation for a smoother effect
      }),
      Animated.timing(translateXRight, {
        toValue: gender === 'Male' ? DeviceWidth / 2 : -DeviceWidth / 2,
        duration: 500,
        useNativeDriver: true,
        delay: gender === 'Male' ? 500 : 0, // Delay the return to center animation for a smoother effect
      }),
      Animated.timing(translateX1Left, {
        toValue: gender === 'Female' ? -DeviceWidth / 2 : DeviceWidth * 0.1,
        duration: 500,
        useNativeDriver: true,
        delay: gender === 'Female' ? 500 : 0, // Delay the return to center animation for a smoother effect
      }),
    ]).start();
    setSelected(gender);
  };
  const Goal = () => {
    return (
      <Animated.View
        style={
          {
            // transform: [
            //   {
            //     translateX:
            //       selected === 'Female' ? translateX1Left : translateXRight,
            //   },
            // ],
          }
        }>
        {data &&
          data?.map((item: any, index: number) => {
            // console.log(item);
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => null}
                style={[
                  styles.box2,
                  {
                    padding: 10,
                    paddingRight: 10,
                    borderWidth: 0,
                    borderColor: AppColor.WHITE,
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
                  source={{uri: item.image}}
                  resizeMode="contain"
                  style={{
                    height: DeviceHeigth * 0.2,
                    width: DeviceWidth * 0.3,
                  }}
                />
              </TouchableOpacity>
            );
          })}
      </Animated.View>
    );
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
      <Bulb />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          alignSelf: 'flex-end',
          height: DeviceHeigth * 0.6,
        }}>
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            // backgroundColor: 'blue',
            alignSelf: 'center',
            transform: [{translateX: translateX1}],
            width: DeviceWidth / 2,
          }}>
          {selected == 'Male' && <Goal />}
          <Animated.View
            style={{
              width: DeviceWidth / 2,
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback onPress={() => handleImagePress('Male')}>
              <Image
                source={localImage.MALE}
                style={{height: 450, width: 300}}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            alignSelf: 'center',
            transform: [{translateX: translateX}],
            width: DeviceWidth,
            // backgroundColor: 'green',
          }}>
          <Animated.View
            style={{
              width: DeviceWidth / 2,
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => handleImagePress('Female')}>
              <Image
                source={localImage.FEMALE}
                style={{height: 450, width: 300}}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          {selected == 'Female' && <Goal />}
        </Animated.View>
      </View>
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
  box2: {
    width: DeviceWidth * 0.4,
    height: DeviceHeigth * 0.1,
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
