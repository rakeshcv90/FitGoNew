import {View, Text,Modal, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppColor } from '../Color';
import { DeviceHeigth, DeviceWidth } from '../Config';

const UpcomingEventModal = ({
  visible,
  imagesource,
  onCancel,
  onConfirm,
  txt1,
  txt2,
  ButtonText,
}) => {
    return (
        <Modal transparent visible={visible}>
          <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
            <View style={styles.View1}>
              <Icon
                name="close"
                size={25}
                color={AppColor.BLACK}
                style={{
                  margin: 16,
                  position: 'absolute',
                  right: 0,
                  zIndex: 1,
                  overflow: 'hidden',
                }}
                onPress={onCancel}
              />
            </View>
          </View>
        </Modal>
      );
};
const styles=StyleSheet.create({
    View1: {
        backgroundColor: AppColor.WHITE,
        // height: 300,
        width: DeviceWidth * 0.9,
        height:300,
        alignSelf: 'center',
        borderRadius: 8,
        top: DeviceHeigth / 4,
        overflow: 'hidden',
        position: 'absolute',
      },
})
export default UpcomingEventModal;
