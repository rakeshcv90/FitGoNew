import { Dimensions } from "react-native";
 export const DeviceHeigth=Dimensions.get('window').height
 export const DeviceWidth=Dimensions.get('window').width
 export const Api ='https://cvinfotech2@gofit.tentoptoday.com/json/'

 export const Appapi={
  login:'user_login.php',
  signup:'user_registration.php',
  forgetPassword:'user_passwordreset.php',
  workhouts:'data_workouts.php',
  goals:'data_goals.php',
  levels:'data_levels.php',
  BodyParts:'data_bodyparts.php',
  Exercise:'data_exercises.php',
  Equipments:'data_equipments.php',
  Diets:'data_diets.php',
  Diet_category:'data_categories.php',
  Products:'data_products.php',
  Categories:'data_types.php',
  FeaturedPost:'data_posts.php',
  Tags:'data_tags.php',
  Days:'data_days.php'
}