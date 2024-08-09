import React from 'react';
import SplaceScreen from '../Screen/SplaceScreen';
import TermaAndCondition from '../Screen/TermaAndCondition';
import Yourself from '../Screen/Yourself/Index';
import Scale from '../Screen/Yourself/Scale';
import Gender from '../Screen/Yourself/Gender';
import Equipment from '../Screen/Yourself/Equipment';
import Focus from '../Screen/Yourself/Focus';
import Level from '../Screen/Yourself/Level';
import Height from '../Screen/Yourself/Height';
import Weight from '../Screen/Yourself/Weight';
import IntroductionScreen1 from '../Screen/Introduction/IntroductionScreen1';
import IntroductionScreen2 from '../Screen/Introduction/IntroductionScreen2';
import IntroductionScreen3 from '../Screen/Introduction/IntroductionScreen3';
import LogSignUp from '../Screen/LogSignUp';
// import NewEditProfile from '../Component/NewEditProfile';
import NewPersonalDetails from '../Screen/NewPersonalDetails';

import FocusArea from '../Screen/FocusArea';
import Injury from '../Screen/Yourself/Injury';

import WorkoutArea from '../Screen/Yourself/WorkoutArea';
import Age from '../Screen/Yourself/Age';
import Goal from '../Screen/Yourself/Goal';
import LoadData from '../Screen/Yourself/LoadData';
import Profile from '../Screen/NewHome/Profile';
import BottomTab from './BottomTab';
import WorkoutDescription from '../Screen/NewWorkouts/WorkoutsDescription';
import WorkoutDays from '../Screen/NewWorkouts/WorkoutDays';
import OneDay from '../Screen/NewWorkouts/OneDay';
import Exercise from '../Screen/NewWorkouts/Exercise/Exercise';
import SaveDayExercise from '../Screen/NewWorkouts/Exercise/SaveDayExercise';
import DayRewards from '../Screen/NewWorkouts/Exercise/DayRewards';
import AllWorkouts from '../Screen/NewWorkouts/AllWorkouts';
import Meals from '../Screen/NewHome/Meals';
import MealDetails from '../Screen/NewHome/MealDetails';
import MeditationDetails from '../Screen/NewHome/MeditationDetails';
import MeditationExerciseDetails from '../Screen/NewHome/MeditationExerciseDetails';
import AITrainer from '../Screen/NewHome/AITrainer';
import AIMessageHistory from '../Screen/NewHome/AIMessageHistory';
import Subscription from '../Screen/Subscription/Subscription';
import Report from '../Screen/NewHome/Report';
import NewProgressScreen from '../Screen/NewHome/NewProgressScreen';
import NewMonthlyAchievement from '../Screen/NewHome/NewMonthlyAchievement';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import StoreScreen from '../Screen/NewHome/StoreScreen';
import FocuseWorkoutList from '../Screen/FocusArea/FocuseWorkoutList';
import CustomWorkout from '../Screen/CustomWorkout/CustomWorkout';
import CustomWorkoutDetails from '../Screen/CustomWorkout/CustomWorkoutDetails';
import CreateWorkout from '../Screen/CustomWorkout/CreateWorkout';
import EditCustomWorkout from '../Screen/CustomWorkout/EditCustomWorkout';

import Experience from '../Screen/Experience';
import AskToCreateWorkout from '../Screen/AskToCreateWorkout';
import WorkoutDayData from '../Screen/FocusArea/WorkoutDayData';

import WorkoutDetail from '../Screen/CustomWorkout/WorkoutDetail';
import PredictionScreen from '../Screen/Yourself/PredictionScreen';
import GymListing from '../Screen/GymListing/GymListing';
import Trainer from '../Screen/NewHome/Trainer';
import HomeNew from '../Screen/NewHome/HomeNew';
import LetsStart from '../Screen/LetsStart';
import NewFocusWorkouts from '../Screen/FocusArea/NewFocusWorkouts';

