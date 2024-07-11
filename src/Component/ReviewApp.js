import {Platform, Linking} from 'react-native';
import InAppReview from 'react-native-in-app-review';

const IOS_APP_ID = '6470018217';
const ANDROID_APP_ID = 'fitme.health.fitness.homeworkouts.equipment';
export const APP_STORE_LINK = `itms-apps://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`;
export const PLAY_STORE_LINK = `http://play.google.com/store/apps/details?id=${ANDROID_APP_ID}`;

export const ReviewApp = (onPresh) => {
  // Linking.openURL(STORE_LINK)


  InAppReview.isAvailable();
  InAppReview.RequestInAppReview()
    .then(hasFlowFinishedSuccessfully => {
      
      if (hasFlowFinishedSuccessfully) {
        onPresh()
      }
    })
    .catch(error => {
      console.log(error);
    });
};
