// import {
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar
// } from 'react-native';
// import React, { useState } from 'react';
// import { TextInput } from 'react-native-paper';
// import { useSelector } from 'react-redux'
// import { Api, Appapi, DeviceHeigth, DeviceWidth } from '../Component/Config';
// import Header from '../Component/Header';
// import { showMessage } from 'react-native-flash-message';
// import CustomStatusBar from '../Component/CustomStatusBar';
// import axios from 'axios';
// import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
// import { getStatusBarHeight } from 'react-native-status-bar-height';
// let reg = /\S+@\S+\.\S+/;
// const ForgetPassword = ({ navigation }) => {
//   const [Email, setEmail] = useState('');
//   const [inputText, setInputText] = useState('Enter');
//   const { defaultTheme } = useSelector((state) => state)
//   const ErrorHandle = async () => {
//     if (!Email) {
//       showMessage({
//         message: 'Please Enter your Email',
//         statusBarHeight: getStatusBarHeight(),
//         floating: true,
//         type: 'danger',
//         icon: { icon: 'auto', position: 'left' },
//       });
//       setInputText('Enter');
//     } else if (!reg.test(Email)) {
//       showMessage({
//         message: 'Invalid Email Format',
//         statusBarHeight: getStatusBarHeight(),
//         floating: true,
//         type: 'danger',
//         icon: { icon: 'auto', position: 'left' },
//       });
//       setInputText('ENTER');
//     } else {
//       try {
//         const data = await axios(`${Api}/${Appapi.forgetPassword}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           data: {
//             email: Email,
//           },
//         });
//         console.log('datatat', data.data[0].msg)
//         setInputText('Enter');
//         if (data.data[0].msg == 'Mail Sent') {
//           showMessage({
//             message: data.data[0].msg,
//             statusBarHeight: getStatusBarHeight(),
//             floating: true,
//             type: 'success',
//             icon: { icon: 'auto', position: 'left' },
//           });
//           navigation.navigate('Login')
//         } else {
//           showMessage({
//             message: data.data[0].msg,
//             statusBarHeight: getStatusBarHeight(),
//             floating: true,
//             type: 'danger',
//             icon: { icon: 'auto', position: 'left' },
//           });
//         }

//         setEmail('');
//       } catch (error) {
//         setInputText('Enter');
//         console.log('uygij11111111', error);
//         setEmail('');
//       }
//     }
//   };
//   return (
//     <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
//       {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#C8170D'} /></> : <><CustomStatusBar /></>}
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={{ flex: 1 }}>
//         <HeaderWithoutSearch Header={'Forget Password'} />

//         <View style={[styles.container1, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
//           <Text style={[styles.text, { color: defaultTheme ? "#fff" : "#000" }]}>
//             We'll send you an email with a reset link
//           </Text>
//           <TextInput
//             label={'Email'}
//             textColor={defaultTheme ? "#fff" : "#000"}
//             onChangeText={text => {
//               setEmail(text.trim());
//               setInputText('Enter');
//             }}
//             mode="flat"
//             autoCapitalize="none"
//             style={styles.AuthInput}
//             activeUnderlineColor='#C8170D'
//             value={Email}
//             theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
//             underlineColor={defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
//           />
//           <TouchableOpacity
//             style={styles.Tbutton}
//             onPress={() => {
//               setInputText('Please Wait...');
//               ErrorHandle();
//             }}>
//             <Text style={{ color: 'white', fontSize: 15 }}>{inputText}</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     flex: 1,
//   },
//   container1: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     width: DeviceWidth,
//     height: (DeviceHeigth * 88) / 100,
//     marginBottom: (DeviceHeigth * 5) / 100,
//   },
//   text: {
//     color: 'black',
//     fontSize: 17,
//   },
//   Tbutton: {
//     width: (DeviceWidth * 80) / 100,
//     height: 50,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#C8170D',
//     marginBottom: (DeviceHeigth * 6) / 100,
//   },
//   AuthInput: {
//     marginVertical: (DeviceHeigth * 2) / 100,
//     backgroundColor: 'transparent',
//     width: (DeviceWidth * 80) / 100,
//   },
// });
// export default ForgetPassword;

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, NewApi, NewAppapi} from '../Component/Config';
import {localImage} from '../Component/Image';
import {Image} from 'react-native';
import Button from '../Component/Button';
import InputText from '../Component/InputText';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ActivityLoader from '../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});

const ForgetPassword = ({navigation}) => {
  const [forLoading, setForLoading] = useState(false);
  const handleFormSubmit = async value => {
    setForLoading(true);
    try {
      const data = await axios(`${NewApi}${NewAppapi.forgetPassword}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          email: value.email,
        },
      });
      if (data.data.msg == 'Mail Sent') {
        setForLoading(false);
        showMessage({
          message: 'Reset Password link sent!',
          type: 'success',
          animationDuration: 500,
          // statusBarHeight: StatusBar_Bar_Height+,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        navigation.navigate('Login');
      } else {
        showMessage({
          message: 'Somthing went wrong!',
          type: 'ganger',
          animationDuration: 500,
          // statusBarHeight: StatusBar_Bar_Height+,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        setForLoading(false);
      }
      console.log('datatat', data.data.msg);
    } catch (error) {
      console.log('FOrgot Password Error', error);
      setForLoading(false);
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
          marginTop: DeviceHeigth * 0.02,
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
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'position' : undefined}
          contentContainerStyle={{flexGrow: 1}}>
          {forLoading ? <ActivityLoader /> : ''}
          <View style={styles.TextContainer}>
            <Text style={styles.LoginText}>Forget Password</Text>
            <Text style={[styles.LoginText2, {marginTop: DeviceHeigth * 0.02}]}>
              {'Please enter your email below to receive'}
            </Text>
            <Text
              style={[styles.LoginText2, {marginTop: DeviceHeigth * 0.001}]}>
              {'your password reset code'}
            </Text>
          </View>
          <Formik
            initialValues={{
              email: '',
            }}
            onSubmit={values => handleFormSubmit(values)}
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
                    marginTop: DeviceHeigth * 0.07,
                    marginLeft: 10,
                  }}>
                  <InputText
                    leftIcon={localImage.Message}
                    placeholder={'Enter Mail ID'}
                    placeholderTextColor={AppColor.PLACEHOLDERCOLOR}
                    onChangeText={handleChange('email')}
                    errors={errors.email}
                    touched={touched.email}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={{marginTop: DeviceHeigth * 0.3}}>
                  <Button
                    buttonText={'Reset Password'}
                    onPresh={handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>
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
    marginTop: DeviceHeigth * 0.06,
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
});
export default ForgetPassword;