import WorkoutCategories from '../Screen/NewWorkouts/WorkoutCategories';
import Name from '../Screen/Yourself/Name';
import CountryLocation from '../Screen/Terms&Country/CountryLocation';
import OfferTerms from '../Screen/Terms&Country/OfferTerms';
import RewardModal from '../Component/Utilities/RewardModal';
import NewSubscription from '../Screen/Subscription/NewSubscription';
import UpcomingEvent from '../Screen/Event/UpcomingEvent';
import AddWorkouts from '../Screen/MyPlans/AddWorkouts';
import Leaderboard from '../Screen/Leaderboard/Leaderboard';
import Winner from '../Screen/Leaderboard/Winner';
import IntroVideo from '../Screen/Introduction/IntroVideo';

import RatingModal from '../Component/RatingModal';
import SplaceNew from '../Screen/SplaceNew';
import StreakModal from '../Component/Utilities/StreakModal';
import OfferGuidelines from '../Component/Utilities/OfferGuidelines';
import Referral from '../Screen/Referral/Referral';
import Breath from '../Screen/Breath/Breath';
import CollectCoins from '../Screen/NewPostExerciseScreens/CollectCoins';
import BreathSessionInfo from '../Screen/NewPostExerciseScreens/BreathSessionInfo';

import EventExercise from '../Screen/Event/EventExercise';
import EventExerciseHistory from '../Screen/Event/EventExerciseHistory';
import CardioPointErns from '../Screen/Event/CardioPointErns';
import DietPlatTabBar from './DietPlatTabBar';
import CustomMealList from '../Screen/NewMeal/CustomMealList';
import EditCustomMeal from '../Screen/NewMeal/EditCustomMeal';
import CardioExercise from '../Screen/Event/CardioExercise';
import Questions from '../Screen/FAQ/Questions';
import ChatBot from '../Screen/FAQ/ChatBot';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  animationEnabled: true,

  gestureEnabled: false,
  // gestureDirection: 'horizontal',
  // gesturesEnabled: true,
  // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
