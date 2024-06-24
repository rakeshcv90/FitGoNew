import {View, Text, StyleSheet, Alert, Linking} from 'react-native';
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
import {
  setOfferAgreement,

} from '../../Component/ThemeRedux/Actions';
import {Image} from 'react-native';
import ActivityLoader from '../../Component/ActivityLoader';
import {showMessage} from 'react-native-flash-message';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import FitText from '../../Component/Utilities/FitText';
import {openSettings} from 'react-native-permissions';
import {LocationPermissionModal} from '../../Component/Utilities/LocationPermission';
import {Screen} from 'react-native-screens';

const CountryLocation = ({navigation, route}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  const [loaded, setLoaded] = useState(true);
  const routeName = route?.params?.routeName;
  const CustomCreated = route?.params?.CustomCreated;
  const [locationP, setLocationP] = useState(false);
  const dispatch = useDispatch();
  const getCountry = async () => {
    setLoaded(false);
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
          
        } else if (!result) {
          setLocationP(true);
          setLoaded(true);
        }
      })
      .catch(err => {
        console.log('location Error', err);
      });
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

        setLoaded(true);
        navigation.navigate('BottomTab');
        // if (CustomCreated) {
        //   navigation.navigate('CustomWorkout', {routeName: routeName});
        // } else {
        
        // }
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }
  };
  return (
    <View style={styles.Container}>
      {/* <DietPlanHeader header="" shadow /> */}
      {loaded ? null : <ActivityLoader />}
      <View style={styles.view1}>
        <Image
          source={localImage.location_ping}
          style={{height: 100, width: 100, marginBottom: 15}}
          resizeMode="contain"
        />
        <FitText
          value="Allow your current location"
          type="Heading"
          fontSize={20}
          fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
          lineHeight={40}
        />
        <FitText
          type="SubHeading"
          value="We need your current location to provide"
          textAlign="center"
        />
        <FitText
          type="SubHeading"
          value="you with better services"
          textAlign="center"
        />
      </View>
      <View style={styles.View2}>
        <NewButton
          title={'Access the Current Location'}
          pV={15}
          image={localImage.location_icon}
          onPress={() => getCountry()}
        />
      </View>
      <LocationPermissionModal
        locationP={locationP}
        setLocationP={setLocationP}
      />
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
    lineHeight: 24,
  },
});
export default CountryLocation;
