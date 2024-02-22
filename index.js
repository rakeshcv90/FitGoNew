/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persister,store } from './src/Component/ThemeRedux/Store';
import  TrackPlayer from 'react-native-track-player'
import crashlytics from '@react-native-firebase/crashlytics';
import { useEffect } from 'react';
import { RemoteMessage } from './src/Component/Helper/PushNotification';
const AppRedux = () => {
// Register a global error handler
try {
  analytics().setAnalyticsCollectionEnabled(true);
   crashlytics().setCrashlyticsCollectionEnabled(true);
 } catch (error) {
   crashlytics().recordError(error);
 }
const globalErrorHandler = (error, isFatal) => {
  // Log the error to Crashlytics
  crashlytics().recordError(error);

  // Optionally, log additional information about the error
  crashlytics().log(`Global Error Message: ${error.message}`);
  crashlytics().log(`Global Error in Crashlatics: ${error}`);

  // If the error is fatal, you might want to crash the app manually or take appropriate action
  if (isFatal) {
    console.error('Fatal Error in Crashlatics:', error);
    // For example, you can use NativeModules to crash the app on Android
    // NativeModules.CrashlyticsCrash.crash();
  }
};

// Set up a global error handler
if (__DEV__) {
  // In development, log errors to the console

  console.error = (error) => {
    crashlytics().log(`Crashlatics Dev Console Error: ${error}`);
  };
} else {
  // In production, register the global error handler
  ErrorUtils.setGlobalHandler(globalErrorHandler);
}

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <App/>
      </PersistGate>
    </Provider>
  );
  };

TrackPlayer.registerPlaybackService(() => require('./src/service'));
AppRegistry.registerComponent(appName, () => AppRedux);
