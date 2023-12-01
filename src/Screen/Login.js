// import {
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   BackHandler,
//   Alert,
//   KeyboardAvoidingView,
//   StatusBar,
//   Platform,
// } from 'react-native';
// import React, {useEffect, useState, useRef} from 'react';
// import {localImage} from '../Component/Image';
// import {Api, DeviceHeigth, DeviceWidth, Appapi} from '../Component/Config';
// import {TextInput} from 'react-native-paper';
// import {showMessage} from 'react-native-flash-message';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useDispatch, useSelector} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
// import LoginLoader from '../Component/LoginLoader';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// import { updatePhoto ,Is_user_Login} from '../Component/ThemeRedux/Actions';
// // import { GoogleSignin,statusCodes ,GoogleSigninButton} from 'react-native-google-signin';
// const Login = () => {
//   //  useEffect(()=>{
//   //   GoogleSignin.configure({
//   //     webClientId:"512109926378-h2m6a1a229bh9bfsv6h6ss78e9hm2lcq.apps.googleusercontent.com"
//   //   })
//   //  },[])
//   const navigation = useNavigation();
//   const [Email, setEmail] = useState('');
//   const [Password, setPassword] = useState('');
//   const [submitText, setsubmitText] = useState('ENTER');
//   const [isVisible, seIsvisible] = useState(false);
//   const {defaultTheme} = useSelector(state => state);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
//   const {ProfilePhoto}=useSelector(state=>state)
//   const dispatch=useDispatch();
//   const ToggleVisibility = () => {
//     seIsvisible(!isVisible);
//   };
//   const ErrorHandler = async () => {
//     let reg = /\S+@\S+\.\S+/;
//     let pass = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
//     if (!Email) {
//       showMessage({
//         message: 'Please Enter Your Mail',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setsubmitText('ENTER');
//     } else if (!reg.test(Email)) {
//       showMessage({
//         message: 'Invalid Format',
//         statusBarHeight: getStatusBarHeight(),
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setsubmitText('ENTER');
//     } else if (!Password) {
//       showMessage({
//         message: 'Please Enter Your Password',
//         statusBarHeight: getStatusBarHeight(),
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setsubmitText('ENTER');
//     } else {
//       try {
//         const data = await axios(`${Api}/${Appapi.login}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           data: {
//             email: Email,
//             password: Password,
//           },
//         });
//         console.log(data.data)
//         if (data.data[0].status == 0) {
//           setEmail('');
//           setPassword('');

//           navigation.navigate('Signup', {userData: data.data});
//           setsubmitText('ENTER');
//           setIsLoaded(true);
//           showMessage({
//             message: 'Your email is not verified , Please verify your email ',
//             type: 'warning',
//             animationDuration: '750',
//             statusBarHeight: getStatusBarHeight(),
//             floating: true,
//             icon: {icon: 'auto', position: 'left'},
//           });
//         } else if (data.data[0].msg == 'Login successful') {
//           // console.log(data.data)
//             if(data.data[0].image=="https://gofit.tentoptoday.com/json/profile_img/"){
//            //do nothing
//             }
//             else{
//               dispatch(updatePhoto(data.data[0].image))
//             }
//           // console.log(data.data)
//           showMessage({
//             message: data.data[0].msg,
//             statusBarHeight: getStatusBarHeight(),
//             floating: true,
//             type: 'success',
//             animationDuration: 500,
//             icon: {icon: 'auto', position: 'left'},
//           });
//           dispatch(Is_user_Login(true)) // dispatching the state if the user is login once
//           await AsyncStorage.setItem('Data', JSON.stringify(data.data)); //user details
//           setIsLoaded(true);

//           navigation.navigate('DrawerNavigation');

//           setsubmitText('ENTER');
//         } else {
//           setIsLoaded(true);
//           showMessage({
//             message: data.data[0].msg,
//             statusBarHeight: getStatusBarHeight(),
//             floating: true,
//             type: 'danger',
//             animationDuration: 500,
//             icon: {icon: 'auto', position: 'left'},
//           });
//           setsubmitText('ENTER');
//         }
//       } catch (error) {
//         console.log('eror11111111', error);
//         setsubmitText('ENTER');
//       }
//     }
//   };
//   return (
//     <SafeAreaView
//       style={[
//         styles.container,
//         {backgroundColor: defaultTheme ? '#000' : '#fff'},
//       ]}>
//       <StatusBar
//         barStyle={defaultTheme ? 'light-content' : 'dark-content'}
//         backgroundColor={defaultTheme ? '#000' : '#fff'}
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

