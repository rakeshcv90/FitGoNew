import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

const Subscription = ({navigation}) => {
  const dispatch = useDispatch();
  const {getInAppPurchase, getUserDataDetails, getPurchaseHistory} =
    useSelector(state => state);

  const [selectedItems, setSelectedItems] = useState([]);

  const data = [

    require('../../Icon/Images/product_1631792207.jpg'),

    require('../../Icon/Images/product_1631811803.jpg'),
    require('../../Icon/Images/product_1631468947.jpg'),


  ];
  useEffect(async() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
     
        const purchases = await RNIap.getAvailablePurchases();
        console.log('Payment cancelled by user1111',purchases[purchases.length - 1]);
        // if (purchase.purchaseState === 'cancelled') {
        //   Alert('Payment cancelled by user');
        //   console.log('Payment cancelled by user');
        // }
      },
    );
    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error =>
      console.error('Purchase error', error.message),
    );

    // purchaseUpdateSubscription.remove();
    // purchaseUpdateSubscription.add();

    return () => {
      purchaseErrorSubscription.remove();
      purchaseUpdateSubscription.remove();
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
    try {
      const purchase = await RNIap.requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });
  
      // fetchPurchaseHistory(purchase[0].dataAndroid);
    } catch (error) {
      console.log('Failed to purchase ios product', error);
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
  return (
    <View style={styles.container}>
      <NewHeader
        header={'Fitness Coach'}
        backButton={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          width: '95%',
          height: 150,
          borderRadius: 10,
          alignSelf: 'center',
          alignItems: 'center',
          top: -20,
        }}>
        <SliderBox
          ImageComponent={FastImage}
          images={data}
          sliderBoxHeight={150}
          onCurrentImagePressed={index =>
            console.warn(`image ${index} pressed`)
          }
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
          resizeMethod={'resize'}
          resizeMode={'cover'}
          paginationBoxStyle={{
            position: 'absolute',
            bottom: 0,
            padding: 0,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(128, 128, 128, 0.92)',
          }}
          ImageComponentStyle={{borderRadius: 15, width: '95%'}}
          imageLoadingColor="#2196F3"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 0}}>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={['#E3FDF5', '#FFE6FAB5']}
          style={{
            width: '95%',
            top: -20,
            borderRadius: 10,
            marginVertical: DeviceHeigth * 0.02,
            padding: 5,
            alignSelf: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>
            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#ED4530',
              }}>
              100+
              <Text
                style={{
                  textAlign: 'center',
                  marginLeft: 10,
                  fontWeight: '500',
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: 'Poppins',
                  color: '#1E1E1E',
                }}>
                {''} Workout Plans
              </Text>
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>

            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              {''} No Advertisement
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>

            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              {''} No Advertisement
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={localImage.Tick2}
              style={{
                height: 40,
                width: 40,
              }}
              resizeMode="contain"></Image>

            <Text
              style={{
                textAlign: 'center',
                marginLeft: 10,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: 'Poppins',
                color: '#1E1E1E',
              }}>
              {''} Access to backup feature
            </Text>
          </View>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: '95%',
            paddingLeft: 5,
            paddingRight: 5,
            top: -20,
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
        <View style={{marginBottom: DeviceHeigth * 0.1}}>
          <FlatList
            data={getInAppPurchase}
            scrollEnabled={false}
            extraData={({item, index}) => index.toString()}
            renderItem={({item, index}) => {
              // const isSelected = selectedItems.includes(item.productId);
              return (
                <>
                  <TouchableOpacity
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
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
      </ScrollView>
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
    backgroundColor: AppColor.WHITE,
  },
  button: {
    width: DeviceWidth * 0.9,
    height: DeviceHeigth * 0.1,
    marginVertical: DeviceHeigth * 0.005,
    borderRadius: 16,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    paddingLeft: 30,
    paddingTop: DeviceHeigth*0.015,
    borderWidth: 1,

    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
export default Subscription;
