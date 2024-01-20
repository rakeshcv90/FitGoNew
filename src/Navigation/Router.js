import {View, Text} from 'react-native';
import React from 'react';
import SplaceScreen from '../Screen/SplaceScreen';
import ForgetPassword from '../Screen/ForgetPassword';
import TermaAndCondition from '../Screen/TermaAndCondition';
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
import IntroductionScreen1 from '../Screen/Introduction/IntroductionScreen1';
import IntroductionScreen2 from '../Screen/Introduction/IntroductionScreen2';
import IntroductionScreen3 from '../Screen/Introduction/IntroductionScreen3';
import MeditationConsent from '../Screen/MeditationScreens/MeditationConsent';
import MeditationRoutine from '../Screen/MeditationScreens/MeditationRoutine';
import LogSignUp from '../Screen/LogSignUp';
import NewEditProfile from '../Component/NewEditProfile';
import NewPersonalDetails from '../Screen/NewPersonalDetails';
import NewStepCounter from '../Screen/NewStepCounter';
import SleepDuration from '../Screen/MeditationScreens/SleepDuration';
import MentalState from '../Screen/MeditationScreens/MentalState';
import Alcohalinfo from '../Screen/MeditationScreens/Alcohalinfo';
import FocusArea from '../Screen/FocusArea';
import Injury from '../Screen/Yourself/Injury';
import Preview from '../Screen/Yourself/Preview';
import WorkoutArea from '../Screen/Yourself/WorkoutArea';
import Age from '../Screen/Yourself/Age';
import Goal from '../Screen/Yourself/Goal';
import LoadData from '../Screen/Yourself/LoadData';
import PredictionScreen from '../Screen/MeditationScreens/PredictionScreen';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';

import AlcohalConsent from '../Screen/MeditationScreens/AlcohalConsent';
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
import ProductsList from '../Screen/NewHome/ProductsList';
import MeditationDetails from '../Screen/NewHome/MeditationDetails';
import MeditationExerciseDetails from '../Screen/NewHome/MeditationExerciseDetails';
import AITrainer from '../Screen/NewHome/AITrainer';
import AIMessageHistory from '../Screen/NewHome/AIMessageHistory';
import Subscription from '../Screen/Subscription/Subscription';

import Report from '../Screen/NewHome/Report';
import NewProgressScreen from '../Screen/NewHome/NewProgressScreen';
import NewMonthlyAchievement from '../Screen/NewHome/NewMonthlyAchievement';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  gestureDirection: 'horizontal',
  gesturesEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

};
export const LoginStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
      <Stack.Screen name="Injury" component={Injury} />
      <Stack.Screen name="FocusArea" component={FocusArea} />
      <Stack.Screen name="WorkoutArea" component={WorkoutArea} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="TermaAndCondition" component={TermaAndCondition} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="Edit_Profile" component={NewEditProfile} />
      <Stack.Screen name="NewPersonalDetails" component={NewPersonalDetails} />
      <Stack.Screen name="StepCounter" component={NewStepCounter} />
      <Stack.Screen name="Scale" component={Scale} />
      <Stack.Screen name="Gender" component={Gender} />
      <Stack.Screen name="Equipment" component={Equipment} />
      <Stack.Screen name="Focus" component={Focus} />
      <Stack.Screen name="Level" component={Level} />
      <Stack.Screen name="Height" component={Height} />
      <Stack.Screen name="Weight" component={Weight} />
      <Stack.Screen name="Age" component={Age} />
      <Stack.Screen name="PredictionScreen" component={PredictionScreen} />
      <Stack.Screen name="MeditationConsent" component={MeditationConsent} />
      <Stack.Screen name="MeditationRoutine" component={MeditationRoutine} />
      <Stack.Screen name="SleepDuration" component={SleepDuration} />
      <Stack.Screen name="MentalState" component={MentalState} />
      <Stack.Screen name="Alcohalinfo" component={Alcohalinfo} />
      <Stack.Screen name="LoadData" component={LoadData} />
      <Stack.Screen name="Preview" component={Preview} />
      <Stack.Screen name="Goal" component={Goal} />
      <Stack.Screen name="AlcoholConsent" component={AlcohalConsent} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="NewEditProfile" component={NewEditProfile} />
      <Stack.Screen name="WorkoutsDescription" component={WorkoutDescription} />
      <Stack.Screen name="WorkoutDays" component={WorkoutDays} />
      <Stack.Screen name="OneDay" component={OneDay} />
      <Stack.Screen name="Exercise" component={Exercise} />
      <Stack.Screen name="SaveDayExercise" component={SaveDayExercise} />
      <Stack.Screen name="DayRewards" component={DayRewards} />
      <Stack.Screen name="AllWorkouts" component={AllWorkouts} />
      <Stack.Screen name="Meals" component={Meals} />
      <Stack.Screen name="MealDetails" component={MealDetails} />
      <Stack.Screen name="ProductsList" component={ProductsList} />
      <Stack.Screen name="MeditationDetails" component={MeditationDetails} />
      <Stack.Screen
        name="MeditationExerciseDetails"
        component={MeditationExerciseDetails}
      />
        <Stack.Screen name="Report" component={Report}/>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="AITrainer" component={AITrainer} />
      <Stack.Screen name="AIMessageHistory" component={AIMessageHistory} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="NewProgressScreen" component={NewMonthlyAchievement}/>
    </Stack.Navigator>
  );
};
// export default Router;
