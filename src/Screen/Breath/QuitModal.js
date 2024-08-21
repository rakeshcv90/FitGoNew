import {View, Text, Modal, StyleSheet, Image} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import NewButton from '../../Component/NewButton';
import {AppColor} from '../../Component/Color';
import AnimatedLottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import { withSpring } from 'react-native-reanimated';
const QuitModal = ({type,cardAnimation}) => {
  const navigation = useNavigation();
  return (
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
          {"Your body's main\nsource of energy is oxygen"}
        </Text>
        <NewButton
          ButtonWidth={DeviceWidth * 0.4}
          pV={12}
          title={'Continue'}
          fontFamily={'Helvetica-Bold'}
          mV={10}
          buttonColor={AppColor.BREATHE_CIRCLE_COLOR}
           onPress={()=>{
            cardAnimation.value=withSpring(DeviceHeigth,{},()=>cardAnimation.value=-DeviceHeigth)
           }}
        />
        <Text
          style={styles.txt1}
          onPress={() => {
            if (type) {
              navigation.navigate('OfferPage');
            } else {
              navigation.navigate('WorkoutCompleted', {type: 'complete'});
            }
          }}>
          Yes, quit
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position:'absolute',
    top:DeviceHeigth/5,
    
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
