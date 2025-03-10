import React from 'react';
import SplaceScreen from '../Screen/SplaceScreen';
import TermaAndCondition from '../Screen/TermaAndCondition';
import Yourself from '../Screen/Yourself/index';
import Gender from '../Screen/Yourself/Gender';
import IntroductionScreen1 from '../Screen/Introduction/IntroductionScreen1';
import IntroductionScreen2 from '../Screen/Introduction/IntroductionScreen2';
import IntroductionScreen3 from '../Screen/Introduction/IntroductionScreen3';
import LogSignUp from '../Screen/LogSignUp';
import NewPersonalDetails from '../Screen/NewPersonalDetails';
import LoadData from '../Screen/Yourself/LoadData';
import BottomTab from './BottomTab';
import WorkoutDescription from '../Screen/NewWorkouts/WorkoutsDescription';
import WorkoutDays from '../Screen/NewWorkouts/WorkoutDays';
import OneDay from '../Screen/NewWorkouts/OneDay';
import SaveDayExercise from '../Screen/NewWorkouts/Exercise/SaveDayExercise';
import Meals from '../Screen/NewHome/Meals';
import MealDetails from '../Screen/NewHome/MealDetails';
import MeditationDetails from '../Screen/NewHome/MeditationDetails';
import AITrainer from '../Screen/NewHome/AITrainer';
import AIMessageHistory from '../Screen/NewHome/AIMessageHistory';
import NewMonthlyAchievement from '../Screen/NewHome/NewMonthlyAchievement';
import {createStackNavigator} from '@react-navigation/stack';
import CustomWorkout from '../Screen/CustomWorkout/CustomWorkout';
import CustomWorkoutDetails from '../Screen/CustomWorkout/CustomWorkoutDetails';
import CreateWorkout from '../Screen/CustomWorkout/CreateWorkout';
import EditCustomWorkout from '../Screen/CustomWorkout/EditCustomWorkout';

import Experience from '../Screen/Experience';

import WorkoutDetail from '../Screen/CustomWorkout/WorkoutDetail';
import PredictionScreen from '../Screen/Yourself/PredictionScreen';
import GymListing from '../Screen/GymListing/GymListing';
import Trainer from '../Screen/NewHome/Trainer';
import NewFocusWorkouts from '../Screen/FocusArea/NewFocusWorkouts';

