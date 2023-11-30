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
} from 'react-native';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';
import ActivityLoader from '../Component/ActivityLoader';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {AppColor} from '../Component/Color';
import InputText from '../Component/InputText';
import Button from '../Component/Button';
import InputTextPassword from '../Component/InputTextPassword';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});

const OtpVerification = ({navigation}) => {
  const [forLoading, setForLoading] = useState(false);
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
          behavior={Platform.OS == 'ios' ? 'position' : undefined}
          contentContainerStyle={{flexGrow: 1}}>
          {forLoading ? <ActivityLoader /> : ''}
          <View style={styles.TextContainer}>
            <Text style={styles.LoginText}>Verify Account</Text>
            <Text style={[styles.LoginText2, {marginTop: DeviceHeigth * 0.02}]}>
              {'Verify your account by entering verification'}
            </Text>
            <Text style={[styles.LoginText2, {marginTop: DeviceHeigth * 0.0}]}>
              {' code we sent to '}{' '}
              <Text style={[styles.LoginText3]}>{'abc@gmail.com'}</Text>
            </Text>
          </View>
          <Formik
            initialValues={{
              otp1: '',
              otp2: '',
              otp3: '',
              otp4: '',
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
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.07,
                    marginLeft:DeviceWidth*0.07
                  }}>
                  <InputTextPassword
                    onChangeText={handleChange('email')}
                    errors={errors.email}
                    touched={touched.email}
                    value={values.email}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={1}
                  />
                </View>
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.07,
                    marginLeft:-DeviceWidth*0.02
                  }}>
                  <InputTextPassword
                    onChangeText={handleChange('email')}
                    errors={errors.email}
                    touched={touched.email}
                    value={values.email}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={1}
                  />
                </View>
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.07,
                    marginLeft:-DeviceWidth*0.02
                  }}>
                  <InputTextPassword
                    onChangeText={handleChange('email')}
                    errors={errors.email}
                    touched={touched.email}
                    value={values.email}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={1}
                  />
                </View>
                <View
                  style={{
                    marginTop: DeviceHeigth * 0.07,
                    marginLeft:-DeviceWidth*0.02,
                    marginRight:DeviceWidth*0.07
                  }}>
                  <InputTextPassword
                    onChangeText={handleChange('email')}
                    errors={errors.email}
                    touched={touched.email}
                    value={values.email}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={1}
                  />
                </View>
                </View>
                <View style={{marginTop: DeviceHeigth * 0.08}}>
                  <Button buttonText={'Verify'} onPresh={handleSubmit} />
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
});
export default OtpVerification;
