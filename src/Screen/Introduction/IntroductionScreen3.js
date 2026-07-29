import {View, Text, StyleSheet, StatusBar, Platform} from 'react-native';
import React from 'react';

import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth} from '../../Component/Config';
import {localImage} from '../../Component/Image';
import {useDispatch, useSelector} from 'react-redux';
import {
  setHindiLanuage,
  setShowIntro,
} from '../../Component/ThemeRedux/Actions';
import AnimatedLottieView from 'lottie-react-native';
import { AnalyticsConsole } from '../../Component/AnalyticsConsole';
import CircleProgress from '../../Component/Utilities/ProgressCircle';
import { translate } from '../Translation/TranslationService';
import {FadeSlideIn, FloatingImage, IntroGlow} from './IntroAnimations';
import {NavButton, SkipButton, StepIndicator} from './IntroControls';
import {navButtonRadius, navButtonSize, scale} from './responsive';

const IntroductionScreen3 = ({navigation}) => {
  const dispatch = useDispatch();
  const hindiLanguage = useSelector(state => state.hindiLanguage);
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />

      {/* Skip Button (hidden on last screen) */}
      <FadeSlideIn delay={100} distance={-10} style={styles.skipRow}>
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
        <SkipButton
          visible={false}
          label=""
          onPress={() => {
            AnalyticsConsole('SKIP_IS');
            dispatch(setShowIntro(true));
            navigation.navigate('LogSignUp');
          }}
        />
      </FadeSlideIn>

      {/* Hero Image */}
      <View style={styles.imageSection}>
        <View style={styles.imageContainer}>
          <IntroGlow />
          <FloatingImage
            source={localImage.Intro3}
            style={styles.heroImage}
          />
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        <FadeSlideIn delay={250}>
          <Text style={styles.titleText}>
            {/* {hindiLanguage ? 'सुकून की साँस लें!' : 'Breathe In, Stress Out!'} */}
            {translate('intro3title')}
          </Text>
        </FadeSlideIn>

        <FadeSlideIn delay={400}>
          <Text style={styles.descText}>
            {/* {hindiLanguage
              ? `शांति पाएं इस हलचल भरी दुनिया में हमारी शांतिदायक ब्रीदिंग एक्सरसाइज और माइंडफुल मेडिटेशन सेशन के साथ। तनाव कम करें, मूड बेहतर करें और हमारे गाइडेड सेशन्स के साथ अपनी फोकस क्षमता बढ़ाएं। एक गहरी साँस लें और एक शांत, स्वस्थ जीवन का आनंद उठाएं!`
              : `Find your peace amidst the chaos with calming breathing exercises and mindful meditation sessions. Reduce stress, boost your mood, and enhance your focus with our guided sessions. Take a deep breath and unlock a calmer, healthier you!`} */}
              {translate('intro3description')}
          </Text>
        </FadeSlideIn>
      </View>

      {/* Bottom Navigation */}
      <FadeSlideIn delay={550} distance={16} style={styles.bottomNav}>
        <NavButton
          direction="back"
          onPress={() => {
            AnalyticsConsole("TO_IS2")
            navigation.goBack();
          }}
        />
        <StepIndicator currentStep={2} totalSteps={3} />
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
          progress={0}
          radius={navButtonRadius()}
          secondayCircleColor={'#F0F0F0'}
          // clockwise
          containerStyle={{padding: 0}}
          strokeWidth={3}>
          <NavButton
            direction="next"
            onPress={() => {
              AnalyticsConsole("TO_IS3")
              dispatch(setShowIntro(true));
              navigation.navigate('LogSignUp');
            }}
          />
        </CircleProgress>
      </FadeSlideIn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  skipRow: {
    height: scale(34),
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 10,
  },
  imageSection: {
    width: '100%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.WHITE,
  },
  imageContainer: {
    width: '85%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  titleText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: scale(26),
    lineHeight: scale(34),
    fontWeight: '700',
    color: '#1A1A2E',
  },
  descText: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: scale(15),
    lineHeight: scale(24),
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 14,
  },
  bottomNav: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row',
    height: 80,
  },
});

export default IntroductionScreen3;