import WorkoutCategories from '../Screen/NewWorkouts/WorkoutCategories';
import Name from '../Screen/Yourself/Name';
import OfferTerms from '../Screen/Terms&Country/OfferTerms';
import NewSubscription from '../Screen/Subscription/NewSubscription';
import UpcomingEvent from '../Screen/Event/UpcomingEvent';
import AddWorkouts from '../Screen/MyPlans/AddWorkouts';
import Leaderboard from '../Screen/Leaderboard/Leaderboard';
import IntroVideo from '../Screen/Introduction/IntroVideo';
import OfferGuidelines from '../Component/Utilities/OfferGuidelines';
import Referral from '../Screen/Referral/Referral';
import EventExerciseHistory from '../Screen/Event/EventExerciseHistory';
import DietPlatTabBar from './DietPlatTabBar';
import CustomMealList from '../Screen/NewMeal/CustomMealList';
import EditCustomMeal from '../Screen/NewMeal/EditCustomMeal';
import Questions from '../Screen/FAQ/Questions';
import ChatBot from '../Screen/FAQ/ChatBot';
import StepGuide from '../Screen/StepbyStepGuide/StepGuide';
import Breathe from '../Screen/Breath/Breathe';
import WorkoutHistory from '../Screen/WorkoutHistory/WorkoutHistory';
import OfferPage from '../Screen/OfferScreen/OfferPage';
import WorkoutCompleted from '../Screen/WorkoutCompleteScreen/WorkoutCompleted';
import PastWinner from '../Screen/NewHome/PastWinner';
import CardioCompleted from '../Screen/WorkoutCompleteScreen/CardioCompleted';
import NewStore from '../Screen/Store/NewStore';
import Products from '../Screen/Store/Products';
import PermissionScreen from '../Component/Permissions/PermissionScreen';
import SplaceNew from '../Screen/SplaceNew';
import NewExercise from '../Screen/NewWorkouts/Exercise/NewExercise';
import NewMeditationExercise from '../Screen/NewHome/NewMeditationExercise';
import Goal from '../Screen/Yourself/Goal';
import NewCategories from '../Screen/NewWorkoutCategories/NewCategories';
import NewLogin from '../Screen/NewLogin';
import NewHistory from '../Screen/WorkoutHistory/NewHistory';
import NewDiet from '../Screen/NewHome/NewDiet';
import NewSplash from '../Screen/Splash/NewSplash';
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
      <Stack.Screen name="SplaceScreen" component={NewSplash} />
      <Stack.Screen name="SplaceNew" component={SplaceNew} />
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
      <Stack.Screen name="LogSignUp" component={NewLogin} />
      <Stack.Screen name="Yourself" component={Yourself} />
      <Stack.Screen name="Name" component={Name} />
      <Stack.Screen name="Experience" component={Experience} />
      <Stack.Screen name="TermaAndCondition" component={TermaAndCondition} />
      <Stack.Screen name="NewPersonalDetails" component={NewPersonalDetails} />
      <Stack.Screen name="Gender" component={Gender} />
      <Stack.Screen name="Goal" component={Goal} />
      <Stack.Screen name="PredictionScreen" component={PredictionScreen} />
      <Stack.Screen name="LoadData" component={LoadData} />
      <Stack.Screen name="WorkoutsDescription" component={WorkoutDescription} />
      <Stack.Screen name="OfferTerms" component={OfferTerms} />
      <Stack.Screen name="WorkoutDays" component={WorkoutDays} />
      <Stack.Screen name="OneDay" component={OneDay} />
      <Stack.Screen name="Exercise" component={NewExercise} />
      <Stack.Screen
        name="SaveDayExercise"
        component={SaveDayExercise}
        options={{detachPreviousScreen: true}}
      />
      <Stack.Screen name="Meals" component={Meals} />
      <Stack.Screen name="MealDetails" component={MealDetails} />
      <Stack.Screen name="Store" component={NewStore} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="MeditationDetails" component={MeditationDetails} />
      <Stack.Screen name="Breathe" component={Breathe} />
      <Stack.Screen
        name="MeditationExerciseDetails"
        component={NewMeditationExercise}
      />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="AITrainer" component={AITrainer} />
      <Stack.Screen name="AIMessageHistory" component={AIMessageHistory} />
      <Stack.Screen name="IntroVideo" component={IntroVideo} />
      <Stack.Screen name="OfferGuidelines" component={OfferGuidelines} />
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
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} />
      <Stack.Screen name="GymListing" component={GymListing} />
      <Stack.Screen name="Trainer" component={Trainer} />
      <Stack.Screen name="NewFocusWorkouts" component={NewFocusWorkouts} />
      <Stack.Screen name="WorkoutCategories" component={NewCategories} />
      <Stack.Screen name="UpcomingEvent" component={UpcomingEvent} />
      <Stack.Screen name="NewSubscription" component={NewSubscription} />
      <Stack.Screen name="AddWorkouts" component={AddWorkouts} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} />
      <Stack.Screen name="Referral" component={Referral} />
      <Stack.Screen name="EventExercise" component={NewExercise} />
      <Stack.Screen name="CardioExercise" component={NewExercise} />
      <Stack.Screen
        name="EventExerciseHistory"
        component={EventExerciseHistory}
      />
      <Stack.Screen name="DietPlatTabBar" component={NewDiet} />
      <Stack.Screen name="CustomMealList" component={CustomMealList} />
      <Stack.Screen name="EditCustomMeal" component={EditCustomMeal} />
      <Stack.Screen name="PastWinner" component={PastWinner} />
      <Stack.Screen name="Questions" component={Questions} />
      <Stack.Screen name="ChatBot" component={ChatBot} />
      <Stack.Screen name="StepGuide" component={StepGuide} />
      <Stack.Screen name="OfferPage" component={OfferPage} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistory} />
      <Stack.Screen
        name="WorkoutCompleted"
        component={WorkoutCompleted}
        options={{detachPreviousScreen: true}}
      />
      <Stack.Screen
        name="CardioCompleted"
        component={CardioCompleted}
        options={{detachPreviousScreen: true}}
      />
      <Stack.Screen name='PermissionScreen' component={PermissionScreen}/>
      <Stack.Screen name='NewHistory' component={NewHistory}/>
    </Stack.Navigator>
  );
};
// export default Router;
