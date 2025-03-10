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
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {API_CALLS} from '../API/API_CALLS';
import {navigate} from '../Component/Utilities/NavigationUtil';
import {showMessage} from 'react-native-flash-message';
import {Modal} from 'react-native-paper';

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
  const [visible, setVisible] = useState(false);
  const [allData, setAllData] = useState({
    email: '',
    insertedEmail: '',
    name: '',
  });

  const handleFormSubmit = (values: Values, action?: FormikHelpers<Values>) => {
    setVisible(false);
    API_CALLS.postLogin(values.name, values.email).then((res: any) => {
      console.log(res, 'LOGIN');
      // {"allcompleted": false, "message": "user not exist", "status": true,"term": false}
      // allcompleted => Everything Right
      // status => Issue in API or Version incorrect
      // term => Offer not acceepted
      if (res?.status && !res?.email) {
        API_CALLS.getUserDataDetails(res?.user_id).then((data: any) => {
          if (data) {
            API_CALLS.getSubscriptionDetails(res?.user_id).then(() => {
              if (res?.allcompleted) {
                navigate('BottomTab');
              } else if (res?.status && !res?.term) {
                navigate('Yourself');
              } else if (!res?.term) {
                navigate('OfferTerms');
              }
              action?.resetForm();
            });
          }
        });
      } else {
        showMessage({
          message: `Multiple User with same userID ${res?.email}`,
          type: 'danger',
          floating: true,
        });
        setAllData({
          email: res?.email ?? '',
          insertedEmail: values.email,
          name: values.name,
        });
        setVisible(true);
      }
    });
  };

  const UpdateEmail = () => (
    <Modal visible={visible} onDismiss={() => setVisible(false)}>
      <View
        style={[
          PredefinedStyles.FlexCenter,
          {backgroundColor: AppColor.BACKGROUNG},
        ]}>
        <View
          style={{
            backgroundColor: AppColor.WHITE,
            borderRadius: 20,
            padding: 20,
            width: DeviceWidth * 0.9,
            height: DeviceHeigth / 3,
          }}>
          <View style={PredefinedStyles.rowBetween}>
            <View />
            <FitText type="Heading" value="Update Email" />

            <FitIcon
              name="close"
              size={25}
              type="MaterialCommunityIcons"
              onPress={() => setVisible(false)}
            />
          </View>
          <FitText
            type="SubHeading"
            fontSize={16}
            lineHeight={20}
            value={
              'You already have a account with ' +
              allData.email +
              '. But you have used ' +
              allData.insertedEmail +
              '. Do you want to use your new Email as default email'
            }
            marginVertical={10}
          />
          <View
            style={[
              PredefinedStyles.rowBetween,
              {position: 'absolute', bottom: 20, alignSelf: 'center'},
            ]}>
            <FitButton
              onPress={() =>
                handleFormSubmit({name: allData.name, email: allData.email})
              }
              w={'half'}
              titleText="Continue"
              textColor={AppColor.WHITE}
              bgColor={AppColor.RED1}
              mH={0}
            />
            <FitButton
              onPress={() =>
                API_CALLS.updateEmailOnLogin(
                  allData.name,
                  allData.email,
                  allData.insertedEmail,
                ).finally(() =>
                  handleFormSubmit({name: allData.name, email: allData.email}),
                )
              }
              w={'half'}
              titleText="Update"
              textColor={AppColor.WHITE}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

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
                onPress={() => handleSubmit()}
                textColor={AppColor.WHITE}
                w={'contain'}
                style={{position: 'absolute', bottom: 50}}
              />
            </>
          )}
        </Formik>
      </View>
      <UpdateEmail />
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
