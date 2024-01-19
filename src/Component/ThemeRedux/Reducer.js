
import types from '../../Component/ThemeRedux/Constants';
const intialState = {
  defaultTheme: false,
  ProfilePhoto: 'https://gofit.tentoptoday.com/json/image/Avatar.png',
  isLogin: false,
  showIntro: false,
  completeProfileData: [],
  getLaterButtonData: [],
  getUserID:0,
  customWorkoutData: [],
  getUserDataDetails: [],
  mindsetConsent: false,
  mindSetData: [],
  getHealthData: [],
  currentWorkoutData: [],
  allWorkoutData: [],
  getUserDataDetails: [],
  mindsetConsent: false,
  showLogout: 0,
  mealData: [],
  getCount: -1,
  getPedomterData: [],
  getAIMessageHistory: [],
  getFcmToken: '',
  getInAppPurchase: [],
  getStoreData: [],
  getPurchaseHistory: [],
  getScreenAwake: false,
  getSoundOffOn:false,
  getBmi:'',
  getHomeGraphData: [],
  getProfile_imgData:[]
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
    case types.User_Profile_Data:
      return {...state, getUserDataDetails: action.payload};
    case types.HealthData:
      return {...state, getHealthData: action.payload};
    case types.MindSetConsent:
      return {...state, mindsetConsent: action.payload};
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
    case types.ALL_MEAL_DATA:
      return {...state, mealData: action.payload};
    case types.LogOut:
    return {...intialState};
    case types.COUNT:
      return {...state, getCount: action.payload};
    case types.IN_APP_PURCHASE:
      return {...state, getInAppPurchase: action.payload};
    case types.AiMessageHistory:
      return {...state, getAIMessageHistory: action.payload};
    case types.STORE_DATA:
      return {...state, getStoreData: action.payload};
    case types.PURCHASE_HISTORY:
      return {...state, getPurchaseHistory: action.payload};
    case types.Mindset_Data:
      const updatedData = action.payload;
      const updatedMindSetData = [...state.mindSetData];
      updatedData.forEach(updatedItem => {
        const keyToUpdate = Object.keys(updatedItem)[0];
        const index = updatedMindSetData.findIndex(
          item => Object.keys(item)[0] === keyToUpdate,
        );
        if (index !== -1) {
          updatedMindSetData[index] = {
            ...updatedMindSetData[index],
            ...updatedItem,
          };
        } else {
          updatedMindSetData.push(updatedItem);
        }
      });
      return {
        ...state,
        mindSetData: updatedMindSetData,
      };
    case types.MindSetConsent:
      return {...state, mindsetConsent: action.payload};
    case types.Update_Pedometer_Data:
      const updatePedometerData = action.payload;
      const UpdateData = state.getPedomterData.map(item => ({...item}));
      updatePedometerData.forEach(updatedItem => {
        const keyToUpdate = Object.keys(updatedItem)[0];
        const index = UpdateData.findIndex(
          item => Object.keys(item)[0] === keyToUpdate,
        );
        if (index !== -1) {
          const updatedValue = updatedItem[keyToUpdate];
          if (Array.isArray(updatedValue)) {
            UpdateData[index][keyToUpdate] = updatedValue[0];
          } else {
            UpdateData[index] = {
              ...UpdateData[index],
              ...updatedItem,
            };
          }
        } else {
          UpdateData.push(updatedItem);
        }
      });
      return {
        ...state,
        getPedomterData: UpdateData,
      };
    case types.FCM_TOKEN:
      return {...state, getFcmToken: action.payload};
    case types.SCREENAWAKE:
      return {...state, getScreenAwake: action.payload};
    case types.SOUND_ON_OFF:
      return {...state, getSoundOffOn: action.payload};
    case types.HOME_GRAPH_DATA:
      return {...state, getHomeGraphData: action.payload};
    case types.Profile_imgData:
      return {
        ...state,getProfile_imgData:action.payload
      }  
    default:
      return state;
  }
};
export default ThemeReducer;
