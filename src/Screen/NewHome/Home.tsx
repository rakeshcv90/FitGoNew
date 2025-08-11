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
import BannerAd from '../../Component/NativeCodeAds/BannerAdView';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {API_CALLS} from '../../API/API_CALLS';
import Progress from './Progress';
import {Trophy} from '../../Icon/Trophy';
import FitIcon from '../../Component/Utilities/FitIcon';
import FitButton from '../../Component/Utilities/FitButton';
import AdEventPopup from './AdEventPopup';
import OfferAnimation from './OfferAnimation';
import {AppleHealthKitData} from '../../Component/TransferStepCounterData';
import {hasFreeEvent} from '../Event/EnteringEventFunction';
import {translate, getCurrentLanguage} from '../Translation/TranslationService';
const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getPastWinners = useSelector((state: any) => state?.getPastWinners);
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const lang = getCurrentLanguage();

  useEffect(() => {
    API_CALLS.getLeaderboardData(getUserDataDetails?.id, setLeaderboardData);
    API_CALLS.getReferralCode(getUserDataDetails?.id, setReferralCode);
    API_CALLS.getSubscriptionDetails(getUserDataDetails?.id, lang);
    API_CALLS.getAllExercisesData(getUserDataDetails?.id, lang);
    AppleHealthKitData();
  }, [loader]);
  useEffect(() => {
    if (getPurchaseHistory && hasFreeEvent(getPurchaseHistory)) {
      setTimeout(() => {
        console.log('Modal visible');
        setModalVisible(true);
      }, 3000);
    }
  }, [getPurchaseHistory]);
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
        {/* <BannerAd
          style={{width: '100%', height: 50}} // Ensure height and width are specified
        /> */}
        <View style={styles.whiteBox}>
          <Progress myPlans={false} />
        </View>

        {getPastWinners && getPastWinners.length > 0 && (
          <PastWinnersComponent pastWinners={getPastWinners} />
        )}
        <UserEspecially />
        <FocuseMind />
        {enteredCurrentEvent && (
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
                value={translate('inviteFriendVoucher')}
                color={AppColor.PrimaryTextColor}
              />
              <FitText
                type="normal"
                value={translate('copyReferralCode')}
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
                titleText={translate('invite')}
                textColor={AppColor.WHITE}
                w={'half'}
                padV={7}
                style={{alignSelf: 'flex-start'}}
              />
            </View>
            <Image
              source={require('./InviteImage.png')}
              style={{width: '50%', bottom: 0}}
              resizeMode="contain"
            />
          </View>
        )}
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
      <AdEventPopup
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
