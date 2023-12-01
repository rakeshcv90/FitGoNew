import types from '../../Component/ThemeRedux/Constants';
const intialState = {
  defaultTheme: false,
  ProfilePhoto: 'https://gofit.tentoptoday.com/json/image/Avatar.png',
  isLogin: false,
  showIntro: false,
};
const ThemeReducer = (state = intialState, action) => {
  switch (action.type) {
    case types.Dark_Theme:
      return {...state, defaultTheme: action.payload};
    case types.Profile_Photo:
      return {...state, ProfilePhoto: action.payload};
    case types.Reset_Store:
      return intialState;
    case types.Is_Login:
      return {...state, isLogin: action.payload};
    case types.SHOW_INTRO:
      return {...state, showIntro: action.payload};
    default:
      return state;
  }
};
export default ThemeReducer;
