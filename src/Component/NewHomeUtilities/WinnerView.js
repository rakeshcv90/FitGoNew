import {View, Text, StyleSheet, ImageBackground, Platform} from 'react-native';
import React from 'react';
import {AppColor, Fonts} from '../Color';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {Image} from 'react-native';
import {localImage} from '../Image';

const WinnerView = ({totalData}) => {
  console.log('SDfdsfsdfsdfdsf', totalData[0].name);
  return (
    <View>
      <View style={styles.bannerCard}>
        <ImageBackground
          source={require('../../Icon/Images/NewHome/winnerBackground.png')}
          resizeMode="stretch"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '90%',
              height: '90%',
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '40%',
                height: '100%',
                justifyContent: 'center',
                marginRight: 10
              }}>
              <ImageBackground
                source={require('../../Icon/Images/NewHome/WinnerAvtar.png')}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '80%',
                  marginTop: DeviceHeigth >= 1024 ? 15 : 0,
                  overflow: 'hidden',
                }}>
                {totalData[0]?.image_path == null ? (
                  <View
                    style={{
                      width: DeviceHeigth >= 1024 ? '40%' : '50%',
                      height: DeviceHeigth >= 1024 ? '65%' : '50%',
                      position: 'absolute',
                      right: DeviceHeigth >= 1024 ? 80 : 34,
                      top: DeviceHeigth >= 1024 ? 13 : 17,
                      paddingTop:10,
                      zIndex: -1,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: '#DBEAFE',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 30,
                        color: AppColor.BLACK,
                        lineHeight: 40,
                      }}>
                      {totalData[0]?.name.substring(0, 1).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <Image
                    resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
                    source={{uri: totalData[0]?.image_path}}
                    //source={localImage.NContact}
                    style={{
                      width: DeviceHeigth >= 1024 ? '40%' : '50%',
                      height: DeviceHeigth >= 1024 ? '65%' : '50%',
                      position: 'absolute',
                      right: DeviceHeigth >= 1024 ? 80 : 34,
                      top: DeviceHeigth >= 1024 ? 13 : 17,
                      zIndex: -1,
                      overflow: 'hidden',
                    }}
                  />
                )}
                {/* <Image
                  source={localImage.NContact}
                  resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
                  style={{
                    width: DeviceHeigth >= 1024 ? '40%' : '50%',
                    height: DeviceHeigth >= 1024 ? '65%' : '50%',
                    position: 'absolute',
                    right: DeviceHeigth >= 1024 ? 80 : 34,
                    top: DeviceHeigth >= 1024 ? 13 : 17,
                    zIndex: -1,
                    overflow: 'hidden',
                  }}
                /> */}
              </ImageBackground>
              <View
                style={{
                  width: '100%',
                  height: '20%',
                  top: -15,
                  justifyContent: 'center',

                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 13,
                    lineHeight: 16,
                    textAlign: 'center',
                    color: AppColor.BLACK,
                  }}>
                  {totalData[0].name}
                </Text>
                <Image
                  source={require('../../Icon/Images/NewHome/price2.png')}
                  resizeMode="contain"
                  style={{
                    width: 120,
                    height: 30,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                width: '50%',
                height: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 16,
                  lineHeight: 16,
                  textAlign: 'center',
                  top: -10,
                  color: AppColor.BLACK,
                }}>
                Winner Alert!
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 14,
                  lineHeight: 16,
                  textAlign: 'center',
                  color: AppColor.BLACK,
                }}>
                   {totalData[0].name} has won this week’s challenge and the amazing prize!
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: AppColor.Background_New,
  },

  bannerCard: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.2,
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default WinnerView;
