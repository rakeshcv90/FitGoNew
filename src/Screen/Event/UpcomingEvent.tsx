import {
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import ShadowCard from '../../Component/Utilities/ShadowCard';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {useDispatch, useSelector} from 'react-redux';
import FitIcon from '../../Component/Utilities/FitIcon';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {Path, Svg} from 'react-native-svg';
import {ShadowStyle} from '../../Component/Utilities/ShadowStyle';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import {
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {EnteringEventFunction} from './EnteringEventFunction';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import VersionNumber, {appVersion} from 'react-native-version-number';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CountryCurrencies} from '../../Component/Utilities/CountryCurrencies';
import {resolveImportedAssetOrPath} from '../NewWorkouts/Exercise/ExerciseUtilities/Helpers';
import useMusicPlayer from '../NewWorkouts/Exercise/ExerciseUtilities/useMusicPlayer';
import {translate} from '../Translation/TranslationService';

// Reanimated Touch Button Component
const AnimatedTouch = ({onPress, style, children}: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[{width: '100%'}, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.94, {duration: 100});
        }}
        onPressOut={() => {
          scale.value = withSpring(1, {damping: 12, stiffness: 220});
        }}
        style={style}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Pulsing Gift Icon Component
const PulsingGiftIcon = () => {
  const giftScale = useSharedValue(1);

  useEffect(() => {
    giftScale.value = withRepeat(
      withSequence(
        withTiming(1.08, {duration: 800}),
        withTiming(1, {duration: 800}),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: giftScale.value}],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={require('../../Icon/Images/NewHome/gift.png')}
        style={{height: 54, width: 54}}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const UpcomingEvent = ({navigation, route}: any) => {
  const {eventType} = route?.params;

  const dispatch = useDispatch();
  const enteredUpcomingEvent = useSelector(
    (state: any) => state.enteredUpcomingEvent,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getOfferAgreement = useSelector(
    (state: any) => state.getOfferAgreement,
  );
  const [openChange, setOpenChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pause, setPause] = useState(false);

  const PlanPurchasetoBackendAPI = async () => {
    setLoading(true);
    const data = {
      user_id: getUserDataDetails.id,
      plan: getPurchaseHistory?.plan,
      transaction_id: getPurchaseHistory?.transaction_id,
      platform: Platform.OS,
      product_id: getPurchaseHistory?.product_id,
      plan_value: getPurchaseHistory?.plan_value,
    };
    try {
      const res = await axios(`${NewAppapi.EVENT_SUBSCRIPTION_POST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });
      AnalyticsConsole('JO_UP_EVENT');
      setPause(true);
      playMusic();
      if (res.data.message == 'Event created successfully') {
        stopMusic();
        getUserDetailData();
      } else if (
        res.data.message == 'Plan upgraded and new event created successfully'
      ) {
        stopMusic();
        getUserDetailData();
      } else if (
        res.data.message ==
        'Plan upgraded and existing subscription updated successfully'
      ) {
        stopMusic();
        getUserDetailData();
      } else if (
        res.data.message == 'Subscription usage updated successfully'
      ) {
        stopMusic();
        getUserDetailData();
      } else if (
        res.data.message ==
        'You have reached the maximum usage for your current subscription. Please upgrade to a higher plan.'
      ) {
        setLoading(false);
        showMessage({
          message:
            'You have reached the maximum usage for your current subscription. Please upgrade to a higher plan.',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      } else {
        setLoading(false);
        showMessage({
          message: 'Some Issue In Purchase Data!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      }
      setPause(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const {
    duration,
    currentTime,
    pauseMusic,
    playMusic,
    releaseMusic,
    seekTo,
    stopMusic,
  } = useMusicPlayer({
    getSoundOffOn: true,
    pause: pause,
    restStart: false,
    song: resolveImportedAssetOrPath(
      require('../../Icon/Images/Subs_sound.wav'),
    ),
  });
  useEffect(() => {
    return () => releaseMusic();
  }, []);
  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
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
        if (responseData?.data.event_details == 'Not any subscription') {
          setLoading(false);
          setRefresh(false);
          dispatch(setPurchaseHistory([]));
        } else {
          setRefresh(false);
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
          setLoading(false);
        }
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);

      setRefresh(false);
      setLoading(false);
      console.log(error);
    }
  };

  const ChangeModal = () => {
    return (
      <Modal visible={openChange} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              borderRadius: 24,
              backgroundColor: AppColor.WHITE,
              padding: 24,
              width: DeviceWidth * 0.88,
              alignItems: 'center',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 10},
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                },
                android: {
                  elevation: 10,
                },
              }),
            }}>
            <TouchableOpacity
              onPress={() => setOpenChange(false)}
              style={{
                alignSelf: 'flex-end',
                padding: 4,
                marginBottom: 4,
              }}>
              <FitIcon
                name="close"
                size={20}
                type="MaterialCommunityIcons"
                color="#64748B"
              />
            </TouchableOpacity>

            <Image
              source={localImage.ChangePlan}
              resizeMode="contain"
              style={{
                width: 64,
                height: 64,
                alignSelf: 'center',
                marginBottom: 16,
              }}
            />
            {getPurchaseHistory?.used_plan ==
              getPurchaseHistory?.allow_usage && (
              <FitText
                type="Heading"
                value={translate('changePlanTitle')}
                fontSize={18}
                color="#0F172A"
                fontFamily={Fonts.MONTSERRAT_BOLD}
                textAlign="center"
                marginVertical={5}
              />
            )}
            <FitText
              type="normal"
              value={
                getPurchaseHistory?.used_plan <= getPurchaseHistory?.allow_usage
                  ? translate('changePlanDescription')
                  : `You want to change your\n current plan`
              }
              textAlign="center"
              fontSize={14}
              color="#475569"
              lineHeight={22}
              fontFamily={Fonts.MONTSERRAT_MEDIUM}
            />
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                AnalyticsConsole('CH_PLAN_BTN');
                setOpenChange(false);
                if (
                  getPurchaseHistory?.used_plan ==
                  getPurchaseHistory?.allow_usage
                )
                  navigation.navigate('NewSubscription');
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 24,
                backgroundColor: '#FF2A54',
                paddingVertical: 14,
                marginTop: 20,
              }}>
              <FitText
                type="normal"
                value={
                  getPurchaseHistory?.used_plan <=
                  getPurchaseHistory?.allow_usage
                    ? 'OK'
                    : 'Yes'
                }
                color={AppColor.WHITE}
                fontFamily={Fonts.MONTSERRAT_BOLD}
                fontSize={15}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const dayLeft =
    getPurchaseHistory?.upcoming_day_status == 1 &&
    getPurchaseHistory?.event_start_date_upcoming != null
      ? getPurchaseHistory?.event_start_date_upcoming
      : getPurchaseHistory?.event_start_date_current;

  const rawDiffDays =
    getPurchaseHistory?.upcoming_day_status == 1
      ? moment(dayLeft).diff(
          moment()
            .day(getPurchaseHistory?.currentDay || 0)
            .format('YYYY-MM-DD'),
          'days',
        )
      : moment(dayLeft)
          .add(7, 'days')
          .diff(
            moment()
              .day(getPurchaseHistory?.currentDay || 0)
              .format('YYYY-MM-DD'),
            'days',
          );

  const daysLeftText =
    rawDiffDays > 0 ? `${rawDiffDays} days left` : 'Starts Today';

  const currency =
    getOfferAgreement?.location != null
      ? CountryCurrencies[getOfferAgreement?.location]
      : '';

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      />
      <View style={styles.mainContainer}>
        <View style={styles.headerWrapper}>
          <NewHeader1
            backButton
            header={
              eventType == 'upcoming'
                ? translate('upcomingChallenge')
                : translate('myChallenge')
            }
            onBackPress={() => navigation?.navigate('BottomTab')}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: '#F8FAFC'}}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 30,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={getUserDetailData}
              colors={['#FF2A54', '#FF2A54']}
            />
          }>
          {/* Hero Challenge Card */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={styles.heroCard}>
            {/* Top User Greeting & Time Badge */}
            <View style={styles.heroHeaderRow}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FitText
                  value={`Hi ${getUserDataDetails?.name || 'User'}`}
                  type="SubHeading"
                  color="#0F172A"
                  fontWeight="700"
                  fontSize={18}
                  fontFamily={Fonts.MONTSERRAT_BOLD}
                />
                <Text style={{fontSize: 18, marginLeft: 4}}>👋</Text>
              </View>
              {eventType == 'current' && (
                <View style={styles.daysLeftPill}>
                  <FitIcon
                    name="clock-outline"
                    size={14}
                    type="MaterialCommunityIcons"
                    color="#EA580C"
                    mR={4}
                  />
                  <FitText
                    type="SubHeading"
                    value={daysLeftText}
                    color="#EA580C"
                    fontSize={12}
                    fontWeight="700"
                    fontFamily={Fonts.MONTSERRAT_BOLD}
                  />
                </View>
              )}
            </View>

            {/* Starts On Row */}
            <View style={styles.startsOnRow}>
              <View style={styles.calendarIconWrap}>
                <FitIcon
                  name="calendar-month-outline"
                  size={22}
                  type="MaterialCommunityIcons"
                  color="#FF2A54"
                />
              </View>
              <View style={{flex: 1}}>
                <FitText
                  value={translate('startsOn')}
                  type="normal"
                  color="#64748B"
                  fontWeight="600"
                  fontSize={11}
                  fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                />
                <FitText
                  value={
                    getPurchaseHistory?.upcoming_day_status == 1
                      ? `${moment(dayLeft).format('DD-MMM-YYYY')} | Monday`
                      : `${moment(dayLeft)
                          .add(7, 'days')
                          .format('DD-MMM-YYYY')} | Monday`
                  }
                  type="normal"
                  color="#0F172A"
                  fontSize={14}
                  fontWeight="700"
                  fontFamily={Fonts.MONTSERRAT_BOLD}
                />
              </View>
            </View>

            {/* Gift Banner Card with Pulsing Gift Icon */}
            <LinearGradient
              colors={['#FFF1F2', '#FFE4E6', '#FECDD3']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.giftBanner}>
              <PulsingGiftIcon />
              <View style={{marginLeft: 12, flex: 1}}>
                <FitText
                  type="Heading"
                  value={translate('winVoucher')}
                  fontSize={16}
                  color="#9F1239"
                  fontFamily={Fonts.MONTSERRAT_BOLD}
                  fontWeight="700"
                />
                <FitText
                  type="normal"
                  value={translate('earnPrize')}
                  color="#4C0519"
                  fontSize={12}
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  style={{marginTop: 2}}
                />
              </View>
            </LinearGradient>

            {/* Challenge Info Texts */}
            <View
              style={{
                marginVertical: 14,
                alignItems: 'center',
                paddingHorizontal: 4,
              }}>
              <FitText
                type="SubHeading"
                value={
                  eventType == 'upcoming'
                    ? translate('changePlanTitle')
                    : translate('challengeStartsSoon')
                }
                fontFamily={Fonts.MONTSERRAT_BOLD}
                fontWeight="700"
                fontSize={16}
                color="#0F172A"
                textAlign="center"
              />
              <FitText
                type="normal"
                value={
                  eventType == 'upcoming'
                    ? translate('changePlanDescription')
                    : translate('challengeInfo')
                }
                textAlign="center"
                color="#475569"
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
                fontWeight="500"
                fontSize={13}
                marginVertical={6}
                lineHeight={18}
              />

              {/* Note banner with subtle icon */}
              <View style={styles.noteBanner}>
                <FitIcon
                  name="information-outline"
                  size={16}
                  type="MaterialCommunityIcons"
                  color="#64748B"
                  mR={6}
                />
                <FitText
                  type="normal"
                  value={translate('noteVoucher')}
                  textAlign="center"
                  color="#64748B"
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  fontSize={12}
                />
              </View>
            </View>

            {/* Usage Limit Tracker */}
            {getPurchaseHistory?.plan != 'noob' && (
              <View style={styles.usageWrap}>
                <FitIcon
                  name="ticket-percent-outline"
                  size={16}
                  type="MaterialCommunityIcons"
                  color="#FF2A54"
                  mR={6}
                />
                <FitText
                  type="normal"
                  value={translate('allowChance')}
                  textAlign="center"
                  color="#475569"
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  fontWeight="600"
                  fontSize={13}>
                  <FitText
                    type="normal"
                    value={` ${getPurchaseHistory?.used_plan}/${getPurchaseHistory?.allow_usage}`}
                    textAlign="center"
                    color="#FF2A54"
                    fontFamily={Fonts.MONTSERRAT_BOLD}
                    fontWeight="700"
                    fontSize={14}
                  />
                </FitText>
              </View>
            )}

            {/* Join CTA Button with AnimatedTouch */}
            {getPurchaseHistory?.plan != null &&
            getPurchaseHistory?.used_plan < getPurchaseHistory?.allow_usage &&
            eventType == 'upcoming' &&
            getPurchaseHistory?.upcoming_day_status != 1 ? (
              <AnimatedTouch
                onPress={PlanPurchasetoBackendAPI}
                style={styles.joinBtnTouch}>
                <LinearGradient
                  colors={['#FF2A54', '#E11D48']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.joinBtnGradient}>
                  <FitText
                    type="normal"
                    value="Join Now"
                    color="#FFFFFF"
                    fontFamily={Fonts.MONTSERRAT_BOLD}
                    fontWeight="700"
                    fontSize={16}
                    mR={6}
                  />
                  <FitIcon
                    name="arrow-right"
                    size={18}
                    type="MaterialCommunityIcons"
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </AnimatedTouch>
            ) : getPurchaseHistory?.plan != null &&
              getPurchaseHistory?.upcoming_day_status != 1 ? (
              getPurchaseHistory?.used_plan ==
              getPurchaseHistory?.allow_usage ? (
                <View style={styles.limitReachedBox}>
                  <FitIcon
                    name="alert-circle-outline"
                    size={16}
                    type="MaterialCommunityIcons"
                    color="#EF4444"
                    mR={6}
                  />
                  <FitText
                    type="normal"
                    value={translate('reachedLimit')}
                    textAlign="center"
                    color="#EF4444"
                    fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                    fontWeight="600"
                    fontSize={13}
                  />
                </View>
              ) : null
            ) : null}
          </Animated.View>

          {/* Current Plan Details */}
          {getPurchaseHistory?.plan != null && (
            <Animated.View
              entering={FadeInUp.duration(600).delay(150).springify()}
              style={{marginTop: 14}}>
              <FitText
                value={translate('yourPlan')}
                type="SubHeading"
                fontFamily={Fonts.MONTSERRAT_BOLD}
                fontSize={18}
                color="#0F172A"
                marginVertical={8}
              />
              <View style={styles.planCard}>
                <View style={styles.planHeaderRow}>
                  <View
                    style={[
                      styles.planBadgeWrap,
                      getPurchaseHistory?.plan == 'premium'
                        ? styles.premiumBadgeBg
                        : getPurchaseHistory?.plan == 'pro'
                        ? styles.proBadgeBg
                        : styles.basicBadgeBg,
                    ]}>
                    <FitIcon
                      name={
                        getPurchaseHistory?.plan == 'premium' ? 'crown' : 'star'
                      }
                      size={14}
                      type="MaterialCommunityIcons"
                      color={
                        getPurchaseHistory?.plan == 'noob'
                          ? '#2563EB'
                          : getPurchaseHistory?.plan == 'pro'
                          ? '#059669'
                          : '#D97706'
                      }
                      mR={4}
                    />
                    <FitText
                      type="SubHeading"
                      fontSize={13}
                      fontWeight="700"
                      fontFamily={Fonts.MONTSERRAT_BOLD}
                      value={
                        getPurchaseHistory?.plan == 'noob'
                          ? translate('basicPlan')
                          : getPurchaseHistory?.plan == 'pro'
                          ? translate('mediumPlan')
                          : translate('premiumPlan')
                      }
                      color={
                        getPurchaseHistory?.plan == 'noob'
                          ? '#2563EB'
                          : getPurchaseHistory?.plan == 'pro'
                          ? '#059669'
                          : '#D97706'
                      }
                    />
                  </View>

                  {/* Active Status Badge with Live Dot */}
                  <View style={styles.activePill}>
                    <View style={styles.activeDot} />
                    <FitText
                      type="normal"
                      value={translate('active')}
                      color="#059669"
                      fontSize={12}
                      fontWeight="700"
                      fontFamily={Fonts.MONTSERRAT_BOLD}
                    />
                  </View>
                </View>

                {/* Price Display */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    marginVertical: 10,
                  }}>
                  <FitText
                    type="Heading"
                    value={`${currency}${getPurchaseHistory?.plan_value}`}
                    fontSize={28}
                    color="#0F172A"
                    fontFamily={Fonts.MONTSERRAT_BOLD}
                    fontWeight="800"
                  />
                  <FitText
                    type="normal"
                    value="/month"
                    fontSize={14}
                    color="#64748B"
                    fontFamily={Fonts.MONTSERRAT_MEDIUM}
                    style={{marginLeft: 2}}
                  />
                </View>

                <View style={styles.planDivider} />

                {/* Plan Features */}
                <View style={styles.featureRow}>
                  <View style={styles.checkIconWrap}>
                    <FitIcon
                      color="#10B981"
                      name="check"
                      size={13}
                      type="MaterialCommunityIcons"
                    />
                  </View>
                  <FitText
                    type="normal"
                    value={translate('unlockExercises')}
                    color="#334155"
                    fontSize={14}
                    fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  />
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.checkIconWrap}>
                    <FitIcon
                      color="#10B981"
                      name="check"
                      size={13}
                      type="MaterialCommunityIcons"
                    />
                  </View>
                  <FitText
                    type="normal"
                    value={
                      getPurchaseHistory?.plan == 'noob'
                        ? translate('eventsPerMonthBasic')
                        : getPurchaseHistory?.plan == 'pro'
                        ? translate('eventsPerMonthPro')
                        : translate('eventsPerMonthPremium')
                    }
                    color="#334155"
                    fontSize={14}
                    fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  />
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom Actions Bar */}
        {getPurchaseHistory?.plan_value != null && (
          <View style={styles.bottomBar}>
            {getPurchaseHistory?.plan != 'premium' && (
              <AnimatedTouch
                onPress={() =>
                  navigation.navigate('NewSubscription', {upgrade: true})
                }
                style={styles.upgradeBtnTouch}>
                <LinearGradient
                  colors={['#FF2A54', '#E11D48']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.upgradeBtnGradient}>
                  <FitIcon
                    name="crown-outline"
                    size={18}
                    type="MaterialCommunityIcons"
                    color="#FFFFFF"
                    mR={6}
                  />
                  <FitText
                    type="normal"
                    value="Upgrade Plan"
                    color="#FFFFFF"
                    fontFamily={Fonts.MONTSERRAT_BOLD}
                    fontWeight="700"
                    fontSize={15}
                  />
                </LinearGradient>
              </AnimatedTouch>
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                AnalyticsConsole(`CanP_BTN`);
                PLATFORM_IOS
                  ? Linking.openSettings()
                  : Linking.openURL(
                      'https://play.google.com/store/account/subscriptions',
                    );
              }}
              style={styles.cancelBtn}>
              <FitText
                type="normal"
                value={translate('cancelPlan')}
                color="#EF4444"
                fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                fontWeight="600"
                fontSize={14}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ChangeModal />
      <ActivityLoader visible={loading} />
    </SafeAreaView>
  );
};

export default UpcomingEvent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  daysLeftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  startsOnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  calendarIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  noteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  usageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 12,
  },
  joinBtnTouch: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  joinBtnGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitReachedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 8,
  },
  planCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  basicBadgeBg: {
    backgroundColor: '#EFF6FF',
  },
  proBadgeBg: {
    backgroundColor: '#ECFDF5',
  },
  premiumBadgeBg: {
    backgroundColor: '#FFFBEB',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  planDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bottomBar: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  upgradeBtnTouch: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  upgradeBtnGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default UpcomingEvent;
