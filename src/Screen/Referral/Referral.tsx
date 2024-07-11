import {
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import DietPlanHeader from '../../Component/Headers/DietPlanHeader';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import {useSelector} from 'react-redux';
import Button from '../../Component/Button';
import Share from 'react-native-share';
import {Circle, Line, Svg} from 'react-native-svg';
import VersionNumber from 'react-native-version-number';

const Referral = () => {
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [referralCode, setReferralCode] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [referralData, setReferralData] = useState<any>({});
  useEffect(() => {
    // getReferralCode();
    getReferralRank();
  }, []);

  const getReferralCode = () => {
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.GENERATE_REFERRAL_CODE,
      {
        user_id: getUserDataDetails?.id,
      },
      (res: any) => {
        if (res?.status == 200) {
          setReferralCode(res?.data?.code);
        }
      },
    );
  };
  const getReferralRank = () => {
    RequestAPI.makeRequest(
      'GET',
      NewAppapi.GET_REF_RANK,
      {
        user_id: getUserDataDetails?.id,
        version: VersionNumber.appVersion,
      },
      (res: any) => {
        if (res.error) {
          setReferralData({});
        } else {
          setReferralData(res.data);
        }
      },
    );
  };

  const share = async () => {
    try {
      const options = {
        message:
          'Download Fitme to earn 1000rs weekly use this referral code ' +
          referralCode,
        url: 'https://fitme.cvinfotech.in/' + referralCode,
      };
      const result = await Share.open(options);
      if (result.success) {
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: AppColor.WHITE,
        flex: 1,
      }}>
      <DietPlanHeader
        h={
          Platform.OS == 'ios'
            ? (DeviceHeigth * 10) / 100
            : (DeviceHeigth * 7) / 100
        }
        header=""
        shadow
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={getReferralRank} />
        }
        style={{flex: 1, marginHorizontal: 20}}>
        <Image
          source={localImage.Refer_banner}
          resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
          style={{
            width:
              DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
            height:
              DeviceHeigth >= 1024 ? DeviceHeigth * 0.3 : DeviceHeigth * 0.25,
            alignSelf: 'center',
          }}
        />
        <FitText
          type="SubHeading"
          value="Invite all your friends to Fitme"
          fontSize={20}
          lineHeight={30}
          marginVertical={10}
          color={AppColor.BLACK}
          fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
        />
        <ImageBackground
          source={localImage.Referral_Coin_Banner}
          resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
          imageStyle={{
            width:
              DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
            // height:
            //   DeviceHeigth >= 1024 ? DeviceHeigth * 0.2 : DeviceHeigth * 0.25,
            alignSelf: 'center',
          }}
          style={{
            height:
              DeviceHeigth >= 1024 ? DeviceHeigth * 0.2 : DeviceHeigth * 0.25,
            width: DeviceWidth * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 15,
          }}>
          {getUserDataDetails?.image_path == null ? (
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_MEDIUM,
                fontSize: 32,
                lineHeight: 40,
                position: 'relative',
                top: PLATFORM_IOS ? DeviceWidth * 0.01 : DeviceWidth * 0.01,
                color: AppColor.WHITE,
                textTransform: 'uppercase',
              }}>
              {getUserDataDetails?.name.split(' ') &&
              getUserDataDetails.name.split(' ').length > 1
                ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
                  getUserDataDetails?.name.split(' ')[1].substring(0, 1)
                : getUserDataDetails?.name.substring(0, 1)}
            </Text>
          ) : (
            <Image
              source={{uri: getUserDataDetails?.image_path}}
              style={{
                width: DeviceWidth * 0.15,
                height: DeviceWidth * 0.15,
                borderRadius: 40,
              }}
            />
          )}
          <ImageBackground
            source={localImage.Silver}
            imageStyle={
              {
                // width: 70,
                // height: 20,
              }
            }
            style={{
              marginLeft: -20,
              width: DeviceWidth * 0.15,
              height: DeviceWidth * 0.15,
              alignItems: 'center',
            }}
            resizeMode="contain">
            <Text
              style={{
                top: DeviceHeigth >= 1024 ? DeviceWidth * 0.03 : 8,
                fontSize: DeviceHeigth >= 1024 ? 30 : 20,
                fontWeight: '700',
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
              }}>
              {referralData?.current_rank?.rank}
            </Text>
          </ImageBackground>
          <View
            style={{
              marginLeft: -20,
            }}>
            <FitText
              type="SubHeading"
              value={getUserDataDetails?.name}
              color={AppColor.WHITE}
              fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
            />
            <FitText
              type="normal"
              value={'Your Rank is ' + referralData?.current_rank?.rank}
              color={AppColor.WHITE}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={localImage.FitCoin}
              style={{width: 40, height: 40}}
              resizeMode="contain"
            />
            <FitText
              type="SubHeading"
              value={referralData?.current_rank?.fit_coins}
              color={AppColor.WHITE}
            />
          </View>
        </ImageBackground>
        {/* <Svg style={{backgroundColor: 'red',position: 'relative',}}>
              <Circle
                cx={(DeviceHeigth * 0.07) / 5}
                cy="10"
                r="5"
                stroke="#D9DBDC"
                strokeWidth="2.5"
                fill="#D9DBDC"
              />
              <Line
                y1="10"
                x1={(DeviceHeigth * 0.07) / 5}
                y2="40%"
                x2={(DeviceHeigth * 0.07) / 5}
                stroke="#D9DBDC"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <Circle
                cx={(DeviceHeigth * 0.07) / 5}
                cy="40%"
                r="5"
                stroke="#D9DBDC"
                strokeWidth="2.5"
                fill="#D9DBDC"
              />
            </Svg> */}
        <View
          style={{
            left: 30,
            marginTop: DeviceHeigth >= 1024 ? 30 : -10,
            width: DeviceWidth * 0.8,
          }}>
          <View style={{}}>
            <FitText
              type="SubHeading"
              color={AppColor.HEADERTEXTCOLOR}
              value="Only Register"
              fontSize={20}
              fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
            />
            <FitText
              type="normal"
              value="When your friend register only then you can"
              color="#333333B2"
              lineHeight={20}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FitText
                type="normal"
                value={
                  'earn ' +
                  (referralData?.event_register?.fit_coins -
                    referralData?.current_rank?.fit_coins)
                }
                fontFamily={Fonts.MONTSERRAT_MEDIUM}
              />
              <Image
                source={localImage.FitCoin}
                style={{width: 20, height: 20, marginLeft: 2}}
                resizeMode="contain"
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#f9f9f9',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              width: DeviceWidth * 0.8,
              borderRadius: 20,
              // height: DeviceWidth*0.2,
              marginVertical: 10,
            }}>
            <View>
              {getUserDataDetails?.image_path == null ? (
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      fontSize: 32,
                      lineHeight: 40,
                      position: 'relative',
                      // top: PLATFORM_IOS ? DeviceWidth * 0.01 : DeviceWidth * 0.01,
                      // color: AppColor.WHITE,
                      textTransform: 'uppercase',
                    }}>
                    {getUserDataDetails?.name.split(' ') &&
                    getUserDataDetails.name.split(' ').length > 1
                      ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
                        getUserDataDetails?.name.split(' ')[1].substring(0, 1)
                      : getUserDataDetails?.name.substring(0, 1)}
                  </Text>

                  <ImageBackground
                    source={localImage.Silver}
                    imageStyle={
                      {
                        // width: 70,
                        // height: 20,
                      }
                    }
                    style={{
                      left: 25,
                      top: -15,
                      width: DeviceWidth * 0.05,
                      height: DeviceWidth * 0.05,
                      alignItems: 'center',
                    }}
                    resizeMode="contain">
                    <Text
                      style={{
                        // top: DeviceHeigth >= 1024 ? DeviceWidth * 0.03 : 8,
                        fontSize: 10,
                        fontWeight: '700',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      }}>
                      20
                    </Text>
                  </ImageBackground>
                </View>
              ) : (
                <ImageBackground
                  source={{uri: getUserDataDetails?.image_path}}
                  imageStyle={{
                    width: DeviceWidth * 0.1,
                    height: DeviceWidth * 0.1,
                    borderRadius: 40,
                    borderWidth: 1,
                    borderColor: '#3333334D',
                  }}>
                  <ImageBackground
                    source={localImage.Silver}
                    imageStyle={
                      {
                        // width: 70,
                        // height: 20,
                      }
                    }
                    style={{
                      left: 25,
                      top: 25,
                      width: DeviceWidth * 0.05,
                      height: DeviceWidth * 0.05,
                      alignItems: 'center',
                    }}
                    resizeMode="contain">
                    <Text
                      style={{
                        // top: DeviceHeigth >= 1024 ? DeviceWidth * 0.03 : 8,
                        fontSize: 10,
                        fontWeight: '700',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      }}>
                      20
                    </Text>
                  </ImageBackground>
                </ImageBackground>
              )}
            </View>
            <View>
              {getUserDataDetails?.image_path == null ? (
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.MONTSERRAT_MEDIUM,
                      fontSize: 32,
                      lineHeight: 40,
                      position: 'relative',
                      // top: PLATFORM_IOS ? DeviceWidth * 0.01 : DeviceWidth * 0.01,
                      // color: AppColor.WHITE,
                      textTransform: 'uppercase',
                    }}>
                    {getUserDataDetails?.name.split(' ') &&
                    getUserDataDetails.name.split(' ').length > 1
                      ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
                        getUserDataDetails?.name.split(' ')[1].substring(0, 1)
                      : getUserDataDetails?.name.substring(0, 1)}
                  </Text>

                  <ImageBackground
                    source={localImage.Silver}
                    imageStyle={
                      {
                        // width: 70,
                        // height: 20,
                      }
                    }
                    style={{
                      left: 25,
                      top: -15,
                      width: DeviceWidth * 0.05,
                      height: DeviceWidth * 0.05,
                      alignItems: 'center',
                    }}
                    resizeMode="contain">
                    <Text
                      style={{
                        // top: DeviceHeigth >= 1024 ? DeviceWidth * 0.03 : 8,
                        fontSize: 10,
                        fontWeight: '700',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      }}>
                      20
                    </Text>
                  </ImageBackground>
                </View>
              ) : (
                <ImageBackground
                  source={{uri: getUserDataDetails?.image_path}}
                  imageStyle={{
                    width: DeviceWidth * 0.1,
                    height: DeviceWidth * 0.1,
                    borderRadius: 40,
                    borderWidth: 1,
                    borderColor: '#3333334D',
                  }}>
                  <ImageBackground
                    source={localImage.Silver}
                    imageStyle={
                      {
                        // width: 70,
                        // height: 20,
                      }
                    }
                    style={{
                      left: 25,
                      top: 25,
                      width: DeviceWidth * 0.05,
                      height: DeviceWidth * 0.05,
                      alignItems: 'center',
                    }}
                    resizeMode="contain">
                    <Text
                      style={{
                        // top: DeviceHeigth >= 1024 ? DeviceWidth * 0.03 : 8,
                        fontSize: 10,
                        fontWeight: '700',
                        fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                      }}>
                      20
                    </Text>
                  </ImageBackground>
                </ImageBackground>
              )}
            </View>
          </View>
        </View>
        {/* 
        <FitText
          type="SubHeading"
          color={AppColor.HEADERTEXTCOLOR}
          value="earn 150 coins"
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: AppColor.RED,
            backgroundColor: AppColor.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: 10,
            marginVertical: DeviceWidth / 8,
            width: DeviceWidth / 2,
          }}>
          <FitText
            type="SubHeading"
            color={AppColor.HEADERTEXTCOLOR}
            value={referralCode}
            textTransform="uppercase"
          />
        </View>
        <Button buttonText="Share" onPresh={share} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Referral;

const styles = StyleSheet.create({
  svg: {
    position: 'relative',
    width: DeviceWidth * 0.5,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
