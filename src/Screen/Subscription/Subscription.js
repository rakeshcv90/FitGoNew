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

const Subscription = ({navigation}) => {
  const dispatch = useDispatch();
  const {getInAppPurchase, getUserDataDetails, getPurchaseHistory} =
    useSelector(state => state);
  const [selectedItems, setSelectedItems] = useState([]);
  const translateE = useRef(new Animated.Value(0)).current;
  const translateW = useRef(new Animated.Value(0)).current;
  const scaleSelected = useRef(new Animated.Value(1)).current;
  const [ImageSelected, setImageSelected] = useState(-1);
  const data = [
    require('../../Icon/Images/NewImage/Sub1.gif'),

    require('../../Icon/Images/NewImage/Sub2.gif'),
    require('../../Icon/Images/NewImage/Sub3.gif'),
  ];

  // useEffect(async() => {
  //   const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //     async purchase => {

  //       const purchases = await RNIap.getAvailablePurchases();
  //       console.log('Payment cancelled by user1111',purchases[purchases.length - 1]);
  //       // if (purchase.purchaseState === 'cancelled') {
  //       //   Alert('Payment cancelled by user');
  //       //   console.log('Payment cancelled by user');
  //       // }
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

  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            await finishTransaction({purchase, isConsumable: false});
          } catch (error) {
            console.error(
              'An error occurred while completing transaction',
              error,
            );
          }
          // notifySuccessfulPurchase();
        }
      },
    );
    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error =>
      console.error('Purchase error', error.message),
    );
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const purchaseItems = async items => {
    try {
      const purchase = await RNIap.requestSubscription({
        sku: items.productId,
      });

      // fetchPurchaseHistory1(purchase);
    } catch (error) {
      console.log('Failed to purchase ios product', error);
    }
  };
  const purchaseItems1 = async (sku, offerToken) => {
    console.log('Failed to purchase Android product', sku, offerToken);
    try {
      const purchase = await RNIap.requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });

      fetchPurchaseHistory(purchase[0].dataAndroid);
    } catch (error) {
      console.log('Failed to purchase Android product', error);
    }
  };
  const fetchPurchaseHistory = async data => {
    const jsonObject = JSON.parse(data);
    const timestamp = jsonObject.purchaseTime;
    const date = new Date(timestamp);
    const startDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} `;
    date.setDate(
      date.getDate() + jsonObject.productId == 'a_monthly'
        ? 30
        : jsonObject.productId == 'b_quaterly'
        ? 90
        : 365,
    );
    const endDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} `;

    try {
      const res = await axios(`${NewAppapi.Transctions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails.id,
          planname:
            jsonObject.productId == 'a_monthly'
              ? 'Monthly'
              : jsonObject.productId == 'b_quaterly'
              ? 'Quaterly'
              : 'Yearly',
          transaction_id: jsonObject.orderId,
          planid: jsonObject.productId,
          startdate: startDate,
          enddate: endDate,
          planstatus: 'Active',
        },
      });
      if (res.data.status == 'transaction completed') {
        PurchaseDetails(getUserDataDetails.id, getUserDataDetails.login_token);
      } else {
        showMessage({
          message: 'Some Issue In Puchase Data!',
          type: 'danger',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      console.log('Purchase Store Data Error', error);
    }
  };
  const fetchPurchaseHistory1 = async data => {
    const timestamp = data.transactionDate;
    const date = new Date(timestamp);
    const startDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} `;
    date.setDate(
      date.getDate() + data.productId == 'a_month'
        ? 30
        : data.productId == 'b_quaterly'
        ? 90
        : 365,
    );
    const endDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} `;

    try {
      const res = await axios(`${NewAppapi.Transctions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: getUserDataDetails.id,
          planname:
            data.productId == 'a_month'
              ? 'Monthly'
              : data.productId == 'b_quaterly'
              ? 'Quaterly'
              : 'Yearly',
          transaction_id: data.transactionId,
          planid: data.productId,
          startdate: startDate,
          enddate: endDate,
          planstatus: 'Active',
        },
      });
      if (res.data.status == 'transaction completed') {
        PurchaseDetails(getUserDataDetails.id, getUserDataDetails.login_token);
      } else {
        showMessage({
          message: 'Some Issue In Puchase Data!',
          type: 'danger',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      console.log('Purchase Store Data Error', error);
    }
  };
  const getName = item => {
    if (getPurchaseHistory.length > 0) {
      if (Platform.OS == 'android') {
        if (
          item.productId == getPurchaseHistory[0].plan_id &&
          getPurchaseHistory[0].plan_status == 'Active'
        ) {
          return localImage.PurchaseTick;
        } else {
        }
      } else {
        if (
          item.productId == getPurchaseHistory[0].plan_id &&
          getPurchaseHistory[0].plan_status == 'Active'
        ) {
          return localImage.PurchaseTick;
        } else {
        }
      }
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

      if (res.data.data.length > 0) {
        dispatch(setPurchaseHistory(res.data.data));
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

  return (
    <View style={styles.container}>
      <NewHeader
        header={'Subscription'}
        backButton={true}
        //color={AppColor.GRAY}
        onPress={() => {
          navigation.goBack();
        }}
      />

      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.GRAY} />
      <View
        style={{
          // width: '95%',
          flex: 0.3,

          // alignSelf: 'center',
          // alignItems: 'center',
          top: -30,
          // backgroundColor: AppColor.GRAY,
        }}>
        <SliderBox
          ImageComponent={FastImage}
          images={data}
          sliderBoxHeight={250}
          autoplay
          circleLoop
          resizeMethod={'resize'}
          resizeMode={'cover'}
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
              shadowOpacity: 0.3,
              shadowRadius: 10,
            },
            android: {
              elevation: 3,
              shadowColor: AppColor.DARKGRAY,
            },
          }),
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                showMessage({
                  message: 'Work in Progress',
                  floating: true,
                  duration: 500,
                  type: 'info',
                  icon: {icon: 'auto', position: 'left'},
                });
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
              width: '93%',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
              alignItems: 'center',
              paddingTop: 25,
              paddingLeft: 5,
              paddingRight: 5,
              paddingBottom: 20,
              //backgroundColor:'red'
            }}>
            <FlatList
              // data={getInAppPurchase}
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              // extraData={({item, index}) => index.toString()}
              renderItem={({item, index}) => {
                // const isSelected = selectedItems.includes(item.productId);

                return (
                  <>
                    {/* <View style={styles.button2}>
                     
                    </View> */}
                    <TouchableOpacity
                      style={{}}
                      activeOpacity={1}
                      onPress={() => {
                        // setImageSelected((prevOpenCategories) => {
                        //   if (prevOpenCategories.includes(index)) {
                        //     return prevOpenCategories.filter(
                        //       (category) => category !== index,
                        //     );
                        //   }
                        //   return [...prevOpenCategories, index];
                        // });

                        // let data= ImageSelected.push(index)
                        // Animated.timing(scaleSelected, {
                        //   toValue: 0, // Adjust the scaling factor as needed
                        //   duration: 500,
                        //   useNativeDriver: true,
                        //   easing: Easing.elastic(1),
                        // }).start()
                        setImageSelected(index);
                      }}>
                      <View
                        style={{
                          backgroundColor: 'black',
                          marginHorizontal: 10,
                          width: DeviceWidth * 0.25,
                          borderTopRightRadius: 5,
                          borderTopLeftRadius: 5,
                          paddingBottom:10,
                          ...Platform.select({
                            ios: {
                              shadowOffset: {width: 0, height: 20},
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                            },
                            android: {
                              elevation: 5,
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
                            
                          }}>{`Active Plan`}</Text>
                      </View>
                      <Animated.View
                        style={[
                          styles.button,
                          {
                            marginTop:index == ImageSelected?10:0,
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
                              fontWeight: '600',
                              fontSize: 30,
                              textAlign: 'center',
                              color: '#505050',
                            }}>
                            1
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 15,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                            }}>
                            Months
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 15,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                            }}>
                            1799.00
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
                              fontSize: 15,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                              marginTop: 10,
                            }}>
                            Months
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: 15,
                              textAlign: 'center',
                              color: '#505050',
                              lineHeight: 20,
                            }}>
                            1799.00
                          </Text>
                        </View>
                      </Animated.View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          borderColor:
                            selectedItems.productId == item.productId
                              ? 'red'
                              : 'white',
                        },
                      ]}
                      activeOpacity={0.5}
                      onPress={() => {
                        setSelectedItems(item);
                      }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 15,
                          lineHeight: 20,
                          color: '#272727',
                        }}>
                        {Platform.OS == 'ios' ? item.title : item.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: '500',
                            fontSize: 20,
                            lineHeight: 24,
                            top: 5,
                            color: '#D5191A',
                          }}>
                          ₹{' '}
                          {Platform.OS == 'ios'
                            ? item.price
                            : item.subscriptionOfferDetails[0].pricingPhases
                                .pricingPhaseList[0].formattedPrice}
                          <Text
                            style={{
                              fontWeight: '500',
                              fontSize: 18,
                              lineHeight: 24,
                              color: '#000000',
                            }}>
                            {' '}
                            / {Platform.OS == 'ios' ? item.title : item.name}
                          </Text>
                        </Text>

                        <Image
                          source={getName(item)}
                          resizeMode="contain"
                          style={{
                            height: 25,
                            width: 25,
                            marginRight: 20,
                          }}
                        />
                      </View>
                    </TouchableOpacity> */}
                  </>
                );
              }}
            />
          </View>
        </ScrollView>
      </View>

      <View style={{bottom: 18, alignSelf: 'center', position: 'absolute'}}>
        <Button
          buttonText={'Proceed'}
          onPresh={() => {
            puchasePackage(selectedItems);
          }}
        />
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
    width: DeviceWidth * 0.25,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingTop: DeviceHeigth * 0.005,
    borderWidth: 0.5,
    marginTop:0,
    marginBottom: 15,
    borderColor: '#DEDBDC',
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  button2: {
    width: DeviceWidth * 0.41,
    height: DeviceHeigth * 0.27,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'green',
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 20},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
export default Subscription;
