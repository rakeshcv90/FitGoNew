import {View, Text, Modal, StyleSheet, Image} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import NewButton from '../../Component/NewButton';
import {AppColor} from '../../Component/Color';
import AnimatedLottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
const QuitModal = ({visible,setVisible,navigation,type,offerType}) => {
  console.log(visible)
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.contentView}>
          <Text style={styles.txt1}>Take your time</Text>
          <AnimatedLottieView
            source={localImage.cautionLottie}
            style={{
              height: DeviceHeigth * 0.2,
              width: DeviceWidth * 0.8,
              alignSelf: 'center',
            }}
            autoPlay
            loop
            speed={1}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.txt1,
              {fontFamily: 'Helvetica', fontSize: 15, lineHeight: 24},         
            ]}>
            {"Your body's main\nsource of enery is oxygen"}
          </Text>
          <NewButton
            ButtonWidth={DeviceWidth * 0.4}
            pV={12}
            title={'Yes, quit'}
            fontFamily={'Helvetica-Bold'}
            mV={10}
            buttonColor={AppColor.BREATHE_CIRCLE_COLOR}
            onPress={()=>{
             if(type){
              setVisible(false)
              navigation.navigate("OfferPage")
             }else{
              setVisible(false)
              navigation.navigate("WorkoutCompleted",{type: 'complete'})
             }
            }}
          />
          <Text style={styles.txt1} onPress={()=>setVisible(false)}>Continue</Text>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentView: {
    width: DeviceWidth * 0.7,
    backgroundColor: '#505050',
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  txt1: {
    color: AppColor.WHITE,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
  },
});
export default QuitModal;
