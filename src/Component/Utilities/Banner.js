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
import ActivityLoader from '../ActivityLoader';
import {Image} from 'react-native';
import {localImage} from '../Image';
import {AppColor} from '../Color';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const Banners = ({type, onPress, navigation}) => {
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
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
          navigation.navigate('UpcomingEvent');
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
          objects[item.name] = item.image;
        });
        dispatch(setBanners(objects));
      }
    } catch (error) {
      console.log('BannerApiError', error);
    }
  };
  const handleUpcoming = () => {
    navigation.navigate('UpcomingEvent');
  };

  const Box = ({onPress, imageSource, text}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.background}
        onPress={onPress}>
        {loaded ? null : <ActivityLoader />}
        {loading && (
          <ShimmerPlaceholder
            ref={avatarRef}
            autoRun
            style={{
              position: 'absolute',
              zIndex: 1,
              height: DeviceHeigth * 0.15,
              width: DeviceWidth * 0.91,
              borderRadius: 10,
              alignSelf: 'center',
            }}
          />
        )}
        <Image
          source={imageSource ? {uri: imageSource} : localImage.MaleWeight}
          resizeMode="contain"
          style={{height: '100%', width: '100%'}}
          onLoad={() => setLoading(false)}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{marginVertical: 15}}>
      {type == 'start' ? (
        <Box
          onPress={() => handleStart()}
          text={'start'}
          imageSource={getBanners?.upcoming}
        />
      ) : type == 'upcoming' ? (
        <Box
          onPress={() => handleUpcoming()}
          text={'upcoming'}
          imageSource={getBanners?.upcoming}
        />
      ) : type == 'coming soon' ? (
        <Box
          onPress={() => handleUpcoming()}
          text={'coming soon'}
          imageSource={getBanners?.upcoming}
        />
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
