import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {localImage} from '../../Component/Image';
import {useSelector} from 'react-redux';

const LeaderBoardTopComponent = ({data = [], totalData = [], listData = []}) => {
  const user1BarHeight = useSharedValue(0);
  const user2BarHeight = useSharedValue(0);
  const user3BarHeight = useSharedValue(0);
  const rankOffset = useSharedValue(-15);
  const rankOpacity = useSharedValue(0);

  const getUserDataDetails = useSelector((state: any) => state?.getUserDataDetails);

  useEffect(() => {
    const timer = setTimeout(() => {
      increaseBarHeight();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const increaseBarHeight = () => {
    // 2nd Place (Left)
    user1BarHeight.value = withTiming(DeviceHeigth * 0.16, {duration: 1200});
    // 1st Place (Center)
    user2BarHeight.value = withTiming(DeviceHeigth * 0.22, {duration: 1200}, () => {
      rankOffset.value = withSpring(0, {damping: 12});
      rankOpacity.value = withTiming(1, {duration: 600});
    });
    // 3rd Place (Right)
    user3BarHeight.value = withTiming(DeviceHeigth * 0.12, {duration: 1200});
  };

  const animatedStyle1 = useAnimatedStyle(() => ({
    height: user1BarHeight.value,
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    height: user2BarHeight.value,
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    height: user3BarHeight.value,
  }));

  const coinsAnimation = useAnimatedStyle(() => ({
    transform: [{translateY: rankOffset.value}],
    opacity: rankOpacity.value,
  }));

  // Safe Rank Suffix Formatter
  const getRankSuffix = (rankNum, defaultRank) => {
    const num = rankNum || defaultRank;
    if (num === 1) return '1st';
    if (num === 2) return '2nd';
    if (num === 3) return '3rd';
    return `${num}th`;
  };

  const LeaderBoardList = ({item}) => {
    if (!item) return null;
    const isMe = getUserDataDetails?.id === item?.id;

    return (
      <View
        style={[
          styles.listContainer,
          isMe ? styles.myListContainer : styles.normalListContainer,
        ]}>
        <View style={styles.listLeft}>
          <View
            style={[
              styles.rankBadge,
              isMe ? styles.myRankBadge : styles.normalRankBadge,
            ]}>
            <Text
              style={[
                styles.rankBadgeText,
                isMe ? {color: '#FF2A54'} : {color: '#4B5563'},
              ]}>
              #{item?.rank}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.listName,
              {color: isMe ? '#FFFFFF' : '#111827'},
            ]}>
            {item?.name || 'Anonymous User'}
          </Text>
        </View>

        <View style={styles.listCoin}>
          <Image
            source={localImage.FitCoin}
            style={{height: 24, width: 24, marginRight: 6}}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.coinValueText,
              {color: isMe ? '#FFFFFF' : '#111827'},
            ]}>
            {item?.fit_coins > 0 ? item?.fit_coins : 0} FC
          </Text>
        </View>
      </View>
    );
  };

  const BarComponent = ({
    animationStyle,
    barGradient,
    itemData,
    defaultRank,
    badgeColor,
    borderColor,
  }) => {
    const hasData = itemData && itemData.name;
    const rankLabel = getRankSuffix(itemData?.rank, defaultRank);
    const initial = hasData ? itemData.name.trim().charAt(0).toUpperCase() : '—';
    const displayName = hasData ? itemData.name.split(' ')[0] : '—';
    const coinsVal = hasData && itemData.fit_coins != null ? itemData.fit_coins : 0;

    return (
      <View style={styles.barContainer}>
        <View style={styles.outerView}>
          {/* Top User Info & Avatar */}
          <View style={styles.avatarSection}>
            {/* Rank Crown/Badge */}
            <View style={[styles.crownBadge, {backgroundColor: badgeColor}]}>
              <Text style={styles.crownBadgeText}>
                {defaultRank === 1 ? '👑 1st' : defaultRank === 2 ? '🥈 2nd' : '🥉 3rd'}
              </Text>
            </View>

            {hasData && itemData?.image_path ? (
              <Image
                defaultSource={localImage.avt}
                source={{uri: itemData.image_path}}
                style={[styles.avatarImg, {borderColor}]}
              />
            ) : (
              <View style={[styles.avatarCircle, {borderColor}]}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}

            <Text numberOfLines={1} style={styles.userName}>
              {displayName}
            </Text>
          </View>

          {/* Animated Podium Bar */}
          <Animated.View style={[styles.bar, animationStyle]}>
            <LinearGradient
              colors={barGradient}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.gradientBar}>
              <Animated.View style={[styles.gradientWrapper, coinsAnimation]}>
                <Text style={styles.podiumRankText}>{rankLabel}</Text>
                <View style={styles.coinPill}>
                  <Image
                    source={localImage.FitCoin}
                    style={{width: 16, height: 16}}
                    resizeMode="contain"
                  />
                  <Text style={styles.coinPillText}>{coinsVal}</Text>
                </View>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 3D Podium Container */}
      <View style={styles.podiumCard}>
        <View style={styles.animationWrapper}>
          {/* 2nd Place (Left) */}
          <BarComponent
            animationStyle={animatedStyle1}
            barGradient={['#E2E8F0', '#CBD5E1']}
            itemData={data[1]}
            defaultRank={2}
            badgeColor="#94A3B8"
            borderColor="#94A3B8"
          />
          {/* 1st Place (Center) */}
          <BarComponent
            animationStyle={animatedStyle2}
            barGradient={['#FEF08A', '#F59E0B']}
            itemData={data[0]}
            defaultRank={1}
            badgeColor="#F59E0B"
            borderColor="#F59E0B"
          />
          {/* 3rd Place (Right) */}
          <BarComponent
            animationStyle={animatedStyle3}
            barGradient={['#FFEDD5', '#FB923C']}
            itemData={data[2]}
            defaultRank={3}
            badgeColor="#FB923C"
            borderColor="#FB923C"
          />
        </View>
      </View>

      {/* Other Ranks List */}
      <View style={styles.listSection}>
        {listData && listData.map((item, index) => (
          <LeaderBoardList key={index} item={item} />
        ))}
        {totalData && totalData.map((item, index) => (
          <LeaderBoardList key={`total-${index}`} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.94,
    alignSelf: 'center',
    marginVertical: 10,
  },

  // ── Podium Card ────────────────────────────────────
  podiumCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  animationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  barContainer: {
    height: DeviceHeigth * 0.38,
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  outerView: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarSection: {
    marginBottom: 10,
    alignItems: 'center',
  },
  crownBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  crownBadgeText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    marginBottom: 6,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarInitial: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
  },
  userName: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    maxWidth: DeviceWidth / 3.6,
    textAlign: 'center',
  },
  bar: {
    width: DeviceWidth / 3.5,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  gradientBar: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 14,
  },
  gradientWrapper: {
    alignItems: 'center',
  },
  podiumRankText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  coinPillText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },

  // ── List Items Section ──────────────────────────────
  listSection: {
    width: '100%',
  },
  listContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 8,
  },
  normalListContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  myListContainer: {
    backgroundColor: '#FF2A54',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2A54',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalRankBadge: {
    backgroundColor: '#F3F4F6',
  },
  myRankBadge: {
    backgroundColor: '#FFFFFF',
  },
  rankBadgeText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 13,
    fontWeight: '700',
  },
  listName: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  listCoin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinValueText: {
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default React.memo(LeaderBoardTopComponent);
