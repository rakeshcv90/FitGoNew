import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Alert, Platform, AppState, PermissionsAndroid} from 'react-native';
import {setFcmToken} from '../ThemeRedux/Actions';
export const requestPermissionforNotification = async dispatch => {
  if (Platform.OS == 'android') {
    if (Platform.Version >= 31) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    await messaging().registerDeviceForRemoteMessages();
    token = await messaging().getToken();
    console.log('Android token is', token);
    dispatch(setFcmToken(token));
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      token = await messaging().getToken();
      console.log('Ios token is', token);
      dispatch(setFcmToken(token));
    }
  }
};

export const RemoteMessage = () => {
  // try {
  // } catch (error) {
  //   console.log('onm', error);
  // }
  messaging().onMessage(async remoteMessage => {
    console.log('onM11', remoteMessage);
    DisplayNotification(remoteMessage);
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Back', remoteMessage);
    DisplayNotification(remoteMessage);
  });
  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;
    console.log('presss', Platform.OS, type, detail);
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
      console.log("NEW NOTI TIME", currentTime)
    }
  });
  notifee.createChannel({
    id: 'Time',
    name: 'Time',
    bypassDnd: true,
    vibration: true,
    visibility: AndroidVisibility.PUBLIC,
    importance: AndroidImportance.HIGH,
    description: 'CHANNEL FOR NOTIFICATION'
  })

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
    console.log('INi', remoteMessage);
    DisplayNotification(remoteMessage);
  });
};
const removeHtmlTags = str => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]+>/g, '');
};

// Cleaned title without HTML tags
const DisplayNotification = async Notification => {
  const cleanedTitle = removeHtmlTags(Notification?.data?.message);
  console.log('onM111233344', cleanedTitle);
  try {
    await notifee.displayNotification({
      title: Notification?.data?.title || Notification.notification.title,
      body: cleanedTitle || Notification.notification.body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        //largeIcon: Notification?.data?.image,
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture: Notification?.data?.image,
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
            url: Notification.data.image,
          },
        ],
      },
    });
  } catch (error) {
    console.log('notifee Error', error);
  }
};
