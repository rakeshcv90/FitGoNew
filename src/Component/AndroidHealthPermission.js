import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
    isStepCountingSupported,
  } from '@dongminyu/react-native-step-counter';
 const AskHealthPermissionAndroid=async()=> {
    const result= await isStepCountingSupported() 
       console.debug('🚀 - isStepCountingSupported', result);
         if (Platform.OS === 'android') {
           const permissionStatus = await check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
           
           if (permissionStatus === RESULTS.DENIED) {
             const permissionRequestResult = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
             
             if (permissionRequestResult === RESULTS.GRANTED) {
               console.log('ACTIVITY_RECOGNITION permission granted');
               // Perform actions that require this permission here
             } else {
               console.log('ACTIVITY_RECOGNITION permission denied');
               // Handle the case where the permission request is denied
             }
           } else {
             console.log('ACTIVITY_RECOGNITION permission already granted');
             // Permission was already granted previously
           }
     };
   }
   export default AskHealthPermissionAndroid;