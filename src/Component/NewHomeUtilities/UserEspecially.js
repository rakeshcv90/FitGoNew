import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Linking,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts, PLATFORM_IOS} from '../Color';
import {AnalyticsConsole} from '../AnalyticsConsole';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AddCountFunction} from '../Utilities/AddCountFunction';
import {MyInterstitialAd} from '../BannerAdd';
import AnimatedLottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';

import GradientButton from '../GradientButton';
import {useLocation} from '../Permissions/PermissionHooks';
import {AuthorizationStatus} from '@notifee/react-native';
import Geolocation from '@react-native-community/geolocation';
import {navigate} from '../Utilities/NavigationUtil';
import {localImage} from '../Image';
import FitText from '../Utilities/FitText';
import PredefinedStyles from '../Utilities/PredefineStyles';
import {ExerciseTime} from '../../Icon/ExerciseTime';
import FitButton from '../Utilities/FitButton';
import {useSelector} from 'react-redux';
import {API_CALLS} from '../../API/API_CALLS';

const data = [
  {
    id: 1,
    title: 'Custom Made',
    image: require('../../Icon/Images/NewHome/back3.png'),
    text: 'Create your own workout',
  },
  {
    id: 2,
    title: 'Gyms',
    image: require('../../Icon/Images/NewHome/back1.png'),
    text: 'Discover fitness centers close to you',
  },
  {
    id: 3,
    title: 'Diet',
    image: require('../../Icon/Images/NewHome/back2.png'),
    text: 'Reach your goals quickly with a nutritious diet',
  },
  {
    id: 4,
    title: 'Store',
    image: require('../../Icon/Images/NewHome/back4.png'),
    text: 'Explore top-tier fitness essentials',
  },
];

