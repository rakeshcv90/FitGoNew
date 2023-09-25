import { View, Text } from 'react-native'
import React from 'react'
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import Router from './src/Navigation/Router';
import FlashMessage from "react-native-flash-message";
export const navigationRef = createNavigationContainerRef();

const App = () => {
  return (
    <>
    <NavigationContainer ref={navigationRef}>
      <Router />
    </NavigationContainer>
    <FlashMessage position="top" />
    
  </>
  )
}

export default App