import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import React, {useState} from 'react';
import {BlurView} from '@react-native-community/blur';
import {AppColor} from './Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from './Config';
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux';
const DeleteAccount = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    getUserDataDetails,
  } = useSelector(state => state);
  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };
  const Delete=async()=>{
    try {
      const res = await axios({
        url: NewAppapi.Delete_Account,
        method: 'get',
        data: {
          user_id: getUserDataDetails?.id,
        },
      });
      if(res.data){
        console.log("Delete Account",res.data)
      }
    } catch (error) {
      console.log("Delete Account Api Error")
    }
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={closeModal}>
      <BlurView
        style={styles.modalContainer}
        blurType="light"
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      />
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
              fontWeight: '500',
              fontSize: 16,
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
            marginTop: 40,
          }}>
          <TouchableOpacity style={{marginRight: 20}}>
            <Text
              style={{
                color: AppColor.BoldText,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
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
            }}>
            <Text
              style={{
                padding: 5,
                textAlign: 'center',
                color: AppColor.WHITE,
                fontSize: 12,
                fontFamily: 'poppins-SemiBold',
              }} 
              onPress={()=>{Delete()}}
              >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
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
});

export default DeleteAccount;
