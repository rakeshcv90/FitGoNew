import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CardStyleInterpolators} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SplaceScreen from '../Screen/SplaceScreen';
import Login from '../Screen/Login';
import Signup from '../Screen/Signup';
import ForgetPassword from '../Screen/ForgetPassword';
import TermaAndCondition from '../Screen/TermaAndCondition';
import DrawerNavigation from './DrawerNavigation';
// import Workouts from '../Screen/Workouts/Workouts';
//import Workouts from '../Screen/Workouts/Workouts';
import Search from '../Screen/Search';
import Settings from '../Screen/Settings';
import Goals from '../Screen/Workouts/Goals';
import Levels from '../Screen/Workouts/Levels';
import WorkoutDescription from '../Screen/Workouts/WorkoutDescription';
import SingleGoal from '../Screen/Workouts/SingleGoal';
import SingleLevel from '../Screen/Workouts/SingleLevel';
import Exercises from '../Screen/Exercises/Exercises';
import ExerciseByBodyPart from '../Screen/Exercises/ExerciseByBodyPart';
import Equipments from '../Screen/Exercises/Equipments';
//import Diets from '../Screen/Diets/Diets';
import DietCategory from '../Screen/Diets/DietCategory';
import DietDetail from '../Screen/Diets/DietDetail';
import SingleCategory from '../Screen/Diets/SingleCategory';
// import Store from '../Screen/Stores/Store';
import StoreDetail from '../Screen/Stores/StoreDetail';
import StoreCategories from '../Screen/Stores/StoreCategories';
import Blog from '../Screen/Blog/Blog';
import BlogDetail from '../Screen/Blog/BlogDetail';
import BlogTags from '../Screen/Blog/BlogTags';
import ProfileScreen from '../Screen/ProfileScreen';
import SingleDay from '../Screen/SingleDay';
import ExerciseDetails from '../Screen/ExerciseDetails';
import LatestPost from '../Screen/Blog/LatestPost';
import AboutUs from '../Screen/AboutUs';
import PlayerModal from '../Component/Player';
import Completed from '../Screen/Completed';
import MyDiets from '../Screen/MyDiets';
import MyWorkouts from '../Screen/MyWorkouts';
import FavoritesRouter from './FavoritesRouter';
import ExerciseByEquipments from '../Screen/Exercises/ExerciseByEquipments';
import LatestProducts from '../Screen/Stores/LatestProducts';
import IntroductionScreen from '../Screen/IntroductionScreen';
import Yourself from '../Screen/Yourself/Index';
import Scale from '../Screen/Yourself/Scale';
import Gender from '../Screen/Yourself/Gender';
import Equipment from '../Screen/Yourself/Equipment';
import Focus from '../Screen/Yourself/Focus';
import Level from '../Screen/Yourself/Level';
import Height from '../Screen/Yourself/Height';
import Weight from '../Screen/Yourself/Weight';
import OtpVerification from '../Screen/OtpVerification';
import WorkoutCategories from '../Screen/New Workouts/WorkoutCategories';

