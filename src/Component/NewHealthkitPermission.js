import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

const NewHealthkitPermission = async() => {
    const permissions = {
      read: [
        AppleHealthKit.Constants.Permissions.Steps,
        AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      ],
    };
    AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }else{
            console.log('access granted')
        }
    })
  };
export default NewHealthkitPermission;
