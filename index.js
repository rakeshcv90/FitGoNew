/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persister, store} from './src/Component/ThemeRedux/Store';
import TrackPlayer from 'react-native-track-player';
import crashlytics from '@react-native-firebase/crashlytics';
import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {LogBox} from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import {AdManager, TestIds} from 'react-native-admob-native-ads';

notifee.createChannel({
  id: 'Time',
  name: 'Time',
  bypassDnd: true,
  vibration: true,
  visibility: AndroidVisibility.PUBLIC,
  importance: AndroidImportance.HIGH,
  description: 'CHANNEL FOR NOTIFICATION',
});
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('BACKGROUND NOTIFUCATION', remoteMessage);
});
notifee.onBackgroundEvent(async ({type, detail}) => {

  TriggerButtons(detail, type);
});
notifee.onForegroundEvent(async ({type, detail}) => {
  
  TriggerButtons(detail, type);
});
const TriggerButtons = async (detail, type) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'Stop') {

    await notifee.cancelNotification(notification.id);
  } else if (
    type === EventType.ACTION_PRESS &&
    pressAction.id === 'Plus_Five'
  ) {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 5);
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: currentTime.getTime(), 
      repeatFrequency: RepeatFrequency.DAILY,
    };
    await notifee.createTriggerNotification(
      {
        title: 'Exercise Time',
        body: `It's time to Exercise`,
        android: {
          channelId: 'Time',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          actions: [
            {
              title: 'Add +5',
              pressAction: {
                id: 'Plus_Five',
              },
            },
            {
              title: 'Stop',
              pressAction: {
                id: 'Stop',
              },
            },
            // Add more actions as needed
          ],
        },
        ios: {
          categoryId: 'Alarm',
          foregroundPresentationOptions: {
            badge: true,
            banner: true,
            sound: false,
          },
        },
        id: 'Timer',
      },
      trigger,
    );
  }
};

notifee.setNotificationCategories([
  {
    id: 'Alarm',
    actions: [
      {
        id: 'Plus_Five',
        title: 'Add +5',
      },
      {
        id: 'Stop',
        title: 'Stop',
        destructive: true,
      },
    ],
  },
]);

const removeHtmlTags = str => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]+>/g, '');
};

notifee.createChannel({
  id: 'Fitme',
  name: 'Fitme',
  bypassDnd: true,
  vibration: true,
  visibility: AndroidVisibility.PUBLIC,
  importance: AndroidImportance.HIGH,
  description: 'CHANNEL FOR NOTIFICATION',
  sound: 'default',
});
const DisplayNotification = async Notification => {
  console.log("NOTIFICATION", Notification)
  const cleanedTitle = removeHtmlTags(Notification?.data?.message);
  try {
    if (
      Notification?.data?.image ||
      Notification?.notification?.android?.imageUrl ||
      Notification.data?.fcm_options?.image
    )
      await notifee.displayNotification({
        title: Notification?.data?.title || Notification.notification?.title,
        body: cleanedTitle || Notification.notification?.body,
        // id: Notification.data?.notification_id,
        android: {
          channelId: 'Fitme',
          largeIcon: 'ic_launcher',
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture:
              Notification?.data?.image ||
              Notification?.notification?.android?.imageUrl,
            //  picture: 'https://i.pinimg.com/originals/7e/68/be/7e68be846a1afbf94fb2ac299843aa2a.jpg',
          },
        },
        ios: {
          categoryId: 'default',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
          attachments: [
            {
              url: Notification.data?.fcm_options?.image,
              // url:'https://i.pinimg.com/originals/7e/68/be/7e68be846a1afbf94fb2ac299843aa2a.jpg',
            },
          ],
        },
      });
    else
      await notifee.displayNotification({
        title: Notification?.data?.title || Notification.notification?.title,
        body: cleanedTitle || Notification.notification?.body,
        // id: Notification.data?.notification_id,
        android: {
          channelId: 'Fitme',
          largeIcon: 'ic_launcher',
        },
        ios: {
          categoryId: 'default',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });
  } catch (error) {
    console.log('notifee Error', error);
  }
};
messaging().getInitialNotification(async remoteMessage => {
  // DisplayNotification(remoteMessage);
  console.log('Kill NOTIFUCATION', remoteMessage);
});
const AppRedux = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  LogBox.ignoreAllLogs();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      DisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);
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
      // For example, you can use NativeModules to crash the app on Android
      // NativeModules.CrashlyticsCrash.crash();
    }
  };
  // <<<<<<< Rakesh
  // } else {
  //   // In production, register the global error handler
  //   ErrorUtils.setGlobalHandler(globalErrorHandler);
  // }

  // =======

  // Set up a global error handler
  if (__DEV__) {
    // In development, log errors to the console
  } else {
    // In production, register the global error handler
    ErrorUtils.setGlobalHandler(globalErrorHandler);
  }
  // useEffect(() => {
  // },[])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <App />
      </PersistGate>
    </Provider>
  );
};
AdManager.setRequestConfiguration({
  tagForChildDirectedTreatment: false,
});
AdManager.registerRepository({
  name: 'imageAd',
   adUnitId: TestIds.Video,
  // adUnitId: adUnitIDs,
  numOfAds: 3,
  nonPersonalizedAdsOnly: false,
  videoOptions: {
    mute: false,
  },
  expirationPeriod: 3600000, // in milliseconds (optional)
  mediationEnabled: false,
}).then(result => {
  console.log('registered: ', result);
});


AdManager.subscribe('imageAd', 'onAdPreloadClicked', () => {
  console.log('click', 'imageAd');
});

TrackPlayer.registerPlaybackService(() => require('./src/service'));
AppRegistry.registerComponent(appName, () => AppRedux);
