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
import {useFocusEffect} from '@react-navigation/native';
import Bulb from '../Yourself/Bulb';
import moment from 'moment';
import ActivityLoader from '../../Component/ActivityLoader';
import {ReviewApp} from '../../Component/ReviewApp';

const Subscription = ({navigation}) => {
  const dispatch = useDispatch();
  const {getInAppPurchase, getUserDataDetails, getPurchaseHistory} =
    useSelector(state => state);
  const [selectedItems, setSelectedItems] = useState(getInAppPurchase[1]);
  const translateE = useRef(new Animated.Value(0)).current;
  const translateW = useRef(new Animated.Value(0)).current;
  const scaleSelected = useRef(new Animated.Value(1)).current;
  const [ImageSelected, setImageSelected] = useState(1);
  const [visible, setVisible] = React.useState(false);
  const [successful, setSuccessful] = useState(false);
  const [PlanData, setPlan] = useState([]);
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
  //         console.log('Payment cancelled by user');
  //       }
  //     },
  //   );
  //   const purchaseErrorSubscription = RNIap.purchaseErrorListener(error =>
  //     console.error('Purchase error', error.message),
  //   );

  //   // purchaseUpdateSubscription.remove();
  //   // purchaseUpdateSubscription.add();

  //   return () => {
  //     purchaseErrorSubscription.remove();
  //     purchaseUpdateSubscription.remove();
  //   };
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      PurchaseDetails(getUserDataDetails.id, getUserDataDetails.login_token);
    }, []),
  );
  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {},
    );
    const purchaseErrorSubscription = RNIap.purchaseErrorListener(
      error => {
        if (error['responseCode'] === '2') {
          Alert('Error', 'Payment cancelled by user');
        } else {
          Alert(
            'Error',
            'There has been an reeoe with  your purchase ,error code= ' + error,
          );
        }
      },
      // console.error('Purchase error', error.message),
    );
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);
  const validateIOS = async receipt => {
    // const purchases = await RNIap.getAvailablePurchases();
    // const latestPurchase = purchases[purchases.length - 1];

    const receiptBody = {
      'receipt-data': receipt,
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
          data: receiptBody,
        },
      );
      console.log(
        'After Validation Purchase',
        result.data?.pending_renewal_info,
      );
      if (result.data) {
        const renewalHistory = result.data?.pending_renewal_info;
        if (renewalHistory[0]?.auto_renew_status == 1 && receipt?.length != 0) {
          fetchPurchaseHistory1(renewalHistory[0]);
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
  //     console.log('Android Purchase Data is', response.data);
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

      if (purchase) {
        console.log('Current Purchase', purchase);
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
      // console.log('Android Purchase Data is', purchase[0]?.dataAndroid);

      // validateAndroid(purchase[0]?.dataAndroid);
    } catch (error) {
      setForLoading(false);
      console.log('Failed to purchase Android product', error);
    }
  };
  const fetchPurchaseHistory = async data => {
    const jsonObject = JSON.parse(data);
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
          // startdate: startDate,
          // enddate: endDate,
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
  const fetchPurchaseHistory1 = async item => {

    setForLoading(false);
    // const timestamp = data.transactionDate;
    // const date = new Date(timestamp);
    // const startDate = `${date.getDate()}-${
    //   date.getMonth() + 1
    // }-${date.getFullYear()} `;
    // console.log('renewalHistory', item);
    // date.setDate(
    //   date.getDate() + data.productId == 'fitme_monthly'
    //     ? 30
    //     : data.productId == 'fitme_quarterly'
    //     ? '90'
    //     : 365,
    // );
    // const endDate = `${date.getDate()}-${
    //   date.getMonth() + 1
    // }-${date.getFullYear()} `;

    try {
      const res = await axios(`${NewAppapi.Transctions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails.id,
          planname:
            item.auto_renew_product_id == 'fitme_monthly'
              ? 'Monthly'
              : item.auto_renew_product_id == 'fitme_quarterly'
              ? 'Quarterly'
              : 'Yearly',
          transaction_id: item.original_transaction_id,
          planid: item.auto_renew_product_id,
          planstatus: 'Active',
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
    if (getPurchaseHistory.length > 0) {
      if (Platform.OS == 'android') {
        if (
          item.productId == getPurchaseHistory[0].plan_id &&
          getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
          // getPurchaseHistory[0].plan_status == 'Active'
        ) {
          return 'Active Plan';
        } else {
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

      console.log('Purchase ', res.data);
      if (res?.data?.data?.length > 0) {
        dispatch(setPurchaseHistory(res.data.data));
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

  const scaleSelectedInterpolate = scaleSelected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12], // Adjust the starting and ending scale factors as needed
  });
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
      if (item.title == 'Monthly') {
        return (item.price / 4).toFixed(2) + '/' + 'Per Week';
      } else if (item.title == 'Quarterly') {
        return (item.price / 13).toFixed(2) + '/' + 'Per Week';
      } else {
        return (item.price / 52).toFixed(2) + '/' + 'Per Week';
      }
      // item.price
    } else {
      if (item.name == 'Monthly') {
        let price = parseInt(
          item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
            ?.priceAmountMicros,
        );

        return (price / 1000000 / 4).toFixed(2) + '/' + 'Per Week';
      } else if (item.name == 'Quarterly') {
        let price = parseInt(
          item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
            ?.priceAmountMicros,
        );

        return (price / 1000000 / 13).toFixed(2) + '/' + 'Per Week';
      } else {
        let price = parseInt(
          item.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
            ?.priceAmountMicros,
        );

        return (price / 1000000 / 52).toFixed(2) + '/' + 'Per Week';
      }
    }
  };
  restorePucrchase = async () => {
   
    setForLoading(true)
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log("Testing Purchase History",purchases)
   
      if (purchases?.length == 0) {
        setForLoading(false)
        showMessage({
          message: 'No Active Subscription Found !',
          type: 'danger',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        if (Platform.OS == 'android') {
          setForLoading(false)
          const activeSubs = purchases.filter(item => {
           
            if (item?.autoRenewingAndroid == true) {
              setForLoading(false)
              showMessage({
                message: 'Subscription Restored!',
                type: 'success',
                animationDuration: 500,
      
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
             
            } else {
              setForLoading(false)
              showMessage({
                message: 'No Active Subscription Found!',
                type: 'danger',
                animationDuration: 500,
      
                floating: true,
                icon: {icon: 'auto', position: 'left'},
              });
            }
          });
        } 
        else {
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
            setForLoading(false)

            if (result.data) {
       

              const renewalHistory = result.data.pending_renewal_info;

              const activeSubs = renewalHistory.filter(item => {
                if (item.auto_renew_status == '1') {
               

                  Alert.alert('Success', 'Subscription Restored');
                 
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
            setForLoading(false)
            console.log(error);
          }
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to Restore Subscription');
      setForLoading(false)
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
              For Beginner
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
              For Men Ages: 25-35
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
            <TouchableOpacity
              onPress={() => {
                
                restorePucrchase()
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
          </View>
          <View
            style={{
              alignSelf: 'center',
              width: '100%',
              justifyContent: 'center',

              alignItems: 'center',
              paddingTop: 25,
              // paddingLeft: 5,
              // paddingRight: 5,

              paddingBottom: 20,
            }}>
            <FlatList
              data={getInAppPurchase}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{}}
                      activeOpacity={1}
                      onPress={() => {
                        setImageSelected(index);
                        setSelectedItems(item);
                      }}>
                      <View
                        style={{
                          backgroundColor: getName(item) ? 'black' : '#fff',
                          marginHorizontal: 6,
                          width: DeviceWidth * 0.27,
                          borderTopRightRadius: 5,
                          borderTopLeftRadius: 5,
                          paddingBottom: 10,
                          ...Platform.select({
                            ios: {
                              shadowOffset: {width: 0, height: 20},
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                            },
                            android: {
                              elevation: getName(item) ? 5 : 0,
                            },
                          }),
                        }}>
                        <Text
                          style={{
                            top: 5,
                            fontFamily: 'Poppins',
                            fontWeight: '700',
                            fontSize: 12,
                            textAlign: 'center',
                            color: '#fff',
                          }}>
                          {getName(item)}
                        </Text>
                      </View>
                      <Animated.View
                        style={[
                          styles.button,
                          {
                            marginTop: index == ImageSelected ? 10 : 0,
                            borderColor:
                              selectedItems.productId == item.productId
                                ? 'red'
                                : '#DEDBDC',

                            transform: [
                              {
                                scale:
                                  index == ImageSelected
                                    ? scaleSelectedInterpolate
                                    : 1,
                              },
                            ],
                          },
                        ]}>
                        <View>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '700',
                              fontSize: 30,
                              textAlign: 'center',
                              color: '#505050',
                            }}>
                            {getMonthData(item)}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 13,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                            }}>
                            {Platform.OS == 'ios' ? item.title : item.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 12,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                            }}>
                            {Platform.OS == 'android'
                              ? item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice.slice(
                                  0,
                                  1,
                                )
                              : item.localizedPrice.slice(0, 1)}{' '}
                            {getPriceDetails(item)}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: 2,
                            backgroundColor: '#DEDBDC',
                            marginVertical: 5,
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 13,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                              marginTop: 10,
                            }}>
                            {Platform.OS == 'ios' ? item.title : item.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 12,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                            }}>
                            {Platform.OS == 'ios'
                              ? item.localizedPrice
                              : item.subscriptionOfferDetails[0].pricingPhases
                                  .pricingPhaseList[0].formattedPrice}
                          </Text>
                        </View>
                      </Animated.View>
                    </TouchableOpacity>
                  </>
                );
              }}
            />
          </View>
          <View style={{bottom: 15, alignSelf: 'center'}}>
            <Button
              buttonText={'Proceed'}
              onPresh={() => {
                puchasePackage(selectedItems);
              }}
            />
            <View
              style={{
                bottom:
                  Platform.OS == 'android'
                    ? DeviceHeigth * 0.045
                    : DeviceHeigth * 0.025,
                alignSelf: 'center',
              }}>
              <Bulb
                header={
                  'Payment is Non-Refundable. We recommend you to review the terms of use before proceeding with any online transaction'
                }
              />
            </View>
            <View
              style={{
                bottom:
                  Platform.OS == 'android'
                    ? DeviceHeigth * 0.03
                    : DeviceHeigth * 0.01,
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
    width: DeviceWidth * 0.27,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: 2,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingTop: DeviceHeigth * 0.005,
    borderWidth: 2,
    marginBottom: 15,
    borderColor: '#DEDBDC',
    // shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        // shadowRadius: 4,
      },
      android: {
        elevation: 1,
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
