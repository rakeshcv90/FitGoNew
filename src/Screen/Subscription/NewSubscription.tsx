import {
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import * as RNIap from 'react-native-iap';
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
import {useIsFocused} from '@react-navigation/native';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';
import ActivityLoader from '../../Component/ActivityLoader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import VersionNumber from 'react-native-version-number';
import {findKeyInObject} from '../../Component/Utilities/FindkeyinObject';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import useMusicPlayer from '../NewWorkouts/Exercise/ExerciseUtilities/useMusicPlayer';
import {resolveImportedAssetOrPath} from '../NewWorkouts/Exercise/ExerciseUtilities/Helpers';
import {translate} from '../Translation/TranslationService';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.84;

// Memoized Subscription Card to prevent any render flickering
const PlanCardItem = React.memo(
  ({item, index, isSelected, onSelect, getPurchaseHistory}: any) => {
    const planCap: string = findKeyInObject(
      item,
      PLATFORM_IOS ? 'title' : 'name',
    );
    const temp =
      Platform.OS === 'ios'
        ? []
        : item?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList;
    const price: string =
      index === 2 && Platform.OS === 'android'
        ? temp?.length === 1
          ? temp[0]?.formattedPrice
          : temp[1]?.formattedPrice
        : findKeyInObject(
            item,
            PLATFORM_IOS ? 'localizedPrice' : 'formattedPrice',
          );
    const normalizedPrice = PLATFORM_IOS ? price.replace(/\s/g, '') : price;
    const planName = planCap.toLowerCase();

    const isBasic = planName.includes('noob');
    const isPro = planName.includes('pro');
    const isPremium = !isBasic && !isPro;

    const accentGradients: [string, string] = isBasic
      ? ['#2563EB', '#3B82F6']
      : isPro
      ? ['#059669', '#10B981']
      : ['#667EEA', '#764BA2'];

    const isActive =
      getPurchaseHistory?.plan != null && planName === getPurchaseHistory?.plan;

    // Spring scale & opacity animation
    const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0.94)).current;
    const opacityAnim = useRef(
      new Animated.Value(isSelected ? 1 : 0.88),
    ).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: isSelected ? 1 : 0.94,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: isSelected ? 1 : 0.88,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }, [isSelected]);

    return (
      <Animated.View
        style={{
          transform: [{scale: scaleAnim}],
          opacity: opacityAnim,
        }}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => onSelect(item, index)}
          style={[
            styles.planCard,
            isSelected ? styles.planCardSelected : styles.planCardUnselected,
            isSelected && {borderColor: accentGradients[0]},
          ]}>
          {/* Recommended Badge for Premium */}
          {isPremium && getPurchaseHistory?.plan == null && (
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.popBadge}>
              <FitIcon name="star" type="Ionicons" size={11} color="#FFFFFF" />
              <Text style={styles.popBadgeText}>MOST POPULAR</Text>
            </LinearGradient>
          )}

          {/* Active Badge */}
          {isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE PLAN</Text>
            </View>
          )}

          {/* Icon & Plan Title */}
          <View style={styles.cardHeader}>
            <Image
              source={
                index === 0
                  ? localImage.BasicPlan
                  : index === 1
                  ? localImage.MediumPlan
                  : localImage.PremiumPlan
              }
              resizeMode="contain"
              style={styles.cardIconImg}
            />
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.cardPlanTitle}>
                {isBasic
                  ? translate('basicPlan')
                  : isPro
                  ? translate('mediumPlan')
                  : translate('premiumPlan')}
              </Text>
              <Text style={styles.cardPlanSub}>
                {isBasic
                  ? 'Starter fitness journey'
                  : isPro
                  ? 'Advanced training tools'
                  : 'Complete VIP All-Access'}
              </Text>
            </View>
          </View>

          {/* Price Display */}
          <View style={styles.priceRow}>
            <Text style={styles.priceBig}>
              {PLATFORM_IOS ? normalizedPrice : normalizedPrice.split('.')[0]}
            </Text>
            <Text style={styles.pricePeriod}>/ month</Text>
          </View>

          {/* Features Checklist */}
          <View style={styles.checklistSection}>
            <View style={styles.checkRow}>
              <View
                style={[
                  styles.checkCircle,
                  {backgroundColor: accentGradients[0] + '18'},
                ]}>
                <FitIcon
                  name="checkmark"
                  type="Ionicons"
                  size={13}
                  color={accentGradients[0]}
                />
              </View>
              <Text style={styles.checkText}>
                {isBasic
                  ? translate('eventsPerMonthBasic')
                  : isPro
                  ? translate('eventsPerMonthPro')
                  : translate('eventsPerMonthPremium')}
              </Text>
            </View>

            <View style={styles.checkRow}>
              <View
                style={[
                  styles.checkCircle,
                  {backgroundColor: accentGradients[0] + '18'},
                ]}>
                <FitIcon
                  name="checkmark"
                  type="Ionicons"
                  size={13}
                  color={accentGradients[0]}
                />
              </View>
              <Text style={styles.checkText}>
                {translate('unlockExercises')}
              </Text>
            </View>

            <View style={styles.checkRow}>
              <View
                style={[
                  styles.checkCircle,
                  {backgroundColor: accentGradients[0] + '18'},
                ]}>
                <FitIcon
                  name="checkmark"
                  type="Ionicons"
                  size={13}
                  color={accentGradients[0]}
                />
              </View>
              <Text style={styles.checkText}>
                {isBasic ? 'Standard Support' : 'Priority VIP Support'}
              </Text>
            </View>

            <View style={styles.checkRow}>
              <View
                style={[
                  styles.checkCircle,
                  {backgroundColor: accentGradients[0] + '18'},
                ]}>
                <FitIcon
                  name="checkmark"
                  type="Ionicons"
                  size={13}
                  color={accentGradients[0]}
                />
              </View>
              <Text style={styles.checkText}>
                {isBasic ? 'With Ads' : 'Fewer Ads'}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionBtnWrapper}>
            <LinearGradient
              colors={
                planName.includes(getPurchaseHistory?.plan)
                  ? ['#94A3B8', '#64748B']
                  : accentGradients
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>
                {planName.includes(getPurchaseHistory?.plan)
                  ? translate('purchased')
                  : translate('proceed')}
              </Text>
              {!planName.includes(getPurchaseHistory?.plan) && (
                <FitIcon
                  name="arrow-forward"
                  type="Ionicons"
                  size={17}
                  color="#FFFFFF"
                />
              )}
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const NewSubscription = ({navigation, route}: any) => {
  const {upgrade} = route?.params || {};
  const dispatch = useDispatch();
  const getInAppPurchase = useSelector((state: any) => state.getInAppPurchase);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const order = ['Noob', 'Pro', 'Premium'];

  const sortedSubscriptions: any = useMemo(() => {
    if (!getInAppPurchase || !Array.isArray(getInAppPurchase)) return [];
    return PLATFORM_IOS
      ? [...getInAppPurchase].sort((a: any, b: any) => {
          return order.indexOf(a.title) - order.indexOf(b.title);
        })
      : [...getInAppPurchase].sort((a: any, b: any) => {
          return order.indexOf(a.name) - order.indexOf(b.name);
        });
  }, [getInAppPurchase]);

  const [selected, setSelected] = useState<any>(
    sortedSubscriptions[2] || sortedSubscriptions[0],
  );
  const [loading, setForLoading] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(2);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const [pause, setPause] = useState(false);
  const flatListRef = useRef<any>(null);

  // Pulse animation for Crown badge
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (isFocused) {
      const selectedIndex =
        getPurchaseHistory?.plan != null
          ? getPurchaseHistory?.plan === 'noob'
            ? 0
            : getPurchaseHistory?.plan === 'pro'
            ? 1
            : 2
          : 2;
      setCurrentSelected(selectedIndex);
      EnteringEventFunction(
        dispatch,
        getPurchaseHistory,
        setEnteredCurrentEvent,
        setEnteredUpcomingEvent,
        setPlanType,
      );
    }
  }, [isFocused]);

  useEffect(() => {
    const purchaseUpdateSubscription1 = RNIap.purchaseUpdatedListener(
      async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          await RNIap.finishTransaction({purchase});
        }
      },
    );
    const purchaseErrorSubscription1 = RNIap.purchaseErrorListener(
      (error: any) => {
        if (Platform.OS === 'android') {
          showMessage({
            message: error.message,
            titleStyle: {textAlign: 'center'},
            type: 'danger',
            floating: true,
          });
        } else {
          if (error.responseCode === '2') {
            showMessage({
              message: 'You have cancelled the transaction. Please try again.',
              titleStyle: {textAlign: 'center'},
              type: 'danger',
              floating: true,
            });
          } else {
            showMessage({
              message: error.message,
              titleStyle: {textAlign: 'center'},
              type: 'danger',
              floating: true,
            });
          }
        }
      },
    );
    return () => {
      if (purchaseUpdateSubscription1) {
        purchaseUpdateSubscription1.remove();
      }
      if (purchaseErrorSubscription1) {
        purchaseErrorSubscription1.remove();
      }
    };
  }, []);

  const {playMusic, releaseMusic, stopMusic} = useMusicPlayer({
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

  const purchaseItems = async (items: any) => {
    setForLoading(true);
    try {
      const purchase: any = await RNIap.requestSubscription({
        sku: items.productId,
      });
      if (purchase) {
        validateIOS(purchase.transactionReceipt);
      } else {
        setForLoading(false);
        showMessage({
          message: 'Subscription purchase failed.',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      }
    } catch (error) {
      setForLoading(false);
      showMessage({
        message: 'An error occurred during the purchase.',
        type: 'danger',
        animationDuration: 500,
        floating: true,
      });
    }
  };

  const validateIOS = async (receipt: any) => {
    const receiptBody = {
      'receipt-data': receipt,
      password: '3a00ec90f8b745678daf489417956f40',
    };
    try {
      let result: any = 0;
      const url = __DEV__
        ? 'https://sandbox.itunes.apple.com/verifyReceipt'
        : 'https://buy.itunes.apple.com/verifyReceipt';
      result = await axios(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: receiptBody,
      });

      if (result.data) {
        const renewalHistory = result.data?.pending_renewal_info;
        if (
          renewalHistory[0]?.auto_renew_status === 1 &&
          receipt?.length !== 0
        ) {
          fetchPurchaseHistoryIOS(
            renewalHistory[0],
            result?.data?.latest_receipt_info[0]?.original_purchase_date,
          );
        } else {
          setForLoading(false);
        }
      }
    } catch (error) {
      setForLoading(false);
    }
  };

  const fetchPurchaseHistoryIOS = async (item: any, startDate: any) => {
    const price: string = findKeyInObject(selected, 'localizedPrice').replace(
      /\s/g,
      '',
    );
    let data = {
      user_id: getUserDataDetails.id,
      transaction_id: item.original_transaction_id,
      plan:
        item.auto_renew_product_id === 'fitme_noob'
          ? 'noob'
          : item.auto_renew_product_id === 'fitme_pro'
          ? 'pro'
          : 'premium',
      platform: Platform.OS,
      product_id: item.auto_renew_product_id,
      plan_value: parseInt(price.substring(1), 10),
    };
    PlanPurchasetoBackendAPI(data);
  };

  const purchaseItemsAndroid = async (sku: RNIap.Sku, offerToken: any) => {
    try {
      const purchase: any = await RNIap.requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });
      fetchPurchaseHistoryAndroid(purchase[0].dataAndroid);
    } catch (error) {
      console.log('Failed to purchase Android product', error);
    }
  };

  const fetchPurchaseHistoryAndroid = async (data: any) => {
    setForLoading(true);
    const price: string = findKeyInObject(selected, 'formattedPrice');
    const jsonObject = JSON.parse(data);
    const postData = {
      user_id: getUserDataDetails.id,
      plan:
        jsonObject.productId === 'fitme_monthly'
          ? 'noob'
          : jsonObject.productId === 'a_monthly'
          ? 'pro'
          : 'premium',
      transaction_id: jsonObject.orderId,
      platform: Platform.OS,
      product_id: jsonObject?.productId,
      plan_value: parseInt(price.substring(1), 10),
    };
    PlanPurchasetoBackendAPI(postData);
  };

  const PlanPurchasetoBackendAPI = async (data: Object) => {
    try {
      const res = await axios(`${NewAppapi.EVENT_SUBSCRIPTION_POST}`, {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        data,
      });

      setPause(true);
      playMusic();
      if (
        res.data.message === 'Event created successfully' ||
        res.data.message === 'Plan upgraded and new event created successfully'
      ) {
        getUserDetailData();
        setForLoading(false);
        stopMusic();
        setTimeout(() => {
          navigation.navigate('UpcomingEvent', {eventType: 'current'});
        }, 2500);
      } else if (
        res.data.message ===
        'Plan upgraded and existing subscription updated successfully'
      ) {
        PurchaseDetails();
        setForLoading(false);
        stopMusic();
        setTimeout(() => {
          navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
        }, 2500);
      } else {
        setForLoading(false);
        showMessage({
          message: 'Some Issue In Purchase Data!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      }
      setPause(false);
    } catch (error) {
      setForLoading(false);
    }
  };

  const PurchaseDetails = async () => {
    try {
      const result = await axios({
        url: `${NewAppapi.EVENT_SUBSCRIPTION_GET}/${getUserDataDetails?.id}`,
        params: {version: VersionNumber.appVersion},
        method: 'GET',
      });
      setRefresh(false);
      if (result.data?.message === 'Not any subscription') {
        dispatch(setPurchaseHistory([]));
        setCurrentSelected(2);
        EnteringEventFunction(
          dispatch,
          [],
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
      } else {
        dispatch(setPurchaseHistory(result.data.data));
        upgrade
          ? setCurrentSelected(2)
          : result.data.data?.plan === 'noob'
          ? setCurrentSelected(0)
          : result.data.data?.plan === 'pro'
          ? setCurrentSelected(1)
          : setCurrentSelected(2);
        EnteringEventFunction(
          dispatch,
          result.data?.data,
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
      }
    } catch (error) {
      setRefresh(false);
      dispatch(setPurchaseHistory([]));
    }
  };

  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
      );

      if (
        responseData?.data?.msg ===
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      } else {
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        setRefresh(false);
        if (responseData?.data.event_details === 'Not any subscription') {
          dispatch(setPurchaseHistory([]));
          setCurrentSelected(2);
        } else {
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          responseData?.data?.event_details.plan === 'noob'
            ? setCurrentSelected(0)
            : responseData?.data?.event_details?.plan === 'pro'
            ? setCurrentSelected(1)
            : setCurrentSelected(2);
        }
      }
    } catch (error) {
      setRefresh(false);
    }
  };

  const handlePurchase = useCallback(
    (item: any) => {
      if (getPurchaseHistory?.plan_value != null) {
        const index = getInAppPurchase?.findIndex((p: any) => {
          const price: string = findKeyInObject(
            p,
            PLATFORM_IOS ? 'localizedPrice' : 'formattedPrice',
          );
          return price.includes(getPurchaseHistory?.plan_value);
        });
        if (currentSelected < index) {
          showMessage({
            message: 'You can not downgrade the plan',
            type: 'danger',
            floating: true,
          });
        } else if (
          getPurchaseHistory?.used_plan < getPurchaseHistory?.allow_usage
        ) {
          showMessage({
            message: `You have ${
              getPurchaseHistory?.allow_usage - getPurchaseHistory?.used_plan
            } limit left. Please use them before Purchase new Plan`,
            type: 'danger',
            floating: true,
            duration: 2000,
          });
        } else if (getPurchaseHistory?.upcoming_day_status === 1) {
          showMessage({
            message: `Please wait for your current challenge to start to upgrade your plan and take part in the new challenges.`,
            type: 'danger',
            floating: true,
            duration: 2000,
          });
        } else {
          PLATFORM_IOS
            ? purchaseItems(item)
            : purchaseItemsAndroid(
                item.productId,
                item.subscriptionOfferDetails[0].offerToken,
              );
        }
      } else {
        PLATFORM_IOS
          ? purchaseItems(item)
          : purchaseItemsAndroid(
              item.productId,
              item.subscriptionOfferDetails[0].offerToken,
            );
      }
    },
    [currentSelected, getInAppPurchase, getPurchaseHistory],
  );

  const handleCardSelect = useCallback(
    (item: any, index: number) => {
      setCurrentSelected(index);
      setSelected(item);
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
      if (currentSelected === index) {
        handlePurchase(item);
      }
    },
    [currentSelected, handlePurchase],
  );

  return (
    <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          onPress={() => navigation.goBack()}>
          <ArrowLeft width={30} height={15} fillColor="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{translate('header')}</Text>

        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={() => {
            PlanPurchasetoBackendAPI({
              user_id: getUserDataDetails.id,
              transaction_id: 'free',
              plan: 'free',
              platform: Platform.OS,
              product_id: 'fitme_free',
              plan_value: 0,
            });
          }}>
          <Text style={styles.restoreBtnText}>
            {PLATFORM_IOS ? translate('restorePlan') : translate('managePlan')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={getUserDetailData}
            tintColor="#667EEA"
            colors={['#667EEA', '#764BA2']}
          />
        }>
        {/* Crown Hero Banner with Pulsing Aura */}
        <View style={styles.heroSection}>
          <Animated.View style={{transform: [{scale: pulseAnim}]}}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.heroCrownRing}>
              <FitIcon
                name="crown"
                type="MaterialCommunityIcons"
                size={28}
                color="#FFD700"
              />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.heroTitle}>Unlock Premium Access</Text>
          <Text style={styles.heroSubtitle}>
            Achieve your fitness goals with unlimited workouts & challenges
          </Text>
        </View>

        {/* Segmented Plan Selector Tab Bar */}
        {sortedSubscriptions && sortedSubscriptions.length > 0 && (
          <View style={styles.segmentedTabBar}>
            {sortedSubscriptions.map((item: any, index: number) => {
              const isSelected = currentSelected === index;
              const activeGradient: [string, string] =
                index === 0
                  ? ['#2563EB', '#3B82F6']
                  : index === 1
                  ? ['#059669', '#10B981']
                  : ['#667EEA', '#764BA2'];

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.88}
                  onPress={() => {
                    setCurrentSelected(index);
                    flatListRef.current?.scrollToIndex({
                      index,
                      animated: true,
                    });
                  }}
                  style={styles.segmentTabBtnWrapper}>
                  {isSelected ? (
                    <LinearGradient
                      colors={activeGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.segmentTabBtnActiveGradient}>
                      <FitIcon
                        name={
                          index === 0
                            ? 'flash'
                            : index === 1
                            ? 'shield-checkmark'
                            : 'star'
                        }
                        type="Ionicons"
                        size={13}
                        color="#FFFFFF"
                      />
                      <Text style={styles.segmentTabTextActive}>
                        {index === 0
                          ? translate('basic')
                          : index === 1
                          ? translate('medium')
                          : translate('premium')}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.segmentTabBtnInactive}>
                      <FitIcon
                        name={
                          index === 0
                            ? 'flash-outline'
                            : index === 1
                            ? 'shield-checkmark-outline'
                            : 'star-outline'
                        }
                        type="Ionicons"
                        size={13}
                        color="#64748B"
                      />
                      <Text style={styles.segmentTabTextInactive}>
                        {index === 0
                          ? translate('basic')
                          : index === 1
                          ? translate('medium')
                          : translate('premium')}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Horizontal Subscription Cards Carousel */}
        {sortedSubscriptions && sortedSubscriptions.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={sortedSubscriptions}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={{paddingHorizontal: 20}}
            onMomentumScrollEnd={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (CARD_WIDTH + 16),
              );
              setCurrentSelected(index);
            }}
            initialScrollIndex={currentSelected}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + 16,
              offset: index * (CARD_WIDTH + 16),
              index,
            })}
            renderItem={({item, index}) => (
              <PlanCardItem
                item={item}
                index={index}
                isSelected={currentSelected === index}
                onSelect={handleCardSelect}
                getPurchaseHistory={getPurchaseHistory}
              />
            )}
          />
        )}

        {/* Disclaimer Notes */}
        <View style={styles.disclaimerCard}>
          <FitIcon
            name="information-circle-outline"
            type="Ionicons"
            size={16}
            color="#64748B"
          />
          <Text style={styles.disclaimerText}>
            {currentSelected === 2
              ? Platform.OS === 'android'
                ? translate('noteAndroidPremium')
                : translate('noteIOSPremium')
              : Platform.OS === 'android'
              ? translate('noteAndroidNonPremium')
              : translate('noteIOSNonPremium')}
          </Text>
        </View>

        {/* Terms and Privacy Footer */}
        <View style={styles.footerPolicySection}>
          <Text style={styles.policyText}>
            {translate('acceptterm')}{' '}
            <Text
              onPress={() => {
                navigation.navigate('TermaAndCondition', {
                  title: 'Privacy Policy',
                });
              }}
              style={styles.policyLink}>
              {translate('privacypolicy')}
            </Text>{' '}
            {translate('and')}{' '}
            <Text
              style={styles.policyLink}
              onPress={() => {
                navigation.navigate('TermaAndCondition', {
                  title: 'Terms & Conditions',
                });
              }}>
              {translate('termsOfUse')}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {loading && <ActivityLoader visible={loading} />}
    </Wrapper>
  );
};

