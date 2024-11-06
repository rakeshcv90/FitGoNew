import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {DeviceWidth, DeviceHeigth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';

import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import {
  setHindiLanuage,
  setShowIntro,
} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import CircleProgress from '../../Component/Utilities/ProgressCircle';
const IntroductionScreen1 = ({navigation}) => {
  const dispatch = useDispatch();
  const hindiLanguage = useSelector(state => state.hindiLanguage);
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />
      <View
        style={{
          width: '100%',
          height: '50%',
          opacity: 1,
          backgroundColor: AppColor.WHITE,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 30,
            width: '95%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            zIndex: 1,
            top: Platform.OS == 'ios' && DeviceHeigth <= 1024 ? 15 : -5,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',

              zIndex: 1,
              overflow: 'hidden',
              width: DeviceWidth * 0.08,
              height: DeviceHeigth * 0.05,
            }}
            onPress={() => {
              AnalyticsConsole(`LAN_C_TO_${hindiLanguage ? 'H' : 'E'}`);
              dispatch(setHindiLanuage(!hindiLanguage));
            }}>
            <Image
              source={localImage.TranslateIntro}
              resizeMode="contain"
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              AnalyticsConsole('SKIP_IS');
              dispatch(setShowIntro(true));
              navigation.navigate('LogSignUp');
            }}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: AppColor.RED,
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 20,
                fontSize: 14,
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={localImage.Intro1}
          resizeMode="contain"
          style={{
            width: '80%',
            height: '80%',
            // top: DeviceHeigth * 0.04,
          }}></Image>
      </View>
      <View
        style={{
          height: '40%',
          backgroundColor: '#fff',
          paddingLeft: 20,
          paddingTop: 24,
          paddingRight: 20,
        }}>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 25,
            lineHeight: 33,
            fontWeight: '700',
            color: AppColor.RED,
          }}>
          {hindiLanguage ? 'अपना फिटनेस का सफर खुद तय करें!' : 'Get Fit, Your Way!'}
        </Text>

        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_REGULAR,
            fontSize: 16,
            lineHeight: 25,
            fontWeight: '500',
            color: '#333333CC',
            opacity: 0.8,
            marginTop: 16,
          }}>
          {hindiLanguage
            ? `अपनी परफेक्ट वर्कआउट रूटीन डिजाइन करें! विभिन्न एक्सरसाइज में से चुनें, अपने लक्ष्य के अनुसार प्लान कस्टमाइज़ करें, और अपनी लाइफस्टाइल के अनुसार वर्कआउट का आनंद लें। अपने फिटनेस गोल्स को अपने तरीके से हासिल करें!`
            : `Design your perfect workout routine! Choose from various exercises, customize your plan based on your goals, and enjoy workouts that fit your lifestyle. Achieve your fitness goals on your terms!`}
        </Text>
      </View>
      <View
        style={{
          // alignSelf: 'flex-end',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '10%',
          backgroundColor: 'white',
          paddingRight: 20,
          flexDirection: 'row',
        }}>
        <View style={{width: 50, height: 50}} />
        <View style={{width: 50, height: 50}} />
        {/* <TouchableOpacity
          onPress={() =>{
            AnalyticsConsole('IV_F_IS')
             navigation.navigate('IntroVideo', {type: 'intro'})}}>
          <AnimatedLottieView
            source={localImage.IntroJSON}
            speed={1}
            autoPlay
            loop
            resizeMode="cover"
            style={{
              width: DeviceWidth * 0.3,
              height: '100%',
            }}
          />
        </TouchableOpacity> */}
        <CircleProgress
          progress={33}
          radius={DeviceHeigth >= 1024 ? 35 : 25}
          secondayCircleColor={AppColor.WHITE}
          strokeWidth={3}
          clockwise>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              AnalyticsConsole("TO_IS2")
              navigation.navigate('IntroductionScreen2');
            }}
            style={{
              backgroundColor: AppColor.WHITE,
              width:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.08 : DeviceWidth * 0.1,
              height:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.08 : DeviceWidth * 0.1,
              borderRadius: 100,
              margin: 5,

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FitIcon
              name="arrowright"
              size={25}
              type="AntDesign"
              color={AppColor.RED}
            />
          </TouchableOpacity>
        </CircleProgress>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
export default IntroductionScreen1;
