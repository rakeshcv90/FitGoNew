import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import FitIcon from '../../Component/Utilities/FitIcon';
import AnimatedLottieView from 'lottie-react-native';
import LoadingScreen from '../../Component/NewHomeUtilities/LoadingScreen';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';

type TypeData = {
  name: string;
  fit_coins: number;
  id: number;
  image: string | null;
  rank: number;
  image_path: string | null;
};

const WeekArrayWithEvent = Array(5)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const Leaderboard = () => {
  const navigation = useNavigation();
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const getWeeklyPlansData = useSelector(
    (state: any) => state.getWeeklyPlansData,
  );
  const dispatch = useDispatch();
  const [mainData, setMainData] = useState<Array<TypeData>>([]);
  const [otherData, setOtherData] = useState<Array<TypeData>>([]);
  const [totalData, setTotalData] = useState<Array<TypeData>>([]);
  const [refresh, setRefresh] = useState(false);
  const [pastWinners, setPastWinners] = useState([]);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coins, setCoins] = useState({});
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  useEffect(() => {
    setLoader(true);
    getLeaderboardDataAPI();
    getPastWinner();
    getEarnedCoins();
  }, []);

  const getLeaderboardDataAPI = async () => {
    try {
      const url =
        'https://fitme.cvinfotech.in/adserver/public/api/test_leader_board';
      const result = await axios({
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });

      if (result.data) {
        const top5 = result.data?.data?.filter((item: any) => item?.rank <= 5);
        const after5 = result.data?.data?.filter(
          (item: any) => item?.rank > 3 && item?.rank < 6,
        );
        const Mydata = result.data?.data?.filter((item: any) => item?.rank > 5);
        setTotalData(Mydata);

        setMainData(top5);
        setOtherData(after5);
      }
      setTimeout(() => {
        setLoader(false);
      }, 3000);

      setRefresh(false);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoader(false);
      }, 3000);
      setRefresh(false);
    }
  };
  const getPastWinner = () => {
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/past_winners';
    RequestAPI.makeRequest(
      'POST',
      url,
      // NewAppapi.GET_PAST_WINNERS,
      {
        version: VersionNumber.appVersion,
      },
      (res: any) => {
        if (res.error) {
          setPastWinners([]);
        }
        if (res.data) {
          setPastWinners(res.data?.data);
        }
      },
    );
  };
  const RenderItem = ({item, index}: any) => {
    const myID = item?.id == getUserDataDetails?.id;
    return (
      <>
        <View
          style={[
            styles.itemContainer,
            {
              backgroundColor: myID ? AppColor.RED : AppColor.WHITE,
              borderRadius: myID ? 8 : 0,
            },
          ]}>
          <View style={{width: '100%', height: 60, flexDirection: 'row'}}>
            <View
              style={{
                width: '70%',
                height: 60,

                flexDirection: 'row',

                alignItems: 'center',
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 14,
                  // lineHeight: ,
                  color: myID ? AppColor.WHITE : AppColor.SecondaryTextColor,
                }}>
                {item?.rank}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 12,
                  // lineHeight: 20,
                  top: -3,
                  marginHorizontal: 1,
                  color: myID ? AppColor.WHITE : AppColor.SecondaryTextColor,
                }}>
                th
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 14,
                  marginHorizontal: 10,
                  // color: AppColor.PrimaryTextColor,
                  color: myID ? AppColor.WHITE : AppColor.PrimaryTextColor,
                }}>
                {item?.name}
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                height: 60,
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <Image
                source={localImage.FitCoin}
                style={{width: 30, height: 30}}
              />
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 14,
                  marginHorizontal: 10,
                  color: myID ? AppColor.WHITE : AppColor.PrimaryTextColor,
                }}>
                {item?.fit_coins}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            backgroundColor: '#EDF0F2',
            height: 1,
          }}
        />
      </>
    );
  };
  const getMyRank = () => {
    const myRank = totalData?.filter(
      item => item?.id == getUserDataDetails?.id,
    );
    if (myRank.length > 0) {
      return (
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
            backgroundColor: 'red',
            marginVertical: -10,
            borderRadius: 8,
          }}>
          <View
            style={{
              width: '70%',
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 14,

                color: AppColor.WHITE,
              }}>
              {myRank[0]?.rank}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 12,

                top: -3,
                marginHorizontal: 1,
                color: AppColor.WHITE,
              }}>
              th
            </Text>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 14,
                marginHorizontal: 10,

                color: AppColor.WHITE,
              }}>
              {myRank[0]?.name}
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              height: 60,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            <Image
              source={localImage.FitCoin}
              style={{width: 30, height: 30}}
            />
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_REGULAR,
                fontSize: 14,
                marginHorizontal: 10,
                color: AppColor.WHITE,
              }}>
              {myRank[0]?.fit_coins}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const WinnerModal = ({setVisible, visible}) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        visible={visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setVisible(!visible);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: `rgba(0,0,0,0.7)`,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}
              style={{width: '100%', alignItems: 'flex-end'}}>
              <Icons name="close" size={27} color={AppColor.WHITE} />
            </TouchableOpacity>
            <ImageBackground
              resizeMode="contain"
              source={require('../../Icon/Images/NewHome/winnerModal.png')}
              style={{
                width: '100%',
                height: DeviceHeigth * 0.8,

                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '70%',

                  marginTop: DeviceHeigth * 0.15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../Icon/Images/NewHome/Congratulations.png')}
                  resizeMode="contain"
                  style={{
                    width: '100%',
                    height: 50,

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 20,
                    lineHeight: 24,
                    color: '#FF9100',
                  }}>
                  YOU WIN
                </Text>
              </View>
              <View
                style={{
                  width: DeviceHeigth >= 1024 ? '50%' : '75%',
                  top: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <ImageBackground
                  source={require('../../Icon/Images/NewHome/ring1.png')}
                  resizeMode="stretch"
                  style={{
                    width: '60%',
                    height: DeviceHeigth >= 1024 ? 150 : 120,

                    left:
                      DeviceHeigth >= 1024
                        ? DeviceWidth * 0.06
                        : DeviceWidth * 0.08,
                    alignSelf: 'center',
                  }}></ImageBackground>
                <AnimatedLottieView
                  source={require('../../Icon/Images/NewHome/win.json')}
                  speed={1}
                  autoPlay
                  loop
                  resizeMode="contain"
                  style={{
                    width: '60%',
                    height: 120,
                    position: 'absolute',
                    left: -40,
                  }}
                />

                <AnimatedLottieView
                  source={require('../../Icon/Images/NewHome/win.json')}
                  speed={1}
                  autoPlay
                  loop
                  resizeMode="contain"
                  style={{
                    width: '60%',
                    height: 120,
                    position: 'absolute',
                    right: -40,
                  }}
                />
              </View>
              <Image
                source={require('../../Icon/Images/NewHome/price.png')}
                resizeMode="contain"
                style={{
                  width: 100,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}
              />
              <View
                style={{
                  width: DeviceHeigth >= 1024 ? '50%' : '65%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  // marginVertical: 20,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    fontSize: 14,
                    lineHeight: 20,
                    color: AppColor.PrimaryTextColor,
                  }}>
                  We are excited to announce that John Doe is the ultimate
                  winner for this week's contest.
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 14,
                    lineHeight: 20,
                    color: AppColor.PrimaryTextColor,
                  }}>
                  Grab your Reward Now!
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {}}
                style={{
                  width: DeviceHeigth >= 1024 ? '40%' : '65%',
                  height: 50,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderRadius: 6,
                  position: 'absolute',
                  bottom: 50,
                  flexDirection: 'row',
                  backgroundColor: AppColor.RED,
                }}>
                <Icon name="share" size={25} color={AppColor.WHITE} />
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 16,
                    color: AppColor.WHITE,
                    marginHorizontal: 10,
                  }}>
                  Share
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    );
  };

  const getEarnedCoins = async () => {
    const url =
      'https://fitme.cvinfotechserver.com/adserver/public/api/test_exercise_points_day';
    try {
      // const response = await axios(
      //   `${NewAppapi.GET_COINS}?user_id=${getUserDataDetails?.id}&day=${
      //     WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
      //   }`,
      // );
      const response = await axios(
        `${url}?user_id=${getUserDataDetails?.id}&day=${
          WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
        }`,
      );

      if (
        response?.data?.msg == 'Please update the app to the latest version.'
      ) {
        showMessage({
          message: response?.data?.msg,
          type: 'danger',
          animationDuration: 500,
          floating: true,
          icon: {icon: 'auto', position: 'left'},
        });
      } else {
        setCoins(response?.data?.responses);
      }
    } catch (error) {
      showMessage({
        message: 'Something went wrong.',
        type: 'danger',
        animationDuration: 500,
        floating: true,
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };

  return (
    <>
      {loader == true ? (
        <LoadingScreen />
      ) : (
      <View style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          translucent={true}
          backgroundColor={AppColor.Background_New}
        />
        <View
          style={{
            width: '100%',
            height: 50,
            marginTop: DeviceHeigth * 0.05,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            backgroundColor: AppColor.Background_New,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              marginHorizontal: 0,
              alignSelf: 'center',
            }}>
            <FitIcon
              name="arrowleft"
              size={20}
              type="AntDesign"
              color={AppColor.BLACK}
              onPress={() => navigation?.goBack()}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.HELVETICA_BOLD,
                fontSize: 18,
                color: AppColor.BLACK,
                lineHeight: 20,
                marginLeft: DeviceWidth * 0.09,
              }}>
              Leaderboard
            </Text>
          </View>
          <TouchableOpacity
            onPress={
              () => setVisible(true)
              //  navigation.navigate('Referral')
            }
            style={{
              height: 40,
              backgroundColor: AppColor.RED,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: 10,
            }}>
            <AnimatedLottieView
              source={require('../../Icon/Images/InAppRewards/ReferButton.json')}
              speed={1}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
              }}
            />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 12,
                  lineHeight: 11,
                  color: AppColor.WHITE,
                }}>
                Refer&
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    fontSize: 12,
                    lineHeight: 11,
                    color: AppColor.WHITE,
                  }}>
                  Earn
                </Text>
                <Image
                  source={localImage.FitCoin}
                  style={{width: 15, height: 15}}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: DeviceHeigth * 0.1,
            paddingVertical:
              Platform.OS == 'ios'
                ? DeviceHeigth >= 1024
                  ? DeviceHeigth * 0.06
                  : DeviceHeigth * 0.04
                : 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                getLeaderboardDataAPI();
                getPastWinner();
                getEarnedCoins();
                setLoader(true);
              }}
              colors={[AppColor.RED, AppColor.WHITE]}
            />
          }
          style={[styles.container]}
          nestedScrollEnabled>
          <View
            style={{
              width: '95%',
              paddingVertical: 10,
              backgroundColor: AppColor.WHITE,
              alignSelf: 'center',
              alignItems: 'center',
              borderRadius: 12,
              marginVertical: 18,

              paddingTop: 20,
              shadowColor: 'grey',
              ...Platform.select({
                ios: {
                  shadowColor: 'grey',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 3,
                },
              }),
            }}>
            <View
              style={{
                width: '95%',

                justifyContent: 'center',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <ImageBackground
                source={require('../../Icon/Images/NewHome/ring3.png')}
                resizeMode="contain"
                style={{
                  width: 150,
                  height: 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 150,
                  marginLeft:
                    DeviceHeigth >= 1024
                      ? 150
                      : DeviceHeigth >= 807
                      ? DeviceWidth * 0.29
                      : DeviceWidth * 0.39,
                  zIndex: -1,
                  overflow: 'visible',
                  marginTop: 20,
                }}>
                {mainData[1]?.image_path == null ? (
                  <View
                    style={{
                      width: 110,
                      height: 110,
                      marginTop: -25,
                      borderRadius: 100,
                      backgroundColor: AppColor.WHITE,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: -1,
                      overflow: 'hidden',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.HELVETICA_BOLD,
                        fontSize: 30,
                        color: AppColor.BLACK,
                        lineHeight: 40,
                      }}>
                      {mainData[1]?.name.substring(0, 1)}
                    </Text>
                  </View>
                ) : (
                  <Image
                    resizeMode="contain"
                    // source={{uri: mainData[1]?.image_path}}
                    source={localImage.NContact}
                    style={{
                      width: 110,
                      height: 110,
                      marginTop: -25,
                      borderRadius: 100,
                      zIndex: -1,
                      overflow: 'hidden',
                    }}
                  />
                )}

                <View
                  style={{
                    position: 'absolute',
                    bottom: -30,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      fontSize: 12,
                      lineHeight: 20,
                      color: AppColor.PrimaryTextColor,
                    }}>
                    {mainData[1]?.name}
                  </Text>
                </View>
                <LinearGradient
                  colors={['#FFB400B2', '#FBB604']}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  style={{
                    width: 60,
                    height: 30,
                    backgroundColor: 'yellow',
                    position: 'absolute',
                    overflow: 'hidden',
                    zIndex: 1,
                    top: 0,
                    left: 10,
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: '#FDD835',
                  }}>
                  <Image
                    source={localImage.FitCoin}
                    style={{width: 20, height: 20, marginLeft: 0}}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_BOLD,
                      color: AppColor.WHITE,
                      fontSize: 12,
                    }}>
                    {' '}
                    {mainData[1]?.fit_coins}
                  </Text>
                </LinearGradient>
              </ImageBackground>

              <ImageBackground
                source={require('../../Icon/Images/NewHome/ring1.png')}
                resizeMode="contain"
                style={{
                  width: 200,
                  height: 200,
                  zIndex: 1,
                  borderRadius: 200,
                  left:
                    DeviceHeigth >= 1024
                      ? -50
                      : DeviceHeigth >= 807
                      ? -DeviceWidth * 0.17
                      : -DeviceWidth * 0.2,
                }}>
                {mainData[0]?.image_path == null ? (
                  <View
                    style={{
                      width: 150,
                      height: 150,

                      borderRadius: 150,
                      zIndex: -1,
                      left: 20,
                      marginTop: 5,
                      overflow: 'hidden',
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
                      {mainData[0]?.name.substring(0, 1)}
                    </Text>
                  </View>
                ) : (
                  <Image
                    resizeMode="contain"
                    source={
                      mainData[0]?.image_path == null
                        ? localImage.Noimage
                        : {uri: mainData[0]?.image_path}
                    }
                    style={{
                      width: 150,
                      height: 150,

                      borderRadius: 150,
                      zIndex: -1,
                      left: 20,
                      marginTop: 5,
                      overflow: 'hidden',
                    }}
                  />
                )}

                <View
                  style={{
                    width: 150,
                    height: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: '#EBECE8',
                    position: 'absolute',
                    bottom: -50,
                    right: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_BOLD,
                      fontSize: 14,
                      lineHeight: 20,
                      color: AppColor.PrimaryTextColor,
                    }}>
                    {mainData[0]?.name}
                  </Text>
                </View>
                <LinearGradient
                  colors={['#FFB400B2', '#FBB604']}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  style={{
                    width: 60,
                    height: 30,
                    backgroundColor: 'yellow',
                    position: 'absolute',
                    overflow: 'hidden',
                    zIndex: 1,
                    top: -10,
                    left: 70,
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: '#FDD835',
                  }}>
                  <Image
                    source={localImage.FitCoin}
                    style={{width: 20, height: 20, marginLeft: 0}}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.HELVETICA_BOLD,
                      color: AppColor.WHITE,
                      fontSize: 12,
                    }}>
                    {mainData[0]?.fit_coins}
                  </Text>
                </LinearGradient>
              </ImageBackground>
              <LinearGradient
                colors={['#FFB400B2', '#FBB604']}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                style={{
                  width: 60,
                  height: 30,
                  backgroundColor: 'yellow',
                  position: 'absolute',
                  overflow: 'hidden',
                  zIndex: 1,
                  borderRadius: 30,
                  right: DeviceHeigth >= 1024 ? 170 : 0,
                  top: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: '#FDD835',
                }}>
                <Image
                  source={localImage.FitCoin}
                  style={{width: 20, height: 20, marginLeft: 0}}
                />
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_BOLD,
                    color: AppColor.WHITE,
                    fontSize: 12,
                  }}>
                  {mainData[2]?.fit_coins}
                </Text>
              </LinearGradient>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: DeviceHeigth >= 1024 ? 170 : 50,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    fontSize: 12,
                    lineHeight: 20,
                    color: AppColor.PrimaryTextColor,
                  }}>
                  {mainData[2]?.name}
                </Text>
              </View>
              <ImageBackground
                source={require('../../Icon/Images/NewHome/ring2.png')}
                resizeMode="contain"
                style={{
                  width: 150,
                  height: 150,
                  zIndex: -1,
                  overflow: 'hidden',
                  marginTop: 20,
                  borderRadius: 150,
                  left:
                    DeviceHeigth >= 1024
                      ? -100
                      : DeviceHeigth >= 807
                      ? -DeviceWidth * 0.29
                      : -DeviceWidth * 0.39,
                }}>
                {mainData[2]?.image_path == null ? (
                  <View
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 100,
                      left: 20,
                      marginTop: 9,
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
                      {mainData[2]?.name.substring(0, 1)}
                    </Text>
                  </View>
                ) : (
                  <Image
                    resizeMode="contain"
                    source={{uri: mainData[2]?.image_path}}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 100,
                      left: 20,
                      marginTop: 9,
                    }}
                  />
                )}
              </ImageBackground>
            </View>

            <View
              style={{
                width: '100%',
                height: 100,

                marginVertical: 60,
              }}>
              {otherData?.map((item: any, index: number) => (
                <RenderItem item={item} index={index} />
              ))}
            </View>
            {getMyRank()}

            {/* <TouchableOpacity
              onPress={() => {
                showMessage({
                  message: 'Work in Progress',
                  type: 'info',
                  animationDuration: 200,
                  floating: true,
                  icon: {icon: 'auto', position: 'left'},
                });
              }}
              style={{
                width: '100%',
                marginTop: DeviceHeigth * 0.02,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_REGULAR,
                  fontSize: 12,
                  lineHeight: 20,
                  textDecorationLine: 'underline',
                }}>
                View All
              </Text>
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              width: '95%',
              padding: 10,

              alignSelf: 'center',
              backgroundColor: AppColor.WHITE,
              borderRadius: 12,
              shadowColor: 'gray',
              marginVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...Platform.select({
                ios: {
                  shadowColor: 'grey',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 3,
                },
              }),
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
                      // source={{uri:pastWinners[1]?.image}}

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
                      // source={{uri:pastWinners[1]?.image}}

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
                  backgroundColor: '#E9ECEF',
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
          {enteredCurrentEvent ? (
            <View
              style={{
                width: '95%',
                backgroundColor: AppColor.WHITE,
                alignSelf: 'center',
                borderRadius: 12,
                marginVertical: 18,
                paddingTop: 20,
                shadowColor: 'grey',
                ...Platform.select({
                  ios: {
                    shadowColor: 'grey',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 15,
                  lineHeight: 20,
                  textAlign: 'center',
                  color: AppColor.PrimaryTextColor,
                }}>
                Your Progress
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  justifyContent: 'space-between',
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                {WeekArrayWithEvent?.map((item, index) => {
                  const sameDay =
                    WeekArrayWithEvent[getPurchaseHistory.currentDay - 1] ==
                    WeekArrayWithEvent[index];

                  return (
                    <View
                      style={{
                        width: '18%',

                        backgroundColor:
                          coins[item] < 0
                            ? '#FFCBCB'
                            : coins[item] == null
                            ? sameDay
                              ? '#FFF9E7'
                              : '#F5F5F5'
                            : '#E3FFEE',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor:
                          coins[item] < 0
                            ? '#FFCBCB'
                            : coins[item] == null
                            ? sameDay
                              ? '#FFF0CB'
                              : '#E8E8E8'
                            : '#C3F1C2',
                        alignItems: 'center',
                        paddingBottom: 5,
                      }}>
                      <Text
                        style={{
                          marginTop: 10,
                          fontFamily: Fonts.HELVETICA_REGULAR,
                          fontSize: 12,
                          lineHeight: 12,
                          color:
                            coins[item] < 0
                              ? '#FF3B30'
                              : coins[item] == null
                              ? sameDay
                                ? '#FF9500'
                                : '#6B7280'
                              : '#34C759',
                        }}>
                        {coins[item] < 0
                          ? 'Missed'
                          : coins[item] == null
                          ? 'Earn Upto'
                          : 'Earned'}
                      </Text>
                      <Image
                        source={
                          coins[item] < 0
                            ? require('../../Icon/Images/NewHome/groupCoin2.png')
                            : coins[item] == null
                            ? require('../../Icon/Images/NewHome/groupCoin1.png')
                            : require('../../Icon/Images/NewHome/groupCoin1.png')
                        }
                        resizeMode="contain"
                        style={{width: 50, height: 50, marginTop: 10}}
                      />
                      <Text
                        style={{
                          marginTop: 10,
                          fontFamily: Fonts.HELVETICA_BOLD,
                          fontSize: 14,
                          lineHeight: 20,
                          color:
                            coins[item] < 0
                              ? '#FF3B30'
                              : coins[item] == null
                              ? sameDay
                                ? '#FF9500'
                                : '#6B7280'
                              : '#34C759',
                        }}>
                        {coins[item] ?? getWeeklyPlansData[item]?.total_coins}
                      </Text>
                    </View>
                  );
                })}
              </View>
              {WeekArrayWithEvent?.map((item, index) => {
                const sameDay =
                  WeekArrayWithEvent[getPurchaseHistory.currentDay - 1];

                console.log('SameDate', sameDay);
                return index == 0 ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 0,
                        width: '100%',
                        height: 50,
                        alignItems: 'center',
                        paddingLeft:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.07
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.06
                            : DeviceWidth * 0.06,

                        paddingRight: 5,
                      }}>
                      <Image
                        //source={require('../../Icon/Images/NewHome/f1.png')}
                        source={
                          coins['Monday'] < 0
                            ? require('../../Icon/Images/NewHome/f2.png')
                            : coins['Monday'] == null
                            ? sameDay
                              ? require('../../Icon/Images/NewHome/f3.png')
                              : require('../../Icon/Images/NewHome/f4.png')
                            : require('../../Icon/Images/NewHome/f1.png')
                        }
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.15
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.12
                              : DeviceWidth * 0.1,
                          height: 5,
                          backgroundColor:
                            coins['Tuesday'] < 0
                              ? 'green'
                              : coins['Tuesday'] == null
                              ? '#EBEDF0'
                              : 'green',
                        }}></View>
                      <Image
                        source={
                          coins['Tuesday'] < 0
                            ? require('../../Icon/Images/NewHome/f2.png')
                            : coins['Tuesday'] == null
                            ? sameDay
                              ? require('../../Icon/Images/NewHome/f3.png')
                              : require('../../Icon/Images/NewHome/f4.png')
                            : require('../../Icon/Images/NewHome/f1.png')
                        }
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.16
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.12
                              : DeviceWidth * 0.12,
                          height: 5,
                          backgroundColor:
                            coins['Thursday'] < 0
                              ? 'green'
                              : coins['Thursday'] == null
                              ? '#EBEDF0'
                              : 'green',
                        }}></View>
                      <Image
                        source={
                          coins['Wednesday'] < 0
                            ? require('../../Icon/Images/NewHome/f2.png')
                            : coins['Wednesday'] == null
                            ? sameDay
                              ? require('../../Icon/Images/NewHome/f3.png')
                              : require('../../Icon/Images/NewHome/f4.png')
                            : require('../../Icon/Images/NewHome/f1.png')
                        }
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.15
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.11
                              : DeviceWidth * 0.1,
                          height: 5,
                          backgroundColor:
                            coins['Thursday'] < 0
                              ? 'green'
                              : coins['Thursday'] == null
                              ? '#EBEDF0'
                              : 'green',
                        }}></View>
                      <Image
                        source={
                          coins['Thursday'] < 0
                            ? require('../../Icon/Images/NewHome/f2.png')
                            : coins['Thursday'] == null
                            ? sameDay
                              ? require('../../Icon/Images/NewHome/f3.png')
                              : require('../../Icon/Images/NewHome/f4.png')
                            : require('../../Icon/Images/NewHome/f1.png')
                        }
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.155
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.11
                              : DeviceWidth * 0.1,
                          height: 5,
                          backgroundColor:
                            coins['Friday'] < 0
                              ? 'green'
                              : coins['Friday'] == null
                              ? '#EBEDF0'
                              : 'green',
                        }}></View>
                      <Image
                        source={
                          coins['Friday'] < 0
                            ? require('../../Icon/Images/NewHome/f2.png')
                            : coins['Friday'] == null
                            ? sameDay
                              ? require('../../Icon/Images/NewHome/f3.png')
                              : require('../../Icon/Images/NewHome/f4.png')
                            : require('../../Icon/Images/NewHome/f1.png')
                        }
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 0,
                        width: '100%',
                        height: 10,
                        alignItems: 'center',
                        paddingLeft:
                          DeviceHeigth >= 1024
                            ? DeviceWidth * 0.07
                            : DeviceHeigth >= 807
                            ? DeviceWidth * 0.06
                            : DeviceWidth * 0.06,

                        paddingRight: 5,
                      }}>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          marginLeft: 20,
                          borderRadius: 8,
                          backgroundColor:
                            sameDay == 'Monday' ? 'black' : 'white',
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.15
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.12
                              : DeviceWidth * 0.1,
                          height: 5,
                        }}
                      />

                      <View
                        style={{
                          width: 8,
                          height: 8,
                          marginLeft: 20,
                          borderRadius: 8,
                          backgroundColor:
                            sameDay == 'Tuesday' ? 'black' : 'white',
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.16
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.12
                              : DeviceWidth * 0.12,
                          height: 5,
                        }}
                      />

                      <View
                        style={{
                          width: 8,
                          height: 8,
                          marginLeft: 20,
                          borderRadius: 8,
                          backgroundColor:
                            sameDay == 'Wednesday' ? 'black' : 'white',
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.15
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.11
                              : DeviceWidth * 0.1,
                          height: 5,
                        }}
                      />

                      <View
                        style={{
                          width: 8,
                          height: 8,
                          marginLeft: 20,
                          borderRadius: 8,
                          backgroundColor:
                            sameDay == 'Thursday' ? 'black' : 'white',
                        }}
                      />
                      <View
                        style={{
                          width:
                            DeviceHeigth >= 1024
                              ? DeviceWidth * 0.155
                              : DeviceHeigth >= 807
                              ? DeviceWidth * 0.11
                              : DeviceWidth * 0.1,
                          height: 5,
                        }}
                      />

                      <View
                        style={{
                          width: 8,
                          height: 8,
                          marginLeft: 20,
                          borderRadius: 8,
                          backgroundColor:
                            sameDay == 'Friday' ? 'black' : 'white',
                        }}
                      />
                    </View>
                  </>
                ) : (
                  <></>
                );
              })}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('BottomTab', {screen: 'MyPlans'});
                }}
                style={{
                  width: 173,
                  height: 40,
                  marginVertical: 30,
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderRadius: 6,
                  justifyContent: 'center',
                  backgroundColor: AppColor.RED,
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 16,
                    lineHeight: 18,
                    color: AppColor.WHITE,
                  }}>
                  Start Task
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: '95%',
                backgroundColor: AppColor.WHITE,
                alignSelf: 'center',
                borderRadius: 12,
                marginVertical: 18,
                paddingTop: 20,
                shadowColor: 'grey',
                ...Platform.select({
                  ios: {
                    shadowColor: 'grey',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 15,
                  lineHeight: 20,
                  textAlign: 'center',
                  color: AppColor.PrimaryTextColor,
                }}>
                Join Weekly Challenge & Win Cash Prize!!
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 150,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 20,
                }}>
                <Image
                  source={require('../../Icon/Images/NewHome/b1.png')}
                  resizeMode="stretch"
                  style={{width: '100%', height: 150}}
                />
              </View>
              <View
                style={{
                  width: '100%',

                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginVertical: 0,
                  paddingBottom: 20,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '68%',

                    padding: 5,

                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: Fonts.HELVETICA_REGULAR,
                      color: AppColor.SecondaryTextColor,
                      lineHeight: 20,
                      fontWeight: '500',
                    }}>
                    Missed this week, but you can join next week’s challenge to
                    win ₹1,000/-
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation?.navigate('NewSubscription', {upgrade: true});
                  }}
                  style={{
                    width: '30%',
                    // height: 38,
                    padding: 15,
                    backgroundColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: AppColor.WHITE,
                      lineHeight: 18,
                      fontWeight: '500',
                    }}>
                    Enroll Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
   )}
      <WinnerModal setVisible={setVisible} visible={visible} />
    </>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: AppColor.Background_New,
  },
  userCard: {
    width: DeviceWidth * 0.95,
    height: DeviceHeigth * 0.1,
    alignSelf: 'center',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColor.Background_New,
  },
  itemContainer: {
    // flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    // marginHorizontal: 20,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  coinView: {
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinGradient: {
    flexDirection: 'row',

    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinImage: {
    height: 20,
    width: 20,
    marginRight: 5,
    // right: -DeviceWidth * 0.08,
    // zIndex: 1,
  },
  mainImage: {
    borderWidth: 0.5,
    borderColor: '#3333334D',
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  circle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{translateY: -100}], // Adjusting the Y-position to fit the circle in view
  },
  char: {
    color: 'green', // Text color as green
    fontSize: 20, // Size of the text
    fontWeight: 'bold', // Bold text
    // Shadow color with alpha

    height: 300, // Height of the container to ensure characters are positioned in a circle
    position: 'absolute',
  },
});
