import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {DeviceWidth, DeviceHeigth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';
import {IntroductionData} from './IntroductionScreenData';
import IntroProgressBar from './NewIntroductionProgressBar';
const IntroductionScreen1 = ({navigation}) => {
  const translateY = useRef(new Animated.Value(-200)).current;
  useEffect(() => {
    showAnimation();
    setTimeout(() => {
      navigation.navigate("IntroductionScreen2")
    }, 3000);
  }, []);
  const showAnimation = () => {
    translateY.setValue(300);
    Animated.timing(translateY, {
      useNativeDriver: true,
      toValue: -DeviceHeigth*10/100,
      delay: 500,
      duration: 1500,
    }).start();
  };
  return (
    <View style={styles.Container}>
      <ImageBackground
        source={{uri:IntroductionData[0].img}}
        style={styles.ImgBackground}>
        <View style={styles.LinearG}>
          <Animated.View
            style={[styles.TextView, {transform: [{translateY: translateY}]}]}>
            <Text style={[styles.Texts, {fontSize: 25}]}>
              {IntroductionData[0].text1}
            </Text>
            <Text style={[styles.Texts, {fontSize: 33, marginBottom: 50}]}>
              {IntroductionData[0].text2}
            </Text>
          </Animated.View>
       <IntroProgressBar INDEX={0}/>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  ImgBackground: {
    width: DeviceWidth,
    height: DeviceHeigth,
    resizeMode: 'stretch',
  },
  LinearG: {
    height: DeviceHeigth,
    width: DeviceWidth,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // position: 'absolute',
    // bottom:Platform.OS=='ios'?-DeviceHeigth*0.00:DeviceHeigth*0.02
  },
  TextView: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: (DeviceHeigth * 20) / 100,
  },
  Texts: {
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DeviceWidth * 85) / 100,
    marginBottom: (DeviceHeigth * 5) / 100,
    alignItems: 'center',
    alignSelf: 'center',
  },
  nextButton: {
    backgroundColor: 'red',
    width: 45,
    height: 45,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default IntroductionScreen1;
