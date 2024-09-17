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
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import FitText from '../../Component/Utilities/FitText';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import {ShadowStyle} from '../../Component/Utilities/ShadowStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../../Component/GradientButton';
import {localImage} from '../../Component/Image';
import {showMessage} from 'react-native-flash-message';
import * as RNIap from 'react-native-iap';
import moment from 'moment';
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
import Carousel from 'react-native-snap-carousel';
import ActivityLoader from '../../Component/ActivityLoader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import TrackPlayer, {
  Capability,
  usePlaybackState,
} from 'react-native-track-player';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {findKeyInObject} from '../../Component/Utilities/FindkeyinObject';
import {SafeAreaView} from 'react-native-safe-area-context';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';

const NewSubscription = ({navigation, route}: any) => {
  const {upgrade} = route.params;
  const dispatch = useDispatch();
  const getInAppPurchase = useSelector((state: any) => state.getInAppPurchase);
  const getOfferAgreement = useSelector(
    (state: any) => state.getOfferAgreement,
  );

  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const order = ['Noob', 'Pro', 'Premium'];
  // Sorting the subscriptions by title (Basic, Pro, Premium)
  const sortedSubscriptions: any = PLATFORM_IOS
    ? getInAppPurchase.sort((a: any, b: any) => {
        return order.indexOf(a.title) - order.indexOf(b.title);
      })
    : getInAppPurchase.sort((a: any, b: any) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
  const [selected, setSelected] = useState<any>(sortedSubscriptions[2]);
  const [loading, setForLoading] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(2);
  const [price, setPrice] = useState<any>('');
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const playbackState = usePlaybackState();

  const songs = [
    {
      id: 1,
      url: require('../../Icon/Images/Subs_sound.wav'),
    },
  ];

  useEffect(() => {
    if (isFocused) {
      setupPlayer();
      // PurchaseDetails();
      const selected =
        getPurchaseHistory?.plan != null
          ? getPurchaseHistory?.plan == 'noob'
            ? 0
            : getPurchaseHistory?.plan == 'pro'
            ? 1
            : 2
          : 2;
      setCurrentSelected(selected);
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
        if (Platform.OS == 'android') {
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
  //sound
  const setupPlayer = async () => {
    try {
      await TrackPlayer.add(songs);
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    } catch (error) {
      console.log('Music Player Error Subscription', error);
    }
  };
  const StartAudio = async (playbackState: any) => {
    await TrackPlayer.play();
  };
  const PauseAudio = async (playbackState: any) => {
    await TrackPlayer.reset();
  };
  const restorePurchase = async () => {
    setForLoading(true);
    try {
      const purchases = await RNIap.getAvailablePurchases();

      if (purchases?.length == 0) {
        setForLoading(false);
        showMessage({
          message: 'No Active Subscription Found !',
          type: 'danger',
          animationDuration: 500,

          floating: true,
          // icon: {icon: 'auto', position: 'left'},
        });
      } else {
        if (Platform.OS == 'android') {
          setForLoading(false);
          const activeSubs = purchases.filter(item => {
            if (item?.autoRenewingAndroid == true) {
              setForLoading(false);
              showMessage({
                message: 'Subscription Restored!',
                type: 'success',
                animationDuration: 500,

                floating: true,
                // // icon: {icon: 'auto', position: 'left'},
              });
            } else {
              setForLoading(false);
              showMessage({
                message: 'No Active Subscription Found!',
                type: 'danger',
                animationDuration: 500,

                floating: true,
                // // icon: {icon: 'auto', position: 'left'},
              });
            }
          });
        } else {
          const latestPurchase = purchases[purchases.length - 1];

          const apiRequestBody = {
            'receipt-data': latestPurchase.transactionReceipt,
            password: '3a00ec90f8b745678daf489417956f40',
          };
          try {
            const result = await axios(
              'https://buy.itunes.apple.com/verifyReceipt',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                data: apiRequestBody,
              },
            );

            let timestamp =
              result.data.latest_receipt_info[0].original_purchase_date;

            const [datePart] = timestamp.split(' ');

            setForLoading(false);
            if (result.data) {
              const renewalHistory = result.data.pending_renewal_info;

              const activeSubs = renewalHistory.filter((item: any) => {
                if (item.auto_renew_status == '1') {
                  showMessage({
                    message: 'Subscription Restored',
                    type: 'danger',
                    animationDuration: 500,

                    floating: true,
                    // // icon: {icon: 'auto', position: 'left'},
                  });
                  fetchPurchaseHistoryIOS(renewalHistory[0], datePart);
                } else {
                  showMessage({
                    message: 'No Active Subscription Found!',
                    type: 'danger',
                    animationDuration: 500,

                    floating: true,
                    // // icon: {icon: 'auto', position: 'left'},
                  });
                }
              });
            } else {
              showMessage({
                message: 'No Active Subscription Found!',
                type: 'danger',
                animationDuration: 500,

                floating: true,
                // // icon: {icon: 'auto', position: 'left'},
              });
            }
          } catch (error) {
            showMessage({
              message: 'No Active Subscription Found!',
              type: 'danger',
              animationDuration: 500,

              floating: true,
              // // icon: {icon: 'auto', position: 'left'},
            });
            setForLoading(false);
            console.log(error);
          }
        }
      }
    } catch (err) {
      showMessage({
        message: 'Failed to Restore Subscription',
        type: 'danger',
        animationDuration: 500,

        floating: true,
        // // icon: {icon: 'auto', position: 'left'},
      });
      setForLoading(false);
      console.error(err);
    }
  };
  // PURCHASE START IOS
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
      console.log('Failed to purchase ios product', error);
    }
  };
  const validateIOS = async (receipt: any) => {
    const receiptBody = {
      'receipt-data': receipt,
      password: '3a00ec90f8b745678daf489417956f40',
    };

    try {
      let result: any = 0;
      if (__DEV__) {
        result = await axios('https://sandbox.itunes.apple.com/verifyReceipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: receiptBody,
        });
      } else {
        result = await axios('https://buy.itunes.apple.com/verifyReceipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: receiptBody,
        });
      }

      if (result.data) {
        const renewalHistory = result.data?.pending_renewal_info;

        // setForLoading(false);
        if (renewalHistory[0]?.auto_renew_status == 1 && receipt?.length != 0) {
          fetchPurchaseHistoryIOS(
            renewalHistory[0],
            result?.data?.latest_receipt_info[0]?.original_purchase_date,
          );
        } else {
          console.log('Payment Failed');

          setForLoading(false);
        }
      }
    } catch (error) {
      console.log('Receipt Error', error);
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
        item.auto_renew_product_id == 'fitme_noob'
          ? 'noob'
          : item.auto_renew_product_id == 'fitme_pro'
          ? 'pro'
          : 'premium',
      platform: Platform.OS,
      product_id: item.auto_renew_product_id,
      plan_value: parseInt(price.substring(1)),
      // item.auto_renew_product_id == 'fitme_noob'
      //   ? 30
      //   : item.auto_renew_product_id == 'fitme_pro'
      //   ? 69
      //   : 149,
    };
    PlanPurchasetoBackendAPI(data);
  };

  // PURCHASE START ANDROID
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
  //'fitme_monthly', 'a_month', 'fitme_legend'localizedPrice
  const fetchPurchaseHistoryAndroid = async (data: any) => {
    setForLoading(true);
    const price: string = findKeyInObject(selected, 'formattedPrice');
    const jsonObject = JSON.parse(data);
    const postData = {
      user_id: getUserDataDetails.id,
      plan:
        jsonObject.productId == 'fitme_monthly'
          ? 'noob'
          : jsonObject.productId == 'a_monthly'
          ? 'pro'
          : 'premium',
      transaction_id: jsonObject.orderId,
      platform: Platform.OS,
      product_id: jsonObject?.productId,
      plan_value: parseInt(price.substring(1)),
      // jsonObject.productId == 'fitme_monthly'
      //   ? 30
      //   : jsonObject.productId == 'a_monthly'
      //   ? 69
      //   : 149,
    };

    PlanPurchasetoBackendAPI(postData);
  };

  // Pass Purchased plan to Backend
  const PlanPurchasetoBackendAPI = async (data: Object) => {
    try {
      const res = await axios(`${NewAppapi.EVENT_SUBSCRIPTION_POST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });

      StartAudio(playbackState);
      if (res.data.message == 'Event created successfully') {
        // PurchaseDetails();
        getUserDetailData();
        setForLoading(false);
        PauseAudio(playbackState);
        setTimeout(() => {
          navigation.navigate('UpcomingEvent', {eventType: 'current'});
        }, 2500);
      } else if (
        res.data.message == 'Plan upgraded and new event created successfully'
      ) {
        //  PurchaseDetails();

        getUserDetailData();
        setForLoading(false);
        PauseAudio(playbackState);
        setTimeout(() => {
          navigation.navigate('UpcomingEvent', {eventType: 'current'});
        }, 2500);
      } else if (
        res.data.message ==
        'Plan upgraded and existing subscription updated successfully'
      ) {
        PurchaseDetails();
        setForLoading(false);
        PauseAudio(playbackState);
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
    } catch (error) {
      setForLoading(false);
      console.log('Purchase Store Data Error', error, data);
    }
  };

  const PurchaseDetails = async () => {
    try {
      const result = await axios(
        `${NewAppapi.EVENT_SUBSCRIPTION_GET}/${getUserDataDetails?.id}`,
      );
      setRefresh(false);
      if (result.data?.message == 'Not any subscription') {
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
        console.log(result.data);
        dispatch(setPurchaseHistory(result.data.data));
        upgrade
          ? setCurrentSelected(2)
          : result.data.data?.plan == 'noob'
          ? setCurrentSelected(0)
          : result.data.data?.plan == 'pro'
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
      console.log(error);
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
        setRefresh(false);
        if (responseData?.data.event_details == 'Not any subscription') {
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
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          responseData?.data?.event_details.plan == 'noob'
            ? setCurrentSelected(0)
            : responseData?.data?.event_details?.plan == 'pro'
            ? setCurrentSelected(1)
            : setCurrentSelected(2);
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
        }
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);

      setRefresh(false);
    }
  };

  const RenderItem = ({item, index}: any) => {
    const planCap: string = findKeyInObject(
      item,
      PLATFORM_IOS ? 'title' : 'name',
    );

    const temp =
      Platform.OS == 'ios'
        ? []
        : item?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList;
    const price: string =
      index == 2 && Platform.OS == 'android'
        ? temp?.length == 1
          ? temp[0]?.formattedPrice
          : temp[1]?.formattedPrice
        : findKeyInObject(
            item,
            PLATFORM_IOS ? 'localizedPrice' : 'formattedPrice',
          );

    const normalizedPrice = PLATFORM_IOS ? price.replace(/\s/g, '') : price;

    const planName = planCap.toLowerCase();
    const color = planName.includes('noob')
      ? AppColor.NEW_SUBS_BLUE
      : planName.includes('pro')
      ? AppColor.NEW_SUBS_GREEN
      : AppColor.NEW_SUBS_ORANGE;
    const CheckIcon = () => (
      <Image
        source={localImage.PlanBenifits}
        style={{marginRight: 10, width: 15, height: 15}}
        resizeMode="contain"
        tintColor={color}
      />
    );
    const lowOpacity = getInAppPurchase?.findIndex(
      (item: any) => getPurchaseHistory?.product_id == item?.productId,
    );
    const Line = () => (
      <Text numberOfLines={1} style={{color: '#3333331A'}}>
        {Array(80).fill('- ')}
      </Text>
    );
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          borderColor: color,
          borderRadius: 5,
          borderWidth: 1,
          backgroundColor: AppColor.WHITE,
          justifyContent: 'center',
          alignItems: 'center',
          height: DeviceHeigth <= 640 ? DeviceHeigth * 0.8 : DeviceHeigth * 0.6,
          // !planName.includes('noob') &&
          // !planName.includes('pro') &&
          // !PLATFORM_IOS &&
          // getPurchaseHistory?.plan_value == null
          //   ? DeviceHeigth * 0.65
          //   : DeviceHeigth * 0.55,
          width: '95%',
          alignSelf: 'center',
        }}>
        {getPurchaseHistory?.plan != null &&
          planName == getPurchaseHistory?.plan && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1B8900',
                padding: 5,
                paddingVertical: 2,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                position: 'absolute',
                top: 0,
                right: 5,
              }}>
              <FitText
                type="normal"
                value="Active"
                color={AppColor.WHITE}
                fontSize={12}
                lineHeight={16}
                fontWeight="600"
              />
            </View>
          )}
        <Image
          source={
            index == 0
              ? localImage.BasicPlan
              : index == 1
              ? localImage.MediumPlan
              : localImage.PremiumPlan
          }
          resizeMode="contain"
          style={{
            width: '40%',
            height: '30%',
          }}
        />
        {!planName.includes('noob') &&
          !planName.includes('pro') &&
          getPurchaseHistory?.plan == null && (
            <Image
              source={localImage.RecommendFitme}
              resizeMode="contain"
              style={styles.recommendContainer}
            />
          )}
        <FitText
          type="SubHeading"
          color={color}
          fontSize={18}
          lineHeight={24}
          value={
            planName.includes('noob')
              ? 'Basic plan'
              : planName.includes('pro')
              ? 'Medium plan'
              : 'Premium plan'
          }
          marginVertical={5}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          {/* <FitText
            type="Heading"
            value={
              planName.includes('noob')
                ? '₹99'
                : planName.includes('pro')
                ? '₹199'
                : '₹399'
            }
            fontSize={28}
            lineHeight={34}
            marginVertical={5}
            fontFamily={Fonts.MONTSERRAT_MEDIUM}
            color="#ADADAD"
            textDecorationLine="line-through"
          /> */}

          <FitText
            type="Heading"
            value={` ${
              PLATFORM_IOS ? normalizedPrice : normalizedPrice.split('.')[0]
            }/month`}
            fontSize={28}
            lineHeight={34}
            marginVertical={5}
          />
        </View>
        {!planName.includes('noob') &&
          !planName.includes('pro') &&
          !PLATFORM_IOS &&
          getPurchaseHistory?.plan_value == null && (
            <View
              style={[
                styles.row,
                {
                  width: '90%',
                },
              ]}>
              <CheckIcon />
              <FitText
                type="normal"
                value="3 day free trial"
                color="#333333E5"
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
                marginVertical={3}
              />
            </View>
          )}
        {!planName.includes('noob') &&
          !planName.includes('pro') &&
          !PLATFORM_IOS && <Line />}
        {/* <View
          style={[
            styles.row,
            {
              width: '90%',
            },
          ]}>
          <CheckIcon />
          <FitText
            type="normal"
            value="Winning price ₹1000/-"
            color="#333333E5"
            fontFamily={Fonts.MONTSERRAT_MEDIUM}
            marginVertical={3}
          />
        </View>
        <Line /> */}
        <View
          style={[
            styles.row,
            {
              width: '90%',
            },
          ]}>
          <CheckIcon />
          <FitText
            type="normal"
            value={
              planName.includes('noob')
                ? '1 event/month'
                : planName.includes('pro')
                ? '2 events/month'
                : '3 events/month'
            }
            color="#333333E5"
            fontFamily={Fonts.MONTSERRAT_MEDIUM}
            marginVertical={3}
          />
        </View>
        <Line />
        <View
          style={[
            styles.row,
            {
              width: '90%',
            },
          ]}>
          <CheckIcon />
          <FitText
            type="normal"
            value="Unlock 150+ Exercises"
            color="#333333E5"
            fontFamily={Fonts.MONTSERRAT_MEDIUM}
            marginVertical={3}
          />
        </View>
        <Line />
        <View
          style={[
            styles.row,
            {
              width: '90%',
            },
          ]}>
          <CheckIcon />
          <FitText
            type="normal"
            value={planName.includes('noob') ? 'With Ads' : 'Fewer Ads'}
            color="#333333E5"
            fontFamily={Fonts.MONTSERRAT_MEDIUM}
            marginVertical={3}
          />
        </View>
        {(planName.includes('noob') || planName.includes('pro')) &&
          getPurchaseHistory?.plan_value == null && (
            <View style={{height: 50, width: '100%'}} />
          )}

        <GradientButton
          text={
            planName.includes(getPurchaseHistory?.plan)
              ? 'Purchased'
              : 'Proceed'
          }
          h={50}
          colors={
            planName.includes('noob') || planName.includes('pro')
              ? [AppColor.WHITE, AppColor.WHITE]
              : [color, color]
          }
          textStyle={[
            styles.buttonText,
            {
              color:
                planName.includes('noob') || planName.includes('pro')
                  ? color
                  : AppColor.WHITE,
            },
          ]}
          bC={
            planName.includes('noob') || planName.includes('pro')
              ? color
              : AppColor.WHITE
          }
          alignSelf
          bR={6}
          w={DeviceWidth * 0.8}
          mV={15}
          onPress={() => {
            setSelected(item);
            handlePurchase(item);
            // AnalyticsConsole(`Pur_${item.name}_PLAN`);
            AnalyticsConsole(`Pur_${planName.substring(1)}_PLAN`);
          }}
          // opacity={price.includes(getPurchaseHistory?.plan_value) ? 0.8 : 1}
          disabled={planName.includes(getPurchaseHistory?.plan)}
        />
      </View>
    );
  };
  const handlePurchase = (item: any) => {
    if (getPurchaseHistory?.plan_value != null) {
      const index = getInAppPurchase?.findIndex((item: any) => {
        const price: string = findKeyInObject(
          item,
          PLATFORM_IOS ? 'localizedPrice' : 'formattedPrice',
        );

        return price.includes(getPurchaseHistory?.plan_value);
      });
      if (currentSelected < index) {
        showMessage({
          message: 'You can not downgrade the Plan',
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
      } else if (getPurchaseHistory?.upcoming_day_status == 1) {
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
  };
  const getPrice = (item: any) => {
    const temp =
      Platform.OS == 'ios'
        ? []
        : item?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList;
    const price: string =
      currentSelected == 2 && Platform.OS == 'android'
        ? temp?.length == 1
          ? temp[0]?.formattedPrice
          : temp[1]?.formattedPrice
        : findKeyInObject(
            item,
            PLATFORM_IOS ? 'localizedPrice' : 'formattedPrice',
          );
    const normalizedPrice = PLATFORM_IOS ? price.replace(/\s/g, '') : price;
    return normalizedPrice;
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <StatusBar backgroundColor={AppColor.WHITE} barStyle={'dark-content'} />
      <Wrapper styles={{backgroundColor: AppColor.WHITE}}>
        <NewHeader1 header="Unlock Challenges" backButton />
        <View style={{flex: 1, marginHorizontal: 20, marginTop: 10}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={getUserDetailData}
                colors={[AppColor.NEW_DARK_RED, AppColor.NEW_DARK_RED]}
              />
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <FitText
                value="Challenge Packages"
                type="Heading"
                fontSize={15}
                lineHeight={24}
              />
              <TouchableOpacity
                onPress={() => {
                  PLATFORM_IOS
                    ? restorePurchase()
                    : Linking.openURL(
                        'https://play.google.com/store/account/subscriptions',
                      );
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    color: '#333333',
                    textDecorationLine: 'underline',
                  }}>
                  {PLATFORM_IOS ? 'Restore Plan' : 'Manage Plan'}
                </Text>
              </TouchableOpacity>
            </View>
            {sortedSubscriptions && (
              <Carousel
                data={sortedSubscriptions}
                keyExtractor={(_, index) => index.toString()}
                itemWidth={
                  DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9
                }
                sliderWidth={
                  DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9
                }
                onBeforeSnapToItem={index => setCurrentSelected(index)}
                enableSnap
                activeSlideAlignment="start"
                firstItem={currentSelected}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}: any) => RenderItem({item, index})}
              />
            )}

            <View
              style={[
                styles.tabContainer,
                {
                  height:
                    DeviceHeigth >= 1024
                      ? DeviceHeigth * 0.05
                      : DeviceHeigth >= 640
                      ? DeviceHeigth * 0.06
                      : DeviceHeigth * 0.05,
                },
              ]}>
              {sortedSubscriptions?.map((item: any, index: number) => {
                const isSelected = currentSelected == index;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentSelected(index);
                    }}
                    style={[
                      styles.tabButton,
                      {
                        marginVertical: isSelected ? 0 : 10,
                        height:
                          DeviceHeigth >= 1024
                            ? DeviceHeigth * 0.05
                            : DeviceHeigth >= 640
                            ? DeviceHeigth * 0.06
                            : DeviceHeigth * 0.05,
                        backgroundColor: isSelected
                          ? index == 0
                            ? AppColor.NEW_SUBS_BLUE
                            : index == 1
                            ? AppColor.NEW_SUBS_GREEN
                            : AppColor.NEW_SUBS_ORANGE
                          : 'transparent',
                      },
                    ]}>
                    <Text
                      style={{
                        color: isSelected ? AppColor.WHITE : '#121212B2',
                        fontFamily: isSelected
                          ? Fonts.MONTSERRAT_BOLD
                          : Fonts.MONTSERRAT_MEDIUM,
                        fontSize: 14,
                        lineHeight: 14.63,
                        fontWeight: isSelected ? '600' : '500',
                        marginTop: 5,
                        textAlign: 'center',
                        opacity: isSelected ? 1 : 0.7,
                      }}>
                      {index == 0 ? 'Basic' : index == 1 ? 'Medium' : 'Premium'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: DeviceWidth * 0.9,
                // backgroundColor: '#f5f5f5',
                padding: 10,
                borderRadius: 10,
              }}>
              {currentSelected == 2 ? (
                Platform.OS == 'android' ? (
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '500',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      lineHeight: 16,
                      color: '#333333',
                    }}>
                    Please NOTE: Enjoy the 3-day free trial then you will be
                    charged {getPrice(sortedSubscriptions[currentSelected])}{' '}
                    monthly. You can cancel the subscription before your trial
                    period ends if you do not want to convert to a paid
                    subscription. Your subscription will renew automatically
                    until you cancel the subscription, you can manage or cancel
                    your subscription anytime from the Google Play Store. If you
                    are unsure how to cancel a subscription, please visit the
                    Google Support website. Note that deleting the app does not
                    cancel your subscription.
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '500',
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      lineHeight: 16,
                      color: '#333333',
                    }}>
                    You will be charged{' '}
                    {getPrice(sortedSubscriptions[currentSelected])}{' '}
                    immediately. Your subscription will automatically renew
                    unless auto-renew is turned off 24 hours before the end of
                    the current period. You can manage or cancel your
                    subscription in your iTunes & App Store / Apple ID account
                    settings anytime. If you are unsure how to cancel a
                    subscription, please visit the Apple Support Website. Note
                    that deleting the app does not cancel your subscription.
                  </Text>
                )
              ) : Platform.OS == 'android' ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    lineHeight: 16,
                    color: '#333333',
                  }}>
                  Please NOTE: No Free Trial is available for this plan. You
                  will be charged{' '}
                  {getPrice(sortedSubscriptions[currentSelected])} for monthly
                  immediately. Your subscription will renew automatically until
                  you cancel the subscription, you can manage or cancel your
                  subscription anytime from the Google Play Store. If you are
                  unsure how to cancel a subscription, please visit the Google
                  Support website. Note that deleting the app does not cancel
                  your subscription.
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    lineHeight: 16,
                    color: '#333333',
                  }}>
                  You will be charged{' '}
                  {getPrice(sortedSubscriptions[currentSelected])} immediately.
                  Your subscription will automatically renew unless auto-renew
                  is turned off 24 hours before the end of the current period.
                  You can manage or cancel your subscription in your iTunes &
                  App Store / Apple ID account settings anytime. If you are
                  unsure how to cancel a subscription, please visit the Apple
                  Support Website. Note that deleting the app does not cancel
                  your subscription.
                </Text>
              )}
            </View>
            <View
              style={{
                alignSelf: 'center',
                width: DeviceWidth * 0.9,
                paddingBottom: 20,
                paddingHorizontal: 10,
              }}>
              <Text style={styles.policyText}>
                By continuing you accept our{' '}
                <Text
                  onPress={() => {
                    navigation.navigate('TermaAndCondition', {
                      title: 'Privacy & Policy',
                    });
                  }}
                  style={styles.policyText1}>
                  Privacy Policy
                </Text>{' '}
                and
                <Text
                  style={styles.policyText1}
                  onPress={() => {
                    navigation.navigate('TermaAndCondition', {
                      title: 'Terms & Condition',
                    });
                  }}>
                  {' '}
                  Terms of use
                </Text>{' '}
              </Text>
            </View>
          </ScrollView>
        </View>
        {loading && <ActivityLoader visible={loading} />}
      </Wrapper>
    </SafeAreaView>
  );
};

export default NewSubscription;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
  },
  triangle: {
    width: 0,
    height: 0,
    // borderLeftWidth: 20,
    borderRightWidth: 50,
    borderBottomWidth: 50,
    top: -25,
    right: -5,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white', // Change to your desired color
  },
  recommendContainer: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderTopRightRadius: 5,
  },
  policyText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#333333',
    fontFamily: 'Poppins',
  },
  policyText1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#333333',
    textDecorationLine: 'underline',
  },
  tabContainer: {
    flexDirection: 'row',
    height: DeviceWidth * 0.15,
    backgroundColor: AppColor.WHITE,
    borderRadius: 50,
    marginVertical: 20,
    width: DeviceWidth * 0.88,
    alignSelf: 'center',
    shadowColor: '#121212B2',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 50,
  },
  nextButton: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
