import Geolocation from '@react-native-community/geolocation';
import {Alert} from 'react-native';
import geocoder from 'react-native-geocoder-reborn';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  openSettings,
  check,
  checkMultiple,
  request,
} from 'react-native-permissions';

export const locationPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) {
      return await getCurrentLocation();
    } else if (result == RESULTS.DENIED) {
      return RESULTS.DENIED;
    } else if (result === RESULTS.BLOCKED) {
      return RESULTS.BLOCKED;
    }
  } else {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    if (result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
      return await getCurrentLocation();
    } else if (result['android.permission.ACCESS_FINE_LOCATION'] === 'denied') {
      return RESULTS.DENIED;
    } else if (
      result['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.BLOCKED
    ) {
      return RESULTS.BLOCKED;
    }
  }
};
const getCurrentLocation = () => {
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
export const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    } else if (result == 'denied') {
      return RESULTS.DENIED;
    } else if (result === RESULTS.BLOCKED) {
      return RESULTS.BLOCKED;
    }
  } else {
    const result = await checkMultiple([
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    if (result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
      return RESULTS.GRANTED;
    } else if (result['android.permission.ACCESS_FINE_LOCATION'] === 'denied') {
      return RESULTS.DENIED;
    } else if (
      result['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.BLOCKED
    ) {
      return RESULTS.BLOCKED;
    }
  }
};
