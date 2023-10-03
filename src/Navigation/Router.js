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