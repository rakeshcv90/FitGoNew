import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import {Image} from 'react-native';
import {useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AppColor, Fonts} from '../../Component/Color';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import FitIcon, {FitIconTypes} from '../../Component/Utilities/FitIcon';
import FitText from '../../Component/Utilities/FitText';
import moment from 'moment';
import {DeviceWidth} from '../../Component/Config';

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
  const enteredUpcomingEvent = useSelector(
    (state: any) => state?.enteredUpcomingEvent,
  );
  const fitCoins = useSelector((state: any) => state.fitCoins);

  const Sat =
    getPurchaseHistory?.currentDay && getPurchaseHistory?.currentDay == 6;
  const Sun =
    getPurchaseHistory?.currentDay && getPurchaseHistory?.currentDay == 0;
  const dayLeft =
    getPurchaseHistory?.upcoming_day_status == 1 &&
    getPurchaseHistory?.event_start_date_upcoming != null
      ? getPurchaseHistory?.event_start_date_upcoming
      : getPurchaseHistory?.event_start_date_current;



  const myRank =
    leaderboardData &&
    leaderboardData.filter(item => item?.id == getUserDataDetails?.id);

  const currentTime = parseInt(moment().format('HH'));
  const greeting =
    currentTime < 12
      ? 'Good Morning'
      : currentTime > 12 && currentTime < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  const historyIcon: FitIconTypes = {
    name: 'history',
    size: 20,
    type: 'MaterialCommunityIcons',
    color: AppColor.PrimaryTextColor,
    bW: 0,
    bR: 20,
    roundBackground: AppColor.WHITE,
    buttonProps: {
      disabled: (Sat || Sun) == true,
      activeOpacity: 0.6,
    },
    onPress: () => {
      AnalyticsConsole('HB');
      navigate('WorkoutHistory');
    },
  };

  return (
    <View style={[PredefinedStyles.rowBetween, styles.container]}>
      <View style={{width: '45%'}}>
        <FitText type="SubHeading" value={greeting} />
        <FitText
          type="Heading"
          value={
            getUserDataDetails?.name == null
              ? 'Guest'
              : getUserDataDetails?.name.split(' ')[0]
          }
          color={AppColor.RED}
          fontWeight="700"
        />
      </View>
      {enteredCurrentEvent ? (
        <View style={[PredefinedStyles.rowBetween, {width: '50%'}]}>
          <FitIcon {...historyIcon} roundIcon />
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={(Sat || Sun) == true}
            onPress={() => {
              AnalyticsConsole('HB');
              navigate('WorkoutHistory');
            }}
            style={[styles.eventContainer, {marginHorizontal: 5}]}>
            <Image
              source={localImage.FitCoin}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
            <Text style={[styles.cointxt, {color: AppColor.PrimaryTextColor}]}>
              { fitCoins ?? 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={(Sat || Sun) == true}
            onPress={() => {
              AnalyticsConsole('HB');
              navigate('WorkoutHistory');
            }}
            style={styles.eventContainer}>
            <Image
              source={require('./LeaderboardIMG.png')}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
            <Text style={[styles.cointxt, {color: AppColor.PrimaryTextColor}]}>
              {`#${myRank[0]?.rank ?? 0} `}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[PredefinedStyles.rowBetween, {width: '30%'}]}>
          <FitIcon
            {...historyIcon}
            onPress={() => {
              AnalyticsConsole('HB');
              navigate('NewHistory');
            }}
            roundIcon
          />
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={(Sat || Sun) == true}
            onPress={() => {
              AnalyticsConsole('HB');
              navigate('WorkoutHistory');
            }}
            style={styles.normalContainer}>
            <Image
              source={require('./LeaderboardIMG.png')}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingVertical: 20,
    backgroundColor: AppColor.Background_New,
  },
  cointxt: {
    color: '#1E40AF',
    fontSize: 16,
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontWeight: '600',
    lineHeight: 30,
    // marginTop: 5,
    marginLeft: 5,
  },
  eventContainer: {
    width: 60,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: AppColor.WHITE,
  },
  normalContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColor.WHITE,
  },
});
