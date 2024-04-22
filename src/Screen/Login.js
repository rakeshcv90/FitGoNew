import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Vibration,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '../Component/Button';
import InputText from '../Component/InputText';
import {StyleSheet} from 'react-native';
import {AppColor} from '../Component/Color';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../Component/Config';
import {localImage} from '../Component/Image';
import Button2 from '../Component/Button2';
import {StatusBar} from 'react-native';
import axios from 'axios';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ActivityLoader from '../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
import {LoginManager, Profile} from 'react-native-fbsdk-next';
import AnimatedLottieView from 'lottie-react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Setmealdata,
  setCustomWorkoutData,
  setPurchaseHistory,
  setUserId,
  setUserProfileData,
  setVideoLocation,
} from '../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {TextInput} from 'react-native-paper';
import {navigationRef} from '../../App';
import VersionNumber from 'react-native-version-number';
import {Platform} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {
  RemoteMessage,
  requestPermissionforNotification,
} from '../Component/Helper/PushNotification';
import analytics from '@react-native-firebase/analytics';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

const validationSchema1 = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});
const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(1);
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [forLoading, setForLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [IsVerifyVisible, setVerifyVisible] = useState(false);
  const [appVersion, setAppVersion] = useState(0);
  const [cancelLogin, setCancelLogin] = useState(false);
  const getFcmToken = useSelector(state => state.getFcmToken);
  useEffect(() => {
    requestPermissionforNotification(dispatch);
    // RemoteMessage();
  }, []);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '60298593797-kkelutkvu5it955cebn8dhi1n543osi8.apps.googleusercontent.com',
    });
  }, []);
  useEffect(() => {
    setAppVersion(VersionNumber.appVersion);
  });
  const GoogleSignup = async () => {
    analytics().logEvent('CV_FITME_GOOGLE_LOGIN');
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken, user} = await GoogleSignin.signIn();
      socialLogiIn(user, idToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setCancelLogin(true);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
      }
    }
  };
  const socialLogiIn = async (value, token) => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: value.name,
          email: value.email,
          signuptype: 'social',
          socialid: value.id,
          socialtoken: token,
          socialtype: 'google',
          version: appVersion,
          devicetoken: getFcmToken,
          platform: Platform.OS,
        },
      });

      if (data.data.profile_status == 1) {
        showMessage({
          message: data.data.msg,
          type: 'success',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
        getProfileData(data.data.id, data.data.profile_status);
        getCustomWorkout(data.data.id);
        Meal_List(data.data.login_token);
        PurchaseDetails(data.data.id, data.data.login_token);
        await GoogleSignin.signOut();
      } else if (
        data.data.msg ==
        'User does not exist with provided Google social credentials'
      ) {
        showMessage({
          message: 'You are not registered,You need to Signup first',
          type: 'danger',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
        await GoogleSignin.signOut();
      } else if (
        data.data?.msg == 'Please update the app to the latest version.'
      ) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        await GoogleSignin.signOut();
      } else {
        // showMessage({
        //   message: data.data.msg,
        //   type: 'danger',
        //   animationDuration: 500,
        //   floating: true,
        //   icon: {icon: 'auto', position: 'left'},
        // });
        dispatch(setCustomWorkoutData([]));
        setForLoading(false);
        // setModalVisible(true);
        getProfileData(data.data.id, data.data.profile_status);
        Meal_List(data.data.login_token);
        await GoogleSignin.signOut();
      }
    } catch (error) {
      setForLoading(false);
      console.log('google Signup Error', error);
      await GoogleSignin.signOut();
    }
  };
  const FacebookLogin = () => {
    analytics().logEvent('CV_FITME_FACEBOOK_LOGIN');
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          setCancelLogin(true);
        } else {
          const currentProfile = Profile.getCurrentProfile().then(function (
            currentProfile,
          ) {
            if (currentProfile) {
              socialFacebookLogiIn(currentProfile);
            }
          });
        }
      },
      function (error) {
        alert('Login failed with error: ' + error);
      },
    );
  };
  const socialFacebookLogiIn = async value => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: value.name,
          email: value.email,
          signuptype: 'social',
          socialid: value.userID,
          socialtoken: '',
          socialtype: 'facebook',
          version: appVersion,
          devicetoken: getFcmToken,
          platform: Platform.OS,
        },
      });
      if (data.data.profile_status == 1) {
        showMessage({
          message: data.data.msg,
          type: 'success',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
        getProfileData(data.data.id, data.data.profile_status);
        getCustomWorkout(data.data.id);
        Meal_List(data.data.login_token);
        PurchaseDetails(data.data.id, data.data.login_token);
      } else if (
        data.data.msg ==
        'User does not exist with provided Facebook social credentials'
      ) {
        showMessage({
          message: 'You are not registered,You need to Signup first',
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      } else if (
        data.data?.msg == 'Please update the app to the latest version.'
      ) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);
        // setModalVisible(true);
        dispatch(setCustomWorkoutData([]));
        getProfileData(data.data.id, data.data.profile_status);
        Meal_List(data.data.login_token);
      }
    } catch (error) {
      setForLoading(false);
      console.log('Facebook Signup Error', error);
    }
  };
  const onApplePress = async () => {
    analytics().logEvent('CV_FITME_APPLE_LOGIN');
    await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(
        res => {
          socialAppleLogiIn(res);
        },
        error => {
          console.log('Apple Login Error', error);
        },
      );
  };
  const socialAppleLogiIn = async res => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: res.fullName.givenName + res.fullName.familyName,
          email: res.email,
          signuptype: 'social',
          socialid: res.user,
          socialtoken: res.authorizationCode,
          socialtype: 'Apple',
          version: VersionNumber.appVersion,
          devicetoken: getFcmToken,
          platform: Platform.OS,
        },
      });

      if (data.data?.profile_status == 1) {
        showMessage({
          message: data.data.msg,
          type: 'success',
          animationDuration: 500,

          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
        dispatch(setUserId(data.data?.id));
        getProfileData(data.data.id, data.data.profile_status);
        getCustomWorkout(data.data.id);
        Meal_List(data.data.login_token);
        PurchaseDetails(data.data.id, data.data.login_token);
      } else if (
        data.data?.msg ==
        'User does not exist with provided Apple social credentials'
      ) {
        setForLoading(false);
        dispatch(setUserId(data.data?.id));
        getProfileData(data.data.id, data.data.profile_status);
        Meal_List(data.data.login_token);
      } else if (
        data.data?.msg == 'Please update the app to the latest version.'
      ) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setForLoading(false);

        getProfileData(data.data.id, data.data.profile_status);
        Meal_List(data.data.login_token);
      }
    } catch (error) {
      setForLoading(false);
      console.log('Apple login Error Error', error);
    }
  };
  const loginFunction = async () => {
    analytics().logEvent('CV_FITME_LOGIN');

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (email == null) {
      showMessage({
        message: 'Please Enter Email id',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (reg.test(email) === false) {
      showMessage({
        message: 'Please Enter Valid Emaid Id',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (password == null) {
      showMessage({
        message: 'Please Enter Password',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else {
      setForLoading(true);
      try {
        const data = await axios(`${NewApi}${NewAppapi.login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            email: email,
            password: password,
            version: appVersion,
            devicetoken: getFcmToken,
            platform: Platform.OS,
          },
        });

        if (
          data?.data?.msg == 'Login successful' &&
          data?.data.profile_status == 1
        ) {
          showMessage({
            message: data.data.msg,
            floating: true,
            duration: 500,
            type: 'success',
            icon: {icon: 'auto', position: 'left'},
          });
          setEmail('');
          setPassword('');
           getProfileData(data.data.id, data.data.profile_status);
          getCustomWorkout(data.data.id);
          Meal_List(data.data.login_token);
          PurchaseDetails(data.data.id, data.data.login_token);
        } else if (
          data.data.msg == 'Login successful' &&
          data.data.profile_status == 0
        ) {
          setForLoading(false);
          setEmail('');
          setPassword('');
          getProfileData(data.data.id, data.data.profile_status);
          Meal_List(data.data.login_token);
          dispatch(setCustomWorkoutData([]));
          PurchaseDetails(data.data.id, data.data.login_token);
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
        } else {
          setForLoading(false);
          setEmail('');
          setPassword('');
          showMessage({
            message: data.data.msg,
            floating: true,
            duration: 500,
            type: 'danger',
            icon: {icon: 'auto', position: 'left'},
          });
        }
      } catch (error) {
        console.log('Form  Login Error', error);
        setForLoading(false);
        setEmail('');
        setPassword('');
      }
    }
  };
  const getProfileData = async (user_id, status) => {
    try {
      const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: user_id,
          version: appVersion,
        },
      });

      setForLoading(false);
      if (data?.data?.profile) {
        setForLoading(false);
        dispatch(setUserProfileData(data.data.profile));
        await AsyncStorage.setItem('userID', `${user_id}`);
        // status == 1
        //   ? navigation.navigate('BottomTab')
        //   : navigationRef.navigate('Yourself');
        if (status == 1) navigation.replace('BottomTab');
        else {
          showMessage({
            message: 'Please complete your Profile Details',
            type: 'success',
            animationDuration: 500,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          navigationRef.navigate('Yourself');
        }
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
      } else {
        setForLoading(false);
        dispatch(setUserProfileData([]));
        // status == 1
        //   ? navigation.navigate('BottomTab')
        //   : navigationRef.navigate('Yourself');
        if (status == 1) navigation.replace('BottomTab');
        else {
          showMessage({
            message: 'Please complete your Profile Details',
            type: 'success',
            animationDuration: 500,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          navigationRef.navigate('Yourself');
        }
      }
    } catch (error) {
      console.log('User Profile Error', error);
      if (status == 1) navigation.replace('BottomTab');
      else {
        showMessage({
          message: 'Please complete your Profile Details',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        navigationRef.navigate('Yourself');
      }
      // status == 1
      //   ? navigation.navigate('BottomTab')
      //   : navigationRef.navigate('Yourself');
      setForLoading(false);
    }
  };
  const CompleateProfileModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Complete Profile</Text>
            <AnimatedLottieView
              source={require('../Icon/Images/NewImage/compleateProfile.json')} // Replace with your animation file
              autoPlay
              loop
              style={{width: 250, height: 200}}
              resizeMode="cover"
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'black',
                fontFamily: 'Poppins',
              }}>
              Compleat your profile for Your Own Exercise!
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  padding: 10,
                }}
                onPress={() => {
                  navigationRef.navigate('BottomTab');
                  setModalVisible(false);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>

              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#941000', '#D01818']}
                style={styles.button}>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigationRef.navigate('Yourself');
                    setModalVisible(false);
                  }}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              {/* <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Yourself');
                  setModalVisible(false);
                }}>
                <Text style={styles.textStyle}>Continue</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const getCustomWorkout = async user_id => {
    try {

      const data = await axios.get(
        `${NewAppapi.GET_USER_CUSTOM_WORKOUT}?user_id=${user_id}`,
      );

   
      if (data?.data?.msg != 'data not found.') {
        setForLoading(false); 
        dispatch(setCustomWorkoutData(data?.data?.data));
      } else {
        setForLoading(false);
        dispatch(setCustomWorkoutData([]));
      }
    } catch (error) {
      console.log('Custom Workout Error', error);
      dispatch(setCustomWorkoutData([]));
      setForLoading(false);
    }
  };
  const Meal_List = async () => {
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
        data.data?.diets?.map((item, index) => downloadVideos(item, index));
        dispatch(Setmealdata(data.data.diets));
      } else {
        dispatch(Setmealdata([]));
      }
      // if (data.data.diets.length > 0) {
      //   dispatch(Setmealdata(data.data.diets));
      // } else {
      //   dispatch(Setmealdata([]));
      // }
    } catch (error) {
      dispatch(Setmealdata([]));
      console.log('Meal List Error', error);
    }
  };

  const sanitizeFileName = fileName => {
    fileName = fileName.replace(/\s+/g, '_');
    return fileName;
  };
  let StoringData = {};
  const downloadVideos = async (data, index) => {
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      data?.diet_title,
    )}.jpg`;
    try {
      const videoExists = await RNFetchBlob.fs.exists(filePath);
      if (videoExists) {
        StoringData[data?.diet_title] = filePath;
      } else {
        await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
          appendExt: '.jpg',
        })
          .fetch('GET', data?.diet_image, {
            'Content-Type': 'application/jpg',
          })
          .then(res => {
            StoringData[data?.diet_title] = res.path();
            console.log('Image downloaded successfully!', index, res.path());
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
    dispatch(setVideoLocation(StoringData));
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
  const ModalView = () => {
    const [forLoading, setForLoading] = useState(false);
    const handleForgotPassword = async value => {
      setForLoading(true);
      try {
        const data = await axios(`${NewApi}${NewAppapi.forgetPassword}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            email: value.email,
            version: appVersion,
          },
        });
        setForLoading(false);

        if (data?.data[0]?.msg == 'Mail sent') {
          setForLoading(false);
          showMessage({
            message: 'Reset Password link sent!',
            type: 'success',
            animationDuration: 500,

            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          setVerifyVisible(false);
        } else if (
          data.data.msg == 'Please update the app to the latest version.'
        ) {
          setForLoading(false);
          showMessage({
            message: data.data.msg,
            type: 'danger',
            animationDuration: 500,

            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          setVerifyVisible(false);
        } else {
          showMessage({
            message: 'Somthing went wrong!',
            type: 'ganger',
            animationDuration: 500,

            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          setForLoading(false);
          setVerifyVisible(false);
        }
      } catch (error) {
        console.log('FOrgot Password Error', error);
        setForLoading(false);
        setVerifyVisible(false);
      }
    };
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          position: 'absolute',
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={IsVerifyVisible}
          onRequestClose={() => {
            setVerifyVisible(!IsVerifyVisible);
          }}>
          <View
            style={[
              styles.modalContainer,
              {backgroundColor: 'transparent', flex: 1},
            ]}>
            <KeyboardAvoidingView
              // style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'position' : ''}>
              {forLoading ? <ActivityLoader /> : ''}
              <View style={[styles.modalContent, {backgroundColor: '#fff'}]}>
                <>
                  <View
                    style={[
                      styles.closeButton,
                      ,
                      {
                        width: (DeviceWidth * 85) / 100,
                        marginTop: 5,
                        backgroundColor: 'fff',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        setVerifyVisible(false);
                      }}>
                      <Icons name="close" size={27} color={'#000'} />
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={localImage.Verify}
                    style={{
                      width: DeviceWidth * 0.4,
                      height: DeviceHeigth * 0.1,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 18,
                      fontWeight: '700',
                    }}>
                    Forgot Password?
                  </Text>
                  <Text
                    style={{
                      color: '#1E1E1E',
                      fontSize: 13,
                      fontWeight: '400',
                      fontFamily: 'Poppins',
                      marginTop: 10,
                    }}>
                    Please enter your email below to receive
                  </Text>
                  <Text
                    style={{
                      color: '#1E1E1E',
                      fontSize: 13,
                      fontWeight: '400',
                      textAlign: 'center',
                      fontFamily: 'Poppins',
                      marginBottom: 15,
                      marginTop: 10,
                    }}>
                    your password reset code
                  </Text>

                  <Formik
                    initialValues={{
                      email: '',
                    }}
                    onSubmit={values => handleForgotPassword(values)}
                    validationSchema={validationSchema1}>
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      handleBlur,
                      errors,
                      touched,
                    }) => (
                      <>
                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.03,
                            marginLeft: 10,
                          }}>
                          <InputText
                            errors={errors.email}
                            touched={touched.email}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            left={
                              <TextInput.Icon
                                icon={() => (
                                  <Image
                                    source={localImage.Message}
                                    style={{width: 22, height: 22}}
                                  />
                                )}
                                style={{marginTop: 14}}
                              />
                            }
                            label="Email"
                            placeholder="Enter Email id"
                          />
                        </View>
                        <View style={{marginTop: DeviceHeigth * 0.1}}>
                          <Button
                            buttonText={'Reset Password'}
                            onPresh={handleSubmit}
                          />
                        </View>
                      </>
                    )}
                  </Formik>
                </>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    );
  };
  const LoginCancelModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={cancelLogin}
        onRequestClose={() => {
          setCancelLogin(!cancelLogin);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#202020',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.9,
          }}>
          <View
            style={{
              width: DeviceWidth * 0.7,
              height: DeviceHeigth * 0.3,
              backgroundColor: 'white',
              borderRadius: 20,
              paddingVertical: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Image
              source={require('../Icon/Images/NewImage/alert.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#202020',
                marginTop: 10,
                fontFamily: 'Montserrat-Regular',
              }}>
              ALERT
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#202020',
                marginTop: 15,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {`Login/Sign Up`}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#202020',
                marginTop: 5,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {`Incomplete`}
            </Text>

            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              // colors={['#941000', '#D01818']}
              colors={['#D01818', '#941000']}
              style={{
                width: '100%',
                height: 60,
                bottom: 0,
                position: 'absolute',
                paddingLeft: 5,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: 'red',
                alignItems: 'center',
                // justifyContent:'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setCancelLogin(false);
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#fff',
                    marginTop: 10,
                    fontFamily: 'Montserrat-Regular',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
      // <View
      //   style={{
      //     flex: 1,
      //     justifyContent: 'center',
      //     alignItems: 'center',
      //     marginTop: 22,
      //     backfaceVisibility: 'red',
      //   }}>

      //   <Modal
      //      animationType="fade"
      //   transparent={true}
      //     visible={cancelLogin}
      //     onRequestClose={() => {
      //       setCancelLogin(!cancelLogin);
      //     }}>

      //     <View
      //       style={{
      //         flex: 1,
      //         justifyContent: 'center',
      //         alignItems: 'center',

      //         backfaceVisibility: 'red',
      //       }}>

      //
      //     </View>
      //   </Modal>
      // </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'position' : undefined}
          contentContainerStyle={{flexGrow: 1}}>
          {forLoading ? <ActivityLoader /> : ''}

          <View
            style={{
              marginTop: DeviceHeigth * 0.05,
              marginLeft: 10,
            }}>
            <InputText
              left={
                <TextInput.Icon
                  icon={() => (
                    <Image
                      source={localImage.Message}
                      style={{width: 22, height: 22}}
                    />
                  )}
                  style={{marginTop: 14}}
                />
              }
              label="Email"
              placeholder="Enter Email"
              onChangeText={text => setEmail(text)}
              value={email}
            />
          </View>
          <View
            style={{
              marginTop: DeviceHeigth * 0.03,
              marginLeft: 10,
            }}>
            <InputText
              value={password}
              onChangeText={text => setPassword(text)}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color={'#ADA4A5'}
                  style={{marginBottom: -1}}
                />
              }
              // right={
              //   <TextInput.Icon
              //     icon={() => (
              //       <TouchableOpacity
              //         onPress={() => {
              //           setShowPassword(!showPassword);
              //         }}>
              //         <Image
              //           source={showPassword ? localImage.EYE : localImage.EYE1}
              //           style={{width: 22, height: 22}}
              //           resizeMode="contain"
              //           tintColor="#ADA4A5"
              //         />
              //       </TouchableOpacity>
              //     )}
              //     style={{marginTop: 14}}
              //   />
              // }
              left={
                <TextInput.Icon
                  icon={() => (
                    <Image
                      source={localImage.Lock}
                      style={{width: 24, height: 24}}
                    />
                  )}
                  style={{marginTop: 14}}
                />
              }
              label="Password"
              placeholder="Enter Password"
              secureTextEntry={showPassword ? true : false}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setVerifyVisible(true);
              // navigation.navigate("MeditationConsent")
            }}
            style={styles.forgotView}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={{marginTop: DeviceHeigth * 0.2}}>
            <Button buttonText={'Login'} onPresh={loginFunction} />
          </View>

          <View
            style={{
              marginTop: DeviceHeigth * 0.03,
              alignSelf: 'center',

              marginLeft: -5,
            }}>
            <Text
              style={[styles.forgotText, {fontSize: 12, fontWeight: '400'}]}>
              Or Continue With
            </Text>
          </View>
        </KeyboardAvoidingView>
        <View style={{marginTop: DeviceHeigth * 0.02, paddingBottom: 10}}>
          {Platform.OS == 'android' && (
            <Button2 onGooglePress={GoogleSignup} onFBPress={FacebookLogin} />
          )}
          {Platform.OS == 'ios' && (
            <Button2 onGooglePress={GoogleSignup} onApplePress={onApplePress} />
          )}
        </View>
      </ScrollView>
      <CompleateProfileModal />
      <LoginCancelModal />
      <ModalView />
    </SafeAreaView>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  forgotView: {
    marginTop: DeviceHeigth * 0.025,
    alignSelf: 'flex-end',

    marginHorizontal: DeviceHeigth * 0.028,
  },
  TextContainer: {
    marginTop: DeviceHeigth * 0.09,
    marginHorizontal: DeviceHeigth * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LoginText: {
    fontSize: 20,
    fontFamily: 'Verdana',
    color: AppColor.LITELTEXTCOLOR,
    fontWeight: '600',
    marginTop: 10,
  },
  LoginText2: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',

    color: '#3A4750',
    lineHeight: 20,
    letterSpacing: 0,
  },
  forgotText: {
    fontSize: 12,
    color: AppColor.LITELTEXTCOLOR,
    fontWeight: '600',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: DeviceWidth * 0.8,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 24,
    color: '#000000',
  },

  textStyle: {
    color: 'black',

    textAlign: 'center',

    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    width: DeviceWidth * 0.3,
    height: DeviceHeigth * 0.05,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  LoginText3: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: AppColor.WHITE,
    lineHeight: 24,
    fontWeight: '700',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: DeviceHeigth * 0.6,
    width: '100%',
    backgroundColor: 'white',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  closeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Login;
