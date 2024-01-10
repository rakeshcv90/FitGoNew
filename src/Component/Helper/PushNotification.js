import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Alert, Platform, AppState, PermissionsAndroid} from 'react-native';
import { setFcmToken } from '../ThemeRedux/Actions';
export const requestPermissionforNotification = async (dispatch) => {
  if (Platform.OS == 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    await messaging().registerDeviceForRemoteMessages();
    token = await messaging().getToken();
    console.log('Android token is', token);
    dispatch(setFcmToken(token))
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      token = await messaging().getToken();
      console.log('Ios token is', token);
      dispatch(setFcmToken(token))
    }
  }
};

export const RemoteMessage = () => {
  try {
    messaging().onMessage(async remoteMessage => {
      DisplayNotification(remoteMessage);
    });
  } catch (error) {
    console.log('onm', error);
  }
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    DisplayNotification(remoteMessage);
  });
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
        },
      ],
    },
  ]);

  messaging().getInitialNotification(async remoteMessage => {
    DisplayNotification(remoteMessage);
  });
};
const DisplayNotification = async Notification => {
  try {
    await notifee.displayNotification({
      title: Notification.notification.title,
      body: Notification.notification.body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      },
      ios: {
        categoryId: 'default',
      },
    });
  } catch (error) {
    console.log('notifee Error', error);
  }
};