//         <View
//           style={{
//             backgroundColor: defaultTheme ? '#000' : '#fff',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//              <Text style={{fontSize:25,color:defaultTheme?"#fff":"#000"}}>Login</Text>
//           <Image
//             resizeMode="contain"
//             style={styles.logo}
//             source={localImage.logo}

//           />
//           <TextInput
//             label={'Email'}
//             keyboardType="email-address"
//             onChangeText={text => {
//               setEmail(text);
//             }}
//             mode="flat"
//             autoCapitalize="none"
//             style={styles.AuthInput}
//             activeUnderlineColor="#C8170D"
//             underlineColor={
//               defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
//             }
//             value={Email}
//             textColor={defaultTheme ? '#fff' : '#000'}
//             theme={{
//               colors: {
//                 onSurfaceVariant: defaultTheme
//                   ? 'rgba(255,255,255,0.7)'
//                   : 'rgba(0,0,0,0.6)',
//               },
//             }}
//           />
//           <TextInput
//             label={'Password'}
//             onChangeText={text => setPassword(text)}
//             mode="flat"
//             secureTextEntry={!isVisible}
//             style={styles.AuthInput}
//             activeUnderlineColor="#C8170D"
//             underlineColor={
//               defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
//             }
//             value={Password}
//             textColor={defaultTheme ? '#fff' : '#000'}
//             theme={{
//               colors: {
//                 onSurfaceVariant: defaultTheme
//                   ? 'rgba(255,255,255,0.7)'
//                   : 'rgba(0,0,0,0.6)',
//               },
//             }}
//             right={
//               <TextInput.Icon
//                 icon={isVisible ? 'eye' : 'eye-off'}
//                 theme={{
//                   colors: {
//                     onSurfaceVariant: defaultTheme
//                       ? 'rgba(255,255,255,0.7)'
//                       : 'rgba(0,0,0,0.6)',
//                   },
//                 }}
//                 onPress={ToggleVisibility}
//               />
//             }
//           />

