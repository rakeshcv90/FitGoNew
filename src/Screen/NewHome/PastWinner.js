import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {AppColor, Fonts} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import LinearGradient from 'react-native-linear-gradient';
import {localImage} from '../../Component/Image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
const PastWinner = ({route}) => {
  const getUserDataDetails = useSelector(state => state.getUserDataDetails);
  console.log('gbgbg', getUserDataDetails);
  const scrollY = new Animated.Value(0);
  const navigation = useNavigation();
  const cardWidth = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['90%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={AppColor.Background_New}
        barStyle={'dark-content'}
      />
      <DietPlanHeader header={'Past Winners'} shadow />
      <ScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        // onScroll={Animated.event(
        //   [{nativeEvent: {contentOffset: {y: scrollY}}}],
        //   {useNativeDriver: false},
        // )}
        // scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{
          width: '100%',
          height: '100%',
          marginTop: DeviceHeigth >= 1024 ? -30 : -10,
          backgroundColor: AppColor.WHITE,
        }}
        nestedScrollEnabled>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          colors={['#D900AE', '#6C00A3']}
          style={{width: '100%', height: '100%'}}>
          <View
            style={{
              width: '60%',
              height: 180,

              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 16,
            }}>
            <View
              style={{
                width: 150,
                height: 120,
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View
                style={{
                  width: 88,
                  height: 88,

                  borderRadius: 88,
                  borderWidth: 6,
                  borderColor: AppColor.WHITE,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {getUserDataDetails?.image_path == null ? (
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 80,
                      overflow: 'hidden',
                      zIndex: -1,
                      backgroundColor: AppColor.WHITE,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 30,
                        color: AppColor.BLACK,
                        lineHeight: 40,
                      }}>
                      {getUserDataDetails?.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={localImage.NContact}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 80,
                      overflow: 'hidden',
                      zIndex: -1,
                    }}
                    resizeMode="cover"
                  />
                )}
              </View>
              <Image
                source={require('../../Icon/Images/NewHome/crown2.png')}
                resizeMode="contain"
                style={{
                  width:
                    DeviceHeigth >= 1024
                      ? DeviceWidth * 0.045
                      : DeviceWidth * 0.1,
                  height: DeviceWidth * 0.08,
                  position: 'absolute',
                  top:
                    DeviceHeigth >= 1024
                      ? -DeviceWidth * 0.045
                      : -DeviceWidth * 0.055,
                }}
              />
              <Image
                source={require('../../Icon/Images/NewHome/win.png')}
                resizeMode="contain"
                style={{
                  width:
                    DeviceHeigth >= 1024
                      ? DeviceWidth * 0.08
                      : DeviceWidth * 0.15,
                  height: DeviceWidth * 0.08,
                  position: 'absolute',

                  bottom:
                    DeviceHeigth >= 1024
                      ? DeviceWidth * 0.0
                      : DeviceWidth * 0.035,
                }}
              />
            </View>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 18,
                lineHeight: 26,
                color: AppColor.WHITE,
                marginTop: 10,
              }}>
              Want to next winner
            </Text>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 14,
                lineHeight: 20,
                marginTop: 5,
                color: '#F6C544',
              }}>
              Earn ₹1,000/-
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation?.navigate('NewSubscription', {upgrade: true});
            }}
            style={{
              width: 203,
              height: 48,
              backgroundColor: 'green',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              marginBottom: 30,
              marginTop: 20,
              backgroundColor: AppColor.WHITE,
              borderRadius: 6,
              shadowColor: 'grey',
              flexDirection: 'row',
              ...Platform.select({
                ios: {
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 0,
                },
              }),
            }}>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 18,
                marginHorizontal: 5,
                color: AppColor.PrimaryTextColor,
              }}>
              Joint Event
            </Text>
            <AntDesign
              name={'arrowright'}
              size={20}
              color={AppColor.PrimaryTextColor}
            />
          </TouchableOpacity>

          <View
            style={{
              width: '100%',
              backgroundColor: AppColor.WHITE,
              alignSelf: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View style={styles.winnersList}>
              {route.params.pastWinners.map((winner, index) => (
                <>
                  <View key={index} style={styles.card}>
                    <View
                      style={{
                        width: '80%',
                        height: 70,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={localImage.Gold}
                        style={{
                          width: 35,
                          height: 35,
                          marginHorizontal: DeviceHeigth >= 1024 ? 30 : 10,
                        }}
                        resizeMode="contain"
                      />
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 60,
                          borderColor: 'gray',
                          marginLeft: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginHorizontal: DeviceHeigth >= 1024 ? 35 : 20,
                          borderWidth: 0.5,
                        }}>
                        {/* <Image
                          source={localImage.NContact}
                          style={{width: 55, height: 55}}
                          resizeMode="contain"
                        /> */}
                        {winner.image == null ? (
                          <View
                            style={{
                              width: 55,
                              height: 55,
                              borderRadius: 55,
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
                              {winner.name.substring(0, 2).toUpperCase()}
                            </Text>
                          </View>
                        ) : (
                          <Image
                            source={localImage.NContact}
                            style={{width: 55, height: 55}}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                      <View>
                        <Text
                          style={{
                            //fontFamily: Fonts.HELVETICA_REGULAR,
                            fontSize: 14,
                            fontWeight: '500',
                            lineHeight: 20,
                            textAlign: 'center',
                            color: AppColor.PrimaryTextColor,
                          }}>
                          {winner.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        height: 70,

                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.HELVETICA_REGULAR,
                          fontSize: 14,
                          lineHeight: 20,
                          textAlign: 'center',
                          color: '#606E80',
                        }}>
                        {winner?.week} week
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '90%',
                      height: 1,
                      backgroundColor: '#EDF0F2',
                      alignSelf: 'center',
                    }}></View>
                </>
              ))}
            </View>
          </View>
          {/* <Animated.View
            style={[
              styles.mainCard,
              {
                width: cardWidth,
              },
            ]}>
           
          </Animated.View> */}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  crown: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  winnersList: {},
  card: {
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    marginVertical: 10, // Adjust based on your screen size
  },
  winnerImage: {
    width: 70,
    height: 70,
    borderRadius: 60,
  },
  winnerName: {
    fontSize: 16,
    lineHeight: 24,
    top: -10,
    fontWeight: Fonts.HELVETICA_REGULAR,
  },
  prizeButton: {
    // width:100,height:20,
    paddingVertical: 10,
    paddingHorizontal: DeviceWidth * 0.07,
    borderRadius: 20,
    flexDirection: 'row',
  },
  prizeText: {
    color: AppColor.RED,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 20,
  },
  eventButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  mainCard: {
    width: '90%',
    paddingVertical: 20,
    alignSelf: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
});
export default PastWinner;
