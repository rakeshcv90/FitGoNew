// import 'react-native-gesture-handler';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
//   Platform,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import {
//   NavigationContainer,
//   createNavigationContainerRef,
//   useNavigation,
// } from '@react-navigation/native';
// import Router, {LoginStack} from './src/Navigation/Router';
// import FlashMessage, {showMessage} from 'react-native-flash-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// export const navigationRef = createNavigationContainerRef();
// import Loader from './src/Component/Loader';
// import NetInfo from '@react-native-community/netinfo';
// import {useSelector} from 'react-redux';
// import {DeviceHeigth, DeviceWidth} from './src/Component/Config';
// import RNRestart from 'react-native-restart';
// import BootSplash from 'react-native-bootsplash';
// import { requestPermissionforNotification,RemoteMessage} from './src/Component/Helper/PushNotification';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// const App = () => {
//   const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
//   useEffect(() => {
//    requestPermissionforNotification()
//     RemoteMessage();
//   }, []);
//   const [isLogged, setIsLogged] = useState();
//   const [update, setUpdate] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isConnected, setConnected] = useState(true);
//   const {defaultTheme} = useSelector(state => state);
//   const {isLogin} = useSelector(state => state);
//   // Checking if the App is Connected to the internet or not
//   useEffect(() => {
//     const subscription = NetInfo.addEventListener(state => {
//       if (state.isConnected) {
//         setConnected(true);
//       } else {
//         setConnected(false);
//       }
//     });
//     return () => {
//       subscription();
//     };
//   }, []);

//   // useEffect(() => {
//   //   UserAuth();
//   // }, [update]);
//   // // Checking if User is Already Login or not
//   // const UserAuth = async () => {
//   //   try {
//   //     const userData = await AsyncStorage.getItem('Data');
//   //     const data = JSON.parse(userData);
//   //     if (data) {
//   //       setIsLogged(true);
//   //       setUpdate(update + 1);
//   //       setIsLoaded(true);
//   //     } else {
//   //       setIsLogged(false);
//   //       setUpdate(update + 1);
//   //       setIsLoaded(true);
//   //     }
//   //   } catch (error) {
//   //     setIsLogged(false);
//   //     // setUpdate(update + 1)
//   //     setIsLoaded(false);
//   //   }
//   // };
//   // if (isLoaded && isLogged && isConnected) {
//   //   return (
//   //     <>
//   //       <NavigationContainer
//   //         ref={navigationRef}
//   //         onReady={() => BootSplash.hide({duration: 5000})}>
//   //         <Router />
//   //       </NavigationContainer>
//   //       <FlashMessage position="top" />
//   //     </>
//   //   );
//   // } else if (isLoaded && !isLogged && isConnected) {
//   //   return (
//   //     <>
//   //       <NavigationContainer
//   //         ref={navigationRef}
//   //         onReady={() => BootSplash.hide({duration: 5000})}>
//   //         <LoginStack />
//   //       </NavigationContainer>
//   //       <FlashMessage position="top" />
//   //     </>
//   //   );
//   // }
//   // // Will Visible When Internet is Disconnected
//   // else if (isConnected == false && isLoaded) {
//   //   return (
//   //     <View
//   //       style={[
//   //         styles.View,
//   //         {backgroundColor: defaultTheme ? '#000' : '#fff'},
//   //       ]}>
//   //       <Text style={{color: 'red', fontSize: 20}}>No Internet Connection</Text>
//   //       <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
//   //         {' '}
//   //         Make sure you have connected to the Internet
//   //       </Text>
//   //       <TouchableOpacity
//   //         style={[styles.button, {backgroundColor: 'red'}]}
//   //         onPress={() => RNRestart.restart()}>
//   //         <Text
//   //           style={{
//   //             color: '#fff',
//   //             fontSize: 16,
//   //             fontFamily: 'sans-serif',
//   //             fontWeight: 'bold',
//   //           }}>
//   //           {' '}
//   //           Try Again
//   //         </Text>
//   //       </TouchableOpacity>
//   //     </View>
//   //   );
//   // } else {
//   //   return <Loader />;
//   // }
//       return (
//       <>
//         <NavigationContainer
//          ref={navigationRef}
//           onReady={() => BootSplash.hide({duration: 5000})}
//           >
//           <LoginStack />
//           {/* <Router /> */}
//         </NavigationContainer>
//         <FlashMessage position="top" statusBarHeight={StatusBar_Bar_Height+30} />
//       </>
//     );
// };
// const styles = StyleSheet.create({
//   View: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     marginVertical: (DeviceHeigth * 2) / 100,
//     width: (DeviceWidth * 40) / 100,
//     height: (DeviceHeigth * 4) / 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 100,
//   },
// });
// export default App;

import {
  LogBox,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {Suspense, useEffect} from 'react';
import {Canvas} from '@react-three/fiber/native';
import Model from './src/models/Model';
import useControls from 'r3f-native-orbitcontrols';
import BootSplash from 'react-native-bootsplash';

const App = () => {
  LogBox.ignoreLogs([
    'Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+, and will be removed with r160. Please use ES Modules or alternatives: https://threejs.org/docs/index.html#manual/en/introduction/Installation',
  ]);
  const [OrbitControls, events] = useControls();
  useEffect(() => {
    BootSplash.hide({duration: 5000});
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modelContainer} {...events}>
        <Canvas>
          <OrbitControls enablePan={false} />
          <directionalLight position={[1, 0, 0]} args={['white', 5]} />
          <directionalLight position={[-1, 0, 0]} args={['white', 5]} />
          <directionalLight position={[0, 0, 1]} args={['white', 5]} />
          <directionalLight position={[0, 0, -1]} args={['white', 5]} />
          <directionalLight position={[0, 1, 0]} args={['white', 5]} />
          <directionalLight position={[0, -1, 0]} args={['white', 5]} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Canvas>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Grey Chair</Text>
          <Text style={styles.textPrice}>$80.00</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            mattis maximus eros, eu ullamcorper ante ullamcorper a. Phasellus
            turpis tellus, tempus at feugiat at, facilisis ac sem.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              console.log('first');
            }}>
            <Text style={styles.textButton}>Buy Now</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  modelContainer: {
    flex: 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textContainer: {
    margin: 20,
    marginBottom: 0,
  },
  textTitle: {
    fontSize: 28,
    color: '#051E47',
    fontWeight: 'bold',
  },
  textPrice: {
    fontSize: 28,
    color: '#3F6900',
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'justify',
    marginVertical: 10,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3F6900',
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
