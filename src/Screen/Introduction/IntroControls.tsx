import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from '../../Component/Color';
import FitIcon from '../../Component/Utilities/FitIcon';
import {navButtonSize, scale} from './responsive';
import {PulsingButtonWrapper} from './IntroAnimations';

export const SkipButton = ({
  onPress,
  visible = true,
  label,
}: {
  onPress: () => void;
  visible?: boolean;
  label: string;
}) => {
  if (!visible) {
    return <View style={styles.skipPlaceholder} />;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.skipButton}>
      <Text style={styles.skipText}>{label}</Text>
      <FitIcon
        name="arrowright"
        type="AntDesign"
        size={scale(11)}
        color={AppColor.RED}
        mL={4}
      />
    </TouchableOpacity>
  );
};

export const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <View style={styles.stepContainer}>
      {Array.from({length: totalSteps}).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            index === currentStep ? styles.stepDotActive : styles.stepDotInactive,
          ]}
        />
      ))}
    </View>
  );
};

export const NavButton = ({
  direction,
  onPress,
}: {
  direction: 'back' | 'next';
  onPress: () => void;
}) => {
  const size = navButtonSize();

  if (direction === 'back') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.backButton,
          {width: size, height: size, borderRadius: size / 2},
        ]}>
        <FitIcon
          name="arrowleft"
          size={scale(22)}
          type="AntDesign"
          color={AppColor.RED}
        />
      </TouchableOpacity>
    );
  }

  return (
    <PulsingButtonWrapper>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <LinearGradient
          colors={[AppColor.RED, '#C2255C']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.nextButton,
            {width: size, height: size, borderRadius: size / 2},
          ]}>
          <FitIcon
            name="arrowright"
            size={scale(22)}
            type="AntDesign"
            color={AppColor.WHITE}
          />
        </LinearGradient>
      </TouchableOpacity>
    </PulsingButtonWrapper>
  );
};

const styles = StyleSheet.create({
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColor.LIGHTPINK,
    paddingHorizontal: scale(14),
    paddingVertical: scale(7),
    borderRadius: 20,
  },
  skipPlaceholder: {
    height: scale(30),
    width: scale(60),
  },
  skipText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    color: AppColor.RED,
    fontWeight: '600',
    fontSize: scale(13),
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.LIGHTPINK,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColor.RED,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    borderRadius: 50,
  },
  stepDotActive: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColor.RED,
  },
  stepDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
});
