import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {localImage} from '../../Component/Image';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Switch} from 'react-native-switch';
import {useDispatch, useSelector} from 'react-redux';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {
  setIsAlarmEnabled,
  setLogout,
  setSoundOnOff,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import {LogOut} from '../../Component/LogOut';
import axios from 'axios';
import {BlurView} from '@react-native-community/blur';
import Reminder from '../../Component/Reminder';
import ActivityLoader from '../../Component/ActivityLoader';

import analytics from '@react-native-firebase/analytics';

import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import notifee from '@notifee/react-native';
import moment from 'moment';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Profile = () => {
  const {getUserDataDetails, isAlarmEnabled, getSoundOffOn, allWorkoutData} =
    useSelector(state => state);
  const dispatch = useDispatch();
  const [UpdateScreenVisibility, setUpadteScreenVisibilty] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [notificationTimer, setNotificationTimer] = useState('');
  const [PhotoUploaded, setPhotoUploaded] = useState(true);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = React.createRef();
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    notifee.getTriggerNotifications().then(res => {
      if (res.length > 0) {
        setNotificationTimer(res[0].trigger.timestamp);
        dispatch(setIsAlarmEnabled(true));
      } else {
        setNotificationTimer('');
        dispatch(setIsAlarmEnabled(false));
      }
      console.log(res, isAlarmEnabled);
    });
  }, []);

  const toggleSwitch3 = () => {
    if (isAlarmEnabled) {
      dispatch(setIsAlarmEnabled(false));
      setNotificationTimer('');
    } else {
      setVisible(true);
    }
    console.log(isAlarmEnabled);
  };
  const setAlarmIsEnabled = data => {
    dispatch(setIsAlarmEnabled(data));
  };
  const [modalVisible, setModalVisible] = useState(false);
  const DeleteAccount = () => {
    const [forLoading, setForLoading] = useState(false);
    const {getUserDataDetails} = useSelector(state => state);
    const Delete = async () => {
      setForLoading(true);
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
            statusBarHeight: getStatusBarHeight(),
            floating: true,
            type: 'info',
            animationDuration: 750,
            icon: {icon: 'none', position: 'left'},
          });
          LogOut(dispatch);
        }
      } catch (error) {
        console.log('Delete Account Api Error', error);
        setForLoading(false);
        setModalVisible(false);
        showMessage({
          message: 'Something went wrong',
          statusBarHeight: getStatusBarHeight(),
          floating: true,
          type: 'danger',
          animationDuration: 750,
          icon: {icon: 'none', position: 'left'},
        });
        setModalVisible(false);
      }
    };
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        {forLoading ? <ActivityLoader /> : ''}
        <View
          style={[styles.modalContent, {backgroundColor: AppColor.BACKGROUNG}]}>
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
  const Profile_Data = [
    {
      id: 1,
      icon1: (
        <Image
          source={localImage.Profile4}
          style={[styles.IconView, {height: 24, width: 23}]}
          resizeMode="contain"
        />
      ),
      text1: 'Personal Details',
    },
    {
      id: 2,
      icon1: (
        <Image
          source={require('../../Icon/Images/NewImage/subscription.png')}
          style={[styles.IconView, {height: 23, width: 23}]}
          resizeMode="contain"
        />
      ),
      text1: 'Subscription',
    },
    // {
    //   id: 3,
    //   icon1: (
    //     <Image
    //       source={localImage.Heart}
    //       style={[styles.IconView, {height: 17, width: 21}]}
    //       resizeMode="contain"
    //     />
    //   ),
    //   text1: 'My Favorites',
    // },
    // {
    //   id: 4,
    //   icon1: (
    //     <Image
    //       source={localImage.Backupimg}
    //       style={[styles.IconView, {height: 18, width: 22}]}
    //       resizeMode="contain"
    //     />
    //   ),
    //   text1: 'Backup',
    // },
    // {
    //   id: 3,
    //   icon1: (
    //     <Image
    //       source={localImage.Heart}
    //       style={[styles.IconView, {height: 17, width: 21}]}
    //       resizeMode="contain"
    //     />
    //   ),
    //   text1: 'My Favorites',
    // },
    // {
    //   id: 4,
    //   icon1: (
    //     <Image
    //       source={localImage.Backupimg}
    //       style={[styles.IconView, {height: 18, width: 22}]}
    //       resizeMode="contain"
    //     />
    //   ),
    //   text1: 'Backup',
    // },
    {
      id: 5,
      icon1: (
        <Image
          source={localImage.reminder}
          style={[styles.IconView, {height: 27, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Reminder',
    },
    {
      id: 6,
      icon1: (
        <Image
          source={localImage.Soundimg}
          style={[styles.IconView, {height: 15, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Sound Options',
    },
    {
      id: 7,
      icon1: (
        <Image
          source={localImage.Message}
          style={[styles.IconView, {height: 20, width: 22}]}
          resizeMode="contain"
          tintColor={AppColor.RED}
        />
      ),
      text1: 'Contact Us',
    },
    {
      id: 8,
      icon1: (
        <Image
          source={localImage.Shield}
          style={[styles.IconView, {height: 24, width: 22}]}
          resizeMode="cover"
        />
      ),
      text1: 'Privacy Policy',
    },
    {
      id: 10,
      icon1: (
        <Image
          source={localImage.Policy}
          style={[styles.IconView, {height: 22, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Terms Condition',
    },
    {
      id: 9,
      icon1: (
        <Image
          source={localImage.RateStar}
          style={[styles.IconView, {height: 35, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Rate Us',
    },
    {
      id: 10,
      icon1: (
        <Image
          source={localImage.DeleteAcc}
          style={[styles.IconView, {height: 29, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Delete Account',
    },
  ];
  const FirstView = Profile_Data.slice(0, 4);
  const SecondView = Profile_Data.slice(4);

  const UpdateProfileModal = () => {
    const [modalImageUploaded, setModalImageUploaded] = useState(false);
    const [IsimgUploaded, setImguploaded] = useState(true);
    const [userAvatar, setUserAvatar] = useState(null);
    const {getProfile_imgData} = useSelector(state => state);
    const [userPhoto, setUserPhoto] = useState('');
    const getProfileData = async user_id => {
      try {
        const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            id: user_id,
            version: VersionNumber.appVersion,
          },
        });

        if (data?.data?.profile) {
          dispatch(setUserProfileData(data.data.profile));
        } else if (
          data?.data?.msg == 'Please update the app to the latest version.'
        ) {
          showMessage({
            message: data?.data?.msg,
            floating: true,
            duration: 500,
            type: 'danger',
            icon: {icon: 'auto', position: 'left'},
          });
        } else {
          dispatch(setUserProfileData([]));
        }
      } catch (error) {
        console.log('User Profile Error', error);
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

        if (ProfileData.data) {
          showMessage({
            message: ProfileData?.data[0]?.msg,
            type: 'success',
            animationDuration: 500,

            floating: true,
            icon: {icon: 'auto', position: 'left'},
          });
          getProfileData(getUserDataDetails?.id);
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
          setUserAvatar(resultCamera.assets[0]);
          if (resultCamera) {
            setModalImageUploaded(true);
            // dispatch(setProfileImg_Data(resultCamera.assets[0]))
          }
        } catch (error) {
          console.log('CameraimageError', error);
        }
      } else if (Platform.OS == 'ios') {
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
      } else if (Platform.OS == 'ios') {
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
                  <Icons name="close" size={27} color={'#000'} />
                </TouchableOpacity>
              </View>
              <Image
                defaultSource={localImage.avt}
                source={{
                  uri:
                    userAvatar != null
                      ? userAvatar.uri
                      : getUserDataDetails.image_path,
                }}
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
                        setImguploaded(false);
                        UploadImage(userAvatar);
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
                          statusBarHeight: getStatusBarHeight(),
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
  const ProfileView = () => {
    return (
      <View>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={['#D5191A', '#941000']}
          style={{height: DeviceHeigth * 0.3, width: DeviceWidth}}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              top: Platform.OS == 'ios' ? 20 : 0,
              margin: 15,
              // borderWidth: 1,

              marginVertical:
                Platform.OS == 'ios'
                  ? DeviceHeigth * 0.04
                  : DeviceHeigth * 0.02,
              alignItems: 'flex-start',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <View
                style={{
                  width: 78,
                }}>
                <Icons name="chevron-left" size={30} color={AppColor.WHITE} />
              </View>
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                  fontSize: 20,
                  color: AppColor.WHITE,
                }}>
                {'Profile'}
              </Text>
              <View
                style={[styles.profileView, {marginTop: DeviceHeigth * 0.035}]}>
                {isLoading && (
                  <ShimmerPlaceholder
                    style={styles.loader}
                    ref={avatarRef}
                    autoRun
                  />
                )}
                <Image
                  source={
                    getUserDataDetails.image_path == null
                      ? localImage.avt
                      : {uri: getUserDataDetails.image_path}
                  }
                  onLoad={() => setIsLoading(false)}
                  style={styles.img}
                  resizeMode="cover"></Image>
                <TouchableOpacity
                  style={styles.ButtonPen}
                  activeOpacity={0.6}
                  onPress={() => {
                    setUpadteScreenVisibilty(true);
                    analytics().logEvent('CV_FITME_CLICKED_ON_EDIT_PROFILE');
                  }}>
                  <Image
                    source={localImage.Pen}
                    style={styles.pen}
                    resizeMode="cover"
                    tintColor={AppColor.WHITE}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginTop: DeviceHeigth * 0.01,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                    color: AppColor.WHITE,
                    fontSize: 20,
                  }}>
                  {getUserDataDetails.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: AppColor.WHITE,
                    fontSize: 12,
                  }}>
                  {getUserDataDetails.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                analytics().logEvent('CV_FITME_SIGNED_OUT');
                LogOut(dispatch);
                // navigation.navigate('SplaceScreen');
              }}
              activeOpacity={0.5}
              style={{
                // width: DeviceWidth * 0.2,
                width: 78,

                borderWidth: 1,
                borderRadius: 20,
                borderColor: AppColor.WHITE,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: AppColor.WHITE,
                  paddingVertical: 1.3,
                }}>
                {'Sign out'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };
  const profileViewHeight = DeviceHeigth * 0.2;
  const openMailApp = () => {
    Linking.openURL(
      'mailto:aessikarwar03@gmail.com?subject=Feedback&body=Hello%20there!',
    );
  };
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />

      <ProfileView />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.UserDetailsView]}>
          {FirstView.map((value, index) => (
            <TouchableOpacity
              disabled={
                value.id == 4 || value.id == 5 || value.id == 6 ? true : false
              }
              key={index}
              style={styles.SingleButton}
              navigation
              onPress={() => {
                analytics().logEvent(
                  `CV_FITME_CLICKED_ON_${value?.text1?.replace(' ', '_')}`,
                );

              if (value.text1 == 'Personal Details') {
                navigation.navigate('NewPersonalDetails');
              } else if (value.text1 == 'Subscription') {
                navigation.navigate('Subscription');
              } else if (value.text1 == 'Contact Us') {
                openMailApp();
              } else if (value.text1 == 'Privacy Policy') {
                navigation.navigate('TermaAndCondition', {
                  title: 'Privacy & Policy',
                });
              } else {
                showMessage({
                  message: 'Work In Progress',
                  type: 'info',
                  animationDuration: 500,

                    floating: true,
                    icon: {icon: 'auto', position: 'left'},
                  });
                }
              }}>
              {value.icon1}
              <View style={styles.View1}>
                <Text style={styles.nameText}>
                  {value.text1}
                  {value.id == 5 && notificationTimer != '' && (
                    <Text
                      style={{color: AppColor.RED}}
                      onPress={() => setVisible(true)}>
                      {' '}
                      {moment(notificationTimer).format('LT')}
                    </Text>
                  )}
                </Text>
                {value.id == 4 ? (
                  <Switch
                    value={isEnabled}
                    onValueChange={() => toggleSwitch()}
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
                ) : value.id == 6 ? (
                  <View>
                    <Switch
                      value={getSoundOffOn}
                      onValueChange={text => {
                        if (text == true) {
                          showMessage({
                            message: 'Sound Is Unmute',
                            type: 'success',
                            animationDuration: 500,
                            floating: true,
                            icon: {icon: 'auto', position: 'left'},
                          });
                        } else {
                          showMessage({
                            message: 'Sound Is Mute',
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
                  </View>
                ) : value.id == 5 ? (
                  <View>
                    <Switch
                      onValueChange={toggleSwitch3}
                      value={isAlarmEnabled}
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
                  </View>
                ) : (
                  <Icons
                    name="chevron-right"
                    size={22}
                    color={AppColor.DARKGRAY}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.UserDetailsView, {marginBottom: DeviceHeigth*0.05}]}>
          {SecondView.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.SingleButton, {}]}
              navigation
              onPress={() => {
                analytics().logEvent(
                  `CV_FITME_CLICKED_ON_${value?.text1?.replace(' ', '_')}`,
                );
                // navigation.navigate('Personal Details');
                if (value.text1 == 'Privacy Policy') {
                  navigation.navigate('TermaAndCondition', {
                    title: 'Privacy & Policy',
                  });
                } else if (value.text1 == 'Terms Condition') {
                  navigation.navigate('TermaAndCondition', {
                    title: 'Terms & Condition',
                  });
                } else if (value.text1 == 'Rate Us') {
                  if (Platform.OS == 'ios') {
                    Linking.openURL(
                      'https://apps.apple.com/us/app/fitme-health-and-fitness-app/id6470018217',
                    );
                  } else {
                    Linking.openURL(
                      'https://play.google.com/store/apps/details?id=fitme.health.fitness.homeworkouts.equipment&hl=en-IN&pli=1',
                    );
                  }
                } else if (value.text1 == 'Delete Account') {
                  setModalVisible(true);
                }
              }}>
              {value.icon1}
              <View style={styles.View1}>
                <Text style={styles.nameText}>{value.text1}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {modalVisible ? <DeleteAccount /> : null}
      </ScrollView>
      <Reminder
        visible={visible}
        setVisible={setVisible}
        setAlarmIsEnabled={setAlarmIsEnabled}
        setNotificationTimer={setNotificationTimer}
      />
      {UpdateScreenVisibility ? <UpdateProfileModal /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.BACKGROUNG,
  },
  ProfileImg: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  DetailView: {
    marginVertical: DeviceHeigth * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: DeviceWidth * 0.02,
  },
  Button: {
    width: DeviceWidth * 0.21,
    height: DeviceHeigth * 0.033,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextView: {
    marginLeft: -20,
  },
  buttonStyle: {
    width: DeviceWidth * 0.21,
    height: DeviceHeigth * 0.03,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  EditText: {
    color: AppColor.WHITE,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
  },
  NameText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.INPUTTEXTCOLOR,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  nameText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: AppColor.BLACK,
  },
  IconView: {
    // width: 22,
    // height: 22,
  },
  UserDetailsView: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 12,
    marginHorizontal: DeviceWidth * 0.04,
    marginTop: DeviceHeigth * 0.025,
    paddingVertical: DeviceHeigth * 0.02,
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.DARKGRAY,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
        shadowColor: AppColor.DARKGRAY,
      },
    }),
  },
  userDetailsText: {
    // fontFamily: '',
  },
  SingleButton: {
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  View1: {
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 8,
  },
  profileView: {
    height: 100,
    width: 100,

    borderRadius: 120 / 2,
    // alignSelf: 'center',
  },
  img: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    borderWidth: 1,
    alignSelf: 'center',
  },
  pen: {
    width: 25,
    height: 25,
  },
  ButtonPen: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    position: 'absolute',
    bottom: -2,
    right: -1,
    backgroundColor: AppColor.RED,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  modalContent: {
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
    // height: DeviceHeigth / 2.5,
    // width: '95%',
    // backgroundColor: 'white',
    // position: 'absolute',
    // borderRadius: 20,
    // alignItems: 'center',
    // borderWidth: 1,
    // bottom: 0,
    // borderColor: 'lightgray',

    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000000',
    //     shadowOffset: {width: 2, height: 2},
    //     shadowOpacity: 0.3,
    //     shadowRadius: 4,
    //   },
    //   android: {
    //     elevation: 20,
    //     shadowColor: '#000000',
    //     shadowOffset: {width: 2, height: 2},
    //     shadowOpacity: 0.7,
    //     shadowRadius: 10,
    //   },
    // }),
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  modalContent: {
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
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
  },
});

export default Profile;
