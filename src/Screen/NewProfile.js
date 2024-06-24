import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../Component/Headers/NewHeader';
import {AppColor, Fonts} from '../Component/Color';
import {useDispatch, useSelector} from 'react-redux';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../Component/Config';
import {Switch} from 'react-native-switch';
import {localImage} from '../Component/Image';
import Reminder from '../Component/Reminder';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import VersionNumber from 'react-native-version-number';
import ActivityLoader from '../Component/ActivityLoader';
import analytics from '@react-native-firebase/analytics';
import notifee from '@notifee/react-native';
import moment from 'moment';
import axios from 'axios';
import {BlurView} from '@react-native-community/blur';
import KeepAwake from 'react-native-keep-awake';

import {
  setIsAlarmEnabled,
  setProfileImg_Data,
  setScreenAwake,
  setSoundOnOff,
  setUserProfileData,
} from '../Component/ThemeRedux/Actions';
import {LogOut} from '../Component/LogOut';
import {AnalyticsConsole} from '../Component/AnalyticsConsole';
const NewProfile = ({navigation}) => {
  useEffect(() => {
    notifee.getTriggerNotifications().then(res => {
      if (res.length > 0) {
        setNotificationTimer(res[0].trigger.timestamp);
        dispatch(setIsAlarmEnabled(true));
      } else {
        setNotificationTimer('');
        dispatch(setIsAlarmEnabled(false));
      }
    });
  }, []);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = React.createRef();
  const [isEnabled, setIsEnabled] = useState(false);
  const [PhotoUploaded, setPhotoUploaded] = useState(true);
  const {getUserDataDetails, isAlarmEnabled, getSoundOffOn, getScreenAwake} =
    useSelector(state => state);
  const dispatch = useDispatch();
  const [UpdateScreenVisibility, setUpadteScreenVisibilty] = useState(false);
  const [visible, setVisible] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [notificationTimer, setNotificationTimer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const setAlarmIsEnabled = data => {
    dispatch(setIsAlarmEnabled(data));
  };
  useEffect(() => {
    if (getScreenAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }, [getScreenAwake]);

  const CardData = [
    {
      id: 1,
      txt: 'Daily Reminder',
      img: localImage.Bell,
      txt1:
        moment(notificationTimer).format('LT') == 'Invalid date'
          ? '1:00 AM'
          : moment(notificationTimer).format('LT'),
    },
    {
      id: 2,
      txt: 'Subscription',
      img: localImage.Planning,
    },
    {
      id: 3,
      txt: 'My Details',
      img: localImage.NewPrfile,
    },
  ];
  const CardData1 = [
    {
      id: 1,
      txt: 'Reminder',
      img: localImage.Bell,
      txt1:
        moment(notificationTimer).format('LT') == 'Invalid date'
          ? '1:00 AM'
          : moment(notificationTimer).format('LT'),
    },
    {
      id: 2,
      txt: 'My Details',
      img: localImage.NewPrfile,
    },
  ];
  const handleCardDataPress = id => {
    if (id == 1) {
      AnalyticsConsole(`REMINDER_BUTTON`);
      setVisible(true);
    } else if (id == 2) {
      AnalyticsConsole(`SUBSCRIPTION_BUTTON`);
      navigation.navigate('NewSubscription', {upgrade: false});
    } else if (id == 3) {
      AnalyticsConsole(`PERSO_DETAILS_BUTTON`);
      navigation.navigate('NewPersonalDetails');
    }
  };
  const handleCardDataPress1 = id => {
    if (id == 1) {
      AnalyticsConsole(`REMINDER_BUTTON`);
      setVisible(true);
    } else if (id == 2) {
      AnalyticsConsole(`PERSO_DETAILS_BUTTON`);
      navigation.navigate('NewPersonalDetails');
    }
  };
  const openMailApp = () => {
    Linking.openURL(
      'mailto:aessikarwar03@gmail.com?subject=Feedback&body=Hello%20there!',
    );
  };
  const HandleButtons = (id, value) => {
    if (id == 3) {
      analytics().logEvent(
        `CV_FITME_CLICKED_ON_${value?.text1?.replace(' ', '_')}`,
      );
      openMailApp();
    } else if (id == 4) {
      AnalyticsConsole(`PRIVACY_BUTTON`);
      navigation.navigate('TermaAndCondition', {
        title: 'Privacy & Policy',
      });
    } else if (id == 5) {
      AnalyticsConsole(`T_n_CBUTTON`);
      navigation.navigate('TermaAndCondition', {
        title: 'Terms & Condition',
      });
    } else if (id == 6) {
      AnalyticsConsole(`APP_RATING_BUTTON`);
      if (Platform.OS == 'ios') {
        Linking.openURL(
          'https://apps.apple.com/us/app/fitme-health-and-fitness-app/id6470018217',
        );
      } else {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=fitme.health.fitness.homeworkouts.equipment&hl=en-IN&pli=1',
        );
      }
    } else if (id == 7) {
      setModalVisible(true);
    } else if (id == 8) {
      AnalyticsConsole(`LOGOUT_BUTTON`);
      LogOut(dispatch);
    }
  };
  const ListData = [
    {
      id: 1,
      txt: 'Voice Assistant',
      img: localImage.NSounds,
    },
    {
      id: 2,
      txt: 'Display Always On',
      img: localImage.DisplayOn,
    },
    // {
    //   id: 2,
    //   txt: 'Health Notification',
    //   img: localImage.NPedometer,
    // },
    {
      id: 3,
      txt: 'Contact Us',
      img: localImage.NContact,
    },
    {
      id: 4,
      txt: 'Privacy Policy',
      img: localImage.NPrivacy,
    },
    {
      id: 5,
      txt: 'Terms & Conditions',
      img: localImage.NPolicy,
    },
    {
      id: 6,
      txt: 'Rate Us',
      img: localImage.NRate,
    },
    {
      id: 7,
      txt: 'Delete Account',
      img: localImage.NDelete,
    },
    {
      id: 8,
      txt: 'Log Out',
      img: localImage.NLogOut,
    },
  ];
  const ListData1 = [
    {
      id: 1,
      txt: 'Mute Voice Assistant',
      img: localImage.NSounds,
    },
    {
      id: 2,
      txt: 'Health Notification',
      img: localImage.NPedometer,
    },
    {
      id: 3,
      txt: 'Contact Us',
      img: localImage.NContact,
    },
    {
      id: 4,
      txt: 'Privacy Policy',
      img: localImage.NPrivacy,
    },
    {
      id: 5,
      txt: 'Terms & Conditions',
      img: localImage.NPolicy,
    },
    {
      id: 6,
      txt: 'Rate Us',
      img: localImage.NRate,
    },
  ];
  const UpdateProfileModal = () => {
    const [modalImageUploaded, setModalImageUploaded] = useState(false);
    const [IsimgUploaded, setImguploaded] = useState(true);
    const [userAvatar, setUserAvatar] = useState(null);
    const {getProfile_imgData} = useSelector(state => state);
    const [userPhoto, setUserPhoto] = useState('');
    // const getProfileData = async user_id => {
    //   try {
    //     const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //       data: {
    //         id: user_id,
    //         version: VersionNumber.appVersion,
    //       },
    //     });

    //     if (data?.data?.profile) {
    //       dispatch(setUserProfileData(data.data.profile));
    //     } else if (
    //       data?.data?.msg == 'Please update the app to the latest version.'
    //     ) {
    //       showMessage({
    //         message: data?.data?.msg,
    //         floating: true,
    //         duration: 500,
    //         type: 'danger',
    //         icon: {icon: 'auto', position: 'left'},
    //       });
    //     } else {
    //       dispatch(setUserProfileData([]));
    //     }
    //   } catch (error) {
    //     console.log('User Profile Error', error);
    //   }
    // };
    const getUserDetailDataApi = async userId => {
      console.log('Hello Api called--->');
      try {
        const responseData = await axios.get(
          `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${userId}`,
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
        } else {
          dispatch(setUserProfileData(responseData?.data?.profile));
          console.log('userdata', responseData?.data?.profile);
        }
      } catch (error) {
        console.log('GET-USER-DATA', error);

        dispatch(setUserProfileData([]));
      }
    };

    const UploadImage = async selectedImage => {
      try {
        let payload = new FormData();
        payload.append('token', getUserDataDetails?.login_token);
        payload.append('version', VersionNumber.appVersion);
        payload.append('user_id', getUserDataDetails?.id);
        payload.append('image', {
          name: selectedImage?.fileName,
          type: selectedImage?.type,
          uri: selectedImage?.uri,
        });

        const ProfileData = await axios({
          url: NewAppapi.Upload_Profile_picture,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        });
        if (ProfileData?.data) {
          showMessage({
            message: 'Profile photo update successfully',
            type: 'success',
            animationDuration: 500,

            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          // getProfileData(getUserDataDetails?.id);
          // getUserDetailDataApi(getUserDataDetails?.id)
          console.log('----data', getUserDataDetails.image_path);
          setImguploaded(true);
          if (IsimgUploaded == true) {
            setUpadteScreenVisibilty(false);
            setPhotoUploaded(false);
          }
        }
      } catch (error) {
        setImguploaded(true);
        if (IsimgUploaded == true) {
          setPhotoUploaded(false); // for Loader on profile picture
          setUpadteScreenVisibilty(false);
        }
        console.log('UpdateProfileError', error);
      }
    };
    const askPermissionForCamera = async permission => {
      const result = await request(permission);

      if (result == 'granted') {
        try {
          const resultCamera = await launchCamera({
            mediaType: 'photo',
            quality: 1,
            maxWidth: 500,
            maxHeight: 400,
          });

          if (resultCamera) {
            setUserAvatar(resultCamera.assets[0]);
            setModalImageUploaded(true);
            // dispatch(setProfileImg_Data(resultCamera.assets[0]))
            // getUserDetailDataApi(getUserDataDetails?.id)
            console.log('image--->', resultCamera.assets[0]);
          }
        } catch (error) {
          console.log('CameraimageError', error);
        }
      } else if (result == 'blocked') {
        Alert.alert(
          'Permission Required',
          'To use the camera feature ,Please enable camera access in settings',
          [
            {
              text: 'cancel',
              style: 'cancel',
            },
            {
              text: 'Open settings',
              onPress: openSettings,
            },
          ],
          {cancelable: false},
        );
      } else {
        console.log('error occured');
      }
    };
    const askPermissionForLibrary = async permission => {
      const resultLib = await request(permission);

      if (resultLib == 'granted') {
        try {
          const resultLibrary = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5,
            maxWidth: 300,
            maxHeight: 200,
          });
          setUserAvatar(resultLibrary.assets[0]);

          if (resultLibrary) {
            setModalImageUploaded(true);
          }
        } catch (error) {
          console.log('LibimageError', error);
        }
      } else if (resultLib == 'blocked') {
        Alert.alert(
          'Permission Required',
          'To use the photo library ,Please enable library access in settings',
          [
            {
              text: 'cancel',
              style: 'cancel',
            },
            {
              text: 'Open settings',
              onPress: openSettings,
            },
          ],
          {cancelable: false},
        );
      } else {
        console.log('Galaey error occured');
      }
    };
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          position: 'absolute',
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => {
            setUpadteScreenVisibilty(false);
          }}>
          <View
            style={[
              styles.modalContainer,
              {backgroundColor: 'transparent', flex: 1},
            ]}>
            <View
              style={{
                height: DeviceHeigth * 0.4,
                width: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'lightgray',
                bottom: 0,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }}>
              <View
                style={[
                  styles.closeButton,
                  ,
                  {
                    width: (DeviceWidth * 85) / 100,
                    marginTop: 8,
                    backgroundColor: 'fff',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setUpadteScreenVisibilty(false);
                  }}>
                  <Icon name="close" size={27} color={'#000'} />
                </TouchableOpacity>
              </View>
              <Image
                defaultSource={localImage.avt}
                source={
                  userAvatar != null
                    ? {uri: userAvatar.uri}
                    : getUserDataDetails.image_path
                    ? {uri: getUserDataDetails.image_path}
                    : localImage.avt
                }
                style={styles.Icon}
              />
              <View
                style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: (DeviceWidth * 80) / 100,
                  height: (DeviceHeigth * 10) / 100,
                  marginBottom: 2,
                  // borderWidth:1
                }}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    AnalyticsConsole(`OPEN_CAMERA`);
                    if (Platform.OS == 'ios') {
                      askPermissionForCamera(PERMISSIONS.IOS.CAMERA);
                    } else {
                      askPermissionForCamera(PERMISSIONS.ANDROID.CAMERA);
                    }
                  }}>
                  <Icon name="camera" size={30} color="#000" />
                  <Text style={{color: '#000'}}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    AnalyticsConsole(`OPEN_GALLERY`);
                    if (Platform.OS == 'ios') {
                      askPermissionForLibrary(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    } else {
                      askPermissionForLibrary(
                        Platform.Version >= 33
                          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                          : PermissionsAndroid.PERMISSIONS
                              .READ_EXTERNAL_STORAGE,
                      );
                    }
                  }}>
                  <Icon name="camera-image" size={30} color={'#000'} />
                  <Text style={{color: '#000'}}>Gallery</Text>
                </TouchableOpacity>
              </View>
              {IsimgUploaded ? (
                <>
                  {modalImageUploaded ? (
                    <TouchableOpacity
                      style={{
                        width: DeviceWidth * 0.4,
                        height: (DeviceHeigth * 4) / 100,
                        backgroundColor: AppColor.RED,
                        justifyContent: 'center',
                        borderRadius: 20,
                        alignItems: 'center',
                        margin: 5,
                      }}
                      onPress={() => {
                        AnalyticsConsole(`UPLOAD_IMAGE`);
                        setImguploaded(false);
                        UploadImage(userAvatar)
                          .then(() => {
                            getUserDetailDataApi(getUserDataDetails?.id);
                          })
                          .catch(err => {
                            console.log('some error', err);
                          });
                      }}>
                      <Text style={[styles.cameraText]}>Upload Image</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        width: DeviceWidth * 0.4,
                        height: (DeviceHeigth * 3) / 100,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        justifyContent: 'center',
                        borderRadius: 20,
                        alignItems: 'center',
                        margin: 5,
                      }}
                      onPress={() => {
                        showMessage({
                          message: 'Please insert an Image first',
                          floating: true,
                          type: 'danger',
                          animationDuration: 750,
                          icon: {icon: 'none', position: 'left'},
                        });
                      }}>
                      <Text style={[styles.cameraText]}>Upload Image</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <ActivityIndicator color={AppColor.RED} size={35} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  const DeleteAccount = () => {
    const [forLoading, setForLoading] = useState(false);
    const {getUserDataDetails} = useSelector(state => state);
    const Delete = async () => {
      setForLoading(true);
      AnalyticsConsole(`DEL_BUTTON_API`);
      try {
        const res = await axios({
          url: `${NewAppapi.Delete_Account}/${getUserDataDetails?.id}`,
          method: 'get',
        });
        if (res.data) {
          setForLoading(false);
          setModalVisible(false);
          showMessage({
            message: 'Your account deleted successfully',
            // statusBarHeight: getStatusBarHeight(),
            floating: true,
            type: 'info',
            animationDuration: 750,
            icon: {icon: 'none', position: 'left'},
          });
          // AnalyticsConsole(`DEL_BUTTON_API_COMPLETE`);
          LogOut(dispatch);
        }
      } catch (error) {
        console.log('Delete Account Api Error', error);
        setForLoading(false);
        setModalVisible(false);
        showMessage({
          message: 'Something went wrong',
          // statusBarHeight: getStatusBarHeight(),
          floating: true,
          type: 'danger',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });
        setModalVisible(false);
      }
    };
    console.log('------>', getUserDataDetails?.image_path);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <BlurView
          style={styles.modalContainer1}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        {forLoading ? <ActivityLoader /> : ''}
        <View
          style={[
            styles.modalContent1,
            {backgroundColor: AppColor.BACKGROUNG},
          ]}>
          <View
            style={{
              width: DeviceWidth * 0.85,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontWeight: '700',
                fontSize: 17,
                color: AppColor.BoldText,
              }}>
              Do you want to Delete your Account ?
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              width: DeviceWidth * 0.85,
              alignItems: 'center',
              marginTop: 30,
            }}>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  color: AppColor.BoldText,
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: AppColor.RED,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 5,
                paddingRight: 5,
              }}
              onPress={() => {
                Delete();
              }}>
              <Text
                style={{
                  padding: 5,
                  textAlign: 'center',
                  color: AppColor.WHITE,
                  fontSize: 12,
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.Container}>
      <NewHeader header={'Profile'} />
      <View style={styles.ProfileContainer}>
        <View style={[styles.profileView, {}]}>
          <Image
            source={
              getUserDataDetails.image_path == null
                ? localImage.avt
                : {uri: getUserDataDetails.image_path}
            }
            style={styles.img}
            onLoad={() => setIsLoading(false)}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.pen}
            onPress={() => setUpadteScreenVisibilty(true)}
            activeOpacity={0.5}>
            <Image
              source={localImage.NewPen}
              style={{height: 17, width: 15}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={{marginLeft: 15}}>
          <Text
            style={{
              fontFamily: Fonts.MONTSERRAT_BOLD,
              color: AppColor.BLACK,
              fontSize: 20,
            }}>
            {getUserDataDetails?.name == null
              ? 'Guest'
              : getUserDataDetails?.name}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.MONTSERRAT_REGULAR,
              color: AppColor.BLACK,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {getUserDataDetails?.email == null
              ? 'guest@gmail.com'
              : getUserDataDetails?.email}
          </Text>
        </View>
      </View>
      <View style={styles.card}>
        {getUserDataDetails.email != null
          ? CardData?.map((v, i) => {
              if (
                getOfferAgreement?.location != 'India' &&
                v.txt == 'Subscription'
              )
                return;
              return (
                <TouchableOpacity
                  key={i}
                  style={{justifyContent: 'center', alignItems: 'center'}}
                  onPress={() => handleCardDataPress(v.id)}>
                  <Image
                    source={v.img}
                    style={{height: 35, width: 35}}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      fontWeight: '600',
                      marginTop: 10,
                      color: AppColor.BLACK,
                    }}>
                    {v.txt}
                  </Text>
                  {v.txt1 == 'Invalid date' ? null : (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: Fonts.MONTSERRAT_REGULAR,
                        fontWeight: '500',
                        marginTop: 6,
                        color: AppColor.RED1,
                      }}>
                      {v.txt1}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })
          : CardData1?.map((v, i) => (
              <TouchableOpacity
                key={i}
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => handleCardDataPress1(v.id)}>
                <Image
                  source={v.img}
                  style={{height: 35, width: 35}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontWeight: '600',
                    marginTop: 10,
                    color: AppColor.BLACK,
                  }}>
                  {v.txt}
                </Text>
                {v.txt1 == 'Invalid date' ? null : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.MONTSERRAT_REGULAR,
                      fontWeight: '500',
                      marginTop: 6,
                      color: AppColor.RED1,
                    }}>
                    {v.txt1}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: DeviceHeigth * 0.025}}>
        <View style={{width: DeviceWidth * 0.95, alignSelf: 'center'}}>
          {ListData.slice(0, 2).map((v, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={v.img}
                  style={{height: 35, width: 35}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    fontSize: 16,
                    marginLeft: 10,
                    color: AppColor.BLACK,
                  }}>
                  {v.txt}
                </Text>
              </View>
              <View style={{alignSelf: 'center'}}>
                {v.id == 1 ? (
                  <Switch
                    value={getSoundOffOn}
                    onValueChange={text => {
                      AnalyticsConsole(`SOUND_ON_OFF`);
                     
                      if (text == true) {
                        showMessage({
                          message: 'Sound unmuted',
                          type: 'success',
                          animationDuration: 500,
                          floating: true,
                          icon: {icon: 'auto', position: 'left'},
                        });
                      } else {
                        showMessage({
                          message: 'Sound muted',
                          animationDuration: 500,
                          type: 'danger',
                          floating: true,
                          icon: {icon: 'auto', position: 'left'},
                        });
                      }

                      dispatch(setSoundOnOff(text));
                    }}
                    disabled={false}
                    circleSize={19}
                    barHeight={21}
                    circleBorderWidth={0.1}
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2}
                    switchRightPx={2}
                    switchWidthMultiplier={2.2}
                    switchBorderRadius={30}
                    backgroundActive={'#FFE3E3'}
                    backgroundInactive={AppColor.GRAY2}
                    circleActiveColor={AppColor.RED}
                    circleInActiveColor={AppColor.WHITE}
                    changeValueImmediately={true}
                    outerCircleStyle={{color: AppColor.RED}}
                  />
                ) : (
                  <Switch
                    value={getScreenAwake}
                    onValueChange={text => {
                      AnalyticsConsole(`DISPLAY_ALWAYS_ON`);
                      if (text == true) {
                        showMessage({
                          message: 'Display Always on',
                          type: 'success',
                          animationDuration: 500,
                          floating: true,
                          icon: {icon: 'auto', position: 'left'},
                        });
                        dispatch(setScreenAwake(true));
                      } else {
                        showMessage({
                          message: 'Display Always Off',
                          animationDuration: 500,
                          type: 'danger',
                          floating: true,
                          icon: {icon: 'auto', position: 'left'},
                        });
                        dispatch(setScreenAwake(false));
                      }
                    }}
                    disabled={false}
                    circleSize={19}
                    barHeight={21}
                    circleBorderWidth={0.1}
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2}
                    switchRightPx={2}
                    switchWidthMultiplier={2.2}
                    switchBorderRadius={30}
                    backgroundActive={'#FFE3E3'}
                    backgroundInactive={AppColor.GRAY2}
                    circleActiveColor={AppColor.RED}
                    circleInActiveColor={AppColor.WHITE}
                    changeValueImmediately={true}
                    outerCircleStyle={{color: AppColor.RED}}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
        <View style={{width: DeviceWidth * 0.95, alignSelf: 'center'}}>
          <Text
            style={{
              fontFamily: Fonts.MONTSERRAT_BOLD,
              fontSize: 18,
              marginVertical: 10,
              color: AppColor.BLACK,
            }}>
            Others
          </Text>
        </View>
        <View style={{width: DeviceWidth * 0.95, alignSelf: 'center'}}>
          {getUserDataDetails.email != null
            ? ListData.slice(2).map((v, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}
                  onPress={() => HandleButtons(v.id, v.txt)}>
                  <Image
                    source={v.img}
                    style={{height: 35, width: 35}}
                    resizeMode="contain"
                  />
                  <Text style={styles.ListText}>{v.txt}</Text>
                </TouchableOpacity>
              ))
            : ListData1.slice(2).map((v, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}
                  onPress={() => HandleButtons(v.id, v.txt)}>
                  <Image
                    source={v.img}
                    style={{height: 35, width: 35}}
                    resizeMode="contain"
                  />
                  <Text style={styles.ListText}>{v.txt}</Text>
                </TouchableOpacity>
              ))}
        </View>
        <Reminder
          visible={visible}
          setVisible={setVisible}
          setAlarmIsEnabled={setAlarmIsEnabled}
          setNotificationTimer={setNotificationTimer}
        />
      </ScrollView>
      {UpdateScreenVisibility ? <UpdateProfileModal /> : null}
      <DeleteAccount />
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  ProfileView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
  },
  img: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
  },
  profileView: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000000',
    //     shadowOffset: {width: 0, height: 5},
    //     shadowOpacity: 0.3,
    //     shadowRadius: 10,
    //   },
    //   android: {
    //     elevation: 5,
    //   },
    // }),
  },
  ProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
  },
  pen: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 74,
    right: 12,
    borderWidth: 1,
    borderColor: AppColor.GRAY,
  },
  card: {
    backgroundColor: '#DFF4FF',
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    borderRadius: 14,
    marginVertical: DeviceHeigth * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  ListText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 16,
    marginLeft: 10,
    color: AppColor.BLACK,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  Icon: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cameraButton: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  modalContent1: {
    padding: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.95,
    position: 'absolute',
    top: DeviceHeigth / 2.5,
    marginHorizontal: 10,
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
export default NewProfile;
