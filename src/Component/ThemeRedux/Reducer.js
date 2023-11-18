import types from '../../Component/ThemeRedux/Constants';
const intialState = {
  defaultTheme: false,
  ProfilePhoto:"https://gofit.tentoptoday.com/json/image/Avatar.png"
};
const ThemeReducer = (state = intialState, action) => {
  switch (action.type) {
    case types.Dark_Theme:
      return {...state, defaultTheme: action.payload};
    case types.Profile_Photo:
      return {...state,ProfilePhoto:action.payload}
    case types.Reset_Store:
      return intialState
    default:
      return state;
  }
};
export default ThemeReducer;
