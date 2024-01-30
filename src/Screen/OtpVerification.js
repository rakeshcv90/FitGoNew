import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {StatusBar} from 'react-native';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../Component/Config';
import {localImage} from '../Component/Image';
import ActivityLoader from '../Component/ActivityLoader';
import {useDispatch, useSelector} from 'react-redux';

import axios from 'axios';
import {AppColor} from '../Component/Color';

import Button from '../Component/Button';

import {showMessage} from 'react-native-flash-message';
import {setUserId} from '../Component/ThemeRedux/Actions';

const OtpVerification = ({navigation, route}) => {
  const [forLoading, setForLoading] = useState(false);
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
  const [email, setEmail] = useState(route.params.email);
  const dispatch = useDispatch();
  // const [timeLeft, setTimeleft] = useState(60);
  // const [resendtxt, setResendTxt] = useState('Resend OTP');

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
      setForLoading(true);

      try {
        const OtpMsg = await axios(`${NewApi}${NewAppapi.OTPVerification}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            otp: OtpString,
            email: email,
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
          dispatch(setUserId(OtpMsg.data?.id));
          navigation.navigate('Yourself');
          // navigation.navigate('Login');
          //setTimeleft(60);
          setTxt1('');
          setTxt2('');
          setTxt3('');
          setTxt4('');

          //navigation.navigate('Login');
        } else {
          setForLoading(false);
        
          showMessage({
            message: OtpMsg.data.msg,
            floating: true,
            type: 'danger',
            icon: {icon: 'auto', position: 'left'},
          });

          //   setTimeleft(60);
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginHorizontal: DeviceHeigth * 0.03,
          marginTop: DeviceHeigth * 0.03,
        }}>
        <Image
          source={localImage.BACK}
          style={{width: 15, height: 15}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'position' : 'position'}
          contentContainerStyle={{flexGrow: 1}}>
          {forLoading ? <ActivityLoader /> : ''}
          <View style={styles.TextContainer}>
            <Text style={styles.LoginText}>Verify Account</Text>
            <Text style={[styles.LoginText2, {marginTop: DeviceHeigth * 0.02}]}>
              {'Verify your account by entering verification'}
            </Text>
            <Text style={[styles.LoginText2, {marginTop: DeviceHeigth * 0.0}]}>
              {' code we sent to '}{' '}
              <Text style={[styles.LoginText3]}>{route.params.email}</Text>
            </Text>
          </View>

          <View style={styles.OtpBox}>
            <TextInput
              style={[styles.OtpField, {marginHorizontal: 10}]}
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
              style={[styles.OtpField, {marginHorizontal: 10}]}
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
              style={[styles.OtpField, {marginHorizontal: 10}]}
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
              style={[styles.OtpField, {marginHorizontal: 10}]}
              ref={t4}
              underlineColor="transparent"
              mode="outlined"
              keyboardType="number-pad"
              maxLength={1}
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
          <TouchableOpacity
            style={{top: DeviceHeigth * 0.04, alignItems: 'center'}}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
          <View style={{marginTop: DeviceHeigth * 0.08}}>
            <Button
              buttonText={'Verify'}
              onPresh={() => {
                handleOTP();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
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
    fontSize: 12,
    fontFamily: 'Verdana',
    fontWeight: '400',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
    textAlign: 'center',
  },
  LoginText3: {
    fontSize: 14,
    fontFamily: 'Verdana',
    fontWeight: '700',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
    textAlign: 'center',
  },
  OtpField: {
    width: DeviceWidth * 0.15,
    backgroundColor: '#F8F9F9',
    height: DeviceHeigth * 0.07,
    borderRadius: 15,
    borderColor: '#E3E3E3',
    borderWidth: 1,
    justifyContent: 'center',

    textAlign: 'center',
  },
  OtpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: DeviceHeigth * 0.03,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Verdana',
    fontWeight: '700',
    color: AppColor.LITELTEXTCOLOR,
    lineHeight: 24,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
export default OtpVerification;
