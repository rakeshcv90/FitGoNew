import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {setBanners, setOfferAgreement} from '../ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {openSettings} from 'react-native-permissions';
import {SliderBox} from 'react-native-image-slider-box';
import {Image} from 'react-native';
import {localImage} from '../Image';
import FastImage from 'react-native-fast-image';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {AppColor} from '../Color';
import ActivityLoader from '../ActivityLoader';
const Banners = ({type1, type2, onPress, navigation}) => {
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const getPurchaseHistory = useSelector(state => state?.getPurchaseHistory);
  const planType = useSelector(state => state.planType);
  const getBanners = useSelector(state => state?.getBanners);
  const [loading, setLoading] = useState(true);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const avatarRef = React.createRef();
  const [loaded, setLoaded] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(getBanners).length == 0) {
      bannerApi();
    }
  }, []);
  const handleStart = () => {
    if (getUserDataDetails?.email != null) {
      setLoaded(false);
      locationPermission()
        .then(result => {
          if (result == 'blocked') {
            showPermissionAlert();
          } else if (result === 'denied') {
            StoreAgreementApi('');
          } else if (result) {
            StoreAgreementApi(result);
          } else if (!result) {
            StoreAgreementApi('');
          }
        })
        .catch(err => {
          console.log('location Error', err);
        });
    } else {
      navigation.navigate('LogSignUp', {screen: 'Sign Up'});
      showMessage({
        message: 'You need to login/Signup first',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  // apis for start function
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
          if (planType == -1) {
            navigation.navigate('NewSubscription',{upgrade: false});
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
  const showPermissionAlert = () => {
    Alert.alert(
      'Permission Required',
      'To use the rewards feature, please enable location access in settings',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            StoreAgreementApi('');
          },
        },
        {
          text: 'Open settings',
          onPress: () => {
            openSettings();
            setLoaded(true);
          },
        },
      ],
      {cancelable: false},
    );
  };
  // banner Api
  const bannerApi = async () => {
    try {
      const response = await axios(
        `${NewAppapi.EVENT_BANNERS}?version=${VersionNumber.appVersion}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (
        response?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else if (response?.data?.msg == 'version is required') {
        console.log('version error', response?.data?.msg);
      } else {
        const objects = {};
        response.data.data.forEach(item => {
          objects[item.type] = item.image;
        });
        dispatch(setBanners(objects));
      }
    } catch (error) {
      console.log('BannerApiError', error);
    }
  };
  console.log(type1, type2);
  const handleEventClicks = index => {
    if (type1 == 'new_join') {
      handleStart();
    } else if (type1 == 'coming_soon') {
      showMessage({
        message:
          'This feature will be soon available in your country,Stay tuned!',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    } else if (type1 == 'joined_challenge' && index == 0) {
      navigation.navigate('UpcomingEvent', {eventType: 'current'});
    } else if (type2 == 'ongoing_challenge') {
      navigation.navigate('MyPlans');
    } else if (type2 == 'upcoming_challenge' && index == 1) {
      navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
    }
    // if (type1 == 'joined_challenge' && type2 == 'ongoing_challenge') {
    //   index == 0
    //     ? navigation.navigate('UpcomingEvent', {eventType: 'current'})
    //     : navigation.navigate('MyPlans');
    // } else if (type1 == 'joined_challenge' && type2 == 'upcoming_challenge') {
    //   index == 0
    //     ? navigation.navigate('MyPlans')
    //     : navigation.navigate('UpcomingEvent', {eventType: 'upcoming'});
    // } else if (type1 == 'joined_challenge') {
    //   navigation.navigate('UpcomingEvent', {eventType: 'current'});
    // }
  };
  const Box = ({imageSource}) => {
    return (
      <View>
        {loaded ? null : <ActivityLoader />}
        <SliderBox
          ImageComponent={FastImage}
          images={[...imageSource]}
          sliderBoxHeight={DeviceHeigth * 0.18}
          onCurrentImagePressed={index => {
            handleEventClicks(index);
          }}
          dotColor={AppColor.RED}
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
          autoplayInterval={2500}
          resizeMethod={'resize'}
          resizeMode={'stretch'}
          paginationBoxStyle={{
            position: 'absolute',
            bottom: 0,
            padding: 0,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(128, 128, 128, 0.92)',
          }}
          ImageComponentStyle={{borderRadius: 15, width: DeviceWidth * 0.95}}
          imageLoadingColor={AppColor.RED}
        />
      </View>
    );
  };
  return (
    <View style={{marginVertical: 15}}>
      {getBanners[type1] && getBanners[type2] ? (
        <Box imageSource={[getBanners[type1], getBanners[type2]]} />
      ) : getBanners[type1] ? (
        <Box imageSource={[getBanners[type1]]} />
      ) : getBanners[type2] ? (
        <Box imageSource={[getBanners[type2]]} />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
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
export default Banners;
