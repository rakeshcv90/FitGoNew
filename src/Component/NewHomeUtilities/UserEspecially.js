import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Linking,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts, PLATFORM_IOS} from '../Color';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {useNavigation} from '@react-navigation/native';
import {AddCountFunction} from '../Utilities/AddCountFunction';
import AnimatedLottieView from 'lottie-react-native';
import GradientButton from '../GradientButton';
import {useLocation} from '../Permissions/PermissionHooks';
import Geolocation from '@react-native-community/geolocation';
import {localImage} from '../Image';
import FitText from '../Utilities/FitText';
import PredefinedStyles from '../Utilities/PredefineStyles';
import {ExerciseTime} from '../../Icon/ExerciseTime';
import {useSelector} from 'react-redux';
import {API_CALLS} from '../../API/API_CALLS';
import {
  translate,
  getCurrentLanguage,
} from '../../Screen/Translation/TranslationService';
import {FadeSlideIn} from '../../Screen/Introduction/IntroAnimations';
import FitIcon from '../Utilities/FitIcon';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const UserEspecially = () => {
  const navigation = useNavigation();
  const [locationP, setLocationP] = useState(false);
  const [breatheData, setBreatheData] = useState({
    coins: 0,
    active: false,
  });
  const {checkLocationPermission} = useLocation();
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);

  const openBreathe = enteredCurrentEvent ? breatheData.active : true;
  const currentLang = getCurrentLanguage();

  const breathePulse = useSharedValue(1);

  useEffect(() => {
    breathePulse.value = withRepeat(
      withSequence(
        withTiming(1.08, {duration: 1500, easing: Easing.inOut(Easing.ease)}),
        withTiming(1, {duration: 1500, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const animatedLotusStyle = useAnimatedStyle(() => ({
    transform: [{scale: breathePulse.value}],
  }));

  const data = useMemo(
    () => [
      {
        id: 1,
        title: translate('customade'),
        text: translate('customtext'),
        iconName: 'clipboard-text-outline',
        gradient: ['#FF5E7E', '#FF8E53'],
        shadowColor: '#FF5E7E',
      },
      {
        id: 2,
        title: translate('gyms'),
        text: translate('gymtext'),
        iconName: 'map-marker-radius-outline',
        gradient: ['#8E2DE2', '#5B21B6'],
        shadowColor: '#8E2DE2',
      },
      {
        id: 3,
        title: translate('diet'),
        text: translate('diettext'),
        iconName: 'food-apple-outline',
        gradient: ['#10B981', '#059669'],
        shadowColor: '#10B981',
      },
      {
        id: 4,
        title: translate('store'),
        text: translate('storetext'),
        iconName: 'shopping-outline',
        gradient: ['#2563EB', '#1D4ED8'],
        shadowColor: '#2563EB',
      },
    ],
    [currentLang],
  );

  useEffect(() => {
    API_CALLS.getBreatheTime(getUserDataDetails?.id, setBreatheData);
  }, [enteredCurrentEvent]);

  const HandelClick = index => {
    if (index == 1) {
      AnalyticsConsole(`CustomWrk_FR_Home`);
      navigation.navigate('CustomWorkout');
    } else if (index == 2) {
      locationPermission();
    } else if (index == 3) {
      AnalyticsConsole(`MEALS_BUTTON`);
      navigation.navigate('DietPlatTabBar');
    } else {
      navigation.navigate('Store');
    }
  };

  const Items = ({item, index}) => {
    const scale = useSharedValue(1);
    const badgeScale = useSharedValue(1);

    useEffect(() => {
      badgeScale.value = withRepeat(
        withSequence(
          withTiming(1.12, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
          withTiming(1, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
        ),
        -1,
        true,
      );
    }, []);

    const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{scale: scale.value}],
    }));

    const animatedBadgeStyle = useAnimatedStyle(() => ({
      transform: [{scale: badgeScale.value}],
    }));

    return (
      <FadeSlideIn
        delay={60 + index * 60}
        distance={12}
        style={styles.cardWrapper}>
        <AnimatedTouchable
          activeOpacity={0.88}
          onPressIn={() => {
            scale.value = withSpring(0.95, {damping: 12, stiffness: 220});
          }}
          onPressOut={() => {
            scale.value = withSpring(1, {damping: 12, stiffness: 220});
          }}
          onPress={() => HandelClick(index + 1)}
          style={[animatedCardStyle]}>
          <LinearGradient
            colors={item.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[
              styles.featureCardGradient,
              {shadowColor: item.shadowColor},
            ]}>
            <View style={styles.cardHeader}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.title}
              </Text>
            </View>

            <Text numberOfLines={2} style={styles.cardDesc}>
              {item.text}
            </Text>

            <View style={styles.iconBadgeWrap}>
              <Animated.View
                style={[styles.glassIconBadge, animatedBadgeStyle]}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name={item.iconName}
                  size={18}
                  color="#FFFFFF"
                />
              </Animated.View>
            </View>
          </LinearGradient>
        </AnimatedTouchable>
      </FadeSlideIn>
    );
  };

  const locationPermission = async () => {
    const result = await checkLocationPermission();
    if (
      result['android.permission.ACCESS_FINE_LOCATION'] == RESULTS.BLOCKED ||
      result['android.permission.ACCESS_FINE_LOCATION'] == RESULTS.DENIED
    ) {
      setLocationP(true);
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          openMaps(position?.coords);
        },
        error => {
          reject(error);
          console.log('coords error---->', error);
        },
      );
    });
  };

  const openMaps = currentLocation => {
    if (currentLocation) {
      const {latitude, longitude} = currentLocation;
      const googleMapsUrl = `https://www.google.com/maps/search/gyms/@${latitude},${longitude},15z`;
      Linking.openURL(googleMapsUrl).catch(err =>
        console.log('Error opening maps', err),
      );
    }
  };

  const PermissionModal = ({locationP, setLocationP}) => {
    return (
      <Modal
        animationType="slide"
        visible={locationP}
        onRequestClose={() => setLocationP(false)}
        transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enable Your Location</Text>
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage2/Location.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.15,
              }}
            />
            <Text style={styles.modalDesc}>
              Please allow required permissions to use the app. Go to App->Permissions and enable all Permissions.
            </Text>
            <View style={{height: 50, width: '100%', marginVertical: 15}}>
              <GradientButton
                text="Enable Location Services"
                onPress={() => {
                  Linking.openSettings().finally(() => {
                    setLocationP(false);
                  });
                }}
                w={DeviceWidth * 0.7}
                alignSelf
              />
            </View>
            <View style={{height: 50, width: '100%'}}>
              <GradientButton
                text="Do Not Allow"
                flex={0}
                w={DeviceWidth * 0.7}
                alignSelf
                onPress={() => setLocationP(false)}
                colors={['#ADA4A5', '#ADA4A5']}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <View style={styles.box}>
        <Text style={styles.sectionHeader}>
          {translate('especially')}
        </Text>

        {openBreathe && (
          <LinearGradient
            colors={['#4F46E5', '#7C3AED', '#C026D3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.breatheHeroCard}>
            <ImageBackground
              source={localImage.breathHome}
              resizeMode="cover"
              style={styles.breatheHeroBg}
              imageStyle={{opacity: 0.25}}>
              <View style={styles.breatheLeftSection}>
                <View style={styles.mindfulnessBadge}>
                  <Text style={styles.mindfulnessText}>● MINDFULNESS</Text>
                </View>

                <Text style={styles.breatheTitleText}>
                  {translate('breathin')}
                </Text>

                <View style={styles.breatheTimeRow}>
                  <ExerciseTime stroke="#FFFFFF" />
                  <Text style={styles.breatheTimeText}>30 sec</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.heroStartBtn}
                  onPress={() => {
                    navigation.navigate('Breathe', {type: 'Home'});
                  }}>
                  <Text style={styles.heroStartBtnText}>
                    {translate('startnow')} →
                  </Text>
                </TouchableOpacity>
              </View>

              <Animated.View
                style={[styles.breatheRightBadge, animatedLotusStyle]}>
                <FitIcon
                  type="MaterialCommunityIcons"
                  name="weather-windy"
                  size={32}
                  color="#FFFFFF"
                />
              </Animated.View>
            </ImageBackground>
          </LinearGradient>
        )}

        <View style={styles.gridContainer}>
          {data.map((item, index) => (
            <Items item={item} index={index} key={item.id} />
          ))}
        </View>
      </View>

      <PermissionModal locationP={locationP} setLocationP={setLocationP} />
    </>
  );
};

export default UserEspecially;

const styles = StyleSheet.create({
  box: {
    width: DeviceWidth * 0.95,
    backgroundColor: AppColor.WHITE,
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    color: '#1F2937',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    lineHeight: 26,
    fontSize: 17,
    marginBottom: 12,
    marginLeft: 2,
  },
  breatheHeroCard: {
    width: '100%',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  breatheHeroBg: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breatheLeftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  mindfulnessBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mindfulnessText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  breatheTitleText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  breatheTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breatheTimeText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 6,
  },
  heroStartBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  heroStartBtnText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 12,
  },
  breatheRightBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 14,
  },
  featureCardGradient: {
    width: '100%',
    height: 104,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    width: '100%',
  },
  cardTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardDesc: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    lineHeight: 15,
  },
  iconBadgeWrap: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  glassIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: DeviceWidth * 0.82,
    backgroundColor: AppColor.WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: AppColor.LITELTEXTCOLOR,
    fontWeight: '700',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: AppColor.HEADERTEXTCOLOR,
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    textAlign: 'center',
    marginHorizontal: 10,
  },
});
