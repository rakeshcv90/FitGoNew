import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {ImageBackground} from 'react-native';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {showMessage} from 'react-native-flash-message';
import {
  setAgreementContent,
  setBanners,
  setCompleteProfileData,
  Setmealdata,
  setOfferAgreement,
  setStoreData,
} from '../ThemeRedux/Actions';
import NameUpdateModal from '../Utilities/NameUpdateModal';
import {
  checkLocationPermission,
  locationPermission,
} from '../../Screen/Terms&Country/LocationPermission';
import {AnalyticsConsole} from '../AnalyticsConsole';

const TextBanner = ({navigation, setLocationP}) => {
  const navigation1 = useNavigation();
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state?.getPurchaseHistory);
  const getOfferAgreement = useSelector(state => state.getOfferAgreement);
  const getBanners = useSelector(state => state?.getBanners);
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const enteredUpcomingEvent = useSelector(
    state => state?.enteredUpcomingEvent,
  );
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataType, setDatatype] = useState('');
  const dispatch = useDispatch();
  const messages = ['How to join!', 'FAQ'];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [BannerType1, setBannertype1] = useState('');
  const [Bannertype2, setBannerType2] = useState('');
  useEffect(
    useCallback(() => {
      const handleBannerType = async () => {
        if (getOfferAgreement?.location === 'India') {
          if (enteredCurrentEvent && enteredUpcomingEvent) {
            setBannertype1('ongoing_challenge');
            setBannerType2('joined_challenge');
          } else if (enteredCurrentEvent && !enteredUpcomingEvent) {
            setBannertype1('ongoing_challenge');
            setBannerType2('upcoming_challenge');
          } else if (!enteredCurrentEvent && enteredUpcomingEvent) {
            setBannertype1('joined_challenge');
          } else {
            setBannertype1('new_join');
          }
        } else {
          try {
            const result = await checkLocationPermission();
            if (!getOfferAgreement?.location) {
              setBannertype1('new_join');
            } else if (result === 'granted') {
              setBannertype1('coming_soon');
            } else if (result === 'blocked' || result === 'denied') {
              setBannertype1('new_join');
            }
          } catch (err) {
            console.error('Error checking location permission:', err);
            setBannertype1('coming_soon');
          }
        }
      };
      handleBannerType();
      return () => {};
    }, [getOfferAgreement, enteredCurrentEvent, enteredUpcomingEvent]),
  );
  useEffect(() => {
    if (Object.keys(getBanners).length == 0) {
      //bannerApi();
      getUserAllInData();
    }
  }, []);

  const getUserAllInData = async () => {
    try {
      const responseData = await axios.get(
        `${NewAppapi.GET_ALL_IN_ONE}?version=${VersionNumber.appVersion}`,
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
      } else if (responseData?.data?.msg == 'version is required') {
      } else {
        const objects = {};
        responseData.data.data.forEach(item => {
          objects[item?.type] = item?.image;
        });

        dispatch(setBanners(objects));
        dispatch(setAgreementContent(responseData?.data?.terms[0]));
        dispatch(Setmealdata(responseData?.data?.diets));
        dispatch(setStoreData(responseData?.data?.types));
        dispatch(setCompleteProfileData(responseData?.data?.additional_data));
      }
    } catch (error) {
      console.log('all_in_one_api_error', error);
      dispatch(Setmealdata([]));
      dispatch(setCompleteProfileData([]));
      dispatch(setStoreData([]));
    }
  };

  const StoreAgreementApi = async country => {
    setLoaded(false);
    const payload = new FormData();
    payload.append('version', VersionNumber?.appVersion);
    payload.append('user_id', getUserDataDetails?.id);
    payload.append('country', country);
    payload.append('term_conditons', 'Accepted');
    try {
      const Apicall = await axios(NewAppapi.STORE_USER_AGR_COUNTRY, {
        method: 'POST',
        data: payload,
        headers: {'Content-Type': 'multipart/form-data'},
      });
      if (Apicall?.data) {
        getAgreementStatus();
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  const getAgreementStatus = async () => {
    try {
      const ApiCall = await axios(NewAppapi.GET_AGR_STATUS, {
        method: 'POST',
        data: {
          user_id: getUserDataDetails?.id,
          version: VersionNumber?.appVersion,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (
        ApiCall?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: ApiCall?.data?.msg,
          floating: true,
          duration: 500,
          type: 'danger',
          icon: {icon: 'auto', position: 'left'},
        });
        setLoaded(true);
      } else {
        dispatch(setOfferAgreement(ApiCall?.data));
        if (ApiCall?.data?.location == 'India') {
          if (Sat && enteredCurrentEvent) {
            AnalyticsConsole('W_L');
            navigation.navigate('Winner');
          } else if (Sun && enteredCurrentEvent) {
            AnalyticsConsole('W_L');
            navigation.navigate('Winner');
          }
          if (getPurchaseHistory?.plan == null) {
            navigation.navigate('NewSubscription', {upgrade: false});
          } else {
            navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
          }
        }
        setLoaded(true);
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  const fadeInOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        delay: 1000, // Delay to show the message
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
      fadeInOut(); // Restart the animation sequence
    });
  };

  useEffect(() => {
    fadeInOut();
  }, []);

  const handleClick = () => {
    if (messages[currentMessageIndex] == 'How to join!') {
      navigation1.navigate('IntroVideo', {type: 'home'});
    } else {
      navigation.navigate('Questions', {screenName: 'Home'});
    }
  };

  const handleEventClicks = index => {
    console.log('XCvddfgdgfdg', BannerType1, Bannertype2, index);
    const Sat = getPurchaseHistory?.currentDay == 6;
    const Sun = getPurchaseHistory?.currentDay == 7;
    if (BannerType1 == 'new_join') {
      handleStart();
    } else if (BannerType1 == 'coming_soon') {
      AnalyticsConsole('CS_BANNER');
      showMessage({
        message:
          'This feature will be soon available in your country, stay tuned!',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (
      BannerType1 == 'joined_challenge' ||
      (Bannertype2 == 'joined_challenge' && index == 1)
    ) {
      AnalyticsConsole('JN_BANNER');
      navigation.navigate('UpcomingEvent', {eventType: 'current'});
    } else if (BannerType1 == 'ongoing_challenge' && index == 0) {
      AnalyticsConsole(
        Sat || Sun
          ? `ON_B_CL_ON_${getPurchaseHistory?.currentDay}`
          : 'ON_BANNER',
      );
      Sat || Sun
        ? showMessage({
            message:
              'Your event has ended. You can resume your weekly plan normally from Monday. If you join another fitness challenge, it will start from the upcoming Monday.',
            type: 'danger',
            animationDuration: 500,
            duration: 5000,
            floating: true,
          })
        : navigation.navigate('MyPlans');
    } else if (Bannertype2 == 'upcoming_challenge' && index == 1) {
      AnalyticsConsole('UP_BANNER');
      if (getPurchaseHistory) {
        getPurchaseHistory?.plan == 'noob'
          ? navigation?.navigate('NewSubscription', {upgrade: true})
          : getPurchaseHistory?.plan != 'noob' &&
            getPurchaseHistory?.used_plan < getPurchaseHistory?.allow_usage
          ? navigation?.navigate('UpcomingEvent', {
              eventType: 'upcoming',
            })
          : navigation?.navigate('NewSubscription', {upgrade: true});
      } else navigation?.navigate('NewSubscription', {upgrade: true});
    }
  };
  const handleStart = () => {
    if (getUserDataDetails?.email != null && getUserDataDetails?.name != null) {
      setLoaded(false);
      if (getOfferAgreement?.location == 'India') {
        setLoaded(true);
        if (getPurchaseHistory?.plan == null) {
          AnalyticsConsole('PP_BANNER');
          navigation.navigate('StepGuide');
          // navigation.navigate('NewSubscription', {upgrade: false});
        } else {
          AnalyticsConsole('UP_BANNER');
          navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
        }
      } else {
        locationPermission()
          .then(result => {
            if (result == 'blocked') {
              setLocationP(true);
              setLoaded(true);
            } else if (result === 'denied') {
              setLocationP(true);
              setLoaded(true);
            } else if (result) {
              StoreAgreementApi(result);
            } else if (result == null) {
              // setLocationP(true);
              setLoaded(true);
              showMessage({
                message: 'Error while getting your location',
                floating: true,
                duration: 500,
                type: 'danger',
                icon: {icon: 'auto', position: 'left'},
              });
            } else {
              setLoaded(true);
              showMessage({
                message: 'Error while getting your location',
                floating: true,
                duration: 500,
                type: 'danger',
                icon: {icon: 'auto', position: 'left'},
              });
            }
          })
          .catch(err => {
            console.log('location Error', err);
            setLoaded(true);
          });
      }
    } else {
      if (
        (getUserDataDetails.name?.toUpperCase() == 'GUEST' ||
          getUserDataDetails.name == null) &&
        getUserDataDetails.email == null
      ) {
        AnalyticsConsole('BOTH_U_D');
        setOpenEditModal(true);
        setDatatype('both');
      } else {
        if (
          getUserDataDetails.name?.toUpperCase() == 'GUEST' ||
          getUserDataDetails.name == null
        ) {
          AnalyticsConsole('NAME_U_D');
          setOpenEditModal(true);
          setDatatype('name');
        }
        if (getUserDataDetails.email == null) {
          AnalyticsConsole('EMAIL_U_D');
          setOpenEditModal(true);
          setDatatype('email');
        }
      }
    }
  };
  const Box = ({imageSource}) => {
    const renderItem = ({item, index}) => (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        disabled={loading ? true : false} // improvement
        onPress={() => handleEventClicks(index)}
        style={{
          height: '100%',
          width:
            imageSource?.length > 1 ? DeviceWidth * 0.9 : DeviceWidth * 0.95,
          alignSelf: 'center',

          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {loading && (
          <View
            style={{
              width: '100%',
              height: '100%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: 'lightgrey',
              justifyContent: 'center',
              position: 'absolute',
            }}>
            <ActivityIndicator size={50} color={AppColor.RED} />
          </View>
        )}
        <Image
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderTopLeftRadius: 20,
          }}
          resizeMode="stretch"
          source={{uri: item}}
          onLoad={() => setLoading(false)}
          // defaultSource={localImage.testbanner}
        />
      </TouchableOpacity>
    );

    const memoizedComponent = useMemo(
      () => (
        <View style={{justifyContent: 'center', width: '100%'}}>
          {loaded ? null : <ActivityLoader />}
          <FlatList
            data={imageSource}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            scrollEnabled={imageSource?.length > 1}
          />
        </View>
      ),
      [imageSource, loaded],
    );
    return memoizedComponent;
  };
  return (
    <View>
      <View style={styles.bannerCard}>
        <View
          style={{
            width: '100%',
            height: '85%',
            backgroundColor: 'red',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View style={{}}>
            {getBanners &&
            getBanners[BannerType1] &&
            getBanners[Bannertype2] ? (
              <Box
                imageSource={[getBanners[BannerType1], getBanners[Bannertype2]]}
              />
            ) : getBanners && getBanners[BannerType1] ? (
              <Box imageSource={[getBanners[BannerType1]]} />
            ) : getBanners && getBanners[Bannertype2] ? (
              <Box imageSource={[getBanners[Bannertype2]]} />
            ) : null}
            <NameUpdateModal
              dataType={dataType}
              openEditModal={openEditModal}
              setOpenEditModal={setOpenEditModal}
              user_id={getUserDataDetails?.id}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: '16%',
          }}>
          <ImageBackground
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              overflow: 'hidden',

              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
            source={require('../../Icon/Images/NewHome/background.png')}
            resizeMode="cover">
            <View
              style={{
                width: '100%',
                height: '100%',
                padding: 5,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleClick}
                style={{
                  width: '85%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Animated.Text style={[styles.text, {opacity: fadeAnim}]}>
                  {messages[currentMessageIndex]}
                </Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleClick}
                style={{
                  width: '15%',
                  height: '100%',
                }}>
                <Image
                  source={require('../../Icon/Images/NewHome/nextarrow.png')}
                  resizeMode="contain"
                  style={{
                    width: '85%',
                    height: '100%',
                  }}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
      <NameUpdateModal
        dataType={dataType}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        user_id={getUserDataDetails?.id}
      />
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColor.Background_New,
  },
  userCard: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.1,
    alignSelf: 'center',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageView: {
    width: 60,
    height: 60,

    borderRadius: 120 / 2,
  },
  cointxt: {
    color: AppColor.orangeColor1,
    fontSize: 18,
    fontFamily: Fonts.HELVETICA_BOLD,
    lineHeight: 20,
    marginHorizontal: 5,
  },
  bannerCard: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.25,
    alignSelf: 'center',
    borderRadius: 20,

    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.HELVETICA_REGULAR,
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: AppColor.WHITE,
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceHeigth * 0.18,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
export default TextBanner;
