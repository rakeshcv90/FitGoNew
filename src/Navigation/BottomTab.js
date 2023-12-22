import {Image} from 'react-native';
import React from 'react';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';

import Home from '../Screen/NewHome/Home';
import Diets from '../Screen/NewHome/Diets';
import Store from '../Screen/NewHome/Store';

import Workouts from '../Screen/NewHome/Workouts';

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
        }}>
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
          component={Diets}
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
          name="Progress"
          component={Store}
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
          component={Workouts}
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
          component={Workouts}
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
