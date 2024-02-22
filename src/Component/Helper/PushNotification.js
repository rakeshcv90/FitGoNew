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

// export const RemoteMessage = () => {
//   // try {
//   // } catch (error) {
//   //   console.log('onm', error);
//   // }
//   messaging().onMessage(async remoteMessage => {
//   //  DisplayNotification(remoteMessage);
//   });
//   // notifee.onForegroundEvent(async remoteMessage => {
//   //   console.log('Fore', remoteMessage);
//   //   DisplayNotification(remoteMessage);
//   // });
//   messaging().setBackgroundMessageHandler(DisplayNotification)
//   // messaging().setBackgroundMessageHandler(async remoteMessage => {
//   //   console.log("BACK MESSS", remoteMessage)
//   //   DisplayNotification(remoteMessage);
//   // })
  
//   notifee.createChannel({
//     id: 'Time',
//     name: 'Time',
//     bypassDnd: true,
//     vibration: true,
//     visibility: AndroidVisibility.PUBLIC,
//     importance: AndroidImportance.HIGH,
//     description: 'CHANNEL FOR NOTIFICATION',
//   });
//   notifee.deleteChannel('Fitme')
//   notifee.createChannel({
//     id: 'Fitme',
//     name: 'Fitme',
//     bypassDnd: true,
//     vibration: true,
//     visibility: AndroidVisibility.PUBLIC,
//     importance: AndroidImportance.HIGH,
//     description: 'CHANNEL FOR NOTIFICATION',
//     sound: 'default',
//   });

//   notifee.setNotificationCategories([
//     {
//       id: 'Alarm',
//       actions: [
//         {
//           id: 'Plus_Five',
//           title: 'Add +5',
//         },
//         {
//           id: 'Stop',
//           title: 'Stop',
//           destructive: true,
//         },
//       ],
//     },
//   ]);

//   messaging().getInitialNotification(async remoteMessage => {
//     console.log("INI NOTI", remoteMessage)
//   //  DisplayNotification(remoteMessage);
//   });
// };
const removeHtmlTags = str => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]+>/g, '');
};

// Cleaned title without HTML tags
export const DisplayNotification = async Notification => {
  console.log('Notification',Notification)
  const cleanedTitle = removeHtmlTags(Notification?.data?.message);
  try {
    await notifee.displayNotification({
      title: Notification?.data?.title || Notification.notification.title,
      body: cleanedTitle || Notification.notification.body,
      // id:Notification.data?.notification_id,
      android: {
        channelId: 'Fitme',
        largeIcon: 'ic_launcher',
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
