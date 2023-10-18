import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Api, Appapi, DeviceHeigth, DeviceWidth } from '../Component/Config';
import { TextInput } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { useSelector } from 'react-redux'
const Signup = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConformPassword] = useState('');
  const { defaultTheme } = useSelector((state) => state)
  const [submitText, setSubmitText] = useState('Enter');
  const [isVisible, seIsvisible] = useState(false)
  const ToggleVisibility = () => { seIsvisible(!isVisible) }
  let inputData = [];
  const ErrorHandler = () => {
    let reg = /\S+@\S+\.\S+/;
    let pass = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    if (!Name) {
      showMessage({
        message: 'Signup  Alert',
        description: 'Enter Your name',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setSubmitText('Enter');
    } else if (!Email) {
      showMessage({
        message: 'Signup  Alert',
        description: 'Enter Your Email',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setSubmitText('Enter');
    } else if (!reg.test(Email)) {
      showMessage({
        message: 'Signup  Alert',
        description: 'Invalid Format',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setSubmitText('Enter');
    } else if (!Password) {
      showMessage({
        message: 'Signup  Alert',
        description: 'Please Enter Your Password',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setSubmitText('Enter');
    } else if (!ConfirmPassword) {
      showMessage({
        message: 'Signup  Alert',
        description: 'Please enter Confirm  Password',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setSubmitText('Enter');
    } else if (Password != ConfirmPassword) {
      showMessage({
        // message: 'Signup  Alert',
        description: 'Confirm Password does not Match',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
      });
      setSubmitText('Enter');
    } else if (checked == false) {
      showMessage({
        // message: 'Signup  Alert',
        description: 'Please Accept Terms and Conditions',
        type: 'danger',
        icon: { icon: 'auto', position: 'left' },
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
      if (data.data[0].msg === 'Sign Up successful') {

        showMessage({
          message: 'Signup  Alert',
          description: data.data[0].msg,
          type: 'success',
          icon: { icon: 'auto', position: 'left' },
        });
        setSubmitText('Enter');
        setEmail('')
        setName('')
        setPassword('')
        setConformPassword('')
        setChecked(false)

        navigation.navigate('Login');
      } else {

        showMessage({
          message: 'Signup  Alert',
          description: data.data[0].msg,
          type: 'danger',
          icon: { icon: 'auto', position: 'left' },
        });
        setSubmitText('Enter');
      }
    } catch (error) {
      setSubmitText('Enter');
      console.log('eror', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: defaultTheme ? "#000" : "#fff" }}>
      <Text style={[styles.SignUpText, { color: defaultTheme ? "#fff" : "#000" }]}>SignUp</Text>
      <View style={[styles.container, { backgroundColor: defaultTheme ? "#000" : "#fff" }]}>
        <TextInput
          label={'Name'}
          onChangeText={text => setName(text)}
          mode="flat"
          autoCapitalize="none"
          style={styles.AuthInput}
          activeUnderlineColor="#f39c1f"
          value={Name}
          textColor={defaultTheme ? "#fff" : "#000"}
          theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
          underlineColor={defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'}
        />
        <TextInput
          label={'Email'}
          onChangeText={text => setEmail(text.trim())}
          mode="flat"
          autoCapitalize="none"
          style={styles.AuthInput}
          activeUnderlineColor="#f39c1f"
          value={Email}
          textColor={defaultTheme ? "#fff" : "#000"}
          theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
          underlineColor={defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'}
        />
        <TextInput
          label={'Password'}
          onChangeText={text => setPassword(text.trim())}
          mode="flat"
          autoCapitalize="none"
          style={styles.AuthInput}
          activeUnderlineColor="#ec9706"
          value={Password}
          textColor={defaultTheme ? "#fff" : "#000"}
          secureTextEntry={!isVisible}
          underlineColor={defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'}
          theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
          right={<TextInput.Icon icon={isVisible ? 'eye' : 'eye-off'}
            onPress={ToggleVisibility}
            theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }} />}

        />
        <TextInput
          label={'Confirm Password'}
          onChangeText={text => setConformPassword(text.trim())}
          mode="flat"
          autoCapitalize="none"
          style={styles.AuthInput}
          activeUnderlineColor="#f39c1f"
          value={ConfirmPassword}
          textColor={defaultTheme ? "#fff" : "#000"}
          underlineColor={defaultTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'}
          theme={{ colors: { onSurfaceVariant: defaultTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' } }}
        />
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
              {checked && <Text style={{ color: '#fff' }}>&#10004;</Text>}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('TermaAndCondition')
          }}>
            <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>I Agree to Term & Conditions</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.Tbutton}
          onPress={() => {
            setSubmitText('Please Wait...');
            ErrorHandler();
          }}>
          <Text style={{ color: 'white', fontSize: 15 }}>{submitText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={{ color: defaultTheme ? "#fff" : "#000" }}>
            Already have an account ?{' '}
            <Text style={{ color: defaultTheme ? "#fff" : "#000", fontWeight: 'bold' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
});
export default Signup;
