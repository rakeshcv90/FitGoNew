import {openSettings, RESULTS} from 'react-native-permissions';
import {localImage} from '../Image';
import {
  useGalleryPermission,
  useHealthkitPermission,
  useLocation,
  useNotificationPermissions,
} from './PermissionHooks';
import {AuthorizationStatus} from '@notifee/react-native';
import {Alert} from 'react-native';
import {PLATFORM_IOS} from '../Color';
import {showMessage} from 'react-native-flash-message';
import AndroidOpenSettings from 'react-native-android-open-settings';
// item Array
export const UIArray = [
  {
    img: localImage.gallery_permission,
    text1: 'Storage',
    text2: 'Allow Fitme to access file & Media on your device.',
    key: 'storage',
    checkPermission: 'checkPermissionForLibarary',
    askPermission: 'askPermissionForLibrary',
  },
  {
    img: localImage.notification_permission,
    text1: 'Notification',
    text2: 'Allow Fitme to send notifications for daily updates.',
    key: 'notification',
    checkPermission: 'checkNotificationPermission',
    askPermission: 'askNotificationPermission',
  },
  {
    img: localImage.location_permission,
    text1: 'Location',
    text2: 'Allow Fitme to access your location for better services.',
    key: 'location',
    checkPermission: 'checkLocationPermission',
    askPermission: 'askLocationPermission',
  },
  PLATFORM_IOS && {
    img: localImage.health_permission,
    text1: 'Health Kit',
    text2:
      'Allow Fitme to access health kit data to keep tracking your health data.',
    key: 'healthkit',
    checkPermission: 'checkHealthikitPermission', // You can handle HealthKit permission separately
    askPermission: 'initHealthKit',
  },
].filter(Boolean); // to remove the ios only part from the array
//
const {checkNotificationPermission, askNotificationPermission} =
  useNotificationPermissions();

const {askPermissionForLibrary, checkPermissionForLibarary} =
  useGalleryPermission();

const {askLocationPermission, checkLocationPermission} = useLocation();
const {initHealthKit, checkHealthikitPermission} = useHealthkitPermission();
//permissionMenthods
export const permissionMethods = {
  checkPermissionForLibarary,
  askPermissionForLibrary,
  checkNotificationPermission,
  askNotificationPermission,
  checkLocationPermission,
  askLocationPermission,
  initHealthKit,
  checkHealthikitPermission,
};

// else condition to show alert
export const showAlert = () => {
  Alert.alert(
    'Permission Required',
    "To access certain features of this app, you need to grant this permission from app's settings.",
    [
      {
        text: 'cancel',
        style: 'cancel',
      },
      {
        text: 'Open settings',
        onPress: openSettings,
      },
    ],
    {cancelable: false},
  );
};
// handle location error method
export const handleError = err => {
  if (err.message == 'No location provider available.') {
    Alert.alert(
      "Enable device's location service",
      "Oops , it's look your location service is not enable. Please enable your location service to use the app and take the benefits from app features.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Enable location service',
          onPress: () => AndroidOpenSettings.locationSourceSettings(),
        },
      ],
    );
  } else {
    showMessage({
      message: 'Error while getting your location',
      floating: true,
      duration: 1000,
      type: 'danger',
      icon: {icon: 'auto', position: 'left'},
    });
  }
};
//

export const trueCondition = result => {
  const isObject = typeof result === 'object' && result != null;
  console.log('result', result);
  return (
    result === RESULTS.GRANTED ||
    result === RESULTS.LIMITED ||
    (isObject &&
      result['android.permission.ACCESS_FINE_LOCATION'] == RESULTS.GRANTED) ||
    (isObject &&
      result['authorizationStatus'] === AuthorizationStatus.AUTHORIZED) ||
    (PLATFORM_IOS && isObject && result?.permissions?.read[0] == 2)
  );
};
//
export const alertCondition = result => {
  const isObject = typeof result === 'object' && result != null;
  return (
    result === RESULTS.BLOCKED ||
    (isObject &&
      result['android.permission.ACCESS_FINE_LOCATION'] == //location permissions
        RESULTS.BLOCKED) ||
    (isObject &&
      result['authorizationStatus'] === AuthorizationStatus.DENIED) ||
    (PLATFORM_IOS && isObject && result?.permissions?.read[0] == 1)
  );
};
