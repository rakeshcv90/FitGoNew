import {
  Image,
  KeyboardAvoidingView,
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
import {
  Setmealdata,
  setAgreementContent,
  setBanners,
  setCompleteProfileData,
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setStoreData,
  setUserProfileData,
} from '../ThemeRedux/Actions';
import {useDispatch} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {showMessage} from 'react-native-flash-message';
import FitIcon from './FitIcon';
import {EnteringEventFunction} from '../../Screen/Event/EnteringEventFunction';
const validationSchemaBoth = Yup.object().shape({
  name: Yup.string()
    .required('Full Name must contain at least 3 characters')
    .matches(/^[A-Za-z].*/, 'Full Name must start with a character')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Full Name must not contain special characters')
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
        responseData.data.data.forEach((item: any) => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
        setVisible(false);
        setOpenEditModal(false);
      }
      // } else if (
      //   responseData?.data?.msg == 'Please update the app to the latest version.'
      // ) {
      //   showMessage({
      //     message: responseData?.data?.msg,
      //     floating: true,
      //     duration: 500,
      //     type: 'danger',
      //   });
      // }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
      setVisible(false);
      setOpenEditModal(false);
    }
  };

  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${user_id}`,
      );

      getUserAllInData();
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
      } else {
        showMessage({
          message: 'Details updated successfully',
          type: 'success',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);

      getUserAllInData();
    }
  };
  const UpdateAPI = async (values: any) => {
    AnalyticsConsole(`UP_${dataType}_Popup`);
    const payload = new FormData();
    values.name != '' && payload.append('name', values.name);
    payload.append('user_id', user_id);
    values.email != '' && payload.append('email', values.email);

    try {
      setVisible(true);
      const res = await axios(NewAppapi.POST_UPDATE_EMAIL_NAME, {
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('PAYLOAD', payload, res.data);
      if (res.data?.msg == 'user not exist') {
        setVisible(false);
        showMessage({
          message: res.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (res.data?.msg == 'email alrady exist') {
        setVisible(false);
        showMessage({
          message: res.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        getUserDetailData();
      }
    } catch (error) {
      setVisible(false);
      setOpenEditModal(false);
      console.log('ErrrrPOST NAME UPDATE', error);
      showMessage({
        message: 'Please try again later',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  return (
    <Modal transparent visible={openEditModal} animationType='slide'>
      <KeyboardAvoidingView
        style={[styles.content]}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
        <View
          style={[
            styles.View1,
            {
              height:
                dataType == 'both' ? DeviceHeigth * 0.7 : DeviceHeigth * 0.55,
            },
          ]}>
          <View
            style={{
              alignSelf: 'flex-end',
            }}>
            <FitIcon
              name="close"
              size={20}
              type="MaterialCommunityIcons"
              onPress={() => setOpenEditModal(false)}
            />
          </View>
          <Image
            source={localImage.NameUpdateModal}
            style={{
              width: DeviceWidth / 3,
              marginTop: -DeviceWidth * 0.05,
              marginBottom: 10,
              height: DeviceWidth / 3,
            }}
            resizeMode="contain"
          />
          <FitText
            type="Heading"
            value="OOPS!!!"
            fontWeight="700"
            color="#f0013b"
          />
          <FitText
            type="Heading"
            value={`Looks like some details are missing in your registered profile. Please enter the details below:`}
            textAlign="center"
            fontSize={14}
            fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
            w={DeviceWidth * 0.8}
            lineHeight={18}
            marginVertical={10}
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
                  <View style={{justifyContent: 'flex-start'}}>
                    <FitText type="SubHeading" value="Name" />
                    <TextInput
                      value={values.name}
                      onBlur={handleBlur('name')}
                      onChangeText={handleChange('name')}
                      underlineColor="white"
                      mode="flat"
                      activeUnderlineColor={AppColor.RED}
                      outlineColor={AppColor.WHITE}
                      activeOutlineColor={AppColor.RED}
                      placeholder="Write your Name"
                      placeholderTextColor={AppColor.GRAY2}
                      style={{
                        width: DeviceWidth * 0.8,
                        fontSize: 18,
                        fontWeight: '600',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        color: AppColor.BLACK,
                        backgroundColor: AppColor.WHITE,
                        marginVertical: 5,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'grey',
                      }}
                    />
                    {errors.name && touched.name && (
                      <FitText type="normal" errorType value={values.name} />
                    )}
                  </View>
                )}
                {(dataType == 'both' || dataType == 'email') && (
                  <View style={{justifyContent: 'flex-start', marginTop: 20}}>
                    <FitText type="SubHeading" value="Email" />
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
                        width: DeviceWidth * 0.8,
                        fontSize: 18,
                        fontWeight: '600',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                        color: AppColor.BLACK,
                        backgroundColor: AppColor.WHITE,
                        marginVertical: 5,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'grey',
                      }}
                    />
                    {errors.email && touched.email && (
                      <FitText type="normal" errorType value={values.email} />
                    )}
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    width: DeviceWidth * 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0013b',
                    padding: 10,
                    position: 'absolute',
                    bottom: 20,
                    borderRadius: 5,
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
      </KeyboardAvoidingView>
      <ActivityLoader visible={visible} />
    </Modal>
  );
};
export default NameUpdateModal;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(0,0,0,0.4)`,
  },
  //view
  View1: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 10,
    width: DeviceWidth * 0.9,
    padding: 10,
    alignItems: 'center',
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
