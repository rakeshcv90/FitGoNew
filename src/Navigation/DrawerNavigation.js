import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import DrawerItems from './DrawerItems';
import HomeScreenDrawer from './HomeScreenDrawer';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor:  '#fff',
        //   width: (DeviceWidth * 65) / 100,
        },
        headerStyle: {
          backgroundColor: '#f39c1f',
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
