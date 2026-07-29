import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import {
  DeviceHeigth,
  DeviceWidth,
  NewAppapi,
} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber from 'react-native-version-number';

import {
  setCustomWorkoutData,
  setOfferAgreement,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import FitText from '../../Component/Utilities/FitText';
import CircleProgress from '../../Component/Utilities/ProgressCircle';
import FitIcon from '../../Component/Utilities/FitIcon';
import {translate} from '../Translation/TranslationService';

// Ambient Floating Particles Component
const FuturisticParticles = () => {
  const p1Y = useSharedValue(0);
  const p2Y = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    p1Y.value = withRepeat(
      withSequence(
        withTiming(-18, {duration: 2400, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 2400, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    p2Y.value = withRepeat(
      withSequence(
        withTiming(16, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
        withTiming(-10, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, {duration: 1800, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.95, {duration: 1800, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const p1Style = useAnimatedStyle(() => ({
    transform: [{translateY: p1Y.value}],
  }));
  const p2Style = useAnimatedStyle(() => ({
    transform: [{translateY: p2Y.value}],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{scale: pulseScale.value}],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.haloGlow, glowStyle]} />
      <Animated.View style={[styles.particle, styles.particle1, p1Style]} />
      <Animated.View style={[styles.particle, styles.particle2, p2Style]} />
    </View>
  );
};

// Marquee Row 1 Item Component
const MarqueeRow1Item = ({item, progress}: {item: any; progress: Animated.SharedValue<number>}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [10, -300]),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.itemCard, animatedStyle]}>
      <Image resizeMode="contain" source={item.image} style={styles.marqueeImg} />
    </Animated.View>
  );
};

// Marquee Row 2 Item Component
const MarqueeRow2Item = ({item, progress}: {item: any; progress: Animated.SharedValue<number>}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-10, 300]),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.itemCard, animatedStyle]}>
      <Image resizeMode="contain" source={item.image} style={styles.marqueeImg} />
    </Animated.View>
  );
};

const LoadData = ({navigation}) => {
  const getFcmToken = useSelector((state: any) => state.getFcmToken);
  const getLaterButtonData = useSelector((state: any) => state.getLaterButtonData);
  const getUserDataDetails = useSelector((state: any) => state.getUserDataDetails);
  const getUserID = useSelector((state: any) => state.getUserID);
  const dispatch = useDispatch();

  const [loadData, setLoadData] = useState(0);
  const [activeNext, setActiveNext] = useState(false);

  const marqueeProgress = useSharedValue(0);

  const buttonName = [
    {id: 1, image: require('../../Icon/Images/NewImage/testImage.png')},
    {id: 2, image: require('../../Icon/Images/NewImage/testImage1.png')},
    {id: 3, image: require('../../Icon/Images/NewImage/testImage2.png')},
    {id: 4, image: require('../../Icon/Images/NewImage/testImage3.png')},
  ];

  const buttonName1 = [
    {id: 1, image: require('../../Icon/Images/NewImage/testImage3.png')},
    {id: 2, image: require('../../Icon/Images/NewImage/testImage2.png')},
    {id: 3, image: require('../../Icon/Images/NewImage/testImage1.png')},
    {id: 4, image: require('../../Icon/Images/NewImage/testImage.png')},
  ];

  // Smooth simulated progress increment until API finishes
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadData(prev => {
        if (prev < 90) return prev + 2;
        return prev;
      });
    }, 70);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    marqueeProgress.value = withRepeat(
      withTiming(1, {duration: 5000, easing: Easing.linear}),
      -1,
      false,
    );

    DeviceInfo.getUniqueId().then(id => {
      WholeData(id);
    });
  }, []);

  const WholeData = async deviceID => {
    const mergedObject = Object.assign({}, ...getLaterButtonData);
    const Id =
      getUserDataDetails?.id != null ? getUserDataDetails?.id : getUserID;
    try {
      const payload = new FormData();
      payload.append('deviceid', deviceID);
      payload.append('devicetoken', getFcmToken);
      payload.append('id', Id);
      payload.append('gender', mergedObject?.gender);
      payload.append('goal', mergedObject?.goal);
      payload.append('version', VersionNumber.appVersion);
      payload.append('name', getUserDataDetails?.name);

      const data = await axios(`${NewAppapi.Post_COMPLETE_PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });

      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        getUserDetailData(Id);
      }
    } catch (error) {
      console.log('Whole Data Error----->', error.response);
    }
  };

  const getUserDetailData = async userId => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userId}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        setLoadData(100);
        setActiveNext(true);
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);
      setLoadData(100);
      setActiveNext(true);
    }
  };

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />
      <FuturisticParticles />

      {/* Top Header Badge */}
      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        style={styles.topBadgeContainer}>
        <View style={styles.liveBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveBadgeText}>AI FITNESS ENGINE</Text>
        </View>
      </Animated.View>

      {/* Progress Circle Wrap */}
      <Animated.View
        entering={FadeInDown.duration(700).delay(100).springify()}
        style={styles.progressSection}>
        <View style={styles.circleWrap}>
          <CircleProgress
            progress={loadData}
            strokeWidth={8}
            secondayCircleColor="#F1F5F9"
            radius={72}>
            <View style={styles.progressTextCenter}>
              <FitText
                type="Heading"
                value={loadData + '%'}
                fontSize={38}
                lineHeight={48}
                style={{color: '#FF2A54', fontWeight: '800'}}
              />
              <Text style={styles.progressSubText}>
                {loadData < 100 ? 'ANALYZING' : 'READY ✓'}
              </Text>
            </View>
          </CircleProgress>
        </View>
      </Animated.View>

      {/* Status & Active User Info */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(200).springify()}
        style={styles.textSection}>
        <Text style={styles.headingText}>
          {translate('loadheading') || 'Creating Your Workout Plan...'}
        </Text>

        <View style={styles.statsCard}>
          <LinearGradient
            colors={['#FF2A54', '#E11D48']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.statsGradient}>
            <FitIcon
              name="fire"
              size={18}
              type="MaterialCommunityIcons"
              color="#FFFFFF"
            />
            <Text style={styles.statsText}>50K+ {translate('activeusers') || 'Active Users'}</Text>
          </LinearGradient>
        </View>

        <Text style={styles.descText}>
          {translate('loaddesc') || 'Personalizing exercises to fit your body goal...'}
        </Text>
      </Animated.View>

      {/* Horizontal Marquee Carousels */}
      <View style={styles.marqueeContainer}>
        <View style={styles.marqueeRow}>
          <FlatList
            data={buttonName}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <MarqueeRow1Item item={item} progress={marqueeProgress} />}
            horizontal
          />
        </View>

        <View style={styles.marqueeRow}>
          <FlatList
            data={buttonName1}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <MarqueeRow2Item item={item} progress={marqueeProgress} />}
            horizontal
          />
        </View>
      </View>

      {/* Bottom CTA Button */}
      {activeNext && (
        <Animated.View
          entering={FadeInUp.duration(400).springify()}
          style={styles.buttonWrapper}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('OfferTerms')}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#FF2A54', '#E11D48', '#C2255C']}
              style={styles.continueButton}>
              <Text style={styles.continueText}>SEE MY PLAN</Text>
              <FitIcon
                name="arrowright"
                size={20}
                type="AntDesign"
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default LoadData;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  haloGlow: {
    position: 'absolute',
    top: DeviceHeigth * 0.12,
    alignSelf: 'center',
    width: DeviceWidth * 0.7,
    height: DeviceWidth * 0.7,
    borderRadius: (DeviceWidth * 0.7) / 2,
    backgroundColor: 'rgba(255, 42, 84, 0.08)',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particle1: {
    top: DeviceHeigth * 0.08,
    left: 40,
    width: 14,
    height: 14,
    backgroundColor: 'rgba(255, 42, 84, 0.25)',
  },
  particle2: {
    top: DeviceHeigth * 0.22,
    right: 45,
    width: 20,
    height: 20,
    backgroundColor: 'rgba(142, 45, 226, 0.2)',
  },
  topBadgeContainer: {
    marginTop: Platform.OS === 'ios' ? 12 : 24,
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF2A54',
    marginRight: 8,
  },
  liveBadgeText: {
    color: '#FF2A54',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  progressSection: {
    marginTop: DeviceHeigth * 0.03,
    alignItems: 'center',
  },
  circleWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  progressTextCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSubText: {
    fontSize: 10,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: -4,
  },
  textSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
  },
  headingText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: '#475569',
    fontWeight: '600',
  },
  statsCard: {
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  descText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 14,
    lineHeight: 24,
  },
  marqueeContainer: {
    marginTop: 20,
    width: '100%',
  },
  marqueeRow: {
    height: 90,
    marginBottom: 10,
  },
  itemCard: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginLeft: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  marqueeImg: {
    width: 60,
    height: 60,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: DeviceHeigth * 0.04,
    width: DeviceWidth * 0.88,
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.4,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  continueButton: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 10,
  },
});
