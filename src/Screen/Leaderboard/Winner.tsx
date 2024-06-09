import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
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
import { appVersion } from 'react-native-version-number';

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
        url: `${NewAppapi.GET_LEADERBOARD}?user_id=${getUserDataDetails?.id}&version=${appVersion}`,
      });
      if (result.data) {
        // if (result.data?.data[0]?.id == 243) {
        if (result.data?.data[0]?.id == getUserDataDetails?.id) {
          setUserWinner(true);
          setWinnerData(result.data?.data[0]);
        } else {
          setUserWinner(false);
          const userIndex = result.data?.data?.findIndex(
            (item: TypeData) => item.id == getUserDataDetails?.id,
          );
          setWinnerData(result.data?.data[0]);
          setUserData(result.data?.data[userIndex]);
        }
        console.log('winnerData', userData?.name);
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
            bottom: bottom
              ? bottom
              : PLATFORM_IOS
              ? -DeviceWidth * 0.07
              : -DeviceWidth * 0.08,
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
            height: '120%',
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
            top: -20,
          }}
          resizeMode="contain"
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {winnerData?.image_path == null ? (
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                fontSize: 32,
                lineHeight: 40,
                position: 'relative',
                top: PLATFORM_IOS ? DeviceWidth * 0.05 : DeviceWidth * 0.06,
                color: AppColor.BLACK,
              }}>
              {winnerData?.name.substring(0, 1)}
            </Text>
          ) : (
            <Image
              source={{uri: winnerData?.image_path}}
              style={{width: '35%', height: '35%'}}
              resizeMode="contain"
            />
          )}
        </View>
        <Rank number={1} />
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: !userWinner ? AppColor.WHITE : AppColor.BLACK,
      }}>
      <DietPlanHeader
        header="Champions & Contenders"
        h={DeviceWidth * 0.15}
        paddingTop={PLATFORM_IOS ? DeviceHeigth * 0.025 : DeviceHeigth * 0.02}
        shadow
      />
      {userWinner ? (
        <View style={styles.container}>
          <View style={styles.box}>
            <View
              style={{
                width: '100%',
                padding: 10,
                height: 'auto',
                alignItems: 'center',
              }}>
              <WinnerBox />
              <View
                style={[
                  styles.row,
                  {
                    top: -10,
                  },
                ]}>
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
                Amazing job! You've won the challenge. Claim your well-deserved reward
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_BOLD,
                    fontWeight: '600',
                  }}>
                  Grab your Reward Now!
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('googlegmail://')}
                style={{
                  width: DeviceWidth * 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: AppColor.NEW_DARK_RED,
                  paddingVertical: 10,
                  position: 'relative',
                  top: PLATFORM_IOS ? 30 : 20,
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
        <View
          style={[
            styles.container,
            {
              backgroundColor: AppColor.WHITE,
              marginHorizontal: 0,
            },
          ]}>
          <View
            style={{
              marginTop: PLATFORM_IOS ? DeviceWidth * 0.1 : DeviceWidth * 0.2,
            }}>
            <WinnerBox />
          </View>
          <View
            style={{
              width: DeviceWidth * 0.95,
              borderRadius: 10,
              //   justifyContent: 'center',
              alignItems: 'center',
              height: DeviceHeigth * 0.35,
              overflow: 'hidden',
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
                marginVertical: 10,
              }}>
              <FitText
                type="normal"
                value={`Don’t quit – your best is yet to come!`}
                color={AppColor.WHITE}
              />
            </View>
            <View
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
                    color: AppColor.BLACK,
                  }}>
                  {userData?.name.substring(0, 1)}
                </Text>
              ) : (
                <Image
                  source={{uri: userData?.image_path}}
                  style={{width: '95%', height: '95%', borderRadius: 100}}
                  resizeMode="cover"
                />
              )}
            </View>
            <Rank
              number={userData?.fit_coins}
              bottom={PLATFORM_IOS ? DeviceWidth * 0.04 : DeviceWidth * 0.04}
            />

            <FitText
              type="SubHeading"
              value={userData?.name}
              color={AppColor.WHITE}
              fontFamily={Fonts.MONTSERRAT_BOLD}
              marginVertical={-3}
            />
            <FitText
              type="normal"
              value="👍 Keep Going!"
              color={AppColor.WHITE}
              fontWeight="400"
              marginVertical={2}
            />
            <TouchableOpacity
              onPress={() => {
                if (getPurchaseHistory) {
                  getPurchaseHistory?.plan_value == 30
                    ? navigation?.navigate('NewSubscription')
                    : getPurchaseHistory?.plan_value != 30 &&
                      getPurchaseHistory?.used_plan <=
                        getPurchaseHistory?.allow_usage &&
                      navigation?.navigate('UpcomingEvent');
                } else navigation?.navigate('NewSubscription');
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
        </View>
      )}
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
