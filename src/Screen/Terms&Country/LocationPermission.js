import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
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
import {NewAppapi} from '../../Component/Config';
import VersionNumber, {appVersion} from 'react-native-version-number';
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
        const {latitude, longitude} = position?.coords;
        const coords = {
          lat: latitude, // 36.17367911141759, -115.15029443045587 United States
          lng: longitude,
        };
        getApiKey()
          .then(res => {
            console.log('resss',res)
            getCountryFromCoordinates(coords,res?.data[0]?.api_url, res?.data[0]?.api_key)
              .then(response => {
                resolve(response);
              })
              .catch(err => {
                console.log('coords error1', err);
                reject(err);
              });
          })
          .catch(err => {
            console.log('coords error', err);
            reject(err);
          });
      },
      error => {
        reject(error); // Call reject with the error object
        console.log('coords error---->', error);
      },
    );
  });
};
const getApiKey = async () => {
  try {
    const response = await axios.get(
      `${NewAppapi.GET_APIKEY}?version=${VersionNumber.appVersion}`,
    );
    return response?.data;
  } catch (error) {
    console.log('something error-->', error);
    return null;
  }
};
const getCountryFromCoordinates = async (Coords, apiUrl,apikey) => {
  try {
    const response = await axios.get(
      apiUrl,
      {
        params: {
          latlng: `${Coords.lat},${Coords.lng}`,
        },
        headers:{
          'x-rapidapi-key':apikey
        }
      },
    );
    // Extract country from the response
    const addressComponents = response.data.results[0].address_components;
    const countryComponent = addressComponents.find(component =>
      component.types.includes('country'),
    );
    console.log(countryComponent)
    const countryLongName = countryComponent
      ? countryComponent.long_name
      : null;
    return countryLongName;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
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
