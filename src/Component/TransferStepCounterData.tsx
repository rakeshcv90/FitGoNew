import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import axios from 'axios';
// import GoogleFit, {Scopes} from 'react-native-google-fit';
import AppleHealthKit from 'react-native-health';
import {NewAppapi} from './Config';
import NetInfo from '@react-native-community/netinfo';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const StepCounterUpdateNotification = async () => {
  const CurrentTime = new Date();
  CurrentTime.setMinutes(CurrentTime.getMinutes() + 1);
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: CurrentTime.getTime(), // fire at 11:10am (10 minutes before meeting)
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      title: 'Testing Time',
      body: `It's time to Test`,
      android: {
        channelId: 'Time',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'Add +5',
            pressAction: {
              id: 'Plus_Five',
            },
          },
          {
            title: 'Stop',
            pressAction: {
              id: 'Stop',
            },
          },
          // Add more actions as needed
        ],
      },
      ios: {
        categoryId: 'Alarm',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          sound: false,
        },
      },
      id: 'StepCounterUpdate',
    },
    trigger,
  );
  // StepcountNoticationStart();
};

export const StepcountNoticationStart = async () => {
  const hasPermissionForStepCounter = await AsyncStorage.getItem(
    'hasPermissionForStepCounter',
  );
  if (
    hasPermissionForStepCounter != null ||
    hasPermissionForStepCounter != undefined
  ) {
    if (Platform.OS == 'android') {
      await GoogleFit.checkIsAuthorized();
      if (GoogleFit.isAuthorized) {
        GoogleFitData();
      } else {
        await GoogleFit.authorize({
          scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
        }).then(authResult => {
          if (authResult.success) {
            check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(
              fitnessPermissionResult => {
                if (fitnessPermissionResult == RESULTS.GRANTED) {
                  GoogleFitData();
                }
              },
            );
          }
        });
      }
    } else {
      AppleHealthKitData();
    }
  }
};

const GoogleFitData = async () => {
  try {
    const dailySteps = await GoogleFit.getDailySteps();
  
    const totalSteps = dailySteps.reduce(
      (total: any, acc: any) => (total + acc.steps[0] ? acc.steps[0].value : 0),
      0,
    );
    const distance = ((totalSteps / 20) * 0.01).toFixed(2);
    const calories = ((totalSteps / 20) * 1).toFixed(1);
  
    PedometerNotificationAPI(totalSteps, distance, calories);
  } catch (error) {
    console.error('Error fetching total steps', error);
    return null;
  }
};

const options: Object = {
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
const AppleHealthKitData = async () => {
  try {
    await AppleHealthKit.isAvailable((err, available) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      if (available) {
        AppleHealthKit.getStepCount(options, (callbackError, results) => {
          if (callbackError) {
      
          }
          const totalSteps = results.value;
          const distance = ((results.value / 20) * 0.01).toFixed(2);
          const calories = ((results.value / 20) * 1).toFixed(1);
  
          PedometerNotificationAPI(totalSteps, distance, calories);
        });
      }
    });
  } catch (error) {
    console.log('ERRRRRRR Applie on Local Notification', error);
    return null;
  }
};

const PedometerNotificationAPI = async (
  totalSteps: number,
  distance: string,
  calories: string,
) => {
  const user_id = await AsyncStorage.getItem('userID');
  try {
    const res = await axios({
      url: NewAppapi.PedometerAPI,
      method: 'post',
      data: {
        user_id: user_id,
        steps: totalSteps,
        calories: calories,
        distance: distance,
        version: VersionNumber.appVersion,
        // version: 1.1,
      },
    });
   
    if (res?.data?.msg == 'Please update the app to the latest version.') {
    } else {
      TotalCalPostAPI(user_id);
    }
  } catch (error) {
    console.log('PedometerAPi Error', error);
  }
};

const TotalCalPostAPI = async (user_id: string) => {
  try {
    const data = await axios(`${NewAppapi.total_Calories}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: user_id,
      },
    });
 
  } catch (error) {
    console.log('UCustomeCorkout details', error);
  }
};
const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
export const DeleteWeeklyDataAPIStart = () => {
  Promise.all(WeekArray.map((_, index) => DeleteWeeklyDataAPI(index)));
};

const DeleteWeeklyDataAPI = async (day: number) => {
  const user_id = await AsyncStorage.getItem('userID');
  try {
    const res = await axios.get(
      NewAppapi.DELETE_WEEKLY_DATA +
        '?user_id=' +
        user_id +
        '&workout_id=' +
        `-${day + 1}` +
        '&day=' +
        WeekArray[day] +
        '&version=' +
        VersionNumber.appVersion,
    );
  
  } catch (error) {
    console.log('DeleteWeeklyDataAPI Er ', error);
  }
};
