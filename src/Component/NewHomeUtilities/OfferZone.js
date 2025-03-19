import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const OfferZone = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View
          style={{
            width: '100%',
            height: '20%',
          }}>
          <Text
            style={{
              fontFamily: Fonts.HELVETICA_BOLD,
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 20,
              color: AppColor.PrimaryTextColor,
            }}>
            Offer Zone
          </Text>
        </View>

        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={[AppColor.RED, '#F42B5C']}
          style={{
            width: '100%',
            height: '70%',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',

            justifyContent: 'space-around',
          }}>
          <View
            style={{
              width: '20%',
              height: '90%',

              justifyContent: 'center',
            }}>
            <Image
              source={require('../../Icon/Images/NewHome/gift.png')}
              resizeMode="contain"
              style={{
                width: 100,
                height: 100,
                left: -15,
                overflow: 'visible',
                zIndex: 1,
              }}
            />
          </View>
          <View
            style={{
              width: '53%',
              height: '90%',
              left: DeviceHeigth >= 1024 ? -DeviceWidth * 0.07 : 5,
            }}>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 13,
                lineHeight: 20,
                color: '#F2D498',
                marginVertical: 5,
              }}>
              Our best offers
            </Text>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 14,
                lineHeight: 23.5,
                color: AppColor.WHITE,
                marginVertical: 5,
              }}>
              Explore and the our new {'\n'}best offers
            </Text>
          </View>
          <View
            style={{
              width: '25%',
              height: '90%',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                showMessage({
                  message: 'Work in progress',
                  floating: true,
                  duration: 500,
                  type: 'info',
                  icon: {icon: 'none', position: 'left'},
                });
              }}
              style={{
                width: '90%',
                height: 50,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: AppColor.WHITE,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 14,
                  lineHeight: 16,
                  color: AppColor.RED,
                }}>
                Explore
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    height: DeviceHeigth * 0.2,
    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
    alignSelf: 'center',
  },
  box: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
    alignItems: 'center',

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
});
export default OfferZone;
