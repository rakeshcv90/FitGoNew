// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   StatusBar,
//   Platform,
//   Modal,
//   Animated,
//   Image,
//   ScrollView,
// } from 'react-native';
// import React, {useEffect, useRef, useState, useMemo} from 'react';
// import {Api, Appapi, DeviceHeigth, DeviceWidth} from '../Component/Config';
// import {TextInput} from 'react-native-paper';
// import {showMessage} from 'react-native-flash-message';
// import axios from 'axios';
// import {useSelector} from 'react-redux';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useRoute} from '@react-navigation/native';
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {localImage} from '../Component/Image';
// const Signup = ({navigation}) => {
//   const route = useRoute();
//   const data = route.params;
//   const [checked, setChecked] = useState(false);
//   const [Name, setName] = useState('');
//   const [Email, setEmail] = useState('');
//   const [Password, setPassword] = useState('');
//   const [ConfirmPassword, setConformPassword] = useState('');
//   const {defaultTheme} = useSelector(state => state);
//   const [submitText, setSubmitText] = useState('Enter');
//   const [isVisible, setIsvisible] = useState(false);
//   const [isVisiblepassword, setIsvisiblepassword] = useState(false);
//   const [IsVerifyVisible, setVerifyVisible] = useState(false);
//   const StatusBar_Bar_Height = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
//   const Animation = useRef(new Animated.Value(0)).current;
//   const ToggleVisibility = () => {
//     setIsvisible(!isVisible);
//   };
//   const ToggleVisibilityPassword = () => {
//     setIsvisiblepassword(!isVisiblepassword);
//   };
//   useEffect(() => {
//     if (!data) {
//       setName(Name);
//       setEmail(Email);
//     } else {
//       setName(data.userData[0].name);
//       setEmail(data.userData[0].email);
//     }
//   }, []);

