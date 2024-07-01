import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {localImage} from '../Image';
import NewButton from '../NewButton';
import ShimmerPlaceholder, {
  createShimmerPlaceholder,
} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
const UpcomingEventModal = ({visible, onCancel, onConfirm}) => {
  const [imageloaded, setImageLoaded] = useState(false);
  const avatarRef = useRef();
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const getDynamicPopUpvalues=useSelector(state=>state?.getDynamicPopUpvalues)
  return (
    <Modal transparent visible={visible}>
      <View style={{backgroundColor: `rgba(0,0,0,0.4)`, flex: 1}}>
        <View style={styles.View1}>
          {!imageloaded && (
            <ShimmerPlaceholder
              style={{
                width: DeviceWidth * 0.9,
                height: DeviceHeigth * 0.65,
              }}
              ref={avatarRef}
              autoRun
            />
          )}
          <ImageBackground
            source={getDynamicPopUpvalues?.image?{
              uri: getDynamicPopUpvalues?.image,
            }:localImage.fullsizebanner}
            onLoad={() => setImageLoaded(true)}
            resizeMode='stretch'
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <Icon
              name="close"
              color={AppColor.WHITE}
              size={25}
              style={{alignSelf: 'flex-end', margin: 12}}
              onPress={onCancel}
            />
            <NewButton
              buttonColor={getDynamicPopUpvalues?.button_color??AppColor.WHITE}
              title={getDynamicPopUpvalues?.button_text??"EARN NOW"}
              titleColor={getDynamicPopUpvalues?.button_text_color??'#FF005C'}
              pH={12}
              pV={12}
              bb
              alignSelf={getDynamicPopUpvalues?.button_position??"flex-start"}
              mV={getDynamicPopUpvalues?.margin_bottom}
              left={getDynamicPopUpvalues?.margin_start}
              right={getDynamicPopUpvalues?.margin_end}
              onPress={onConfirm}
            />
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  View1: {
    backgroundColor: '#FF005C',
    // height: 300,
    width: DeviceWidth * 0.9,
    height: DeviceHeigth * 0.65,
    alignSelf: 'center',
    borderRadius: 8,
    top: DeviceHeigth / 8,
    overflow: 'hidden',
    position: 'absolute',
  },
});
export default UpcomingEventModal;
