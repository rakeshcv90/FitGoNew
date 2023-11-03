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
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {Api, Appapi, DeviceHeigth, DeviceWidth} from '../Component/Config';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
const Signup = ({navigation}) => {
  const route=useRoute();
  const data=route.params;
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
  const [checked, setChecked] = useState(false);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConformPassword] = useState('');
  const {defaultTheme} = useSelector(state => state);
  const [submitText, setSubmitText] = useState('Enter');
  const [isVisible, seIsvisible] = useState(false);
  const [timeLeft, setTimeleft] = useState(60);
  const [VerifyText, SetVerifyText] = useState('Verify');
  const [resendtxt,setResendTxt]=useState("Resend OTP")
  const ToggleVisibility = () => {
    seIsvisible(!isVisible);
  };
  useEffect(()=>{
    if(!data){
      setName("");
      setEmail("");
    }
    else{
      setName(data.userData[0].name);
      setEmail(data.userData[0].email)
    }
  },[])
  const [visible, setVisible] = useState(false);
  const OtpString = txt1 + txt2 + txt3 + txt4 + txt5 + txt6;
  const handleOTP = async () => {
    if (!txt1 || !txt2 || !txt3 || !txt4 || !txt5 || !txt6) {
      showMessage({
        message: 'Please enter the otp',
        statusBarHeight: getStatusBarHeight(),
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
        if (OtpMsg.data[0].msg == 'Email verified successfully') {
          SetVerifyText(false)
          showMessage({
            message: OtpMsg.data[0].msg,
            statusBarHeight: getStatusBarHeight(),
            floating: true,
            type: 'success',
            icon: {icon: 'auto', position: 'left'},
          })
          setVisible(false)
          setSubmitText('Enter');
          navigation.navigate("Login")
        } else {
          showMessage({
            message: OtpMsg.data[0].msg,
            statusBarHeight: getStatusBarHeight(),
            floating: true,
            type: 'danger',
            icon: {icon: 'auto', position: 'left'},
          });
        }
        SetVerifyText('Verify');
        setSubmitText('Enter');
      } catch (error) {
        SetVerifyText('Verify');
        console.log('OTPERROR', error);
      }
    }
  };
  const ResendOTP = async () => {
    try {
      let payload = new FormData();
      payload.append('email', Email);
      const data = await axios(`${Api}/${Appapi.ResendOTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (data.data[0].msg == 'otp sent') {
        setTimeleft(60);
        setTxt1('');
        setTxt2('');
        setTxt3('');
        setTxt4('');
        setTxt5('');
        setTxt6('');
       t1.current.focus()
        setSubmitText('Enter');
        setResendTxt("Resend OTP")
        showMessage({
          message: data.data[0].msg,
          statusBarHeight: Platform.OS="ios"?getStatusBarHeight():getStatusBarHeight(),
          floating: true,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });
      }
      else{
        setTimeleft(60);
        setTxt1('');
        setTxt2('');
        setTxt3('');
        setTxt4('');
        setTxt5('');
        setTxt6('');
       t1.current.focus();
        setSubmitText('Enter');
        setResendTxt("Resend OTP")
        showMessage({
          message: data.data[0].msg,
          statusBarHeight: getStatusBarHeight(),
          floating: true,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });
      }
    } catch (error) {
      setSubmitText('Enter');
      setResendTxt("Resend OTP")
    }
  };
  const ErrorHandler = () => {
    let reg = /\S+@\S+\.\S+/;
    let pass = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    if (!Name) {
      showMessage({
        message: 'Enter Your name',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!Email) {
      showMessage({
        message: 'Enter Your Email',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!reg.test(Email)) {
      showMessage({
        message: 'Invalid Format',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!Password) {
      showMessage({
        message: 'Please Enter Your Password',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (!ConfirmPassword) {
      showMessage({
        message: 'Please enter Confirm  Password',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (Password != ConfirmPassword) {
      showMessage({
        message: 'Confirm Password does not Match',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setSubmitText('Enter');
    } else if (checked == false) {
      showMessage({
        message: 'Please Accept Terms and Conditions',
        statusBarHeight: getStatusBarHeight(),
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
      console.log("datda",data.data)
      if (data.data[0].msg === 'Otp sent to your email') {
        showMessage({
          message: data.data[0].msg,
          statusBarHeight: getStatusBarHeight(),
          floating: true,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });
        setTxt1('');
        setTxt2('');
        setTxt3('');
        setTxt4('');
        setTxt5('');
        setTxt6('');
        setSubmitText('Enter');
        setResendTxt("Resend OTP")
        setSubmitText('Enter');
        setTimeleft(60);
        setVisible(true);
      } else if(data.data[0].status==0){
        try {
          let payload = new FormData();
          payload.append('email', Email);
          const data = await axios(`${Api}/${Appapi.ResendOTP}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: payload,
          })
          if (data.data[0].msg == 'otp sent') {
            setTimeleft(60);
            setTxt1('');
            setTxt2('');
            setTxt3('');
            setTxt4('');
            setTxt5('');
            setTxt6('');
            setSubmitText('Enter');
            setResendTxt("Resend OTP")
          }
          else{
            setTimeleft(60);
            setTxt1('');
            setTxt2('');
            setTxt3('');
            setTxt4('');
            setTxt5('');
            setTxt6('');
            setSubmitText('Enter');
            setResendTxt("Resend OTP")
            showMessage({
              message: data.data[0].msg,
              statusBarHeight: Platform="ios"?getStatusBarHeight():getStatusBarHeight(),
              floating: true,
              type: 'success',
              icon: {icon: 'auto', position: 'left'},
            });
          }
        } catch (error) {
          setSubmitText('Enter');
          setResendTxt("Resend OTP")
        }
        setVisible(true)
        setTimeleft(60)
        setTxt1('');
        setTxt2('');
        setTxt3('');
        setTxt4('');
        setTxt5('');
        setTxt6('');
        setSubmitText('Enter');
        setResendTxt("Resend OTP")
        showMessage({
          message: "We have sent an OTP to your email , Please verify your email first",
          type: 'warning',
          animationDuration:500,
          statusBarHeight: getStatusBarHeight(),
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });

      }
       else {
        showMessage({
          message: data.data[0],
          type: 'danger',
          statusBarHeight: getStatusBarHeight(),
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setSubmitText('Enter');
      }
    } catch (error) {
      setSubmitText('Enter');
      console.log('eror', error);
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
    <>
      <View style={{flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff'}}>
        <View
          style={{
            height: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
            backgroundColor: defaultTheme ? '#000' : '#fff',
          }}>
          <StatusBar
            barStyle={defaultTheme ? 'light-content' : 'dark-content'}
          />
        </View>
     
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'height '}
          style={{flex: 1}}>
            <Text
            style={[
              styles.SignUpText,
              {color: defaultTheme ? '#fff' : '#000'},
            ]}>
            SignUp
          </Text>
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
              activeUnderlineColor="#f39c1f"
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
              onChangeText={text => {
                setEmail(text.trim());
                setVisible(false);
              }}
              mode="flat"
              autoCapitalize="none"
              style={styles.AuthInput}
              activeUnderlineColor="#f39c1f"
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
              autoCapitalize="none"
              style={styles.AuthInput}
              activeUnderlineColor="#ec9706"
              value={Password}
              textColor={defaultTheme ? '#fff' : '#000'}
              secureTextEntry={!isVisible}
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
            <TextInput
              label={'Confirm Password'}
              onChangeText={text => setConformPassword(text.trim())}
              mode="flat"
              autoCapitalize="none"
              style={styles.AuthInput}
              activeUnderlineColor="#f39c1f"
              value={ConfirmPassword}
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
            />
            {visible ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  alignItems: 'center',
                  width: (DeviceWidth * 80) / 100,
                }}>
                <TouchableOpacity
                  style={[styles.checkboxContainer, checked && styles.Checked]}
                  onPress={() => setChecked(!checked)}>
                  <Text>
                    {' '}
                    {checked && <Text style={{color: '#fff'}}>&#10004;</Text>}
                  </Text>
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
            )}

            {visible ? null : (
              <TouchableOpacity
                style={styles.Tbutton}
                onPress={() => {
                  setSubmitText('Please Wait...');
                  ErrorHandler();
                }}>
                <Text style={{color: 'white', fontSize: 15}}>{submitText}</Text>
              </TouchableOpacity>
            )}
            {visible ? null : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
            )}

            {visible ? (
              <>
                <Text style={{color:defaultTheme?"#fff":"#000",fontSize:18,fontWeight:'600',marginVertical:10}}>OTP Verification</Text>
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
                    activeOutlineColor="#f39c1f"
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
                    activeOutlineColor="#f39c1f"
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
                <View style={{flexDirection: 'row'}}>
                  {timeLeft == 0 ? (
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: defaultTheme ? '#fff' : '#000',
                          fontSize: 16,
                        }}
                        onPress={() => {
                          setResendTxt("Please Wait...")
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
                      Resend OTP in{' '}
                      <Text style={{fontWeight: 'bold'}}>{timeLeft}</Text>{' '}
                      seconds
                    </Text>
                  )}
                </View>
                <View style={{marginVertical: 8}}>
                  <TouchableOpacity
                    style={{
                      width: (DeviceWidth * 40) / 100,
                      backgroundColor: '#f39c1f',
                      height: (DeviceHeigth * 4) / 100,
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
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // marginVertical:DeviceHeigth,
    justifyContent: 'center',
  },
  TextInput: {
    borderBottomWidth: 1,
    width: (DeviceWidth * 80) / 100,
    color: '#f39c1f',
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
    backgroundColor: '#f39c1f',
    borderColor: '#f39c1f',
  },
  Tbutton: {
    width: (DeviceWidth * 80) / 100,
    height: (DeviceHeigth * 6) / 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f39c1f',
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
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  modalContent: {
    height: DeviceHeigth / 4,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
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
    backgroundColor: 'red',
    width: (DeviceWidth * 50) / 100,
    height: (DeviceHeigth * 4) / 100,
    borderRadius: 100,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Signup;
