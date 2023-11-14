import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import DrawerItems from './DrawerItems';
import HomeScreenDrawer from './HomeScreenDrawer';
import { useSelector } from 'react-redux';

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();
const {defaultTheme}=useSelector(state=>state)
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor:defaultTheme?"#000":"#fff",
          width: (DeviceWidth * 65) / 100,
        },
        headerStyle: {
          backgroundColor: '#C8170D',
          //height: (DeviceHeigth * 7) / 100,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'serif',
          fontSize: 25,
          justifyContent: 'center',
          alignItems: 'center',
        },
    
      }}
      drawerContent={props => <DrawerItems {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeScreenDrawer}
        options={{title: 'FitMe', headerTitleAlign: 'center'}}></Drawer.Screen>
    </Drawer.Navigator>
    
  );
};

export default DrawerNavigation;
