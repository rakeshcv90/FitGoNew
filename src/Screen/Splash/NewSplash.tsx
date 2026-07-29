import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import SplashAnimation from './SplashAnimation';
import FitText from '../../Component/Utilities/FitText';
import {AppColor, Fonts} from '../../Component/Color';
import {setupSubscription} from './setupSubscription';
import {API_CALLS} from '../../API/API_CALLS';
import useSetupAds from './useSetupAds';
import {useSelector} from 'react-redux';
import checkAllPermissions from './checkAllPermissions';
import LottieView from 'lottie-react-native';
import AdmobInterstitial from '../../Component/NativeCodeAds/AdmobInterstitial';
import {
  setLanguage,
  getCurrentLanguage,
  loadLanguage,
} from '../Translation/TranslationService';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// ─── Premium Spinning Ring Loader ─────────────────────────────────
const RING_SIZE = 48;

const SpinningRing = () => {
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {duration: 1400, easing: Easing.linear}),
      -1,
    );
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
        withTiming(1, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, {duration: 1000, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.2, {duration: 1000, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}, {scale: pulseScale.value}],
  }));

  const innerGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={spinnerStyles.container}>
      {/* Static faint track */}
      <View style={spinnerStyles.trackRing} />
      {/* Inner glow */}
      <Animated.View style={[spinnerStyles.innerGlow, innerGlowStyle]} />
      {/* Spinning ring with partial border */}
      <Animated.View style={[spinnerStyles.spinningRing, ringStyle]}>
        {/* Leading bright dot */}
        <View style={spinnerStyles.leadingDot} />
      </Animated.View>
    </View>
  );
};

const spinnerStyles = StyleSheet.create({
  container: {
    width: RING_SIZE + 16,
    height: RING_SIZE + 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackRing: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: AppColor.RED + '15',
  },
  innerGlow: {
    position: 'absolute',
    width: RING_SIZE - 8,
    height: RING_SIZE - 8,
    borderRadius: (RING_SIZE - 8) / 2,
    backgroundColor: AppColor.RED + '10',
  },
  spinningRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2.5,
    borderTopColor: AppColor.RED,
    borderRightColor: AppColor.RED + '60',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  leadingDot: {
    position: 'absolute',
    top: -2,
    left: RING_SIZE / 2 - 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AppColor.RED,
    shadowColor: AppColor.RED,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 6,
  },
});

// ─── Animated percentage text ─────────────────────────────────────
const AnimatedPercentage = ({active}: {active: boolean}) => {
  const percentage = useSharedValue(0);

  useEffect(() => {
    if (active) {
      percentage.value = withTiming(99, {
        duration: 9500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [active]);

  const textOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(percentage.value, [0, 5], [0, 1]),
  }));

  // We can't animate text content with reanimated in RN easily,
  // so we use a simple approach with the progress bar width
  return null;
};

// ─── Shimmer sweep for the progress bar ──────────────────────────
const ProgressShimmer = () => {
  const shimmerPos = useSharedValue(-1);

  useEffect(() => {
    shimmerPos.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 1500, easing: Easing.inOut(Easing.ease)}),
          withTiming(-1, {duration: 0}),
        ),
        -1,
      ),
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerPos.value,
          [-1, 1],
          [-40, SCREEN_WIDTH * 0.55 + 40],
        ),
      },
    ],
  }));

  return (
    <View style={progressStyles.shimmerMask}>
      <Animated.View style={[progressStyles.shimmerBand, shimmerStyle]}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['transparent', AppColor.RED + '30', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

const progressStyles = StyleSheet.create({
  shimmerMask: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 3,
  },
  shimmerBand: {
    position: 'absolute',
    width: 40,
    height: '100%',
  },
});

// ─── Background ambient particles ────────────────────────────────
const BackgroundParticle = ({
  size,
  startX,
  startY,
  duration,
  delay,
}: {
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-120, {duration, easing: Easing.out(Easing.quad)}),
        -1,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, {duration: duration * 0.2}),
          withTiming(0.4, {duration: duration * 0.5}),
          withTiming(0, {duration: duration * 0.3}),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: startX,
    top: startY,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#ffffff',
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return <Animated.View style={style} pointerEvents="none" />;
};

