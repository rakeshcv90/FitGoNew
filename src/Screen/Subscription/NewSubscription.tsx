import {
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
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
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setPlanType,
  setPurchaseHistory,
} from '../../Component/ThemeRedux/Actions';
import {useIsFocused} from '@react-navigation/native';
import {EnteringEventFunction} from '../Event/EnteringEventFunction';

const NewSubscription = ({navigation}: any) => {
  const dispatch = useDispatch();
  const getInAppPurchase = useSelector((state: any) => state.getInAppPurchase);
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  // Sorting the subscriptions by title (Basic, Pro, Premium)
  const sortedSubscriptions: [] = PLATFORM_IOS
    ? getInAppPurchase.sort((a: any, b: any) => {
        const order = ['Basic Plan', 'Pro plan', 'Premium Plan'];
        return order.indexOf(a.title) - order.indexOf(b.title);
      })
    : getInAppPurchase.sort((a: any, b: any) => {
        const order = ['Monthly', 'Month', 'Premium'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
  const [selected, setSelected] = useState<any>(sortedSubscriptions[2]);
  const [loading, setForLoading] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const findKeyInObject = (obj: any, keyToFind: string): any => {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }

    if (obj.hasOwnProperty(keyToFind)) {
      return obj[keyToFind];
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const result = findKeyInObject(obj[key], keyToFind);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (isFocused) {
      PurchaseDetails();
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
      // setForLoading(false);
      // console.log("dshdhdhdhdhd",purchase)
      if (purchase) {
        // setPlan(purchase);
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
    // const purchases = await RNIap.getAvailablePurchases();
    // const latestPurchase = purchases[purchases.length - 1];

    const receiptBody = {
      'receipt-data': receipt,
      password: '3a00ec90f8b745678daf489417956f40',
    };

    try {
      const result = await axios(
        'https://sandbox.itunes.apple.com/verifyReceipt',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: receiptBody,
        },
      );

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
    }
  };
  const fetchPurchaseHistoryIOS = async (item: any, startDate: any) => {
    const price: string = findKeyInObject(selected, 'localizedPrice');
    const normalizedPrice = price.replace(/\s/g, '');
    let data = {
      user_id: getUserDataDetails.id,
      transaction_id: item.original_transaction_id,
      plan:
        item.auto_renew_product_id == 'fitme_noob'
          ? 'noob'
          : item.auto_renew_product_id == 'fitme_pro'
          ? 'pro'
          : 'legend',
      platform: Platform.OS,
      product_id: selected?.productId,
      plan_value: parseInt(normalizedPrice.split('₹')[1]),
    };
    PlanPurchasetoBackendAPI(data);
  };

  // PURCHASE START ANDROID
  const purchaseItemsAndroid = async (sku: RNIap.Sku, offerToken: any) => {
    setForLoading(true);
    try {
      const purchase: any = await RNIap.requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });

      fetchPurchaseHistoryAndroid(purchase[0].dataAndroid);
    } catch (error) {
      setForLoading(false);
      console.log('Failed to purchase Android product', error);
    }
  };
  //'fitme_monthly', 'a_month', 'fitme_legend'localizedPrice
  const fetchPurchaseHistoryAndroid = async (data: any) => {
    const price: string = findKeyInObject(selected, 'formattedPrice');
    const normalizedPrice = price.replace(/\s/g, '');
    const jsonObject = JSON.parse(data);
    const postData = {
      user_id: getUserDataDetails.id,
      plan:
        jsonObject.productId == 'fitme_monthly'
          ? 'noob'
          : jsonObject.productId == 'a_monthly'
          ? 'pro'
          : 'legend',
      transaction_id: jsonObject.orderId,
      platform: Platform.OS,
      product_id: selected?.productId,
      plan_value:
        jsonObject.productId == 'fitme_legend'
          ? 399
          : parseInt(normalizedPrice.split('₹')[1]),
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

      if (res.data.message == 'Event created successfully') {
        PurchaseDetails();
        setForLoading(false);
      } else {
        setForLoading(false);
        showMessage({
          message: 'Some Issue In Puchase Data!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      }
      navigation.navigate('UpcomingEvent');
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
        dispatch(setPurchaseHistory(result.data.data));
        const findIndex = getInAppPurchase?.findIndex(
          (item: any) => result.data?.data?.product_id == item?.productId,
        );
        findIndex == -1 ? setCurrentSelected(2) : setCurrentSelected(findIndex);
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
  const renderItem = useMemo(
    () =>
      ({item, index}: any) => {
        const price: string = findKeyInObject(
          item,
          PLATFORM_IOS ? 'localizedPrice' : 'formattedPrice',
        );
        const normalizedPrice = price.replace(/\s/g, '');
        const CheckIcon = () => (
          <Icon
            name="check"
            color={AppColor.NEW_DARK_RED}
            size={15}
            style={{marginRight: 10}}
          />
        );
        const lowOpacity = getInAppPurchase?.findIndex(
          (item: any) => getPurchaseHistory?.product_id == item?.productId,
        );
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setCurrentSelected(index);
              setSelected(item);
            }}
            style={{
              padding: 10,
              paddingHorizontal: 15,
              marginVertical: 10,
              borderColor:
                currentSelected == index
                  ? AppColor.NEW_DARK_RED
                  : AppColor.BORDER_COLOR,
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor: AppColor.WHITE,
              opacity: index < lowOpacity ? 0.7 : 1,
              shadowColor: 'grey',
              ...Platform.select({
                ios: {
                  //shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 3,
                },
              }),
            }}>
            {!normalizedPrice.includes('₹99') &&
              !normalizedPrice.includes('₹199') &&
              getPurchaseHistory?.length == 0 && (
                <Image
                  source={localImage.RecommendFitme}
                  resizeMode="contain"
                  style={styles.recommendContainer}
                />
              )}
            <FitText
              type="SubHeading"
              errorType
              fontSize={18}
              lineHeight={24}
              value={
                normalizedPrice.includes('₹99')
                  ? 'Basic plan'
                  : normalizedPrice.includes('₹199')
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
              }}>
              <FitText
                type="Heading"
                value={`${normalizedPrice}/month`}
                fontSize={28}
                lineHeight={34}
                marginVertical={5}
              />
              {getPurchaseHistory?.product_id &&
                normalizedPrice.includes(`${getPurchaseHistory?.plan_value}.00`) && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#0A684733',
                      padding: 5,
                      paddingVertical: 2,
                      borderRadius: 5,
                    }}>
                    <FitText
                      type="normal"
                      value="Active"
                      color={AppColor.GREEN}
                      fontSize={12}
                      lineHeight={16}
                      fontWeight="600"
                    />
                  </View>
                )}
            </View>
            <Text numberOfLines={1} style={{color: '#3333331A'}}>
              {Array(100).fill('- ')}
            </Text>
            {!normalizedPrice.includes('₹99') &&
              !normalizedPrice.includes('₹199') &&
              !PLATFORM_IOS && (
                <View style={styles.row}>
                  <CheckIcon />
                  <FitText
                    type="normal"
                    value="3 day free trial"
                    color="#333333E5"
                    marginVertical={3}
                  />
                </View>
              )}
            <View style={styles.row}>
              <CheckIcon />
              <FitText
                type="normal"
                value="Winning price 1000/-"
                color="#333333E5"
                marginVertical={3}
              />
            </View>
            <View style={styles.row}>
              <CheckIcon />
              <FitText
                type="normal"
                value={
                  normalizedPrice.includes('₹99')
                    ? '1 event/month'
                    : normalizedPrice.includes('₹199')
                    ? '2 event/month'
                    : '3 event/month'
                }
                color="#333333E5"
                marginVertical={3}
              />
            </View>
            <View style={styles.row}>
              <CheckIcon />
              <FitText
                type="normal"
                value={
                  normalizedPrice.includes('₹99')
                    ? 'With Ads'
                    : normalizedPrice.includes('₹199')
                    ? 'Fewer Ads'
                    : 'No Ads'
                }
                color="#333333E5"
                marginVertical={3}
              />
            </View>
          </TouchableOpacity>
        );
      },
    [getPurchaseHistory, currentSelected],
  );
  const Test = () => {
    return (
      <View
        style={{
          width: DeviceWidth * 0.905,
          backgroundColor:
            currentSelected == 0
              ? 'red'
              : currentSelected == 1
              ? 'blue'
              : 'green',
          height: 200,
          borderTopRightRadius: currentSelected == 2 ? 0 : 10,
          borderTopLeftRadius: currentSelected == 0 ? 0 : 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <Text>OPENED</Text>
      </View>
    );
  };
  const handlePurchase = () => {
    if (getPurchaseHistory) {
      const index = getInAppPurchase?.findIndex(
        (item: any) => getPurchaseHistory?.product_id == item?.productId,
      );
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
      } else {
        PLATFORM_IOS
          ? purchaseItems(selected)
          : purchaseItemsAndroid(
              selected.productId,
              selected.subscriptionOfferDetails[0].offerToken,
            );
      }
    } else {
      PLATFORM_IOS
        ? purchaseItems(selected)
        : purchaseItemsAndroid(
            selected.productId,
            selected.subscriptionOfferDetails[0].offerToken,
          );
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader
        header="Choose Your Plan"
        paddingTop={
          Platform.OS == 'android' ? DeviceHeigth * 0.02 : DeviceHeigth * 0.025
        }
        h={Platform.OS == 'ios' ? DeviceWidth * 0.15 : DeviceWidth * 0.15}
        shadow
      />
      <View style={{flex: 1, margin: 16}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={PurchaseDetails}
              colors={[AppColor.NEW_DARK_RED, AppColor.NEW_DARK_RED]}
            />
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <FitText
              value="Subscription Plans"
              type="Heading"
              fontSize={16}
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
                }}>
                {PLATFORM_IOS ? 'Restore Purchase' : 'Manage Subscription'}
              </Text>
            </TouchableOpacity>
          </View>
          {sortedSubscriptions &&
            sortedSubscriptions?.map((item: any, index: number) =>
              renderItem({item, index}),
            )}
          <GradientButton
            text="Proceed"
            h={50}
            colors={[AppColor.NEW_DARK_RED, AppColor.NEW_DARK_RED]}
            textStyle={styles.buttonText}
            alignSelf
            bR={6}
            w={DeviceWidth * 0.9}
            mV={15}
            onPress={handlePurchase}
            opacity={
              getPurchaseHistory?.product_id != selected?.productId ? 1 : 0.8
            }
            disabled={getPurchaseHistory?.product_id == selected?.productId}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: DeviceWidth * 0.9,
              backgroundColor: '#f5f5f5',
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                lineHeight: 16,
                color: '#333333',
              }}>
              {/* {Platform.OS == 'android'
                ? `You can cancel your subscription anytime from Google Play Store. On Cancellation Payment is Non-Refundable, but you still access the features of subscription period. We recommend you to review the terms of use before proceeding with any online transaction.`
                : `Payment is Non-Refundable. We recommend you to review the terms of use before proceeding with any online transaction`} */}
              Payment is Non-Refundable. We recommended you to review the terms
              of use before proceeding with online transation
            </Text>
          </View>
          <View
            style={{
              marginVertical: 15,
              alignSelf: 'center',
              width: '90%',
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
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{marginRight: 5}}
              onPress={() => setCurrentSelected(0)}>
              <View
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: currentSelected == 0 ? 0 : 10,
                  borderBottomRightRadius: currentSelected == 0 ? 0 : 10,
                  height: 100,
                  backgroundColor: 'red',
                  width: DeviceWidth / 4,
                }}
              />
              <View
                style={{
                  backgroundColor: currentSelected == 0 ? 'red' : 'white',
                  width: DeviceWidth / 4,
                  height: 10,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{}} onPress={() => setCurrentSelected(1)}>
              <View
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: currentSelected == 1 ? 0 : 10,
                  borderBottomRightRadius: currentSelected == 1 ? 0 : 10,
                  height: 100,
                  backgroundColor: 'blue',
                  width: DeviceWidth / 4,
                }}
              />
              <View
                style={{
                  backgroundColor: currentSelected == 1 ? 'blue' : 'white',
                  width: DeviceWidth / 4,
                  height: 10,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 5}}
              onPress={() => setCurrentSelected(2)}>
              <View
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: currentSelected == 2 ? 0 : 10,
                  borderBottomRightRadius: currentSelected == 2 ? 0 : 10,
                  height: 100,
                  backgroundColor: 'green',
                  width: DeviceWidth / 4,
                }}
              />
              <View
                style={{
                  backgroundColor: currentSelected == 2 ? 'green' : 'white',
                  width: DeviceWidth / 4,
                  height: 10,
                }}
              />
            </TouchableOpacity>
          </View>
          <Test /> */}
        </ScrollView>
      </View>
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
});
