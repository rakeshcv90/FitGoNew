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
export const setUserId = data => {
  return {
    type: types.User_ID,
    payload: data,
  };
};
