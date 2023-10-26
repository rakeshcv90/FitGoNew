import types from '../../Component/ThemeRedux/Constants';
const intialState = {
  defaultTheme: false,
};
const ThemeReducer = (state = intialState, action) => {
  switch (action.type) {
    case types.Dark_Theme:
      return {...state, defaultTheme: action.payload};
    default:
      return state;
  }
};
export default ThemeReducer;
