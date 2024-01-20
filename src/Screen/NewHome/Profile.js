import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {localImage} from '../../Component/Image';
import {
  DeviceHeigth,
  DeviceWidth,
  NewApi,
  NewAppapi,
} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Switch} from 'react-native-switch';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLogout, setUserProfileData} from '../../Component/ThemeRedux/Actions';
import {CommonActions} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import VersionNumber from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import { updatePhoto } from '../../Component/ThemeRedux/Actions';
import {LogOut} from '../../Component/LogOut';
import { setProfileImg_Data } from '../../Component/ThemeRedux/Actions';
import axios from 'axios';
import { stack } from 'd3';
import { ColorShader } from '@shopify/react-native-skia';
const Profile = () => {
 
  const {getUserDataDetails, ProfilePhoto,} = useSelector(state => state);
  const dispatch = useDispatch();
  const [UpdateScreenVisibility, setUpadteScreenVisibilty] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [PhotoUploaded, setPhotoUploaded] = useState(true);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
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
    // {
    //   id: 2,
    //   icon1: (
    //     <Image
    //       source={localImage.Documents}
    //       style={[styles.IconView, {height: 23, width: 23}]}
    //       resizeMode="contain"
    //     />
    //   ),
    //   text1: 'My plans',
    // },
    {
      id: 3,
      icon1: (
        <Image
          source={localImage.Heart}
          style={[styles.IconView, {height: 17, width: 21}]}
          resizeMode="contain"
        />
      ),
      text1: 'My Favorites',
    },
    {
      id: 4,
      icon1: (
        <Image
          source={localImage.Backupimg}
          style={[styles.IconView, {height: 18, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Backup',
    },
    {
      id: 5,
      icon1: (
        <Image
          source={localImage.reminder}
          style={[styles.IconView, {height: 27, width: 22}]}
          resizeMode="contain"
        />
      ),
      text1: 'Workout Reminder',
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
  const FirstView = Profile_Data.slice(0, 6);
  const SecondView = Profile_Data.slice(6);

  const UpdateProfileModal = () => {
    const [modalImageUploaded, setModalImageUploaded] = useState(false);
    const [IsimgUploaded, setImguploaded] = useState(true);
    const [userAvatar, setUserAvatar] = useState(null);
    const {getProfile_imgData}=useSelector(state=>state)
    const [userPhoto,setUserPhoto]=useState('')  
    const getProfileData = async user_id => {
      try {
        const data = await axios(`${NewApi}${NewAppapi.UserProfile}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            id: user_id,
          },
        });
  
        if (data.data.profile) {
          dispatch(setUserProfileData(data.data.profile));
          console.log("Profile Data====---->",data.data)

        } else {
          dispatch(setUserProfileData([]));
        }
      } catch (error) {
        console.log('User Profile Error', error);
      }
    };
    const UploadImage = async (selectedImage) => {
      // console.log("upload img")
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
        // console.log('payload=====>',payload)
        const ProfileData = await axios({
          url: NewAppapi.Upload_Profile_picture,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        });
        // console.log(ProfileData.data[0]);
        if (ProfileData.data) {
          console.log('APi Profile Data===>', ProfileData.data);
          getProfileData(getUserDataDetails?.id)
          setImguploaded(true);
          if (IsimgUploaded == true) {
            setUpadteScreenVisibilty(false);
            setPhotoUploaded(false);
          }
        }
        // console.log('ProfileData', ProfileData.data);
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
      //  console.log("camera result",result)
      if (result == 'granted') {
        try {
          const resultCamera = await launchCamera({
            mediaType: 'photo',
            quality: 0.5,
          });
          setUserAvatar(resultCamera.assets[0])
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
      //Library permission
      const resultLib = await request(permission);
      // console.log("result",resultLib)
      if (resultLib == 'granted') {
        try {
          const resultLibrary = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5,
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
        console.log('error occured');
      }
      // });
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
            <View style={[styles.modalContent, {backgroundColor: '#fff'}]}>
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
                source={{
                  uri:
                 
                  userAvatar != null
                    ? userAvatar.uri
                    :  getUserDataDetails.image_path
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
                        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
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
                        UploadImage(userAvatar)
                        console.log(userAvatar)
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
          style={{height: DeviceHeigth * 0.4, width: DeviceWidth}}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              margin: 15,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                width: DeviceWidth * 0.23,
                paddingVertical: 1,
              }}>
              <Icons name="chevron-left" size={30} color={AppColor.WHITE} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
                color: AppColor.WHITE,
              }}>
              {'Profile'}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  LogOut(dispatch);
                  // navigation.navigate('SplaceScreen');
                }}
                activeOpacity={0.5}
                style={{
                  width: DeviceWidth * 0.2,
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
          </View>
          <View style={styles.profileView}>
            <Image
             source={
              getUserDataDetails.image_path == null
                ? localImage.avt
                :{uri:getUserDataDetails.image_path} 
            }
              style={styles.img}
              resizeMode="cover"></Image>
            <TouchableOpacity
              style={styles.ButtonPen}
              activeOpacity={0.6}
              onPress={() => setUpadteScreenVisibilty(true)}>
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
              marginTop: DeviceHeigth * 0.05,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: AppColor.WHITE,
                fontSize: 20,
                paddingLeft: 15,
              }}>
              {getUserDataDetails.name}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: AppColor.WHITE,
                fontSize: 12,
                paddingLeft: 15,
              }}>
              {getUserDataDetails.email}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };
  const profileViewHeight = DeviceHeigth * 0.4;

  return (
    <SafeAreaView style={styles.Container}>
      <ProfileView />
      <View
        style={[
          styles.UserDetailsView,
          {
            top: -profileViewHeight * 0.1,
          },
        ]}>
        {FirstView.map((value, index) => (
          <TouchableOpacity
            activeOpacity={value.id == 4 || value.id == 5 ? 1 : 0.5}
            key={index}
            style={styles.SingleButton}
            navigation
            onPress={() => {
              if (value.text1 == 'Personal Details') {
                navigation.navigate('NewPersonalDetails');
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
              <Text style={styles.nameText}>{value.text1}</Text>
              {value.id == 4 || value.id == 5 ? (
                <Switch
                  value={isEnabled}
                  onValueChange={() => toggleSwitch()}
                  disabled={false}
                  circleSize={19}
                  barHeight={21}
                  circleBorderWidth={0.1}
                  backgroundActive={AppColor.RED1}
                  backgroundInactive={AppColor.GRAY2}
                  circleActiveColor={AppColor.RED}
                  circleInActiveColor={AppColor.WHITE}
                  changeValueImmediately={true}
                  outerCircleStyle={{color: AppColor.RED}}
                  renderActiveText={false}
                  renderInActiveText={false}
                  switchLeftPx={2}
                  switchRightPx={2}
                  switchWidthMultiplier={2.2}
                  switchBorderRadius={30}
                />
              ) : value.id == 6 ? (
                <View style={{width: 20, height: 20}}></View>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.UserDetailsView, {marginBottom: 10}]}>
          {SecondView.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.SingleButton, {}]}
              navigation
              onPress={() => {
                // navigation.navigate('Personal Details');
              }}>
              {value.icon1}
              <View style={styles.View1}>
                <Text style={styles.nameText}>{value.text1}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {UpdateScreenVisibility ? <UpdateProfileModal /> : null}
    </SafeAreaView>
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
    fontFamily: 'Poppins-SemiBold',
    color: AppColor.INPUTTEXTCOLOR,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  nameText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: AppColor.ProfileTextColor,
  },
  IconView: {
    // width: 22,
    // height: 22,
  },
  UserDetailsView: {
    backgroundColor: AppColor.WHITE,
    borderRadius: 12,
    marginHorizontal: DeviceWidth * 0.04,
    marginBottom: -DeviceHeigth * 0.01,
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
    borderRadius: 160 / 2,
    alignSelf: 'center',
  },
  img: {
    height: 120,
    width: 120,
    borderRadius: 160 / 2,
  },
  pen: {
    width: 35,
    height: 35,
  },
  ButtonPen: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    position: 'absolute',
    bottom: -22,
    right: -8,
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
    height: DeviceHeigth / 2.5,
    width: '95%',
    backgroundColor: 'white',

    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 20,
        shadowColor: '#000000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
    }),
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
});
export default Profile;
