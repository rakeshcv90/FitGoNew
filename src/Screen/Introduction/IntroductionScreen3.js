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
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import IntroProgressBar from './NewIntroductionProgressBar';
import {useDispatch, useSelector} from 'react-redux';
import {setShowIntro} from '../../Component/ThemeRedux/Actions';
const IntroductionScreen3 = ({navigation}) => {
  const TranslateY = useRef(new Animated.Value(0)).current;
  const HideTextAnimation = () => {
    TranslateY.setValue(0);
    Animated.timing(TranslateY, {
      useNativeDriver: true,
      toValue: -DeviceHeigth,
      delay: 0,
      duration: 1500,
    }).start();
    setTimeout(() => {
      HidePlayIcon();
    }, 1000);
  };
  const dispatch = useDispatch();
  const TranslateStartIcon = useRef(new Animated.Value(0)).current;
  const HidePlayIcon = () => {
    TranslateStartIcon.setValue(0);
    Animated.timing(TranslateStartIcon, {
      useNativeDriver: true,
      toValue: DeviceWidth,
      delay: 0,
      duration: 1500,
    }).start();
    setTimeout(() => {
      navigation.navigate('LogSignUp');
    }, 500);
  };
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    showAnimation();
  }, []);
  const showAnimation = () => {
    translateX.setValue(-DeviceWidth);
    Animated.timing(translateX, {
      useNativeDriver: true,
      toValue: 1,
      delay: 500,
      duration: 1500,
    }).start();
  };

  return (
    <View style={styles.Container}>
      <ImageBackground
        source={{uri: IntroductionData[2].img}}
        style={styles.ImgBackground}>
        <View style={styles.LinearG}>
          <Animated.View
            style={[styles.TextView, {transform: [{translateX: translateX}]}]}>
            <Animated.View
              style={[
                styles.TextView1,
                {transform: [{translateY: TranslateY}]},
              ]}>
              <Text style={[styles.Texts, {fontSize: 25}]}>
                {IntroductionData[2].text1}
              </Text>
              <Text style={[styles.Texts, {fontSize: 33, marginBottom: 50}]}>
                {IntroductionData[2].text2}
              </Text>
            </Animated.View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                dispatch(setShowIntro(true));
                // navigation.navigate('LogSignUp');
                HideTextAnimation();
              }}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#941000', '#D5191A']}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  height: 50,
                  borderRadius: 50,
                  width: DeviceWidth * 0.4,
                }}>
                <Text
                  style={[styles.Texts, {fontSize: 20}]}>{`Start Now`}</Text>
                <Animated.View
                  style={[, {transform: [{translateX: TranslateStartIcon}]}]}>
                  <Icons
                    name="play"
                    size={25}
                    color={AppColor.WHITE}
                    style={{marginLeft: 8}}
                  />
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          <View style={{marginBottom: DeviceHeigth * 0.03}}>
            <IntroProgressBar INDEX={2} />
          </View>
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
    marginBottom: (DeviceHeigth * 10) / 100,
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
  TextView1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default IntroductionScreen3;
