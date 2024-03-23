import {Dimensions} from 'react-native';
export const DeviceHeigth = Dimensions.get('screen').height;
export const DeviceWidth = Dimensions.get('screen').width;
export const Api = 'https://cvinfotech2@gofit.tentoptoday.com/json/';
//export const NewApi = 'https://gofit.tentoptoday.com/adserver/public/api/';
// export const NewApi = 'https://fitme.esapplications.in/adserver/public/api/';
export const NewApi = 'https://fitme.cvinfotech.in/adserver/public/api/';

export const Appapi = {
  login: 'user_login.php',
  signup: 'user_registration.php',
  forgetPassword: 'user_passwordreset.php',
  workhouts: 'data_workouts.php',
  goals: 'data_goals.php',
  levels: 'data_levels.php',
  BodyParts: 'data_bodyparts.php',
  Exercise: 'data_exercises.php',
  Equipments: 'data_equipments.php',
  Diets: 'data_diets.php',
  Diet_category: 'data_categories.php',
  Products: 'data_products.php',
  Categories: 'data_types.php',
  FeaturedPost: 'data_posts.php',
  Tags: 'data_tags.php',
  Days: 'data_days.php',
  Favorites: 'favorite.php',
  Strings: 'data_strings.php',
  FavoriteWorkout: 'favoriteworkout.php',
  RemoveFavorite: 'remove_favorite.php',
  FavoriteDiets: 'favoritediet.php',
  DeleteAccount: 'user_delete.php',
  OTPVerification: 'user_email_verification.php',
  ResendOTP: 'resend_otp.php',
  UpdateProfile: 'user_img.php',
  getUserData: 'get_user_img.php',
};
export const NewAppapi = {
  login: 'user_login', //Done App Version
  signup: 'user_registration',//Done App Version
  forgetPassword: 'sendemail_link',//Done App Version
  OTPVerification: 'user_verify',//Done App Version
  UserProfile: 'userprofile',//Done App Version
  Get_COMPLETE_PROFILE: NewApi + 'goals_levels_focusarea_data',//Done App Version
  Post_COMPLETE_PROFILE: NewApi + 'user_update_details',//Done App Version
  Custom_WORKOUT_DATA: NewApi + 'usercustomworkout',//Done App Version
  Free_WORKOUT_DATA: NewApi + 'userfreecustomworkout',//Done App Version
  Free_Excercise_Data: NewApi + 'userfreecustomexercise',//Done App Version
  ALL_WORKOUTS: NewApi + 'allworkout',//Done App Version
  POPULAR_WORKOUTS: NewApi + 'popularWorkout',//Done App Version
  Meal_Categorie: NewApi + 'get_categorie',//Done App Version
  DietDetails: NewApi + 'getdiet',//Done App Version
  Get_DAYS: NewApi + 'days',
  POST_EXERCISE: NewApi + 'user_status',//Done App Version
  CURRENT_DAY_EXERCISE: NewApi + 'user_exercise_status',
  TRACK_CURRENT_DAY_EXERCISE: NewApi + 'user_details',//Done App Version
  TRACK_WORKOUTS: NewApi + 'workout_status',//Done App Version
  GET_LIKE_WORKOUTS: NewApi + 'getfavoritewokrout',
  POST_LIKE_WORKOUT: NewApi + 'addfavorite',
  CURRENT_DAY_EXERCISE_DETAILS: NewApi + 'user_exercise_details',
  Get_Product_Catogery: NewApi + 'categorydata',
  Get_Product_List: NewApi + 'productdata',
  Get_Mindset_Excise: NewApi + 'mindsetdata',//Done App Version
  PedometerAPI: NewApi + 'steps_details',//Done App Version
  Transctions: NewApi + 'transactions',
  TransctionsDetails: NewApi + 'transactionsdetails',
  total_Calories:NewApi+'exercisecalo',
  UpdateUserProfile: NewApi + 'update_details',//Done App Version
  HOME_GRAPH_DATA: NewApi + 'history',//Done App Version
  Upload_Profile_picture:NewApi+'update_profile_image',
  monthly_history:NewApi+'monthly_history',
  DateWiseData:NewApi+'selectDate_exercise',//Done App Version
  Delete_Account:NewApi+'deleteAccount',
  Custome_Workout_Cal_Time:NewApi+'exercise_total_calo',
  loginApple:NewApi+'user_login_test',

};