//           <View
//             style={{
//               width: (DeviceWidth * 80) / 100,
//               alignItems: 'flex-end',
//               backgroundColor: defaultTheme ? '#000' : '#fff',
//             }}>
//             <TouchableOpacity
//               style={[
//                 styles.Forget,
//                 {backgroundColor: defaultTheme ? '#000' : '#fff'},
//               ]}
//               onPress={() => {
//                 navigation.navigate('ForgetPassword');
//               }}>
//               <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
//                 Forget Password ?
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={styles.Tbutton}
//             onPress={() => {
//               setsubmitText('Please Wait...');
//               ErrorHandler();
//             }}>
//             <Text style={{color: 'white', fontSize: 15}}>{submitText}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('Signup');
//             }}>
//             <Text
//               style={{
//                 color: defaultTheme ? '#fff' : '#000',
//                 marginBottom: (DeviceHeigth * 5) / 100,
//               }}>
//               Don't have an account ?{' '}
//               <Text
//                 style={{
//                   color: defaultTheme ? '#fff' : '#000',
//                   fontWeight: 'bold',
//                 }}>
//                 SignUp
//               </Text>
//             </Text>
//           </TouchableOpacity>
//           {/* <GoogleSigninButton size={GoogleSigninButton.Size.Wide} onPress={()=>{GoogleLogin()}}/>
//           <TouchableOpacity style={{backgroundColor:"red" ,marginTop:10}}><Text>Sign Out</Text></TouchableOpacity> */}
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   logo: {
//     width: DeviceWidth * 0.5,
//     height: DeviceWidth * 0.7,
//     alignSelf: 'center',
//   },
//   Forget: {
//     width: (DeviceWidth * 50) / 100,
//     marginBottom: (DeviceHeigth * 2) / 100,
//     backgroundColor: 'white',
//     // borderWidth:1,
//     alignItems: 'flex-end',
//   },
//   Tbutton: {
//     width: (DeviceWidth * 80) / 100,
//     height: (DeviceHeigth * 6) / 100,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#C8170D',
//     marginBottom: (DeviceHeigth * 2) / 100,
//   },
//   AuthInput: {
//     marginBottom: (DeviceHeigth * 1) / 100,
//     backgroundColor: 'transparent',
//     width: (DeviceWidth * 80) / 100,
//   },
//   SignUpText: {
//     fontSize: 25,
//     color: 'black',
//     alignItems: 'flex-start',
//     textAlign: 'center',
//     marginBottom: 50,
//   },
//   Verify: {
//     backgroundColor: 'red',
//     width: (DeviceWidth * 50) / 100,
//     height: (DeviceHeigth * 4) / 100,
//     borderRadius: 100,
//     marginVertical: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   OtpField: {
//     width: 40,
//     height: 40,
//     margin: 5,
//   },
//   OtpBox: {
//     flexDirection: 'row',
//   },
// });
// export default Login;
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
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
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ActivityLoader from '../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const Login = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forLoading, setForLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '60298593797-kkelutkvu5it955cebn8dhi1n543osi8.apps.googleusercontent.com',
    });
  }, []);
  const GoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
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
        },
      });
      if (data.data.status == 1) {
        showMessage({
          message: data.data.msg,
          type: 'success',
          animationDuration: 500,
        
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      } else {
        showMessage({
          message: data.data.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      }
    } catch (error) {
      setForLoading(false);
      console.log('google Signup Error', error);
    }
  };

  const loginFunction = async () => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          email: 'cvmytest@gmail.com',
          password: 'Test@123',
          // signuptype: 'social',
          // socialid: value.id,
          // socialtoken: token,
          // socialtype: 'google',
        },
      });
      console.log('TEsting Data for login', data.data);
      if( data.data.msg=='Login successful'){
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          floating: true,
          duration: 500,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });
        navigation.navigate('Home')
     
      }else{
        setForLoading(false);
        showMessage({
          message: data.data.msg,
          floating: true,
          duration: 500,
          type: 'success',
          icon: {icon: 'auto', position: 'left'},
        });
      }
     
    } catch (error) {
      console.log('google Signup Error', error);
      setForLoading(false);
    }
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
          <View style={styles.TextContainer}>
            <Text style={styles.LoginText2}>{'Hey there,'}</Text>
            <Text style={styles.LoginText}>Welcome</Text>
          </View>
          <View
            style={{
              marginTop: DeviceHeigth * 0.07,
              marginLeft: 10,
            }}>
            <InputText
              leftIcon={localImage.Message}
              placeholder={'Enter Mail ID'}
              placeholderTextColor={AppColor.PLACEHOLDERCOLOR}
              onChangeText={text => {
                setEmail(text);
              }}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View
            style={{
              marginTop: DeviceHeigth * 0.02,
              marginLeft: 10,
            }}>
            <InputText
              leftIcon={localImage.Lock}
              headerText={'Password'}
              placeholder={'***********'}
              placeholderTextColor={'#303841'}
              passwordInput={true}
              pasButton={() => setShowPassword(!showPassword)}
              secureTextEntry={showPassword}
              passwordInputIcon={showPassword}
              onChangeText={text => setPassword(text)}
              value={password}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
           navigation.navigate('ForgetPassword');
              //navigation.navigate('OtpVerification',{email:'test@gmail.com'});
            }}
            style={styles.forgotView}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={{marginTop: DeviceHeigth * 0.15}}>
            <Button buttonText={'Login'} onPresh={loginFunction} />
          </View>

          <View
            style={{
              marginTop: DeviceHeigth * 0.05,
              alignSelf: 'center',
              marginRight: DeviceWidth * 0.1,
            }}>
            <Text
              style={[styles.forgotText, {fontSize: 12, fontWeight: '400'}]}>
              Or Continue With
            </Text>
          </View>
        </KeyboardAvoidingView>
        <View style={{marginTop: DeviceHeigth * 0.02}}>
          <Button2 onGooglePress={GoogleSignup} />
        </View>

        <View
          style={{
            marginTop: DeviceHeigth * 0.05,
            bottom: 10,

            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={[styles.forgotText, {fontSize: 17, fontWeight: '400'}]}>
            Don’t have an account yet?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Workouts');
            }}>
            <Text
              style={[
                styles.forgotText,
                {fontSize: 17, fontWeight: '700', color: AppColor.RED},
              ]}>
              {' '}
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});

export default Login;
