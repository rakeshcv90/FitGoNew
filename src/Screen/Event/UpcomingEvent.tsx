import {
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
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
  setEnteredCurrentEvent,
  setEnteredUpcomingEvent,
  setPlanType,
  setPurchaseHistory,
} from '../../Component/ThemeRedux/Actions';
import {EnteringEventFunction} from './EnteringEventFunction';
import {showMessage} from 'react-native-flash-message';
import ActivityLoader from '../../Component/ActivityLoader';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {AddCountFunction} from '../../Component/Utilities/AddCountFunction';

const UpcomingEvent = ({navigation, route}: any) => {
  const {eventType} = route?.params;
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

      if (res.data.message == 'Event created successfully') {
        PurchaseDetails();
      } else {
        setLoading(false);
        showMessage({
          message: 'Some Issue In Puchase Data!',
          type: 'danger',
          animationDuration: 500,
          floating: true,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('Purchase Store Data Error', error, data);
    }
  };
  const PurchaseDetails = async () => {
    try {
      const result = await axios(
        `${NewAppapi.EVENT_SUBSCRIPTION_GET}/${getUserDataDetails?.id}`,
        // `${NewAppapi.EVENT_SUBSCRIPTION_GET}/7996`,
      );
      console.log(result.data);
      if (result.data?.message == 'Not any subscription') {
        setLoading(false);
        setRefresh(false);
        dispatch(setPurchaseHistory([]));
      } else {
        setRefresh(false);
        dispatch(setPurchaseHistory(result.data.data));
        EnteringEventFunction(
          dispatch,
          result.data?.data,
          setEnteredCurrentEvent,
          setEnteredUpcomingEvent,
          setPlanType,
        );
        setLoading(false);
      }
    } catch (error) {
      setRefresh(false);
      setLoading(false);
      console.log(error);
      dispatch(setPurchaseHistory([]));
    }
  };

  const ChangeModal = () => {
    return (
      <Modal visible={openChange} transparent>
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
  // console.log("MOMENT",moment().day(getPurchaseHistory?.currentDay).format('dddd'))
  console.log(
    'mo',
    getPurchaseHistory,
    eventType,
    // moment().day(getPurchaseHistory?.currentDay).format('YYYY-MM-DD'),
  );

  const dayLeft =
    getPurchaseHistory?.upcoming_day_status == 1 &&
    getPurchaseHistory?.event_start_date_upcoming != null
      ? getPurchaseHistory?.event_start_date_upcoming
      : getPurchaseHistory?.event_start_date_current;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColor.WHITE}}>
      <DietPlanHeader
        header={eventType == 'upcoming' ? 'Upcoming Challenge' : 'My Challenge'}
        h={DeviceWidth * 0.15}
        paddingTop={
          Platform.OS == 'android' ? DeviceHeigth * 0.02 : DeviceHeigth * 0.025
        }
        shadow
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 16, flex: 1, zIndex: -1}}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={PurchaseDetails}
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
            {eventType == 'upcoming' && (
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
                value={'Start on:'}
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
            <Svg width={45} height={45} fill="#F38029" viewBox="0 -960 960 960">
              <Path d="M480-520q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
            </Svg>
            <View style={{marginLeft: 10}}>
              <FitText type="normal" value="Winnning price" />
              <FitText type="Heading" value="₹1,000/-" />
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

          {getPurchaseHistory?.plan != null &&
          getPurchaseHistory?.used_plan < getPurchaseHistory?.allow_usage &&
          eventType == 'upcoming' &&
          getPurchaseHistory?.upcoming_day_status != 1 ? (
            <TouchableOpacity
              onPress={PlanPurchasetoBackendAPI}
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
                value="Join Now"
                color={AppColor.WHITE}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
            </TouchableOpacity>
          ) : getPurchaseHistory?.upcoming_day_status != 1 ? (
            getPurchaseHistory?.used_plan < getPurchaseHistory?.allow_usage ? (
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
        {getPurchaseHistory?.plan_value != null && (
          <>
            <FitText value="Your Plan" type="SubHeading" />
            <ShadowCard
              shadow
              mV={DeviceHeigth * 0.02}
              alignItems={'flex-start'}
              bColor={
                getPurchaseHistory?.plan_value == 30
                  ? AppColor.SUBS_BLUE
                  : getPurchaseHistory?.plan_value == 69
                  ? AppColor.SUBS_GREEN
                  : AppColor.ORANGE
              }>
              <FitText
                type="SubHeading"
                errorType
                fontSize={18}
                lineHeight={24}
                value={
                  getPurchaseHistory?.plan_value == 30
                    ? 'Basic plan'
                    : getPurchaseHistory?.plan_value == 69
                    ? 'Medium plan'
                    : 'Premium plan'
                }
                marginVertical={5}
                color={
                  getPurchaseHistory?.plan_value == 30
                    ? AppColor.SUBS_BLUE
                    : getPurchaseHistory?.plan_value == 69
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
                  value={`₹${getPurchaseHistory?.plan_value}/month`}
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
              <Text numberOfLines={1} style={{color: '#3333331A'}}>
                {Array(100).fill('- ')}
              </Text>
              {getPurchaseHistory?.plan_value != 30 &&
                getPurchaseHistory?.plan_value != 69 &&
                !PLATFORM_IOS && (
                  <View style={styles.row}>
                    <FitIcon
                      name="check"
                      mR={5}
                      size={13}
                      type="MaterialCommunityIcons"
                      color={
                        getPurchaseHistory?.plan_value == 30
                          ? AppColor.SUBS_BLUE
                          : getPurchaseHistory?.plan_value == 69
                          ? AppColor.SUBS_GREEN
                          : AppColor.ORANGE
                      }
                    />
                    <FitText
                      type="normal"
                      value="3 day free trial"
                      color="#333333E5"
                      marginVertical={3}
                    />
                  </View>
                )}
              <View style={styles.row}>
                <FitIcon
                  color={
                    getPurchaseHistory?.plan_value == 30
                      ? AppColor.SUBS_BLUE
                      : getPurchaseHistory?.plan_value == 69
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
                  value="Winning price 1000/-"
                  color="#333333E5"
                  marginVertical={3}
                />
              </View>
              <View style={styles.row}>
                <FitIcon
                  color={
                    getPurchaseHistory?.plan_value == 30
                      ? AppColor.SUBS_BLUE
                      : getPurchaseHistory?.plan_value == 69
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
                    getPurchaseHistory?.plan_value == 30
                      ? '1 event/month'
                      : getPurchaseHistory?.plan_value == 69
                      ? '2 event/month'
                      : '3 event/month'
                  }
                  color="#333333E5"
                  marginVertical={3}
                />
              </View>
              <View style={styles.row}>
                <FitIcon
                  color={
                    getPurchaseHistory?.plan_value == 30
                      ? AppColor.SUBS_BLUE
                      : getPurchaseHistory?.plan_value == 69
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
                    getPurchaseHistory[0]?.plan_value?.includes('30')
                      ? 'With Ads'
                      : getPurchaseHistory[0]?.plan_value?.includes('69')
                      ? 'Fewer Ads'
                      : 'No Ads'
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
                borderColor: AppColor.NEW_DARK_RED,
                paddingVertical: 10,
              }}>
              <FitText
                type="normal"
                value="Upgrade Plan"
                color={AppColor.NEW_DARK_RED}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
            </TouchableOpacity>
          )}
          <FitText
            type="normal"
            value="Cancel Plan"
            color={AppColor.NEW_DARK_RED}
            fontFamily={Fonts.MONTSERRAT_MEDIUM}
            marginVertical={15}
            onPress={() => {
              AnalyticsConsole(`CanP_BTN`);
              PLATFORM_IOS
                ? Linking.openSettings()
                : Linking.openURL(
                    'https://play.google.com/store/account/subscriptions',
                  );
            }}
          />
        </View>
      )}
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
