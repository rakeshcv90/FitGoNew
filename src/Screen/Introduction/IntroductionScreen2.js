import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {DeviceWidth, DeviceHeigth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';

import {CircularProgressWithChild} from 'react-native-circular-progress-indicator';
import FitIcon from '../../Component/Utilities/FitIcon';

import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {
  setHindiLanuage,
  setShowIntro,
} from '../../Component/ThemeRedux/Actions';
import AnimatedLottieView from 'lottie-react-native';
const IntroductionScreen2 = ({navigation, route}) => {
  const hindiLanguage = useSelector(state => state.hindiLanguage);
  const dispatch = useDispatch();
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />
      <View
        style={{
          width: '100%',
          height: '50%',
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
              dispatch(setHindiLanuage(!hindiLanguage));
              //navigation.navigate('IntroVideo', {type: 'intro'});
            }}>
            <Image
              source={localImage.TranslateIntro}
              resizeMode="contain"
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setShowIntro(true));
              navigation.navigate('LogSignUp', {screen: 'Log In'});
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
          source={localImage.Intro2}
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
          paddingTop: 30,
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
          {hindiLanguage
            ? 'खुद को शीर्ष पर ले जाएं'
            : 'Take Yourself to the Top'}
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
            ? `रैंकों में ऊपर उठें और अपनी निष्ठा को प्रदर्शित करें। सिक्के इकट्ठा करें, नए फिटनेस मुकाम हासिल करें, और लीडरबोर्ड के शीर्ष पर अपनी जगह बनाएं। आपकी शीर्ष तक की यात्रा अब शुरू होती है!`
            : `Rise through the ranks and showcase your dedication. Collect coins, achieve new fitness heights, and take your place at the top of the leaderboard. Your journey to the top starts now!`}
        </Text>
      </View>

      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '10%',
          backgroundColor: '#fff',
          paddingRight: 20,
          paddingLeft: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            // backgroundColor: AppColor.BLACK,
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
            name="arrowleft"
            size={25}
            type="AntDesign"
            color="#f0013b"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('IntroVideo', {type: 'intro'})}>
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
        </TouchableOpacity>
        <CircularProgressWithChild
          value={66}
          activeStrokeColor={'#f0013b'}
          radius={DeviceHeigth >= 1024 ? 35 : 25}
          initialValue={33}
          maxValue={100}
          inActiveStrokeColor={AppColor.WHITE}
          activeStrokeWidth={3}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('IntroductionScreen3');
            }}
            style={{
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
        </CircularProgressWithChild>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
});
export default IntroductionScreen2;