// ═════════════════════════════════════════════════════════════════
//  MAIN SPLASH COMPONENT
// ═════════════════════════════════════════════════════════════════
const NewSplash = ({navigation}: any) => {
  const [loader, setLoader] = useState(true);

  const getAllExercise = useSelector((state: any) => state.getAllExercise);
  const getOfferAgreement = useSelector(
    (state: any) => state.getOfferAgreement,
  );
  const showIntro = useSelector((state: any) => state.showIntro);
  const getChallengesData = useSelector(
    (state: any) => state.getChallengesData,
  );

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const lang = getCurrentLanguage();

  const loaderCardOpacity = useSharedValue(0);
  const loaderCardTranslateY = useSharedValue(30);
  const screenOpacity = useSharedValue(0);

  // Premium loader animations
  const topGradientOpacity = useSharedValue(0);
  const bottomVignetteOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const statusTextOpacity = useSharedValue(0);
  const loaderGlowPulse = useSharedValue(0);
  const loaderBlurPulse = useSharedValue(0);

  useEffect(() => {
    screenOpacity.value = withTiming(1, {duration: 500});

    // Cinematic gradient fade-in
    topGradientOpacity.value = withDelay(300, withTiming(0.6, {duration: 800}));
    bottomVignetteOpacity.value = withDelay(
      500,
      withTiming(0.8, {duration: 1000}),
    );

    // Loader card entrance
    loaderCardOpacity.value = withDelay(1500, withTiming(1, {duration: 700}));
    loaderCardTranslateY.value = withDelay(
      1500,
      withTiming(0, {duration: 700, easing: Easing.out(Easing.cubic)}),
    );

    // Progress bar fills up over ~9 seconds
    progressWidth.value = withDelay(
      1800,
      withTiming(1, {duration: 8200, easing: Easing.out(Easing.cubic)}),
    );

    // Status text fades in
    statusTextOpacity.value = withDelay(2200, withTiming(1, {duration: 500}));

    // Loader glow breathing
    loaderGlowPulse.value = withDelay(
      1800,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 1500, easing: Easing.out(Easing.ease)}),
          withTiming(0, {duration: 1500, easing: Easing.in(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );

    // Background blur pulse behind loader
    loaderBlurPulse.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 2000, easing: Easing.out(Easing.ease)}),
          withTiming(0, {duration: 2000, easing: Easing.in(Easing.ease)}),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const loaderCardStyle = useAnimatedStyle(() => ({
    opacity: loaderCardOpacity.value,
    transform: [{translateY: loaderCardTranslateY.value}],
  }));

  const topGradientStyle = useAnimatedStyle(() => ({
    opacity: topGradientOpacity.value,
  }));

  const bottomVignetteStyle = useAnimatedStyle(() => ({
    opacity: bottomVignetteOpacity.value,
  }));

  const loaderGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(loaderGlowPulse.value, [0, 1], [0, 0.35]),
    transform: [
      {scale: interpolate(loaderGlowPulse.value, [0, 1], [0.9, 1.15])},
    ],
  }));

  const loaderBlurStyle = useAnimatedStyle(() => ({
    opacity: interpolate(loaderBlurPulse.value, [0, 1], [0.15, 0.35]),
    transform: [
      {scale: interpolate(loaderBlurPulse.value, [0, 1], [0.85, 1.05])},
    ],
  }));

  const PROGRESS_BAR_WIDTH = SCREEN_WIDTH * 0.55;
  const progressFillStyle = useAnimatedStyle(() => ({
    width: progressWidth.value * PROGRESS_BAR_WIDTH,
  }));

  const statusTextStyle = useAnimatedStyle(() => ({
    opacity: statusTextOpacity.value,
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progressWidth.value, [0, 0.05], [0, 1]),
  }));

  const handleLangChange = async (langCode: string) => {
    await setLanguage(langCode);
  };

  useEffect(() => {
    const applyLanguage = async () => {
      await handleLangChange(lang); // or 'hi', 'en', etc.
    };
    applyLanguage();
    loadLanguage();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      AdmobInterstitial.loadAd()
        .then(() => console.log('Ad Loaded'))
        .catch(err => console.error('Ad Load Failed 123 .....', err));
    }
  }, []);

  useEffect(() => {
    const time = setTimeout(() => {
      setLoader(false);
    }, 10000);
    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    if (!loader) loadScreen();
  }, [loader]);

  const afterAdFunction = () => {
    setupSubscription();
    API_CALLS.getMajorData(lang);
    if (getUserDataDetails.id != null) {
      API_CALLS.postLogin(getUserDataDetails?.name, getUserDataDetails?.email);
      API_CALLS.getUserDataDetails(getUserDataDetails?.id, lang);
      if (getUserDataDetails.gender != null) {
        API_CALLS.getAllWorkouts(getUserDataDetails?.id, lang);
      }
      API_CALLS.pastWinners();
      getAllExercise &&
        getChallengesData &&
        API_CALLS.getAllExercisesData(getUserDataDetails?.id, lang);
    }
    // const time = setTimeout(() => {
    // loadScreen()
    // }, 10000);
  };

  const loadScreen = () => {
    setLoader(true);
    if (showIntro) {
      console.log('111');
      if (getUserDataDetails?.id) {
        console.log('112');
        if (getUserDataDetails?.profile_compl_status == 1) {
          console.log('113');
          if (getOfferAgreement?.term_condition == 'Accepted') {
            console.log('114');
            checkAllPermissions();
          } else {
            console.log('115');
            if (Platform.OS === 'android') {
              AdmobInterstitial.showAd()
                .then(() => {
                  console.log('Ad shown and completed');
                  navigation.replace('OfferTerms');
                })
                .catch(err => {
                  console.error('Ad show failed', err);
                  navigation.replace('OfferTerms');
                });
            } else {
              navigation.replace('OfferTerms');
            }
          }
        } else {
          console.log('116');
          if (Platform.OS === 'android') {
            AdmobInterstitial.showAd()
              .then(() => {
                console.log('Ad shown and completed');
                navigation.navigate('Yourself');
              })
              .catch(err => {
                console.error('Ad show failed', err);
                navigation.navigate('Yourself');
              });
          } else {
            navigation.navigate('Yourself');
          }
        }
      } else {
        console.log('login call from splash');
        if (Platform.OS === 'android') {
          AdmobInterstitial.showAd()
            .then(() => {
              console.log('Ad shown and completed');
              navigation.replace('LogSignUp');
            })
            .catch(err => {
              console.error('Ad show failed', err);
              navigation.replace('LogSignUp');
            });
        } else {
          navigation.replace('LogSignUp');
        }
      }
    } else {
      console.log('118');
      if (Platform.OS === 'android') {
        AdmobInterstitial.showAd()
          .then(() => {
            console.log('Ad shown and completed');
            navigation.replace('IntroductionScreen1');
          })
          .catch(err => {
            console.error('Ad show failed', err);
            navigation.replace('IntroductionScreen1');
          });
      } else {
        navigation.replace('IntroductionScreen1');
      }
    }
    afterAdFunction();
  };
  //  useSetupAds({ afterAdFunction, setLoader });

  return (
    <ImageBackground
      source={localImage.BGSplash}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />

      {/* Ambient floating particles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BackgroundParticle
          size={3}
          startX={SCREEN_WIDTH * 0.15}
          startY={200}
          duration={3500}
          delay={0}
        />
        <BackgroundParticle
          size={2}
          startX={SCREEN_WIDTH * 0.75}
          startY={350}
          duration={4000}
          delay={800}
        />
        <BackgroundParticle
          size={4}
          startX={SCREEN_WIDTH * 0.4}
          startY={500}
          duration={3200}
          delay={1500}
        />
        <BackgroundParticle
          size={2}
          startX={SCREEN_WIDTH * 0.6}
          startY={150}
          duration={3800}
          delay={600}
        />
        <BackgroundParticle
          size={3}
          startX={SCREEN_WIDTH * 0.25}
          startY={600}
          duration={4200}
          delay={2000}
        />
        <BackgroundParticle
          size={2}
          startX={SCREEN_WIDTH * 0.85}
          startY={450}
          duration={3600}
          delay={1200}
        />
      </View>

      {/* Top cinematic gradient overlay */}
      <Animated.View
        style={[styles.topGradientOverlay, topGradientStyle]}
        pointerEvents="none">
        <LinearGradient
          colors={[AppColor.RED + '30', 'transparent']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Bottom vignette */}
      <Animated.View
        style={[styles.bottomVignetteOverlay, bottomVignetteStyle]}
        pointerEvents="none">
        <LinearGradient
          colors={['transparent', '#00000015']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Main splash animation */}
      <Animated.View style={[styles.splashContent, screenStyle]}>
        <SplashAnimation />
      </Animated.View>

      {/* ══════ PREMIUM LOADER SECTION ══════ */}
      <Animated.View style={[styles.loaderSection, loaderCardStyle]}>
        {/* Background blur glow */}
        <Animated.View style={[styles.loaderBgBlur, loaderBlurStyle]}>
          <LinearGradient
            colors={[AppColor.RED + '25', AppColor.RED + '08', 'transparent']}
            style={styles.loaderBgBlurGradient}
          />
        </Animated.View>

        {/* Floating glow orb behind spinner */}
        <Animated.View style={[styles.spinnerGlowOrb, loaderGlowStyle]}>
          <LinearGradient
            colors={[AppColor.RED + '50', AppColor.RED + '00']}
            style={styles.spinnerGlowGradientInner}
          />
        </Animated.View>

        {/* Spinning ring loader */}
        <SpinningRing />

        {/* Status text */}
        <Animated.View style={[styles.statusTextWrapper, statusTextStyle]}>
          <Text style={styles.loadingText}>Loading your experience</Text>
          <View style={styles.statusDivider} />
        </Animated.View>

        {/* Premium progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressTrack, {width: PROGRESS_BAR_WIDTH}]}>
            {/* Fill */}
            <Animated.View style={[styles.progressFill, progressFillStyle]}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[
                  AppColor.RED + '60',
                  AppColor.RED,
                  AppColor.RED + 'CC',
                ]}
                style={[StyleSheet.absoluteFillObject, {borderRadius: 3}]}
              />
              {/* Bright tip */}
              <View style={styles.progressTip} />
            </Animated.View>
            {/* Shimmer sweep */}
            <ProgressShimmer />
          </View>
        </View>

        {/* Bottom tagline */}
        <Animated.View style={[styles.bottomTagline, statusTextStyle]}>
          <Text style={styles.taglineText}>Preparing workouts & plans...</Text>
        </Animated.View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  bottomVignetteOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ═══ Loader Section ═══
  loaderSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 24,
  },
  loaderBgBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  loaderBgBlurGradient: {
    flex: 1,
  },
  spinnerGlowOrb: {
    position: 'absolute',
    top: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  spinnerGlowGradientInner: {
    flex: 1,
    borderRadius: 50,
  },
  statusTextWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: AppColor.RED,
    letterSpacing: 0.6,
  },
  statusDivider: {
    width: 24,
    height: 1.5,
    backgroundColor: AppColor.RED + '30',
    borderRadius: 1,
    marginTop: 8,
  },
  progressBarContainer: {
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: AppColor.RED + '12',
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
    minWidth: 2,
  },
  progressTip: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 3,
    height: 5,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  bottomTagline: {
    marginTop: 12,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: AppColor.RED + '80',
    letterSpacing: 0.3,
  },
});

export default NewSplash;
