import {Platform} from 'react-native';
import {NewAppapi} from '../Component/Config';
import {debounce, RequestAPI} from './RequestAPI';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import {setUserProfileData} from '../Component/ThemeRedux/Actions';
import {store} from '../Component/ThemeRedux/Store';

let deviceID = '';
DeviceInfo.syncUniqueId().then(uniqueId => {
  //   console.log('DEIVEID', uniqueId);
  deviceID = uniqueId;
});

const dispatch = store.dispatch;

export const API_CALLS = {
  postLogin: debounce(
    (name: string, email: string, noMessage?: boolean | true) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'POST',
          NewAppapi.POST_NEW_LOGIN,
          {
            name,
            email,
            platform: Platform.OS,
            version: VersionNumber.appVersion,
            device_id: deviceID,
          },
          ({data, errors, status, message}) => {
            if (data) {
              noMessage &&
                showMessage({
                  message: data?.message,
                  type: 'success',
                  animationDuration: 500,
                  floating: true,
                });
              resolve(data);
            } else {
              showMessage({
                message: 'Something went wrong Try Again OR Upgrade your App',
                type: 'danger',
                animationDuration: 500,
                floating: true,
              });
              reject('Something went wrong Try Again');
            }
          },
        ),
      );
    },
    300,
  ),
  getUserDataDetails: debounce((userID: string) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'GET',
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userID}`,
        {},
        ({data, errors, status, message}) => {
          console.log(data, 'USER DETAILS');
          if (data?.msg != 'Please update the app to the latest version.') {
            // showMessage({
            //   message: data?.message,
            //   type: 'success',
            //   animationDuration: 500,
            //   floating: true,
            // });

            dispatch(setUserProfileData(data?.profile));
            resolve(data);
          } else {
            showMessage({
              message: 'Upgrade your App',
              type: 'danger',
              animationDuration: 500,
              floating: true,
            });
            reject('Something went wrong Try Again');
          }
        },
      ),
    );
  }, 300),
  getCardioStatus: debounce((user_id: string, type: string) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'POST',
        NewAppapi.CARDIO_STATUS_WITHOUT_EVENT,
        {
          user_id,
          type,
        },
        ({data, errors, status, message}) => {
          if (data?.status) {
            showMessage({
              message: data?.message,
              type: 'success',
              animationDuration: 500,
              floating: true,
            });
            resolve(data?.status);
          } else {
            showMessage({
              message: 'Something went wrong Try Again OR Upgrade your App',
              type: 'danger',
              animationDuration: 500,
              floating: true,
            });
            reject('Something went wrong Try Again');
          }
        },
      ),
    );
  }, 300),
};
