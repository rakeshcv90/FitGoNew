import { Alert } from 'react-native';
import AppleHealthKit from 'react-native-health';
export const HealthData = AppleHealthKit.isAvailable((err, available) => {
  console.log("Avialalebe=========>",available)
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.Steps,
      ],
    },
  };
  if (err) {
    console.log('error initializing Healthkit: ', err)
  }
  else if(available==true){
    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!', error);
      } 
    });
  }else{
    Alert.alert("Attention","Health data can't be tracked in this Device due to its specifications",{
    })
  }
})

