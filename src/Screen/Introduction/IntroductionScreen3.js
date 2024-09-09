import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';

import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {CircularProgressWithChild} from 'react-native-circular-progress-indicator';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {
  setHindiLanuage,
  setShowIntro,
} from '../../Component/ThemeRedux/Actions';
import AnimatedLottieView from 'lottie-react-native';
import { AnalyticsConsole } from '../../Component/AnalyticsConsole';

const IntroductionScreen3 = ({navigation}) => {
  const dispatch = useDispatch();
  const hindiLanguage = useSelector(state => state.hindiLanguage);
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
          disabled={true}
            onPress={() => {
              AnalyticsConsole('SKIP_IS');
              dispatch(setShowIntro(true));
              navigation.navigate('LogSignUp');
            }}>
            {/* <Text
              style={{
                textDecorationLine: 'underline',
                color: AppColor.WHITE,
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 20,
                fontSize: 14,
              }}>
              Skip
            </Text> */}
          </TouchableOpacity>
        </View>
        <Image
          source={localImage.Intro3}
          resizeMode="contain"
          style={{
            width: '80%',
            height: '80%',
            // top: DeviceHeigth * 0.04,
          }}></Image>
      </View>
      <View
        style={{
          width: '100%',
          height: '40%',
          backgroundColor: '#fff',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 30,
        }}>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 25,
            lineHeight: 33,
            fontWeight: '700',
            color: AppColor.RED,
          }}>
          {hindiLanguage ? 'साप्ताहिक पुरस्कार' : 'Weekly Rewards'}
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
            ? `सप्ताह के अंत तक चैलेंज पूरा करें और रोमांचक पुरस्कार प्राप्त करें। चाहे आप एक शुरुआती हों या फिटनेस प्रेमी, हमारे चैलेंज आपको प्रेरित और पुरस्कृत करने के लिए डिज़ाइन किए गए हैं। इसे न चूकें! हर सोमवार, एक नया चैलेंज शुरू होता है।
`
            : `Complete the challenge by the end of the week and receive exciting rewards. Whether you’re a beginner or a fitness legend, our challenges are designed to keep you motivated and rewarded. Don’t miss out! Every Monday, a new challenge begins.`}
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
            AnalyticsConsole("TO_IS2")
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
        <View style={{width: 50, height: 50}} />
        <CircularProgressWithChild
          value={100}
          activeStrokeColor={'#f0013b'}
          radius={DeviceHeigth >= 1024 ? 35 : 25}
          initialValue={66}
          maxValue={100}
          inActiveStrokeColor={AppColor.WHITE}
          activeStrokeWidth={3}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              AnalyticsConsole("TO_IS3")
              dispatch(setShowIntro(true));
              navigation.navigate('LogSignUp');
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
export default IntroductionScreen3;
