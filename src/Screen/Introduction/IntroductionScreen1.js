import {View, Text, StyleSheet, StatusBar, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';

import {localImage} from '../../Component/Image';
import {
  setHindiLanuage,
  setShowIntro,
} from '../../Component/ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import CircleProgress from '../../Component/Utilities/ProgressCircle';
import {translate} from '../Translation/TranslationService';
import {FadeSlideIn, FloatingImage, IntroGlow} from './IntroAnimations';
import {NavButton, SkipButton, StepIndicator} from './IntroControls';
import {navButtonRadius, navButtonSize, scale} from './responsive';

const IntroductionScreen1 = ({navigation}) => {
  const dispatch = useDispatch();
  const hindiLanguage = useSelector(state => state.hindiLanguage);

  useEffect(() => {
    const translatedTitle = translate('title');
    const desc = translate('description');

    // setTitle(translatedTitle);
  }, []);

  // const [titleText, setTitleText] = useState('Get Fit, Your Way!');
  const [descText, setDescText] = useState(
    'Design your perfect workout routine! Choose from various exercises, customize your plan based on your goals, and enjoy workouts that fit your lifestyle. Achieve your fitness goals on your terms!',
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColor.WHITE} />

      {/* Skip Button */}
      <FadeSlideIn delay={100} distance={-10} style={styles.skipRow}>
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
            source={localImage.Intro1}
            style={styles.heroImage}
          />
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        <FadeSlideIn delay={250}>
          <Text style={styles.titleText}>
            {translate('intro1title')}
          </Text>
        </FadeSlideIn>

        <FadeSlideIn delay={400}>
          <Text style={styles.descText}>
            {translate('intro1description')}
          </Text>
        </FadeSlideIn>
      </View>

      {/* Bottom Navigation */}
      <FadeSlideIn delay={550} distance={16} style={styles.bottomNav}>
        <View style={{width: navButtonSize(), height: navButtonSize()}} />
        <StepIndicator currentStep={0} totalSteps={3} />
        <CircleProgress
          progress={33}
          radius={navButtonRadius()}
          secondayCircleColor={'#F0F0F0'}
          strokeWidth={3}
          containerStyle={{padding: 0}}
          clockwise>
          <NavButton
            direction="next"
            onPress={() => {
              AnalyticsConsole('TO_IS2');
              navigation.navigate('IntroductionScreen2');
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row',
    height: 80,
  },
});

export default IntroductionScreen1;