export const LoginStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* <Stack.Screen name="SplaceNew" component={SplaceNew} /> */}
      <Stack.Screen name="SplaceScreen" component={SplaceScreen} />
      <Stack.Screen
        name="IntroductionScreen1"
        component={IntroductionScreen1}
      />
      <Stack.Screen
        name="IntroductionScreen2"
        component={IntroductionScreen2}
      />
      <Stack.Screen
        name="IntroductionScreen3"
        component={IntroductionScreen3}
      />
      <Stack.Screen name="LogSignUp" component={LogSignUp} />
      <Stack.Screen name="Yourself" component={Yourself} />
      <Stack.Screen name="Name" component={Name} />
      <Stack.Screen name="Experience" component={Experience} />
      <Stack.Screen name="AskToCreateWorkout" component={AskToCreateWorkout} />
      <Stack.Screen name="TermaAndCondition" component={TermaAndCondition} />
      <Stack.Screen name="NewPersonalDetails" component={NewPersonalDetails} />
      <Stack.Screen name="Gender" component={Gender} />
      <Stack.Screen name="Height" component={Height} />
      <Stack.Screen name="Weight" component={Weight} />
      <Stack.Screen name="Age" component={Age} />
      <Stack.Screen name="PredictionScreen" component={PredictionScreen} />
      <Stack.Screen name="LoadData" component={LoadData} />
      <Stack.Screen name="Goal" component={Goal} />
      <Stack.Screen name="WorkoutsDescription" component={WorkoutDescription} />
      <Stack.Screen name="CountryLocation" component={CountryLocation} />
      <Stack.Screen name="OfferTerms" component={OfferTerms} />
      <Stack.Screen name="WorkoutDays" component={WorkoutDays} />
      <Stack.Screen name="OneDay" component={OneDay} />
      <Stack.Screen name="Exercise" component={Exercise} />
      <Stack.Screen name="SaveDayExercise" component={SaveDayExercise} />
      <Stack.Screen name="DayRewards" component={DayRewards} />
      <Stack.Screen name="Meals" component={Meals} />
      <Stack.Screen name="MealDetails" component={MealDetails} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="MeditationDetails" component={MeditationDetails} />
      <Stack.Screen
        name="MeditationExerciseDetails"
        component={MeditationExerciseDetails}
      />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="AITrainer" component={AITrainer} />
      <Stack.Screen name="AIMessageHistory" component={AIMessageHistory} />
      <Stack.Screen name="IntroVideo" component={IntroVideo} />
      <Stack.Screen name="OfferGuidelines" component={OfferGuidelines} />
      {/* <Stack.Screen name="Equipment" component={Equipment} /> */}
      {/* <Stack.Screen name="Focus" component={Focus} /> */}
      {/* <Stack.Screen name="Level" component={Level} /> */}
      {/* <Stack.Screen name="Profile" component={Profile} /> */}
      {/* <Stack.Screen name="NewEditProfile" component={NewEditProfile} /> */}
      {/* <Stack.Screen name="AllWorkouts" component={AllWorkouts} /> */}
      {/* <Stack.Screen name="Report" component={Report} /> */}
      {/* <Stack.Screen name="Subscription" component={Subscription} /> */}
      {/* <Stack.Screen name="FocuseWorkoutList" component={FocuseWorkoutList} /> */}
      {/* <Stack.Screen name="Injury" component={Injury} /> */}
      {/* <Stack.Screen name="FocusArea" component={FocusArea} />
      <Stack.Screen name="WorkoutArea" component={WorkoutArea} /> */}
      {/* <Stack.Screen name="Edit_Profile" component={NewEditProfile} /> */}
      {/* <Stack.Screen name="Scale" component={Scale} /> */}

      <Stack.Screen
        name="NewMonthlyAchievement"
        component={NewMonthlyAchievement}
      />
      <Stack.Screen name="CustomWorkout" component={CustomWorkout} />
      <Stack.Screen
        name="CustomWorkoutDetails"
        component={CustomWorkoutDetails}
      />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="EditCustomWorkout" component={EditCustomWorkout} />
      <Stack.Screen name="WorkoutDayData" component={WorkoutDayData} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} />
      <Stack.Screen name="GymListing" component={GymListing} />
      <Stack.Screen name="Trainer" component={Trainer} />
      <Stack.Screen name="Home" component={HomeNew} />
      <Stack.Screen name="LetsStart" component={LetsStart} />
      <Stack.Screen name="NewFocusWorkouts" component={NewFocusWorkouts} />
      <Stack.Screen name="WorkoutCategories" component={WorkoutCategories} />
      <Stack.Screen name="UpcomingEvent" component={UpcomingEvent} />
      <Stack.Screen name="NewSubscription" component={NewSubscription} />
      <Stack.Screen name="AddWorkouts" component={AddWorkouts} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} />
      <Stack.Screen name="Winner" component={Winner} />
      <Stack.Screen name="Referral" component={Referral} />
      <Stack.Screen name="EventExercise" component={EventExercise} />
      <Stack.Screen name="CardioExercise" component={CardioExercise} />
      <Stack.Screen
        name="EventExerciseHistory"
        component={EventExerciseHistory}
      />
      <Stack.Screen
        name="CollectCoins"
        component={CollectCoins}
        options={{detachPreviousScreen: true}}
      />
      <Stack.Screen name="CardioPointErns" component={CardioPointErns} />
      <Stack.Screen name="BreathSessionInfo" component={BreathSessionInfo} />
      <Stack.Screen name="DietPlatTabBar" component={DietPlatTabBar} />
      <Stack.Screen name="CustomMealList" component={CustomMealList} />
      <Stack.Screen name="EditCustomMeal" component={EditCustomMeal} />
      <Stack.Screen name="Questions" component={Questions} />
      <Stack.Screen name="ChatBot" component={ChatBot} />
    </Stack.Navigator>
  );
};
// export default Router;
