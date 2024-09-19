import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {AppColor} from '../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import {
  Setmealdata,
  setAgreementContent,
  setBanners,
  setCompleteProfileData,
  setCustomWorkoutData,
  setStoreData,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {StatusBar} from 'react-native';

import {Platform} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import InputText from '../Component/InputText';
import {TextInput} from 'react-native-paper';
import {localImage} from '../Component/Image';
import Button from '../Component/Button';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import axios from 'axios';
import ActivityLoader from '../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
import {AnalyticsConsole} from '../Component/AnalyticsConsole';
import NewInputText from '../Component/NewInputText';
import Wrapper from './WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../Component/Headers/NewHeader1';
import NewButton from '../Component/NewButton';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full Name is Required')
    .matches(/^[A-Za-z].*/, 'First Name must start with a character')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Full Name must not contain special characters')
    .min(3, 'First Name must contain atleast 3 characters'),
  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});

const NewPersonalDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [forLoading, setForLoading] = useState(false);
  const [isEditible, setEditable] = useState(false);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [isFocus, setIsFocus] = useState(false);
  const getLaterButtonData = useSelector(state => state.getLaterButtonData);
  const [goalsData, setGoalsData] = useState([]);
  const completeProfileData = useSelector(state => state.completeProfileData);
  const inputRef = useRef(null);
  useEffect(() => {
    getUserAllInData();
  }, []);
  const data = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ];

  const injury = [
    {
      injury_id: 4,
      injury_title: 'Shoulder',
    },
    {
      injury_id: 9,
      injury_title: 'Knee',
    },
    {
      injury_id: 10,
      injury_title: 'Ankle',
    },
    {
      injury_id: 11,
      injury_title: 'Elbow',
    },
    {
      injury_id: 12,
      injury_title: 'Back',
    },
  ];
  const equipment = [
    {label: 'With Equipment', value: 'With Equipment'},
    {label: 'Without Equipment', value: 'Without Equipment'},
  ];
  const focusarea = [
    {value: 1, label: 'Biceps'},
    {value: 3, label: 'Chest'},
    {value: 4, label: 'Legs'},
    {value: 5, label: 'Triceps'},
    {value: 8, label: 'Abs'},
    {value: 9, label: 'Shoulders'},
  ];
  const workoutarea = [
    {
      workoutarea_id: 4,

      workoutarea_title: 'Anywhere',
    },
    {
      workoutarea_id: 5,

      workoutarea_title: 'At Bed',
    },
    {
      workoutarea_id: 6,

      workoutarea_title: 'Outdoor',
    },
    {
      workoutarea_id: 7,

      workoutarea_title: 'At Home',
    },
  ];
  const workout_plans = [
    {label: 'Workout Created by Us', value: 'AppCreated'},
    {label: 'Custom Workout', value: 'CustomCreated'},
  ];

  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (responseData?.data?.msg == 'version is required') {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        const objects = {};
        responseData.data.data.forEach(item => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
        const temp = responseData?.data?.additional_data?.goal?.filter(
          item => item?.goal_gender == getUserDataDetails?.gender,
        );
        setGoalsData(temp);
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
      setGoalsData([]);
    }
  };
  const renderLabel = item => {
    if (!isFocus) {
      return <Text style={[styles.label, {color: 'black'}]}>{item}</Text>;
    }
    return null;
  };

  const handleFormSubmit = async (values, action) => {
    setForLoading(true);
    // AnalyticsConsole(`PROFILE_UPDATE_BUTTON`);
    try {
      const dataItem = await axios(`${NewAppapi.UpdateUserProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: values.name,
          id: getUserDataDetails.id,
          token: getUserDataDetails.login_token,
          version: VersionNumber.appVersion,
          goal: values.goal,
          injury: getUserDataDetails?.injury,
          weight: getUserDataDetails?.weight,
          target_weight: values.targetWeight,
          email: values.email,
          gender: values.gender,
          experience: getUserDataDetails.experience,
          workout_plans: values.workout_plans,
        },
      });
      if (dataItem.data.msg == 'User Updated Successfully') {
        showMessage({
          message: 'Details updated successfully.',
          floating: true,
          type: 'success',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });

        setForLoading(false);
        dispatch(setUserProfileData(dataItem.data.profile));
      } else if (
        dataItem?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: dataItem?.data?.msg,
          floating: true,
          type: 'danger',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });

        setForLoading(false);
      } else {
        console.log('message-------->', dataItem?.data?.msg);
        showMessage({
          message: dataItem?.data?.msg,
          floating: true,
          type: 'danger',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });
        setForLoading(false);
      }
    } catch (error) {
      setForLoading(false);
      console.log('Update Profile Data', error);
      //  showMessage({
      //     message: data.data.msg,
      //     floating: true,
      //     type: 'danger',
      //     animationDuration: 750,
      //     icon: {icon: 'none', position: 'left'},
      //   });
    }
  };

  return (
    <View style={styles.Container}>
      {forLoading ? <ActivityLoader /> : null}
      <Wrapper>
        <NewHeader1 header={'Details'} backButton />
        <Formik
          initialValues={{
            name: getUserDataDetails?.name,
            email: getUserDataDetails?.email,
            gender: getUserDataDetails?.gender,
            experience: getUserDataDetails?.experience,
            workout_plans:
              getUserDataDetails?.workout_plans == 'AppCreated'
                ? 'Workout Created by Us'
                : 'Custom Workout',
            goal: getUserDataDetails?.goal_title,
            // injury: getUserDataDetails?.injury,

            targetWeight: getUserDataDetails?.target_weight,
            equipment: getUserDataDetails?.equipment,
            focuseAres: [],
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
            dirty,
            setFieldValue,
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
                      {/* <InputText
                      errors={errors.name}
                      ref={inputRef}
                      touched={touched.name}
                      value={values.name}
                      onBlur={handleBlur('name')}
                      onChangeText={handleChange('name')}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => {
                                setEditable(prev => {
                                  const newEditableState = !prev;
                                  // We need to defer the focus call until the state has updated
                                  if (!prev) {
                                    setTimeout(() => {
                                      inputRef.current?.focus();
                                    }, 0);
                                  }
                                  return newEditableState;
                                });
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
                    /> */}
                      <NewInputText
                        errors={errors.name}
                        touched={touched.name}
                        value={values.name}
                        onBlur={handleBlur('name')}
                        onChangeText={handleChange('name')}
                        colorText={false}
                        placeholder="Full Name"
                        label="Full Name"
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
                        editable={Platform.OS == 'ios' ? true : false}
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
                        placeholder={getUserDataDetails?.gender}
                        editable={false}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: DeviceHeigth * 0.02,
                        marginLeft: 10,
                        marginBottom: 10,
                      }}>
                      <InputText
                        errors={errors.experience}
                        touched={touched.experience}
                        onBlur={handleBlur('experience')}
                        value={values.experience}
                        onChangeText={handleChange('experience')}
                        label="Fitness Level"
                        placeholder={getUserDataDetails?.experience}
                        editable={false}
                      />
                    </View>
                    {values.experience == 'Beginner' && (
                      <>
                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.02,

                            alignItems: 'center',
                          }}>
                          {renderLabel('Fitness Goal')}

                          <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            itemTextStyle={{color: AppColor.BLACK}}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={goalsData}
                            labelField="goal_title"
                            valueField="goal_title"
                            placeholder={getUserDataDetails?.goal_title}
                            value={values.goal}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFieldValue('goal', item.goal_title);
                            }}
                          />
                        </View>
                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.02,
                            marginLeft: 10,
                            paddingBottom: DeviceHeigth * 0.05,
                            marginBottom: 10,
                          }}>
                          <InputText
                            errors={errors.targetWeight}
                            touched={touched.targetWeight}
                            value={values.targetWeight}
                            onBlur={handleBlur('targetWeight')}
                            onChangeText={handleChange('targetWeight')}
                            label="Target Weight"
                            placeholder="Target Weight"
                          />
                        </View>
                      </>
                    )}
                    {values.experience == 'Experienced' && (
                      <View
                        style={{
                          marginTop: DeviceHeigth * 0.02,

                          alignItems: 'center',
                        }}>
                        {renderLabel('Workout Plan')}

                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          itemTextStyle={{color: AppColor.BLACK}}
                          data={workout_plans}
                          labelField="label"
                          valueField="label"
                          placeholder={getUserDataDetails?.workout_plans}
                          value={values.workout_plans}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setFieldValue('workout_plans', item.value);
                          }}
                        />
                      </View>
                    )}

                    {values.workout_plans == 'AppCreated' &&
                      values.experience == 'Experienced' && (
                        <>
                          <View
                            style={{
                              marginTop: DeviceHeigth * 0.02,

                              alignItems: 'center',
                            }}>
                            {renderLabel('Fitness Goal')}

                            <Dropdown
                              style={[styles.dropdown]}
                              placeholderStyle={styles.placeholderStyle}
                              itemTextStyle={{color: AppColor.BLACK}}
                              selectedTextStyle={styles.selectedTextStyle}
                              data={goalsData}
                              labelField="goal_title"
                              valueField="goal_title"
                              placeholder={
                                getUserDataDetails?.goal_title == null
                                  ? 'Select Fitness Goal'
                                  : getUserDataDetails?.goal_title
                              }
                              value={values.goal}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                setFieldValue('goal', item.goal_title);
                              }}
                            />
                          </View>
                          <View
                            style={{
                              marginTop: DeviceHeigth * 0.02,
                              marginLeft: 10,
                              paddingBottom: DeviceHeigth * 0.05,
                            }}>
                            <InputText
                              errors={errors.targetWeight}
                              touched={touched.targetWeight}
                              value={
                                values?.targetWeight == 'undefined'
                                  ? 0
                                  : values?.targetWeight
                              }
                              onBlur={handleBlur('targetWeight')}
                              onChangeText={handleChange('targetWeight')}
                              label="Target Weight"
                              keyboardType="number-pad"
                              placeholder="Target Weight"
                            />
                          </View>
                        </>
                      )}
                  </KeyboardAvoidingView>
                </ScrollView>
              </View>
              <View
                style={{
                  flex: 1.5,

                  justifyContent: 'center',
                }}>
                <NewButton
                  title={'Update Profile'}
                  onPress={handleSubmit}
                  disabled={!dirty}
                  ButtonWidth={DeviceWidth * 0.6}
                  buttonColor={dirty ? AppColor.RED : '#33333380'}
                />
              </View>
            </>
          )}
        </Formik>
      </Wrapper>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  dropdown: {
    height: 55,
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    width: '91%',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: -5,
    zIndex: 999,
    paddingHorizontal: 15,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: AppColor.BLACK,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
    borderColor: AppColor.BLACK,
    marginHorizontal: DeviceWidth * 0.07,
  },
});
export default NewPersonalDetails;
