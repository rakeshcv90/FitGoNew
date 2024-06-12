import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FitText from './FitText';
import InputText from '../InputText';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {localImage} from '../Image';
import {AppColor, Fonts} from '../Color';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import ActivityLoader from '../ActivityLoader';
import {setCompleteProfileData} from '../ThemeRedux/Actions';
import {useDispatch} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import {appVersion} from 'react-native-version-number';
import {AnalyticsConsole} from '../AnalyticsConsole';
const validationSchemaBoth = Yup.object().shape({
  name: Yup.string()
    .required('Full Name must contain at least 3 characters')
    .matches(/^[A-Za-z].*/, 'Full Name must start with a character')
    .min(3, 'Full Name must contain at least 3 characters'),

  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});
const validationSchemaName = Yup.object().shape({
  name: Yup.string()
    .required('Full Name must contain at least 3 characters')
    .matches(/^[A-Za-z].*/, 'Full Name must start with a character')
    .min(3, 'Full Name must contain at least 3 characters'),
});
const validationSchemaEmail = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w.\-]+@[\w.\-]+\.\w{2,4}$/, 'Invalid Email Format')
    .required('Email is Required'),
});
const NameUpdateModal = ({
  dataType,
  openEditModal,
  setOpenEditModal,
  user_id,
}: any) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const ProfileDataAPI = async () => {
    try {
      const res = await axios({
        url: NewAppapi.Get_COMPLETE_PROFILE,
        method: 'get',
      });

      if (res?.data) {
        dispatch(setCompleteProfileData(res.data));
        setVisible(false);
        setOpenEditModal(false);
      } else {
        dispatch(setCompleteProfileData([]));
        setOpenEditModal(false);
        setVisible(false);
      }
    } catch (error) {
      dispatch(setCompleteProfileData([]));
      setOpenEditModal(false);
      setVisible(false);
      console.log(error);
    }
  };
  const UpdateAPI = async (values: any) => {
    AnalyticsConsole(`UP_${dataType}_Popup`);
    const payload = new FormData();
    values.name != '' && payload.append('name', values.name);
    payload.append('user_id', user_id);
    values.email != '' && payload.append('email', values.email);
    // payload.append('version', '1.18');
    try {
      setVisible(true);
      const res = await axios(NewAppapi.POST_UPDATE_EMAIL_NAME, {
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('COMPLETE', res.data, payload);
      ProfileDataAPI();
    } catch (error) {
      setVisible(false);
      setOpenEditModal(false);
      console.log('ErrrrPOST NAME UPDATE', error);
    }
  };
  return (
    <Modal transparent visible={openEditModal}>
      <BlurView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        blurType="light"
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      />
      <View
        style={[
          styles.content,
          {
            bottom: DeviceHeigth / 4,
          },
        ]}>
        <View style={styles.View1}>
          <FitText
            type="SubHeading"
            value={`Oops! Looks like some details are missing in your registered profile. Please enter the details below:`}
            textAlign="center"
          />

          <Formik
            initialValues={{
              email: '',
              name: '',
            }}
            onSubmit={(values: any) => UpdateAPI(values)}
            validationSchema={
              dataType == 'both'
                ? validationSchemaBoth
                : dataType == 'name'
                ? validationSchemaName
                : validationSchemaEmail
            }>
            {({
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              errors,
              touched,
            }) => (
              <>
                {(dataType == 'both' || dataType == 'name') && (
                  <>
                    <TextInput
                      value={values.name}
                      onBlur={handleBlur('name')}
                      onChangeText={handleChange('name')}
                      underlineColor="grey"
                      mode="flat"
                      activeUnderlineColor={AppColor.RED}
                      outlineColor={AppColor.WHITE}
                      activeOutlineColor={AppColor.RED}
                      placeholder="Write your Name"
                      placeholderTextColor={AppColor.GRAY2}
                      style={{
                        width: DeviceWidth * 0.65,
                        fontSize: 18,
                        fontWeight: '600',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        color: AppColor.BLACK,
                        backgroundColor: AppColor.WHITE,
                        textAlign: 'center',
                        marginVertical: 5,
                      }}
                    />
                    {errors.name && touched.name && (
                      <FitText type="normal" errorType value={values.name} />
                    )}
                  </>
                )}
                {(dataType == 'both' || dataType == 'email') && (
                  <>
                    <TextInput
                      value={values.email}
                      onBlur={handleBlur('email')}
                      onChangeText={handleChange('email')}
                      underlineColor="grey"
                      mode="flat"
                      activeUnderlineColor={AppColor.RED}
                      outlineColor={AppColor.WHITE}
                      activeOutlineColor={AppColor.RED}
                      placeholder="Write your Email"
                      placeholderTextColor={AppColor.GRAY2}
                      style={{
                        width: DeviceWidth * 0.65,
                        fontSize: 18,
                        fontWeight: '600',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        color: AppColor.BLACK,
                        backgroundColor: AppColor.WHITE,
                        textAlign: 'center',
                      }}
                    />
                    {errors.email && touched.email && (
                      <FitText type="normal" errorType value={values.email} />
                    )}
                  </>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    width: DeviceWidth * 0.3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: AppColor.NEW_DARK_RED,
                    padding: 5,
                    position: 'absolute',
                    bottom: 20,
                    borderRadius: 10,
                  }}>
                  <FitText
                    type="SubHeading"
                    value="Update"
                    color={AppColor.WHITE}
                  />
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </View>
      <ActivityLoader visible={visible} />
    </Modal>
  );
};
export default NameUpdateModal;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  //view
  View1: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 10,
    width: DeviceWidth * 0.9,
    padding: 10,
    alignItems: 'center',
    height: DeviceHeigth / 2.5,
  },
  //img
  img1: {
    height: 100,
    width: 100,
    overflow: 'hidden',
  },
  img2: {
    height: DeviceHeigth * 0.2,
    width: DeviceWidth * 0.45,
    right: DeviceWidth * 0.04,
  },
  //texts
  txt1: {
    color: AppColor.BLACK,
    fontSize: 22,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  content: {
    // flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {height: 5, width: 0},
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
