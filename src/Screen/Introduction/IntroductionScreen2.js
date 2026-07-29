import {View, Text, StyleSheet, StatusBar, Platform} from 'react-native';
import React, {useState} from 'react';
import {DeviceHeigth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';

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

const IntroductionScreen2 = ({navigation, route}) => {
  const hindiLanguage = useSelector(state => state.hindiLanguage);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />

      {/* Skip Button */}
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
          label={translate('skip')}
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
            source={localImage.Intro2}
            style={styles.heroImage}
          />
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        <FadeSlideIn delay={250}>
          <Text style={styles.titleText}>
            {/* {hindiLanguage
              ? 'फिट रहें, इनाम पाएं!'
              : 'Earn While You Burn!'}
               */}
               {translate('intro2title')}
          </Text>
        </FadeSlideIn>

        <FadeSlideIn delay={400}>
          <Text style={styles.descText}>
            {/* {hindiLanguage
              ? `हमारे रोमांचक फिटनेस चैलेंजेस में हिस्सा लें और अपनी सीमाओं को चुनौती दें! लीडरबोर्ड पर चढ़ें, और अपनी मेहनत को शानदार इनामों में बदलते हुए देखें।`
              : `Join our thrilling fitness challenges and push your limits! Climb to the top of the leaderboard, and watch as your hard work transforms into exciting rewards.`} */}
              {translate('intro2description')}
          </Text>
        </FadeSlideIn>
      </View>

      {/* Bottom Navigation */}
      <FadeSlideIn delay={550} distance={16} style={styles.bottomNav}>
        <NavButton
          direction="back"
          onPress={() => {
            AnalyticsConsole("TO_IS1")
            navigation.goBack();
          }}
        />
        <StepIndicator currentStep={1} totalSteps={3} />
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
          progress={67}
          radius={navButtonRadius()}
          secondayCircleColor={'#F0F0F0'}
          strokeWidth={3}
          containerStyle={{padding: 0}}
          clockwise>
          <NavButton
            direction="next"
            onPress={() => {
              AnalyticsConsole("TO_IS3")
              navigation.navigate('IntroductionScreen3');
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
    justifyContent: 'flex-end',
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

export default IntroductionScreen2;
