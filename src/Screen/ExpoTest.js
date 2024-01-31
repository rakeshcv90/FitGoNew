import {color} from 'd3';
import {useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import GoogleFit, {Scopes, BucketUnit} from 'react-native-google-fit';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
const GoogleFitData = () => {
  const [result, setResult] = useState('Hello');
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
      Scopes.FITNESS_NUTRITION_WRITE,
      Scopes.FITNESS_SLEEP_READ,
    ],
  };
  GoogleFit.checkIsAuthorized().then(() => {
    var authorized = GoogleFit.isAuthorized;
    console.log(authorized);
    const opt = {
      startDate: '2024-01-28T00:00:17.971Z', // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
  
    if (authorized) {
      // if already authorized, fetch data
      GoogleFit.getDailySteps()
      .then(res => {
        console.log('Daily steps1 >>> ', res[2].rawSteps);
      })
      .catch(err => {
        console.warn("Data errror",err);
      });
     const reqData=async()=>{
      const permissionRequestResult = await request(
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      );
      if (
        permissionRequestResult === RESULTS.GRANTED
      ){
        GoogleFit.startRecording((callback) => {
          // Process data from Google Fit Recording API (no google fit app needed)
          console.log('data',callback)
        });
      }
     }
    return reqData()
    } else {
      // Authentication if already not authorized for a particular device
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log('AUTH_SUCCESS');
            GoogleFit.getDailySteps()
            .then(res => {
              console.log('Daily steps >>> ', res);
            })
            .catch(err => {
              console.warn(err);
            });
            // if successfully authorized, fetch data
          } else {
            console.log('AUTH_DENIED ' + authResult.message);
          }
        })
        .catch((error) => {
          console.error('AUTH_ERROR',error);
        });
    }
  });
  return (
    <SafeAreaView>
      <Text style={{color: 'black'}}> {result}</Text>
    </SafeAreaView>
  );
};

export default GoogleFitData;
