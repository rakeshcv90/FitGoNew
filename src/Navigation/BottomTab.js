import {
  Animated,
  AppState,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Workouts from '../Screen/NewHome/Workouts';

import Trainer from '../Screen/NewHome/Trainer';
import { View, Text } from 'react-native';
// import {BannerAdd, MyInterstitialAd} from '../Component/BannerAdd';
// import {bannerAdId} from '../Component/AdsId';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AppColor, Fonts } from '../Component/Color';
import {
  setFitmeAdsCount,
  setOpenAdsCount,
} from '../Component/ThemeRedux/Actions';
import MyPlans, { handleStart } from '../Screen/MyPlans/MyPlans';
import GradientButton from '../Component/GradientButton';

import { localImage } from '../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import { ClipPath, Defs, Path, Polygon, Rect, Svg } from 'react-native-svg';
import NewProfile from '../Screen/NewProfile';
import { AnalyticsConsole } from '../Component/AnalyticsConsole';
import NewMonthlyAchievement from '../Screen/NewHome/NewMonthlyAchievement';
import { showMessage } from 'react-native-flash-message';
import AnimatedLottieView from 'lottie-react-native';
import NewHome from '../Screen/NewHome/NewHome';
import BackHandlerModal from './BackHandlerModal';
import Home from '../Screen/NewHome/Home';

import BannerAds from '../Component/NativeCodeAds/BannerAdView';
// import AdmobInterstitial from '../Component/NativeCodeAds/AdmobInterstitial';
import { DeviceEventEmitter } from 'react-native';
import { translate } from '../Screen/Translation/TranslationService';

const Tabs = createBottomTabNavigator();

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const CustomTab = ({ state, descriptors, navigation, onIndexChange }) => {

  // const { showInterstitialAd} = MyInterstitialAd();
  const Dispatch = useDispatch();
  const getFitmeAdsCount = useSelector(state => state.getFitmeAdsCount);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const getOpenAdsCount = useSelector(state => state.getOpenAdsCount);
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  // const getPopUpFreuqency = useSelector(state => state?.getPopUpFreuqency);
  function NotificationBadge() {
    return (
      <View style={styles.badgeContainer}>
        <AnimatedLottieView
          source={require('../Icon/Images/InAppRewards/EventTick.json')}
          speed={2}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.lottie}
        />
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

              console.log('label .... ',label);
        const isFocused = state.index === index;

        const isValid =
          getPurchaseHistory?.end_date >= moment().format('YYYY-MM-DD');
        const count =
          getPurchaseHistory?.plan == 'noob'
            ? 3
            : getPurchaseHistory?.plan == 'pro'
              ? 6
              : 8;
        const Sat = getPurchaseHistory?.currentDay == 6;
        const Sun = getPurchaseHistory?.currentDay == 0;
        const onPress = () => {
          AnalyticsConsole(`${route.name}_TAB`);
          if (enteredCurrentEvent && route.key?.includes(translate('myplans')) && Sat) {
            showMessage({
              message:
                'Your event has ended. You can resume your weekly plan normally from Monday. If you join another fitness challenge, it will start from the upcoming Monday.',
              type: 'danger',
              animationDuration: 500,
              duration: 5000,
              floating: true,
            });
          } else if (
            enteredCurrentEvent &&
            route.key?.includes(translate('myplans')) &&
            Sun
          ) {
            showMessage({
              message:
                'Your event has ended. You can resume your weekly plan normally from Monday. If you join another fitness challenge, it will start from the upcoming Monday.',
              type: 'danger',
              animationDuration: 500,
              duration: 5000,
              floating: true,
            });
          } else {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              if (getPurchaseHistory.plan != null) {
                // if (getPurchaseHistory?.plan == 'premium' && isValid) {
                //   navigation.navigate(route.name);
                //   Dispatch(setFitmeAdsCount(0));
                //   Dispatch(setOpenAdsCount(0));
                // } else {
                {
                  /* if (getFitmeAdsCount < count) {
                  Dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
                  Dispatch(setOpenAdsCount(getOpenAdsCount + 1));
                  navigation.navigate(route.name);
                } else { */
                }
                {
                  /* showInterstitialAd(); */
                }
                {
                  /* Dispatch(setFitmeAdsCount(0));
                  Dispatch(setOpenAdsCount(0)); */
                }
                {/* AdmobInterstitial.showAd().then(() => {
                  navigation.navigate(route.name);
                }) */}

                if (Platform.OS === 'android') {
                  // AdmobInterstitial.showAd()
                  //   .then(() => {
                  //     console.log('Ad shown and completed');
                  //     navigation.navigate(route.name);
                  //   })
                  //   .catch((err) => {
                  //     console.error('Ad show failed', err);
                  //     navigation.navigate(route.name); // fallback if ad fails
                  //   });
                      navigation.navigate(route.name);
                } else {
                  navigation.navigate(route.name); // direct navigation for iOS
                }

                {
                  /* } */
                }
              } else {
                {
                  /* if (getFitmeAdsCount < 2) {
                  Dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
                  Dispatch(setOpenAdsCount(getOpenAdsCount + 1));
                  navigation.navigate(route.name);
                } else { */
                }
                {
                  /* showInterstitialAd(); */
                }
                {
                  /* Dispatch(setFitmeAdsCount(0));
                  Dispatch(setOpenAdsCount(0)); */
                }
                {/* AdmobInterstitial.showAd().then(() => {
                navigation.navigate(route.name);
                }) */}

                if (Platform.OS === 'android') {
                  // AdmobInterstitial.showAd()
                  //   .then(() => {
                  //     console.log('Ad shown and completed');
                  //     navigation.navigate(route.name);
                  //   })
                  //   .catch((err) => {
                  //     console.error('Ad show failed', err);
                  //     navigation.navigate(route.name); // fallback if ad fails
                  //   });
                  navigation.navigate(route.name); // fallback if ad fails
                } else {
                  navigation.navigate(route.name); // direct navigation for iOS
                }
                {
                  /* } */
                }
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
                    tintColor={'#1671A8'}
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: '#1671A8',
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 12,
                    lineHeight: 14.63,
                    fontWeight: '600',
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {label == translate('myplans') ? translate('myplans') : label}
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
                {enteredCurrentEvent && label == translate('myplans') && (
                  <NotificationBadge />
                )}
                <Text
                  style={{
                    color: '#121212B2',
                    opacity: 0.7,
                    fontSize: 12,
                    lineHeight: 14.63,
                    fontWeight: '500',
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {label == translate('myplans') ? translate('myplans') : label}
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
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const [adHeight, setAdHeight] = useState(70);
  const [adKey, setAdKey] = useState(0);


  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('BannerAdEvent', event => {
      if (event.type === 'banner' && event.event === 'refreshed') {
        console.log('Ad auto-refreshed - adjusting height');
        setAdHeight(prev => (prev === 70 ? 71 : 70)); // Toggle to force re-render
      }
    });

    return () => subscription.remove();
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAdKey(prev => prev + 1); // Force re-render
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <Tabs.Navigator
        initialRouteName={translate('home')}
        tabBar={props => <CustomTab {...props} />}
        screenOptions={{
          // activeTintColor: '#D01818',
          // inactiveTintColor: '#3D3D3D',
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
            fontSize: 10,
          },
        }}>
        <Tabs.Screen
          name={translate('home')}
          component={Home}
          options={{ tabBarShowLabel: false }}
        />
        <Tabs.Screen
          name={translate('myplans')}
          component={MyPlans}
          // options={{
          //   tabBarIcon: () => <NotificationBadge />,
          // }}
          options={{ tabBarShowLabel: false }}
        />
        <Tabs.Screen
          name={translate('workout')}
          component={Workouts}
          options={{ tabBarShowLabel: true }}
        />

        <Tabs.Screen
          name={translate('profile')}
          component={NewProfile}
          options={{ tabBarShowLabel: false }}
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
        {/* {Platform.OS === 'android' && (
          <BannerAds style={{ width: '100%', height: adHeight }} />
        )} */}
      </View>
      {/* <BackHandlerModal /> */}
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height:
      DeviceHeigth >= 640
        ? DeviceHeigth * 0.09
        : DeviceHeigth >= 1024
          ? DeviceHeigth * 0.06
          : DeviceHeigth * 0.09,
    backgroundColor: 'white',

    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
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
    transform: [{ rotate: '90deg' }],
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
  badgeContainer: {
    position: 'absolute',
    top:
      DeviceHeigth <= 667
        ? -12
        : DeviceHeigth <= 844
          ? -11
          : DeviceHeigth >= 1024
            ? -13
            : -10,
    right:
      DeviceHeigth <= 844
        ? 20
        : DeviceHeigth >= 1024
          ? DeviceHeigth * 0.054
          : 20,
    width: 25,
    height: 25,
  },
  lottie: {
    width: 25,
    height: 25,
  },
});

export default BottomTab;
