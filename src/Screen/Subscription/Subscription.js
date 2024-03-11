import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  Alert,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Linking,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppColor} from '../../Component/Color';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import NewHeader from '../../Component/Headers/NewHeader2';
import {SliderBox} from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {Image} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Button from '../../Component/Button';
import {useDispatch, useSelector} from 'react-redux';
import * as RNIap from 'react-native-iap';
import axios from 'axios';
import {setPurchaseHistory} from '../../Component/ThemeRedux/Actions';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Bulb from '../Yourself/Bulb';
import moment from 'moment';
import ActivityLoader from '../../Component/ActivityLoader';
import {ReviewApp} from '../../Component/ReviewApp';

const Subscription = ({navigation}) => {
  const dispatch = useDispatch();
  const getInAppPurchase = useSelector(state => state.getInAppPurchase);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);
  const [selectedItems, setSelectedItems] = useState(getInAppPurchase[2]);
  let isFocuse = useIsFocused();
  const [visible, setVisible] = React.useState(false);
  const [successful, setSuccessful] = useState(false);

  const [forLoading, setForLoading] = useState(false);

  const data = [
    require('../../Icon/Images/NewImage/Sub1.gif'),

    require('../../Icon/Images/NewImage/Sub2.gif'),
    require('../../Icon/Images/NewImage/Sub3.gif'),
  ];

  // useEffect(async () => {
  //   const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //     async purchase => {
  //       const purchases = await RNIap.getAvailablePurchases();

  //       if (purchase.purchaseState === 'cancelled') {
  //         Alert('Payment cancelled by user');
  //
  //       }
  //     },
  //   );
  //   const purchaseErrorSubscription = RNIap.purchaseErrorListener(error =>
  //
  //   );

  //   // purchaseUpdateSubscription.remove();
  //   // purchaseUpdateSubscription.add();

  //   return () => {
  //     purchaseErrorSubscription.remove();
  //     purchaseUpdateSubscription.remove();
  //   };
  // }, []);

  useEffect(()=>{
    if(isFocuse){
      PurchaseDetails(getUserDataDetails.id, getUserDataDetails.login_token);
    }
  },[isFocuse])
  // useEffect(() => {
  //   const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //     async purchase => {},
  //   );
  //   const purchaseErrorSubscription = RNIap.purchaseErrorListener(
  //     error => {
  //       if (error['responseCode'] === '2') {
  //         Alert('Error', 'Payment cancelled by user');
  //       } else {
  //         Alert(
  //           'Error',
  //           'There has been an reeoe with  your purchase ,error code= ' + error,
  //         );
  //       }
  //     },
  //
  //   );
  //   return () => {
  //     purchaseUpdateSubscription.remove();
  //     purchaseErrorSubscription.remove();
  //   };
  // }, []);
  const validateIOS = async receipt => {
    // const purchases = await RNIap.getAvailablePurchases();
    // const latestPurchase = purchases[purchases.length - 1];

    const receiptBody = {
      'receipt-data': receipt,
      password: '3a00ec90f8b745678daf489417956f40',
    };

    try {
      const result = await axios('https://buy.itunes.apple.com/verifyReceipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: receiptBody,
      });

      if (result.data) {
        const renewalHistory = result.data?.pending_renewal_info;

        setForLoading(false);
        if (renewalHistory[0]?.auto_renew_status == 1 && receipt?.length != 0) {
          fetchPurchaseHistory1(
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
  // const validateAndroid = async receipt => {
  //   try {
  //     const response = await RNIap.validateReceiptAndroid({
  //       packageName: receipt.packageName,
  //       productId: receipt.productId,
  //       productToken: receipt.purchaseToken,
  //       accessToken: '456f3be6f242b51399d565d417b3ab81f9d13d08',
  //       isSub: true,
  //     });

  //   } catch (error) {
  //     console.log('Receipt Error Android', error);
  //   }
  // };
  const purchaseItems = async items => {
    setForLoading(true);
    try {
      const purchase = await RNIap.requestSubscription({
        sku: items.productId,
      });
      // setForLoading(false);
      // console.log("dshdhdhdhdhd",purchase)
      if (purchase) {
        // setPlan(purchase);
        validateIOS(purchase.transactionReceipt);
      } else {
        setForLoading(false);
        Alert.alert('Error', 'Subscription purchase failed.');
      }
    } catch (error) {
      setForLoading(false);
      Alert.alert('Error', 'An error occurred during the purchase.');
      console.log('Failed to purchase ios product', error);
    }
  };
  const purchaseItems1 = async (sku, offerToken) => {
    setForLoading(true);
    try {
      const purchase = await RNIap.requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });

      fetchPurchaseHistory(purchase[0].dataAndroid);

      // validateAndroid(purchase[0]?.dataAndroid);
    } catch (error) {
      setForLoading(false);
      console.log('Failed to purchase Android product', error);
    }
  };
  const fetchPurchaseHistory = async data => {
    const jsonObject = JSON.parse(data);
    const data111 = {
      user_id: getUserDataDetails.id,
      planname:
        jsonObject.productId == 'fitme_monthly'
          ? 'Monthly'
          : jsonObject.productId == 'fitme_quarterly'
          ? 'Quarterly'
          : 'Yearly',
      transaction_id: jsonObject.orderId,
      planid: jsonObject.productId,
      startdate: moment().format('YYYY-MM-DD'),
      platform: Platform.OS,
      planstatus: 'Active',
    };

    try {
      const res = await axios(`${NewAppapi.Transctions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails.id,
          planname:
            jsonObject.productId == 'fitme_monthly'
              ? 'Monthly'
              : jsonObject.productId == 'fitme_quarterly'
              ? 'Quarterly'
              : 'Yearly',
          transaction_id: jsonObject.orderId,
          planid: jsonObject.productId,
          startdate: moment().format('YYYY-MM-DD'),
          platform: Platform.OS,
          planstatus: 'Active',
        },
      });

      if (res.data.status == 'transaction completed') {
        PurchaseDetails(getUserDataDetails.id, getUserDataDetails.login_token);
        setForLoading(false);
      } else {
        setForLoading(false);
        showMessage({
          message: 'Some Issue In Puchase Data!',
          type: 'danger',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      console.log('Purchase Store Data Error', error);
    }
  };
  const fetchPurchaseHistory1 = async (item, startDate) => {
    let timestamp = startDate;
    const [datePart] = timestamp.split(' ');

    try {
      const res = await axios(`${NewAppapi.Transctions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails.id,
          startdate: datePart,
          planname:
            item.auto_renew_product_id == 'fitme_monthly'
              ? 'Monthly'
              : item.auto_renew_product_id == 'fitme_quarterly'
              ? 'Quarterly'
              : 'Yearly',
          transaction_id: item.original_transaction_id,
          planid: item.auto_renew_product_id,
          planstatus: 'Active',
          platform: Platform.OS,
        },
      });
      if (res.data.status == 'transaction completed') {
        setForLoading(false);
        setVisible(true);
        setSuccessful('successfulPurchase');
        PurchaseDetails(getUserDataDetails.id, getUserDataDetails.login_token);
      } else {
        setForLoading(false);
        showMessage({
          message: 'Some Issue In Puchase Data!',
          type: 'danger',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      console.log('Purchase Store Data Error', error);
    }
  };
  const getName = item => {
    console.log('DGDFDFDFDFFD', item.productId);
    if (getPurchaseHistory.length > 0) {
      if (Platform.OS == 'android') {
        if (
          item.productId == getPurchaseHistory[0].plan_id &&
          getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
        ) {
          return 'Active Plan';
        } else {
          // return 'Active Plan';
        }
      } else {
        if (
          item.productId == getPurchaseHistory[0].plan_id &&
          getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
        ) {
          return 'Active Plan';
        } else {
          // return 'Not Active Plan';
        }
      }
    } else {
      // return 'Active Plan';
    }
  };
  const puchasePackage = item => {
    if (item.length > 0 || item.length == undefined) {
      if (Platform.OS == 'ios') {
        purchaseItems(item);
      } else {
        purchaseItems1(
          item.productId,
          item.subscriptionOfferDetails[0].offerToken,
        );
      }
    } else {
      showMessage({
        message: 'Please Select Package!',
        type: 'danger',
        animationDuration: 500,

        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  const PurchaseDetails = async (id, login_token) => {
    try {
      const res = await axios(`${NewAppapi.TransctionsDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: id,
          token: login_token,
        },
      });
      console.log('Dddd4454545454554', res.data.data);
      if (res?.data?.data?.length > 0) {
        dispatch(setPurchaseHistory(res.data.data));
        setForLoading(false);
        // setVisible(true);
        // setSuccessful('successfulPurchase');
      } else if (res?.data?.msg == 'Invalid Token') {
        showMessage({
          message: 'Please Login Again!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setPurchaseHistory([]));
      }
    } catch (error) {
      dispatch(setPurchaseHistory([]));
      console.log('Purchase List Error', error);
    }
  };

  const getMonthData = item => {
    if (Platform.OS == 'ios') {
      if (item.title == 'Monthly') {
        return 1;
      } else if (item.title == 'Quarterly') {
        return 3;
      } else {
        return 12;
      }
    } else {
      if (item.name == 'Monthly') {
        return 1;
      } else if (item.name == 'Quarterly') {
        return 3;
      } else {
        return 12;
      }
    }
  };
  const getPriceDetails = item => {
    if (Platform.OS == 'ios') {
      if (item.title == 'Yearly') {
        return (item.price / 12).toFixed(2) + '/' + 'Per Month';
      } else if (item.title == 'Quarterly') {
        return (item.price / 3).toFixed(2) + '/' + 'Per Month';
      } else {
        return null;
      }
      // item.price
    } else {
      let price = 0;
      if (item.name == 'Yearly') {
        if (
          item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList
            .length == 1
        ) {
          price = parseInt(
            item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
              ?.priceAmountMicros,
          );
        } else {
          price = parseInt(
            item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[1]
              ?.priceAmountMicros,
          );
        }

        return (price / 1000000 / 12).toFixed(2) + '/' + 'Per  Month';
      } else if (item.name == 'Quarterly') {
        let price = parseInt(
          item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
            ?.priceAmountMicros,
        );

        return (price / 1000000 / 3).toFixed(2) + '/' + 'Per Month';
      } else {
        return <View style={{width: 100}}></View>;
      }
    }
  };
  restorePucrchase = async () => {
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
          icon: {icon: 'auto', position: 'left'},
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
                icon: {icon: 'auto', position: 'left'},
              });
            } else {
              setForLoading(false);
              showMessage({
                message: 'No Active Subscription Found!',
                type: 'danger',
                animationDuration: 500,

                floating: true,
                icon: {icon: 'auto', position: 'left'},
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

              const activeSubs = renewalHistory.filter(item => {
                if (item.auto_renew_status == '1') {
                  Alert.alert('Success', 'Subscription Restored');
                  fetchPurchaseHistory1(renewalHistory[0], datePart);
                } else {
                  showMessage({
                    message: 'No Active Subscription Found!',
                    type: 'danger',
                    animationDuration: 500,

                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                }
              });
            } else {
              Alert.alert('Success', 'No Active Subscription Found');
            }
          } catch (error) {
            showMessage({
              message: 'No Active Subscription Found!',
              type: 'danger',
              animationDuration: 500,

              floating: true,
              icon: {icon: 'auto', position: 'left'},
            });
            setForLoading(false);
            console.log(error);
          }
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to Restore Subscription');
      setForLoading(false);
      console.error(err);
    }
  };

  const ModalPoup = ({visible, typeData}) => {
    const [showModal, setShowModal] = React.useState(visible);

    return (
      <Modal transparent visible={showModal}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <ImageBackground
              source={
                typeData == 'successfulPurchase'
                  ? localImage.PaymentSucc
                  : localImage.PaymentFaikd
              }
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'flex-end',
                alignSelf: 'center',
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={
                  typeData == 'successfulPurchase'
                    ? ['#00DD75', '#00AE5F']
                    : ['#D01818', '#941000']
                }
                style={styles.buttonStyle}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={() => {
                    setVisible(false);
                  }}>
                  <Text style={styles.button1}>OK</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    );
  };
  const getRecommended = item => {
    if (
      Platform.OS == 'android' &&
      getPurchaseHistory.length <= 0 &&
      item.name == 'Yearly'
    ) {
      return (
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={{
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 5,
          }}
          colors={['#00DF76', '#00AB5E']}>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '600',
              fontSize: 15,
              marginHorizontal: 5,
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
            Recommended
          </Text>
        </LinearGradient>
      );
    }
  };
  const getFreeTrial = item => {
    if (
      item.name == 'Yearly' &&
      item.subscriptionOfferDetails[0].offerId != null
    )
      return (
        <View
          style={{
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            top: -DeviceHeigth * 0.02,
            marginRight: 5,
            backgroundColor: '#D5191A33',
          }}>
          <Text>3 Day Free Trial</Text>
        </View>
      );
  };
  const getMoneySign = item => {
    if (Platform.OS == 'ios') {
      return item.title != 'Monthly' && item.localizedPrice.slice(0, 1);
    } else {
      if (item.name == 'Yearly') {
        if (
          item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList
            .length == 1
        ) {
          return item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice.slice(
            0,
            1,
          );
        } else {
          return item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[1].formattedPrice.slice(
            0,
            1,
          );
        }
      } else if (item.name == 'Quarterly') {
        return item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice.slice(
          0,
          1,
        );
      }
    }
  };
  const getButtonName = () => {
    if (selectedItems.length <= 0) {
      return 'Proceed';
    } else {
      if (selectedItems.name == 'Quarterly') {
        return 'Proceed';
      } else if (selectedItems.name == 'Monthly') {
        return 'Proceed';
      } else {
        if (
          selectedItems.subscriptionOfferDetails[0]?.pricingPhases
            ?.pricingPhaseList.length == 1
        ) {
          return 'Proceed';
        } else {
          return 'Start Free  Trial';
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <NewHeader
        header={'Subscription'}
        backButton={true}
        onPress={() => {
          navigation.goBack();
        }}
      />

      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />
      {forLoading ? <ActivityLoader /> : ''}
      <View
        style={{
          flex: 0.35,
          top: -38,
        }}>
        <SliderBox
          ImageComponent={FastImage}
          images={data}
          sliderBoxHeight={DeviceHeigth * 0.28}
          autoplay
          circleLoop
          //resizeMethod={'resize'}
          resizeMode={'contain'}
          dotStyle={{display: 'none'}}
          ImageComponentStyle={{width: '100%'}}
          imageLoadingColor="#2196F3"
        />
      </View>
      <View
        style={{
          width: '100%',
          flex: 0.7,
          backgroundColor: '#fff',
          marginTop: -DeviceHeigth * 0.03,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: 'rgba(0, 0, 0, 1)',
          ...Platform.select({
            ios: {
              shadowColor: AppColor.DARKGRAY,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.5,
              shadowRadius: 10,
            },
            android: {
              elevation: 10,
            },
          }),
        }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{top: 15}}>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: 32,
              textAlign: 'center',
              top: 10,
              color: '#505050',
            }}>
            Get Your Plan!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              marginVertical: 15,
            }}>
            <Image
              source={localImage.checked}
              style={{width: 18, height: 18}}
              resizeMode="contain"
            />

            <Text
              style={{
                fontFamily: 'Poppins',
                fontWeight: '500',
                fontSize: 12,
                textAlign: 'center',
                marginHorizontal: 10,
                color: '#505050',
              }}>
              {}
              {getUserDataDetails?.level_title}
            </Text>
            <Image
              source={localImage.checked}
              style={{width: 18, height: 18}}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: 'Poppins',
                fontWeight: '500',
                fontSize: 12,
                textAlign: 'center',
                marginHorizontal: 10,
                color: '#505050',
              }}>
              Your Ages: {getUserDataDetails?.age}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              width: '95%',
              paddingLeft: 5,
              paddingRight: 5,
              top: 5,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 18,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              Subscription Plans
            </Text>
            {Platform.OS == 'ios' && (
              <TouchableOpacity
                onPress={() => {
                  restorePucrchase();
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: 12,
                    lineHeight: 18,
                    fontFamily: 'Poppins',
                    color: '#1E1E1E',
                    textDecorationLine: 'underline',
                  }}>
                  Restore purchase
                </Text>
              </TouchableOpacity>
            )}
            {Platform.OS == 'android' && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    'https://play.google.com/store/account/subscriptions',
                  )
                    .then(supported => {
                      if (!supported) {
                        console.error("Can't handle url: " + url);
                      } else {
                        // URL opened
                      }
                    })
                    .catch(err => console.error('An error occurred', err));
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: 12,
                    lineHeight: 18,
                    fontFamily: 'Poppins',
                    color: '#1E1E1E',
                    textDecorationLine: 'underline',
                  }}>
                  Manage Subscription
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              paddingBottom: 20,
            }}>
            <FlatList
              data={getInAppPurchase}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        borderWidth: 1,
                        borderColor:
                          selectedItems.productId == item.productId
                            ? 'red'
                            : '#DEDBDC',
                      },
                    ]}
                    activeOpacity={0.5}
                    onPress={() => {
                      setSelectedItems(item);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 15,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '700',
                              fontSize: 15,
                              textAlign: 'center',
                              color: '#D5191A',
                            }}>
                            {getMonthData(item)}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '700',
                              fontSize: 15,
                              marginHorizontal: 5,
                              textAlign: 'center',
                              color: '#D5191A',
                            }}>
                            {Platform.OS == 'ios'
                              ? item.title == 'Monthly'
                                ? 'Month'
                                : item.title == 'Quarterly'
                                ? 'Months'
                                : 'Months'
                              : item.name == 'Monthly'
                              ? 'Month'
                              : item.name == 'Quarterly'
                              ? 'Months'
                              : 'Months'}
                          </Text>
                          {getRecommended(item)}
                        </View>
                        <View></View>
                      </View>
                      {Platform.OS == 'android' && getFreeTrial(item)}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 15,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 17,
                              textAlign: 'center',
                              color: '#000000',
                              lineHeight: 20,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Poppins',
                                fontWeight: '600',
                                fontSize: 14,

                                color: '#D5191A',
                                lineHeight: 20,
                              }}>
                              {Platform.OS == 'android'
                                ? item.name == 'Monthly' &&
                                  'Billed' + ' ' + item.name
                                : item.title == 'Monthly' &&
                                  'Billed' + ' ' + item.title}
                            </Text>

                            {getMoneySign(item)}
                            {getPriceDetails(item)}
                          </Text>
                        </View>
                        <View
                          style={{
                            //alignItems: 'center',
                            marginHorizontal: 15,
                            marginVertical:
                              Platform.OS == 'ios'
                                ? item.title == 'Quarterly'
                                  ? 5
                                  : item.title == 'Yearly'
                                  ? 5
                                  : 0
                                : item.name == 'Quarterly'
                                ? 5
                                : item.name == 'Yearly'
                                ? 5
                                : 0,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 14,

                              color: '#D5191A',
                              lineHeight: 20,
                            }}>
                            {Platform.OS == 'android'
                              ? item.name != 'Monthly' &&
                                'Billed' + ' ' + item.name
                              : item.title != 'Monthly' &&
                                'Billed' + ' ' + item.title}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          //  alignSelf: 'flex-end',
                          // alignItems: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins',
                            fontWeight: '600',
                            fontSize: 15,
                            textAlign: 'center',
                            color: '#D5191A',
                            lineHeight: 20,
                            marginHorizontal: 20,
                          }}>
                          {Platform.OS == 'ios' &&
                            item.localizedPrice.slice(0, 1)}{' '}
                          {Platform.OS == 'android'
                            ? item.subscriptionOfferDetails[0].pricingPhases
                                .pricingPhaseList.length == 1
                              ? item.subscriptionOfferDetails[0].pricingPhases
                                  .pricingPhaseList[0].formattedPrice
                              : item.subscriptionOfferDetails[0].pricingPhases
                                  .pricingPhaseList[1].formattedPrice
                            : item.price}
                        </Text>
                        {getName(item) && (
                          <Image
                            source={localImage.checked}
                            style={{width: 25, height: 25, marginRight: 10}}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={{bottom: 15, alignSelf: 'center'}}>
            <Button
              buttonText={Platform.OS == 'ios' ? 'Proceed' : getButtonName()}
              onPresh={() => {
                puchasePackage(selectedItems);
              }}
            />
            <View
              style={{
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: DeviceWidth * 0.9,
                  backgroundColor: '#f5f5f5',
                  padding: 15,
                  borderRadius: 30,
                  marginTop: 15,
                }}>
                <Image source={localImage.BULB} style={{marginLeft: 10}} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '400',
                    fontFamily: 'Poppins',
                    lineHeight: 16,
                    paddingLeft: 10,
                    paddingRight: 10,
                    color: '#505050',
                  }}>
                  'Payment is Non-Refundable. We recommend you to review the
                  terms of use before proceeding with any online transaction'
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 15,
                alignSelf: 'center',
                width: '85%',
                paddingBottom: 30,
              }}>
              <Text style={styles.policyText}>
                By continuing you accept our{' '}
                <Text
                  onPress={() => {
                    navigation.navigate('TermaAndCondition');
                  }}
                  style={styles.policyText1}>
                  Privacy Policy
                </Text>{' '}
                and
                <Text
                  style={styles.policyText1}
                  onPress={() => {
                    navigation.navigate('TermaAndCondition');
                  }}>
                  {' '}
                  Terms of use
                </Text>{' '}
              </Text>
            </View>
          </View>
        </ScrollView>
        <ModalPoup visible={visible} typeData={successful}></ModalPoup>
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    width: DeviceWidth * 0.95,
    paddingVertical: 20,
    marginVertical: DeviceHeigth * 0.015,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    borderWidth: 1,
    // alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  policyText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '400',
    color: '#1E1E1E',
    fontFamily: 'Poppins',
  },
  policyText1: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    color: '#1E1E1E',
    textDecorationLine: 'underline',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    height: DeviceHeigth * 0.55,
    // backgroundColor: 'white',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonStyle: {
    width: 150,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: DeviceHeigth * 0.05,
  },
  button1: {
    fontSize: 20,
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: AppColor.WHITE,
    fontWeight: '700',
    backgroundColor: 'transparent',
    top: DeviceHeigth * 0.05,
    lineHeight: 30,
  },
});
export default Subscription;
