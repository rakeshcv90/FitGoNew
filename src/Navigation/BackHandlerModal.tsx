import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  BackHandler,
  Alert,
  TouchableOpacity,
  StyleSheet,
  NativeModules,
} from 'react-native';
import FitText from '../Component/Utilities/FitText';
import {navigationRef} from '../../App';
import {DeviceWidth} from '../Component/Config';
import NativeAddTest from '../Component/NativeAddTest';
import {AppColor, Fonts} from '../Component/Color';

const BackHandlerModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const MusicPlayer = NativeModules.MusicPlayer;

  useEffect(() => {
    const backAction = () => {
      if (
        !isModalVisible &&
        navigationRef?.current?.getCurrentRoute()?.name == 'Home'
      ) {
        // Open modal if not already opened
        setModalVisible(true);
        return true; // Prevent the default back action
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [isModalVisible]);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleModalClose} // Handle back press while modal is open
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000066',
        }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: DeviceWidth,
            padding: 10,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <NativeAddTest media={true} type="video" />
          <FitText
            type="SubHeading"
            value="Want to exit from the app?"
            textAlign="center"
          />
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              width: '90%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => MusicPlayer?.closeApp()}
              style={[
                styles.buttonView,
                {
                  backgroundColor: AppColor.WHITE,
                  borderWidth: 1,
                  borderColor: '#6B7280',
                },
              ]}>
              <FitText
                type="normal"
                value="Exit"
                color="#6B7280"
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleModalClose}
              style={[
                styles.buttonView,
                {
                  backgroundColor: AppColor.RED,
                  borderWidth: 1,
                  borderColor: AppColor.RED,
                },
              ]}>
              <FitText
                type="normal"
                color={AppColor.WHITE}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
                value="Cancel"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    width: DeviceWidth * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 10,
  },
});

export default BackHandlerModal;
