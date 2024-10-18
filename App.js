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
  AppState,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import Router, {LoginStack} from './src/Navigation/Router';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from './src/Component/Config';

import {
  requestPermissionforNotification,
  RemoteMessage,
} from './src/Component/Helper/PushNotification';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import TrackPlayer, {State} from 'react-native-track-player';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import codePush from 'react-native-code-push';
import {LogBox} from 'react-native';
import {
  setDeviceID,
  setUpdateAvailable,
} from './src/Component/ThemeRedux/Actions';
import {
  UpdateAvailable,
  UpdateAvailable1,
} from './src/Component/Utilities/UpdateAvailable';
import {MyInterstitialAd, OpenAppAds} from './src/Component/BannerAdd';
import DeviceInfo from 'react-native-device-info';

export const navigationRef = createNavigationContainerRef();
// also use before use code Push (appcenter login)
// codepush release of ios , appcenter codepush release-react -a thefitnessandworkout-gmail.com/FitmeIos -d Production
// codepush release of android  appcenter codepush release-react -a thefitnessandworkout-gmail.com/FitmeAndroid -d Production
// clear data from code push appcenter codepush deployment clear -a thefitnessandworkout-gmail.com/FitmeAndroid Production
let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

const App = () => {
  //const [isConnected, setConnected] = useState(true);
  const [progress, setProgress] = useState(false);
  const [isTrackPlayerInitialized, setIsTrackPlayerInitialized] =
    useState(false);
  const [update, setUpdate] = useState(false);
  const isPlayerInitializedRef = useRef(false);

  useEffect(() => {
    requestPermissionforNotification(dispatch);
    // RemoteMessage();
  }, []);

  useEffect(() => {
    try {
      analytics().setAnalyticsCollectionEnabled(true);
      crashlytics().setCrashlyticsCollectionEnabled(true);
    } catch (error) {
      crashlytics().recordError(error);
    }
    alalyicsData();
  }, []);
  // const handleBackPress = () => {
  //   // Do nothing to stop the hardware back press
  //   return true;
  // };

  // useEffect(() => {
  //   // Add an event listener to handle the hardware back press
  //   BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //   // Remove the event listener when the component is unmounted
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //   };
  // }, []);
  const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
  const dispatch = useDispatch();

  const alalyicsData = () => {
    analytics().logEvent('Platform', {
      data: Platform.OS,
    });
  };

  useEffect(() => {
    const initializeTrackPlayer = async () => {
      if (!isPlayerInitializedRef.current) {
        try {
          await TrackPlayer.setupPlayer();
          isPlayerInitializedRef.current = true;
          setIsTrackPlayerInitialized(true);
        } catch (error) {
          console.error('Error initializing Track Player', error);
        }
      }
    };

    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active' && !isPlayerInitializedRef.current) {
        initializeTrackPlayer();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Initialize player if the app is already in the foreground when the component mounts
    if (AppState.currentState === 'active' && !isPlayerInitializedRef.current) {
      initializeTrackPlayer();
    }

    // Clean up function
    return () => {
      subscription.remove();
      if (isPlayerInitializedRef.current) {
        TrackPlayer.reset();
        isPlayerInitializedRef.current = false;
      }
    };
  }, []);

  // useEffect(() => {
  //   var updateDialogOptions = {
  //     updateTitle: 'Optional Update',
  //     optionalUpdateMessage:
  //       'An update is available. Would you like to install it now?',
  //     optionalIgnoreButtonLabel: 'Later',
  //     optionalInstallButtonLabel: 'Update',
  //     mandatoryUpdateMessage:
  //       'A mandatory update is available. Please update to continue using the app.',
  //     mandatoryContinueButtonLabel: 'Update Now',
  //   };
  //   codePush.sync(
  //     {
  //       updateDialog: updateDialogOptions,
  //       installMode: codePush.InstallMode.IMMEDIATE,
  //       //installMode: codePush.InstallMode.MANUAL,
  //     },

  //     codePushStatusDidChange,
  //     codePushDownloadDidProgress,
  //   );
  // }, []);
  // const codePushStatusDidChange = syncStatus => {
  //   switch (syncStatus) {
  //     case codePush.SyncStatus.CHECKING_FOR_UPDATE:
  //       break;
  //     case codePush.SyncStatus.DOWNLOADING_PACKAGE:
  //       break;
  //     case codePush.SyncStatus.AWAITING_USER_ACTION:
  //       UpdateAvailable(dispatch);
  //       break;
  //     case codePush.SyncStatus.INSTALLING_UPDATE:
  //       LogOut(dispatch);
  //       setProgress(false);
  //       break;
  //     case codePush.SyncStatus.UP_TO_DATE:
  //       console.log('not update available');
  //       UpdateAvailable1(dispatch);
  //       break;
  //     case codePush.SyncStatus.UPDATE_IGNORED:
  //       setProgress(false);
  //       UpdateAvailable1(dispatch);
  //       break;
  //     case codePush.SyncStatus.UPDATE_INSTALLED:
  //       LogOut(dispatch);
  //       setProgress(false);
  //       break;
  //     case codePush.SyncStatus.UNKNOWN_ERROR:
  //       console.log('An unknown error occurred');
  //       setProgress(false);
  //       break;
  //     default:
  //       console.log('Statusbchbfhhdf:', status);
  //       break;
  //   }
  // };
  // const codePushDownloadDidProgress = progress => {
  //   setProgress(progress);
  //   //  UpdateAvailable(dispatch);
  // };
  // const showProgressView = () => {
  //   return (
  //     <Modal visible={true} transparent>
  //       <View
  //         style={{
  //           flex: 1,
  //           backgroundColor: 'rgba(0,0,0,0.8)',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //         }}>
  //         <View
  //           style={{
  //             backgroundColor: 'white',
  //             borderRadius: 8,
  //             padding: DeviceWidth * 0.05,
  //           }}>
  //           <Text
  //             style={{
  //               textAlign: 'center',
  //               fontSize: 17,
  //               fontFamily: 'Montserrat-Regular',
  //               fontWeight: '700',
  //               color: AppColor.BLACK,
  //             }}>
  //             Downloading......
  //           </Text>

  //           <View style={{alignItems: 'center'}}>
  //             <View style={{marginVertical: 15}}>
  //               <CircularProgress
  //                 value={(
  //                   (Number(progress?.receivedBytes) /
  //                     Number(progress?.totalBytes)) *
  //                   100
  //                 ).toFixed(0)}
  //                 radius={50}
  //                 progressValueColor={'rgb(197, 23, 20)'}
  //                 inActiveStrokeColor={AppColor.GRAY2}
  //                 activeStrokeColor={'rgb(197, 23, 20)'}
  //                 inActiveStrokeOpacity={0.3}
  //                 maxValue={100}
  //                 valueSuffix={'%'}
  //                 titleColor={'black'}
  //                 titleStyle={{
  //                   textAlign: 'center',
  //                   fontSize: 28,
  //                   fontWeight: '700',
  //                   lineHeight: 35,
  //                   fontFamily: 'Montserrat-Regular',

  //                   color: 'rgb(0, 0, 0)',
  //                 }}
  //               />
  //             </View>
  //             <Text
  //               style={{
  //                 marginTop: 16,
  //                 textAlign: 'center',
  //                 fontSize: 15,
  //                 fontFamily: 'Montserrat-Regular',
  //                 fontWeight: '700',
  //                 color: AppColor.BLACK,
  //               }}>{`${(Number(progress?.receivedBytes) / 1048576).toFixed(
  //               2,
  //             )} MB /${(Number(progress?.totalBytes) / 1048576).toFixed(
  //               2,
  //             )} MB`}</Text>
  //           </View>
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // };
  const {initOpenApp, showOpenAppAd} = OpenAppAds();
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    initOpenApp();
    const subscription = AppState.addEventListener('change', nextAppState => {
      const strictCondition =
        navigationRef?.current?.getCurrentRoute()?.name != 'SplaceScreen' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'Log In' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'Sign Up' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'PermissionScreen' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'CustomWorkout' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'WorkoutCompleted' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'SaveDayExercise' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'MealDetails' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'AITrainer' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'CreateWorkout' &&
        navigationRef?.current?.getCurrentRoute()?.name != 'IntroductionScreen1';
      if (
        appState?.current?.match(/inactive|background/) &&
        nextAppState === 'active' &&
        strictCondition
      ) {
        showOpenAppAd();
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={state => {
          analytics().logScreenView({
            screen_name: state.routes[state.index].name, //logging screen name to firebase Analytics
          });
          crashlytics().setAttributes({
            platform: Platform.OS,
            CrashedScreenName: state.routes[state.index].name,
          });
        }}>
        <LoginStack updateAvialable={'hello'} />
      </NavigationContainer>
      <FlashMessage
        position="top"
        hideOnPress={true}
        autoHide={true}
        duration={2500}
        statusBarHeight={StatusBar_Bar_Height + 30}
      />

      {/* {!!progress ? showProgressView() : null} */}
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
export default App;

// export default codePush(codePushOptions)(App);