// import Workouts from '../Screen/New Workouts/WorkoutsDetails';
import WorkoutsDetails from '../Screen/New Workouts/WorkoutsDetails';
import Home from '../Screen/NewHome/Home';
import ApplicantBottomTabBar from './ApplicantBottomTabBar';
import Workouts from '../Screen/NewHome/Workouts';
import Diets from '../Screen/NewHome/Diets';
import Store from '../Screen/NewHome/Store';
import Profile from '../Screen/NewHome/Profile';
import NewEditProfile from '../Component/NewEditProfile';
import NewPersonalDetails from '../Screen/NewPersonalDetails';
import NewStepCounter from '../Screen/NewStepCounter';
import AppNotification from '../Screen/AppNotification';
import LogSignUp from '../Screen/LogSignUp';
import FocuseAreaFmale from '../Component/FocuseAreaFmale';
import FocusArea from '../Screen/FocusArea';
import Injury from '../Screen/Yourself/Injury';
import WorkoutArea from '../Screen/Yourself/WorkoutArea';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const screenOptions = {
  headerShown: false, // Hide the header for all screens
  gestureDirection: 'horizontal',
  gesturesEnabled: true,
  // cardStyleInterpolator: CardStyleInterpolators.,
};
// const Router = () => {
//   return (
//     <Stack.Navigator screenOptions={screenOptions}>
//       <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
//       {/* <Stack.Screen name="Workouts" component={Workouts} /> */}
//       <Stack.Screen name="Search" component={Search} />
//       <Stack.Screen name="Settings" component={Settings} />
//       <Stack.Screen name="Goals" component={Goals} />
//       <Stack.Screen name="Levels" component={Levels} />
//       <Stack.Screen name="WorkoutDescription" component={WorkoutDescription} />
//       <Stack.Screen name="SingleGoal" component={SingleGoal} />
//       <Stack.Screen name="SingleLevel" component={SingleLevel} />
//       <Stack.Screen name="Exercises" component={Exercises} />
//       <Stack.Screen name="ExerciseByBodyPart" component={ExerciseByBodyPart} />
//       <Stack.Screen name="Equipments" component={Equipments} />
//       <Stack.Screen name="Diets" component={Diets} />
//       <Stack.Screen name="DietCategory" component={DietCategory} />
//       <Stack.Screen name="DietDetail" component={DietDetail} />
//       <Stack.Screen name="SingleCategory" component={SingleCategory} />
//       <Stack.Screen name="Store" component={Store} />
//       <Stack.Screen name="StoreDetail" component={StoreDetail} />
//       <Stack.Screen name="StoreCategories" component={StoreCategories} />
//       <Stack.Screen name="Blog" component={Blog} />
//       <Stack.Screen name="BlogDetail" component={BlogDetail} />
//       <Stack.Screen name="BlogTags" component={BlogTags} />
//       <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//       <Stack.Screen name="Singleday" component={SingleDay} />
//       <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} />
//       <Stack.Screen name="Player" component={PlayerModal} />
//       <Stack.Screen name="LatestPost" component={LatestPost} />
//       <Stack.Screen name="AboutUs" component={AboutUs} />
//       <Stack.Screen name="completed" component={Completed} />
//       <Stack.Screen name="Privacy" component={TermaAndCondition} />
//       <Stack.Screen name="MyDiets" component={MyDiets} />
//       <Stack.Screen name="MyWorkouts" component={MyWorkouts} />
//       <Stack.Screen name="FavoritesRouter" component={FavoritesRouter} />
//       <Stack.Screen
//         name="ExerciseByEquipments"
//         component={ExerciseByEquipments}
//       />
//       <Stack.Screen name="LatestProducts" component={LatestProducts} />
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="Yourself" component={Yourself} />
//     </Stack.Navigator>
//   );
// };

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTabs"
      tabBar={props => <ApplicantBottomTabBar {...props} />}
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Workouts" component={Workouts} />
      <Tab.Screen name="Diets" component={Diets} />
      <Tab.Screen name="Store" component={Store} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export const LoginStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
    
      <Stack.Screen name="SplaceScreen" component={SplaceScreen} />
      <Stack.Screen name="IntroductionScreen" component={IntroductionScreen} />

      <Stack.Screen name="LogSignUp" component={LogSignUp} />
      <Stack.Screen name="Yourself" component={Yourself} />
      <Stack.Screen name="Injury" component={Injury} />
      <Stack.Screen name="FocusArea" component={FocusArea} />
      <Stack.Screen name="WorkoutArea" component={WorkoutArea} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="TermaAndCondition" component={TermaAndCondition} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />

      <Stack.Screen name="Edit_Profile" component={NewEditProfile} />
      <Stack.Screen name="Personal Details" component={NewPersonalDetails} />
      <Stack.Screen name="WorkoutCategories" component={WorkoutCategories} />
      <Stack.Screen name="WorkoutsDetails" component={WorkoutsDetails} />
      <Stack.Screen name="StepCounter" component={NewStepCounter} />

      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Scale" component={Scale} />
      <Stack.Screen name="Gender" component={Gender} />
      <Stack.Screen name="Equipment" component={Equipment} />
      <Stack.Screen name="Focus" component={Focus} />
      <Stack.Screen name="Level" component={Level} />
      <Stack.Screen name="Height" component={Height} />
      <Stack.Screen name="Weight" component={Weight} />
    </Stack.Navigator>
  );
};
// export default Router;
