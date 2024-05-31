import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../Component/Color';
import {DeviceHeigth, NewApi, NewAppapi} from '../Component/Config';
import {Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import analytics from '@react-native-firebase/analytics';
import {requestPermissionforNotification} from '../Component/Helper/PushNotification';
import ActivityLoader from '../Component/ActivityLoader';
import axios from 'axios';
import {
  setTempLogin,
  setUserId,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {showMessage} from 'react-native-flash-message';
import {BannerAdd} from '../Component/BannerAdd';
import {bannerAdId} from '../Component/AdsId';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LetsStart = ({navigation}) => {
  const dispatch = useDispatch();
  const getFcmToken = useSelector(state => state.getFcmToken);
  const [deviceId, setDeviceId] = useState(0);
  const isFocused = useIsFocused();
  const [forLoading, setForLoading] = useState(false);
  useEffect(() => {
    if (isFocused) {
      requestPermissionforNotification(dispatch);
      DeviceInfo.syncUniqueId().then(uniqueId => {
        setDeviceId(uniqueId);
      });
    }
  }, [isFocused]);
  console.log(deviceId);
  const deviceIdRegister = async () => {
    analytics().logEvent('CV_FITME_GET_STARTED_BUTTON');
    setForLoading(true);
    try {
      const data = await axios(`${NewAppapi.LET_GO_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          deviceid: deviceId,
          version: VersionNumber.appVersion,
          devicetoken: getFcmToken,
          platform: Platform.OS,
        },
      });
      console.log('DFdssdfsdfdsf', data?.data);
      setForLoading(false);
      if (
        data?.data?.msg == 'User already registered' &&
        data?.data?.profile_compl_status == 1
      ) {
        showMessage({
          message:
            'Welcome back! It looks like you already have an account. Please log in to access it.',
          type: 'success',
          animationDuration: 500,
          floating: true,
          titleStyle: {
            fontFamily: Fonts.MONTSERRAT_MEDIUM,
            fontWeight: '400',
            fontSize: 13,
          },
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (
        data?.data?.msg == 'user registerd successfully' &&
        data?.data?.profile_compl_status == 0
      ) {
        dispatch(setTempLogin(data?.data?.temp));

        getProfileData(data.data?.id);
        await AsyncStorage.setItem('userID', `${data.data?.id}`);
        dispatch(setUserId(data.data?.id));
      } else if (
        data?.data?.msg == 'User already exists' &&
        data?.data?.profile_compl_status == 0
      ) {
        dispatch(setTempLogin(data?.data?.temp));
        getProfileData(data.data?.id);
        await AsyncStorage.setItem('userID', `${data.data?.id}`);
        dispatch(setUserId(data.data?.id));
      } else if (
        data?.data?.msg == 'User already exists' &&
        data?.data?.profile_compl_status == 1
      ) {
        setForLoading(false);
        getProfileData1(data.data?.id);
        await AsyncStorage.setItem('userID', `${data.data?.id}`);
        dispatch(setUserId(data.data?.id));
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setForLoading(false);
      console.log('Device Signup Error', error);
    }
  };
  const getProfileData = async user_id => {
    try {
      const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: user_id,
          version: VersionNumber.appVersion,
        },
      });

      if (data?.data?.profile) {
        setForLoading(false);
        dispatch(setUserProfileData(data.data.profile));
        navigation.navigate('Yourself');
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      } else {
        setForLoading(false);
        dispatch(setUserProfileData([]));
        navigation.navigate('Yourself');
      }
    } catch (error) {
      console.log('User Profile Error', error);
      setForLoading(false);
    }
  };
  const getProfileData1 = async user_id => {
    try {
      const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: user_id,
          version: VersionNumber.appVersion,
        },
      });

      if (data?.data?.profile) {
        setForLoading(false);
        dispatch(setUserProfileData(data.data.profile));
        navigation.replace('BottomTab');
      } else if (
        data?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: data?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      } else {
        setForLoading(false);
        dispatch(setUserProfileData([]));
        navigation.replace('BottomTab');
      }
    } catch (error) {
      console.log('User Profile Error', error);
      setForLoading(false);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <View style={styles.TextContainer}>
          {forLoading ? <ActivityLoader /> : ''}
          <Image
            resizeMode="contain"
            source={require('../Icon/Images/NewImage2/Welcome.png')}
            style={{
              width: DeviceHeigth >= 1024 ? 350 : 192,
              height: DeviceHeigth >= 1024 ? 150 : 70,
              alignSelf: 'center',
              // top: -DeviceHeigth * 0.05,
            }}
          />
          <View
            style={{
              // top: DeviceHeigth * 0.05,
              marginTop: DeviceHeigth * 0.05,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={require('../Icon/Images/NewImage2/GetStart.png')}
              style={{
                width: DeviceHeigth >= 1024 ? 350 : 250,
                height: DeviceHeigth >= 1024 ? 350 : 250,
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: DeviceHeigth * 0.03,
              borderColor: AppColor.BLACK,
            }}>
            <Text style={styles.LoginText2}>
              Your Personalized Workout Companion
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            width: '100%',
            justifyContent: 'center',
            marginTop:DeviceHeigth*0.04
            // top: DeviceHeigth > 808 ? DeviceHeigth * 0.18 : DeviceHeigth * 0.2,
          }}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#D01818', '#941000']}
            style={{
              width: '85%',
              height: 50,
              backgroundColor: 'red,',
              alignSelf: 'center',
              borderRadius: 30,
              alignItems: 'center',
              // top: -DeviceHeigth * 0.04,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: '100%',
                height: 53,
                backgroundColor: 'red,',
                alignSelf: 'center',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.5}
              onPress={() => {
                deviceIdRegister();
              }}>
              <Text style={styles.button}>Get Started</Text>
            </TouchableOpacity>
          </LinearGradient>
          <Text style={[styles.LoginText2, {fontSize: 15}]}>Or</Text>
          <Text style={[styles.LoginText2, {fontSize: 13}]}>
            Already have an account?{' '}
            <Text
              style={[
                styles.LoginText2,
                {
                  color: AppColor.RED1,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 13,
                  alignSelf: 'center',
                  textDecorationLine: 'underline',
                },
              ]}
              onPress={() => {
                navigation.navigate('LogSignUp', {screen: 'Log In'});
              }}>
              Log In{' '}
            </Text>
            <Text
              style={[
                styles.LoginText2,
                {
                  color: AppColor.LITELTEXTCOLOR,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 13,
                  alignSelf: 'center',
                },
              ]}>
              Or{' '}
            </Text>
            <Text
              style={[
                styles.LoginText2,
                {
                  color: AppColor.RED1,
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 13,
                  textDecorationLine: 'underline',
                  alignSelf: 'center',
                },
              ]}
              onPress={() => {
                navigation.navigate('LogSignUp', {screen: 'Sign Up'});
              }}>
              Sign Up
            </Text>
          </Text>

          <View
            style={{
              width: '85%',
              height: 50,
              backgroundColor: 'red,',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              top: -DeviceHeigth * 0.01,
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
        </View>
      </View>
      <BannerAdd bannerAdId={bannerAdId} />
    </>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  TextContainer: {
    marginTop: DeviceHeigth > 808 ? DeviceHeigth * 0.09 : DeviceHeigth * 0.07,
    // Platform.OS=='ios'?DeviceHeigth * 0.13:DeviceHeigth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
  LoginText: {
    fontSize: 25,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: AppColor.LITELTEXTCOLOR,
    fontWeight: '700',
  },
  LoginText2: {
    fontSize: 10,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.LITELTEXTCOLOR,
    fontWeight: '600',
    lineHeight: 22,
  },
  policyText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    color: '#505050',
    textAlign: 'center',
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
  },
  policyText1: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  button: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    color: '#F9F9F9',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  LoginText2: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontWeight: '600',

    color: '#333333',
    lineHeight: 22,
  },
});
export default LetsStart;
