import 'react-native-gesture-handler';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  BackHandler,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import Router, {LoginStack} from './src/Navigation/Router';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const navigationRef = createNavigationContainerRef();
import Loader from './src/Component/Loader';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from './src/Component/Config';
import RNRestart from 'react-native-restart';
import {
  requestPermissionforNotification,
  RemoteMessage,
} from './src/Component/Helper/PushNotification';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TrackPlayer from 'react-native-track-player';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import codePush from 'react-native-code-push';
import CircularProgress from 'react-native-circular-progress-indicator';
import {
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import {AppColor} from './src/Component/Color';
import { LogBox } from 'react-native';
import { LogOut } from './src/Component/LogOut';

// also use before use code Push (appcenter login)
// codepush release of ios , appcenter codepush release-react -a thefitnessandworkout-gmail.com/FitmeIos -d Production
// codepush release of android  appcenter codepush release-react -a thefitnessandworkout-gmail.com/FitmeAndroid -d Production
let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
const App = () => {
  const [isLogged, setIsLogged] = useState();
  const [update, setUpdate] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConnected, setConnected] = useState(true);
  const {defaultTheme} = useSelector(state => state);
  const {isLogin} = useSelector(state => state);
  const [progress, setProgress] = useState(false);
  useEffect(() => {
    requestPermissionforNotification(dispatch);
    RemoteMessage();
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['Sending...']);
    try {
     analytics().setAnalyticsCollectionEnabled(true);
      crashlytics().setCrashlyticsCollectionEnabled(true);
    } catch (error) {
      crashlytics().recordError(error);
    }
   alalyicsData();
  }, []);
  const handleBackPress = () => {
    // Do nothing to stop the hardware back press
    return true;
  };

  useEffect(() => {
    // Add an event listener to handle the hardware back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Remove the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
  const dispatch = useDispatch();

  const alalyicsData = () => {
    analytics().logEvent('Platform', {
      data: Platform.OS,
    });
  };
  useEffect(() => {
    const subscription = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    });
    return () => {
      subscription();
    };
  }, []);
  useEffect(() => {
    async function initializePlayer() {
      await TrackPlayer.setupPlayer();
    }

    initializePlayer();
  }, []);

  useEffect(() => {
    var updateDialogOptions = {
      updateTitle: 'Optional Update',
      optionalUpdateMessage: 'An update is available. Would you like to install it now?',
      optionalIgnoreButtonLabel: 'Later',
      optionalInstallButtonLabel: 'Update',
      mandatoryUpdateMessage:
        'A mandatory update is available. Please update to continue using the app.',
      mandatoryContinueButtonLabel: 'Update Now',
    };
    codePush.sync(
      {
        updateDialog: updateDialogOptions,
        installMode: codePush.InstallMode.IMMEDIATE,
        //installMode: codePush.InstallMode.MANUAL,
      },

      codePushStatusDidChange,
      codePushDownloadDidProgress,
    );
  }, []);
  const codePushStatusDidChange = syncStatus => {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Checking for update.');
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('Download packaging....');
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        console.log('Awaiting user action....');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('Installing update');
        LogOut(dispatch);
        setProgress(false);
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('codepush status up to date');
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        console.log('update cancel by user');
        setProgress(false);
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        LogOut(dispatch);
       // console.log('Update installed and will be applied on restart.');
        setProgress(false);
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        console.log('An unknown error occurred');
        setProgress(false);
        break;
    }
  };
  const codePushDownloadDidProgress = progress => {
    setProgress(progress);
  };
  const showProgressView = () => {
    return (
      <Modal visible={true} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: DeviceWidth * 0.05,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 17,
                fontFamily: 'Poppins',
                fontWeight: '600',
              }}
              >
              Downloading......
            </Text>

            <View style={{alignItems: 'center'}}>
              <View style={{marginVertical: 15}}>
                <CircularProgress
                  value={(
                    (Number(progress?.receivedBytes) /
                      Number(progress?.totalBytes)) *
                    100
                  ).toFixed(0)}
                  radius={50}
                  progressValueColor={'rgb(197, 23, 20)'}
                  inActiveStrokeColor={AppColor.GRAY2}
                  activeStrokeColor={'rgb(197, 23, 20)'}
                  inActiveStrokeOpacity={0.3}
                  maxValue={100}
                  valueSuffix={'%'}
                  titleColor={'black'}
                  titleStyle={{
                    textAlign: 'center',
                    fontSize: 28,
                    fontWeight: '700',
                    lineHeight: 35,
                    fontFamily: 'Poppins',
                    color: 'rgb(0, 0, 0)',
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 16,
                  textAlign: 'center',
                  fontSize: 15,
                  fontFamily: 'Poppins',
                  fontWeight: '500',
                }}>{`${(Number(progress?.receivedBytes) / 1048576).toFixed(
                2,
              )}MB/${(Number(progress?.totalBytes) / 1048576).toFixed(
                2,
              )}`}</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  // useEffect(() => {
  //   UserAuth();
  // }, [update]);
  // // Checking if User is Already Login or not
  // const UserAuth = async () => {
  //   try {
  //     const userData = await AsyncStorage.getItem('Data');
  //     const data = JSON.parse(userData);
  //     if (data) {
  //       setIsLogged(true);
  //       setUpdate(update + 1);
  //       setIsLoaded(true);
  //     } else {
  //       setIsLogged(false);
  //       setUpdate(update + 1);
  //       setIsLoaded(true);
  //     }
  //   } catch (error) {
  //     setIsLogged(false);
  //     // setUpdate(update + 1)
  //     setIsLoaded(false);
  //   }
  // };
  // if (isLoaded && isLogged && isConnected) {
  //   return (
  //     <>
  //       <NavigationContainer
  //         ref={navigationRef}
  //         onReady={() => BootSplash.hide({duration: 5000})}>
  //         <Router />
  //       </NavigationContainer>
  //       <FlashMessage position="top" />
  //     </>
  //   );
  // } else if (isLoaded && !isLogged && isConnected) {
  //   return (
  //     <>
  //       <NavigationContainer
  //         ref={navigationRef}
  //         onReady={() => BootSplash.hide({duration: 5000})}>
  //         <LoginStack />
  //       </NavigationContainer>
  //       <FlashMessage position="top" />
  //     </>
  //   );
  // }
  // // Will Visible When Internet is Disconnected
  // else if (isConnected == false && isLoaded) {
  //   return (
  //     <View
  //       style={[
  //         styles.View,
  //         {backgroundColor: defaultTheme ? '#000' : '#fff'},
  //       ]}>
  //       <Text style={{color: 'red', fontSize: 20}}>No Internet Connection</Text>
  //       <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
  //         {' '}
  //         Make sure you have connected to the Internet
  //       </Text>
  //       <TouchableOpacity
  //         style={[styles.button, {backgroundColor: 'red'}]}
  //         onPress={() => RNRestart.restart()}>
  //         <Text
  //           style={{
  //             color: '#fff',
  //             fontSize: 16,
  //             fontFamily: 'sans-serif',
  //             fontWeight: 'bold',
  //           }}>
  //           {' '}
  //           Try Again
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // } else {
  //   return <Loader />;
  // }
  return (
    <>
      <NavigationContainer
        ref={navigationRef}

        onStateChange={state => {
          analytics().logScreenView({
            'screen_name':state.routes[state.index].name, //logging screen name to firebase Analytics
          });
          crashlytics().setAttributes({
            'platform': Platform.OS,
            'CrashedScreenName':state.routes[state.index].name
          });
        }}>

        <LoginStack />
      </NavigationContainer>
      <FlashMessage
        position="top"
        statusBarHeight={StatusBar_Bar_Height + 30}
      />

      {!!progress ? showProgressView() : null}
    </>
  );
};
const styles = StyleSheet.create({
  View: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: (DeviceHeigth * 2) / 100,
    width: (DeviceWidth * 40) / 100,
    height: (DeviceHeigth * 4) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
///export default App;
export default codePush(codePushOptions)(App);
