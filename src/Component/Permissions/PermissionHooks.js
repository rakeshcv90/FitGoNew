import Geolocation from '@react-native-community/geolocation';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {
  check,
  checkMultiple,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {NewAppapi} from '../Config';
import VersionNumber from 'react-native-version-number';
import notifee from '@notifee/react-native';
import AppleHealthKit from 'react-native-health';
import axios from 'axios';
export const useLocation = () => {
  // permission as per the platform
  const permission =
    Platform.OS == 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : [
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ];
  //check
  const checkLocationPermission = async () => {
    const result =
      Platform.OS === 'ios'
        ? await check(permission)
        : await checkMultiple(permission);
    return result;
  };
  //ask
  const askLocationPermission = async () => {
    const result =
      Platform.OS == 'ios'
        ? await request(permission)
        : await requestMultiple(permission);
    return result;
  };
  return {askLocationPermission, checkLocationPermission};
};
//location apis
export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const coordinates = {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude, // 36.17367911141759, -115.15029443045587 United States
          };
          const apiKeys = await getApiKey();
          const country = await getCountryFromCoordinates(
            coordinates,
            apiKeys?.data[0]?.api_url,
            apiKeys?.data[0]?.api_key,
          );
          resolve(country);
        } catch (error) {
          reject(error);
        }
      },
      error => {
        reject(error);
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
const getCountryFromCoordinates = async (coordinates, apiUrl, apikey) => {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        latlng: `${coordinates.lat},${coordinates.lng}`,
      },
      headers: {
        'x-rapidapi-key': apikey,
      },
    });
    // Extract country from the response
    const addressComponents = response.data.results[0].address_components;
    const countryComponent = addressComponents.find(component =>
      component.types.includes('country'),
    );
    const countryLongName = countryComponent
      ? countryComponent.long_name
      : null;
    return countryLongName;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
};
export const storeAgreementApi = async country => {
  setLoaded(false);
  const payload = new FormData();
  payload.append('version', VersionNumber?.appVersion);
  payload.append('user_id', getUserDataDetails?.id);
  payload.append('country', country);
  payload.append('term_conditons', 'Accepted');
  try {
    const result = await axios(NewAppapi.STORE_USER_AGR_COUNTRY, {
      method: 'POST',
      data: payload,
      headers: {'Content-Type': 'multipart/form-data'},
    });
    if (result?.data) {
      return await getAgreementStatus();
    }
  } catch (error) {
    showMessage({
      message: 'Something went wrong.',
      floating: true,
      duration: 500,
      type: 'danger',
      icon: {icon: 'auto', position: 'left'},
    });
  }
};
const getAgreementStatus = async () => {
  try {
    const result = await axios(NewAppapi.GET_AGR_STATUS, {
      method: 'POST',
      data: {
        user_id: getUserDataDetails?.id,
        version: VersionNumber?.appVersion,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (result?.data?.msg == 'Please update the app to the latest version.') {
      showMessage({
        message: result?.data?.msg,
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      return result?.data;
    }
  } catch (error) {
    showMessage({
      message: 'Something went wrong.',
      floating: true,
      duration: 500,
      type: 'danger',
      icon: {icon: 'auto', position: 'left'},
    });
  }
};
// gallery permissions
export const useGalleryPermission = () => {
  //suitable permission as per the platform
  const permission =
    Platform.OS == 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : Platform.Version >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  //check
  const checkPermissionForLibarary = async () => {
    try {
      return await check(permission);
    } catch (error) {
      console.log(error, 'error in checking permissions');
    }
  };
  //ask
  const askPermissionForLibrary = async () => {
    try {
      return await request(permission);
    } catch (error) {
      console.log('LibimageError', error);
    }
  };
  //launch
  const launchImageLibrary = async () => {
    try {
      const resultLibrary = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 300,
        maxHeight: 200,
      });
      return resultLibrary;
    } catch (error) {
      console.log('lib launch error', error);
    }
  };
  return {
    checkPermissionForLibarary,
    askPermissionForLibrary,
    launchImageLibrary,
  };
};
// notification permissions
export const useNotificationPermissions = () => {
  //check
  const checkNotificationPermission = async () => {
    try {
      return await notifee.getNotificationSettings();
    } catch (error) {
      console.log('error checking notification permission', error);
    }
  };
  //ask
  const askNotificationPermission = async () => {
    try {
      return await notifee.requestPermission();
    } catch (error) {
      console.log('error asking notification permission');
    }
  };
  return {checkNotificationPermission, askNotificationPermission};
};
// healthikit permission for ios
export const useHealthkitPermission = () => {
  const permission = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.StepCount],
      write: [AppleHealthKit.Constants.Permissions.StepCount],
    },
  };
  const checkHealthikitPermission = async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        AppleHealthKit.getAuthStatus(permission, (err, result) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(result); // Resolve the promise with the result
          }
        });
      });
      console.log(result, '111'); // You can now handle the result here
      return result; // Return the result from the function
    } catch (error) {
      console.error('Error checking HealthKit permission:', error);
    }
  };
  const initHealthKit = () => {
    AppleHealthKit.isAvailable((err, available) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
      } else if (available) {
        AppleHealthKit.initHealthKit(permission, (error, result) => {
          if (error) {
            Alert.alert('Error', 'Error while initializing  healthkit', {});
          }
        });
      } else {
        Alert.alert(
          'Attention',
          "Health data can't be tracked in this Device due to its specifications",
          {},
        );
      }
    });
  };
  const requestSteps = async () => {
    const options = {
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0,
      ),
      endDate: new Date(),
    };
    const healthData = await new Promise((resolve, reject) => {
      AppleHealthKit.getStepCount(options, (callbackError, results) => {
        if (callbackError) {
          reject(callbackError);
        } else {
          resolve(results);
        }
      });
    });
    console.log('healthData',healthData)
    return healthData;
  };

  return {initHealthKit, checkHealthikitPermission,requestSteps};
};
