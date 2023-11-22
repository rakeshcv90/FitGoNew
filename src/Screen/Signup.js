import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  Modal,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {Api, Appapi, DeviceHeigth, DeviceWidth} from '../Component/Config';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {localImage} from '../Component/Image';
const Signup = ({navigation}) => {
  const route = useRoute();
  const data = route.params;
  const [checked, setChecked] = useState(false);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConformPassword] = useState('');
  const {defaultTheme} = useSelector(state => state);
  const [submitText, setSubmitText] = useState('Enter');
  const [isVisible, setIsvisible] = useState(false);
  const [isVisiblepassword, setIsvisiblepassword] = useState(false);
  const [IsVerifyVisible, setVerifyVisible] = useState(false);
  const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
  const Animation = useRef(new Animated.Value(0)).current;
  const ToggleVisibility = () => {
    setIsvisible(!isVisible);
  };
  const ToggleVisibilityPassword = () => {
    setIsvisiblepassword(!isVisiblepassword);
  };
  useEffect(() => {
    if (!data) {
      setName(Name);
      setEmail(Email);
    } else {
      setName(data.userData[0].name);
      setEmail(data.userData[0].email);
    }
  }, []);

  const ErrorHandler = () => {
    let reg = /\S+@\S+\.\S+/;
    const PasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×])[A-Za-z\d!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×]{8,}$/;
    if (!Name) {
      showMessage({
        message: 'Enter Your name',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!Email) {
      showMessage({
        message: 'Enter Your Email',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!reg.test(Email)) {
      showMessage({
        message: 'Invalid Format',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!Password) {
      showMessage({
        message: 'Please Enter Your Password',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!PasswordRegex.test(Password)) {
      showMessage({
        message: `Password must contain 1 Upper-Case letter,
           1 Lower-Case letter, 1 Digit, 1 Special 
           Character(@,$,-,^,&, !),and the length must be at least 8 characters`,
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!ConfirmPassword) {
      showMessage({
        message: 'Please enter Confirm  Password',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (Password != ConfirmPassword) {
      showMessage({
        message: 'Confirm Password does not Match',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (checked == false) {
      showMessage({
        message: 'Please Accept Terms and Conditions',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else {
      userdata();
    }
  };
  const userdata = async () => {
    try {
      const data = await axios(`${Api}/${Appapi.signup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: Name,
          email: Email,
          password: Password,
        },
      });
      setSubmitText('Enter');
      setSubmitText('Enter');
      setVerifyVisible(true);
      if (data.data[0].msg === 'Otp sent to your email') {
        showMessage({
          message: data.data[0].msg,
          statusBarHeight: StatusBar_Bar_Height,
          floating: true,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });

        setVerifyVisible(true);
      } else if (data.data[0].status == 0) {
        setSubmitText('Enter');
        setSubmitText('Enter');
        setVerifyVisible(true);
        showMessage({
          message:
            'We have sent an OTP to your email , Please verify your email first',
          type: 'warning',
          animationDuration: 500,
          statusBarHeight: StatusBar_Bar_Height,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setVerifyVisible(false)
        showMessage({
          message: "User already exists",
          type: 'danger',
          animationDuration:500,
          statusBarHeight: StatusBar_Bar_Height,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setSubmitText('Enter');
        navigation.navigate("Login")
      }
     
    } catch (error) {
      setSubmitText('Enter');
      console.log('eror', error);
    }
  };

  const ModalView = () => {
    const t1 = useRef();
    const t2 = useRef();
    const t3 = useRef();
    const t4 = useRef();
    const t5 = useRef();
    const t6 = useRef();
    const [txt1, setTxt1] = useState('');
    const [txt2, setTxt2] = useState('');
    const [txt3, setTxt3] = useState('');
    const [txt4, setTxt4] = useState('');
    const [txt5, setTxt5] = useState('');
    const [txt6, setTxt6] = useState('');
    const [VerifyText, SetVerifyText] = useState('Verify');
    const [timeLeft, setTimeleft] = useState(60);
    const [resendtxt, setResendTxt] = useState('Resend OTP');
    const OtpString = txt1 + txt2 + txt3 + txt4 + txt5 + txt6;
    const ResendOTP = async () => {
      try {
        let payload = new FormData();
        payload.append('email', Email);
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
          setTxt5('');
          setTxt6('');
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
      if (!txt1 || !txt2 || !txt3 || !txt4 || !txt5 || !txt6) {
        showMessage({
          message: 'Please enter the otp',
          statusBarHeight: StatusBar_Bar_Height,
          floating: true,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        SetVerifyText('Verify');
        setSubmitText('Enter');
      } else {
        try {
          let payload = new FormData();
          payload.append('email', Email);
          payload.append('otp', OtpString);
          const OtpMsg = await axios(`${Api}/${Appapi.OTPVerification}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: payload,
          });
          console.log(Email, OtpString, OtpMsg.data[0]);
          if (OtpMsg.data[0].msg == 'Email verified successfully') {
            setVerifyVisible(false);
            showMessage({
              message: 'Email verified successfully , Please Login',
              statusBarHeight: StatusBar_Bar_Height,
              floating: true,
              duration: 500,
              type: 'success',
              icon: {icon: 'auto', position: 'left'},
            });
            setResendTxt('Resend OTP');
            setTimeleft(60);
            setTxt1('');
            setTxt2('');
            setTxt3('');
            setTxt4('');
            setTxt5('');
            setTxt6('');
           
            setSubmitText('Enter');
            navigation.navigate('Login');
          } else {
            showMessage({
              message: OtpMsg.data[0].msg,
              statusBarHeight: StatusBar_Bar_Height,
              floating: true,
              type: 'danger',
              icon: {icon: 'auto', position: 'left'},
            });
            setResendTxt('Resend OTP');
            setTimeleft(60);
            setTxt1('');
            setTxt2('');
            setTxt3('');
            setTxt4('');
            setTxt5('');
            setTxt6('');
          }
          SetVerifyText('Verify');
          setSubmitText('Enter');
        } catch (error) {
          SetVerifyText('Verify');
          console.log('OTPERROR', error);
        }
      }
    };
    useEffect(() => {
      const timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeleft(timeLeft - 1);
        }
      }, 1000);
      return () => clearInterval(timer);
    }, [timeLeft]);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: defaultTheme ? '#000' : '#fff',
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
            <View style={[styles.modalContent ,{backgroundColor:defaultTheme?"#000":"#fff"}]}>
              <>
                <View
                  style={[
                    styles.closeButton,
                    ,
                    {
                      width: (DeviceWidth * 85) / 100,
                      marginTop: 8,
                      backgroundColor: defaultTheme ? '#000' : 'fff',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setVerifyVisible(false);
                    }}>
                    <Icons
                      name="close"
                      size={27}
                      color={defaultTheme ? '#fff' : '#000'}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: defaultTheme ? '#fff' : '#000',
                    fontSize: 18,
                    fontWeight: '600',
                    marginVertical: 10,
                  }}>
                  OTP Verification
                </Text>
                <View style={styles.OtpBox}>
                  <TextInput
                    style={styles.OtpField}
                    ref={t1}
                    underlineColor="transparent"
                    mode="outlined"
                    keyboardType="number-pad"
                    activeUnderlineColor="transparent"
                    maxLength={1}
                    activeOutlineColor="red"
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
                    activeOutlineColor="red"
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
                    activeOutlineColor="#C8170D"
                    value={txt4}
                    onChangeText={txt => {
                      if (txt.length >= 1) {
                        setTxt4(txt);
                        t5.current.focus();
                      } else {
                        setTxt4('');
                        t3.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    style={styles.OtpField}
                    ref={t5}
                    underlineColor="transparent"
                    mode="outlined"
                    keyboardType="number-pad"
                    activeUnderlineColor="transparent"
                    maxLength={1}
                    activeOutlineColor="red"
                    value={txt5}
                    onChangeText={txt => {
                      if (txt.length >= 1) {
                        setTxt5(txt);
                        t6.current.focus();
                      } else {
                        setTxt5('');
                        t4.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    textContentType="password"
                    style={styles.OtpField}
                    ref={t6}
                    underlineColor="transparent"
                    mode="outlined"
                    keyboardType="number-pad"
                    activeUnderlineColor="transparent"
                    maxLength={1}
                    activeOutlineColor="red"
                    value={txt6}
                    onChangeText={txt => {
                      if (txt.length >= 1) {
                        setTxt6(txt);
                        t6.current.focus();
                      } else {
                        setTxt6('');
                        t5.current.focus();
                      }
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', marginVertical: 5}}>
                  {timeLeft === 0 ? (
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: defaultTheme ? '#fff' : '#000',
                          fontSize: 16,
                          fontWeight:"700"
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
                        color: defaultTheme ? '#fff' : '#000',
                        fontSize: 16,
                      }}>
                      Resend OTP in
                      <Text style={{fontWeight: 'bold'}}> {timeLeft} </Text>
                      seconds
                    </Text>
                  )}
                </View>
                <View style={{marginBottom:6}}>
                  <TouchableOpacity
                    style={{
                      width: (DeviceWidth * 40) / 100,
                      backgroundColor: '#C8170D',
                      height: (DeviceHeigth * 4.5) / 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                    }}
                    onPress={() => {
                      SetVerifyText('Verifying...');
                      handleOTP();
                    }}>
                    <Text style={{color: '#fff', fontSize: 15}}>
                      {VerifyText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'position'}
        style={{marginVertical: DeviceHeigth * 0.07}}
        contentContainerStyle={{flexGrow: 1}}>
        <Text
          style={[styles.SignUpText, {color: defaultTheme ? '#fff' : '#000'}]}>
          SignUp
        </Text>
        <Image
          source={localImage.logo}
          style={{
            width: DeviceWidth * 0.5,
            height: DeviceWidth * 0.6,
            alignSelf: 'center',
          }}
          resizeMode='contain'
        />
        <View
          style={[
            styles.container,
            {backgroundColor: defaultTheme ? '#000' : '#fff'},
          ]}>
          <TextInput
            label={'Name'}
            onChangeText={text => {
              setName(text);
            }}
            mode="flat"
            autoCapitalize="none"
            style={styles.AuthInput}
            activeUnderlineColor="#C8170D"
            value={Name}
            textColor={defaultTheme ? '#fff' : '#000'}
            theme={{
              colors: {
                onSurfaceVariant: defaultTheme
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)',
              },
            }}
            underlineColor={
              defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
            }
          />
          <TextInput
            label={'Email'}
            keyboardType="email-address"
            onChangeText={text => {
              setEmail(text.trim());
              setVerifyVisible(false);
            }}
            mode="flat"
            autoCapitalize="none"
            style={styles.AuthInput}
            activeUnderlineColor="#C8170D"
            value={Email}
            textColor={defaultTheme ? '#fff' : '#000'}
            theme={{
              colors: {
                onSurfaceVariant: defaultTheme
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)',
              },
            }}
            underlineColor={
              defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
            }
          />
          <TextInput
            label={'Password'}
            onChangeText={text => setPassword(text.trim())}
            mode="flat"
            style={styles.AuthInput}
            activeUnderlineColor="#C8170D"
            value={Password}
            secureTextEntry={!isVisiblepassword}
            textColor={defaultTheme ? '#fff' : '#000'}
            underlineColor={
              defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
            }
            theme={{
              colors: {
                onSurfaceVariant: defaultTheme
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)',
              },
            }}
            right={
              <TextInput.Icon
                icon={isVisiblepassword ? 'eye' : 'eye-off'}
                onPress={ToggleVisibilityPassword}
                theme={{
                  colors: {
                    onSurfaceVariant: defaultTheme
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(0,0,0,0.6)',
                  },
                }}
              />
            }
          />
          <TextInput
            label={'Confirm Password'}
            onChangeText={text => setConformPassword(text.trim())}
            mode="flat"
            style={styles.AuthInput}
            activeUnderlineColor="#C8170D"
            value={ConfirmPassword}
            secureTextEntry={!isVisible}
            textColor={defaultTheme ? '#fff' : '#000'}
            underlineColor={
              defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
            }
            theme={{
              colors: {
                onSurfaceVariant: defaultTheme
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)',
              },
            }}
            right={
              <TextInput.Icon
                icon={isVisible ? 'eye' : 'eye-off'}
                onPress={ToggleVisibility}
                theme={{
                  colors: {
                    onSurfaceVariant: defaultTheme
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(0,0,0,0.6)',
                  },
                }}
              />
            }
          />
         
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                position: 'relative',
                alignItems: 'center',
                width: (DeviceWidth * 80) / 100,
              }}>
              <TouchableOpacity onPress={() => setChecked(!checked)}>
                {checked ? (
                  <Icons
                    name="checkbox-marked"
                    size={27}
                    style={{marginVertical: 15, marginRight: 10}}
                    color={'#C8170D'}
                  />
                ) : (
                  <Icons
                    name="checkbox-blank-outline"
                    size={27}
                    style={{marginVertical: 15, marginRight: 10}}
                    color={
                      defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                    }
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TermaAndCondition');
                }}>
                <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                  I Agree to Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
         
            <TouchableOpacity
              style={styles.Tbutton}
              onPress={() => {
                setSubmitText('Please Wait...');
                ErrorHandler();
              }}>
              <Text style={{color: 'white', fontSize: 15}}>{submitText}</Text>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                Already have an account ?{' '}
                <Text
                  style={{
                    color: defaultTheme ? '#fff' : '#000',
                    fontWeight: 'bold',
                  }}>
                  Login
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {IsVerifyVisible ? <ModalView /> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: 'center',
    // marginVertical:DeviceHeigth,
    justifyContent: 'center',
  },
  TextInput: {
    borderBottomWidth: 1,
    width: (DeviceWidth * 80) / 100,
    color: '#C8170D',
    borderBottomColor: '#adadad',
  },
  checkboxContainer: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#adadad',
    alignItems: 'center',
    borderRadius: 1,
    marginVertical: 15,
    marginRight: 10,
  },
  Checked: {
    backgroundColor: '#C8170D',
    borderColor: '#C8170D',
  },
  Tbutton: {
    width: (DeviceWidth * 80) / 100,
    height: (DeviceHeigth * 6) / 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C8170D',
    marginBottom: 15,
  },
  SignUpText: {
    fontSize: 25,
    color: 'black',
    alignItems: 'flex-start',
    textAlign: 'center',
    marginTop: '2%',
  },
  AuthInput: {
    marginBottom: (DeviceHeigth * 1) / 100,
    backgroundColor: 'transparent',
    width: (DeviceWidth * 80) / 100,
  },
  OtpField: {
    width: 40,
    height: 40,
    margin: 5,
  },
  OtpBox: {
    flexDirection: 'row',
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //marginHorizontal: 15,
  },
  modalContent: {
    height: DeviceHeigth / 3.5,
    width: '90%',
    backgroundColor: 'white',
 
    borderRadius: 20,
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
