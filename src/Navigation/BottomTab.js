import {Image, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';
import Home from '../Screen/NewHome/Home';
import GradientText from '../Component/GradientText';
import Store from '../Screen/NewHome/Store';

import Workouts from '../Screen/NewHome/Workouts';

import Trainer from '../Screen/NewHome/Trainer';
import NewProgressScreen from '../Screen/NewHome/NewProgressScreen';
import {View, Text} from 'react-native';
import {BannerAdd, MyInterstitialAd} from '../Component/BannerAdd';
import {bannerAdId} from '../Component/AdsId';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {AppColor} from '../Component/Color';
import {setFitmeAdsCount} from '../Component/ThemeRedux/Actions';

const Tabs = createBottomTabNavigator();

const CustomTab = ({state, descriptors, navigation, onIndexChange}) => {
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const Dispatch = useDispatch();
  const getFitmeAdsCount = useSelector(state => state.getFitmeAdsCount);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  useEffect(() => {
    initInterstitial();
  }, []);
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            if (getPurchaseHistory.length > 0) {
              if (
                getPurchaseHistory[0]?.plan_end_date >=
                moment().format('YYYY-MM-DD')
              ) {
                navigation.navigate(route.name);
                Dispatch(setFitmeAdsCount(0));
              } else {
                if (getFitmeAdsCount < 2) {
                  Dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
                  navigation.navigate(route.name);
                } else {
                  showInterstitialAd();
                  Dispatch(setFitmeAdsCount(0));
                  navigation.navigate(route.name);
                }
              }
            } else {
              if (getFitmeAdsCount < 2) {
                Dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
                navigation.navigate(route.name);
              } else {
                showInterstitialAd();
                Dispatch(setFitmeAdsCount(0));
                navigation.navigate(route.name);
              }
            }
          }
        };

        return (
          <>
            {isFocused ? (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[
                  styles.tabButton,
                  {
                    marginVertical: 10,
                    paddingHorizontal: 5,
                  },
                ]}>
                <View
                  style={
                    {
                      //padding: 5,
                    }
                  }>
                  {route.name == 'Home' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/homered.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  ) : route.name == 'Workout' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/workoutred.png')}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                  ) : route.name == 'Reports' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/dattaGraphred.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../Icon/Images/NewImage/trainerred.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  )}
                </View>

                <Text
                  style={{
                    color: AppColor.RED1,
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                    lineHeight: 14.63,
                    fontWeight: '700',

                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[
                  styles.tabButton,
                  {
                    marginVertical: 10,
                    paddingHorizontal: 5,
                  },
                ]}>
                {route.name == 'Home' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/home.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                ) : route.name == 'Workout' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/workout.png')}
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                ) : route.name == 'Reports' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/dattaGraph.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                ) : (
                  <Image
                    source={require('../Icon/Images/NewImage/trainer.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                )}
                <Text
                  style={{
                    color: '#202020',
                    opacity: 0.4,
                    fontSize: 12,
                    lineHeight: 14.63,
                    fontWeight: '500',
                    fontFamily: 'Montserrat-Medium',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            )}
          </>
        );
      })}
    </View>
  );
};

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
                    : DeviceHeigth * 0.0
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
                  : DeviceHeigth * 0.0
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
        tabBar={props => <CustomTab {...props} />}
        screenOptions={{
          activeTintColor: '#D01818',
          inactiveTintColor: '#3D3D3D',
          headerShown: false,
          // activeBackgroundColor: '#EED9D6',

          tabBarStyle: {
            position: 'absolute',
            height:
              Platform.OS == 'android'
                ? DeviceHeigth * 0.08
                : DeviceHeigth * 0.09,
          },

          labelStyle: {
            fontFamily: 'Poppins',
            fontWeight: '700',
            lineHeight: 70,
            fontSize: 12,
          },
        }}>
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="Workout"
          component={Workouts}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="Reports"
          component={NewProgressScreen}
          options={{tabBarShowLabel: false}}
        />

        <Tabs.Screen
          name="Trainer"
          component={Trainer}
          options={{tabBarShowLabel: false}}
        />
      </Tabs.Navigator>
      {getPurchaseStatusData()}
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height:
      Platform.OS == 'android'
        ? DeviceHeigth * 0.07
        : DeviceHeigth == 667
        ? DeviceHeigth * 0.09
        : DeviceHeigth >= 1024
        ? DeviceHeigth * 0.06
        : DeviceHeigth * 0.09,
    backgroundColor: AppColor.WHITE,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default BottomTab;
