import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Component/Config';

import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {
  setCompleteProfileData,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {StatusBar} from 'react-native';

import {Platform} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import InputText from '../Component/InputText';
import {TextInput} from 'react-native-paper';
import {localImage} from '../Component/Image';
import Button from '../Component/Button';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const PasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×])[A-Za-z\d!@#$%&*()-_+='":;,.?/~`[{}<>€£¥÷×]{8,}$/;
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full Name is Required')
    .matches(/^[A-Za-z].*/, 'First Name must start with a character')
    .min(3, 'First Name must contain atleast 3 characters'),

  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),

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

const NewPersonalDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [forLoading, setForLoading] = useState(false);
  const [isEditible, setEditable] = useState(false);
  const {getUserDataDetails, completeProfileData} = useSelector(state => state);
  console.log('FFFFFFFFFFF', getUserDataDetails);

  useEffect(() => {
    ProfileDataAPI();
  }, []);

  const ProfileDataAPI = async () => {
    try {
      const res = await axios({
        url: NewAppapi.Get_COMPLETE_PROFILE,
        method: 'get',
      });
   
      if (res.data) {
        dispatch(setCompleteProfileData(res.data));
      } else {
        dispatch(setCompleteProfileData([]));
      }
    } catch (error) {
      dispatch(setCompleteProfileData([]));

      console.log(error);
    }
  };
  console.log('FFFFFFFFFFF', completeProfileData);
  return (
    <View style={styles.Container}>
      <NewHeader header={'Details'} backButton />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Formik
        initialValues={{
          name: getUserDataDetails?.name,
          email: getUserDataDetails?.email,
          gender: getUserDataDetails?.gender,
          goal: getUserDataDetails?.goal_title,
          injury: getUserDataDetails?.injury,

          targetWeight: getUserDataDetails?.target_weight,
          equipment: getUserDataDetails?.equipment,
          focuseAres: getUserDataDetails?.focusarea_title,
          workPlace: getUserDataDetails?.workoutarea,
        }}
        onSubmit={(values, action) => {
          handleFormSubmit(values, action);
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
            <View style={{flex: 8.5}}>
              <ScrollView
                keyboardDismissMode="interactive"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
                  <View
                    style={{
                      paddingTop: 5,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.name}
                      touched={touched.name}
                      value={values.name}
                      onBlur={handleBlur('name')}
                      onChangeText={handleChange('name')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                if (!isEditible) {
                                  setEditable(true);
                                } else {
                                  setEditable(false);
                                }
                              }}>
                              <Image
                                source={localImage.Pen_p}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Full Name"
                      editable={isEditible}
                      placeholder="Full Name"
                    />
                  </View>
                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.email}
                      touched={touched.email}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      label="Email"
                      placeholder="Enter Email id"
                      editable={false}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.gender}
                      touched={touched.gender}
                      onBlur={handleBlur('gender')}
                      value={values.gender}
                      onChangeText={handleChange('gender')}
                      label="Gender"
                      placeholder="Enter Gender"
                      editable={false}
                    />
                  </View>

                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.goal}
                      touched={touched.goal}
                      value={values.goal}
                      onBlur={handleBlur('goal')}
                      onChangeText={handleChange('goal')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                console.log('VDSFdsfvdsvdfs');
                              }}>
                              <Image
                                source={localImage.Down}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Fitness Goal"
                      editable={false}
                      placeholder="Fitness Goal"
                    />
                  </View>
                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.injury}
                      touched={touched.injury}
                      value={values.injury}
                      onBlur={handleBlur('injury')}
                      onChangeText={handleChange('injury')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                console.log('VDSFdsfvdsvdfs');
                              }}>
                              <Image
                                source={localImage.Down}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Injuries In Body Part"
                      editable={false}
                      placeholder="Injuries In Body Part"
                    />
                  </View>

                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.targetWeight}
                      touched={touched.targetWeight}
                      value={values.targetWeight}
                      onBlur={handleBlur('targetWeight')}
                      onChangeText={handleChange('targetWeight')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                console.log('VDSFdsfvdsvdfs');
                              }}>
                              <Image
                                source={localImage.Down}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Target Weight"
                      editable={false}
                      placeholder="Target Weight"
                    />
                  </View>
                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.equipment}
                      touched={touched.equipment}
                      value={values.equipment}
                      onBlur={handleBlur('equipment')}
                      onChangeText={handleChange('equipment')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                console.log('VDSFdsfvdsvdfs');
                              }}>
                              <Image
                                source={localImage.Down}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Choose Your Type"
                      editable={false}
                      placeholder="Choose Your Type"
                    />
                  </View>

                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.focuseAres}
                      touched={touched.focuseAres}
                      value={values.focuseAres}
                      onBlur={handleBlur('focuseAres')}
                      onChangeText={handleChange('focuseAres')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                console.log('VDSFdsfvdsvdfs');
                              }}>
                              <Image
                                source={localImage.Down}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Focus Area"
                      editable={false}
                      placeholder="Focus Area"
                    />
                  </View>
                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                      marginBottom: DeviceHeigth * 0.05,
                    }}>
                    <InputText
                      errors={errors.workPlace}
                      touched={touched.workPlace}
                      value={values.workPlace}
                      onBlur={handleBlur('workPlace')}
                      onChangeText={handleChange('workPlace')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                console.log('VDSFdsfvdsvdfs');
                              }}>
                              <Image
                                source={localImage.Down}
                                tintColor={AppColor.BoldText}
                                style={{width: 18, height: 18}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          )}
                          style={{marginTop: 14}}
                        />
                      }
                      label="Comfort Place"
                      //editable={false}
                      placeholder="Comfort Place"
                    />
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
            <View
              style={{
                flex: 1.5,

                justifyContent: 'center',
              }}>
              <Button buttonText={'Register'} />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default NewPersonalDetails;
