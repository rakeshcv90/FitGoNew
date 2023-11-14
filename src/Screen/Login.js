import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {localImage} from '../Component/Image';
import {Api, DeviceHeigth, DeviceWidth, Appapi} from '../Component/Config';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LoginLoader from '../Component/LoginLoader';
import {getStatusBarHeight} from 'react-native-status-bar-height';
// import { GoogleSignin,statusCodes ,GoogleSigninButton} from 'react-native-google-signin';
const Login = () => {
  //  useEffect(()=>{
  //   GoogleSignin.configure({
  //     webClientId:"512109926378-h2m6a1a229bh9bfsv6h6ss78e9hm2lcq.apps.googleusercontent.com"
  //   })
  //  },[])
  const navigation = useNavigation();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [submitText, setsubmitText] = useState('ENTER');
  const [isVisible, seIsvisible] = useState(false);
  const {defaultTheme} = useSelector(state => state);
  const [isLoaded, setIsLoaded] = useState(false);
  const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
  // const GoogleLogin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log("userInfo",userInfo.user)
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //       console.log("erroe",error)
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };
  const ToggleVisibility = () => {
    seIsvisible(!isVisible);
  };
  const ErrorHandler = async () => {
    let reg = /\S+@\S+\.\S+/;
    let pass = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    if (!Email) {
      showMessage({
        message: 'Please Enter Your Mail',
        statusBarHeight: StatusBar_Bar_Height,
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setsubmitText('ENTER');
    } else if (!reg.test(Email)) {
      showMessage({
        message: 'Invalid Format',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setsubmitText('ENTER');
    } else if (!Password) {
      showMessage({
        message: 'Please Enter Your Password',
        statusBarHeight: getStatusBarHeight(),
        floating: true,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setsubmitText('ENTER');
    } else {
      try {
        const data = await axios(`${Api}/${Appapi.login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            email: Email,
            password: Password,
          },
        });

        if (data.data[0].status == 0) {
          setEmail('');
          setPassword('');
          // console.log('data', data.data[0]);
          navigation.navigate('Signup', {userData: data.data});
          setsubmitText('ENTER');
          setIsLoaded(true);
          showMessage({
            message: 'Your email is not verified , Please verify your email ',
            type: 'warning',
            animationDuration: '750',
            statusBarHeight: getStatusBarHeight(),
            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
        } else if (data.data[0].msg == 'Login successful') {
          showMessage({
            message: data.data[0].msg,
            statusBarHeight: getStatusBarHeight(),
            floating: true,
            type: 'success',
            animationDuration: 500,
            icon: {icon: 'auto', position: 'left'},
          });
          await AsyncStorage.setItem('Data', JSON.stringify(data.data));
          setIsLoaded(true);

          navigation.navigate('DrawerNavigation')

          setsubmitText('ENTER');
        } else {
          setIsLoaded(true);
          showMessage({
            message: data.data[0].msg,
            statusBarHeight: getStatusBarHeight(),
            floating: true,
            type: 'danger',
            animationDuration: 500,
            icon: {icon: 'auto', position: 'left'},
          });
          setsubmitText('ENTER');
        }
      } catch (error) {
        console.log('eror11111111', error);
        setsubmitText('ENTER');
      }
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: defaultTheme ? '#000' : '#fff'},
      ]}>
      <StatusBar
        barStyle={defaultTheme ? 'light-content' : 'dark-content'}
        backgroundColor={defaultTheme ? '#000' : '#fff'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        style={{flex: 1}}>
        <View
          style={{
            backgroundColor: defaultTheme ? '#000' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            resizeMode="cover"
            style={styles.logo}
            source={localImage.logo}
          />
          <TextInput
            label={'Email'}
            keyboardType="email-address"
            onChangeText={text => {
              setEmail(text);
            }}
            mode="flat"
            autoCapitalize="none"
            style={styles.AuthInput}
            activeUnderlineColor="#941000"
            underlineColor={
              defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
            }
            value={Email}
            textColor={defaultTheme ? '#fff' : '#000'}
            theme={{
              colors: {
                onSurfaceVariant: defaultTheme
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)',
              },
            }}
          />
          <TextInput
            label={'Password'}
            onChangeText={text => setPassword(text)}
            mode="flat"
            secureTextEntry={!isVisible}
            style={styles.AuthInput}
            activeUnderlineColor="#941000"
            underlineColor={
              defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
            }
            value={Password}
            textColor={defaultTheme ? '#fff' : '#000'}
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
                theme={{
                  colors: {
                    onSurfaceVariant: defaultTheme
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(0,0,0,0.6)',
                  },
                }}
                onPress={ToggleVisibility}
              />
            }
          />

          <View
            style={{
              width: (DeviceWidth * 80) / 100,
              alignItems: 'flex-end',
              backgroundColor: defaultTheme ? '#000' : '#fff',
            }}>
            <TouchableOpacity
              style={[
                styles.Forget,
                {backgroundColor: defaultTheme ? '#000' : '#fff'},
              ]}
              onPress={() => {
                navigation.navigate('ForgetPassword');
              }}>
              <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                Forget Password ?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.Tbutton}
            onPress={() => {
              setsubmitText('Please Wait...');
              ErrorHandler();
            }}>
            <Text style={{color: 'white', fontSize: 15}}>{submitText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <Text
              style={{
                color: defaultTheme ? '#fff' : '#000',
                marginBottom: (DeviceHeigth * 5) / 100,
              }}>
              Don't have an account ?{' '}
              <Text
                style={{
                  color: defaultTheme ? '#fff' : '#000',
                  fontWeight: 'bold',
                }}>
                SignUp
              </Text>
            </Text>
          </TouchableOpacity>
          {/* <GoogleSigninButton size={GoogleSigninButton.Size.Wide} onPress={()=>{GoogleLogin()}}/>
          <TouchableOpacity style={{backgroundColor:"red" ,marginTop:10}}><Text>Sign Out</Text></TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: DeviceWidth * 0.6,
    height: DeviceWidth * 0.7,
    alignSelf: 'center',
  },
  Forget: {
    width: (DeviceWidth * 50) / 100,
    marginBottom: (DeviceHeigth * 2) / 100,
    backgroundColor: 'white',
    // borderWidth:1,
    alignItems: 'flex-end',
  },
  Tbutton: {
    width: (DeviceWidth * 80) / 100,
    height: (DeviceHeigth * 6) / 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#941000',
    marginBottom: (DeviceHeigth * 2) / 100,
  },
  AuthInput: {
    marginBottom: (DeviceHeigth * 1) / 100,
    backgroundColor: 'transparent',
    width: (DeviceWidth * 80) / 100,
  },
  SignUpText: {
    fontSize: 25,
    color: 'black',
    alignItems: 'flex-start',
    textAlign: 'center',
    marginBottom: 50,
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
  OtpField: {
    width: 40,
    height: 40,
    margin: 5,
  },
  OtpBox: {
    flexDirection: 'row',
  },
});
export default Login;
