import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import NewHeader from './Headers/NewHeader';
import {AppColor} from './Color';
import {localImage} from './Image';
import {DeviceHeigth, DeviceWidth} from './Config';
import InputText from './InputText';
import Button from './Button';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const NewEditProfile = () => {
  const [UpdateScreenVisibility, setUpadteScreenVisibilty] = useState(false);
const [Name,setName]=useState("")
  //Modal for upload profile
  const ProfileModal = () => {
    const [modalImageUploaded, setModalImageUploaded] = useState(false);
    const [IsimgUploaded, setImguploaded] = useState(true);
    const [userAvatar, setUserAvatar] = useState(null);
    const askPermissionForCamera = async permission => {
      const result = await request(permission);
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
    };

    return (
      <View
        style={{
          flex: 1,
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
            <View style={[styles.modalContent]}>
              <View
                style={[
                  styles.closeButton,
                  ,
                  {
                    width: (DeviceWidth * 85) / 100,
                    marginTop: 8,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setUpadteScreenVisibilty(false);
                  }}>
                  <Icons name="close" size={27} />
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
              <View style={styles.view5}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    if (Platform.OS == 'ios') {
                      askPermissionForCamera(PERMISSIONS.IOS.CAMERA);
                    } else {
                      askPermissionForCamera(PERMISSIONS.ANDROID.CAMERA);
                    }
                  }}>
                  <Icon name="camera" size={30} />
                  <Text>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    if (Platform.OS == 'ios') {
                      askPermissionForLibrary(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    } else {
                      askPermissionForLibrary(
                        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, // Need to check once according to Android versions
                      );
                    }
                  }}>
                  <Icon name="camera-image" size={30} />
                  <Text>Gallery</Text>
                </TouchableOpacity>
              </View>
              {modalImageUploaded ? (
                <TouchableOpacity
                  style={styles.uploadImgButton}
                  onPress={() => {
                    setImguploaded(false);
                  }}>
                  <Text style={[styles.cameraText]}>Upload Image</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.uploadImgButton}
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
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <View style={styles.Container}>
      <NewHeader backButton header={'Edit Profile'} />
      <View style={styles.profileView}>
        <Image
          source={localImage.BELL}
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
          />
        </TouchableOpacity>
      </View>
      <InputText
        leftIcon={localImage.Profile3}
        placeholder={'Full Name'}
        placeholderTextColor={AppColor.PLACEHOLDERCOLOR}
        autoCapitalize="none"
        value={Name}
        onChangeText={text => setName(text)}
     
      />
      <View style={styles.saveButton}>
        <Button buttonText={'Save'} />
      </View>
      {UpdateScreenVisibility ? <ProfileModal /> : null}
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.BACKGROUNG,
    alignItems:'center'
  },
  profileView: {
    marginHorizontal: DeviceWidth * 0.06,
    marginVertical: DeviceHeigth * 0.04,
    height: 160,
    width: 160,
    borderRadius: 160 / 2,
  },
  img: {
    height: 160,
    width: 160,
    borderRadius: 160 / 2,
  },
  pen: {
    width: 30,
    height: 30,
  },
  ButtonPen: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    position:'absolute',
    bottom:5,
    right:16,
    backgroundColor:AppColor.WHITE
    
  },
  saveButton: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: DeviceHeigth * 0.05,
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
    color: AppColor.WHITE,
    fontWeight: '600',
  },
  uploadImgButton: {
    width: DeviceWidth * 0.4,
    height: (DeviceHeigth * 3) / 100,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    margin: 5,
    backgroundColor: AppColor.RED,
  },
  view5: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: (DeviceWidth * 80) / 100,
    height: (DeviceHeigth * 10) / 100,
    marginBottom: 2,
  },
});
export default NewEditProfile;
