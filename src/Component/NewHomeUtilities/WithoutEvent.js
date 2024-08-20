import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import {ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../Image';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import {AnalyticsConsole} from '../AnalyticsConsole';

const WithoutEvent = ({pastWinners, noText}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {!noText&&<View
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
            Past Champions
          </Text>
        </View>}

        <View
          style={{
            width: '100%',
            padding: 10,

            alignSelf: 'center',
            backgroundColor: '#0C0C0D0D',
            borderRadius: 12,
            shadowColor: 'gray',
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{height: 50}}>
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: AppColor.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}>
                {pastWinners[0]?.image == null ? (
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      backgroundColor: '#DBEAFE',
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 15,
                        color: '#1E40AF',
                      }}>
                      {pastWinners[0]?.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={localImage.NContact}
                    // source={{uri:pastWinners[0]?.image}}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  left: -20,
                  zIndex: 1,
                  borderWidth: 3,
                  borderColor: AppColor.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {pastWinners[1]?.image == null ? (
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      backgroundColor: '#DBEAFE',
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 15,
                        color: '#1E40AF',
                      }}>
                      {pastWinners[1]?.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={localImage.NContact}
                    // source={{uri:pastWinners[0]?.image}}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  left: -40,
                  zIndex: 1,
                  borderWidth: 3,
                  borderColor: AppColor.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {pastWinners[2]?.image == null ? (
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      backgroundColor: '#DBEAFE',
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 15,
                        color: '#1E40AF',
                      }}>
                      {pastWinners[2]?.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={localImage.NContact}
                    // source={{uri:pastWinners[0]?.image}}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                )}
              </View>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  left: -60,
                  zIndex: 1,
                  borderWidth: 3,
                  borderColor: AppColor.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 45,
                    backgroundColor: AppColor.BLACK,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    opacity:0.8
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_BOLD,
                      fontSize: 18,
                      color: AppColor.WHITE,
                      textAlign:'center'
                    }}>
                   +{pastWinners?.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                AnalyticsConsole('PW');

                navigation.navigate('PastWinner', {pastWinners: pastWinners});
              }}
              style={{
                width: 150,
                height: 32,
                backgroundColor: AppColor.WHITE,
                alignSelf: 'flex-end',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 14,
                  lineHeight: 16,
                  color: '#343A40',
                }}>
                View Past Winners
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,

    backgroundColor: AppColor.WHITE,

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
  },
});
export default WithoutEvent;