const UserEspecially = () => {
  const {showInterstitialAd} = MyInterstitialAd();
  const navigation = useNavigation();
  const [locationP, setLocationP] = useState(false);
  const [breatheData, setBreatheData] = useState({
    coins: 0,
    active: false,
  });
  const {checkLocationPermission} = useLocation();
  const enteredCurrentEvent = useSelector(state => state?.enteredCurrentEvent);
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);

  const openBreathe = enteredCurrentEvent ? breatheData.active : true;

  useEffect(() => {
    API_CALLS.getBreatheTime(getUserDataDetails?.id, setBreatheData);
  }, [enteredCurrentEvent]);

  const HandelClick = index => {
    if (index == 1) {
      AnalyticsConsole(`CustomWrk_FR_Home`);
      navigation.navigate('CustomWorkout');

      let checkAdsShow = AddCountFunction();
      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('CustomWorkout');
      } else {
        navigation.navigate('CustomWorkout');
      }
    } else if (index == 2) {
      locationPermission();
    } else if (index == 3) {
      AnalyticsConsole(`MEALS_BUTTON`);
      let checkAdsShow = AddCountFunction();
      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('DietPlatTabBar');
      } else {
        navigation.navigate('DietPlatTabBar');
      }
    } else {
      let checkAdsShow = AddCountFunction();

      if (checkAdsShow == true) {
        showInterstitialAd();
        navigation.navigate('Store');
      } else {
        navigation.navigate('Store');
      }
    }
  };

  const Items = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          HandelClick(index + 1);
        }}
        style={{
          width: '50%',
          height: PLATFORM_IOS ? DeviceHeigth * 0.15 : DeviceHeigth * 0.125,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageBackground
          source={item.image}
          resizeMode={Platform.OS == 'ios' ? 'stretch' : 'contain'}
          style={{
            width: '100%',
            height: '100%',
            left: DeviceHeigth >= 1024 ? -7 : -3,
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              paddingVertical: DeviceWidth * 0.04,
              paddingLeft: DeviceWidth * 0.05,
            }}>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 15,
                lineHeight: 20,
                color: AppColor.PrimaryTextColor,
              }}>
              {item.title}
            </Text>
            <View
              style={{
                width: '70%',
                marginVertical: 5,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 13,
                  lineHeight: 20,
                  color: AppColor.SecondaryTextColor,
                }}>
                {item.text}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const locationPermission = async () => {
    const result = await checkLocationPermission();
    if (
      result['android.permission.ACCESS_FINE_LOCATION'] == RESULTS.BLOCKED ||
      result['android.permission.ACCESS_FINE_LOCATION'] == RESULTS.DENIED
    ) {
      setLocationP(true);
    } else {
      let checkAdsShow = AddCountFunction();
      if (checkAdsShow == true) {
        showInterstitialAd();
        getCurrentLocation();
        // navigation.navigate('GymListing');
      } else {
        getCurrentLocation();
        // navigation.navigate('GymListing');
      }
    }
  };
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          openMaps(position?.coords);
          // const coords = {
          //   lat: latitude, // 36.17367911141759, -115.15029443045587 United States
          //   lng: longitude,
          // };
        },
        error => {
          reject(error); // Call reject with the error object
          console.log('coords error---->', error);
        },
      );
    });
  };

  const openMaps = currentLocation => {
    if (currentLocation) {
      const {latitude, longitude} = currentLocation;
      const googleMapsUrl = `https://www.google.com/maps/search/gyms/@${latitude},${longitude},15z`;
      Linking.openURL(googleMapsUrl).catch(err =>
        Alert.alert('Error', `Failed to open Google Maps: ${err.message}`),
      );
    } else {
      Alert.alert('Error', 'Current location not available');
    }
  };

  const PermissionModal = ({locationP, setLocationP}) => {
    return (
      <Modal
        animationType="slide"
        visible={locationP}
        onRequestClose={() => setLocationP(false)}
        transparent>
        <View style={styles.modalContainer}>
          <View
            style={{
              // height: DeviceHeigth * 0.5,
              width: DeviceWidth * 0.8,
              backgroundColor: AppColor.WHITE,
              borderRadius: 10,
              padding: 10,
              paddingBottom: 20,
              alignItems: 'center',
              shadowColor: 'rgba(0, 0, 0, 1)',
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}>
            <Text
              style={{
                fontSize: 20,
                color: AppColor.LITELTEXTCOLOR,
                fontWeight: '700',
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                lineHeight: 30,
                // marginTop: DeviceWidth * 0.05,
              }}>
              Enable Your Location
            </Text>
            <AnimatedLottieView
              source={require('../../Icon/Images/NewImage2/Location.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.3,
                height: DeviceHeigth * 0.15,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: AppColor.HEADERTEXTCOLOR,
                fontWeight: '600',
                fontFamily: Fonts.MONTSERRAT_REGULAR,
                lineHeight: 24,
                textAlign: 'center',
                marginHorizontal: DeviceWidth * 0.1,
              }}>
              {`Please allow required permissions to use the app. Go to App->Permissions and enable all Permissions.`}
            </Text>
            <View
              style={{
                height: 50,
                width: '100%',
                // backgroundColor: 'pink',
                marginVertical: 20,
              }}>
              <GradientButton
                text="Enable Location Services"
                onPress={() => {
                  Linking.openSettings().finally(() => {
                    setLocationP(false);
                    locationP();
                  });
                }}
                // flex={0.3}
                w={DeviceWidth * 0.7}
                mB={-DeviceWidth * 0.05}
                alignSelf
              />
            </View>
            <View
              style={{
                height: 50,
                width: '100%',
                // backgroundColor: 'green',
              }}>
              <GradientButton
                text="Do Not Allow"
                flex={0}
                w={DeviceWidth * 0.7}
                alignSelf
                onPress={() => setLocationP(false)}
                colors={['#ADA4A5', '#ADA4A5']}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text
          style={{
            color: AppColor.HEADERTEXTCOLOR,
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontWeight: '600',
            lineHeight: 30,
            fontSize: 16,
            marginBottom: 5,
            marginLeft: 10,
          }}>
          Especially For You
        </Text>
        {openBreathe && (
          <ImageBackground
            source={localImage.breathHome}
            resizeMode="cover"
            style={{
              width: '100%',
              height: PLATFORM_IOS ? DeviceHeigth * 0.15 : DeviceHeigth * 0.125,
              marginBottom: 5,
            }}
            imageStyle={{width: '100%', height: '100%'}}>
            <View
              style={{
                paddingVertical: DeviceWidth * 0.04,
                marginLeft: DeviceWidth * 0.05,
                alignSelf: 'flex-start',
              }}>
              <FitText
                type="SubHeading"
                fontWeight="700"
                value="Breath in and out"
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ExerciseTime />
                <FitText type="normal" value=" 30 sec" marginTop={2} />
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: AppColor.RED,
                  borderRadius: 20,
                  paddingHorizontal: 7,
                  padding: 2,
                  width: '30%',
                  marginTop: 5,
                }}
                onPress={() =>
                  navigate('Breathe', {slotCoins: breatheData?.coins})
                }>
                <FitText
                  {...{
                    type: 'normal',
                    value: 'START NOW',
                    color: AppColor.WHITE,

                    fontSize: 12,
                  }}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10
          }}>
          {data.slice(0, 2).map((item, index) => (
            <Items item={item} index={index} />
          ))}
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {data.slice(2).map((item, index) => (
            <Items item={item} index={index + 2} />
          ))}
        </View>
      </View>

      <PermissionModal locationP={locationP} setLocationP={setLocationP} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,

    backgroundColor: AppColor.WHITE,
    marginVertical: 2,
  },
  box: {
    width: DeviceWidth * 0.95,

    alignSelf: 'center',
    paddingVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
});
export default UserEspecially;
