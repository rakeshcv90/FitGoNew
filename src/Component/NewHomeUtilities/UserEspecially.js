import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
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
        <View
          style={{
            width: '100%',
          }}>
          <Text
            style={{
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 20,
              color: AppColor.PrimaryTextColor,
            }}>
            Especially for you
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: DeviceHeigth >= 1024 ? 5 : 5,
            marginTop: DeviceHeigth * 0.02,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              HandelClick(1);
            }}
            style={{
              width: '50%',
              height: DeviceHeigth * 0.15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ImageBackground
              source={require('../../Icon/Images/NewHome/back3.png')}
              resizeMode="stretch"
              style={{
                width: '100%',
                height: '100%',
                left: DeviceHeigth >= 1024 ? -7 : -3,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  paddingVertical: DeviceWidth * 0.05,
                  paddingHorizontal: DeviceWidth * 0.03,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 14,
                    lineHeight: 17,
                    color: AppColor.WHITE,
                  }}>
                  Custom workout
                </Text>
                <View
                  style={{
                    width: '90%',
                    height: '100%',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    Create your own workout
                  </Text>
                  {/* <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    healthy life
                  </Text> */}
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              HandelClick(2);
            }}
            style={{
              width: '50%',
              height: DeviceHeigth * 0.15,
            }}>
            <ImageBackground
              source={require('../../Icon/Images/NewHome/back1.png')}
              resizeMode="stretch"
              style={{
                width: '100%',
                height: '100%',
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  paddingVertical: DeviceWidth * 0.05,
                  paddingHorizontal: DeviceWidth * 0.03,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 14,
                    lineHeight: 17,
                    color: AppColor.WHITE,
                  }}>
                  Near by gym
                </Text>
                <View
                  style={{
                    width: '90%',
                    height: '100%',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    Gyms near your
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    location
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              HandelClick(3);
            }}
            style={{
              width: '50%',
              height: DeviceHeigth * 0.15,
            }}>
            <ImageBackground
              source={require('../../Icon/Images/NewHome/back2.png')}
              resizeMode="stretch"
              style={{
                width: '100%',
                height: '100%',
                left: DeviceHeigth >= 1024 ? -7 : -3,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  paddingVertical: DeviceWidth * 0.05,
                  paddingHorizontal: DeviceWidth * 0.03,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 14,
                    lineHeight: 17,
                    color: AppColor.WHITE,
                  }}>
                  Diet
                </Text>
                <View
                  style={{
                    width: '90%',
                    height: '100%',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    Reach Your Goals Quicker with a Nutritious Diet
                  </Text>
                  {/* <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    Nutritious Diet
                  </Text> */}
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              HandelClick(4);
            }}
            style={{
              width: '50%',
              height: DeviceHeigth * 0.15,
            }}>
            <ImageBackground
              source={require('../../Icon/Images/NewHome/back4.png')}
              resizeMode="stretch"
              style={{
                width: '100%',
                height: '100%',
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  paddingVertical: DeviceWidth * 0.05,
                  paddingHorizontal: DeviceWidth * 0.03,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 14,
                    lineHeight: 17,
                    color: AppColor.WHITE,
                  }}>
                  Store
                </Text>
                <View
                  style={{
                    width: '90%',
                    height: '100%',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    Quality over quantity
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 13,
                      lineHeight: 16,
                      color: AppColor.WHITE,
                    }}>
                    for optimal health benefits
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
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
