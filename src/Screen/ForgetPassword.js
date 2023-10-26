import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux'
import { Api, Appapi, DeviceHeigth, DeviceWidth } from '../Component/Config';
import Header from '../Component/Header';
import { showMessage } from 'react-native-flash-message';
import CustomStatusBar from '../Component/CustomStatusBar';
import axios from 'axios';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
let reg = /\S+@\S+\.\S+/;
const ForgetPassword = ({ navigation }) => {
  const [Email, setEmail] = useState('');
  const [inputText, setInputText] = useState('Enter');
  const { defaultTheme } = useSelector((state) => state)
  const ErrorHandle = async () => {
    if (!Email) {
      showMessage({
        message: 'Please Enter your Email',
        // description: 'Please Enter your Email',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setInputText('Enter');
    } else if (!reg.test(Email)) {
      showMessage({
        message: 'Invalid Email Format',
        // description: 'Invalid Email Format',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setInputText('ENTER');
    } else {
      try {
        const data = await axios(`${Api}/${Appapi.forgetPassword}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            email: Email,
          },
        });
        console.log('datatat', data.data[0].msg)
        setInputText('Enter');
        if (data.data[0].msg == 'Mail Sent') {
          showMessage({
            message: data.data[0].msg,
            // description: data.data[0].msg,
            type: 'success',
            icon: { icon: 'auto', position: 'left' },
          });
          navigation.navigate('Login')
        } else {
          showMessage({
            message: data.data[0].msg,
            // description: data.data.data[0].msg,
            type: 'danger',
            icon: { icon: 'auto', position: 'left' },
          });
        }

        setEmail('');
      } catch (error) {
        setInputText('Enter');
        console.log('uygij11111111', error);
        setEmail('');
      }
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
      {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#f39c1f'} /></> : <><CustomStatusBar /></>}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={{ flex: 1 }}>
        <HeaderWithoutSearch Header={'Forget Password'} />

        <View style={[styles.container1, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
          <Text style={[styles.text, { color: defaultTheme ? "#fff" : "#000" }]}>
            We'll send you an email with a reset link
          </Text>
          <TextInput
            label={'Email'}
            textColor={defaultTheme ? "#fff" : "#000"}
            onChangeText={text => {
              setEmail(text.trim());
              setInputText('Enter');
            }}
            mode="flat"
            autoCapitalize="none"
            style={styles.AuthInput}
            activeUnderlineColor="#ec9706"
            value={Email}
            theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
            underlineColor={defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
          />
          <TouchableOpacity
            style={styles.Tbutton}
            onPress={() => {
              setInputText('Please Wait...');
              ErrorHandle();
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>{inputText}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: DeviceWidth,
    height: (DeviceHeigth * 88) / 100,
    marginBottom: (DeviceHeigth * 5) / 100,
  },
  text: {
    color: 'black',
    fontSize: 17,
  },
  Tbutton: {
    width: (DeviceWidth * 80) / 100,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f39c1f',
    marginBottom: (DeviceHeigth * 6) / 100,
  },
  AuthInput: {
    marginVertical: (DeviceHeigth * 2) / 100,
    backgroundColor: 'transparent',
    width: (DeviceWidth * 80) / 100,
  },
});
export default ForgetPassword;
