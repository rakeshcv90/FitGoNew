import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../Config';
import {locationPermission} from '../../Screen/Terms&Country/LocationPermission';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {setOfferAgreement} from '../ThemeRedux/Actions';
import {useDispatch, useSelector} from 'react-redux';
import VersionNumber, {appVersion} from 'react-native-version-number';
import {openSettings} from 'react-native-permissions';
import ActivityLoader from '../ActivityLoader';
import {Image} from 'react-native';
import {localImage} from '../Image';
import {AppColor} from '../Color';
const Banners = ({type, onPress, navigation}) => {
  const getUserDataDetails = useSelector(state => state?.getUserDataDetails);
  const [loaded, setLoaded] = useState(true);
  const dispatch = useDispatch();
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
        {/* <Image
          source={imageSource ?? localImage.MaleWeight}
          resizeMode="stretch"
        /> */}
        <Text style={{color: AppColor.BLACK, textAlign: 'left'}}>{text}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {type == 'start' ? (
        <Box onPress={() => handleStart()} text={'start'} />
      ) : type == 'upcoming' ? (
        <Box onPress={() => handleUpcoming()} text={'upcoming'} />
      ) : (
        <Box onPress={() => handleUpcoming()} text={'coming soon'} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: DeviceHeigth * 0.18,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
export default Banners;
