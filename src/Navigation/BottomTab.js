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
                    flexDirection: 'row',
                    // backgroundColor: 'rgba(148, 16, 0, 0.16)',
                    borderRadius: 50,
                    marginVertical: 10,
                    paddingLeft: 25,
                    paddingRight: 25,
                  },
                ]}>
                <View
                  style={{
                    padding: 5,
                  }}>
                  {route.name == 'Home' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/home.png')}
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: 'red',
                      }}
                    />
                  ) : route.name == 'Workouts' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/workout.png')}
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: 'red',
                      }}
                    />
                  ) : route.name == 'Reports' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/dattaGraph.png')}
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: 'red',
                      }}
                    />
                  ) : route.name == 'Store' ? (
                    <Image
                      source={require('../Icon/Images/NewImage/Store.png')}
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: 'red',
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../Icon/Images/NewImage/trainer.png')}
                      resizeMode="contain"
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: 'red',
                      }}
                    />
                  )}
                </View>
                <GradientText
                  fontSize={12}
                  marginTop={0}
                  height={20}
                  y={10}
                  x={-1}
                  text={label}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[
                  styles.tabButton,
                  {
                    marginVertical: 10,
                    paddingHorizontal: 10,
                  },
                ]}>
                {route.name == 'Home' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/home.png')}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: '#3D3D3D',
                    }}
                  />
                ) : route.name == 'Workouts' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/workout.png')}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: '#000000',
                    }}
                  />
                ) : route.name == 'Reports' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/dattaGraph.png')}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: '#3D3D3D',
                    }}
                  />
                ) : route.name == 'Store' ? (
                  <Image
                    source={require('../Icon/Images/NewImage/Store.png')}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: '#3D3D3D',
                    }}
                  />
                ) : (
                  <Image
                    source={require('../Icon/Images/NewImage/trainer.png')}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: '#3D3D3D',
                    }}
                  />
                )}
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
        tabBar={props => <CustomTab {...props} />}
        screenOptions={{
          activeTintColor: '#D01818',
          inactiveTintColor: '#3D3D3D',
          // activeBackgroundColor: '#EED9D6',
          tabBarStyle: {position: 'absolute', height: 70},
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
          name="Store"
          component={Store}
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
    height: 50,
    backgroundColor: AppColor.WHITE,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTab;
