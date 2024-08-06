import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import {ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../Image';
import {showMessage} from 'react-native-flash-message';

const WithoutEvent = () => {
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
            Past Players
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            showMessage({
              message: 'Work in progress for past winner',
              floating: true,
              duration: 500,
              type: 'info',
              icon: {icon: 'none', position: 'left'},
            });
          }}
          style={{
            width: '100%',
            height:
              DeviceHeigth >= 1024 ? DeviceHeigth * 0.15 : DeviceHeigth * 0.17,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            marginTop: DeviceHeigth * 0.02,
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#6C00A3', '#D900AE']}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',

              borderRadius: 12,
            }}>
            <Image
              source={require('../../Icon/Images/NewHome/light.png')}
              resizeMode="stretch"
              style={{
                width: 100,
                height: 130,
                position: 'absolute',
                right: 0,
                top: -10,
              }}
            />
            <View
              style={{
                width: '100%',
                height: '40%',
                paddingHorizontal: 10,
                marginVertical: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    borderWidth: 3,
                    borderColor: AppColor.WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <Image
                    source={localImage.NContact}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 40,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    left: -20,
                    zIndex: 1,
                    borderWidth: 3,
                    borderColor: AppColor.WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <Image
                    source={localImage.NContact}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 40,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    left: -40,
                    zIndex: 1,
                    borderWidth: 3,
                    borderColor: AppColor.WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <Image
                    source={localImage.NContact}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 40,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    left: -60,
                    zIndex: 1,
                    borderWidth: 3,
                    borderColor: AppColor.WHITE,
                    backgroundColor: AppColor.BLACK,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      color: AppColor.WHITE,
                      fontSize: 10,
                    }}>
                    +10
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: '20%',
                paddingHorizontal: 10,
                marginVertical: -10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 14,
                  lineHeight: 17,
                  color: AppColor.WHITE,
                }}>
                Our past winner’s
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: '40%',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 12,
                  lineHeight: 20,
                  color: AppColor.WHITE,
                }}>
                Lorem Ipsum is simply dummy text of the printing
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,

    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
    alignSelf: 'center',
  },
  box: {
    width: DeviceWidth * 0.95,

    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Semi-transparent background
  },
});
export default WithoutEvent;
