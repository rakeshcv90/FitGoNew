import {type} from 'os';
import types from '../../Component/ThemeRedux/Constants';
export const setTheme = theme => ({
  type: types.Dark_Theme,
  payload: theme,
});
export const updatePhoto = imgURL => ({
  type: types.Profile_Photo,
  payload: imgURL,
});
export const resetStore = () => ({
  type: types.Reset_Store,
});
export const Is_user_Login = login => ({
  type: types.Is_Login,
  payload: login,
});
export const setShowIntro = data => {
  return {
    type: types.SHOW_INTRO,
    payload: data,
  };
};
export const setCompleteProfileData = data => {
  return {
    type: types.COMPLETE_PROFILE_DATA,
    payload: data,
  };
};
export const setLaterButtonData = data => {
  return {
    type: types.LATER_BUTTON_USER_DATA,
    payload: data,
  };
};
export const setUserProfileData = data => {
  return {
    type: types.User_Profile_Data,
    payload: data,
  };
};
export const setUserId = data => {
  return {
    type: types.User_ID,
    payload: data,
  };
};
export const setCustomWorkoutData = data => {
  return {
    type: types.CUSTOM_WORKOUT_DATA,
    payload: data,
  };
};
export const setCurrentWorkoutData = data => {
  return {
    type: types.CURRENT_WORKOUT_DATA,
    payload: data,
  };
};
export const setAllWorkoutData = data => {
  return {
    type: types.ALL_WORKOUTS_DATA,
    payload: data,
  };
};
export const setMindset_Data = data => {
  return {
    type: types.Mindset_Data,
    payload: data,
  };
};
export const setLogout = () => {
  return {
    type: types.LogOut,
  };
};
export const SetmindsetConsent = data => {
  return {
    type: types.MindSetConsent,
    payload: data,
  };
};

export const setHealthData = data => {
  return {
    type: types.HealthData,
    payload: data,
  };
};
export const Setmealdata = data => {
  return {
    type: types.ALL_MEAL_DATA,

    payload: data,
  };
};
export const SetAIMessageHistory = data => {
  return {
    type: types.AiMessageHistory,

    payload: data,
  };
};
export const setCount = data => {
  return {
    type: types.COUNT,
    payload: data,
  };
};
export const setInappPurchase = data => {
  return {
    type: types.IN_APP_PURCHASE,
    payload: data,
  };
};
export const setPedomterData = data => {
  return {
    type: types.Update_Pedometer_Data,
    payload: data,
  };
};
export const setStoreData = data => {
  return {
    type: types.STORE_DATA,
    payload: data,
  };
};
export const setPurchaseHistory = data => {
  return {
    type: types.PURCHASE_HISTORY,
    payload: data,
  };
};
export const setScreenAwake = data => {
  return {
    type: types.SCREENAWAKE,
    payload: data,
  };
};
export const setSoundOnOff = data => {
  return {
    type: types.SOUND_ON_OFF,
    payload: data,
  };
};
export const setFcmToken = data => {
  return {
    type: types.FCM_TOKEN,
    payload: data,
  };
};
export const setBmi = data => {
  return {
    type: types.BMI,
    payload: data,
  };
};
export const setHomeGraphData = data => {
  return {
    type: types.HOME_GRAPH_DATA,
    payload: data,
  };
};
export const setWorkoutTimeCal = data => {
  return {
    type: types.Custome_Time_Cal,
    payload: data,
  };
};
export const setDownloadedImage = data => {
  return {
    type: types.POPUPIMAGE,
    payload: data,
  };
};
export const setStepCounterOnOff = data => {
  return {
    type: types.IS_STEP_COUNTER_ON,
    payload: data,
  };
};
export const setSubscriptiomModal = data => {
  return {
    type: types.SUBSCRIPTION_MODAL,
    payload: data,
  };
};
export const setFitmeAdsCount = data => {
  return {
    type: types.FITME_ADD_COUNT,
    payload: data,
  };
};
export const setFitmeMealAdsCount = data => {
  return {
    type: types.FITME_ADD_COUNT_MEALS,
    payload: data,
  };
};
export const setVideoLocation = data => {
  return {
    type: types.STORE_VIDEO_LOC,
    payload: data,
  };
};
export const setIsAlarmEnabled = data => {
  return {
    type: types.ALARM_ENABLED,
    payload: data,
  };
};

