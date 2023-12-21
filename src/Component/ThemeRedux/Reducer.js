import types from '../../Component/ThemeRedux/Constants';
const intialState = {
  defaultTheme: false,
  ProfilePhoto: 'https://gofit.tentoptoday.com/json/image/Avatar.png',
  isLogin: false,
  showIntro: false,
  completeProfileData: [],
  getLaterButtonData: [],
  getUserID: '',
  customWorkoutData: [],
  currentWorkoutData: [],
  allWorkoutData: [],
  getUserDataDetails:[],
  mindsetConsent:false,
  mindSetData:[]
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
    case types.COMPLETE_PROFILE_DATA:
      return {...state, completeProfileData: action.payload};
    case types.LATER_BUTTON_USER_DATA:
      return {...state, getLaterButtonData: action.payload};
      case types.User_ID:
        return {...state, getUserID: action.payload};
        case types.CUSTOM_WORKOUT_DATA:
          return {...state, customWorkoutData: action.payload};
        case types.CURRENT_WORKOUT_DATA:
          return {...state, currentWorkoutData: action.payload};
        case types.ALL_WORKOUTS_DATA:
          return {...state, allWorkoutData: action.payload};
      case types.User_Profile_Data:
        return {...state, getUserDataDetails: action.payload};
      case types.Mindset_Data:
        const updatedData = action.payload;
        // Create a new copy of the state's mindSetData array
        const updatedMindSetData = [...state.mindSetData];
  
        // Loop through the updatedData array
        updatedData.forEach((updatedItem) => {
          const keyToUpdate = Object.keys(updatedItem)[0];
          const index = updatedMindSetData.findIndex((item) => Object.keys(item)[0] === keyToUpdate);
  
          if (index !== -1) {
            // If key already exists, update its value by creating a new object
            updatedMindSetData[index] = { ...updatedMindSetData[index], ...updatedItem };
          } else {
            // If key doesn't exist, append it to the new array
            updatedMindSetData.push(updatedItem);
          }
        });
  
        return {
          ...state,
          mindSetData: updatedMindSetData,
        };
        case types.MindSetConsent:
          return{...state,mindsetConsent:action.payload}   
    default:
      return state;
  }
};
export default ThemeReducer;
