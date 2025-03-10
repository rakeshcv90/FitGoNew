import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import {useSelector} from 'react-redux';
import setDefaultAlarm from '../../Component/Utilities/setDefaultAlarm';
import PredefinedStyles from '../../Component/Utilities/PredefineStyles';
import HomeHeader from './HomeHeader';
import UserEspecially from '../../Component/NewHomeUtilities/UserEspecially';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import FocuseMind from '../../Component/NewHomeUtilities/FocuseMind';
import NativeAdBanner from './NativeAdBanner';
import PastWinnersComponent from '../Leaderboard/PastWinnersComponent';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import FitText from '../../Component/Utilities/FitText';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {API_CALLS} from '../../API/API_CALLS';
import Progress from './Progress';
import {Trophy} from '../../Icon/Trophy';
import FitIcon from '../../Component/Utilities/FitIcon';
import FitButton from '../../Component/Utilities/FitButton';
import AdEventPopup from './AdEventPopup';
import OfferAnimation from './OfferAnimation';
import {AppleHealthKitData} from '../../Component/TransferStepCounterData';

const Home = () => {
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPastWinners = useSelector((state: any) => state?.getPastWinners);
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const enteredUpcomingEvent = useSelector(
    (state: any) => state?.enteredUpcomingEvent,
  );
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    API_CALLS.getLeaderboardData(getUserDataDetails?.id, setLeaderboardData);
    API_CALLS.getReferralCode(getUserDataDetails?.id, setReferralCode);
    API_CALLS.getSubscriptionDetails(getUserDataDetails?.id);
    AppleHealthKitData();
  }, [loader]);

  setDefaultAlarm();
  return (
    <Wrapper styles={{backgroundColor: '#f7f7f7'}}>
      <StatusBar backgroundColor={AppColor.WHITE} barStyle={'dark-content'} />
      <HomeHeader leaderboardData={leaderboardData} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loader}
            onRefresh={() => {
              setLoader(true);
              setTimeout(() => {
                setLoader(false);
              }, 2000);
            }}
            colors={[AppColor.RED, AppColor.RED]}
          />
        }>
        {enteredCurrentEvent && <OfferAnimation />}
        <NativeAdBanner loader={loader} />
        <View style={styles.whiteBox}>
          <Progress myPlans={false} />
        </View>
        <PastWinnersComponent pastWinners={getPastWinners} />
        <UserEspecially />
        <FocuseMind />
        <View
          style={[
            PredefinedStyles.rowBetween,
            styles.whiteBox,
            {paddingVertical: 0},
          ]}>
          <View
            style={{width: '50%', alignItems: 'flex-start', paddingLeft: 20}}>
            <FitText
              type="SubHeading"
              fontWeight="700"
              value="Invite friend to get amazing voucher"
              color={AppColor.PrimaryTextColor}
            />
            <FitText
              type="normal"
              value="Copy your refer code"
              color={AppColor.SecondaryTextColor}
            />
            <FitText
              type="normal"
              fontWeight="700"
              value={referralCode}
              color={AppColor.PrimaryTextColor}
            />
            <FitButton
              onPress={() => navigate('Referral')}
              titleText={'Invite'}
              textColor={AppColor.WHITE}
              w={'half'}
              padV={7}
            />
          </View>
          <Image
            source={require('./InviteImage.png')}
            style={{width: '50%', bottom: 0}}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          AnalyticsConsole(`AI_TRAINER_BUTTON`);
          navigate('AITrainer');
        }}
        style={styles.chat}>
        <FitIcon
          name="chat-processing"
          size={30}
          type="MaterialCommunityIcons"
          color={AppColor.RED}
        />
      </TouchableOpacity>
      <AdEventPopup />
    </Wrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  imageView: {
    height: 40,
    width: 40,
    borderWidth: 1.5,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#000000E5',
    borderColor: AppColor.WHITE,
    // top: PLATFORM_IOS ? 5 : 13,
  },
  whiteBox: {
    padding: 10,
    backgroundColor: AppColor.WHITE,
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  chat: {
    width: 56,
    height: 56,
    backgroundColor: '#F7F7F7',
    position: 'absolute',
    bottom: 20,
    right: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 1)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
