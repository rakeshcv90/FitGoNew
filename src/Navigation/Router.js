import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplaceScreen from '../Screen/SplaceScreen';
import Login from '../Screen/Login';
import Signup from '../Screen/Signup';
import ForgetPassword from '../Screen/ForgetPassword';
import TermaAndCondition from '../Screen/TermaAndCondition';
import DrawerNavigation from './DrawerNavigation';
import HomeScreenDrawer from './HomeScreenDrawer';
import Workouts from '../Screen/Workouts/Workouts';
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
import Diets from '../Screen/Diets/Diets';
import DietCategory from '../Screen/Diets/DietCategory';
import DietDetail from '../Screen/Diets/DietDetail';
import SingleCategory from '../Screen/Diets/SingleCategory';
import Store from '../Screen/Stores/Store';
import StoreDetail from '../Screen/Stores/StoreDetail';
import StoreCategories from '../Screen/Stores/StoreCategories';
import Blog from '../Screen/Blog/Blog';
import BlogDetail from '../Screen/Blog/BlogDetail';
import BlogTags from '../Screen/Blog/BlogTags';
import ProfileScreen from '../Screen/ProfileScreen';
import SingleDay from '../Screen/SingleDay';
const Stack = createNativeStackNavigator();
const screenOptions = {
    headerShown: false, // Hide the header for all screens
  };
const Router = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="LoginStack" component={LoginStack} />
    <Stack.Screen name="Workouts" component={Workouts}/>
    <Stack.Screen name="Search" component={Search}/>
    <Stack.Screen name="Settings" component={Settings}/>
    <Stack.Screen name="Goals" component={Goals}/>
    <Stack.Screen name="Levels" component={Levels}/>
    <Stack.Screen name="WorkoutDescription" component={WorkoutDescription}/>
    <Stack.Screen name="SingleGoal" component={SingleGoal}/>
    <Stack.Screen name="SingleLevel" component={SingleLevel}/>
    <Stack.Screen name="Exercises" component={Exercises}/>
    <Stack.Screen name="ExerciseByBodyPart" component={ExerciseByBodyPart}/>
    <Stack.Screen name="Equipments" component={Equipments}/>
    <Stack.Screen name="Diets" component={Diets}/>
    <Stack.Screen name="DietCategory" component={DietCategory}/>
    <Stack.Screen name="DietDetail" component={DietDetail}/>
    <Stack.Screen name="SingleCategory" component={SingleCategory}/>
    <Stack.Screen name="Store" component={Store}/>
    <Stack.Screen name="StoreDetail" component={StoreDetail}/>
    <Stack.Screen name="StoreCategories" component={StoreCategories}/>
    <Stack.Screen name="Blog" component={Blog}/>
    <Stack.Screen name="BlogDetail" component={BlogDetail}/>
    <Stack.Screen name="BlogTags" component={BlogTags}/>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
    <Stack.Screen name="Singleday" component={SingleDay}/>
    </Stack.Navigator>
  );
}
const LoginStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="SplaceScreen" component={SplaceScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="TermaAndCondition" component={TermaAndCondition} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        {/* <Stack.Screen name="HomeScreenDrawer" component={HomeScreenDrawer} /> */}
      </Stack.Navigator>
    );
  };
export default Router