import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Alert, Platform, AppState} from 'react-native';
export const requestPermissionforNotification = async () => {
  if (Platform.OS == 'ios') {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus == 1) {
      console.log(authorizationStatus);
      DeviceToken();
    }
  } else if (Platform.OS == 'android') {
    askPermissionRequestforAndroid();
  } else {
    console.log('Not authorized');
  }
};
const askPermissionRequestforAndroid = async () => {
  const DToken = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  if (DToken == 'granted') {
    DeviceToken();
  }
};
const DeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('DEVICE TOKEN--------->', token);
  } catch (error) {
    console.log('Token Error', error);
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
