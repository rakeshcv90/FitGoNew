import {Image, Platform, StyleSheet} from 'react-native';
import {View, Button} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';
import {useEffect} from 'react';
import {Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import {useSelector} from 'react-redux';
const LeaderBoardTopComponent = ({data, totalData, listData}) => {
  const user1BarHeight = useSharedValue(0);
  const user2BarHeight = useSharedValue(0);
  const user3BarHeight = useSharedValue(0);
  const rankOffset = useSharedValue(-20);
  const rankOpacity = useSharedValue(0);
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  useEffect(() => {
    setTimeout(() => {
      increaseBarHeight();
    }, 1000);
  }, []);
  const increaseBarHeight = () => {
    //bar1
    user1BarHeight.value = withTiming(
      DeviceHeigth * 0.17,
      {duration: 2000},
      () => {
        rankOffset.value = withTiming(0, {duration: 1000});
        rankOpacity.value = withTiming(1, {duration: 800});
      },
    );
    //bar2
    user2BarHeight.value = withTiming(DeviceHeigth * 0.22, {duration: 2000});
    //bar3
    user3BarHeight.value = withTiming(DeviceHeigth * 0.12, {duration: 2000});
  };
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      height: user1BarHeight.value,
    };
  });
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      height: user2BarHeight.value,
    };
  });
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      height: user3BarHeight.value,
    };
  });
  const coinsAnimation = useAnimatedStyle(() => ({
    transform: [{translateY: rankOffset.value}],
    opacity: rankOpacity.value,
  }));
  const LeaderBoardList = ({item}) => {
    const myId = getUserDataDetails?.id == item?.id;
    if (item && item?.length <= 0) return;
    return (
      <View
        style={[
          styles.listContainer,
          {
            backgroundColor: myId ? AppColor.RED : AppColor.WHITE,
          },
        ]}>
        <View style={[styles.list, {}]}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: Fonts.HELVETICA_BOLD,
              color: myId ? AppColor.WHITE : AppColor.SecondaryTextColor,
            }}>
            {item?.rank}
          </Text>
          <Text
            style={{
              top: -2,
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 12,
              color: myId ? AppColor.WHITE : AppColor.SecondaryTextColor,
            }}>
            th
          </Text>
          <Text
            style={[
              styles.listName,
              {color: myId ? AppColor.WHITE : AppColor.SecondaryTextColor},
            ]}>
            {item?.name}
          </Text>
        </View>
        <View style={styles.listCoin}>
          <Image
            source={localImage.FitCoin}
            style={{height: 35, width: 35, marginRight: 16}}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.HELVETICA_BOLD,
              color: myId ? AppColor.WHITE : AppColor.SecondaryTextColor,
            }}>
            {item?.fit_coins > 0 ? item?.fit_coins : 0}
          </Text>
        </View>
      </View>
    );
  };
  const BarComponent = ({animation1, barColor, data}) => {
    return (
      <View style={styles.barContainer}>
        <View style={[styles.outerView]}>
          <View
            style={[
              {marginBottom: 15, alignSelf: 'center', alignItems: 'center'},
            ]}>
            {data?.image_path != null ? (
              <Image
                defaultSource={localImage.avt}
                source={{uri: data?.image_path}}
                style={styles.Icon}
              />
            ) : (
              <View style={styles.textBackground}>
                <Text
                  style={{
                    color: AppColor.BLACK,
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 25,
                  }}>
                  {data?.name?.substring(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.name,
                {
                  fontFamily:
                    data?.rank == 1
                      ? Fonts.HELVETICA_BOLD
                      : Fonts.HELVETICA_REGULAR,
                },
              ]}>
              {data?.name?.split(' ')[0]}
            </Text>
          </View>
          <Animated.View
            style={[styles.bar, animation1, {backgroundColor: barColor}]}>
            <Animated.View style={[styles.gradientWrapper, coinsAnimation]}>
              <Text style={styles.rankText}>{`${data?.rank}${
                data?.rank == 1 ? 'st' : data?.rank == 2 ? 'nd' : 'rd'
              }`}</Text>
              <LinearGradient
                start={{x: 0, y: 2}}
                end={{x: 1, y: 0}}
                colors={[AppColor.GOLD2, AppColor.GOLD1]}
                style={styles.gradient}>
                <Image
                  source={localImage.FitCoin}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
                <Text style={styles.coinText}>{data?.fit_coins}</Text>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.animationWrapper}>
        <BarComponent
          animation1={animatedStyle1}
          barColor={AppColor.BAR1COLOR}
          data={data[1]}
        />
        <BarComponent
          animation1={animatedStyle2}
          barColor={AppColor.BAR2COLOR}
          data={data[0]}
        />
        <BarComponent
          animation1={animatedStyle3}
          barColor={AppColor.BAR3COLOR}
          data={data[2]}
        />
      </View>
      {listData.map((item, index) => (
        <LeaderBoardList item={item} />
      ))}
      {totalData &&
        totalData?.map((item, index) => <LeaderBoardList item={item} />)}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    backgroundColor: AppColor.WHITE,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  animationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  barContainer: {
    height: DeviceHeigth * 0.4,
    alignSelf: 'center',
    justifyContent: 'flex-end', // Start the bar from the bottom
    marginHorizontal: 4,
  },
  bar: {
    width: DeviceWidth / 3.4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 25,
  },
  outerView: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    // width: '60%',
    borderWidth: 2.5,
    borderColor: AppColor.GOLD2,
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  coinText: {
    color: AppColor.WHITE,
    fontFamily: Fonts.HELVETICA_BOLD,
    marginLeft: 2,
  },
  rankText: {
    color: AppColor.BLACK,
    marginBottom: 10,
    fontSize: 15,
  },
  gradientWrapper: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 15,
    alignItems: 'center',
  },
  name: {
    color: AppColor.BLACK,
    fontFamily: Fonts.HELVETICA_REGULAR,
  },
  Icon: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 15,
  },
  textBackground: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    width: DeviceWidth * 0.95,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: AppColor.RED,
  },
  listName: {
    marginLeft: 18,
    fontSize: 16,
    fontFamily: Fonts.HELVETICA_BOLD,
  },
  listCoin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default LeaderBoardTopComponent;
