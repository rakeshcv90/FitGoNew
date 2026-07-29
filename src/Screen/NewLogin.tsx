import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {AppColor, Fonts} from '../Component/Color';
import FitText from '../Component/Utilities/FitText';
import * as Yup from 'yup';
import FitIcon, {FitIconTypes} from '../Component/Utilities/FitIcon';
import FitInput from '../Component/Utilities/FitInput';
import FitButton from '../Component/Utilities/FitButton';
import {Formik, FormikHelpers} from 'formik';
import ActivityLoader from '../Component/ActivityLoader';
import {DeviceWidth} from '../Component/Config';
import {API_CALLS} from '../API/API_CALLS';
import {navigate} from '../Component/Utilities/NavigationUtil';
import {showMessage} from 'react-native-flash-message';
import {Modal} from 'react-native-paper';
import {
  translate,
  getCurrentLanguage,
} from '../Screen/Translation/TranslationService';
import {
  FadeSlideIn,
  FloatingImage,
} from './Introduction/IntroAnimations';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required(translate('namevalid'))
    .matches(/^[A-Za-z].*/, translate('namechar'))
    .matches(/^[a-zA-Z0-9 ]*$/, translate('namespecial'))
    .min(3, translate('namevalid')),

  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, translate('emailvalid'))
    .required(translate('emailreq')),
});

type Values = {
  name: string;
  email: string;
};

