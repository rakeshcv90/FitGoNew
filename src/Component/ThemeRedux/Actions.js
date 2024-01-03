import { type } from 'os';
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
export const setLogout = data => {
  return {
    type: types.LogOut,
    payload: data,
  };
};
export const SetmindsetConsent=data=>{
  return{
    type:types.MindSetConsent,
    payload:data
  }
}

export const setHealthData=(data)=>{
  return{
    type:types.HealthData,

export const Setmealdata=data=>{
  return{
    type:types.ALL_MEAL_DATA,

    payload:data
  }
}