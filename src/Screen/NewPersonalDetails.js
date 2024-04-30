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
import {
  setCompleteProfileData,
  setCustomWorkoutData,
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

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full Name is Required')
    .matches(/^[A-Za-z].*/, 'First Name must start with a character')
    .min(3, 'First Name must contain atleast 3 characters'),
});

const NewPersonalDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [forLoading, setForLoading] = useState(false);
  const [isEditible, setEditable] = useState(false);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [isFocus, setIsFocus] = useState(false);
  console.log('User Details', getUserDataDetails);

  useEffect(() => {
    ProfileDataAPI();
  }, []);
  const data = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ];
  const maleGole = [
    {label: 'Weight Loss', value: 3},
    {label: 'Build Muscle', value: 6},
    {label: 'Strength', value: 13},
  ];
  const fmaleGole = [
    {label: 'Weight Loss', value: 1},
    {label: 'Build Muscle', value: 2},
    {label: 'Strength', value: 4},
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
    {label: 'AppCreated', value: 'AppCreated'},
    {label: 'CustomCreated', value: 'CustomCreated'},
  ];
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

  const renderLabel = item => {
    if (!isFocus) {
      return <Text style={[styles.label, {color: 'black'}]}>{item}</Text>;
    }
    return null;
  };
  const handleFormSubmit = async (values, action) => {
    console.log('DDDDDDDDD', values);
    // setForLoading(true);
    // try {
    //   const data = await axios(`${NewAppapi.UpdateUserProfile}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //     data: {
    //       name: values.name,
    //       id: getUserDataDetails.id,
    //       token: getUserDataDetails.login_token,
    //       version: VersionNumber.appVersion,
    //       goal: values.goal,
    //       injury: values.injury,
    //       weight: values.name,
    //       target_weight: values.targetWeight,
    //       equipment_type: values.equipment,
    //       focusarea:
    //         values.focuseAres.length > 0
    //           ? values.focuseAres.join(',')
    //           : getUserDataDetails.focus_area,
    //       place: values.workPlace,
    //       gender: values.gender,
    //     },
    //   });

    //   if (data?.data?.msg == 'User Updated Successfully') {
    //     showMessage({
    //       message: data.data.msg,
    //       floating: true,
    //       type: 'success',
    //       animationDuration: 750,
    //       icon: {icon: 'none', position: 'left'},
    //     });

    //     setForLoading(false);
    //     dispatch(setUserProfileData(data.data.profile));
    //     dispatch(setCustomWorkoutData(data?.data.allworkouts));
    //   } else if (
    //     data?.data?.msg == 'Please update the app to the latest version.'
    //   ) {
    //     showMessage({
    //       message: data?.data?.msg,
    //       floating: true,
    //       type: 'danger',
    //       animationDuration: 750,
    //       icon: {icon: 'none', position: 'left'},
    //     });

    //     setForLoading(false);
    //   } else {
    //     showMessage({
    //       message: data.data.msg,
    //       floating: true,
    //       type: 'danger',
    //       animationDuration: 750,
    //       icon: {icon: 'none', position: 'left'},
    //     });
    //     setForLoading(false);
    //   }
    // } catch (error) {
    //   setForLoading(false);
    //   console.log('Update Profile Data', error);
    //   //  showMessage({
    //   //     message: data.data.msg,
    //   //     floating: true,
    //   //     type: 'danger',
    //   //     animationDuration: 750,
    //   //     icon: {icon: 'none', position: 'left'},
    //   //   });
    // }
  };

  return (
    <View style={styles.Container}>
      <NewHeader header={'Details'} backButton />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      {forLoading ? <ActivityLoader /> : ''}
      <Formik
        initialValues={{
          name: getUserDataDetails?.name,
          email: getUserDataDetails?.email,
          gender: getUserDataDetails?.gender,
          experience: getUserDataDetails?.experience,
          workout_plans: getUserDataDetails?.workout_plans,
          goal: getUserDataDetails?.goal_title,
          injury: getUserDataDetails?.injury,

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
                      placeholder={getUserDataDetails?.gender}
                      editable={false}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: DeviceHeigth * 0.02,
                      marginLeft: 10,
                    }}>
                    <InputText
                      errors={errors.experience}
                      touched={touched.experience}
                      onBlur={handleBlur('experience')}
                      value={values.experience}
                      onChangeText={handleChange('experience')}
                      label="Fitness-Level"
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
                          data={
                            values.gender == 'Female' ? fmaleGole : maleGole
                          }
                          labelField="label"
                          valueField="label"
                          placeholder={getUserDataDetails?.goal_title}
                          value={values.goal}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setFieldValue('goal', item.label);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          marginTop: DeviceHeigth * 0.02,

                          alignItems: 'center',
                        }}>
                        {renderLabel('Injuries In Body Part')}
                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          itemTextStyle={{color: AppColor.BLACK}}
                          data={injury}
                          labelField="injury_title"
                          valueField="injury_title"
                          placeholder={getUserDataDetails?.injury}
                          value={values.injury}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setFieldValue('injury', item.injury_title);
                          }}
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
                          label="Target Weight"
                          placeholder="Target Weight"
                        />
                      </View>
                      <View
                        style={{
                          marginTop: DeviceHeigth * 0.02,

                          alignItems: 'center',
                        }}>
                        {renderLabel('Choose Your Type')}

                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          itemTextStyle={{color: AppColor.BLACK}}
                          data={equipment}
                          labelField="label"
                          valueField="value"
                          placeholder={getUserDataDetails?.equipment}
                          value={values.equipment}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setFieldValue('equipment', item.value);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          marginTop: DeviceHeigth * 0.02,

                          alignItems: 'center',
                        }}>
                        {renderLabel('Focus Area')}
                        <MultiSelect
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          itemTextStyle={{color: AppColor.BLACK}}
                          data={focusarea}
                          labelField="label"
                          valueField="value"
                          placeholder={getUserDataDetails?.focusarea_title}
                          value={values.focuseAres}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setFieldValue('focuseAres', item);
                          }}
                          selectedStyle={styles.selectedStyle}
                        />
                      </View>
                      <View
                        style={{
                          marginTop: DeviceHeigth * 0.02,

                          alignItems: 'center',
                        }}>
                        {renderLabel('Comfort Place')}
                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          itemTextStyle={{color: AppColor.BLACK}}
                          data={workoutarea}
                          labelField="workoutarea_title"
                          valueField="workoutarea_title"
                          placeholder={getUserDataDetails?.workoutarea}
                          value={values.workPlace}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setFieldValue('workPlace', item.workoutarea_title);
                          }}
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
                      {renderLabel('Workout-Plan')}

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
                          setFieldValue('workout_plans', item.label);
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
                            data={
                              values.gender == 'Female' ? fmaleGole : maleGole
                            }
                            labelField="label"
                            valueField="label"
                            placeholder={
                              getUserDataDetails?.goal_title == null
                                ? 'Select Fitness Goal'
                                : getUserDataDetails?.goal_title
                            }
                            value={values.goal}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFieldValue('goal', item.label);
                            }}
                          />
                        </View>
                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.02,

                            alignItems: 'center',
                          }}>
                          {renderLabel('Injuries In Body Part')}
                          <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={{color: AppColor.BLACK}}
                            data={injury}
                            labelField="injury_title"
                            valueField="injury_title"
                            placeholder={
                              getUserDataDetails?.injury == 'null'
                                ? 'Select Injuries'
                                : getUserDataDetails?.injury
                            }
                            value={values.injury}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFieldValue('injury', item.injury_title);
                            }}
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
                            value={
                              values?.targetWeight == 'undefined'
                                ? 0
                                : values?.targetWeight
                            }
                            onBlur={handleBlur('targetWeight')}
                            onChangeText={handleChange('targetWeight')}
                            label="Target Weight"
                            placeholder="Target Weight"
                          />
                        </View>
                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.02,

                            alignItems: 'center',
                          }}>
                          {renderLabel('Choose Your Type')}

                          <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={{color: AppColor.BLACK}}
                            data={equipment}
                            labelField="label"
                            valueField="value"
                            placeholder={
                              getUserDataDetails?.equipment == 'undefined'
                                ? 'Choose Your Type'
                                : getUserDataDetails?.equipment
                            }
                            value={values.equipment}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFieldValue('equipment', item.value);
                            }}
                          />
                        </View>

                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.02,

                            alignItems: 'center',
                          }}>
                          {renderLabel('Focus Area')}
                          <MultiSelect
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={{color: AppColor.BLACK}}
                            data={focusarea}
                            labelField="label"
                            valueField="value"
                            placeholder={
                              getUserDataDetails?.focusarea_title == null
                                ? 'Select Focus Area'
                                : getUserDataDetails?.focusarea_title
                            }
                            value={values.focuseAres}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFieldValue('focuseAres', item);
                            }}
                            selectedStyle={styles.selectedStyle}
                          />
                        </View>
                        <View
                          style={{
                            marginTop: DeviceHeigth * 0.02,

                            alignItems: 'center',
                          }}>
                          {renderLabel('Comfort Place')}
                          <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={{color: AppColor.BLACK}}
                            data={workoutarea}
                            labelField="workoutarea_title"
                            valueField="workoutarea_title"
                            placeholder={
                              getUserDataDetails?.workoutarea == 'null'
                                ? 'Select Comfort Place'
                                : getUserDataDetails?.workoutarea
                            }
                            value={values.workPlace}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFieldValue(
                                'workPlace',
                                item.workoutarea_title,
                              );
                            }}
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
              <Button buttonText={'Register'} onPresh={handleSubmit} />
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
