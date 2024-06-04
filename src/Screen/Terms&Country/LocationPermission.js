import Geolocation from '@react-native-community/geolocation';
import {Alert} from 'react-native';
import geocoder from 'react-native-geocoder-reborn';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';

export const locationPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) {
      return await getCurrentLocation();
    } else if (result === RESULTS.BLOCKED) {
      showPermissionAlert();
    }
  } else {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    if (result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
      return await getCurrentLocation();
    } else if (
      result['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.BLOCKED
    ) {
      showPermissionAlert();
    }
  }
};

const showPermissionAlert = () => {
  Alert.alert(
    'Permission Required',
    'To use the rewards feature, please enable location access in settings',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open settings', onPress: openSettings},
    ],
    {cancelable: false},
  );
};

const getCurrentLocation = () => {
  console.log('getCoutnry')
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const pos = position.coords;
        const Coords = {
          lat: pos.latitude,
          lng: pos.longitude,
        };
        geocoder
          .geocodePosition(Coords)
          .then(res => {
            const country = res[0].country;
            resolve(country);     
          })
          .catch(err => {
            reject(err);
          });
      },
      error => {
        console.log('err Coord', error.code, error);
        reject(error);
      },
      {enableHighAccuracy: false, maximumAge: 0},
    );
  });
};
