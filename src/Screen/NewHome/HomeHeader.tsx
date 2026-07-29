import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from 'react-native';
import React from 'react';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import {useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AppColor, Fonts} from '../../Component/Color';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import FitIcon, {FitIconTypes} from '../../Component/Utilities/FitIcon';
import moment from 'moment';
import {translate} from '../Translation/TranslationService';

type Props = {
  leaderboardData: Array<{
    fit_coins: number;
    id: number;
    image: null;
    image_path: null;
    name: string;
    rank: number;
  }>;
};

// Animated Pressable Button Component
const AnimatedTouch = ({onPress, disabled, style, children}: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.92, {duration: 100});
        }}
        onPressOut={() => {
          scale.value = withSpring(1, {damping: 12, stiffness: 220});
        }}
        style={style}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeHeader = ({leaderboardData}: Props) => {
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const fitCoins = useSelector((state: any) => state.fitCoins);

  const Sat =
    getPurchaseHistory?.currentDay && getPurchaseHistory?.currentDay === 6;
  const Sun =
    getPurchaseHistory?.currentDay && getPurchaseHistory?.currentDay === 0;

  const myRank =
    leaderboardData &&
    leaderboardData.filter(item => item?.id === getUserDataDetails?.id);

  const currentTime = parseInt(moment().format('HH'), 10);
  const greeting =
    currentTime < 12
      ? translate('goodmorning')
      : currentTime >= 12 && currentTime < 17
      ? translate('goodafternoon')
      : translate('goodevening');

  const historyIcon: FitIconTypes = {
    name: 'history',
    size: 20,
    type: 'MaterialCommunityIcons',
    color: '#FF2A54',
    bW: 0,
    bR: 20,
    roundBackground: '#FFF1F2',
    buttonProps: {
      disabled: Sat || Sun,
      activeOpacity: 0.7,
    },
    onPress: () => {
      AnalyticsConsole('HB');
      navigate('WorkoutHistory');
    },
  };

  const userName =
    getUserDataDetails?.name == null
      ? 'Guest'
      : getUserDataDetails?.name.split(' ')[0];

  return (
    <View style={[PredefinedStyles.rowBetween, styles.container]}>
      {/* User Greeting & Name with FadeInDown Animation */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        style={{flex: 1}}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {userName}
        </Text>
      </Animated.View>

      {enteredCurrentEvent ? (
        <Animated.View
          entering={FadeInRight.duration(500).springify()}
          style={styles.rightActions}>
          <FitIcon {...historyIcon} roundIcon />

          <AnimatedTouch
            disabled={Sat || Sun}
            onPress={() => {
              AnalyticsConsole('HB');
              navigate('WorkoutHistory');
            }}
            style={styles.eventPill}>
            <Image
              source={localImage.FitCoin}
              style={{height: 18, width: 18}}
              resizeMode="contain"
            />
            <Text style={styles.pillText}>{fitCoins ?? 0}</Text>
          </AnimatedTouch>

          <AnimatedTouch
            disabled={Sat || Sun}
            onPress={() => {
              AnalyticsConsole('LB');
              navigate('Leaderboard');
            }}
            style={styles.eventPill}>
            <Image
              source={require('./LeaderboardIMG.png')}
              style={{height: 18, width: 18}}
              resizeMode="contain"
            />
            <Text style={styles.pillText}>{`#${myRank[0]?.rank ?? 0}`}</Text>
          </AnimatedTouch>
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeInRight.duration(500).springify()}
          style={styles.rightActions}>
          {/* Futuristic Animated Leaderboard Circular Button */}
          <AnimatedTouch
            disabled={Sat || Sun}
            onPress={() => {
              AnalyticsConsole('HB');
              navigate('Leaderboard');
            }}
            style={styles.leaderboardBtn}>
            <Image
              source={require('./LeaderboardIMG.png')}
              style={{height: 24, width: 24}}
              resizeMode="contain"
            />
          </AnimatedTouch>
        </Animated.View>
      )}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  greetingText: {
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  nameText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 26,
    color: '#FF2A54',
    fontWeight: '800',
    marginTop: 1,
    letterSpacing: -0.3,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillText: {
    color: '#111827',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    marginLeft: 4,
  },
  eventPill: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  leaderboardBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
