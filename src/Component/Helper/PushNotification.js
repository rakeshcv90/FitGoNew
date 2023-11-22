
import messaging from '@react-native-firebase/messaging';
import notifee, { AlarmType } from '@notifee/react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import { Alert, Platform } from 'react-native';
export const requestPermissionforNotification = async () => {
  if(Platform.OS=='ios'){
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus == 1) {
      console.log(authorizationStatus);
      DeviceToken();
    }
  }
  else if(Platform.OS=='android'){
    askPermissionRequestforAndroid()
  }
  else{
    console.log("Not authorized")
  }
};
const askPermissionRequestforAndroid=async()=>{
  const DToken=  await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
  if(DToken=='granted'){
   DeviceToken()
  }
}
 const DeviceToken = async () => {
    try {
      //  await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('DEVICE TOKEN--------->', token);
    } catch (error) {
      console.log('Token Error', error);
    }
  };
export const RemoteMessage = () => {
  messaging().onMessage(async remoteMessage => {
    try {
      Alert.alert(remoteMessage.notification.body)
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android:{
          channelId:'default',
        },
        ios:{
          categoryId:"default"
        }
      });
    } catch (error) {
      console.log('errrer', error);
    }
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    try {
      await notifee.displayNotification(JSON.parse(remoteMessage));
    } catch (error) {}
  });
  messaging().getInitialNotification(async remoteMessage => {
    try {
      await notifee.displayNotification(JSON.parse(remoteMessage));
    } catch (error) {}
  });
};

