import {Dimensions} from 'react-native';
export const DeviceHeigth = Dimensions.get('screen').height;
export const DeviceWidth = Dimensions.get('screen').width;
export const Api = 'https://cvinfotech2@gofit.tentoptoday.com/json/';
export const NewApi = 'https://gofit.tentoptoday.com/adserver/public/api/';
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
  login: 'user_login',
  signup: 'user_registration',
  forgetPassword: 'sendemail_link',
  OTPVerification: 'user_verify',
  UserProfile: 'userprofile',
  Get_COMPLETE_PROFILE: NewApi + 'goals_levels_focusarea_data',
  Post_COMPLETE_PROFILE: NewApi + 'user_update_details',
  Custom_WORKOUT_DATA: NewApi + 'usercustomworkout',
  Free_WORKOUT_DATA: NewApi + 'userfreecustomworkout',
  Free_Excercise_Data: NewApi + 'userfreecustomexercise',
  Whole_data: NewApi + 'user_update_details',
  ALL_WORKOUTS: NewApi + 'allworkout',
  Meal_Categorie: NewApi + 'get_categorie',
 DietDetails:NewApi + 'getdiet',
  Get_DAYS: NewApi + 'days',
  CURRENT_DAY_EXERCISE: NewApi + 'user_exercise_status',
  CURRENT_DAY_EXERCISE_DETAILS: NewApi + 'user_exercise_details',
};

 

