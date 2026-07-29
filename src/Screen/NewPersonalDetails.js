import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppColor, Fonts} from '../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import {
  Setmealdata,
  setAgreementContent,
  setBanners,
  setCompleteProfileData,
  setStoreData,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {Formik} from 'formik';
import * as Yup from 'yup';
import VersionNumber from 'react-native-version-number';
import {localImage} from '../Component/Image';
import axios from 'axios';
import ActivityLoader from '../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
import {AnalyticsConsole} from '../Component/AnalyticsConsole';
import Wrapper from './WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../Component/Headers/NewHeader1';
import FitDropdown from '../Component/Utilities/FitDropdown';
import FitIcon from '../Component/Utilities/FitIcon';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedReanimated, {FadeInDown} from 'react-native-reanimated';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full Name is Required')
    .matches(/^[A-Za-z].*/, 'First Name must start with a character')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Full Name must not contain special characters')
    .min(3, 'First Name must contain at least 3 characters'),
  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});

const NewPersonalDetails = ({navigation}) => {
  const dispatch = useDispatch();
  const [forLoading, setForLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [goalsData, setGoalsData] = useState([]);
  const inputRef = useRef < any > null;

  useEffect(() => {
    getUserAllInData();
    setIsEditable(false);
  }, []);

  const handleIconPress = () => {
    setIsEditable(prev => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 80);
      }
      return nextState;
    });
  };

  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
      );

      if (
        responseData?.data?.msg ===
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (responseData?.data?.msg === 'version is required') {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        const objects: any = {};
        responseData?.data?.data?.forEach((item: any) => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms?.[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
        const temp = responseData?.data?.additional_data?.goal?.filter(
          (item: any) => item?.goal_gender === getUserDataDetails?.gender,
        );
        setGoalsData(temp || []);
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
      setGoalsData([]);
    }
  };

  const handleFormSubmit = async (values: any) => {
    setForLoading(true);
    AnalyticsConsole('PROFILE_UPDATE_BUTTON');
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
      if (dataItem.data.msg === 'User Updated Successfully') {
        showMessage({
          message: 'Personal details updated successfully.',
          floating: true,
          type: 'success',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });

        setForLoading(false);
        dispatch(setUserProfileData(dataItem.data.profile));
        navigation.goBack();
      } else {
        showMessage({
          message: dataItem?.data?.msg || 'Something went wrong',
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
    }
  };

  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#F8FAFC'} />
      {forLoading ? <ActivityLoader visible={true} /> : null}

      <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
        <NewHeader1 header={'My Details'} backButton />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Header Hero Profile Card */}
            <AnimatedReanimated.View
              entering={FadeInDown.duration(400).springify()}
              style={styles.heroProfileCard}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.heroRow}>
                <View style={styles.avatarRing}>
                  <Image
                    source={
                      getUserDataDetails?.image_path == null
                        ? localImage.avt
                        : {uri: getUserDataDetails?.image_path}
                    }
                    style={styles.avatarImg}
                    resizeMode="cover"
                  />
                </View>

                <View style={{marginLeft: 14, flex: 1}}>
                  <Text style={styles.heroNameText} numberOfLines={1}>
                    {getUserDataDetails?.name || 'Guest User'}
                  </Text>
                  <Text style={styles.heroEmailText} numberOfLines={1}>
                    {getUserDataDetails?.email || 'guest@gmail.com'}
                  </Text>
                </View>
              </View>
            </AnimatedReanimated.View>

            {/* Form Section */}
            <Formik
              initialValues={{
                name: getUserDataDetails?.name || '',
                email: getUserDataDetails?.email || '',
                gender: getUserDataDetails?.gender || '',
                experience: getUserDataDetails?.experience || '',
                workout_plans:
                  getUserDataDetails?.workout_plans === 'AppCreated'
                    ? 'Workout Created by Us'
                    : 'Custom Workout',
                goal: getUserDataDetails?.goal_title || '',
                targetWeight: getUserDataDetails?.target_weight || '',
              }}
              onSubmit={(values, action) => {
                setIsEditable(false);
                handleFormSubmit(values);
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
                <View style={styles.formCard}>
                  {/* Field 1: Full Name */}
                  <AnimatedReanimated.View
                    entering={FadeInDown.delay(100).duration(400).springify()}
                    style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>Full Name</Text>

                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={handleIconPress}
                      style={[
                        styles.inputBox,
                        isEditable && styles.inputBoxActive,
                      ]}>
                      <View style={styles.fieldIconBadge}>
                        <FitIcon
                          name="person"
                          type="Ionicons"
                          size={18}
                          color="#667EEA"
                        />
                      </View>

                      <TextInput
                        ref={inputRef}
                        style={styles.textInputField}
                        value={values.name}
                        onBlur={handleBlur('name')}
                        onChangeText={handleChange('name')}
                        placeholder="Full Name"
                        placeholderTextColor="#94A3B8"
                        editable={isEditable}
                      />

                      <TouchableOpacity
                        onPress={handleIconPress}
                        style={styles.editPenBtn}
                        activeOpacity={0.7}>
                        <FitIcon
                          name={isEditable ? 'checkmark' : 'pencil'}
                          type="Ionicons"
                          size={16}
                          color={isEditable ? '#10B981' : '#64748B'}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {errors.name && touched.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </AnimatedReanimated.View>

                  {/* Field 2: Email Address */}
                  <AnimatedReanimated.View
                    entering={FadeInDown.delay(200).duration(400).springify()}
                    style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>Email Address</Text>

                    <View style={[styles.inputBox, styles.inputBoxDisabled]}>
                      <View style={styles.fieldIconBadge}>
                        <FitIcon
                          name="mail"
                          type="Ionicons"
                          size={18}
                          color="#64748B"
                        />
                      </View>

                      <TextInput
                        style={[styles.textInputField, {color: '#64748B'}]}
                        value={values.email}
                        placeholder="Email Address"
                        placeholderTextColor="#94A3B8"
                        editable={false}
                      />

                      <FitIcon
                        name="lock-closed"
                        type="Ionicons"
                        size={16}
                        color="#94A3B8"
                      />
                    </View>
                  </AnimatedReanimated.View>

                  {/* Field 3: Gender */}
                  <AnimatedReanimated.View
                    entering={FadeInDown.delay(300).duration(400).springify()}
                    style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>Gender</Text>

                    <View style={[styles.inputBox, styles.inputBoxDisabled]}>
                      <View style={styles.fieldIconBadge}>
                        <FitIcon
                          name="male-female"
                          type="Ionicons"
                          size={18}
                          color="#64748B"
                        />
                      </View>

                      <TextInput
                        style={[styles.textInputField, {color: '#64748B'}]}
                        value={values.gender}
                        placeholder="Gender"
                        placeholderTextColor="#94A3B8"
                        editable={false}
                      />

                      <FitIcon
                        name="lock-closed"
                        type="Ionicons"
                        size={16}
                        color="#94A3B8"
                      />
                    </View>
                  </AnimatedReanimated.View>

                  {/* Field 4: Fitness Goal (if available) */}
                  {getUserDataDetails?.workout_plans === 'AppCreated' &&
                    goalsData?.length > 0 && (
                      <AnimatedReanimated.View
                        entering={FadeInDown.delay(400)
                          .duration(400)
                          .springify()}
                        style={styles.fieldWrapper}>
                        <FitDropdown
                          data={goalsData}
                          onChange={item => {
                            setFieldValue('goal', item.goal_title);
                          }}
                          floatingText="Fitness Goal"
                          selectedValue={values.goal}
                          textDisplayKey={'goal_title'}
                          imageDisplayKey={'goal_image'}
                          showItemIcons
                        />
                      </AnimatedReanimated.View>
                    )}

                  {/* Submit Button */}
                  <AnimatedReanimated.View
                    entering={FadeInDown.delay(500).duration(400).springify()}
                    style={styles.submitBtnSection}>
                    <TouchableOpacity
                      activeOpacity={0.88}
                      disabled={!dirty || forLoading}
                      onPress={() => handleSubmit()}
                      style={[
                        styles.submitBtnWrapper,
                        !dirty && {opacity: 0.5},
                      ]}>
                      <LinearGradient
                        colors={
                          dirty
                            ? ['#667EEA', '#764BA2']
                            : ['#94A3B8', '#64748B']
                        }
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.submitBtn}>
                        <FitIcon
                          name="checkmark-circle"
                          type="Ionicons"
                          size={20}
                          color="#FFFFFF"
                        />
                        <Text style={styles.submitBtnText}>Update Profile</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </AnimatedReanimated.View>
                </View>
              )}
            </Formik>
          </KeyboardAvoidingView>
        </ScrollView>
      </Wrapper>
    </View>
  );
};

export default NewPersonalDetails;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Card
  heroProfileCard: {
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 20,
    marginVertical: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#764BA2',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.22,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  heroNameText: {
    fontSize: 19,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroEmailText: {
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },

  // Form Section
  formCard: {
    width: DeviceWidth * 0.92,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  fieldWrapper: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputBoxActive: {
    borderColor: '#667EEA',
    backgroundColor: '#FFFFFF',
  },
  inputBoxDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  fieldIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '600',
    color: '#0F172A',
  },
  editPenBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    marginTop: 4,
    marginLeft: 4,
  },

  // Submit Button
  submitBtnSection: {
    marginTop: 10,
  },
  submitBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
    borderRadius: 16,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '800',
  },
});
