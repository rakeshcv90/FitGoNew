import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const SplaceScreen = ({navigation}) => {
  const {showIntro} = useSelector(state => state);
  //fade In

  useEffect(() => {
    setTimeout(() => {
      if (showIntro) {
      //  navigation.navigate('Yourself');
        navigation.navigate('LogSignUp');
      } else {
        navigation.navigate('IntroductionScreen');
      }
    }, 4000);
  }, []);
  // const UserAuth = async () => {
  //   try {
  //     const userData = await AsyncStorage.getItem('Data')
  //     const data = (JSON.parse(userData))
  //     if (!!data) {
  //       navigation.navigate('DrawerNavigation')
  //     } else {
  //       navigation.navigate('Login')
  //     }
  //   } catch (error) {
  //     console.log("error", error)
  //     navigation.navigate('Login')
  //   }
  // }
  // const fadeAnim1 = useRef(new Animated.Value(0)).current; //first text ref
  // const fadeAnim2 = useRef(new Animated.Value(0)).current; //second text ref
  // const fadeInFirstText = () => {
  //   // Will change fadeAnim value to 1 in 5 seconds
  //   Animated.timing(fadeAnim1, {
  //     toValue: 1,
  //     duration: 700,
  //     useNativeDriver: true,
  //   }).start();
  // };
  // const fadeInSecondText = () => {
  //   // Will change fadeAnim value to 1 in 5 seconds
  //   Animated.timing(fadeAnim2, {
  //     toValue: 1,
  //     duration: 700,
  //     useNativeDriver: true,
  //   }).start();
  // };
  return (
    <LinearGradient
      style={styels.container}
      start={{x: 0, y: 0}}
      end={{x: 0.5, y: 0.5}}
      colors={['#D01818', '#941000']}
       >
        <StatusBar backgroundColor={'transparent'} translucent/>
      <Image
        source={localImage.SplashText}
        style={styels.Textlogo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.4,
  },
  // LinearG: {
  //   height: DeviceHeigth,
  //   width: DeviceWidth,
  //   backgroundColor: 'rgba(0,0,0,0.4)',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   flex: 1,
  // },
  // fadingContainer: {
  //   padding: 20,
  //   backgroundColor: 'transparent',
  //   justifyContent: 'center',
  //   alignItems: 'flex-end',
  //   flex: 1,
  // },
  // fadingText: {
  //   fontSize: 38,
  //   color: '#fff',
  // },
  // AnimatedView: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: (DeviceHeigth * 25) / 100,
  // },
});
export default SplaceScreen;
// import React, { useEffect } from 'react';
// import { View, StyleSheet,Text } from 'react-native';
// import Video from 'react-native-video';
// import SplashScreen from 'react-native-splash-screen';

// const SplaceScreen = ({navigation}) => {
//   useEffect(() => {

//      SplashScreen.hide();

//     setTimeout(() => {
//       navigation.replace('Login');
//     }, 5000);
//   }, []);
//   return (
//     <View style={styles.container}>
//       <Video
//         source={require('../Icon/Images/NewImage/v1.mp4')}
//         style={styles.backgroundVideo}
//         resizeMode="cover"
//         repeat={false}
//       />
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backgroundVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
// });
// export default SplaceScreen
