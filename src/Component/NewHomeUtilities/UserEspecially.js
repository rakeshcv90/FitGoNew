import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Linking,
  Platform,
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

const data = [
  {
    id: 1,
    title: 'Custom Made',
    image: require('../../Icon/Images/NewHome/back3.png'),
    text: 'Create your own workout',
  },
  {
    id: 2,
    title: 'Nearby Gyms',
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
  const {initInterstitial, showInterstitialAd} = MyInterstitialAd();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [locationP, setLocationP] = useState(false);

  useEffect(() => {
    if (isFocused) {
      initInterstitial();
    }
  }, [isFocused]);
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
              color: AppColor.WHITE,
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
                color: AppColor.WHITE,
              }}>
              {item.text}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
  const locationPermission = () => {
    Platform.OS == 'ios'
      ? request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          if (result === RESULTS.GRANTED) {
            console.log('Location permission granted IOS');
            setLocationP(false);
            analytics().logEvent(`CV_FITME_CLICKED_ON_GYM_LISTING_SCREEN`);
            let checkAdsShow = AddCountFunction();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigation.navigate('GymListing');
            } else {
              navigation.navigate('GymListing');
            }
            // getCurrentLocation();
          } else {
            setLocationP(true);
            console.log('Location permission denied IOS', result);
          }
        })
      : requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]).then(async result => {
          if (result['android.permission.ACCESS_FINE_LOCATION'] == 'granted') {
            console.log('Location permission granted Android');
            analytics().logEvent(`CV_FITME_CLICKED_ON_GYM_LISTING_SCREEN`);
            setLocationP(false);
            let checkAdsShow = AddCountFunction();
            if (checkAdsShow == true) {
              showInterstitialAd();
              navigation.navigate('GymListing');
            } else {
              navigation.navigate('GymListing');
            }
            // getCurrentLocation();
          } else {
            setLocationP(true);
            console.log('Location permission denied Android');
          }
        });
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
            fontSize: 18,
            marginBottom: 10
          }}>
          Especially For You
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
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
            <Items item={item} index={index+2} />
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
