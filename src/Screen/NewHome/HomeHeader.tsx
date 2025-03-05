import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import {Image} from 'react-native';
import {useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AppColor, Fonts} from '../../Component/Color';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import FitIcon from '../../Component/Utilities/FitIcon';
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

  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  const dayLeft =
    getPurchaseHistory?.upcoming_day_status == 1 &&
    getPurchaseHistory?.event_start_date_upcoming != null
      ? getPurchaseHistory?.event_start_date_upcoming
      : getPurchaseHistory?.event_start_date_current;

  const totalDaysLeft =
    getPurchaseHistory?.upcoming_day_status == 1
      ? `${moment(dayLeft).diff(
          moment().day(getPurchaseHistory?.currentDay).format('YYYY-MM-DD'),
          'days',
        )} days left`
      : `${moment(dayLeft)
          .add(7, 'days')
          .diff(
            moment().day(getPurchaseHistory?.currentDay).format('YYYY-MM-DD'),
            'days',
          )} days left`;

  const myRank =
    leaderboardData &&
    leaderboardData.filter(item => item?.id == getUserDataDetails?.id);

  return (
    <View style={[PredefinedStyles.rowBetween, styles.container]}>
      <View style={{width: '15%'}}>
        <Image
          source={
            getUserDataDetails.image_path == null
              ? localImage.avt
              : {uri: getUserDataDetails.image_path}
          }
          resizeMode="cover"
          style={{
            width: 40,
            height: 40,
            borderRadius: 80 / 2,
          }}
        />
      </View>
      {enteredUpcomingEvent && !enteredCurrentEvent ? (
        <View>
          <FitText
            type="SubHeading"
            value="Event will start"
            color={AppColor.RED}
            fontWeight="700"
          />
          <View
            style={{
              padding: 5,
              backgroundColor: '#E9ECEF',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <FitText
              type="SubHeading"
              value={totalDaysLeft}
              color={AppColor.PrimaryTextColor}
            />
          </View>
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <FitText
            type="SubHeading"
            value={
              enteredCurrentEvent ? 'Check your rank' : 'Earn amazing rewards'
            }
            color={AppColor.RED}
            fontWeight="700"
          />
          <TouchableOpacity
            onPress={() =>
              enteredCurrentEvent
                ? navigate('Leaderboard')
                : navigate('UpcomingEvent', {eventType: 'upcoming'})
            }
            style={{
              padding: 5,
              width: DeviceWidth / 3,
              backgroundColor: AppColor.RED,
              borderRadius: 20,
              ...PredefinedStyles.rowCenter,
            }}>
            <FitText
              type="SubHeading"
              value={
                enteredCurrentEvent
                  ? `#${myRank[0]?.rank ?? 0} `
                  : 'JOIN EVENT '
              }
              fontWeight="700"
              color={AppColor.WHITE}
            />
            <FitIcon
              type={enteredCurrentEvent ? 'Ionicons' : 'FontAwesome5'}
              name={enteredCurrentEvent ? 'trophy-sharp' : 'crown'}
              size={15}
              color={AppColor.WHITE}
            />
          </TouchableOpacity>
        </View>
      )}
      {enteredCurrentEvent ? (
        <TouchableOpacity
          activeOpacity={0.6}
          disabled={(Sat || Sun) == true}
          onPress={() => {
            AnalyticsConsole('HB');
            navigate('WorkoutHistory');
          }}
          style={{
            width: 70,
            height: 40,
            borderRadius: 6,
            alignItems: 'center',
            flexDirection: 'row',
            // paddingLeft: 10,
            justifyContent: 'center',
            backgroundColor: AppColor.orangeColor,
          }}>
          <Image
            source={localImage.FitCoin}
            style={{height: 20, width: 20}}
            resizeMode="contain"
          />
          <Text style={[styles.cointxt, {color: AppColor.orangeColor1}]}>
            {fitCoins <= 0 ? 0 : fitCoins ?? 0}
          </Text>
        </TouchableOpacity>
      ) : (
        <FitIcon
          name="history"
          size={20}
          type="MaterialCommunityIcons"
          color="#E38100"
          bW={0}
          bR={10}
          roundBackground={AppColor.orangeColor}
          buttonProps={{
            disabled: (Sat || Sun) == true,
            activeOpacity: 0.6,
          }}
          onPress={() => {
            AnalyticsConsole('HB');
            navigate('WorkoutHistory');
          }}
          roundIcon
        />
      )}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingVertical: 20,
    backgroundColor: AppColor.WHITE,
  },
  cointxt: {
    color: '#1E40AF',
    fontSize: 16,
    fontFamily: Fonts.HELVETICA_BOLD,
    lineHeight: 30,
    // marginTop: 5,
    marginHorizontal: 5,
  },
});
