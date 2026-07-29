import {
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import Bulb from './Bulb';
import {useDispatch, useSelector} from 'react-redux';
import FitIcon from '../../Component/Utilities/FitIcon';
import analytics from '@react-native-firebase/analytics';
import {localImage} from '../../Component/Image';
import {translate} from '../Translation/TranslationService';

const GenderCard = ({
  gender,
  label,
  imageSource,
  isSelected,
  onPress,
}: {
  gender: 'Male' | 'Female';
  label: string;
  imageSource: any;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    // Continuous floating physics for character image
    floatY.value = withRepeat(
      withSequence(
        withTiming(gender === 'Male' ? -8 : -10, {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    // Continuous pulse glow for selected state
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.12, {duration: 1400, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.96, {duration: 1400, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.05 : 1, {
      damping: 12,
      stiffness: 180,
    });
    checkScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 10,
      stiffness: 240,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{translateY: floatY.value}],
  }));

  const checkBadgeStyle = useAnimatedStyle(() => ({
    transform: [{scale: checkScale.value}],
  }));

  const glowHaloStyle = useAnimatedStyle(() => ({
    transform: [{scale: glowScale.value}],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          scale.value = withTiming(0.95, {duration: 100});
        }}
        onPressOut={() => {
          scale.value = withSpring(isSelected ? 1.05 : 1, {
            damping: 12,
            stiffness: 180,
          });
        }}
        onPress={onPress}
        style={[
          styles.genderCard,
          isSelected && styles.genderCardSelected,
        ]}>
        {isSelected ? (
          <LinearGradient
            colors={['#FFF1F4', '#FFE4E8', '#FFFFFF']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <LinearGradient
            colors={['#F8FAFC', '#F1F5F9']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Ambient Character Glow Halo */}
        {isSelected && (
          <Animated.View style={[styles.characterHalo, glowHaloStyle]} />
        )}

        {/* Selected Checkmark Badge */}
        <Animated.View style={[styles.selectedBadge, checkBadgeStyle]}>
          <FitIcon
            name="check"
            size={12}
            type="MaterialCommunityIcons"
            color="#FFFFFF"
          />
        </Animated.View>

        {/* Character Image with Floating Animation */}
        <View style={styles.imageContainer}>
          <Animated.View style={[styles.imageFloatWrap, floatStyle]}>
            <Image
              source={imageSource}
              style={styles.genderImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Gender Title */}
        <Text
          style={[
            styles.genderTitle,
            isSelected && styles.genderTitleSelected,
          ]}>
          {label}
        </Text>

        {/* Selection Pill Badge */}
        <View
          style={[
            styles.selectPill,
            isSelected && styles.selectPillSelected,
          ]}>
          <Text
            style={[
              styles.selectPillText,
              isSelected && styles.selectPillTextSelected,
            ]}>
            {isSelected ? 'Selected ✓' : 'Select →'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Gender = ({route, navigation}: any) => {
  const {data, nextScreen, name} = route?.params || {};
  const getUserDataDetails = useSelector((state: any) => state.getUserDataDetails);
  const dispatch = useDispatch();
  const [screen, setScreen] = useState(nextScreen);
  const [selectedbutton, setSelectedButton] = useState('');

  useEffect(() => {
    setScreen(nextScreen);
  }, []);

  const handleImagePress = (gender: string) => {
    try {
      analytics().logEvent(`CV_FITME_GENDER_${gender}`);
    } catch (e) {}
    setSelectedButton(gender);
    toNextScreen(gender);
  };

  const toNextScreen = (gender: string) => {
    setTimeout(() => {
      const params: any = {
        data: data,
        gender: gender,
      };

      if (name) {
        params.name = name;
      }
      navigation.navigate('Goal', params);
    }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header / Bulb */}
      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        style={styles.headerWrap}>
        <Bulb screen={translate('genderheading') || 'Select your gender'} />
      </Animated.View>

      {/* Gender Selection Grid */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(150).springify()}
        style={styles.gridContainer}>
        <GenderCard
          gender="Male"
          label={translate('male') || 'Male'}
          imageSource={localImage.MaleNew}
          isSelected={selectedbutton === 'Male'}
          onPress={() => handleImagePress('Male')}
        />

        <GenderCard
          gender="Female"
          label={translate('female') || 'Female'}
          imageSource={localImage.FemaleNew}
          isSelected={selectedbutton === 'Female'}
          onPress={() => handleImagePress('Female')}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Gender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  headerWrap: {
    marginTop:
      Platform.OS === 'ios'
        ? DeviceHeigth >= 1024 || DeviceHeigth <= 667
          ? DeviceHeigth * 0.04
          : DeviceHeigth * 0.06
        : DeviceHeigth * 0.04,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceWidth,
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  cardWrapper: {
    width: (DeviceWidth - 48) / 2,
    alignItems: 'center',
  },
  genderCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    minHeight: DeviceHeigth * 0.35,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  genderCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF2A54',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  characterHalo: {
    position: 'absolute',
    top: '12%',
    alignSelf: 'center',
    width: DeviceWidth * 0.32,
    height: DeviceWidth * 0.32,
    borderRadius: (DeviceWidth * 0.32) / 2,
    backgroundColor: 'rgba(255, 42, 84, 0.12)',
  },
  selectedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF2A54',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imageContainer: {
    height: DeviceHeigth * 0.19,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  imageFloatWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderImage: {
    height: '100%',
    width: '100%',
  },
  genderTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 19,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  genderTitleSelected: {
    color: '#FF2A54',
  },
  selectPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 12,
  },
  selectPillSelected: {
    backgroundColor: '#FF2A54',
  },
  selectPillText: {
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  selectPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