// ─── Ambient Floating Cyber Particles ─────────────────────────────
const FuturisticParticles = () => {
  const p1Y = useSharedValue(0);
  const p2Y = useSharedValue(0);
  const p3Y = useSharedValue(0);

  useEffect(() => {
    p1Y.value = withRepeat(
      withSequence(
        withTiming(-14, {duration: 2200, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 2200, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    p2Y.value = withRepeat(
      withSequence(
        withTiming(12, {duration: 2800, easing: Easing.inOut(Easing.ease)}),
        withTiming(-8, {duration: 2800, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    p3Y.value = withRepeat(
      withSequence(
        withTiming(-18, {duration: 3200, easing: Easing.inOut(Easing.ease)}),
        withTiming(6, {duration: 3200, easing: Easing.inOut(Easing.ease)}),
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
  const p3Style = useAnimatedStyle(() => ({
    transform: [{translateY: p3Y.value}],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.particle, styles.particle1, p1Style]} />
      <Animated.View style={[styles.particle, styles.particle2, p2Style]} />
      <Animated.View style={[styles.particle, styles.particle3, p3Style]} />
    </View>
  );
};

// ─── Rotating Cyber Tech Rings around Hero Graphic ──────────────
const FuturisticHeroGraphic = () => {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(360);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, {duration: 14000, easing: Easing.linear}),
      -1,
    );
    rotation2.value = withRepeat(
      withTiming(0, {duration: 9000, easing: Easing.linear}),
      -1,
    );
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.06, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.96, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, {duration: 1500, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.3, {duration: 1500, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation1.value}deg`}],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation2.value}deg`}],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{scale: pulseScale.value}],
  }));

  return (
    <View style={styles.graphicWrap}>
      {/* Outer ambient glow halo */}
      <Animated.View style={[styles.cyberGlowHalo, glowStyle]} />

      {/* Outer spinning tech ring */}
      <Animated.View style={[styles.techRingOuter, ring1Style]}>
        <View style={styles.techDotTop} />
        <View style={styles.techDotBottom} />
      </Animated.View>

      {/* Inner counter-rotating ring */}
      <Animated.View style={[styles.techRingInner, ring2Style]}>
        <View style={styles.techDotLeft} />
        <View style={styles.techDotRight} />
      </Animated.View>

      {/* Floating hero image */}
      <FloatingImage
        source={require('../Assets/fitness_graphic.png')}
        style={styles.graphic}
      />
    </View>
  );
};

// ─── Futuristic Shimmer Button ────────────────────────────────────
const PremiumButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const arrowX = useSharedValue(0);

  useEffect(() => {
    arrowX.value = withRepeat(
      withSequence(
        withTiming(6, {duration: 600, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 600, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{translateX: arrowX.value}],
  }));

  return (
    <Animated.View style={[styles.premiumButtonWrap, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          scale.value = withTiming(0.95, {duration: 100});
        }}
        onPressOut={() => {
          scale.value = withSpring(1, {damping: 12, stiffness: 220});
        }}
        onPress={onPress}>
        <LinearGradient
          colors={['#FF2A54', '#E11D48', '#C2255C']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.premiumButton}>
          <View style={styles.buttonGlossLine} />
          <Text style={styles.premiumButtonText}>{label}</Text>
          <Animated.View style={[styles.arrowContainer, arrowStyle]}>
            <FitIcon
              name="arrowright"
              type="AntDesign"
              size={18}
              color={AppColor.WHITE}
            />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Futuristic Input Field Component ─────────────────────────────
const PremiumField = ({
  value,
  onChangeText,
  onBlur,
  onFocusCustom,
  placeholder,
  errors,
  touched,
  iconName,
  iconType,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  onFocusCustom?: () => void;
  placeholder: string;
  errors?: string;
  touched?: boolean;
  iconName: string;
  iconType: FitIconTypes['type'];
}) => {
  const [focused, setFocused] = useState(false);
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withTiming(focused ? 1 : 0, {duration: 250});
  }, [focused]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const glowLineStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{scaleX: glow.value}],
  }));

  return (
    <Animated.View style={[styles.fieldContainer, animatedContainerStyle]}>
      <View style={[styles.inputBox, focused && styles.inputBoxFocused]}>
        <FitInput
          errors={errors}
          touched={touched}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
            scale.value = withSpring(1.015, {damping: 14, stiffness: 220});
            if (onFocusCustom) onFocusCustom();
          }}
          onBlur={(e: any) => {
            setFocused(false);
            scale.value = withSpring(1, {damping: 14, stiffness: 220});
            onBlur(e);
          }}
          IconLComp={
            <View
              style={[
                styles.iconBadge,
                focused && styles.iconBadgeFocused,
              ]}>
              <FitIcon
                name={iconName}
                type={iconType}
                size={16}
                color={focused ? AppColor.WHITE : '#9CA3AF'}
              />
            </View>
          }
          w={'90%'}
          bgColor={focused ? '#FFFFFF' : '#F8FAFC'}
          bR={16}
          bW={focused ? 1.8 : 1}
          bColor={focused ? '#FF2A54' : '#E2E8F0'}
          mH={0}
          textInputStyle={{height: 50, fontSize: 15, color: '#0F172A'}}
        />
      </View>
    </Animated.View>
  );
};

const NewLogin = () => {
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [allData, setAllData] = useState({
    email: '',
    insertedEmail: '',
    name: '',
  });
  const lang = getCurrentLanguage();
  const scrollViewRef = useRef<ScrollView>(null);

  const cardOpacity = useSharedValue(0);
  const cardTranslate = useSharedValue(46);

  useEffect(() => {
    cardOpacity.value = withDelay(150, withTiming(1, {duration: 550}));
    cardTranslate.value = withDelay(
      150,
      withSpring(0, {damping: 15, stiffness: 130}),
    );

    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 50);
      },
    );

    return () => {
      keyboardShowListener.remove();
    };
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{translateY: cardTranslate.value}],
  }));

  const handleFormSubmit = (values: Values, action?: FormikHelpers<Values>) => {
    setVisible(false);
    API_CALLS.postLogin(values?.name, values?.email).then((res: any) => {
      if (res?.status && !res?.email) {
        API_CALLS.getUserDataDetails(res?.user_id, lang).then((data: any) => {
          if (data) {
            API_CALLS.getSubscriptionDetails(res?.user_id, lang).then(
              (data2: any) => {
                if (res?.allcompleted) {
                  API_CALLS.getAllWorkouts(res?.user_id, lang);
                  navigate('BottomTab');
                } else if (res?.status) {
                  navigate('Yourself');
                } else if (!res?.term) {
                  navigate('OfferTerms');
                }
              },
            );
          }
        });
      } else {
        showMessage({
          message: `Multiple User with same userID ${res?.email}`,
          type: 'danger',
          floating: true,
        });
        setAllData({
          email: res?.email ?? '',
          insertedEmail: values.email,
          name: values.name,
        });
        setVisible(true);
      }
    });
  };

  const UpdateEmail = () => (
    <Modal visible={visible} onDismiss={() => setVisible(false)}>
      <View style={styles.updateModalContainer}>
        <View style={styles.updateModalContent}>
          <View style={styles.modalHeader}>
            <View style={{width: 25}} />
            <FitText type="Heading" value="Update Email" />
            <FitIcon
              name="close"
              size={25}
              type="MaterialCommunityIcons"
              onPress={() => setVisible(false)}
            />
          </View>
          <FitText
            type="SubHeading"
            fontSize={16}
            lineHeight={20}
            value={
              'You already have a account with ' +
              allData.email +
              '. But you have used ' +
              allData.insertedEmail +
              '. Do you want to use your new Email or continue with default email?'
            }
            marginVertical={10}
          />
          <View style={styles.modalButtons}>
            <FitButton
              onPress={() =>
                handleFormSubmit({name: allData.name, email: allData.email})
              }
              w={'half'}
              titleText="Continue"
              textColor={AppColor.WHITE}
              mH={0}
            />
            <FitButton
              onPress={() =>
                API_CALLS.updateEmailOnLogin(
                  allData.name,
                  allData.email,
                  allData.insertedEmail,
                ).finally(() =>
                  handleFormSubmit({
                    name: allData.name,
                    email: allData.insertedEmail,
                  }),
                )
              }
              w={'half'}
              titleText="Update"
              textColor={AppColor.WHITE}
              bgColor={AppColor.GREEN}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFF1F4" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#FFF1F4', '#FFFFFF']}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              style={styles.heroGradient}>
              {/* Ambient Cyber Particles */}
              <FuturisticParticles />

              <FadeSlideIn delay={60} distance={-8} style={styles.brandRow}>
                <View style={styles.brandBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.brandBadgeText}>FITME</Text>
                </View>
              </FadeSlideIn>

              {/* Futuristic Hero Graphic with Rotating Rings */}
              <FuturisticHeroGraphic />

              <FadeSlideIn delay={280} style={styles.heroTextWrap}>
                <Text style={styles.heading}>{translate('loginheading')}</Text>
                <Text style={styles.subHeading}>
                  {translate('loginsubheading')}
                </Text>
              </FadeSlideIn>
            </LinearGradient>
          </View>

          <Animated.View style={[styles.formCard, cardAnimatedStyle]}>
            <View style={styles.cardHandle} />
            {loader && <ActivityLoader />}
            <Formik
              initialValues={{
                name: '',
                email: '',
              }}
              onSubmit={handleFormSubmit}
              validationSchema={validationSchema}>
              {({
                values,
                handleChange,
                handleSubmit,
                handleBlur,
                errors,
                touched,
              }) => (
                <>
                  <FadeSlideIn
                    delay={420}
                    distance={16}
                    style={styles.inputWrapper}>
                    <PremiumField
                      errors={errors.name}
                      touched={touched.name}
                      placeholder={translate('name')}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      onFocusCustom={handleInputFocus}
                      value={values.name}
                      iconName="user"
                      iconType="AntDesign"
                    />
                  </FadeSlideIn>
                  <FadeSlideIn
                    delay={520}
                    distance={16}
                    style={styles.inputWrapper}>
                    <PremiumField
                      errors={errors.email}
                      touched={touched.email}
                      placeholder={translate('email')}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      onFocusCustom={handleInputFocus}
                      value={values.email}
                      iconName="mail-outline"
                      iconType="MaterialIcons"
                    />
                  </FadeSlideIn>
                  <FadeSlideIn
                    delay={640}
                    distance={16}
                    style={styles.buttonContainer}>
                    <PremiumButton
                      label={translate('letstart')}
                      onPress={() => handleSubmit()}
                    />
                  </FadeSlideIn>
                </>
              )}
            </Formik>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <UpdateEmail />
    </SafeAreaView>
  );
};

