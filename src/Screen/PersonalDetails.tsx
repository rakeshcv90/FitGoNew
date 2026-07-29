import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import FitIcon from '../Component/Utilities/FitIcon';
import {Fonts} from '../Component/Color';
import {API_CALLS} from '../API/API_CALLS';
import {setUserProfileData} from '../Component/ThemeRedux/Actions';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../Component/Image';
import {showMessage} from 'react-native-flash-message';

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

const PersonalDetails = ({
  changeSheetPoint,
  setIsSheetOpen,
}: {
  changeSheetPoint: Dispatch<SetStateAction<number>>;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  return (
    <View style={styles.container}>
      {/* Sheet Header */}
      <View style={styles.sheetHeader}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerAvatarRing}>
          <Image
            source={
              getUserDataDetails?.image_path == null
                ? localImage.avt
                : {uri: getUserDataDetails?.image_path}
            }
            style={styles.headerAvatarImg}
          />
        </LinearGradient>

        <View style={{marginLeft: 14, flex: 1}}>
          <Text style={styles.sheetTitle}>My Details</Text>
          <Text style={styles.sheetSubtitle}>
            Manage your personal profile information
          </Text>
        </View>
      </View>

      <Formik
        initialValues={{
          name: getUserDataDetails?.name || '',
          email: getUserDataDetails?.email || '',
          gender: getUserDataDetails?.gender || '',
        }}
        onSubmit={(values, action) => {
          const data = {
            id: getUserDataDetails.id,
            injury: getUserDataDetails?.injury,
            weight: getUserDataDetails?.weight,
            experience: getUserDataDetails.experience,
            workout_plans:
              getUserDataDetails?.workout_plans === 'AppCreated'
                ? 'Workout Created by Us'
                : 'Custom Workout',
            goal: getUserDataDetails?.goal_title,
            target_weight: getUserDataDetails?.target_weight,
            token: getUserDataDetails.login_token,
            ...values,
          };
          API_CALLS.updateUserDetails(data).then((res: any) => {
            if (typeof res === 'object' && res?.name) {
              dispatch(setUserProfileData(res));
              showMessage({
                message: 'Personal details updated successfully',
                type: 'success',
                animationDuration: 500,
                floating: true,
              });
            }
          });
          setIsSheetOpen(false);
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
          <View style={styles.formSection}>
            {/* Full Name */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputCard}>
                <View style={styles.iconBadge}>
                  <FitIcon
                    name="person"
                    type="Ionicons"
                    size={18}
                    color="#667EEA"
                  />
                </View>

                <TextInput
                  style={styles.textInput}
                  value={values.name}
                  onFocus={() => changeSheetPoint(0.75)}
                  onBlur={handleBlur('name')}
                  onChangeText={handleChange('name')}
                  placeholder="Full Name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={[styles.inputCard, styles.inputCardDisabled]}>
                <View style={styles.iconBadge}>
                  <FitIcon
                    name="mail"
                    type="Ionicons"
                    size={18}
                    color="#64748B"
                  />
                </View>

                <TextInput
                  style={[styles.textInput, {color: '#64748B'}]}
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
            </View>

            {/* Gender */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={[styles.inputCard, styles.inputCardDisabled]}>
                <View style={styles.iconBadge}>
                  <FitIcon
                    name="male-female"
                    type="Ionicons"
                    size={18}
                    color="#64748B"
                  />
                </View>

                <TextInput
                  style={[styles.textInput, {color: '#64748B'}]}
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
            </View>

            {/* Submit Button */}
            <View style={styles.btnSection}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => handleSubmit()}
                style={styles.saveBtnWrapper}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.saveBtn}>
                  <FitIcon
                    name="checkmark-circle"
                    type="Ionicons"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.saveBtnText}>Save Details</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  headerAvatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    marginTop: 1,
  },

  formSection: {
    width: '100%',
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputCardDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '600',
    color: '#0F172A',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    marginTop: 3,
    marginLeft: 4,
  },

  btnSection: {
    marginTop: 16,
    marginBottom: 28,
  },
  saveBtnWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 8,
    borderRadius: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14.5,
    fontWeight: '800',
  },
});
