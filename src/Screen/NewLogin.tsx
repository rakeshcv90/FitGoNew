import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Wrapper from './WorkoutCompleteScreen/Wrapper';
import {AppColor, Fonts} from '../Component/Color';
import FitText from '../Component/Utilities/FitText';
import * as Yup from 'yup';
import FitIcon from '../Component/Utilities/FitIcon';
import FitInput from '../Component/Utilities/FitInput';
import FitButton from '../Component/Utilities/FitButton';
import {Formik, FormikHelpers} from 'formik';
import ActivityLoader from '../Component/ActivityLoader';
import PredefinedStyles from '../Component/Utilities/PredefineStyles';
import {DeviceHeigth} from '../Component/Config';
import {API_CALLS} from '../API/API_CALLS';
import {navigate} from '../Component/Utilities/NavigationUtil';

const validationSchema = Yup.object().shape({
  // name: Yup.string().required('Full Name is required'),
  name: Yup.string()
    .required('Full Name must contain at least 3 characters')
    .matches(/^[A-Za-z].*/, 'Full Name must start with a character')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Full Name must not contain special characters')
    .min(3, 'Full Name must contain at least 3 characters'),

  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});

type Values = {
  name: string;
  email: string;
};

const NewLogin = () => {
  const [loader, setLoader] = useState(false);

  const handleFormSubmit = (values: Values, action: FormikHelpers<Values>) => {
    console.log(values);
    API_CALLS.postLogin(values.name, values.email).then((res: any) => {
      console.log(res, 'LOGIN');
      // {"allcompleted": false, "message": "user not exist", "status": true,"term": false}
      // allcompleted => Everything Right
      // status => Issue in API or Version incorrect
      // term => Offer not acceepted
      if (res?.status) {
        API_CALLS.getUserDataDetails(res?.user_id).then(() => {
          if (res?.allcompleted) {
            navigate('BottomTab');
          } else if (res?.status && !res?.term) {
            navigate('Yourself');
          } else if (!res?.term) {
            navigate('OfferTerms');
          }
          action.resetForm();
        });
      }
    });
  };

  return (
    <Wrapper styles={{paddingTop: DeviceHeigth * 0.15}}>
      <View
        style={[PredefinedStyles.FlexCenter, {justifyContent: 'flex-start'}]}>
        <FitText type="Heading" value="Enter your details" />
        <FitText type="normal" value="Enter your details to continue" />
        {loader && <ActivityLoader />}
        <Formik
          initialValues={{
            name: '',
            email: '',
          }}
          onSubmit={handleFormSubmit}
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
              <FitInput
                errors={errors.name}
                touched={touched.name}
                placeholder="Enter Name"
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
                placeholder="Enter Email"
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
                bottomLine
              />
              <FitButton
                titleText={`Let's Start`}
                onPress={handleSubmit}
                textColor={AppColor.WHITE}
                w={'contain'}
                style={{position: 'absolute', bottom: 50}}
              />
            </>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default NewLogin;

const styles = StyleSheet.create({
  bigText: {
    fontFamily: Fonts.HELVETICA_BOLD,
    fontSize: 16,
    fontWeight: '600',
  },
  small: {
    fontFamily: Fonts.HELVETICA_REGULAR,
    // fontSize: 16,
    fontWeight: '400',
  },
});
