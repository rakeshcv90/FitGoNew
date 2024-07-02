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
import {useSelector} from 'react-redux';
const UpcomingEventModal = ({visible, onCancel, onConfirm}) => {
  const [imageloaded, setImageLoaded] = useState(false);
  const avatarRef = useRef();
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const getDynamicPopUpvalues = useSelector(
    state => state?.getDynamicPopUpvalues,
  );
  const getDownloadedImage = useSelector(state => state?.getDownloadedImage);
  console.log(getDownloadedImage.popupImage);
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
            source={
              getDownloadedImage.popupImage
                ? {uri: getDownloadedImage?.popupImage}
                : localImage.fullsizebanner
            }
            onLoad={() => setImageLoaded(true)}
            resizeMode="stretch"
            style={{
              height: '100%',
              width: '100%',
              justifyContent: getDownloadedImage.popupImage
                ? 'space-between'
                : 'center',
            }}>
            <Icon
              name="close"
              color={AppColor.WHITE}
              size={25}
              style={{
                alignSelf: 'flex-end',
                margin: 12,
                position: getDownloadedImage?.popupImage
                  ? 'relative'
                  : 'absolute',
                top: 0,
                right: 0,
              }}
              onPress={onCancel}
            />
            <NewButton
              buttonColor={
                getDynamicPopUpvalues?.button_color ?? AppColor.WHITE
              }
              title={getDynamicPopUpvalues?.button_text ?? 'EARN NOW'}
              titleColor={getDynamicPopUpvalues?.button_text_color ?? '#FF005C'}
              pH={12}
              pV={12}
              bb
              bottom={
                getDownloadedImage?.popupImage ? undefined : DeviceHeigth * 0.06
              }
              alignSelf={getDownloadedImage?.popupImage?getDynamicPopUpvalues?.button_position:undefined}
              mV={getDownloadedImage?.popupImage?getDynamicPopUpvalues?.margin_bottom:undefined}
              left={getDownloadedImage?.popupImage?getDynamicPopUpvalues?.margin_start:undefined}
              right={getDownloadedImage?.popupImage?getDynamicPopUpvalues?.margin_end:undefined}
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
