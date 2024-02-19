import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
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
  // notifee.onBackgroundEvent(async remoteMessage => {
  //   console.log('Notification', remoteMessage);
  //   DisplayNotification(remoteMessage.detail);
  // });
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
        style:{type:AndroidStyle.BIGPICTURE,picture:Notification?.data?.image}
      },
      ios: {
        categoryId: 'default',
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
