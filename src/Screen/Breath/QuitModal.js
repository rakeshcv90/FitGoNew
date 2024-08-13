import {View, Text, Modal, StyleSheet, Image} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import NewButton from '../../Component/NewButton';

const QuitModal = () => {
  return (
    <Modal visible={true} animationType="slide">
   <View style={styles.container}>
    <View>

    </View>
   </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
 flex:1
  },
});
export default QuitModal;
