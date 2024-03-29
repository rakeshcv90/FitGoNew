import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as RNIap from 'react-native-iap';
import {
  Setmealdata,
  setInappPurchase,
  setStoreData,
} from '../Component/ThemeRedux/Actions';
import VersionNumber, { appVersion } from 'react-native-version-number';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import { RemoteMessage, requestPermissionforNotification } from '../Component/Helper/PushNotification';

const products = Platform.select({
  ios: ['a_monthly', 'b_quaterly', 'c_annual'],
  android: ['a_monthly', 'b_quaterly', 'c_annual', 'base-plan'],
});

const SplaceScreen = ({navigation}) => {
  const [deviceId, setDeviceId] = useState(0);
  const dispatch = useDispatch();

  const {showIntro, getUserDataDetails, getUserID} = useSelector(
    state => state,
  );
  useEffect(() => {
    requestPermissionforNotification(dispatch);
    RemoteMessage();
  }, []);
  useEffect(() => {
    DeviceInfo.syncUniqueId().then(uniqueId => {
      getCaterogy(uniqueId);
      setDeviceId(uniqueId);
      Meal_List(uniqueId);
    });
    // getPlanData();
  }, []);
  // const getPlanData = () => {
  //   Platform.OS === 'ios'
  //     ? RNIap.initConnection()
  //         .catch(() => {
  //           console.log('error connecting to store');
  //         })
  //         .then(() => {
  //           RNIap.getProducts({skus: products})
  //             .catch(() => {
  //               console.log('error finding purchase');
  //             })
  //             .then(res => {
  //               console.log('IOS Subscription', res);
  //               dispatch(setInappPurchase(res));
  //             });
  //         })
  //     : RNIap.initConnection()
  //         .catch(() => {
  //           console.log('error connecting to store');
  //         })
  //         .then(() => {
  //           RNIap.getSubscriptions({skus: products})
  //             .catch(() => {
  //               console.log('error finding purchase');
  //             })
  //             .then(res => {
  //               console.log('Android Subscription', res);
  //               dispatch(setInappPurchase(res));
  //             });
  //         });
  // };
  useEffect(() => {
    setTimeout(() => {
      if (showIntro) {
        //  navigation.replace('LogSignUp');
        if (
          getUserDataDetails?.id &&
          getUserDataDetails?.profile_compl_status == 1
        ) {
          navigation.replace('BottomTab');
        } else {
          navigation.replace('LogSignUp');
        }
      } else {
        navigation.replace('IntroductionScreen1');
      }
    }, 4000);
  }, []);
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
  return (
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
