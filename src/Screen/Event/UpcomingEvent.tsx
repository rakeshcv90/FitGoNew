import {
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import ShadowCard from '../../Component/Utilities/ShadowCard';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {useDispatch, useSelector} from 'react-redux';
import FitIcon from '../../Component/Utilities/FitIcon';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {Path, Svg} from 'react-native-svg';
import {ShadowStyle} from '../../Component/Utilities/ShadowStyle';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import {
  setCustomWorkoutData,
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setOfferAgreement,
  setPlanType,
  setPurchaseHistory,
  setUserProfileData,
} from '../../Component/ThemeRedux/Actions';
import {EnteringEventFunction} from './EnteringEventFunction';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';
import TrackPlayer, {
  Capability,
  usePlaybackState,
} from 'react-native-track-player';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CountryCurrencies} from '../../Component/Utilities/CountryCurrencies';

const UpcomingEvent = ({navigation, route}: any) => {
  const {eventType} = route?.params;
  const playbackState = usePlaybackState();

  const songs = [
    {
      id: 1,
      url: require('../../Icon/Images/Subs_sound.wav'),
    },
  ];
  // let eventType = 'upcoming';
  const dispatch = useDispatch();
  const enteredUpcomingEvent = useSelector(
    (state: any) => state.enteredUpcomingEvent,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getOfferAgreement = useSelector(
    (state: any) => state.getOfferAgreement,
  );
  const [openChange, setOpenChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const PlanPurchasetoBackendAPI = async () => {
    setLoading(true);
    const data = {
      user_id: getUserDataDetails.id,
      plan: getPurchaseHistory?.plan,
      transaction_id: getPurchaseHistory?.transaction_id,
      platform: Platform.OS,
      product_id: getPurchaseHistory?.product_id,
      plan_value: getPurchaseHistory?.plan_value,
    };
    try {
      const res = await axios(`${NewAppapi.EVENT_SUBSCRIPTION_POST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });
      AnalyticsConsole('JO_UP_EVENT');
      StartAudio(playbackState);
      if (res.data.message == 'Event created successfully') {
        PauseAudio(playbackState);
        getUserDetailData();
      } else if (
        res.data.message == 'Plan upgraded and new event created successfully'
      ) {
        PauseAudio(playbackState);
        getUserDetailData();
      } else if (
        res.data.message ==
        'Plan upgraded and existing subscription updated successfully'
      ) {
        PauseAudio(playbackState);
        getUserDetailData();
      } else if (
        res.data.message == 'Subscription usage updated successfully'
      ) {
        PauseAudio(playbackState);
        getUserDetailData();
      } else if (
        res.data.message ==
        'You have reached the maximum usage for your current subscription. Please upgrade to a higher plan.'
      ) {
        setLoading(false);
        showMessage({
          message:
            'You have reached the maximum usage for your current subscription. Please upgrade to a higher plan.',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      } else {
        setLoading(false);
        showMessage({
          message: 'Some Issue In Purchase Data!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    setupPlayer();
  }, []);
  const setupPlayer = async () => {
    try {
      await TrackPlayer.add(songs);
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    } catch (error) {
      console.log('Music Player Error  UpcomingEvent', error);
    }
  };
  const StartAudio = async (playbackState: any) => {
    await TrackPlayer.play();
  };
  const PauseAudio = async (playbackState: any) => {
    await TrackPlayer.reset();
  };

  const getUserDetailData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.ALL_USER_DETAILS}?version=${VersionNumber.appVersion}&user_id=${getUserDataDetails?.id}`,
      );

      if (
        responseData?.data?.msg ==
        'Please update the app to the latest version.'
      ) {
        showMessage({
          message: responseData?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        dispatch(setCustomWorkoutData(responseData?.data?.workout_data));
        dispatch(setOfferAgreement(responseData?.data?.additional_data));
        dispatch(setUserProfileData(responseData?.data?.profile));
        if (responseData?.data.event_details == 'Not any subscription') {
          setLoading(false);
          setRefresh(false);
          dispatch(setPurchaseHistory([]));
        } else {
          setRefresh(false);
          dispatch(setPurchaseHistory(responseData?.data.event_details));
          EnteringEventFunction(
            dispatch,
            responseData?.data.event_details,
            setEnteredCurrentEvent,
            setEnteredUpcomingEvent,
            setPlanType,
          );
          setLoading(false);
        }
      }
    } catch (error) {
      console.log('GET-USER-DATA', error);

      setRefresh(false);
      setLoading(false);
      console.log(error);
    }
  };

  const ChangeModal = () => {
    return (
      <Modal visible={openChange} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0000001B',
          }}>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: AppColor.WHITE,
              padding: 10,
              width: DeviceWidth * 0.9,
            }}>
            <FitIcon
              name="close"
              size={14}
              type="MaterialCommunityIcons"
              onPress={() => setOpenChange(false)}
              style={{alignSelf: 'flex-end'}}
            />
            <View style={{alignItems: 'center'}}>
              <Image
                source={localImage.ChangePlan}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: 'center',
                  marginBottom: 10,
                }}
              />
              {getPurchaseHistory?.used_plan ==
                getPurchaseHistory?.allow_usage && (
                <FitText
                  type="Heading"
                  value="Gear Up for Your Next Challenge!"
                  fontSize={18}
                  lineHeight={24}
                  marginVertical={5}
                />
              )}
              <FitText
                type="normal"
                value={
                  getPurchaseHistory?.used_plan <=
                  getPurchaseHistory?.allow_usage
                    ? 'Every week is a new opportunity. Gear up for your next challenge!'
                    : `You want to change your${'\n'} current plan`
                  // ? `You have ${
                  //     getPurchaseHistory?.allow_usage -
                  //     getPurchaseHistory?.used_plan
                  //   } limit left. Please use them${'\n'} before Purchase new Plan`
                }
                textAlign="center"
                fontSize={16}
                lineHeight={24}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
              <TouchableOpacity
                onPress={() => {
                  AnalyticsConsole('CH_PLAN_BTN');
                  setOpenChange(false);
                  if (
                    getPurchaseHistory?.used_plan ==
                    getPurchaseHistory?.allow_usage
                  )
                    navigation.navigate('NewSubscription');
                }}
                style={{
                  width: DeviceWidth * 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: AppColor.NEW_DARK_RED,
                  paddingVertical: 10,
                  marginVertical: 20,
                }}>
                <FitText
                  type="normal"
                  value={
                    getPurchaseHistory?.used_plan <=
                    getPurchaseHistory?.allow_usage
                      ? 'OK'
                      : 'Yes'
                  }
                  color={AppColor.WHITE}
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const dayLeft =
    getPurchaseHistory?.upcoming_day_status == 1 &&
    getPurchaseHistory?.event_start_date_upcoming != null
      ? getPurchaseHistory?.event_start_date_upcoming
      : getPurchaseHistory?.event_start_date_current;

  const currency =
    getOfferAgreement?.location != ''
      ? CountryCurrencies[getOfferAgreement?.location]
      : '';

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <Wrapper>
        <NewHeader1
          backButton
          header={
            eventType == 'upcoming' ? 'Upcoming Challenge' : 'My Challenge'
          }
          onBackPress={() => navigation?.navigate('BottomTab')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: 16, flex: 1, zIndex: -1}}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={getUserDetailData}
              colors={[AppColor.NEW_DARK_RED, AppColor.NEW_DARK_RED]}
            />
          }>
          <ShadowCard
            shadow
            mV={DeviceHeigth * 0.02}
            pV={DeviceWidth * 0.05}
            justifyContent={'space-between'}>
            <View
              style={[
                styles.row,
                {
                  marginBottom: 10,
                  width: '100%',
                },
              ]}>
              <FitText
                value={`Hi ${getUserDataDetails?.name}`}
                type="SubHeading"
                color="#1E1E1E"
                fontWeight="600"
                fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
              />
              {eventType == 'current' && (
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#F380291A',
                    padding: 5,
                    borderRadius: 5,
                    flexDirection: 'row',
                  }}>
                  <FitIcon
                    name="clock-outline"
                    size={14}
                    type="MaterialCommunityIcons"
                    color={AppColor.ORANGE}
                    mR={5}
                  />
                  <FitText
                    type="SubHeading"
                    value={
                      getPurchaseHistory?.upcoming_day_status == 1
                        ? `${moment(dayLeft).diff(
                            moment()
                              .day(getPurchaseHistory?.currentDay)
                              .format('YYYY-MM-DD'),
                            'days',
                          )} days left`
                        : `${moment(dayLeft)
                            .add(7, 'days')
                            .diff(
                              moment()
                                .day(getPurchaseHistory?.currentDay)
                                .format('YYYY-MM-DD'),
                              'days',
                            )} days left`
                    }
                    color={AppColor.ORANGE}
                    fontSize={14}
                    lineHeight={18}
                    fontWeight="600"
                    fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                  />
                </View>
              )}
            </View>
            <View
              style={[
                styles.row,
                {
                  marginBottom: 10,
                  alignSelf: 'flex-start',
                },
              ]}>
              <FitIcon
                name="calendar-month-outline"
                size={25}
                type="MaterialCommunityIcons"
                color="#333333"
                mR={5}
              />
              <View
                style={{
                  justifyContent: 'center',
                  // alignItems: 'center',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <FitText
                  value={'Starts on:'}
                  type="normal"
                  color="#1E1E1E"
                  fontWeight="600"
                  fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                />
                <FitText
                  value={
                    getPurchaseHistory?.upcoming_day_status == 1
                      ? `${moment(dayLeft).format('DD-MMM-YYYY')} | Monday`
                      : `${moment(dayLeft)
                          .add(7, 'days')
                          .format('DD-MMM-YYYY')} | Monday`
                  }
                  type="normal"
                  color="#1E1E1E"
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                />
              </View>
            </View>
            <LinearGradient
              colors={['#ffffff', '#F8E7EA']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.row,
                {
                  justifyContent: 'center',
                  width: '100%',
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 10,
                },
              ]}>
              <Image
                source={require('../../Icon/Images/NewHome/gift.png')}
                style={{height: 60, width: 60}}
                resizeMode="contain"
              />
              {/* {getOfferAgreement?.location == 'India' ? (
                <View style={{marginLeft: 10}}>
                  <FitText type="normal" value="Winning price upto" />
                  <FitText type="Heading" value="₹1000/-" />
                </View>
              ) : ( */}
              <View style={{marginLeft: 10}}>
                <FitText type="Heading" value="Win Voucher" fontSize={18} />
                <FitText type="normal" value="Earn the amazing price" />
              </View>
            </LinearGradient>
            <FitText
              type="SubHeading"
              value={
                eventType == 'upcoming'
                  ? 'Gear Up for Your Next Challenge!'
                  : 'Your challenge will start on Monday'
              }
              fontStyle="italic"
              fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
              fontWeight="700"
              fontSize={14}
            />
            <FitText
              type="normal"
              value={
                eventType == 'upcoming'
                  ? 'Every week is a new opportunity. Gear up for your next challenge!'
                  : `You can do the exercise using our App until the challenge begins.`
              }
              textAlign="center"
              color="#333333"
              fontFamily={Fonts.MONTSERRAT_MEDIUM}
              fontWeight="600"
            />
            <FitText
              type="normal"
              value="Note: You will receive the prize as a voucher."
              textAlign="center"
              color={AppColor.NEW_GREY_TEXT}
              fontFamily={Fonts.MONTSERRAT_MEDIUM}
              fontWeight="600"
            />
            <View style={{height: 20,}} />
            {getPurchaseHistory?.plan != 'noob' && (
              <FitText
                type="normal"
                value={`Allow chance `}
                // fontSize={12}
                textAlign="center"
                color={AppColor.NEW_GREY}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
                fontWeight="600">
                <FitText
                  type="normal"
                  value={`${getPurchaseHistory?.used_plan}/${getPurchaseHistory?.allow_usage}`}
                  textAlign="center"
                  color={AppColor.BLACK}
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  fontWeight="600"
                />
              </FitText>
            )}

            {getPurchaseHistory?.plan != null &&
            getPurchaseHistory?.used_plan < getPurchaseHistory?.allow_usage &&
            eventType == 'upcoming' &&
            getPurchaseHistory?.upcoming_day_status != 1 ? (
              <TouchableOpacity
                onPress={PlanPurchasetoBackendAPI}
                style={{
                  width: DeviceWidth * 0.8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: AppColor.RED,
                  paddingVertical: 12,
                  marginBottom: 20,
                  marginTop: 10,
                }}>
                <FitText
                  type="normal"
                  value="Join Now"
                  color={AppColor.WHITE}
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                />
              </TouchableOpacity>
            ) : getPurchaseHistory?.plan != null &&
              getPurchaseHistory?.upcoming_day_status != 1 ? (
              getPurchaseHistory?.used_plan ==
              getPurchaseHistory?.allow_usage ? (
                <FitText
                  type="normal"
                  value="You've reached your limit to join the challenge. Upgrade your plan to join the new challenge"
                  textAlign="center"
                  color="#333333"
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                  fontWeight="600"
                  marginVertical={10}
                />
              ) : null
            ) : null}
          </ShadowCard>
          {getPurchaseHistory?.plan != null && (
            <>
              <FitText
                value="Your Plan"
                type="SubHeading"
                fontFamily={Fonts.MONTSERRAT_BOLD}
                fontSize={18}
              />
              <ShadowCard
                shadow
                mV={DeviceHeigth * 0.02}
                alignItems={'flex-start'}
                bColor={
                  getPurchaseHistory?.plan == 'noob'
                    ? AppColor.SUBS_BLUE
                    : getPurchaseHistory?.plan == 'pro'
                    ? AppColor.SUBS_GREEN
                    : AppColor.ORANGE
                }>
                <FitText
                  type="SubHeading"
                  errorType
                  fontSize={18}
                  lineHeight={24}
                  value={
                    getPurchaseHistory?.plan == 'noob'
                      ? 'Basic Plan'
                      : getPurchaseHistory?.plan == 'pro'
                      ? 'Medium Plan'
                      : 'Premium Plan'
                  }
                  marginVertical={5}
                  color={
                    getPurchaseHistory?.plan == 'noob'
                      ? AppColor.SUBS_BLUE
                      : getPurchaseHistory?.plan == 'pro'
                      ? AppColor.SUBS_GREEN
                      : AppColor.ORANGE
                  }
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <FitText
                    type="Heading"
                    value={`${currency}${getPurchaseHistory?.plan_value}/month`}
                    fontSize={28}
                    lineHeight={34}
                    marginVertical={5}
                  />
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#0A684733',
                      padding: 5,
                      paddingVertical: 2,
                      borderRadius: 5,
                    }}>
                    <FitText
                      type="normal"
                      value="Active"
                      color={AppColor.GREEN}
                      fontSize={12}
                      lineHeight={16}
                      fontWeight="600"
                      fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                    />
                  </View>
                </View>
                <Text
                  numberOfLines={1}
                  style={{color: '#3333331A'}}
                  ellipsizeMode="clip">
                  {Array(100).fill('- ')}
                </Text>
                {/* {getPurchaseHistory?.plan != 'noob' &&
                  getPurchaseHistory?.plan != 'pro' &&
                  !PLATFORM_IOS && (
                    <View style={styles.row}>
                      <FitIcon
                        name="check"
                        mR={5}
                        size={13}
                        type="MaterialCommunityIcons"
                        color={
                          getPurchaseHistory?.plan == 'noob'
                            ? AppColor.SUBS_BLUE
                            : getPurchaseHistory?.plan == 'pro'
                            ? AppColor.SUBS_GREEN
                            : AppColor.ORANGE
                        }
                      />
                      <FitText
                        type="normal"
                        value="3 days free trial"
                        color="#333333E5"
                        marginVertical={3}
                      />
                    </View>
                  )} */}
                <View style={styles.row}>
                  <FitIcon
                    color={
                      getPurchaseHistory?.plan == 'noob'
                        ? AppColor.SUBS_BLUE
                        : getPurchaseHistory?.plan == 'pro'
                        ? AppColor.SUBS_GREEN
                        : AppColor.ORANGE
                    }
                    name="check"
                    mR={5}
                    size={13}
                    type="MaterialCommunityIcons"
                  />
                  <FitText
                    type="normal"
                    value="Unlock 150+ Exercises"
                    color="#333333E5"
                    marginVertical={3}
                  />
                </View>
                <View style={styles.row}>
                  <FitIcon
                    color={
                      getPurchaseHistory?.plan == 'noob'
                        ? AppColor.SUBS_BLUE
                        : getPurchaseHistory?.plan == 'pro'
                        ? AppColor.SUBS_GREEN
                        : AppColor.ORANGE
                    }
                    name="check"
                    mR={5}
                    size={13}
                    type="MaterialCommunityIcons"
                  />
                  <FitText
                    type="normal"
                    value={
                      getPurchaseHistory?.plan == 'noob'
                        ? '1 event/month'
                        : getPurchaseHistory?.plan == 'pro'
                        ? '2 events/month'
                        : '3 events/month'
                    }
                    color="#333333E5"
                    marginVertical={3}
                  />
                </View>
                <View style={styles.row}>
                  <FitIcon
                    color={
                      getPurchaseHistory?.plan == 'noob'
                        ? AppColor.SUBS_BLUE
                        : getPurchaseHistory?.plan == 'pro'
                        ? AppColor.SUBS_GREEN
                        : AppColor.ORANGE
                    }
                    name="check"
                    mR={5}
                    size={13}
                    type="MaterialCommunityIcons"
                  />
                  <FitText
                    type="normal"
                    value={
                      getPurchaseHistory?.plan == 'noob'
                        ? 'With Ads'
                        : getPurchaseHistory?.plan == 'pro'
                        ? 'Fewer Ads'
                        : 'Fewer Ads'
                    }
                    color="#333333E5"
                    marginVertical={3}
                  />
                </View>
              </ShadowCard>
            </>
          )}
        </ScrollView>
        {getPurchaseHistory?.plan_value != null && (
          <View
            style={{
              ...ShadowStyle,
              width: DeviceWidth,
              backgroundColor: AppColor.WHITE,
              justifyContent: 'center',
              alignItems: 'center',
              height:
                getPurchaseHistory?.plan != 'premium'
                  ? DeviceWidth / 3
                  : DeviceWidth / 6,
              borderTopColor: '#00000024',
              borderTopWidth: 0.5,
            }}>
            {getPurchaseHistory?.plan != 'premium' && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('NewSubscription', {upgrade: true})
                }
                style={{
                  width: DeviceWidth * 0.9,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: AppColor.RED,
                  paddingVertical: 10,
                }}>
                <FitText
                  type="normal"
                  value="Upgrade Plan"
                  color={AppColor.RED}
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                AnalyticsConsole(`CanP_BTN`);
                PLATFORM_IOS
                  ? Linking.openSettings()
                  : Linking.openURL(
                      'https://play.google.com/store/account/subscriptions',
                    );
              }}
              style={{
                width: DeviceWidth * 0.9,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <FitText
                type="normal"
                value="Cancel Plan"
                color={AppColor.RED}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
            </TouchableOpacity>
          </View>
        )}
      </Wrapper>
      <ChangeModal />
      <ActivityLoader visible={loading} />
    </SafeAreaView>
  );
};

export default UpcomingEvent;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
