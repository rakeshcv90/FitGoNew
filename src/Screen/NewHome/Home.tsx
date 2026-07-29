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
import {FadeSlideIn} from '../Introduction/IntroAnimations';
import DraggableChatButton from './DraggableChatButton';

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
        setModalVisible(true);
      }, 3000);
    }
  }, [getPurchaseHistory]);

  setDefaultAlarm();

  return (
    <Wrapper styles={{backgroundColor: '#f7f7f7'}}>
      <StatusBar backgroundColor={AppColor.WHITE} barStyle={'dark-content'} />

      <FadeSlideIn delay={50} distance={-10}>
        <HomeHeader leaderboardData={leaderboardData} />
      </FadeSlideIn>

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
        {enteredCurrentEvent && (
          <FadeSlideIn delay={150} distance={15}>
            <OfferAnimation />
          </FadeSlideIn>
        )}

        <FadeSlideIn delay={200} distance={15}>
          <NativeAdBanner loader={loader} />
        </FadeSlideIn>

        <FadeSlideIn delay={280} distance={20}>
          <View style={styles.whiteBox}>
            <Progress myPlans={false} />
          </View>
        </FadeSlideIn>

        {getPastWinners && getPastWinners.length > 0 && (
          <FadeSlideIn delay={360} distance={20}>
            <PastWinnersComponent pastWinners={getPastWinners} />
          </FadeSlideIn>
        )}

        <FadeSlideIn delay={440} distance={20}>
          <UserEspecially />
        </FadeSlideIn>

        <FadeSlideIn delay={520} distance={20}>
          <FocuseMind />
        </FadeSlideIn>

        {enteredCurrentEvent && (
          <FadeSlideIn delay={600} distance={20}>
            <View
              style={[
                PredefinedStyles.rowBetween,
                styles.whiteBox,
                {paddingVertical: 0},
              ]}>
              <View
                style={{
                  width: '50%',
                  alignItems: 'flex-start',
                  paddingLeft: 20,
                }}>
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
          </FadeSlideIn>
        )}
      </ScrollView>

      <DraggableChatButton
        onPress={() => {
          AnalyticsConsole(`AI_TRAINER_BUTTON`);
          navigate('AITrainer');
        }}
      />

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
  },
  whiteBox: {
    padding: 12,
    backgroundColor: AppColor.WHITE,
    marginVertical: 8,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chatWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 12,
  },
  chat: {
    width: 56,
    height: 56,
    backgroundColor: AppColor.WHITE,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: AppColor.RED,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
