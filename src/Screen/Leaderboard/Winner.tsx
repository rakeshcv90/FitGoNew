import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {localImage} from '../../Component/Image';
import FitText from '../../Component/Utilities/FitText';
import AnimatedLottieView from 'lottie-react-native';
import VersionNumber from 'react-native-version-number';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import ActivityLoader from '../../Component/ActivityLoader';
import DeviceInfo from 'react-native-device-info';

type TypeData = {
  name: string;
  fit_coins: number;
  id: number;
  image: string | null;
  rank: number;
  image_path: string | null;
};
const Winner = ({navigation}: any) => {
  const [winnerData, setWinnerData] = useState<TypeData>();
  const [userData, setUserData] = useState<TypeData>();
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userWinner, setUserWinner] = useState(false);

  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );

  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  useEffect(() => {
    setLoader(true);
    getLeaderboardDataAPI();
  }, []);

  const getLeaderboardDataAPI = async () => {
    try {
      const result = await axios({
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${VersionNumber.appVersion}`,
      });
      if (result.data) {
        if (result.data?.data[0]?.id == getUserDataDetails?.id) {
          setUserWinner(true);
          setWinnerData(result.data?.data[0]);
        } else {
          //setUserWinner(true);
          const userIndex = result.data?.data?.findIndex(
            (item: TypeData) => item.id == getUserDataDetails?.id,
          );
          setWinnerData(result.data?.data[0]);
          setUserData(result.data?.data[userIndex]);
        }
        console.log('winnerData', result.data?.data);
      }
      setLoader(false);
      setRefresh(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      setRefresh(false);
    }
  };

  const Rank = ({number, bottom}: any) => {
    return (
      <View
        style={[
          styles.Rank,
          {
            position: 'relative',
            top: bottom
              ? bottom
              : userWinner
              ? DeviceHeigth * 0.046
              : DeviceHeigth * 0.068,
          },
        ]}>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_MEDIUM,
            fontSize: 12,
            lineHeight: 16,
            color: AppColor.WHITE,
            transform: [{rotate: '-45deg'}],
          }}>
          {number}
        </Text>
      </View>
    );
  };

  const WinnerBox = () => {
    return (
      <View
        style={{
          width: DeviceWidth,
          padding: 10,
          //   height: 'auto',
          alignItems: 'center',
        }}>
        <Image
          source={localImage.WinnerBackground}
          style={{
            borderRadius: 10,
            width: '100%',
            height: '110%',
            position: 'absolute',
            top: -DeviceWidth * 0.15,
          }}
          resizeMode="cover"
        />
        <Image
          source={localImage.Winner}
          style={{
            width: '50%',
            height: '50%',
            position: 'absolute',
            marginVertical: DeviceHeigth * 0.05,
          }}
          resizeMode="contain"
        />
        <ImageBackground
          source={localImage.PinkGradient}
          tintColor={
            winnerData?.image_path == null ? '' : AppColor.NEW_DARK_RED
          }
          imageStyle={{
            width: '100%',
            height: '105%',
            borderRadius: 100,
            top: -2,
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '29%',
            height: '29%',
            top: DeviceHeigth * 0.09,
            position: 'relative',
            borderRadius: 100,
            left: 3,
          }}>
          {winnerData?.image_path == null ? (
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                fontSize: 32,
                lineHeight: 40,
                color: AppColor.WHITE,
                textTransform:'uppercase'
              }}>
              {winnerData?.name.split(' ') &&
              winnerData.name.split(' ').length > 1
                ? winnerData?.name.split(' ')[0].substring(0, 1) +
                  winnerData?.name.split(' ')[1].substring(0, 1)
                : winnerData?.name.substring(0, 1)}
            </Text>
          ) : (
            <Image
              source={{uri: winnerData?.image_path}}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 100,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
          )}
        </ImageBackground>
        <Rank number={1} bottom={DeviceHeigth * 0.075} />
        <View style={styles.row}>
          {userWinner ? (
            <AnimatedLottieView
              source={require('../../Icon/Images/InAppRewards/Winner.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.2,
                height: DeviceWidth * 0.5,
              }}
            />
          ) : (
            <View
              style={{
                width: DeviceWidth * 0.2,
                height: DeviceWidth * 0.5,
              }}
            />
          )}
          <View
            style={{
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: DeviceHeigth * 0.06,
            }}>
            <FitText
              type="SubHeading"
              value={winnerData?.name}
              color={AppColor.WHITE}
              fontFamily={Fonts.MONTSERRAT_BOLD}
            />
            <View style={styles.row}>
              <View
                style={{
                  width: DeviceWidth * 0.1,
                  height: 0.5,
                  backgroundColor: AppColor.WHITE,
                  marginRight: 5,
                }}
              />
              <FitText
                type="SubHeading"
                value="WINNER"
                color={AppColor.WHITE}
                fontFamily={Fonts.MONTSERRAT_REGULAR}
                fontWeight="400"
              />
              <View
                style={{
                  width: DeviceWidth * 0.1,
                  height: 0.5,
                  backgroundColor: AppColor.WHITE,
                  marginLeft: 5,
                }}
              />
            </View>
            <FitText type="SubHeading" value="₹1,000 Rupee" color="#F0A42C" />

            <View
              style={{
                width: DeviceWidth * 0.5,
                height: 0.5,
                backgroundColor: AppColor.WHITE,
                marginVertical: 5,
              }}
            />
            <FitText
              type="SubHeading"
              value={`Total: ${winnerData?.fit_coins} coins`}
              color="#fff"
            />
          </View>
          {userWinner ? (
            <AnimatedLottieView
              source={require('../../Icon/Images/InAppRewards/Winner.json')}
              speed={2}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: DeviceWidth * 0.2,
                height: DeviceWidth * 0.5,
              }}
            />
          ) : (
            <View
              style={{
                width: DeviceWidth * 0.2,
                height: DeviceWidth * 0.5,
              }}
            />
          )}
        </View>
      </View>
    );
  };
  const handleEmail = async () => {
    AnalyticsConsole('W_GMAIL');
    const supported = await Linking.canOpenURL('googlegmail://');
    console.log(supported)
    if (supported) Linking.openURL('googlegmail://');
    else if (PLATFORM_IOS) Linking.openURL('mailto:');
    else Linking.openURL('https://mail.google.com');
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: !userWinner ? AppColor.WHITE : AppColor.BLACK,
      }}>
      <DietPlanHeader
        header="Winner of the Week"
        h={DeviceWidth * 0.15}
        paddingTop={PLATFORM_IOS ? DeviceHeigth * 0.025 : DeviceHeigth * 0.02}
        shadow
      />
      {userWinner ? (
        <View style={styles.container}>
          <View style={styles.box}>
            <WinnerBox />
            <View
              style={{
                width: '100%',
                padding: 10,
                height: 'auto',
                alignItems: 'center',
                top: -DeviceHeigth * 0.05,
              }}>
              <View style={[styles.row, {}]}>
                <Image
                  source={localImage.WorlCup}
                  style={{width: 20, height: 20, marginRight: 5}}
                  resizeMode="contain"
                />
                <FitText
                  type="SubHeading"
                  value="Congratulations!"
                  fontFamily={Fonts.MONTSERRAT_BOLD}
                  color="#1E1E1E"
                />
                <Image
                  source={localImage.WorlCup}
                  style={{width: 20, height: 20, marginLeft: 5}}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  color: AppColor.BLACK,
                  fontFamily: Fonts.MONTSERRAT_REGULAR,
                  fontSize: 14,
                  lineHeight: 20,
                  fontWeight: '500',
                  textAlign: 'center',
                  width: '90%',
                  position: 'relative',
                  // top: 10,
                }}>
                Amazing job! You've won the challenge. Claim your well-deserved
                reward
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_BOLD,
                    fontWeight: '600',
                  }}>
                  Grab your Reward Now!
                </Text>
              </Text>
              <TouchableOpacity
                onPress={handleEmail}
                style={{
                  width: DeviceWidth * 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: AppColor.NEW_DARK_RED,
                  paddingVertical: 10,
                  position: 'relative',
                  marginVertical: PLATFORM_IOS ? 30 : 10,
                }}>
                <FitText
                  type="normal"
                  value="Check Email"
                  color={AppColor.WHITE}
                  fontFamily={Fonts.MONTSERRAT_MEDIUM}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          contentContainerStyle={[
            // styles.container,
            {
              backgroundColor: AppColor.WHITE,
              marginHorizontal: 0,
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: (DeviceHeigth * 0.1) / 2,
            },
          ]}>
          <View
            style={{
              width: DeviceWidth,
              padding: 10,
              height: DeviceHeigth * 0.4,
              alignItems: 'center',
            }}>
            <Image
              source={localImage.WinnerBackground}
              style={{
                borderRadius: 10,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: DeviceWidth * 0.02,
              }}
              resizeMode="cover"
            />
            <Image
              source={localImage.Winner}
              style={{
                width: '50%',
                height: '50%',
                position: 'absolute',
                marginVertical: DeviceHeigth * 0.02,
              }}
              resizeMode="contain"
            />
            <ImageBackground
              source={localImage.RedGradient}
              imageStyle={{
                width: DeviceHeigth * 0.12,
                height: DeviceHeigth * 0.12,
                top: 1,
                left: 1,
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: DeviceHeigth * 0.12,
                height: DeviceHeigth * 0.12,
                borderRadius: DeviceHeigth * 0.11,
                backgroundColor: AppColor.WHITE,
                overflow: 'hidden',
                top: DeviceHeigth * 0.048,
                left: 2,
              }}>
              {winnerData?.image_path == null ? (
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    fontSize: 32,
                    lineHeight: 40,
                    color: AppColor.WHITE,
                    textTransform:'uppercase'
                  }}>
                  {winnerData?.name.split(' ') &&
                  winnerData.name.split(' ').length > 1
                    ? winnerData?.name.split(' ')[0].substring(0, 1) +
                      winnerData?.name.split(' ')[1].substring(0, 1)
                    : winnerData?.name.substring(0, 1)}
                </Text>
              ) : (
                <Image
                  source={{uri: winnerData?.image_path}}
                  style={{
                    alignSelf: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              )}
            </ImageBackground>
            <Rank number={1} bottom={DeviceHeigth * 0.032} />
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: DeviceHeigth * 0.07,
              }}>
              <FitText
                type="SubHeading"
                value={winnerData?.name}
                color={AppColor.WHITE}
                fontFamily={Fonts.MONTSERRAT_BOLD}
              />
              <View style={styles.row}>
                <View
                  style={{
                    width: DeviceWidth * 0.1,
                    height: 0.5,
                    backgroundColor: AppColor.WHITE,
                    marginRight: 5,
                  }}
                />
                <FitText
                  type="SubHeading"
                  value="WINNER"
                  color={AppColor.WHITE}
                  fontFamily={Fonts.MONTSERRAT_REGULAR}
                  fontWeight="400"
                />
                <View
                  style={{
                    width: DeviceWidth * 0.1,
                    height: 0.5,
                    backgroundColor: AppColor.WHITE,
                    marginLeft: 5,
                  }}
                />
              </View>
              <FitText type="SubHeading" value="₹1,000 Rupee" color="#F0A42C" />

              <View
                style={{
                  width: DeviceWidth * 0.5,
                  height: 0.5,
                  backgroundColor: AppColor.WHITE,
                  marginVertical: 5,
                }}
              />
              <FitText
                type="SubHeading"
                value={`Total: ${winnerData?.fit_coins} coins`}
                color="#fff"
              />
            </View>
          </View>
          <View
            style={{
              width: DeviceWidth * 0.95,
              borderRadius: 10,
              //   justifyContent: 'center',
              alignItems: 'center',
              height: DeviceHeigth * 0.4,
              overflow: 'hidden',
              marginTop: DeviceWidth * 0.05,
            }}>
            <Image
              source={localImage.LoserBackground}
              style={{width: '100%', borderRadius: 10, position: 'absolute'}}
            />
            <View
              style={{
                backgroundColor: '#FFFFFF4D',
                borderRadius: 5,
                alignSelf: 'center',
                padding: 10,
                marginVertical: 12,
              }}>
              <FitText
                type="normal"
                value={`Don’t quit – your best is yet to come!`}
                color={AppColor.WHITE}
              />
            </View>
            <ImageBackground
              source={localImage.PinkGradient}
              tintColor={userData?.image_path == null ? '' : AppColor.WHITE}
              imageStyle={{height: 88, width: 88, left: 1, top: 1}}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 90,
                height: 90,
                width: 90,
                backgroundColor: AppColor.WHITE,
                overflow: 'hidden',
              }}>
              {userData?.image_path == null ? (
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    fontSize: 32,
                    lineHeight: 40,
                    position: 'relative',
                    top: PLATFORM_IOS ? DeviceWidth * 0.01 : DeviceWidth * 0.01,
                    color: AppColor.WHITE,
                    textTransform:'uppercase'
                  }}>
                  {userData?.name.split(' ') &&
                  userData.name.split(' ').length > 1
                    ? userData?.name.split(' ')[0].substring(0, 1) +
                      userData?.name.split(' ')[1].substring(0, 1)
                    : userData?.name.substring(0, 1)}
                </Text>
              ) : (
                <Image
                  source={{uri: userData?.image_path}}
                  style={{width: '95%', height: '95%', borderRadius: 100}}
                  resizeMode="cover"
                />
              )}
            </ImageBackground>
            <Rank number={userData?.rank} bottom={-DeviceHeigth * 0.02} />

            <FitText
              type="SubHeading"
              value={userData?.name}
              color={AppColor.WHITE}
              fontFamily={Fonts.MONTSERRAT_BOLD}
              marginVertical={-3}
            />
            <View style={{marginHorizontal: 10}}>
              <FitText
                type="normal"
                value={`Don’t lose hope! "Losing a challenge today means winning a stronger you Tomorrow!
              `}
                color={AppColor.WHITE}
                fontWeight="400"
                marginVertical={2}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                AnalyticsConsole(`TRA_WIN`);
                if (getPurchaseHistory) {
                  getPurchaseHistory?.plan_value == 30
                    ? navigation?.navigate('NewSubscription', {upgrade: true})
                    : getPurchaseHistory?.plan_value != 30 &&
                      getPurchaseHistory?.used_plan <=
                        getPurchaseHistory?.allow_usage &&
                      navigation?.navigate('UpcomingEvent');
                } else navigation?.navigate('NewSubscription', {upgrade: true});
              }}
              style={{
                width: DeviceWidth * 0.9,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                borderColor: AppColor.NEW_DARK_RED,
                backgroundColor: AppColor.WHITE,
                borderWidth: 1,
                paddingVertical: 12,
                position: 'relative',
                top: PLATFORM_IOS ? 12 : 6,
              }}>
              <FitText
                type="normal"
                value="Try Again"
                color={AppColor.NEW_DARK_RED}
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <ActivityLoader visible={loader} />
    </SafeAreaView>
  );
};

export default Winner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    zIndex: -1,
  },
  box: {
    width: DeviceWidth * 0.9,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    backgroundColor: AppColor.WHITE,
    height: DeviceHeigth * 0.6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Rank: {
    width: 25,
    height: 25,
    backgroundColor: '#F0A42C',
    transform: [{rotate: '45deg'}],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});
