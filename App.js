import 'react-native-gesture-handler';
import {StyleSheet, Platform, AppState} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router, {LoginStack} from './src/Navigation/Router';
import FlashMessage from 'react-native-flash-message';
import {useDispatch} from 'react-redux';
import {DeviceHeigth, DeviceWidth} from './src/Component/Config';

import {
  requestPermissionforNotification,
  RemoteMessage,
} from './src/Component/Helper/PushNotification';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import {LogBox} from 'react-native';

// import {OpenAppAds} from './src/Component/BannerAdd';

import {navigationRef} from './src/Component/Utilities/NavigationUtil';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

const App = () => {
  useEffect(() => {
    requestPermissionforNotification(dispatch);
    
    // RemoteMessage();
  }, []);

  useEffect(() => {
    try {
      // analytics().setAnalyticsCollectionEnabled(true);
      // crashlytics().setCrashlyticsCollectionEnabled(true);
    } catch (error) {
      crashlytics().recordError(error);
    }
    alalyicsData();
  }, []);

  const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
  const dispatch = useDispatch();

  const alalyicsData = () => {
    analytics().logEvent('Platform', {
      data: Platform.OS,
    });
  };

  // const {showOpenAppAd} = OpenAppAds();
  const appState = useRef(AppState.currentState);
  const routesToSkip = [
    'SplaceScreen',
    'Log In',
    'Sign Up',
    'PermissionScreen',
    'CustomWorkout',
    'CreateWorkout',
    'IntroductionScreen1',
  ];
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const strictCondition = routesToSkip.includes(
        navigationRef?.current?.getCurrentRoute()?.name,
      );
      // if (
      //   appState?.current?.match(/inactive|background/) &&
      //   nextAppState === 'active' &&
      //   !strictCondition
      // ) {
      //   // showOpenAppAd();
      // }
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
