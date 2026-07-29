import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from '../../Component/Color';
import {setLaterButtonData} from '../../Component/ThemeRedux/Actions';
import {useDispatch} from 'react-redux';
import Bulb from './Bulb';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import FitIcon from '../../Component/Utilities/FitIcon';
import analytics from '@react-native-firebase/analytics';
import {localImage} from '../../Component/Image';
import {translate} from '../Translation/TranslationService';

const GOAL_PALETTES = [
  {
    // Loss Weight / Burn Calories - Hot Flame Rose
    gradient: ['#FF0844', '#FFB199'],
    unselectedGradient: ['#FFF0F3', '#FFE4E8'],
    borderColor: '#FF2A54',
    iconBg: '#FFE5EC',
    glowColor: 'rgba(255, 8, 68, 0.4)',
  },
  {
    // Build Muscle - Cyber Electric Violet
    gradient: ['#7F00FF', '#E100FF'],
    unselectedGradient: ['#F5F0FF', '#ECE0FF'],
    borderColor: '#9D4EDD',
    iconBg: '#EDE9FE',
    glowColor: 'rgba(127, 0, 255, 0.4)',
  },
  {
    // Strength & Health - Emerald Cyan Energy
    gradient: ['#00B4DB', '#0083B0'],
    unselectedGradient: ['#E6FFFA', '#E0F2FE'],
    borderColor: '#0284C7',
    iconBg: '#E0F2FE',
    glowColor: 'rgba(0, 180, 219, 0.4)',
  },
  {
    // General Fitness - Neon Cyber Sunset
    gradient: ['#FF4E50', '#F9D423'],
    unselectedGradient: ['#FFFBEB', '#FEF3C7'],
    borderColor: '#F59E0B',
    iconBg: '#FEF3C7',
    glowColor: 'rgba(255, 78, 80, 0.4)',
  },
];

const DEFAULT_GOALS = [
  {
    goal_id: 1,
    goal_title: 'Lose Weight',
    goal_subtitle: 'Burn calories & get lean',
    localImg: localImage.WeightLoss,
  },
  {
    goal_id: 2,
    goal_title: 'Build Muscle',
    goal_subtitle: 'Gain mass & build strength',
    localImg: localImage.BuildMuscle,
  },
  {
    goal_id: 3,
    goal_title: 'Keep Fit & Healthy',
    goal_subtitle: 'Improve stamina & daily energy',
    localImg: localImage.Strength,
  },
];

