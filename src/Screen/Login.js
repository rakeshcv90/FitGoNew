import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from '../Component/Image';
import {Api, DeviceHeigth, DeviceWidth} from '../Component/Config';
import {TextInput} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [isLoggedIn, setisLoggedIN] = useState(false);
  const [submitText, setsubmitText] = useState('ENTER');
  const handleBackButtonClick = () => {
    BackHandler.exitApp();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);
  const ErrorHandler = async () => {
    let reg = /\S+@\S+\.\S+/;
    let pass = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    if (!Email) {
      showMessage({
        message: 'Email Alert',
        description: 'Please Enter Your Mail',
        type: 'danger',

        icon: {icon: 'auto', position: 'left'},
      });
      setsubmitText('ENTER');
    } else if (!reg.test(Email)) {
      Alert.alert('Invalid Format');
      showMessage({
        message: 'Email Alert',
        description: 'Invalid Format',
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setsubmitText('ENTER');
    } else if (!Password) {
      Alert.alert('Please Enter Your Password');
      showMessage({
        message: 'Password Alert',
        description: 'Please Enter Your Password',
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
      setsubmitText('ENTER');
    } else {
      try {
        const data = await axios(`${Api}/login.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            email: Email,
            password: Password,
          },
        });
        if (data.data.data[0].msg === 'login Successfully') {
          await AsyncStorage.setItem('Data', JSON.stringify(data.data.data));
          // navigation.navigate('HomeDrawer');
          setsubmitText('ENTER');
          setEmail('');
          setPassword('');
          showMessage({
            message: 'Login Alert',
            description: data.data.data[0].msg,
            type: 'success',
            icon: {icon: 'auto', position: 'left'},
          });
        } else {
          showMessage({
            message: 'Login Alert',
            description: data.data.data[0].msg,
            type: 'danger',
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
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={localImage.logo} />
      <TextInput
        label={'Email'}
        onChangeText={text => setEmail(text)}
        mode="flat"
        autoCapitalize="none"
        style={styles.AuthInput}
        activeUnderlineColor="#f39c1f"
        value={Email}
      />
      <TextInput
        label={'Password'}
        onChangeText={text => setPassword(text)}
        mode="flat"
        secureTextEntry={true}
        style={styles.AuthInput}
        activeUnderlineColor="#f39c1f"
        value={Password}
      />
      <View style={{width: (DeviceWidth * 80) / 100, alignItems: 'flex-end'}}>
        <TouchableOpacity
          style={styles.Forget}
            onPress={() => {
              navigation.navigate('ForgetPassword');
            }}
        >
          <Text style={{color: 'black'}}>Forget Password ?</Text>
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
      }}
      >
        <Text style={{color: 'black', marginBottom: (DeviceHeigth * 5) / 100}}>
          Don't have an account ?{' '}
          <Text style={{color: 'black', fontWeight: 'bold'}}>SignUp</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: DeviceWidth,
    height: DeviceHeigth,
  },
  logo: {
    width: (DeviceWidth * 50) / 100,
    height: (DeviceHeigth * 20) / 100,
    marginBottom: (DeviceHeigth * 5) / 100,
    resizeMode: 'contain',
    marginTop: (DeviceHeigth * 8) / 100,
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
    backgroundColor: '#f39c1f',
    marginBottom: (DeviceHeigth * 2) / 100,
  },
  AuthInput: {
    marginBottom: (DeviceHeigth * 1) / 100,
    backgroundColor: 'transparent',
    width: (DeviceWidth * 80) / 100,
  },
});
export default Login;
