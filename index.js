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
import {AlarmNotification} from './src/Component/Reminder';
import {
  DeleteWeeklyDataAPIStart,
  StepcountNoticationStart,
} from './src/Component/TransferStepCounterData';

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
  if (remoteMessage.data?.type == 'delete_notification') {
    DeleteWeeklyDataAPIStart();
  } else {
    StepcountNoticationStart();
  }
});
notifee.onBackgroundEvent(async ({type, detail}) => {
  TriggerButtons(detail, type);
});
notifee.onForegroundEvent(async ({type, detail}) => {
  TriggerButtons(detail, type);
});
const TriggerButtons = async (detail, type) => {
  const {notification, pressAction} = detail;
  console.log('TRI', type);
  if (notification.data?.type == 'delete_notification') {
    DeleteWeeklyDataAPIStart();
  } else {
    StepcountNoticationStart();
  }
  if (type === EventType.ACTION_PRESS && pressAction.id === 'Stop') {
    // Remove the notification
    await notifee.cancelDisplayedNotification(notification.id);
  } else if (
    type === EventType.ACTION_PRESS &&
    pressAction.id === 'Plus_Five'
  ) {
    const currentTime = new Date();

    // Add 5 minutes to the current time
    currentTime.setMinutes(currentTime.getMinutes() + 5);
    AlarmNotification(currentTime);
  } else {
    console.log('OPEN NOTIFICATION', pressAction);
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
  sound: 'fitme_notification',
});
const DisplayNotification = async Notification => {
  console.log('NOTIFICATION', Notification.data?.type);
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
          sound: 'fitme_notification',
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
          sound: 'fitme_notification',
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
  if (Notification.data?.type == 'delete_notification') {
    DeleteWeeklyDataAPIStart();
  } else {
    StepcountNoticationStart();
  }
};
messaging().getInitialNotification(async remoteMessage => {
  // DisplayNotification(remoteMessage);
  console.log('Kill NOTIFUCATION', remoteMessage);
  if (remoteMessage.data?.type == 'delete_notification') {
    DeleteWeeklyDataAPIStart();
  } else {
    StepcountNoticationStart();
  }
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


AppRegistry.registerComponent(appName, () => AppRedux);
TrackPlayer.registerPlaybackService(() => require('./src/service'));
