import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import {TextInput} from 'react-native-paper';

import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import Header from '../Component/Header';

const ForgetPassword = () => {
  const [Email, setEmail] = useState('');
  const [inputText, setInputText] = useState('Enter');
  return (
      <SafeAreaView style={styles.container}>
  <Header header={"ForgetPassword"}/>
      <View style={styles.container1}>
        <Text style={styles.text}>
          We'll send you an email with a reset link
        </Text>
        <TextInput
          label={'Email'}
          onChangeText={text => {
            setEmail(text.trim());
            setInputText('Enter');
          }}
          mode="flat"
          autoCapitalize="none"
          style={styles.AuthInput}
          activeUnderlineColor="#ec9706"
          value={Email}
        />
        <TouchableOpacity
          style={styles.Tbutton}
          onPress={() => {
            setInputText('Please Wait...');
            ErrorHandle();
          }}>
          <Text style={{color: 'white', fontSize: 15}}>{inputText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