//   const ErrorHandler = () => {
//     let reg = /\S+@\S+\.\S+/;
//     const PasswordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×])[A-Za-z\d!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×]{8,}$/;
//     if (!Name) {
//       showMessage({
//         message: 'Enter Your name',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (!Email) {
//       showMessage({
//         message: 'Enter Your Email',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (!reg.test(Email)) {
//       showMessage({
//         message: 'Invalid Format',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (!Password) {
//       showMessage({
//         message: 'Please Enter Your Password',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (!PasswordRegex.test(Password)) {
//       showMessage({
//         message: `Password must contain 1 Upper-Case letter,
//            1 Lower-Case letter, 1 Digit, 1 Special
//            Character(@,$,-,^,&, !),and the length must be at least 8 characters`,
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (!ConfirmPassword) {
//       showMessage({
//         message: 'Please enter Confirm  Password',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (Password != ConfirmPassword) {
//       showMessage({
//         message: 'Confirm Password does not Match',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else if (checked == false) {
//       showMessage({
//         message: 'Please Accept Terms and Conditions',
//         statusBarHeight: StatusBar_Bar_Height,
//         floating: true,
//         type: 'danger',
//         icon: {icon: 'auto', position: 'left'},
//       });
//       setSubmitText('Enter');
//     } else {
//       userdata();
//     }
//   };
//   const userdata = async () => {
//     try {
//       const data = await axios(`${Api}/${Appapi.signup}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: {
//           name: Name,
//           email: Email,
//           password: Password,
//         },
//       });
//       setSubmitText('Enter');
//       setSubmitText('Enter');
//       setVerifyVisible(true);
//       if (data.data[0].msg === 'Otp sent to your email') {
//         showMessage({
//           message: data.data[0].msg,
//           statusBarHeight: StatusBar_Bar_Height,
//           floating: true,
//           type: 'success',
//           icon: {icon: 'auto', position: 'left'},
//         });

//         setVerifyVisible(true);
//       } else if (data.data[0].status == 0) {
//         setSubmitText('Enter');
//         setSubmitText('Enter');
//         setVerifyVisible(true);
//         showMessage({
//           message:
//             'We have sent an OTP to your email , Please verify your email first',
//           type: 'warning',
//           animationDuration: 500,
//           statusBarHeight: StatusBar_Bar_Height,
//           floating: true,
//           icon: {icon: 'auto', position: 'left'},
//         });
//       } else {
//         setVerifyVisible(false)
//         showMessage({
//           message: "User already exists",
//           type: 'danger',
//           animationDuration:500,
//           statusBarHeight: StatusBar_Bar_Height,
//           floating: true,
//           icon: {icon: 'auto', position: 'left'},
//         });
//         setSubmitText('Enter');
//         navigation.navigate("Login")
//       }

//     } catch (error) {
//       setSubmitText('Enter');
//       console.log('eror', error);
//     }
//   };

//   const ModalView = () => {
//     const t1 = useRef();
//     const t2 = useRef();
//     const t3 = useRef();
//     const t4 = useRef();
//     const t5 = useRef();
//     const t6 = useRef();
//     const [txt1, setTxt1] = useState('');
//     const [txt2, setTxt2] = useState('');
//     const [txt3, setTxt3] = useState('');
//     const [txt4, setTxt4] = useState('');
//     const [txt5, setTxt5] = useState('');
//     const [txt6, setTxt6] = useState('');
//     const [VerifyText, SetVerifyText] = useState('Verify');
//     const [timeLeft, setTimeleft] = useState(60);
//     const [resendtxt, setResendTxt] = useState('Resend OTP');
//     const OtpString = txt1 + txt2 + txt3 + txt4 + txt5 + txt6;
//     const ResendOTP = async () => {
//       try {
//         let payload = new FormData();
//         payload.append('email', Email);
//         const OTPdata = await axios(`${Api}/${Appapi.ResendOTP}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           data: payload,
//         });
//         if (OTPdata) {
//           setResendTxt('Resend OTP');
//           setTimeleft(60);
//           setTxt1('');
//           setTxt2('');
//           setTxt3('');
//           setTxt4('');
//           setTxt5('');
//           setTxt6('');
//           showMessage({
//             message: 'OTP has been sent to your email',
//             type: 'success',
//             duration: 500,
//             statusBarHeight: StatusBar_Bar_Height,
//             floating: true,
//             icon: {icon: 'auto', position: 'left'},
//           });
//         } else {
//           showMessage({
//             message: OTPdata.data[0].msg,
//             type: 'success',
//             statusBarHeight: StatusBar_Bar_Height,
//             floating: true,
//             icon: {icon: 'auto', position: 'left'},
//           });
//         }
//       } catch (error) {
//         console.log('erere', error);
//         setResendTxt('Resent OTP');
//         setTimeleft(60);
//       }
//     };

//     const handleOTP = async () => {
//       if (!txt1 || !txt2 || !txt3 || !txt4 || !txt5 || !txt6) {
//         showMessage({
//           message: 'Please enter the otp',
//           statusBarHeight: StatusBar_Bar_Height,
//           floating: true,
//           type: 'danger',
//           icon: {icon: 'auto', position: 'left'},
//         });
//         SetVerifyText('Verify');
//         setSubmitText('Enter');
//       } else {
//         try {
//           let payload = new FormData();
//           payload.append('email', Email);
//           payload.append('otp', OtpString);
//           const OtpMsg = await axios(`${Api}/${Appapi.OTPVerification}`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             data: payload,
//           });
//           console.log(Email, OtpString, OtpMsg.data[0]);
//           if (OtpMsg.data[0].msg == 'Email verified successfully') {
//             setVerifyVisible(false);
//             showMessage({
//               message: 'Email verified successfully , Please Login',
//               statusBarHeight: StatusBar_Bar_Height,
//               floating: true,
//               duration: 500,
//               type: 'success',
//               icon: {icon: 'auto', position: 'left'},
//             });
//             setResendTxt('Resend OTP');
//             setTimeleft(60);
//             setTxt1('');
//             setTxt2('');
//             setTxt3('');
//             setTxt4('');
//             setTxt5('');
//             setTxt6('');

//             setSubmitText('Enter');
//             navigation.navigate('Login');
//           } else {
//             showMessage({
//               message: OtpMsg.data[0].msg,
//               statusBarHeight: StatusBar_Bar_Height,
//               floating: true,
//               type: 'danger',
//               icon: {icon: 'auto', position: 'left'},
//             });
//             setResendTxt('Resend OTP');
//             setTimeleft(60);
//             setTxt1('');
//             setTxt2('');
//             setTxt3('');
//             setTxt4('');
//             setTxt5('');
//             setTxt6('');
//           }
//           SetVerifyText('Verify');
//           setSubmitText('Enter');
//         } catch (error) {
//           SetVerifyText('Verify');
//           console.log('OTPERROR', error);
//         }
//       }
//     };
//     useEffect(() => {
//       const timer = setInterval(() => {
//         if (timeLeft > 0) {
//           setTimeleft(timeLeft - 1);
//         }
//       }, 1000);
//       return () => clearInterval(timer);
//     }, [timeLeft]);
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: defaultTheme ? '#000' : '#fff',
//           position: 'absolute',
//         }}>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={true}
//           onRequestClose={() => {
//             setVerifyVisible(false);
//           }}>
//           <View
//             style={[
//               styles.modalContainer,
//               {backgroundColor: 'transparent', flex: 1},
//             ]}>
//             <View style={[styles.modalContent ,{backgroundColor:defaultTheme?"#000":"#fff"}]}>
//               <>
//                 <View
//                   style={[
//                     styles.closeButton,
//                     ,
//                     {
//                       width: (DeviceWidth * 85) / 100,
//                       marginTop: 8,
//                       backgroundColor: defaultTheme ? '#000' : 'fff',
//                     },
//                   ]}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setVerifyVisible(false);
//                     }}>
//                     <Icons
//                       name="close"
//                       size={27}
//                       color={defaultTheme ? '#fff' : '#000'}
//                     />
//                   </TouchableOpacity>
//                 </View>
//                 <Text
//                   style={{
//                     color: defaultTheme ? '#fff' : '#000',
//                     fontSize: 18,
//                     fontWeight: '600',
//                     marginVertical: 10,
//                   }}>
//                   OTP Verification
//                 </Text>
//                 <View style={styles.OtpBox}>
//                   <TextInput
//                     style={styles.OtpField}
//                     ref={t1}
//                     underlineColor="transparent"
//                     mode="outlined"
//                     keyboardType="number-pad"
//                     activeUnderlineColor="transparent"
//                     maxLength={1}
//                     activeOutlineColor="red"
//                     value={txt1}
//                     onChangeText={txt => {
//                       if (txt.length >= 1) {
//                         setTxt1(txt);
//                         t2.current.focus();
//                       } else {
//                         setTxt1('');
//                         t1.current.focus();
//                       }
//                     }}
//                   />
//                   <TextInput
//                     style={styles.OtpField}
//                     ref={t2}
//                     underlineColor="transparent"
//                     mode="outlined"
//                     keyboardType="number-pad"
//                     activeUnderlineColor="transparent"
//                     maxLength={1}
//                     activeOutlineColor="red"
//                     value={txt2}
//                     onChangeText={txt => {
//                       if (txt.length >= 1) {
//                         setTxt2(txt);
//                         t3.current.focus();
//                       } else {
//                         setTxt2('');
//                         t1.current.focus();
//                       }
//                     }}
//                   />
//                   <TextInput
//                     style={styles.OtpField}
//                     ref={t3}
//                     underlineColor="transparent"
//                     mode="outlined"
//                     keyboardType="number-pad"
//                     activeUnderlineColor="transparent"
//                     maxLength={1}
//                     activeOutlineColor="#C8170D"
//                     value={txt3}
//                     onChangeText={txt => {
//                       if (txt.length >= 1) {
//                         setTxt3(txt);
//                         t4.current.focus();
//                       } else {
//                         setTxt3('');
//                         t2.current.focus();
//                       }
//                     }}
//                   />
//                   <TextInput
//                     style={styles.OtpField}
//                     ref={t4}
//                     underlineColor="transparent"
//                     mode="outlined"
//                     keyboardType="number-pad"
//                     activeUnderlineColor="transparent"
//                     maxLength={1}
//                     activeOutlineColor="#C8170D"
//                     value={txt4}
//                     onChangeText={txt => {
//                       if (txt.length >= 1) {
//                         setTxt4(txt);
//                         t5.current.focus();
//                       } else {
//                         setTxt4('');
//                         t3.current.focus();
//                       }
//                     }}
//                   />
//                   <TextInput
//                     style={styles.OtpField}
//                     ref={t5}
//                     underlineColor="transparent"
//                     mode="outlined"
//                     keyboardType="number-pad"
//                     activeUnderlineColor="transparent"
//                     maxLength={1}
//                     activeOutlineColor="red"
//                     value={txt5}
//                     onChangeText={txt => {
//                       if (txt.length >= 1) {
//                         setTxt5(txt);
//                         t6.current.focus();
//                       } else {
//                         setTxt5('');
//                         t4.current.focus();
//                       }
//                     }}
//                   />
//                   <TextInput
//                     textContentType="password"
//                     style={styles.OtpField}
//                     ref={t6}
//                     underlineColor="transparent"
//                     mode="outlined"
//                     keyboardType="number-pad"
//                     activeUnderlineColor="transparent"
//                     maxLength={1}
//                     activeOutlineColor="red"
//                     value={txt6}
//                     onChangeText={txt => {
//                       if (txt.length >= 1) {
//                         setTxt6(txt);
//                         t6.current.focus();
//                       } else {
//                         setTxt6('');
//                         t5.current.focus();
//                       }
//                     }}
//                   />
//                 </View>
//                 <View style={{flexDirection: 'row', marginVertical: 5}}>
//                   {timeLeft === 0 ? (
//                     <TouchableOpacity>
//                       <Text
//                         style={{
//                           color: defaultTheme ? '#fff' : '#000',
//                           fontSize: 16,
//                           fontWeight:"700"
//                         }}
//                         onPress={() => {
//                           setResendTxt('Please Wait...');
//                           ResendOTP();
//                         }}>
//                         {resendtxt}
//                       </Text>
//                     </TouchableOpacity>
//                   ) : (
//                     <Text
//                       style={{
//                         color: defaultTheme ? '#fff' : '#000',
//                         fontSize: 16,
//                       }}>
//                       Resend OTP in
//                       <Text style={{fontWeight: 'bold'}}> {timeLeft} </Text>
//                       seconds
//                     </Text>
//                   )}
//                 </View>
//                 <View style={{marginBottom:6}}>
//                   <TouchableOpacity
//                     style={{
//                       width: (DeviceWidth * 40) / 100,
//                       backgroundColor: '#C8170D',
//                       height: (DeviceHeigth * 4.5) / 100,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderRadius: 100,
//                     }}
//                     onPress={() => {
//                       SetVerifyText('Verifying...');
//                       handleOTP();
//                     }}>
//                     <Text style={{color: '#fff', fontSize: 15}}>
//                       {VerifyText}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     );
//   };
//   return (
//     <SafeAreaView
//       style={{flex: 1, backgroundColor: defaultTheme ? '#000' : '#fff'}}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'position' : 'position'}
//         style={{marginVertical: DeviceHeigth * 0.07}}
//         contentContainerStyle={{flexGrow: 1}}>
//         <Text
//           style={[styles.SignUpText, {color: defaultTheme ? '#fff' : '#000'}]}>
//           SignUp
//         </Text>
//         <Image
//           source={localImage.logo}
//           style={{
//             width: DeviceWidth * 0.5,
//             height: DeviceWidth * 0.6,
//             alignSelf: 'center',
//           }}
//           resizeMode='contain'
//         />
//         <View
//           style={[
//             styles.container,
//             {backgroundColor: defaultTheme ? '#000' : '#fff'},
//           ]}>
//           <TextInput
//             label={'Name'}
//             onChangeText={text => {
//               setName(text);
//             }}
//             mode="flat"
//             autoCapitalize="none"
//             style={styles.AuthInput}
//             activeUnderlineColor="#C8170D"
//             value={Name}
//             textColor={defaultTheme ? '#fff' : '#000'}
//             theme={{
//               colors: {
//                 onSurfaceVariant: defaultTheme
//                   ? 'rgba(255,255,255,0.7)'
//                   : 'rgba(0,0,0,0.6)',
//               },
//             }}
//             underlineColor={
//               defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
//             }
//           />
//           <TextInput
//             label={'Email'}
//             keyboardType="email-address"
//             onChangeText={text => {
//               setEmail(text.trim());
//               setVerifyVisible(false);
//             }}
//             mode="flat"
//             autoCapitalize="none"
//             style={styles.AuthInput}
//             activeUnderlineColor="#C8170D"
//             value={Email}
//             textColor={defaultTheme ? '#fff' : '#000'}
//             theme={{
//               colors: {
//                 onSurfaceVariant: defaultTheme
//                   ? 'rgba(255,255,255,0.7)'
//                   : 'rgba(0,0,0,0.6)',
//               },
//             }}
//             underlineColor={
//               defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
//             }
//           />
//           <TextInput
//             label={'Password'}
//             onChangeText={text => setPassword(text.trim())}
//             mode="flat"
//             style={styles.AuthInput}
//             activeUnderlineColor="#C8170D"
//             value={Password}
//             secureTextEntry={!isVisiblepassword}
//             textColor={defaultTheme ? '#fff' : '#000'}
//             underlineColor={
//               defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
//             }
//             theme={{
//               colors: {
//                 onSurfaceVariant: defaultTheme
//                   ? 'rgba(255,255,255,0.7)'
//                   : 'rgba(0,0,0,0.6)',
//               },
//             }}
//             right={
//               <TextInput.Icon
//                 icon={isVisiblepassword ? 'eye' : 'eye-off'}
//                 onPress={ToggleVisibilityPassword}
//                 theme={{
//                   colors: {
//                     onSurfaceVariant: defaultTheme
//                       ? 'rgba(255,255,255,0.7)'
//                       : 'rgba(0,0,0,0.6)',
//                   },
//                 }}
//               />
//             }
//           />
//           <TextInput
//             label={'Confirm Password'}
//             onChangeText={text => setConformPassword(text.trim())}
//             mode="flat"
//             style={styles.AuthInput}
//             activeUnderlineColor="#C8170D"
//             value={ConfirmPassword}
//             secureTextEntry={!isVisible}
//             textColor={defaultTheme ? '#fff' : '#000'}
//             underlineColor={
//               defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
//             }
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
//                 onPress={ToggleVisibility}
//                 theme={{
//                   colors: {
//                     onSurfaceVariant: defaultTheme
//                       ? 'rgba(255,255,255,0.7)'
//                       : 'rgba(0,0,0,0.6)',
//                   },
//                 }}
//               />
//             }
//           />

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'flex-start',
//                 position: 'relative',
//                 alignItems: 'center',
//                 width: (DeviceWidth * 80) / 100,
//               }}>
//               <TouchableOpacity onPress={() => setChecked(!checked)}>
//                 {checked ? (
//                   <Icons
//                     name="checkbox-marked"
//                     size={27}
//                     style={{marginVertical: 15, marginRight: 10}}
//                     color={'#C8170D'}
//                   />
//                 ) : (
//                   <Icons
//                     name="checkbox-blank-outline"
//                     size={27}
//                     style={{marginVertical: 15, marginRight: 10}}
//                     color={
//                       defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
//                     }
//                   />
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate('TermaAndCondition');
//                 }}>
//                 <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
//                   I Agree to Terms & Conditions
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={styles.Tbutton}
//               onPress={() => {
//                 setSubmitText('Please Wait...');
//                 ErrorHandler();
//               }}>
//               <Text style={{color: 'white', fontSize: 15}}>{submitText}</Text>
//             </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('Login');
//             }}>
//             <View
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginVertical: 5,
//               }}>
//               <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
//                 Already have an account ?{' '}
//                 <Text
//                   style={{
//                     color: defaultTheme ? '#fff' : '#000',
//                     fontWeight: 'bold',
//                   }}>
//                   Login
//                 </Text>
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {IsVerifyVisible ? <ModalView /> : null}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     //flex: 1,
//     alignItems: 'center',
//     // marginVertical:DeviceHeigth,
//     justifyContent: 'center',
//   },
//   TextInput: {
//     borderBottomWidth: 1,
//     width: (DeviceWidth * 80) / 100,
//     color: '#C8170D',
//     borderBottomColor: '#adadad',
//   },
//   checkboxContainer: {
//     width: 22,
//     height: 22,
//     borderWidth: 1,
//     borderColor: '#adadad',
//     alignItems: 'center',
//     borderRadius: 1,
//     marginVertical: 15,
//     marginRight: 10,
//   },
//   Checked: {
//     backgroundColor: '#C8170D',
//     borderColor: '#C8170D',
//   },
//   Tbutton: {
//     width: (DeviceWidth * 80) / 100,
//     height: (DeviceHeigth * 6) / 100,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#C8170D',
//     marginBottom: 15,
//   },
//   SignUpText: {
//     fontSize: 25,
//     color: 'black',
//     alignItems: 'flex-start',
//     textAlign: 'center',
//     marginTop: '2%',
//   },
//   AuthInput: {
//     marginBottom: (DeviceHeigth * 1) / 100,
//     backgroundColor: 'transparent',
//     width: (DeviceWidth * 80) / 100,
//   },
//   OtpField: {
//     width: 40,
//     height: 40,
//     margin: 5,
//   },
//   OtpBox: {
//     flexDirection: 'row',
//   },
//   modalContainer: {
//     // flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     //marginHorizontal: 15,
//   },
//   modalContent: {
//     height: DeviceHeigth / 3.5,
//     width: '90%',
//     backgroundColor: 'white',

//     borderRadius: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'lightgray',
//     bottom: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000000',
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   Verify: {
//     //backgroundColor: 'red',
//     width: (DeviceWidth * 50) / 100,
//     height: (DeviceHeigth * 4) / 100,
//     borderRadius: 100,
//     marginVertical: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButton: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
// });
// export default Signup;
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

import ActivityLoader from '../Component/ActivityLoader';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const Signup = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [isVisiblepassword, setIsvisiblepassword] = useState(true);
  const [checked, setChecked] = useState(false);
  const [forLoading, setForLoading] = useState(false);

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

  const loginFunction = async () => {
    await GoogleSignin.signOut();
  };
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
  const handleFormSubmit = async value => {
    console.log('TEsting Data');
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
          social_type: 'null',
        },
      });
      console.log('TEsting Data for login', data.data);
    } catch (error) {
      console.log('Form Signup Error', error);
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
        },
      });

      if (data.data.msg == 'User already exists' && data.data.status == 0) {
        setForLoading(false);
        console.log('Compleate Profile');
      } else if (
        data.data.msg == 'User registered via social login' &&
        data.data.status == 0
      ) {
        setForLoading(false);
        console.log('Compleate Profile1');
      } else if (
        data.data.msg == 'User already exists' &&
        data.data.status == 1
      ) {
        setForLoading(false);
        console.log('Compleate Profile Successfull');
      } else {
        setForLoading(false);
        console.log('user not found');
      }
    } catch (error) {
      setForLoading(false);
      console.log('google Signup Error', error);
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
            <Text style={styles.LoginText}>Create an Account</Text>
          </View>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              repeat_password: '',
            }}
            onSubmit={values => {
              if (checked) {
                handleFormSubmit(values);
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
                    marginTop: DeviceHeigth * 0.07,
                    marginLeft: 10,
                  }}>
                  <InputText
                    errors={errors.name}
                    touched={touched.name}
                    value={values.name}
                    leftIcon={localImage.PROFILE}
                    placeholder={'Full Name'}
                    placeholderTextColor={AppColor.PLACEHOLDERCOLOR}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
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
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.02,
                    marginLeft: 10,
                  }}>
                  <InputText
                    leftIcon={localImage.Lock}
                    placeholder={'Password'}
                    placeholderTextColor={'#303841'}
                    passwordInput={true}
                    pasButton={() => setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                    passwordInputIcon={showPassword}
                    errors={errors.password}
                    touched={touched.password}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                </View>
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.02,
                    marginLeft: 10,
                  }}>
                  <InputText
                    leftIcon={localImage.Lock}
                    placeholder={'Confirm Passwordrd'}
                    placeholderTextColor={'#303841'}
                    passwordInput={true}
                    pasButton={() => setIsvisiblepassword(!isVisiblepassword)}
                    secureTextEntry={isVisiblepassword}
                    passwordInputIcon={isVisiblepassword}
                    errors={errors.repeat_password}
                    touched={touched.repeat_password}
                    value={values.repeat_password}
                    onChangeText={handleChange('repeat_password')}
                    onBlur={handleBlur('repeat_password')}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '85%',
                    alignSelf: 'center',
                    paddingRight: DeviceWidth * 0.08,
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
                          navigation.navigate('TermaAndCondition');
                        }}
                        style={styles.policyText1}>
                        Privacy Policy
                      </Text>{' '}
                      and
                      <Text
                        style={styles.policyText1}
                        onPress={() => {
                          navigation.navigate('TermaAndCondition');
                        }}>
                        {' '}
                        Terma os use
                      </Text>{' '}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: DeviceHeigth * 0.08}}>
                  <Button buttonText={'Register'} onPresh={handleSubmit} />
                </View>
              </>
            )}
          </Formik>

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
            Already have an account ?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('WorkoutCategories');
            }}>
            <Text
              style={[
                styles.forgotText,
                {fontSize: 17, fontWeight: '700', color: AppColor.RED},
              ]}>
              {' '}
              Login
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
  policyText: {
    underline: {textDecorationLine: 'underline'},
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '400',
  },
  policyText1: {
    underline: {textDecorationLine: 'underline'},
    fontSize: 15,
    lineHeight: 15,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

export default Signup;