export default NewSubscription;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
  },
  backCircleBtn: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 16.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  restoreBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  restoreBtnText: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#667EEA',
  },

  heroSection: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  heroCrownRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 19.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },

  segmentedTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentTabBtnWrapper: {
    flex: 1,
  },
  segmentTabBtnActiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  segmentTabBtnInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  segmentTabTextActive: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 12.5,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  segmentTabTextInactive: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },

  planCard: {
    width: CARD_WIDTH,
    borderRadius: 22,
    padding: 16,
    paddingTop: 20,
    marginRight: 16,
    marginTop: 12,
    marginBottom: 6,
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'visible',
  },
  planCardUnselected: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
  },
  popBadge: {
    position: 'absolute',
    top: -13,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  popBadgeText: {
    fontSize: 9.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  activeBadge: {
    position: 'absolute',
    top: -13,
    right: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  activeBadgeText: {
    fontSize: 9.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  cardIconImg: {
    width: 40,
    height: 40,
  },
  cardPlanTitle: {
    fontSize: 16.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardPlanSub: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 1,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceBig: {
    fontSize: 28,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  pricePeriod: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginLeft: 5,
  },

  checklistSection: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
    marginBottom: 14,
    gap: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  checkText: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#334155',
    flex: 1,
  },

  actionBtnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 12,
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    lineHeight: 15,
    flex: 1,
  },

  footerPolicySection: {
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  policyText: {
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
  },
  policyLink: {
    color: '#667EEA',
    textDecorationLine: 'underline',
  },
});
