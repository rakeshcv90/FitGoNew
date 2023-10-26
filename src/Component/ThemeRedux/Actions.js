import types from "../../Component/ThemeRedux/Constants";
export const setTheme = (theme) => ({
  type: types.Dark_Theme,
  payload: theme,
});
