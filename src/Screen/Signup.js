import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor} from '../Component/Color';
import {
  DeviceHeigth,
  DeviceWidth,
  NewAppapi,
  NewApi,
} from '../Component/Config';
import InputText from '../Component/InputText';
import {localImage} from '../Component/Image';
import Button2 from '../Component/Button2';
import Button from '../Component/Button';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  GoogleAuthProvider,
} from '@react-native-google-signin/google-signin';
import {StatusBar} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import ActivityLoader from '../Component/ActivityLoader';
import {setUserId, setUserProfileData} from '../Component/ThemeRedux/Actions';
import {LoginManager, Profile} from 'react-native-fbsdk-next';
import AnimatedLottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native-paper';
import {navigationRef} from '../../App';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  RemoteMessage,
  requestPermissionforNotification,
} from '../Component/Helper/PushNotification';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const Signup = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [Emailsend, setEmailSent] = useState('abc@gmail.com');
  const [IsVerifyVisible, setVerifyVisible] = useState(false);
  const [isVisiblepassword, setIsvisiblepassword] = useState(true);
  const [checked, setChecked] = useState(false);
  const [forLoading, setForLoading] = useState(false);
  const [deviceId, setDeviceId] = useState(0);
  const [appVersion, setAppVersion] = useState(0);
  const dispatch = useDispatch();

  const {getFcmToken} = useSelector(state => state);

  useEffect(() => {
    requestPermissionforNotification(dispatch);
    RemoteMessage();
  }, []);
  const PasswordRegex =
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×])[A-Za-z\d!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×]{8,}$/;
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required('Full Name is required'),
    name: Yup.string()
      .required('Full Name is Required')
      .matches(/^[A-Za-z].*/, 'First Name must start with a character')
      .min(3, 'First Name must contain atleast 3 characters'),

    email: Yup.string()
      .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
      .required('Email is Required'),
    // mobile: Yup.string().min(10).required('Phone No. is required'),

    password: Yup.string()
      .matches(
        PasswordRegex,
        'Password must contain 1 Upper-Case letter, 1 Lower-Case letter, 1 Digit, 1 Special Character(@,$,-,^,&, !), and the length must be at least 8 characters',
      )
      .required('Password is Required'),
    repeat_password: Yup.string()
      .matches(
        PasswordRegex,
        'Password must contain 1 Upper-Case letter, 1 Lower-Case letter, 1 Digit, 1 Special Character(@,$,-,^,&, !), and the length must be at least 8 characters',
      )
      .required('Confirm Password is Required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  useEffect(() => {
    GoogleSignin.configure({
      //scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '60298593797-kkelutkvu5it955cebn8dhi1n543osi8.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  useEffect(() => {
    DeviceInfo.syncUniqueId().then(uniqueId => {
      setDeviceId(uniqueId);
    });
    setAppVersion(VersionNumber.appVersion);
  });

  const GoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken, user} = await GoogleSignin.signIn();

      socialLogiIn(user, idToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
      }
    }
  };
  const FacebookSignup = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          alert('Cancel');
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
  const onApplePress = async () => {
    await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(
        res => {
          appleSignUp(res);
        },
        error => {
          console.log('Apple Login Error', error);
        },
      );
  };
  const appleSignUp = async res => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.signup}`, {
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
          version: appVersion,
          devicetoken: getFcmToken,
        },
      });

      if (
        data.data.msg == 'User already exists' &&
        data.data.profile_compl_status == 0
      ) {
        setForLoading(false);
        console.log('Compleate Profile');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
      } else if (
        data.data.msg == 'User registered via social login' &&
        data.data.profile_compl_status == 0
      ) {
        setForLoading(false);
        console.log('Compleate Profile1');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
      } else if (
        data.data.msg == 'User already exists' &&
        data.data.profile_compl_status == 1
      ) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
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
        // console.log('user not found');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
      }
    } catch (error) {
      setForLoading(false);
      console.log('Apple Signup Error', error?.response);
    }
  };
  const handleFormSubmit = async (value, action) => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.signup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: value.name,
          email: value.email,
          password: value.password,
          signup_type: 'form',
          social_id: 0,
          social_token: 0,
          social_type: '',
          //deviceid: deviceId,
          version: appVersion,
          devicetoken: getFcmToken,
        },
      });

      setForLoading(false);
      if (data?.data?.status == 0) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          floating: true,
          duration: 5000,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });
        setVerifyVisible(true);
        setEmailSent(data.data.email);
        action.resetForm();
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
        showMessage({
          message: data.data.msg,
          floating: true,
          duration: 500,
          type: 'error',
          icon: {icon: 'auto', position: 'left'},
        });
        //action.resetForm();
      }
    } catch (error) {
      console.log('Form Signup Error', error?.response?.data);
      setForLoading(false);
    }
  };
  const socialLogiIn = async (value, token) => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.signup}`, {
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
          //  deviceid: deviceId,
          version: appVersion,
          devicetoken: getFcmToken,
        },
      });

      if (
        data.data.msg == 'User already exists' &&
        data.data.profile_compl_status == 0
      ) {
        setForLoading(false);
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
        await GoogleSignin.signOut();
      } else if (
        data.data.msg == 'User registered via social login' &&
        data.data.profile_compl_status == 0
      ) {
        setForLoading(false);
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
        await GoogleSignin.signOut();
      } else if (
        data.data.msg == 'User already exists' &&
        data.data.profile_compl_status == 1
      ) {
        setForLoading(false);
        dispatch(setUserId(data.data?.id));
        showMessage({
          message: data.data.msg,
          floating: true,
          animationDuration: 1000,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
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
        setForLoading(false);
        // console.log('user not found');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
        await GoogleSignin.signOut();
      }
    } catch (error) {
      setForLoading(false);
      console.log('google Signup Error', error?.response);
      await GoogleSignin.signOut();
    }
  };
  const socialFacebookLogiIn = async value => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.signup}`, {
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
          // deviceid: deviceId,
          version: appVersion,
          devicetoken: getFcmToken,
        },
      });

      if (
        data.data.msg == 'User already exists' &&
        data.data.profile_compl_status == 0
      ) {
        setForLoading(false);
        console.log('Compleate Profile');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
      } else if (
        data.data.msg == 'User registered via social login' &&
        data.data.profile_compl_status == 0
      ) {
        setForLoading(false);
        console.log('Compleate Profile1');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
      } else if (
        data.data.msg == 'User already exists' &&
        data.data.profile_compl_status == 1
      ) {
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 1000,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        // navigationRef.navigate('BottomTab');
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
        // console.log('user not found');
        dispatch(setUserId(data.data?.id));
        navigationRef.navigate('Yourself');
      }
    } catch (error) {
      setForLoading(false);
      console.log('FaceBook Signup Error', error?.response);
    }
  };
  const ModalView = () => {
    const [forLoading, setForLoading] = useState(false);
    const t1 = useRef();
    const t2 = useRef();
    const t3 = useRef();
    const t4 = useRef();

    const [txt1, setTxt1] = useState('');
    const [txt2, setTxt2] = useState('');
    const [txt3, setTxt3] = useState('');
    const [txt4, setTxt4] = useState('');
    const [VerifyText, SetVerifyText] = useState('Verify');
    const [timeLeft, setTimeleft] = useState(60);
    const [resendtxt, setResendTxt] = useState('Resend OTP');
    const OtpString = txt1 + txt2 + txt3 + txt4;
    useEffect(() => {
      const timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeleft(timeLeft - 1);
        }
      }, 1000);
      return () => clearInterval(timer);
    }, [timeLeft]);
    const ResendOTP = async () => {
      try {
        let payload = new FormData();
        payload.append('email', Emailsend);
        const OTPdata = await axios(`${Api}/${Appapi.ResendOTP}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        });
        if (OTPdata) {
          setResendTxt('Resend OTP');
          setTimeleft(60);
          setTxt1('');
          setTxt2('');
          setTxt3('');
          setTxt4('');

          showMessage({
            message: 'OTP has been sent to your email',
            type: 'success',
            duration: 500,
            statusBarHeight: StatusBar_Bar_Height,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
        } else {
          showMessage({
            message: OTPdata.data[0].msg,
            type: 'success',
            statusBarHeight: StatusBar_Bar_Height,
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
        }
      } catch (error) {
        console.log('erere', error);
        setResendTxt('Resent OTP');
        setTimeleft(60);
      }
    };
    const handleOTP = async () => {
      const OtpString = txt1 + txt2 + txt3 + txt4;

      if (!txt1 || !txt2 || !txt3 || !txt4) {
        showMessage({
          message: 'Please enter the otp',

          floating: true,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        // setForLoading(true);

        try {
          const OtpMsg = await axios(`${NewApi}${NewAppapi.OTPVerification}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: {
              otp: OtpString,
              email: Emailsend,
            },
          });
          if (OtpMsg.data.msg == 'Email verified successfully') {
            setForLoading(false);
            showMessage({
              message: 'Email verified successfully!',
              floating: true,
              duration: 500,
              type: 'success',
              icon: {icon: 'auto', position: 'left'},
            });

            getProfileData(OtpMsg.data?.id);
            dispatch(setUserId(OtpMsg.data?.id));
            setVerifyVisible(false);
            setTxt1('');
            setTxt2('');
            setTxt3('');
            setTxt4('');
          } else {
            setForLoading(false);
            showMessage({
              message: OtpMsg.data.msg,
              floating: true,
              type: 'danger',
              icon: {icon: 'auto', position: 'left'},
            });
            setTxt1('');
            setTxt2('');
            setTxt3('');
            setTxt4('');
          }
        } catch (error) {
          setForLoading(false);
          console.log('OTPERROR', error);
        }
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
            version: appVersion,
          },
        });

        if (data.data.profile) {
          setForLoading(false);
          dispatch(setUserProfileData(data.data.profile));
          navigationRef.navigate('Yourself');
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
          navigationRef.navigate('Yourself');
        }
      } catch (error) {
        console.log('User Profile Error', error);
        setForLoading(false);
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
          visible={true}
          onRequestClose={() => {
            setVerifyVisible(false);
          }}>
          <View
            style={[
              styles.modalContainer,
              {backgroundColor: 'transparent', flex: 1},
            ]}>
            {forLoading ? <ActivityLoader /> : ''}
            <KeyboardAvoidingView
              // style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'position' : ''}>
              <View style={[styles.modalContent, {backgroundColor: '#fff'}]}>
                <>
                  <View
                    style={[
                      styles.closeButton,
                      ,
                      {
                        width: (DeviceWidth * 85) / 100,
                        marginTop: 8,
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

                  <Text
                    style={{
                      color: '#000',
                      fontSize: 22,
                      fontWeight: '600',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    Verify Account
                  </Text>
                  <Text
                    style={{
                      color: '#1E1E1E',
                      fontSize: 12,
                      fontWeight: '600',
                      fontFamily: 'Poppins',
                      marginTop: 10,
                      marginBottom: 5,
                    }}>
                    {'Verify your account by entering verification code'}
                  </Text>
                  <Text
                    style={{
                      color: '#1E1E1E',
                      fontSize: 12,
                      fontWeight: '600',
                      textAlign: 'center',
                      fontFamily: 'Poppins',
                      marginBottom: 17,
                    }}>
                    {' '}
                    we sent to{' '}
                    <Text
                      style={{
                        color: '#1E1E1E',
                        fontSize: 13,
                        fontWeight: '700',
                        textAlign: 'center',
                        fontFamily: 'Poppins',
                        marginBottom: 15,
                      }}>
                      {Emailsend}
                    </Text>
                  </Text>
                  <View style={styles.OtpBox}>
                    <TextInput
                      style={styles.OtpField}
                      ref={t1}
                      underlineColor="transparent"
                      mode="outlined"
                      outlineStyle={{borderRadius: 10}}
                      outlineColor={AppColor.BORDERCOLOR}
                      keyboardType="number-pad"
                      activeUnderlineColor="transparent"
                      maxLength={1}
                      activeOutlineColor="#E3E3E3"
                      value={txt1}
                      onChangeText={txt => {
                        if (txt.length >= 1) {
                          setTxt1(txt);
                          t2.current.focus();
                        } else {
                          setTxt1('');
                          t1.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      style={styles.OtpField}
                      ref={t2}
                      underlineColor="transparent"
                      mode="outlined"
                      keyboardType="number-pad"
                      activeUnderlineColor="transparent"
                      maxLength={1}
                      outlineStyle={{borderRadius: 10}}
                      outlineColor={AppColor.BORDERCOLOR}
                      activeOutlineColor="#E3E3E3"
                      value={txt2}
                      onChangeText={txt => {
                        if (txt.length >= 1) {
                          setTxt2(txt);
                          t3.current.focus();
                        } else {
                          setTxt2('');
                          t1.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      style={styles.OtpField}
                      ref={t3}
                      underlineColor="transparent"
                      mode="outlined"
                      keyboardType="number-pad"
                      activeUnderlineColor="transparent"
                      maxLength={1}
                      outlineStyle={{borderRadius: 10}}
                      outlineColor={AppColor.BORDERCOLOR}
                      activeOutlineColor="#C8170D"
                      value={txt3}
                      onChangeText={txt => {
                        if (txt.length >= 1) {
                          setTxt3(txt);
                          t4.current.focus();
                        } else {
                          setTxt3('');
                          t2.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      style={styles.OtpField}
                      ref={t4}
                      underlineColor="transparent"
                      mode="outlined"
                      keyboardType="number-pad"
                      activeUnderlineColor="transparent"
                      maxLength={1}
                      outlineStyle={{borderRadius: 10}}
                      outlineColor={AppColor.BORDERCOLOR}
                      activeOutlineColor="#C8170D"
                      value={txt4}
                      onChangeText={txt => {
                        if (txt.length >= 1) {
                          setTxt4(txt);
                          t4.current.focus();
                        } else {
                          setTxt4('');
                          t3.current.focus();
                        }
                      }}
                    />
                  </View>
                  <View style={{flexDirection: 'row', marginVertical: 15}}>
                    {timeLeft === 0 ? (
                      <TouchableOpacity>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 16,
                            fontWeight: '700',
                          }}
                          onPress={() => {
                            setResendTxt('Please Wait...');
                            ResendOTP();
                          }}>
                          {resendtxt}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 16,
                        }}>
                        Resend OTP in
                        <Text style={{fontWeight: 'bold'}}> {timeLeft} </Text>
                        second
                      </Text>
                    )}
                  </View>
                  <View style={{marginBottom: 10}}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={{
                        width: (DeviceWidth * 40) / 100,
                        backgroundColor: '#C8170D',
                        height: (DeviceHeigth * 4.5) / 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                      }}
                      onPress={() => {
                        handleOTP();
                      }}>
                      <LinearGradient
                        colors={[AppColor.RED1, AppColor.RED]}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        style={{
                          width: (DeviceWidth * 40) / 100,
                          height: (DeviceHeigth * 4.5) / 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 15,
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          Verify Code
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
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
          behavior={Platform.OS == 'ios' ? 'padding' : undefined}
          contentContainerStyle={{flexGrow: 1}}>
          {forLoading ? <ActivityLoader /> : ''}

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              repeat_password: '',
            }}
            onSubmit={(values, action) => {
              if (checked) {
                handleFormSubmit(values, action);
              } else {
                showMessage({
                  message: 'Please Check Term & Condition',
                  type: 'danger',
                  animationDuration: 500,
                  // statusBarHeight: StatusBar_Bar_Height+,
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
              }
            }}
            validationSchema={validationSchema}>
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
                    marginTop: DeviceHeigth * 0.05,
                    marginLeft: 10,
                  }}>
                  <InputText
                    errors={errors.name}
                    touched={touched.name}
                    value={values.name}
                    onBlur={handleBlur('name')}
                    onChangeText={handleChange('name')}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Image
                            source={localImage.PROFILE}
                            style={{width: 22, height: 22}}
                          />
                        )}
                        style={{marginTop: 14}}
                      />
                    }
                    label="Full Name"
                    placeholder="Full Name"
                  />
                </View>
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
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.03,
                    marginLeft: 10,
                  }}>
                  <InputText
                    errors={errors.password}
                    touched={touched.password}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    onChangeText={handleChange('password')}
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
                    //       style={{borderWidth:1}}
                    //         onPress={() => {
                    //           setShowPassword(!showPassword);
                    //         }}>
                    //         <Image
                    //           source={
                    //             showPassword ? localImage.EYE : localImage.EYE1
                    //           }
                    //           style={{width: 22, height: 22,}}
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
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.03,
                    marginLeft: 10,
                  }}>
                  <InputText
                    errors={errors.repeat_password}
                    touched={touched.repeat_password}
                    value={values.repeat_password}
                    onBlur={handleBlur('repeat_password')}
                    onChangeText={handleChange('repeat_password')}
                    right={
                      <TextInput.Icon
                        icon={isVisiblepassword ? 'eye-off' : 'eye'}
                        onPress={() => setIsvisiblepassword(!isVisiblepassword)}
                        color={'#ADA4A5'}
                        style={{marginBottom: -1}}
                      />
                    }
                    // right={
                    //   <TextInput.Icon
                    //     icon={() => (
                    //       <TouchableOpacity
                    //         onPress={() => {
                    //           setIsvisiblepassword(!isVisiblepassword);
                    //         }}>
                    //         <Image
                    //           source={
                    //             isVisiblepassword
                    //               ? localImage.EYE
                    //               : localImage.EYE1
                    //           }
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
                    label="Confirm Password"
                    placeholder="Enter Confirm Password"
                    secureTextEntry={isVisiblepassword ? true : false}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '85%',
                    alignSelf: 'center',
                    paddingRight: DeviceWidth * 0.08,
                    marginTop: DeviceHeigth * 0.02,
                  }}>
                  <TouchableOpacity onPress={() => setChecked(!checked)}>
                    {checked ? (
                      <Icons
                        name="checkbox-marked"
                        size={30}
                        style={{
                          marginVertical: 15,
                          marginRight: 10,
                        }}
                        color={AppColor.CHECKBOXCOLOR}
                      />
                    ) : (
                      <Icons
                        name="checkbox-blank-outline"
                        size={30}
                        style={{
                          marginVertical: 15,
                          marginRight: 10,
                        }}
                        color={AppColor.CHECKBOXCOLOR}
                      />
                    )}
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.policyText}>
                      By continuing you accept our{' '}
                      <Text
                        onPress={() => {
                          navigationRef.navigate('TermaAndCondition');
                        }}
                        style={styles.policyText1}>
                        Privacy Policy
                      </Text>{' '}
                      and
                      <Text
                        style={styles.policyText1}
                        onPress={() => {
                          navigationRef.navigate('TermaAndCondition');
                        }}>
                        {' '}
                        Terms of use
                      </Text>{' '}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: DeviceHeigth * 0.05}}>
                  <Button buttonText={'Register'} onPresh={handleSubmit} />
                  {/* <Button
                    buttonText={'Register'}
                    onPresh={() => {
                      setVerifyVisible(true);
                    }}
                  /> */}
                </View>
              </>
            )}
          </Formik>
          {IsVerifyVisible ? <ModalView /> : ''}
        </KeyboardAvoidingView>
        <View
          style={{
            marginTop: DeviceHeigth * 0.03,
            alignSelf: 'center',
            marginRight: -DeviceWidth * 0.01,
          }}>
          <Text style={[styles.forgotText, {fontSize: 12, fontWeight: '400'}]}>
            Or Continue With
          </Text>
        </View>

        <View style={{marginTop: DeviceHeigth * 0.02, paddingBottom: 10}}>
          <Button2
            onGooglePress={GoogleSignup}
            onApplePress={onApplePress}
            onFBPress={FacebookSignup}
          />
        </View>
      </ScrollView>
      {/* <ModalView /> */}
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
    marginRight: DeviceWidth * 0.1,
  },
  TextContainer: {
    marginTop: DeviceHeigth * 0.09,
    marginHorizontal: DeviceHeigth * 0.03,
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
  policyText: {
    // underline: {textDecorationLine: 'underline'},
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '400',
    color: AppColor.BLACK,
  },
  policyText1: {
    // underline: {textDecorationLine: 'underline'},
    fontSize: 15,
    lineHeight: 15,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  LoginText3: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: AppColor.WHITE,
    lineHeight: 24,
    fontWeight: '700',
  },
  OtpField: {
    width: 50,
    height: 55,
    margin: 5,
    backgroundColor: '#F8F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  OtpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: DeviceHeigth * 0.4,
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
  Verify: {
    //backgroundColor: 'red',
    width: (DeviceWidth * 50) / 100,
    height: (DeviceHeigth * 4) / 100,
    borderRadius: 100,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Signup;
