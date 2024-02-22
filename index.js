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
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';

notifee.createChannel({
  id: 'Time',
  name: 'Time',
  bypassDnd: true,
  vibration: true,
  visibility: AndroidVisibility.PUBLIC,
  importance: AndroidImportance.HIGH,
  description: 'CHANNEL FOR NOTIFICATION',
});
messaging().setBackgroundMessageHandler(remoteMessage => {
  // DisplayNotification(remoteMessage);
  console.log('BACK', remoteMessage);
});
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  console.log('presss', Platform.OS, detail);
  TriggerButtons(notification, pressAction);
});
notifee.onForegroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  console.log('presss', Platform.OS, detail);
  TriggerButtons(notification, pressAction);
});
const TriggerButtons = async (notification, pressAction) => {
  if (type === EventType.ACTION_PRESS && pressAction.id === 'Stop') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  } else if (
    type === EventType.ACTION_PRESS &&
    pressAction.id === 'Plus_Five'
  ) {
    // Remove the notification
    // Get the current time
    const currentTime = new Date();

    // Add 5 minutes to the current time
    currentTime.setMinutes(currentTime.getMinutes() + 1);
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: currentTime.getTime(), // fire at 11:10am (10 minutes before meeting)
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
            id: 'Alarm',
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
    console.log('NEW NOTI TIME', currentTime);
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
messaging().getInitialNotification(async remoteMessage => {
  console.log('INI NOTI', remoteMessage);
  // DisplayNotification(remoteMessage);
});

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
  console.log('Notification', Notification);
  const cleanedTitle = removeHtmlTags(Notification?.data?.message);
  try {
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
  } catch (error) {
    console.log('notifee Error', error);
  }
};
const AppRedux = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('REMOTE', remoteMessage);
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
      console.error('Fatal Error in Crashlatics:', error);
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

    console.error = error => {
      crashlytics().log(`Crashlatics Dev Console Error: ${error}`);
    };
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

TrackPlayer.registerPlaybackService(() => require('./src/service'));
AppRegistry.registerComponent(appName, () => AppRedux);
