import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {AppColor, Fonts} from './Color';
import {DeviceHeigth, DeviceWidth} from './Config';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from './Image';
import LinearGradient from 'react-native-linear-gradient';
const AppUpdateComponent = ({visible}) => {
  const [modalVisibility, setModalVisibility] = useState(visible);
  return (
    <View style={styles.Container}>
      <Modal animationType="fade" transparent={true} visible={modalVisibility}>
        <BlurView
          style={styles.modalContainer}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={[styles.modalContent, {backgroundColor: AppColor.BACKGROUNG}]}>
          <AnimatedLottieView
            source={localImage.UpdateAppLottie}
            speed={2}
            autoPlay
            loop
            resizeMode="contain"
            style={{
              width: DeviceWidth * 0.35,
              height: DeviceHeigth * 0.15,
              alignSelf: 'center',
            }}
          />
          <View style={{marginVertical: 16}}>
            <Text style={styles.txt1}>App Update Required</Text>
            <Text style={styles.txt2}>
              We have added new features and fix some bugs to make your
              experience seamless.
            </Text>
          </View>
          <LinearGradient
            colors={[AppColor.RED, AppColor.RED1]}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            style={{alignSelf: 'center', borderRadius: 25, marginBottom: 20,}}>
            <TouchableOpacity
              style={{borderRadius: 25,}}
              onPress={() => setModalVisibility(false)}>
              <Text
                style={styles.buttontxt}>
                Update App
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
  modalContent: {
    paddingHorizontal: 20,
    borderRadius: 8,
    width: DeviceWidth * 0.9,
    position: 'absolute',
    top: DeviceHeigth*0.2,
    alignSelf:'center',
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
  txt1: {
    color: AppColor.BLACK,
    fontSize: 18,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    textAlign: 'center',
    marginVertical: 17,
  },
  txt2: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 25,
  },
  buttontxt:{
    color: AppColor.WHITE,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 35,
  }
});
export default AppUpdateComponent;
