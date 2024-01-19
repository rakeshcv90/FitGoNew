import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ToastAndroid,
  StatusBar,
  Alert,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch';
import {localImage} from '../Component/Image';
import {DeviceHeigth, DeviceWidth, Api, Appapi} from '../Component/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import CustomStatusBar from '../Component/CustomStatusBar';
import axios from 'axios';
import Icons from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Loader from '../Component/Loader';
import {updatePhoto, resetStore} from '../Component/ThemeRedux/Actions';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
const ProfileScreen = () => {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState();
  const navigation = useNavigation();
  const {defaultTheme} = useSelector(state => state);
  const [UpdateScreenVisibility, setUpadteScreenVisibilty] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [PhotoUploaded, setPhotoUploaded] = useState(true);
  const {ProfilePhoto} = useSelector(state => state);
  const [data, setData] = useState([
    {
      id: 1,
      icon: (
        <Image
          source={localImage.dw1}
          style={{width: 25, height: 20}}
          tintColor={defaultTheme ? '#fff' : '#535763'}
          resizeMode="contain"
        />
      ),
      itemData: 'My Workouts',
    },
    {
      id: 2,
      icon: (
        <Image
          source={localImage.dw3}
          style={{width: 25, height: 20}}
          tintColor={defaultTheme ? '#fff' : '#535763'}
          resizeMode="contain"
        />
      ),
      itemData: 'My Diets',
    },
    {
      id: 3,
      icon: (
        <Icon
          name="heart-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Favorites',
    },
    {
      id: 4,
      icon: (
        <Icon
          name="bookmark-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'About Us',
    },
    {
      id: 5,
      icon: (
        <Icon
          name="file-document-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Privacy & Terms',
    },
    {
      id: 6,
      icon: (
        <Icon
          name="logout"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Sign Out',
    },
    {
      id: 7,
      icon: (
        <Icon
          name="account-cancel-outline"
          size={22}
          color={defaultTheme ? '#fff' : '#535763'}
        />
      ),
      itemData: 'Delete My Account',
    },
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    getMydata();
  }, []);
  const getMydata = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('Data'));
      const apiResponse = await axios(
        `${Api}/${Appapi.getUserData}?email=${userData[0].email}`,
      );
      if (apiResponse.data) {
        setImageUrl(apiResponse.data[0].image);
        setEmail(apiResponse.data[0].email);
        setName(apiResponse.data[0].name);
        setIsLoaded(true);
      } else {
        console.log('No Data found');
      }
    } catch (error) {
      console.log('apiResponseError', error);
    }
  };
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('Data');
      navigation.navigate('Login');
    } catch (error) {
      console.log(Error1);
    }
  };
  const DeleteAccount = async () => {
    try {
      const Storeddata = await AsyncStorage.getItem('Data');
      if (Storeddata !== null) {
        const JASONData = JSON.parse(Storeddata);
        const Id = JASONData[0].email;
        const Msg = await axios(`${Api}/${Appapi.DeleteAccount}?email=${Id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (Msg.data) {
          try {
            await AsyncStorage.removeItem('Data');
            navigation.navigate('Login');
            showMessage({
              message: Msg.data[0].user,
              type: 'success',
              icon: {icon: 'auto', position: 'left'},
            });
          } catch (error) {}
        }
      } else {
        console.log('data not found');
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };
  const ScreenChange = item => {
    switch (item.item.id) {
      case 1:
        navigation.navigate('MyWorkouts');
        break;
      case 2:
        navigation.navigate('MyDiets');
        break;
      case 3:
        navigation.navigate('FavoritesRouter');
        break;
      case 4:
        navigation.navigate('AboutUs');
        break;
      case 5:
        navigation.navigate('Privacy');
        break;
      case 6:
        dispatch(resetStore());
        removeData();
        break;
      case 7:
        Alert.alert('Are you sure you want to delete your Account ?', '', [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Yes',
            onPress: () => {
              dispatch(resetStore());
              DeleteAccount();
            },
          },
        ]);
    }
  };
  // for updating profile photo on profile screen
  const UpdatePhoto = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('Data'));
    try {
      const response = await axios(
        `${Api}/${Appapi.getUserData}?email=${data[0].email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'mulitpart/form-data',
          },
        },
      );
      if (response.data) {
        setImageUrl(response.data[0].image);
        dispatch(updatePhoto(response.data[0].image));
        setPhotoUploaded(true);
        // console.log(response.data);
      }
    } catch (error) {
      console.log('UpdatePhotoError', error);
    }
  };
  const UpdateProfileModal = () => {
    const [modalImageUploaded, setModalImageUploaded] = useState(false);
    const [IsimgUploaded, setImguploaded] = useState(true);
    
    const UploadImage = async () => {
      const [userAvatar, setUserAvatar] = useState(null);
      // console.log("upload img")
      const data = JSON.parse(await AsyncStorage.getItem('Data'));
      try {
        let payload = new FormData();
        payload.append('image', {
          name: userAvatar.fileName,
          type: userAvatar.type,
          uri: userAvatar.uri,
        });
        payload.append('email', data[0].email);
        const ProfileData = await axios(`${Api}/${Appapi.UpdateProfile}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: payload,
        });
        console.log(ProfileData.data[0]);
        if (ProfileData.data[0].msg == 'profile updated') {
          await AsyncStorage.setItem(
            'UserData',
            JSON.stringify(ProfileData.data),
          );
          UpdatePhoto();
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
          setUserAvatar(resultCamera.assets[0]);
          if (resultCamera) {
            setModalImageUploaded(true);
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
          backgroundColor: defaultTheme ? '#000' : '#fff',
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
              style={[
                styles.modalContent,
                {backgroundColor: defaultTheme ? '#000' : '#fff'},
              ]}>
              <View
                style={[
                  styles.closeButton,
                  ,
                  {
                    width: (DeviceWidth * 85) / 100,
                    marginTop: 8,
                    backgroundColor: defaultTheme ? '#000' : 'fff',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setUpadteScreenVisibilty(false);
                  }}>
                  <Icons
                    name="close"
                    size={27}
                    color={defaultTheme ? '#fff' : '#000'}
                  />
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri:
                    userAvatar != null
                      ? userAvatar.uri
                      : 'https://gofit.tentoptoday.com/json/image/Avatar.png',
                }}
                style={styles.Icon}></Image>
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
                  <Icon
                    name="camera"
                    size={30}
                    color={defaultTheme ? '#fff' : '#000'}
                  />
                  <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                    Camera
                  </Text>
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
                  <Icon
                    name="camera-image"
                    size={30}
                    color={defaultTheme ? '#fff' : '#000'}
                  />
                  <Text style={{color: defaultTheme ? '#fff' : '#000'}}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
              {IsimgUploaded ? (
                <>
                  {modalImageUploaded ? (
                    <TouchableOpacity
                      style={{
                        width: DeviceWidth * 0.4,
                        height: (DeviceHeigth * 4) / 100,
                        backgroundColor: '#C8170D',
                        justifyContent: 'center',
                        borderRadius: 20,
                        alignItems: 'center',
                        margin: 5,
                      }}
                      onPress={() => {
                        setImguploaded(false);
                        UploadImage();
                      }}>
                      <Text style={[styles.cameraText]}>Upload Image</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        width: DeviceWidth * 0.4,
                        height: (DeviceHeigth * 3) / 100,
                        backgroundColor: defaultTheme
                          ? 'rgba(255,255,255,0.7)'
                          : 'rgba(0,0,0,0.7)',
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
                <ActivityIndicator color={'#C8170D'} size={35} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: defaultTheme == true ? '#000' : '#fff',
        }}>
        {Platform.OS == 'android' ? (
          <>
            <StatusBar
              barStyle={defaultTheme ? 'light-content' : 'dark-content'}
              backgroundColor={'#C8170D'}
            />
          </>
        ) : (
          <>
            <CustomStatusBar />
          </>
        )}
        <HeaderWithoutSearch Header={'Profile'} />
        <View style={styles.container1}>
          <View>
            <View
              style={[
                styles.Icon,
                {borderColor: defaultTheme ? '#fff' : '#000'},
              ]}>
              {PhotoUploaded ? (
                <ImageBackground
                  source={{
                    uri:
                      ProfilePhoto != null
                        ? ProfilePhoto
                        : 'https://gofit.tentoptoday.com/json/image/Avatar.png',
                  }}
                  style={styles.Icon}></ImageBackground>
              ) : (
                <ActivityIndicator size={35} color={'#C8170D'} />
              )}
            </View>
            <View style={{position: 'absolute', bottom: -2, right: -2}}>
              <TouchableOpacity
                style
                onPress={() => {
                  setUpadteScreenVisibilty(true);
                }}>
                <Icons
                  name="edit"
                  size={30}
                  color={defaultTheme ? '#fff' : '#000'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[
              styles.textStyle,
              {
                color: defaultTheme == true ? '#fff' : '#000',
                textTransform: 'capitalize',
              },
            ]}>
            {Name}
          </Text>
          <Text style={{color: defaultTheme == true ? '#fff' : '#000'}}>
            {Email}
          </Text>
        </View>
        <View style={{justifyContent: 'center', flex: 1}}>
          <FlatList
            data={data}
            renderItem={element => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  margin: 25,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                onPress={() => {
                  ScreenChange(element);
                }}>
                <View style={{marginRight: 20, marginLeft: 20}}>
                  {element.item.icon}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: (DeviceWidth * 75) / 100,
                  }}>
                  <Text
                    style={{
                      color: defaultTheme == true ? '#fff' : '#000',
                      fontSize: 15,
                    }}>
                    {element.item.itemData}
                  </Text>
                  <Image
                    source={localImage.nextButton}
                    style={[styles.nextIcon]}
                    tintColor={defaultTheme ? '#fff' : '#535763'}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {UpdateScreenVisibility ? <UpdateProfileModal /> : null}
      </View>
    );
   

};
const styles = StyleSheet.create({
  container1: {
    width: DeviceWidth,
    marginTop: (DeviceHeigth * 5) / 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: (DeviceHeigth * 5) / 100,
  },
  Icon: {
    width: 120,
    height: 120,
    borderRadius: 10 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '700',
    marginVertical: (DeviceHeigth * 2) / 100,
  },
  nextIcon: {
    tintColor: '#C8170D',
    resizeMode: 'contain',
    height: (DeviceHeigth * 1.5) / 100,
    alignSelf: 'flex-end',
    flexDirection: 'row',
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
  AuthInput: {
    marginBottom: (DeviceHeigth * 1) / 100,
    backgroundColor: 'transparent',
    width: (DeviceWidth * 60) / 100,
    margin: 20,
  },
});
export default ProfileScreen;
