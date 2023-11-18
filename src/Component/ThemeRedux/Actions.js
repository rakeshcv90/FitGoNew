import types from "../../Component/ThemeRedux/Constants";
export const setTheme = (theme) => ({
  type: types.Dark_Theme,
  payload: theme,
});
export const updatePhoto=(imgURL)=>({
  type:types.Profile_Photo,
  payload:imgURL
});
export const resetStore=()=>({
  type:types.Reset_Store
})

