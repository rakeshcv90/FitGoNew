import {Image, Platform} from 'react-native';
import React from 'react';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';

import Home from '../Screen/NewHome/Home';

import Store from '../Screen/NewHome/Store';

import Workouts from '../Screen/NewHome/Workouts';

import Trainer from '../Screen/NewHome/Trainer';
import NewProgressScreen from '../Screen/NewHome/NewProgressScreen';
import {View, Text} from 'react-native';
import {BannerAdd} from '../Component/BannerAdd';
import {bannerAdId} from '../Component/AdsId';
import {DeviceHeigth} from '../Component/Config';
import {useSelector} from 'react-redux';
import moment from 'moment';

const Tabs = AnimatedTabBarNavigator();

const BottomTab = () => {
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  const getPurchaseStatusData = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return (
          <View
            style={{
              marginTop:
                Platform.OS == 'ios'
                  ? DeviceHeigth == 667
                    ? -DeviceHeigth * 0.01
                    : DeviceHeigth >= 1024
                    ? 0
                    : -DeviceHeigth * 0.035
                  : 0,
            }}>
            <BannerAdd bannerAdId={bannerAdId} />
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            marginTop:
              Platform.OS == 'ios'
                ? DeviceHeigth == 667
                  ? -DeviceHeigth * 0.01
                  : DeviceHeigth >= 1024
                  ? 0
                  : -DeviceHeigth * 0.035
                : 0,
          }}>
          <BannerAdd bannerAdId={bannerAdId} />
        </View>
      );
    }
  };
  return (
    <>
      <Tabs.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: '#D01818',
          inactiveTintColor: '#3D3D3D',
          activeBackgroundColor: '#EED9D6',

          labelStyle: {
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 18,
            fontSize: 12,
          },
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
          component={NewProgressScreen}
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
      {getPurchaseStatusData()}
      {/* <View style={{marginTop:Platform.OS=='ios'?-DeviceHeigth*0.035:0}}>
       <BannerAdd bannerAdId={bannerAdId}/>
      </View> */}
    </>
  );
};

export default BottomTab;
