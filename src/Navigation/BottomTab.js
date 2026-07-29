import {
  Animated,
  AppState,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Workouts from '../Screen/NewHome/Workouts';

import Trainer from '../Screen/NewHome/Trainer';
import {View, Text} from 'react-native';
// import {BannerAdd, MyInterstitialAd} from '../Component/BannerAdd';
// import {bannerAdId} from '../Component/AdsId';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {AppColor, Fonts} from '../Component/Color';
import {
  setFitmeAdsCount,
  setOpenAdsCount,
} from '../Component/ThemeRedux/Actions';
import MyPlans, {handleStart} from '../Screen/MyPlans/MyPlans';
import GradientButton from '../Component/GradientButton';

import {localImage} from '../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import {ClipPath, Defs, Path, Polygon, Rect, Svg} from 'react-native-svg';
import NewProfile from '../Screen/NewProfile';
import {AnalyticsConsole} from '../Component/AnalyticsConsole';
import NewMonthlyAchievement from '../Screen/NewHome/NewMonthlyAchievement';
import {showMessage} from 'react-native-flash-message';
import AnimatedLottieView from 'lottie-react-native';
import NewHome from '../Screen/NewHome/NewHome';
import BackHandlerModal from './BackHandlerModal';
import Home from '../Screen/NewHome/Home';

import BannerAds from '../Component/NativeCodeAds/BannerAdView';
import AdmobInterstitial from '../Component/NativeCodeAds/AdmobInterstitial';
import {DeviceEventEmitter} from 'react-native';
import {translate} from '../Screen/Translation/TranslationService';

const Tabs = createBottomTabNavigator();

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const AnimatedTabItem = ({
  route,
  isFocused,
  onPress,
  imageSource,
  label,
  enteredCurrentEvent,
  NotificationBadge,
}: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isFocused]);

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
          <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <Image
              source={imageSource}
              tintColor={'#1671A8'}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Animated.View>

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
            source={imageSource}
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
};

const CustomTab = ({state, descriptors, navigation, onIndexChange}: any) => {
  // const { showInterstitialAd} = MyInterstitialAd();
  const Dispatch = useDispatch();
  const getFitmeAdsCount = useSelector((state: any) => state.getFitmeAdsCount);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const getOpenAdsCount = useSelector((state: any) => state.getOpenAdsCount);
  const enteredUpcomingEvent = useSelector(
    (state: any) => state?.enteredUpcomingEvent,
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
      {state.routes.map((route: any, index: number) => {
        const routeKey = route.name;
        const {options} = descriptors[route.key];

        const imageSourceMap: any = {
          home: localImage.Home,
          myplans: localImage.MyPlans,
          workout: localImage.Workout,
          profile: localImage.Profile,
        };

        const focusedImageSourceMap: any = {
          home: localImage.HomeRed,
          myplans: localImage.MyPlansRed,
          workout: localImage.WorkoutRed,
          profile: localImage.ProfileRed,
        };

        const labelMap: any = {
          home: translate('home'),
          myplans: translate('myplans'),
          workout: translate('workout'),
          profile: translate('profile'),
        };

        const isFocused = state.index === index;

        const imageSource = isFocused
          ? focusedImageSourceMap[routeKey]
          : imageSourceMap[routeKey];

        const label = labelMap[routeKey] || routeKey;

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
          // AnalyticsConsole(`${route.name}_TAB`);

          if (
            enteredCurrentEvent &&
            route.key?.includes(translate('myplans')) &&
            Sat
          ) {
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
                if (Platform.OS === 'android') {
                  const newCount = getFitmeAdsCount + 1;

                  const clickFrequency =
                    getPurchaseHistory?.plan === 'premium' ? 4 : 2;

                  // Update Redux counter
                  Dispatch(setFitmeAdsCount(newCount));

                  if (newCount % clickFrequency === 0) {
                    Dispatch(setFitmeAdsCount(0));
                    AdmobInterstitial.showAd()
                      .then(() => {
                        navigation.navigate(route.name);
                      })
                      .catch(err => {
                        console.error('Ad show failed', err);
                        navigation.navigate(route.name); // fallback
                      });
                  } else {
                    navigation.navigate(route.name);
                  }
                } else {
                  navigation.navigate(route.name); // direct navigation for iOS
                }
              } else {
                if (Platform.OS === 'android') {
                  const newCount = getFitmeAdsCount + 1;
                  const clickFrequency =
                    getPurchaseHistory?.plan === 'premium' ? 4 : 2;

                  // Update Redux counter
                  Dispatch(setFitmeAdsCount(newCount));

                  if (newCount % clickFrequency === 0) {
                    Dispatch(setFitmeAdsCount(0));
                    AdmobInterstitial.showAd()
                      .then(() => {
                        navigation.navigate(route.name);
                      })
                      .catch(err => {
                        console.error('Ad show failed', err);
                        navigation.navigate(route.name); // fallback
                      });
                  } else {
                    navigation.navigate(route.name);
                  }
                } else {
                  navigation.navigate(route.name); // direct navigation for iOS
                }
              }
            }
          }
        };

        return (
          <AnimatedTabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            imageSource={imageSource}
            label={label}
            enteredCurrentEvent={enteredCurrentEvent}
            NotificationBadge={NotificationBadge}
          />
        );
      })}
    </View>
  );
};

const BottomTab = () => {
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const [adHeight, setAdHeight] = useState(70);
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'BannerAdEvent',
      event => {
        if (event.type === 'banner' && event.event === 'refreshed') {
          setAdHeight(prev => (prev === 70 ? 71 : 70)); // Toggle to force re-render
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <>
      <Tabs.Navigator
        initialRouteName="home"
        tabBar={props => <CustomTab {...props} />}
        screenOptions={{
          headerShown: false,

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
          name="home"
          component={Home}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="myplans"
          component={MyPlans}
          options={{tabBarShowLabel: false}}
        />
        <Tabs.Screen
          name="workout"
          component={Workouts}
          options={{tabBarShowLabel: true}}
        />

        <Tabs.Screen
          name="profile"
          component={NewProfile}
          options={{tabBarShowLabel: false}}
        />
      </Tabs.Navigator>
      {/* {getPurchaseStatusData()} */}
      <View
        style={{
          marginTop: -DeviceHeigth * 0.005,
        }}>
        {Platform.OS === 'android' && (
          <BannerAds style={{width: '100%', height: adHeight}} />
        )}
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
    borderBottomColor: 'red',
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
    borderBottomColor: 'white',
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
