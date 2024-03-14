import {StyleSheet, Image, StatusBar, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceWidth, NewAppapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as RNIap from 'react-native-iap';
import {
  Setmealdata,
  setFitmeAdsCount,
  setInappPurchase,
  setPurchaseHistory,
  setStoreData,
} from '../Component/ThemeRedux/Actions';
import VersionNumber from 'react-native-version-number';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {requestPermissionforNotification} from '../Component/Helper/PushNotification';
import {NewInterstitialAd} from '../Component/BannerAdd';
import moment from 'moment';

const products = Platform.select({
  ios: ['fitme_monthly', 'fitme_quarterly', 'fitme_yearly'],
  android: ['fitme_monthly', 'fitme_quarterly', 'fitme_year'],
});

const SplaceScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [closed, setClosed] = useState(false);
  const {initInterstitial, showInterstitialAd} = NewInterstitialAd(setClosed);

  const showIntro = useSelector(state => state.showIntro);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const getUserID = useSelector(state => state.getUserID);
  const getPurchaseHistory = useSelector(state => state.getPurchaseHistory);

  useEffect(() => {
    initInterstitial();
    requestPermissionforNotification(dispatch);
    DeviceInfo.syncUniqueId().then(uniqueId => {
      getCaterogy(uniqueId);

      Meal_List(uniqueId);
    });
    getPlanData();
    Object.keys(getUserDataDetails).length > 0 && PurchaseDetails();
    dispatch(setFitmeAdsCount(0));
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        loadScreen();
      } else {
        setTimeout(
          () => {
            showInterstitialAd();
            console.log('isLoaded', closed);
          },
          Platform.OS == 'android' ? 4000 : 2000,
        );
      }
    } else {
      setTimeout(
        () => {
          showInterstitialAd();
          console.log('isLoaded', closed);
        },
        Platform.OS == 'android' ? 4000 : 2000,
      );
    }
  }, []);
  useEffect(() => {
    if (closed) {
      initInterstitial();
      setTimeout(() => {
        loadScreen();
      }, 2000);
    }
  }, [closed]);
  const getPlanData = () => {
    Platform.OS === 'ios'
      ? RNIap.initConnection()
          .catch(() => {
            console.log('error connecting to store');
          })
          .then(() => {
            RNIap.getProducts({skus: products})
              .catch(() => {
                console.log('error finding purchase');
              })
              .then(res => {
                dispatch(setInappPurchase(res));
              });
          })
      : RNIap.initConnection()
          .catch(() => {
            console.log('error connecting to store');
          })
          .then(() => {
            RNIap.getSubscriptions({skus: products})
              .catch(() => {
                console.log('error finding purchase');
              })
              .then(res => {
                dispatch(setInappPurchase(res));
              });
          });
  };

  const Meal_List = async deviceData => {
    try {
      const data = await axios(`${NewAppapi.Meal_Categorie}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          version: VersionNumber.appVersion,
        },
      });
      if (data?.data?.msg == 'Please update the app to the latest version.') {
        showMessage({
          message: data?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (data.data.diets.length > 0) {
        dispatch(Setmealdata(data.data.diets));
      } else {
        dispatch(Setmealdata([]));
      }
    } catch (error) {
      dispatch(Setmealdata([]));
      console.log('Meal List Error', error);
    }
  };
  const getCaterogy = async deviceid => {
    try {
      const favDiet = await axios.get(
        `${NewAppapi.Get_Product_Catogery}?deviceid=${deviceid}`,
      );

      if (favDiet.data.status != 'Invalid token') {
        dispatch(setStoreData([]));
      } else {
        dispatch(setStoreData(favDiet.data.data));
      }
    } catch (error) {
      dispatch(setStoreData([]));
      console.log('Product Category Error111', error);
    }
  };
  const loadScreen = () => {
    if (showIntro) {
      //  navigation.replace('LogSignUp');
      if (
        getUserDataDetails?.id &&
        getUserDataDetails?.profile_compl_status == 1
      ) {
        navigation.replace('BottomTab');
      } else {
        navigation.replace('LogSignUp');

        // navigation.replace('LogSignUp');
      }
    } else {
      navigation.replace('IntroductionScreen1');
      //navigation.replace('IntroductionScreen1');
    }
  };

  const PurchaseDetails = async () => {
    try {
      const res = await axios(`${NewAppapi.TransctionsDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: getUserDataDetails.id,
          token: getUserDataDetails.login_token,
        },
      });
      if (res?.data?.data?.length > 0) {
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
    <>
      {closed ? (
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <StatusBar backgroundColor={'transparent'} translucent />
        </View>
      ) : (
        <LinearGradient
          style={styels.container}
          start={{x: 0, y: 0}}
          end={{x: 0.5, y: 0.5}}
          colors={['#D01818', '#941000']}>
          <StatusBar backgroundColor={'transparent'} translucent />
          <Image
            source={localImage.SplashText}
            style={styels.Textlogo}
            resizeMode="contain"
          />
        </LinearGradient>
      )}
    </>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Textlogo: {
    width: DeviceWidth * 0.4,
  },
});
export default SplaceScreen;
