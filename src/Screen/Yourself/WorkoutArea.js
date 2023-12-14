import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import ProgressBar from './ProgressBar';
import Bulb from './Bulb';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import {localImage} from '../../Component/Image';

const WorkoutArea = ({route, navigation}) => {
  // const translateValue = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  // const {nextScreen} = route.params;
  // const [screen, setScreen] = useState(nextScreen);

  const {getLaterButtonData} = useSelector(state => state);
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
      toValue: {x: 0, y: 0}, // Destination position (top: 100, left: 100)
      duration: 1500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start();
  };
  const translateValue2 = useRef(
    new Animated.ValueXY({x: DeviceWidth, y: -DeviceHeigth}),
  ).current;
  const animateElement2 = () => {
    Animated.timing(translateValue2, {
      toValue: {x: 0, y: 0}, // Destination position (top: 100, left: 100)
      duration: 1500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start();
  };
  const translateValue3 = useRef(
    new Animated.ValueXY({x: -DeviceWidth, y: DeviceHeigth}),
  ).current;
  const animateElement3 = () => {
    Animated.timing(translateValue3, {
      toValue: {x: 0, y: 0}, // Destination position (top: 100, left: 100)
      duration: 1500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />

      <View style={{height: DeviceHeigth * 0.25}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            marginTop: DeviceHeigth * 0.02,
          }}>
          <ProgressBar screen={10} />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            marginTop: -DeviceHeigth * 0.01,
          }}>
          <Bulb
            screen={'What’s your comfort place to workout ?'}
            header={'You can select any 2 options among below given options'}
          />
        </View>
      </View>
      <View style={{height: DeviceHeigth * 0.57}}>
        <ScrollView
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          style={{bottom: 10}}
          keyboardShouldPersistTaps="handled">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            top: DeviceHeigth * 0.03,
          }}>
          <TouchableOpacity>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue.x},
                  {translateY: translateValue.y},
                ],
              }}>
              <Image
                source={localImage.AtHome}
                style={[
                  styles.Image23,
                  {
                    width:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceWidth * 0.6
                        : DeviceWidth * 0.5,
                    height:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceHeigth * 0.4
                        : DeviceHeigth * 0.3,
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue2.x},
                  {translateY: translateValue2.y},
                ],
              }}>
              <Image
                source={localImage.AtHome}
                style={[
                  styles.Image23,
                  {
                    width:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceWidth * 0.6
                        : DeviceWidth * 0.5,
                    height:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceHeigth * 0.4
                        : DeviceHeigth * 0.3,
                    marginLeft:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? -DeviceWidth * 0.2
                        : 0,
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            top: DeviceHeigth * 0.02,
          }}>
          <TouchableOpacity>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue3.x},
                  {translateY: translateValue3.y},
                ],
              }}>
              <Image
                source={localImage.AtHome}
                style={[
                  styles.Image23,
                  {
                    width:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceWidth * 0.6
                        : DeviceWidth * 0.5,
                    height:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceHeigth * 0.4
                        : DeviceHeigth * 0.3,
                   
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Animated.View
              style={{
                transform: [
                  {translateX: translateValue1.x},
                  {translateY: translateValue1.y},
                ],
              }}>
              <Image
                source={localImage.AtHome}
                style={[
                  styles.Image23,
                  {
                    width:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceWidth * 0.6
                        : DeviceWidth * 0.5,
                    height:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? DeviceHeigth * 0.4
                        : DeviceHeigth * 0.3,
                    marginLeft:
                      Platform.OS == 'ios' && DeviceHeigth == '1024'
                        ? -DeviceWidth * 0.2
                        : 0,
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
      <View style={{height: DeviceHeigth * 0.18}}>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name="chevron-left" size={25} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // toNextScreen()
            }}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#941000', '#D5191A']}
              style={[styles.nextButton]}>
              <Icons name="chevron-right" size={25} color={'#fff'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'blue',
          transform: [
            {translateX: translateValue.x},
            {translateY: translateValue.y},
          ],
        }}
        
      /> */}
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          top: DeviceHeigth * 0.03,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={localImage.AtHome}
            style={[styles.Image23]}
            resizeMode="contain"
          />
          <Text>Hello</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={localImage.AtBed}
            style={[styles.Image]}
            resizeMode="contain"
          />
          <Text>Hello</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          top: DeviceHeigth * 0.06,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={localImage.Outdoor}
            style={[styles.Image]}
            resizeMode="contain"
          />
          <Text>Hello</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={localImage.Anywhere}
            style={[styles.Image]}
            resizeMode="cover"
          />
          <Text>Hello</Text>
        </View>
      </View>
       */}
    </SafeAreaView>
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
    width: (DeviceWidth * 85) / 100,
    alignItems: 'center',
    alignSelf: 'center',
    top: 20,
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
    width: DeviceWidth * 0.5,
    height: DeviceHeigth * 0.3,
  },
});
export default WorkoutArea;
