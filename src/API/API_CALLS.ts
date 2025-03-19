import {Platform} from 'react-native';
import {NewAppapi} from '../Component/Config';
import {debounce, RequestAPI} from './RequestAPI';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import {
  setAgreementContent,
  setAllExercise,
  setAllWorkoutData,
  setBanners,
  setChallengesData,
  setCompleteProfileData,
  setCustomWorkoutData,
  setDynamicPopupValues,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setFitCoins,
  Setmealdata,
  setOfferAgreement,
  setPastWinners,
  setPlanType,
  setPurchaseHistory,
  setStoreData,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {store} from '../Component/ThemeRedux/Store';
import {historyData, postSubsData} from './responseTypes';
import {Dispatch, SetStateAction, version} from 'react';
import {EnteringEventFunction} from '../Screen/Event/EnteringEventFunction';
import {navigate} from '../Component/Utilities/NavigationUtil';
import {downloadImages} from '../Screen/Splash/downloadBanner';

let deviceID = '';
DeviceInfo.syncUniqueId().then(uniqueId => {
  //   console.log('DEIVEID', uniqueId);
  deviceID = uniqueId;
});

const dispatch = store.dispatch;

const UpgradeAppResponse = () => {
  showMessage({
    message: 'Something went wrong Try Again Or Upgrade your App',
    type: 'danger',
    animationDuration: 500,
    floating: true,
  });
  return 'Something went wrong Try Again';
};

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
            // console.log(
            //   name,
            //   email,
            //   Platform.OS,
            //   VersionNumber.appVersion,
            //   deviceID,
            //   data,
            // );
            if (data && status == 200) {
              noMessage &&
                showMessage({
                  message: data?.message,
                  type: 'success',
                  animationDuration: 500,
                  floating: true,
                });
              resolve(data);
            } else {
              reject(UpgradeAppResponse());
            }
          },
        ),
      );
    },
    300,
  ),
  updateEmailOnLogin: debounce(
    (
      name: string,
      email: string,
      insertedEmail: string,
      noMessage?: boolean | true,
    ) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'POST',
          NewAppapi.POST_UPDATE_EMAIL,
          {
            name,
            old_email: email,
            new_email: insertedEmail,
            version: VersionNumber.appVersion,
            device_id: deviceID,
          },
          ({data, errors, status, message}) => {
            console.log(
              name,
              email,
              Platform.OS,
              VersionNumber.appVersion,
              deviceID,
              data,
            );
            if (status == 200) {
              noMessage &&
                showMessage({
                  message: data?.message,
                  type: 'success',
                  animationDuration: 500,
                  floating: true,
                });
              resolve(data);
            } else {
              reject(UpgradeAppResponse());
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
          // console.log(data, 'USER DETAILS');
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
  getHistoryDetails: debounce(
    (
      user_id: string,
      date: string,
      setData: Dispatch<SetStateAction<historyData>>,
    ) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'GET',
          NewAppapi.GET_ALL_HISTORY,
          {
            user_id,
            date,
            version: VersionNumber.appVersion,
          },
          ({data, errors, status, message}) => {
            if (data?.status) {
              // console.log('DATA', data?.data?.normal_exercises, user_id);
              // showMessage({
              //   message: data?.message,
              //   type: 'success',
              //   animationDuration: 500,
              //   floating: true,
              // });
              setData(data?.data);
            } else {
              // showMessage({
              //   message: 'Something went wrong Try Again OR Upgrade your App',
              //   type: 'danger',
              //   animationDuration: 500,
              //   floating: true,
              // });
              reject('Something went wrong Try Again');
            }
          },
        ),
      );
    },
    500,
  ),
  getBreatheTime: debounce(
    (user_id: string, setData: Dispatch<SetStateAction<any>>) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'GET',
          NewAppapi.GET_BREATH_SESSION,
          {
            user_id,
          },
          ({data, errors, status, message}) => {
            if (data) {
              const activeIndex = data?.sessions?.findIndex(
                (item: any) => item.status == 'open',
              );
              if (activeIndex != -1) {
                setData({
                  active: true,
                  coins: data?.sessions[activeIndex],
                });
              }
              resolve('');
            } else {
              setData({
                active: false,
                coins: 0,
              });
              reject('');
            }
          },
        ),
      );
    },
    500,
  ),
  getHomeHistory: debounce(
    (user_id: string, setData: Dispatch<SetStateAction<any>>) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'GET',
          NewAppapi.GET_BOTH_HISTORY,
          {
            user_id,
            version: VersionNumber.appVersion,
          },
          ({data, errors, status, message}) => {
            if (status) {
              setData(data?.data);
              resolve('');
            } else {
              setData({
                total_calories: 0,
                total_exercise_count: 0,
                total_time: 0,
              });
              reject('');
            }
          },
        ),
      );
    },
    500,
  ),
  getLeaderboardData: debounce(
    (user_id: string, setData: Dispatch<SetStateAction<any>>) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'GET',
          NewAppapi.GET_LEADERBOARD,
          {
            user_id,
            version: VersionNumber.appVersion,
          },
          ({data, errors, status, message}) => {
            if (data) {
              setData(data?.data);
              const myRank = data?.data?.findIndex(
                (item: any) => item?.id == user_id,
              );
              dispatch(
                setFitCoins(myRank != -1 ? data?.data[myRank]?.fit_coins : 0),
              );
              resolve('');
            } else {
              setData([]);
              reject('');
            }
          },
        ),
      );
    },
    500,
  ),
  getEventEarnedCoins: debounce(
    (user_id: string, day: string, setData: Dispatch<SetStateAction<any>>) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'GET',
          NewAppapi.GET_COINS,
          {
            version: VersionNumber.appVersion,
            user_id,
            day,
          },
          ({data, errors, status, message}) => {
            if (data) {
              setData(data?.responses);
              resolve('');
            } else {
              setData([]);
              reject('');
            }
          },
        ),
      );
    },
    500,
  ),
  getReferralCode: debounce(
    (user_id: string, setData: Dispatch<SetStateAction<any>>) => {
      return new Promise((resolve, reject) =>
        RequestAPI.makeRequest(
          'POST',
          NewAppapi.GENERATE_REFERRAL_CODE,
          {
            user_id,
          },
          ({data, errors, status, message}) => {
            if (data) {
              setData(data?.code?.toUpperCase());
              resolve('');
            } else {
              setData('');
              reject('');
            }
          },
        ),
      );
    },
    500,
  ),
  getSubscriptionDetails: debounce((user_id: string) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'GET',
        NewAppapi.ALL_USER_DETAILS,
        {
          user_id,
          version: VersionNumber.appVersion,
        },
        ({data, errors, status, message}) => {
          if (data?.msg == 'Please update the app to the latest version.') {
            reject(UpgradeAppResponse());
          } else if (status == 200) {
            dispatch(setCustomWorkoutData(data?.workout_data));
            dispatch(setOfferAgreement(data?.additional_data));
            dispatch(setUserProfileData(data?.profile));
            if (typeof data.event_details == 'object') {
              EnteringEventFunction(
                dispatch,
                data.event_details,
                setEnteredCurrentEvent,
                setEnteredUpcomingEvent,
                setPlanType,
              );
            }
            resolve(status);
          } else {
            reject(UpgradeAppResponse());
          }
        },
      ),
    );
  }, 300),
  createSubscriptionPlan: debounce((data: postSubsData) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'POST',
        NewAppapi.EVENT_SUBSCRIPTION_POST,
        data,
        ({data, errors, status, message}) => {
          console.log(data, status);
          if (status != 200) {
            if (
              data?.message == 'Event created successfully' ||
              data?.message ==
                'Plan upgraded and new event created successfully'
            ) {
              resolve('');
              navigate('UpcomingEvent', {eventType: 'current'});
            } else if (
              data?.message ==
              'Plan upgraded and existing subscription updated successfully'
            ) {
              resolve('');
              navigate('UpcomingEvent', {eventType: 'upcoming'});
            } else {
              showMessage({
                message: 'Something went wrong Try Again',
                type: 'danger',
                animationDuration: 500,
                floating: true,
              });
              reject('Error');
            }
          } else {
            reject(UpgradeAppResponse());
          }
        },
      ),
    );
  }, 500),
  getMajorData: debounce(() => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'GET',
        NewAppapi.GET_ALL_IN_ONE,
        {
          version: VersionNumber.appVersion,
        },
        ({data, errors, status, message}) => {
          if (
            data?.msg == 'Please update the app to the latest version.' ||
            data?.msg == 'version is required'
          ) {
            reject(UpgradeAppResponse());
          } else if (status == 200) {
            const objects: any = {};
            data?.data?.forEach((item: any) => {
              objects[item?.type] = item?.image;
            });
            downloadImages(data?.custom_dailog_data[0], dispatch);
            dispatch(setDynamicPopupValues(data?.custom_dailog_data[0]));

            dispatch(setBanners(objects));
            dispatch(setAgreementContent(data?.terms[0]));
            dispatch(Setmealdata(data?.diets));
            dispatch(setStoreData(data?.types));
            dispatch(setCompleteProfileData(data?.additional_data));
            resolve(status);
          } else {
            reject(UpgradeAppResponse());
          }
        },
      ),
    );
  }, 300),
  getAllExercisesData: debounce((user_id: string) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'GET',
        NewAppapi.ALL_USER_WITH_CONDITION,
        {
          user_id,
          version: VersionNumber.appVersion,
        },
        ({data, errors, status, message}) => {
          if (
            data?.msg == 'user id is required' ||
            data?.msg == 'version is required'
          ) {
            reject(UpgradeAppResponse());
          } else if (status == 200) {
            dispatch(setChallengesData(data?.challenge_data));
            dispatch(setAllExercise(data?.data));
            resolve(status);
          } else {
            reject(UpgradeAppResponse());
          }
        },
      ),
    );
  }, 300),
  getAllWorkouts: debounce((id: string) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'POST',
        NewAppapi.ALL_WORKOUTS,
        {
          id,
          version: VersionNumber.appVersion,
        },
        ({data, errors, status, message}) => {
          if (
            data?.msg == 'user id is required' ||
            data?.msg == 'Please update the app to the latest version.'
          ) {
            reject(UpgradeAppResponse());
          } else if (status == 200) {
            dispatch(setAllWorkoutData(data));
            resolve(status);
          } else {
            reject(UpgradeAppResponse());
          }
        },
      ),
    );
  }, 300),
  pastWinners: debounce(() => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'POST',
        NewAppapi.GET_PAST_WINNERS,
        {
          version: VersionNumber.appVersion,
        },
        ({data, errors, status, message}) => {
          if (
            data?.msg == 'user id is required' ||
            data?.msg == 'Please update the app to the latest version.'
          ) {
            reject(UpgradeAppResponse());
          } else if (status == 200) {
            dispatch(setPastWinners(data?.data));
            resolve(status);
          } else {
            reject(UpgradeAppResponse());
          }
        },
      ),
    );
  }, 300),
  updateUserDetails: debounce((input: any) => {
    return new Promise((resolve, reject) =>
      RequestAPI.makeRequest(
        'POST',
        NewAppapi.UpdateUserProfile,
        {
          ...input,
          version: VersionNumber.appVersion,
        },
        ({data, errors, status, message}) => {
          console.log(data,input);
          if (data?.msg == 'Please update the app to the latest version.')
            UpgradeAppResponse();
          else if (data.msg == 'User Updated Successfully') {
            resolve(data.profile);
            showMessage({
              message: 'Details updated successfully.',
              floating: true,
              type: 'success',
              animationDuration: 750,
            });
          } else {
            console.log(errors, 'rrrr');
            UpgradeAppResponse();
          }
        },
      ),
    );
  }, 500),
};
