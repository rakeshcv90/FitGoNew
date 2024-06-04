import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import NewHeader from '../../Component/Headers/NewHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import GradientButton from '../../Component/GradientButton';
import NewButton from '../../Component/NewButton';
import {localImage} from '../../Component/Image';
import {locationPermission} from './LocationPermission';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import {useSelector, useDispatch} from 'react-redux';
import {setOfferAgreement} from '../../Component/ThemeRedux/Actions';
import {Image} from 'react-native';
import ActivityLoader from '../../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
const CountryLocation = ({navigation, route}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [loaded, setLoaded] = useState(true);
  const routeName = route?.params?.routeName;
  const CustomCreated=route?.params?.CustomCreated
  const dispatch = useDispatch();
  const getCountry = async () => {
    setLoaded(false);
    try {
      const country = await locationPermission();
      await StoreAgreementApi(country);
    } catch (error) {
      console.log(error);
    }
  };

  const StoreAgreementApi = async country => {
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
        setLoaded(true);
        if (CustomCreated) {
          navigation.navigate('CustomWorkout', {routeName: routeName});
        } else {
          navigation.navigate('BottomTab');
        }
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  return (
    <View style={styles.Container}>
      <NewHeader backButton />
      {loaded ? null : <ActivityLoader />}
      <View style={styles.view1}>
        <Image
          source={localImage.location_ping}
          style={{height: 90, width: 90, marginBottom: 15}}
          resizeMode="contain"
        />
        <Text style={styles.txt1}>Enter your current location</Text>
        <Text style={styles.txt2}>
          We need your location to provide better services
        </Text>
      </View>
      <View style={styles.View2}>
        <NewButton
          title={'Use current location'}
          pV={15}
          image={localImage.location_icon}
          onPress={() => getCountry()}
        />
        <Text
          style={styles.txt3}
          onPress={() => {
            if (CustomCreated) {
              navigation.navigate('CustomWorkout', {routeName: routeName});
            } else {
              navigation.navigate('BottomTab');
            }
          }}>
          skip
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  //SubView
  view1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: -25,
  },
  View2: {
    marginBottom: DeviceHeigth * 0.03,
  },
  //txts
  txt1: {
    color: AppColor.BLACK,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    fontSize: 19,
  },
  txt2: {
    color: AppColor.NEW_GREY,
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    width: DeviceWidth * 0.6,
    textAlign: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    lineHeight: 20,
    fontWeight: '500',
    zIndex: 1,
    color: AppColor.WHITE,
  },
  txt3: {
    textAlign: 'center',
    color: AppColor.BLACK,
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 8,
  },
});
export default CountryLocation;
