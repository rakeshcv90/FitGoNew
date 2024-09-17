import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import NameUpdateModal from '../Utilities/NameUpdateModal';
import {Animated} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
import {showMessage} from 'react-native-flash-message';
import FadeText from './FadeText';

type NewBannerProps = {
  userDetails: Object | any;
  purchaseHistory: Object | any;
  enteredCurrentEvent: Object | any;
  enteredUpcomingEvent: Object | any;
  setLocation: Function;
  Sat: string;
  Sun: string;
};

const BANNER_TYPES = {
  COMING_SOON: 'coming_soon',
  ONGOING: 'ongoing_challenge',
  JOINED: 'joined_challenge',
  UPCOMING: 'upcoming_challenge',
  NEW_JOINED: 'new_join',
};
type BannerArrayType = {
  image: string;
  name: string;
};

const NewBanner = ({
  purchaseHistory,
  userDetails,
  setLocation,
  Sat,
  Sun,
  enteredCurrentEvent,
  enteredUpcomingEvent,
}: NewBannerProps) => {
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataType, setDatatype] = useState('');
  const dispatch = useDispatch();
  const [BannerArray, setBannerArray] = useState<Array<BannerArrayType>>([]);
  const getBanners = useSelector((state: any) => state?.getBanners);
  const getOfferAgreement = useSelector(
    (state: any) => state?.getOfferAgreement,
  );
  const isValidLoc =
    getOfferAgreement?.location === 'India' ||
    getOfferAgreement?.location === 'United States';

  useEffect(() => {
    const BArray: Array<any> = [];
    if (isValidLoc) {
      getReqBanner(BArray);
    } else {
      setBannerArray([
        {
          name: BANNER_TYPES.COMING_SOON,
          image: getBanners[BANNER_TYPES.COMING_SOON],
        },
      ]);
    }
  }, [enteredCurrentEvent, enteredUpcomingEvent, getBanners]);
console.log("PRINTs",)
  const getReqBanner = useCallback(
    (BArray: Array<BannerArrayType>) => {
      if (enteredCurrentEvent) {
        BArray.push({
          name: BANNER_TYPES.ONGOING,
          image: getBanners[BANNER_TYPES.ONGOING],
        });
        if (enteredUpcomingEvent) {
          BArray.push({
            name: BANNER_TYPES.JOINED,
            image: getBanners[BANNER_TYPES.JOINED],
          });
        } else {
          BArray.push({
            name: BANNER_TYPES.UPCOMING,
            image: getBanners[BANNER_TYPES.UPCOMING],
          });
        }
      } else {
        if (enteredUpcomingEvent) {
          BArray.push({
            name: BANNER_TYPES.JOINED,
            image: getBanners[BANNER_TYPES.JOINED],
          });
        } else {
          BArray.push({
            name: BANNER_TYPES.NEW_JOINED,
            image: getBanners[BANNER_TYPES.NEW_JOINED],
          });
        }
      }
      setBannerArray(BArray);
    },
    [enteredCurrentEvent, enteredUpcomingEvent, getBanners],
  );
  const handleStart = () => {
    if (userDetails?.email != null && userDetails?.name != null) {
      setLoaded(false);
      if (
        getOfferAgreement?.location === 'India' ||
        getOfferAgreement?.location == 'United States'
      ) {
        setLoaded(true);
        if (purchaseHistory?.plan == null) {
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
              setLocation(true);
              setLoaded(true);
            } else if (result === 'denied') {
              setLocation(true);
              setLoaded(true);
            } else if (result) {
              //   StoreAgreementApi(result);
            } else if (result == null) {
              // setLocation(true);
              setLoaded(true);
              showMessage({
                message: 'Error while getting your location',
                floating: true,
                duration: 500,
                type: 'danger',
              });
            } else {
              setLoaded(true);
              showMessage({
                message: 'Error while getting your location',
                floating: true,
                duration: 500,
                type: 'danger',
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
        (userDetails.name?.toUpperCase() == 'GUEST' ||
          userDetails.name == null) &&
        userDetails.email == null
      ) {
        AnalyticsConsole('BOTH_U_D');
        setOpenEditModal(true);
        setDatatype('both');
      } else {
        if (
          userDetails.name?.toUpperCase() == 'GUEST' ||
          userDetails.name == null
        ) {
          AnalyticsConsole('NAME_U_D');
          setOpenEditModal(true);
          setDatatype('name');
        }
        if (userDetails.email == null) {
          AnalyticsConsole('EMAIL_U_D');
          setOpenEditModal(true);
          setDatatype('email');
        }
      }
    }
  };

  const handleEventClicks = (item: BannerArrayType) => {
    if (item.name == BANNER_TYPES.NEW_JOINED) {
      handleStart();
    } else if (item.name == BANNER_TYPES.UPCOMING) {
      AnalyticsConsole('UP_BANNER');
      if (purchaseHistory) {
        purchaseHistory?.plan == 'noob'
          ? navigation?.navigate('NewSubscription', {upgrade: true})
          : purchaseHistory?.plan != 'noob' &&
            purchaseHistory?.used_plan < purchaseHistory?.allow_usage
          ? navigation?.navigate('UpcomingEvent', {
              eventType: 'upcoming',
            })
          : navigation?.navigate('NewSubscription', {upgrade: true});
      } else navigation?.navigate('NewSubscription', {upgrade: true});
    } else if (item.name == BANNER_TYPES.COMING_SOON) {
      AnalyticsConsole('CS_BANNER');
      showMessage({
        message:
          'This feature will be soon available in your country, stay tuned!',
        floating: true,
        duration: 500,
        type: 'danger',
      });
    } else if (item.name == BANNER_TYPES.JOINED) {
      AnalyticsConsole('JN_BANNER');
      navigation.navigate('UpcomingEvent', {eventType: 'current'});
    } else if (item.name == BANNER_TYPES.ONGOING) {
      AnalyticsConsole(
        Sat || Sun ? `ON_B_CL_ON_${purchaseHistory?.currentDay}` : 'ON_BANNER',
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
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: BannerArrayType;
    index: number;
  }) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.9}
      disabled={loading ? true : false} // improvement
      onPress={() => handleEventClicks(item)}
      style={{
        height: '100%',
        width: DeviceWidth * 0.95,
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
          borderTopRightRadius: 20,
        }}
        resizeMode="stretch"
        source={{uri: item.image}}
        onLoad={() => setLoading(false)}
        // defaultSource={localImage.testbanner}
      />
    </TouchableOpacity>
  );
  return (
    <>
      <View style={styles.bannerCard}>
        <View
          style={{
            width: '100%',
            height: '85%',
            // backgroundColor: 'red',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View style={{justifyContent: 'center', width: '100%'}}>
            <FlatList
              data={BannerArray}
              keyExtractor={(_,index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              scrollEnabled={BannerArray?.length > 1}
            />
          </View>
        </View>
        <FadeText navigation={navigation} />
      </View>
      <NameUpdateModal
        dataType={dataType}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        user_id={userDetails?.id}
      />
    </>
  );
};

export default NewBanner;

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
    paddingBottom: 5,
    alignItems: 'center',
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
