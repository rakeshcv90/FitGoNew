import {
  View,
  Text,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';

const Tooltip = ({visible, setVisible}) => {
  return (
    <Modal transparent visible={visible}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor:'rgba(0,0,0,0.4)'
        }}
        activeOpacity={1}
        onPress={() => setVisible(prev => !prev)}>
        <ImageBackground
          source={localImage.tooltip_outline}
          style={{
            // height: DeviceHeigth * 0.12,
            width: DeviceWidth * 0.54,
            position: 'absolute',
            right: 11,
            top: DeviceHeigth * 0.06,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical:18,
            paddingHorizontal:12
          }}
          resizeMode="contain">
          <Text
            style={{
              color: AppColor.BLACK,
            //   width: DeviceWidth * 0.5,
              fontFamily: 'Helvetica',
              fontSize: 16,
              lineHeight:18
            }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    </Modal>
  );
};

export default Tooltip;