// Ambient Floating Particles
const FuturisticParticles = () => {
  const p1Y = useSharedValue(0);
  const p2Y = useSharedValue(0);

  useEffect(() => {
    p1Y.value = withRepeat(
      withSequence(
        withTiming(-16, {duration: 2500, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 2500, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    p2Y.value = withRepeat(
      withSequence(
        withTiming(14, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
        withTiming(-10, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
  }, []);

  const p1Style = useAnimatedStyle(() => ({
    transform: [{translateY: p1Y.value}],
  }));
  const p2Style = useAnimatedStyle(() => ({
    transform: [{translateY: p2Y.value}],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.particle, styles.particle1, p1Style]} />
      <Animated.View style={[styles.particle, styles.particle2, p2Style]} />
    </View>
  );
};

const GoalCard = ({
  item,
  index,
  isSelected,
  onSelect,
}: {
  item: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);
  const checkScale = useSharedValue(0);

  const palette = GOAL_PALETTES[index % GOAL_PALETTES.length];

  useEffect(() => {
    // Continuous subtle floating animation for icon
    floatY.value = withRepeat(
      withSequence(
        withTiming(index % 2 === 0 ? -6 : -8, {
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.04 : 1, {
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

  const imageSource = item?.goal_image
    ? {uri: item.goal_image}
    : item?.localImg || localImage.WeightLoss;

  return (
    <Animated.View
      entering={FadeInUp.duration(500).delay(index * 130).springify()}
      style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          scale.value = withTiming(0.96, {duration: 100});
        }}
        onPressOut={() => {
          scale.value = withSpring(isSelected ? 1.04 : 1, {
            damping: 12,
            stiffness: 180,
          });
        }}
        onPress={onSelect}
        style={[
          styles.goalCard,
          {borderColor: isSelected ? palette.borderColor : 'rgba(226, 232, 240, 0.8)'},
          isSelected && {
            shadowColor: palette.borderColor,
            shadowOpacity: 0.45,
            shadowRadius: 16,
            elevation: 10,
          },
        ]}>
        {isSelected ? (
          <LinearGradient
            colors={palette.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <LinearGradient
            colors={palette.unselectedGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.cardLeft}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isSelected
                  ? 'rgba(255, 255, 255, 0.28)'
                  : palette.iconBg,
                borderColor: isSelected ? '#FFFFFF' : palette.borderColor,
              },
            ]}>
            <Animated.View style={floatStyle}>
              <Image
                source={imageSource}
                style={styles.goalImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.goalTitle,
                isSelected ? styles.goalTitleSelected : {color: '#0F172A'},
              ]}>
              {item?.goal_title || item?.txt}
            </Text>
            {(item?.goal_subtitle || item?.txt1) && (
              <Text
                style={[
                  styles.goalSubtitle,
                  isSelected ? styles.goalSubtitleSelected : {color: '#475569'},
                ]}>
                {item?.goal_subtitle || item?.txt1}
              </Text>
            )}
          </View>
        </View>

        {/* Checkmark Badge */}
        <Animated.View
          style={[
            styles.checkBadge,
            {backgroundColor: isSelected ? '#FFFFFF' : 'transparent'},
            checkBadgeStyle,
          ]}>
          {isSelected && (
            <FitIcon
              name="check"
              size={14}
              type="MaterialCommunityIcons"
              color={palette.borderColor}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Goal = ({navigation, route}: any) => {
  const {data, nextScreen, gender, experience, workout_plans, name} =
    route?.params || {};
  const [selectedB, setSelectedB] = useState<number | string>(0);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<any>({});
  const [screen, setScreen] = useState(nextScreen);
  const [goalsData, setGoalsData] = useState<any[]>([]);

  useEffect(() => {
    setScreen(nextScreen);
    const temp = data?.filter((item: any) => item?.goal_gender == gender);
    if (temp && temp.length > 0) {
      setGoalsData(temp);
    } else {
      setGoalsData(DEFAULT_GOALS);
    }
  }, []);

  const handleSelectGoal = (item: any) => {
    setSelected(item);
    setSelectedB(item?.goal_id || item?.id);
    try {
      analytics().logEvent(`CV_FITME_GOAL_${item?.goal_title || item?.txt}`);
    } catch (e) {}
  };

  const toNextScreen = () => {
    const currentData = [
      {
        gender: gender,
        image:
          gender == 'Male'
            ? 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/fc1e357f-2310-4e50-8087-519663fe9400/public'
            : 'https://imagedelivery.net/PG2LvcyKPE1-GURD0XmG5A/e71b96f8-e68c-462e-baaf-a371b6fbc100/public',
      },
      {
        goal: selected?.goal_id || selected?.id,
        goal_name: selected?.goal_title || selected?.txt,
      },
      {
        experience: experience,
      },
      {
        workout_plans: workout_plans,
      },
    ];
    if (name) {
      currentData.push({name: name});
    }
    dispatch(setLaterButtonData(currentData));
    navigation.navigate('LoadData', {nextScreen: screen + 1});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Header / Bulb */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={styles.headerWrap}>
          <Bulb screen={translate('goalheading') || 'What is your main goal?'} />
        </Animated.View>

        {/* Goals List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}>
          {goalsData.map((item, index) => {
            const isSelected =
              selectedB === item?.goal_id || selectedB === item?.id;
            return (
              <GoalCard
                key={item?.goal_id || item?.id || index}
                item={item}
                index={index}
                isSelected={isSelected}
                onSelect={() => handleSelectGoal(item)}
              />
            );
          })}
        </ScrollView>

        {/* Bottom Floating Navigation */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <FitIcon
              name="chevron-left"
              size={24}
              type="MaterialCommunityIcons"
              color="#0F172A"
            />
          </TouchableOpacity>

          {selectedB !== 0 && (
            <Animated.View
              entering={FadeInUp.duration(300).springify()}
              style={styles.nextButtonWrap}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={toNextScreen}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#FF2A54', '#E11D48']}
                  style={styles.nextButton}>
                  <Text style={styles.nextText}>
                    {translate('continue') || 'Continue'}
                  </Text>
                  <FitIcon
                    name="chevron-right"
                    size={22}
                    type="MaterialCommunityIcons"
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Goal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  listContainer: {
    width: DeviceWidth,
    paddingHorizontal: 20,
    marginTop: DeviceHeigth * 0.04,
    paddingBottom: 110,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 16,
  },
  goalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 88,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalImage: {
    width: 32,
    height: 32,
  },
  textContainer: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  goalTitleSelected: {
    color: '#FFFFFF',
  },
  goalSubtitle: {
    fontFamily: Fonts.MONTSERRAT_REGULAR,
    fontSize: 13,
    marginTop: 3,
  },
  goalSubtitleSelected: {
    color: 'rgba(255, 255, 255, 0.88)',
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: DeviceHeigth * 0.04,
    width: DeviceWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonWrap: {
    borderRadius: 26,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  nextButton: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#FFFFFF',
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
});