export default NewLogin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  heroSection: {
    width: '100%',
  },
  heroGradient: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 36,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particle1: {
    top: 40,
    right: 40,
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 42, 84, 0.12)',
  },
  particle2: {
    top: 180,
    left: -20,
    width: 110,
    height: 110,
    backgroundColor: 'rgba(225, 29, 72, 0.08)',
  },
  particle3: {
    top: 280,
    right: -30,
    width: 130,
    height: 130,
    backgroundColor: 'rgba(255, 176, 155, 0.15)',
  },
  brandRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF2A54',
    marginRight: 8,
  },
  brandBadgeText: {
    fontFamily: Fonts.HELVETICA_BOLD,
    fontSize: 12,
    color: '#FF2A54',
    letterSpacing: 2.5,
    fontWeight: '800',
  },
  graphicWrap: {
    width: DeviceWidth * 0.58,
    height: DeviceWidth * 0.58,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  cyberGlowHalo: {
    position: 'absolute',
    width: DeviceWidth * 0.52,
    height: DeviceWidth * 0.52,
    borderRadius: (DeviceWidth * 0.52) / 2,
    backgroundColor: 'rgba(255, 42, 84, 0.18)',
  },
  techRingOuter: {
    position: 'absolute',
    width: DeviceWidth * 0.58,
    height: DeviceWidth * 0.58,
    borderRadius: (DeviceWidth * 0.58) / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 42, 84, 0.25)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techRingInner: {
    position: 'absolute',
    width: DeviceWidth * 0.52,
    height: DeviceWidth * 0.52,
    borderRadius: (DeviceWidth * 0.52) / 2,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techDotTop: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF2A54',
  },
  techDotBottom: {
    position: 'absolute',
    bottom: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF2A54',
  },
  techDotLeft: {
    position: 'absolute',
    left: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  techDotRight: {
    position: 'absolute',
    right: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
  },
  graphic: {
    width: '82%',
    height: '82%',
    borderRadius: (DeviceWidth * 0.48) / 2,
  },
  heroTextWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  heading: {
    fontFamily: Fonts.HELVETICA_BOLD,
    fontSize: 26,
    color: '#0F172A',
    marginBottom: 6,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subHeading: {
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    backgroundColor: AppColor.WHITE,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -20,
    paddingTop: 16,
    paddingHorizontal: DeviceWidth * 0.05,
    paddingBottom: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: -8},
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  fieldContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputBox: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  inputBoxFocused: {},
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadgeFocused: {
    backgroundColor: '#FF2A54',
  },
  buttonContainer: {
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  premiumButtonWrap: {
    width: DeviceWidth * 0.9,
    alignSelf: 'center',
  },
  premiumButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonGlossLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  premiumButtonText: {
    color: AppColor.WHITE,
    fontSize: 17,
    fontFamily: Fonts.HELVETICA_BOLD,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginRight: 10,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  updateModalContent: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 24,
    padding: 24,
    width: DeviceWidth * 0.9,
    minHeight: 250,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 15},
        shadowOpacity: 0.15,
        shadowRadius: 30,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

