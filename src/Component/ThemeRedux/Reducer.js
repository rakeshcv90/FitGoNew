import types from '../../Component/ThemeRedux/Constants';
const intialState = {
  defaultTheme: false,
  ProfilePhoto: 'https://gofit.tentoptoday.com/json/image/Avatar.png',
  isLogin: false,
  showIntro: false,
  completeProfileData: [],
  getLaterButtonData: [],
  getUserID: 0,
  customWorkoutData: [],
  getUserDataDetails: [],
  mindsetConsent: false,
  mindSetData: [],
  getHealthData: [],
  currentWorkoutData: [],
  allWorkoutData: [],
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
  getSoundOffOn: true,
  getBmi: {},
  getHomeGraphData: [],
  getDownloadedImage: {},
  getCustttomeTimeCal: [],
  getStepCounterOnoff: false,
  getSubscriptionModal: false,
  getFitmeAdsCount: 0,
  getFitmeMealAdsCount: 0,
  getStoreVideoLoc: {},
  isAlarmEnabled: false,
  getAllExercise: [],
  getExperience: false,
  getChallengesData: [],
  getWeeklyPlansData: {},
  currentSelectedDay: 0,
  getProgressBarCounter: 6,
  getTempLogin: false,
  getUperBodyFilOption: [],
  getLowerBodyFilOpt: [],
  getCoreFiltOpt: [],
  getUprBodyCount: 0,
  getLowerBodyCount: 0,
  getCoreCount: 0,
  getExerciseCount: {},
  //Rewards
  getOfferAgreement: {},
  enteredCurrentEvent: false,
  enteredUpcomingEvent: false,
  getRewardModalStatus: false,
  planType: -1,
  getAgreementContent: {},
  fitCoins: 0,
  winnerAnnounced: false,
  getBanners: {},
  getEditedDayExercise: {},
  getPopUpFreuqency: 0,
  getPopUpSeen: false,
  hindiLanguage: false,
  getDynamicPopUpvalues: {},
  getDietFilterData: -1,
  getCustomDietData:[]
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
    // case types.User_Profile_Data:
    //   return {...state, getUserDataDetails: action.payload};
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

    case types.Custome_Time_Cal:
      return {...state, getCustttomeTimeCal: action.payload};
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
    case types.POPUPIMAGE:
      return {
        ...state,
        getDownloadedImage: action.payload,
      };
    case types.IS_STEP_COUNTER_ON:
      return {
        ...state,
        getStepCounterOnoff: action.payload,
      };
    case types.SUBSCRIPTION_MODAL:
      return {
        ...state,
        getSubscriptionModal: action.payload,
      };
    case types.FITME_ADD_COUNT:
      return {
        ...state,
        getFitmeAdsCount: action.payload,
      };
    case types.FITME_ADD_COUNT_MEALS:
      return {
        ...state,
        getFitmeMealAdsCount: action.payload,
      };
    case types.STORE_VIDEO_LOC:
      return {
        ...state,
        getStoreVideoLoc: action.payload,
      };
    case types.ALARM_ENABLED:
      return {
        ...state,
        isAlarmEnabled: action.payload,
      };

    case types.WEEKLY_PLANS_DATA:
      return {
        ...state,
        getWeeklyPlansData: action.payload,
      };
    case types.CHALLENGES_DATA:
      return {
        ...state,
        getChallengesData: action.payload,
      };

    case types.ALARM_ENABLED:
      return {
        ...state,
        isAlarmEnabled: action.payload,
      };
    case types.ALL_EXERCISE:
      return {
        ...state,
        getAllExercise: action.payload,
      };
    case types.CURRENT_SELECTED_DAY:
      return {
        ...state,
        currentSelectedDay: action.payload,
      };
    case types.IS_EXPERIENCED:
      return {
        ...state,
        getExperience: action.payload,
      };
    case types.PROGRESS_BAR_COUNTER:
      return {
        ...state,
        getProgressBarCounter: action.payload,
      };
    case types.BMI:
      return {...state, getBmi: action.payload};
    case types.TEMP_LOGIN:
      return {
        ...state,
        getTempLogin: action.payload,
      };
    case types.UPRBDYFILTEROPT:
      return {
        ...state,
        getUperBodyFilOption: action.payload,
      };
    case types.LWRBDYFILTEROPT:
      return {
        ...state,
        getLowerBodyFilOpt: action.payload,
      };
    case types.COREFILTOPRION:
      return {
        ...state,
        getCoreFiltOpt: action.payload,
      };
    case types.UPRBODYCOUNT:
      return {
        ...state,
        getUprBodyCount: action.payload,
      };
    case types.LWERBODYCOUNT:
      return {
        ...state,
        getLowerBodyCount: action.payload,
      };
    case types.CORECOUNT:
      return {
        ...state,
        getCoreCount: action.payload,
      };

    // Rewards
    case types.ENTERED_CURRENT_EVENT:
      return {
        ...state,
        enteredCurrentEvent: action.payload,
      };
    case types.ENTERED_UPCOMING_EVENT:
      return {
        ...state,
        enteredUpcomingEvent: action.payload,
      };
    case types.OFFERAGREEMENT:
      return {
        ...state,
        getOfferAgreement: action.payload,
      };
    case types.REWARD_MODAL:
      return {...state, getRewardModalStatus: action.payload};
    case types.SUBSCRIPTION_PLAN:
      return {...state, planType: action.payload};
    case types.BANNERS:
      return {
        ...state,
        getBanners: action.payload,
      };
    case types.EDITED_DAY_EXERCISE:
      return {
        ...state,
        getEditedDayExercise: action.payload,
      };
    case types.AGREEMENT_CONTENT:
      return {
        ...state,
        getAgreementContent: action.payload,
      };
    case types.EXERCISECOUNT:
      return {
        ...state,
        getExerciseCount: action.payload,
      };
    case types.FIT_COINS:
      return {
        ...state,
        fitCoins: action.payload,
      };
    case types.WINNER_ANNOUNCED:
      return {
        ...state,
        winnerAnnounced: action.payload,
      };
    case types.TRACK_REWARDPOPUP:
      return {
        ...state,
        getPopUpFreuqency: action.payload,
      };
    case types.POPUPSEEN:
      return {
        ...state,
        getPopUpSeen: action.payload,
      };
    case types.HINDI_LANGUAGE:
      return {
        ...state,
        hindiLanguage: action.payload,
      };
    case types.DYNAMIC_EVENTPOPUP:
      return {
        ...state,
        getDynamicPopUpvalues: action.payload,
      };
    case types.DIET_TYPE_FILTER:
      return {
        ...state,
        getDietFilterData: action.payload,
      };
      case types.CUSTOM_DIET_DATA:
        return {
          ...state,
          getCustomDietData: action.payload,
        };
    default:
      return state;
  }
};
export default ThemeReducer;
