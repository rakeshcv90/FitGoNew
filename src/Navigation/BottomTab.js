import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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
import {AppColor, Fonts} from '../Component/Color';
import {setFitmeAdsCount} from '../Component/ThemeRedux/Actions';
import MyPlans, {handleStart} from '../Screen/MyPlans/MyPlans';
import GradientButton from '../Component/GradientButton';

import {localImage} from '../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import HomeNew from '../Screen/NewHome/HomeNew';
import Profile from '../Screen/NewHome/Profile';
import {ClipPath, Defs, Path, Polygon, Rect, Svg} from 'react-native-svg';
import NewProfile from '../Screen/NewProfile';
import { AnalyticsConsole } from '../Component/AnalyticsConsole';
import NewMonthlyAchievement from '../Screen/NewHome/NewMonthlyAchievement';
const Tabs = createBottomTabNavigator();

const AnimatedRect = Animated.createAnimatedComponent(Rect);

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
          AnalyticsConsole(`${route.name}_TAB`)
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
                    marginBottom: 10,
                    paddingHorizontal: 5,
                  },
                ]}>
                <View
                  style={
                    {
                      // padding: 5,
                    }
                  }>
                  <Image
                    source={localImage[route.name + 'Red']}
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: AppColor.NewRed,
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                    lineHeight: 14.63,
                    fontWeight: '600',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {label == 'MyPlans' ? 'Plan' : label}
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
                    paddingHorizontal: 4,
                  },
                ]}>
                <Image
                  source={localImage[route.name]}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text
                  style={{
                    color: '#121212B2',
                    opacity: 0.7,
                    fontSize: 14,
                    lineHeight: 14.63,
                    fontWeight: '500',
                    fontFamily: 'Montserrat-Medium',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {label == 'MyPlans' ? 'Plan' : label}
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

  // const getPurchaseStatusData = () => {
  //   if (getPurchaseHistory.length > 0) {
  //     if (
  //       getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
  //     ) {
  //       return null;
  //     } else {
  //       return (
  //         <View
  //           style={{
  //             marginTop:
  //               Platform.OS == 'ios'
  //                 ? DeviceHeigth == 667
  //                   ? -DeviceHeigth * 0.01
  //                   : DeviceHeigth >= 1024
  //                   ? 0
  //                   : DeviceHeigth * 0.0
  //                 : 0,
  //           }}>
  //           <BannerAdd bannerAdId={bannerAdId} />
  //         </View>
  //       );
  //     }
  //   } else {
  //     return (
  //       <View
  //         style={{
  //           marginTop:
  //             Platform.OS == 'ios'
  //               ? DeviceHeigth == 667
  //                 ? -DeviceHeigth * 0.01
  //                 : DeviceHeigth >= 1024
  //                 ? 0
  //                 : DeviceHeigth * 0.0
  //               : 0,
  //         }}>
  //         <BannerAdd bannerAdId={bannerAdId} />
  //       </View>
  //     );
  //   }
  // };
  return (
    <>
      <Tabs.Navigator
        initialRouteName="MyPlans"
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
          component={HomeNew}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="MyPlans"
          component={MyPlans}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="Workout"
          component={Workouts}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="Reports"
          component={NewMonthlyAchievement}
          options={{tabBarShowLabel: false}}
        />

        <Tabs.Screen
          name="Profile"
          component={NewProfile}
          options={{tabBarShowLabel: false}}
        />
      </Tabs.Navigator>
      {/* {getPurchaseStatusData()} */}
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
    backgroundColor: 'white',
    // zIndex: 1,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    // shadowColor: '#121212B2',
    // ...Platform.select({
    //   ios: {
    //     shadowOffset: {width: 1, height: 2},
    //     shadowOpacity: 0.5,
    //     shadowRadius: 8,
    //   },
    //   android: {
    //     elevation: 10,
    //   },
    // }),
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  nextButton: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  triangleContainer: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red', // Change this to the desired color of the triangle
    transform: [{rotate: '90deg'}],
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white', // Should match background color
    position: 'absolute',
    top: -40,
    left: 0,
  },
});

export default BottomTab;
