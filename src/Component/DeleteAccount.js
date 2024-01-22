import { View, Text } from 'react-native'
import React from 'react'

const DeleteAccount = () => {
  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={closeModal}>
    <BlurView
      style={styles.modalContainer}
      blurType="light"
      blurAmount={1}
      reducedTransparencyFallbackColor="white"
    />
    <View
      style={[styles.modalContent, {backgroundColor: AppColor.BACKGROUNG}]}>
    </View>
  </Modal>
  )
}

export default DeleteAccount