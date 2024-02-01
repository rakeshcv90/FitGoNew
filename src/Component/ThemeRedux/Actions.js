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
export const setFcmToken=data=>{
  return{
    type:types.FCM_TOKEN,
    payload:data
  }
}
export const setBmi=data=>{
  return{
    type:types.BMI,
    payload:data
  }
}
export const setHomeGraphData=data=>{
  return{
    type:types.HOME_GRAPH_DATA,
    payload:data
  }
}
export const setWorkoutTimeCal=data=>{
  return{
    type:types.Custome_Time_Cal,
    payload:data
  }
}
export const setProfileImg_Data=data=>{
  return{
    type:types.Profile_imgData,
    payload:data
  }
}
export const setStepCounterOnOff=data=>{
  return{
    type:types.IS_STEP_COUNTER_ON,
    payload:data
  }
  

}
