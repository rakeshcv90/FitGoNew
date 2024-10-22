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
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import {useDispatch, useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import axios from 'axios';
import VersionNumber from 'react-native-version-number';
import AnimatedLottieView from 'lottie-react-native';
import LoadingScreen from '../../Component/NewHomeUtilities/LoadingScreen';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import Share, {ShareOptions, ShareSingleOptions} from 'react-native-share';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import LeaderBoardTopComponent from './LeaderBoardTopComponent';
import PastWinnersComponent from './PastWinnersComponent';
import LeaderBoardProgressComopnent from './LeaderBoardProgressComopnent';

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
  const [referralLink, setReferralLink] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [pastWinners, setPastWinners] = useState([]);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coins, setCoins] = useState({});
  const [winnerData, setWinnerData] = useState();
  const getBanners = useSelector((state: any) => state?.getBanners);
  const enteredUpcomingEvent = useSelector((state: any) => state?.enteredUpcomingEvent);
  const enteredCurrentEvent = useSelector(
    (state: any) => state?.enteredCurrentEvent,
  );
  const Sat = getPurchaseHistory?.currentDay == 6;
  const Sun = getPurchaseHistory?.currentDay == 0;
  useEffect(() => {
    setLoader(true);
    getLeaderboardDataAPI();
    getPastWinner();
    getReferralCode();
    enteredCurrentEvent && getEarnedCoins();
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
        if (
          result.data.winner_announced == true &&
          top5[0].id == getUserDataDetails.id
        ) {
          setVisible(true);
        }

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
    // const url =
    //   'https://fitme.cvinfotechserver.com/adserver/public/api/past_winners';
    RequestAPI.makeRequest(
      'POST',
      // url,
      NewAppapi.GET_PAST_WINNERS,
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
  const getReferralCode = () => {
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.GENERATE_REFERRAL_CODE,
      {
        user_id: getUserDataDetails?.id,
      },
      async (res: any) => {
        setLoader(false);
        if (res?.error) {
        } else {
          setReferralLink(res.data?.link);
        }
      },
    );
  };
  const WinnerModal = ({setVisible, visible, mainData}: any) => {
    const shareWinnerMessage = async () => {
      try {
        const options: ShareOptions = {
          message: `I just won the fitness challenge with the FitMe app and earned a voucher! 🎉 You can win too—download the FitMe app now and start earning amazing rewards.
          Download the App Now: ${referralLink} `,
        };
        const result = await Share.open(options);
        if (result.success) {
          // console.log(result);
        }
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        visible={visible}
        onRequestClose={() => {
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
                height:
                  DeviceHeigth <= 625
                    ? DeviceHeigth * 0.9
                    : DeviceHeigth >= 1024
                    ? DeviceHeigth * 0.75
                    : DeviceHeigth * 0.8,

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
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                    overflow: 'hidden',
                  }}>
                  {mainData[0]?.image_path == null ? (
                    <View
                      style={{
                        width: 90,
                        height: 90,
                        left: -33,

                        marginTop: -25,
                        borderRadius: 90,
                        zIndex: -1,
                        overflow: 'hidden',
                        // overflow: 'hidden',
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
                        {mainData[0]?.name.substring(0, 2).toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      resizeMode="stretch"
                      source={{uri: mainData[0]?.image_path}}
                      //source={localImage.NContact}
                      style={{
                        width:
                          DeviceHeigth <= 625
                            ? 75
                            : DeviceHeigth >= 1024
                            ? 110
                            : 90,
                        height:
                          DeviceHeigth <= 625
                            ? 90
                            : DeviceHeigth >= 1024
                            ? 110
                            : 90,
                        left:
                          DeviceHeigth <= 625
                            ? -28
                            : DeviceHeigth >= 1024
                            ? -40
                            : -33,

                        marginTop: -25,
                        borderRadius: 80,
                        zIndex: -1,
                        overflow: 'hidden',
                      }}
                    />
                  )}
                </ImageBackground>
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
              <Text
                style={{
                  fontFamily: Fonts.HELVETICA_BOLD,
                  fontSize: 16,
                  lineHeight: 20,
                  textAlign: 'center',
                  top:
                    DeviceHeigth >= 1024 ? 20 : DeviceHeigth <= 625 ? 10 : 20,
                  color: AppColor.PrimaryTextColor,
                }}>
                {mainData[0]?.name}
              </Text>
              <Image
                source={require('../../Icon/Images/NewHome/price.png')}
                resizeMode="contain"
                style={{
                  width: 100,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 15,
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
                    fontFamily: Fonts.HELVETICA_BOLD,
                    fontSize: 14,
                    lineHeight: 20,
                    top: -10,
                    textAlign: 'center',
                    color: AppColor.PrimaryTextColor,
                  }}>
                  You're this week's winner!
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.HELVETICA_REGULAR,
                    fontSize: 14,
                    lineHeight: 20,
                    top: -5,
                    textAlign: 'center',
                    color: AppColor.PrimaryTextColor,
                  }}>
                  Check your email to claim your prize and don’t forget to share
                  your achievement on social media!
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  shareWinnerMessage();
                }}
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
                  Share Now
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    );
  };

  const getEarnedCoins = async () => {
    // const url =
    //   'https://fitme.cvinfotechserver.com/adserver/public/api/test_exercise_points_day';
    try {
      const response = await axios(
        `${NewAppapi.GET_COINS}?user_id=${getUserDataDetails?.id}&day=${
          WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
        }`,
      );
      // const response = await axios(
      //   `${url}?user_id=${getUserDataDetails?.id}&day=${
      //     WeekArrayWithEvent[getPurchaseHistory?.currentDay - 1]
      //   }`,
      // );
      {
        // console.log(
        //   'gggggggggggg',
        //   enteredCurrentEvent,
        //   WeekArrayWithEvent,
        //   getPurchaseHistory?.currentDay - 2,
        // );
      }
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
          <Wrapper styles={{backgroundColor: AppColor.Background_New}}>
            <NewHeader1
              header={'Leaderboard'}
              backButton
              onBackPress={() => {
                navigation?.goBack();
              }}
              IconComponent={() => (
                <>
                  {enteredCurrentEvent ? (
                    <TouchableOpacity
                      onPress={() =>
                        //setVisible(true)
                        navigation.navigate('Referral')
                      }
                      style={{
                        // height: 45,
                        backgroundColor: AppColor.RED,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 10,
                        position: 'absolute',
                        right: 0,
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
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.HELVETICA_REGULAR,
                            fontSize: 12,
                            lineHeight: 12,
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
                              lineHeight: 13,
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
                  ) : (
                    <View
                      style={{
                        height: 40,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: 10,
                        //backgroundColor:'red',
                        width: 50,
                        paddingRight: 10,
                        position: 'absolute',
                        right: 0,
                      }}
                    />
                  )}
                </>
              )}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={() => {
                    getLeaderboardDataAPI();
                    getPastWinner();
                    enteredCurrentEvent && getEarnedCoins();
                    setLoader(true);
                  }}
                  colors={[AppColor.RED, AppColor.WHITE]}
                />
              }
              style={[styles.container, {marginTop: 10}]}
              nestedScrollEnabled>
              <LeaderBoardTopComponent
                data={mainData}
                listData={otherData}
                totalData={totalData}
              />
              <PastWinnersComponent
                pastWinners={pastWinners}
                navigation={navigation}
              />
              {enteredCurrentEvent ? (
                (Sat || Sun) != true ? (
                  <LeaderBoardProgressComopnent
                    weekArray={WeekArrayWithEvent}
                    coins={coins}
                    getPurchaseHistory={getPurchaseHistory}
                    getWeeklyPlansData={getWeeklyPlansData}
                    navigation={navigation}
                  />
                ) : null
              ) : enteredUpcomingEvent ? null : (
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
                    Join the Weekly Challenge to Win the Exciting Prizes!
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: 20,
                      borderRadius: 20,
                      height: DeviceHeigth * 0.2,
                    }}>
                    <Image
                      source={{uri: getBanners.new_join}}
                      resizeMode="stretch"
                      style={{width: '95%', height: '100%', borderRadius: 20}}
                    />
                  </View>
                  <View
                    style={{
                      width: '95%',
                      alignSelf: 'center',
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
                        Missed this week's challenge? No worries! Join next week
                        to win big prizes!
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (getPurchaseHistory?.plan) {
                          navigation.navigate('UpcomingEvent', {
                            eventType: 'upcoming',
                          });
                        } else {
                          navigation.navigate('StepGuide');
                        }
                      }}
                      style={{
                        //width: '30%',
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
          </Wrapper>
        </View>
      )}
      <WinnerModal
        setVisible={setVisible}
        visible={visible}
        mainData={mainData}
      />
    </>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