export const setWeeklyPlansData = data => {
  return {
    type: types.WEEKLY_PLANS_DATA,
    payload: data,
  };
};
export const setChallengesData = data => {
  return {
    type: types.CHALLENGES_DATA,
    payload: data,
  };
};
export const setAllExercise = data => {
  return {
    type: types.ALL_EXERCISE,

    payload: data,
  };
};
export const setCurrentSelectedDay = data => {
  return {
    type: types.CURRENT_SELECTED_DAY,

    payload: data,
  };
};
export const setExperience = data => {
  return {
    type: types.IS_EXPERIENCED,
    payload: data,
  };
};
export const setProgressBarCounter = data => {
  return {
    type: types.PROGRESS_BAR_COUNTER,
    payload: data,
  };
};
export const setTempLogin = data => {
  return {
    type: types.TEMP_LOGIN,
    payload: data,
  };
};
export const setUprBdyOpt = data => {
  return {
    type: types.UPRBDYFILTEROPT,
    payload: data,
  };
};
export const setLowerBodyFilOpt = data => {
  return {
    type: types.LWRBDYFILTEROPT,
    payload: data,
  };
};
export const setCoreFilOpt = data => {
  return {
    type: types.COREFILTOPRION,
    payload: data,
  };
};
export const setUprBodyCount = data => {
  return {
    type: types.UPRBODYCOUNT,
    payload: data,
  };
};
export const setLowerBodyCount = data => {
  return {
    type: types.LWERBODYCOUNT,
    payload: data,
  };
};
export const setCoreCount = data => {
  return {
    type: types.CORECOUNT,
    payload: data,
  };
};

//Rewards
export const setEnteredCurrentEvent = data => {
  return {
    type: types.ENTERED_CURRENT_EVENT,
    payload: data,
  };
};
export const setEnteredUpcomingEvent = data => {
  return {
    type: types.ENTERED_UPCOMING_EVENT,
    payload: data,
  };
};
export const setExerciseCount = data => {
  return {
    type: types.EXERCISECOUNT,
    payload: data,
  };
};
export const setOfferAgreement = data => {
  return {
    type: types.OFFERAGREEMENT,
    payload: data,
  };
};
export const setRewardModal = data => {
  return {
    type: types.REWARD_MODAL,
    payload: data,
  };
};
export const setPlanType = data => {
  return {
    type: types.SUBSCRIPTION_PLAN,
    payload: data,
  };
};
export const setBanners = data => {
  return {
    type: types.BANNERS,
    payload: data,
  };
};
export const setEditedExercise = data => {
  return {
    type: types.EDITED_DAY_EXERCISE,
    payload: data,
  };
};
export const setAgreementContent = data => {
  return {
    type: types.AGREEMENT_CONTENT,
    payload: data,
  };
};
export const setWinnerAnnounced = data => {
  return {
    type: types.WINNER_ANNOUNCED,
    payload: data,
  };
};
export const setFitCoins = data => {
  return {
    type: types.FIT_COINS,
    payload: data,
  };
};
export const setHindiLanuage = data => {
  return {
    type: types.HINDI_LANGUAGE,
    payload: data,
  };
};
export const setRewardPopUp = data => {
  return {
    type: types.TRACK_REWARDPOPUP,
    payload: data,
  };
};
export const setPopUpSeen = data => {
  return {
    type: types.POPUPSEEN,
    payload: data,
  };
};
export const setDynamicPopupValues=data=>{
  return{
    type:types.DYNAMIC_EVENTPOPUP,
    payload:data
  }
}
export const setRatingTrack=data=>{
    return{
      type:types.KEEP_RATING_TRACK,
      payload:data
    }
}
export const setUpdateAvailable=data=>{
  return{
    type:types.UPDATE_AVAILABLE,
    payload:data
  }
}
export const setOpenAdsCount=data=>{
  return{
    type:types.OPEN_ADS_COUNT,
    payload:data
  }
}
export const setStreakStatus=data=>{
  return{
    type:types.STREAK_MODAL,
    payload:data
  }
}
export const setStreakModalVisible=data=>{
  return{
    type:types.STREAK_MODAL_VISIBLE,
    payload:data
  }
}