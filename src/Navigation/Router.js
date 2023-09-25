import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplaceScreen from '../Screen/SplaceScreen';
import Login from '../Screen/Login';
import Signup from '../Screen/Signup';
import ForgetPassword from '../Screen/ForgetPassword';


const Stack = createNativeStackNavigator();
const screenOptions = {
    headerShown: false, // Hide the header for all screens
  };

const Router = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="LoginStack" component={LoginStack} />
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
  
      </Stack.Navigator>
    );
  };

export default Router