import {Image} from 'react-native';
import React from 'react';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';

import Home from '../Screen/NewHome/Home';

import Store from '../Screen/NewHome/Store';

import Workouts from '../Screen/NewHome/Workouts';
import Report from '../Screen/NewHome/Report';
import Trainer from '../Screen/NewHome/Trainer';

const Tabs = AnimatedTabBarNavigator();
const BottomTab = () => {
  return (
    <>
      <Tabs.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: '#D01818',
          inactiveTintColor: '#3D3D3D',
          activeBackgroundColor: '#EED9D6',
    
        labelStyle: {  fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 18,
        fontSize: 12,
        },

        }}
 
        >
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../Icon/Images/NewImage/home.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 30,
                  tintColor: focused ? 'red' : '#3D3D3D',
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Workout"
          component={Workouts}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../Icon/Images/NewImage/workout.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 30,
                  tintColor: focused ? 'red' : '#000000',
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Reports"
          component={Report}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../Icon/Images/NewImage/dattaGraph.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 30,
                  tintColor: focused ? 'red' : '#3D3D3D',
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Store"
          component={Store}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../Icon/Images/NewImage/Store.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 30,
                  tintColor: focused ? 'red' : '#3D3D3D',
                }}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="Trainer"
          component={Trainer}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Image
                source={require('../Icon/Images/NewImage/trainer.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 30,
                  tintColor: focused ? 'red' : '#3D3D3D',
                }}
              />
            ),
          }}
        />
        
      </Tabs.Navigator>
    </>
  );
};

export default BottomTab;
