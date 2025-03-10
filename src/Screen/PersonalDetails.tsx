import {StyleSheet, Text, View} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import BottomSheet1 from '../Component/BottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import PredefinedStyles from '../Component/Utilities/PredefineStyles';
import FitInput from '../Component/Utilities/FitInput';
import FitIcon from '../Component/Utilities/FitIcon';
import {AppColor, PLATFORM_IOS} from '../Component/Color';
import FitButton from '../Component/Utilities/FitButton';
import {API_CALLS} from '../API/API_CALLS';
import {setUserProfileData} from '../Component/ThemeRedux/Actions';

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
    <View style={[PredefinedStyles.NormalCenter, styles.container]}>
      <Formik
        initialValues={{
          name: getUserDataDetails?.name,
          email: getUserDataDetails?.email,
          gender: getUserDataDetails?.gender,
        }}
        onSubmit={(values, action) => {
          const data = {
            id: getUserDataDetails.id,
            injury: getUserDataDetails?.injury,
            weight: getUserDataDetails?.weight,
            experience: getUserDataDetails.experience,
            workout_plans:
              getUserDataDetails?.workout_plans == 'AppCreated'
                ? 'Workout Created by Us'
                : 'Custom Workout',
            goal: getUserDataDetails?.goal_title,
            target_weight: getUserDataDetails?.target_weight,
            token: getUserDataDetails.login_token,
            ...values,
          };
          API_CALLS.updateUserDetails(data).then((res: any) => {
            if (typeof res == 'object' && res?.name) {
              dispatch(setUserProfileData(res));
            }
          });
          setIsSheetOpen(false);
        }}
        validationSchema={validationSchema}>
        {({values, handleChange, handleSubmit, errors, touched, dirty}) => (
          <>
            <FitInput
              errors={errors.name}
              touched={touched.name}
              onFocus={() => changeSheetPoint(0.8)}
              placeholder="Name"
              onChangeText={handleChange('name')}
              IconLComp={
                <FitIcon
                  name="user"
                  size={20}
                  type="AntDesign"
                  color={AppColor.NEW_LIGHT_GRAY}
                />
              }
              value={values.name}
              w={'90%'}
              bottomLine
            />
            <FitInput
              errors={errors.email}
              touched={touched.email}
              placeholder="Email"
              onFocus={() => changeSheetPoint(0.8)}
              onChangeText={handleChange('email')}
              IconLComp={
                <FitIcon
                  name="mail-outline"
                  size={20}
                  type="MaterialIcons"
                  color={AppColor.NEW_LIGHT_GRAY}
                />
              }
              value={values.email}
              w={'90%'}
              editable={PLATFORM_IOS ? true : false}
              bottomLine
            />
            <FitInput
              errors={errors.gender}
              touched={touched.gender}
              placeholder="Gender"
              onFocus={() => changeSheetPoint(0.8)}
              onChangeText={handleChange('gender')}
              IconLComp={
                <FitIcon
                  name="gender-male-female"
                  size={20}
                  type="MaterialCommunityIcons"
                  color={AppColor.NEW_LIGHT_GRAY}
                />
              }
              value={values.gender}
              w={'90%'}
              editable={false}
              bottomLine
            />
            {dirty && (
              <FitButton
                onPress={() => handleSubmit()}
                titleText={'UPDATE PROFILE'}
                textColor={AppColor.WHITE}
                mV={30}
                w={'contain'}
              />
            )}
          </>
        )}
      </Formik>
    </View>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColor.WHITE,
  },
});
