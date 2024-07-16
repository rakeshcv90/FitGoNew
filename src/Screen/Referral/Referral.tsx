import {
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
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
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../Component/Config';
import FitText from '../../Component/Utilities/FitText';
import {RequestAPI} from '../../Component/Utilities/RequestAPI';
import {useSelector} from 'react-redux';
import Button from '../../Component/Button';
import Share, {ShareOptions, ShareSingleOptions} from 'react-native-share';
import {Circle, Line, Svg} from 'react-native-svg';
import VersionNumber from 'react-native-version-number';
import FitIcon from '../../Component/Utilities/FitIcon';
import ActivityLoader from '../../Component/ActivityLoader';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';

const Referral = () => {
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [referralData, setReferralData] = useState<any>({});
  useEffect(() => {
    getReferralCode();
    getReferralRank();
  }, []);

  const getReferralCode = () => {
    setLoader(true);
    RequestAPI.makeRequest(
      'POST',
      NewAppapi.GENERATE_REFERRAL_CODE,
      {
        user_id: getUserDataDetails?.id,
      },
      async (res: any) => {
        setLoader(false);
        if (res?.error) {
          setReferralCode('');
        } else {
          setReferralCode(res?.data?.code);
          setReferralLink(res.data?.link + '/' + res?.data?.code);
        }
      },
    );
  };
  const getReferralRank = () => {
    setLoader(true);
    RequestAPI.makeRequest(
      'GET',
      NewAppapi.GET_REF_RANK,
      {
        user_id: getUserDataDetails?.id,
        version: VersionNumber.appVersion,
      },
      async (res: any) => {
        setLoader(false);
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
      const options: ShareOptions = {
        message:
          'Download Fitme to earn 1000rs weekly use this referral code ' +
          referralCode,
        url: referralLink,
      };
      const result = await Share.open(options);
      if (result.success) {
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const shareWhatsApp = async () => {
    try {
      const options: ShareSingleOptions = {
        title: 'Share via',
        message:
          'Download Fitme to earn 1000rs weekly use this referral code ' +
          referralCode,
        url: referralLink,
        social: Share.Social.WHATSAPP,
        // whatsAppNumber: '919999999999', // country code + phone number
        // filename: 'test', // only for base64 file in Android
      };
      const result = await Share.shareSingle(options);
      if (result.success) {
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const clipboard = () => {
    Clipboard.setString(`link`);

    showMessage({
      message: 'Copy to Clipboard',
      type: 'success',
      animationDuration: 500,

      floating: true,
      icon: {icon: 'auto', position: 'left'},
    });
  };

  const Medal = ({rank, text, image}: any) => (
    <ImageBackground
      source={image}
      style={{
        left: text ? DeviceWidth * 0.02 : DeviceWidth * 0.04,
        top: text ? DeviceWidth * 0.01 : DeviceWidth * 0.04,
        width: DeviceWidth * 0.05,
        height: DeviceWidth * 0.05,
        alignItems: 'center',
      }}
      resizeMode="contain">
      <Text
        style={{
          top: DeviceHeigth >= 1024 ? DeviceWidth * 0.01 : 0,
          fontSize: DeviceHeigth >= 1024 ? 12 : 10,
          fontWeight: '700',
          fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
        }}>
        {rank}
        {/* {referralData?.current_rank?.rank} */}
      </Text>
    </ImageBackground>
  );

  const UserImage = ({rank, image, rank2}: any) => {
    const text =
      getUserDataDetails?.name.split(' ') &&
      getUserDataDetails.name.split(' ').length > 1
        ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
          getUserDataDetails?.name.split(' ')[1].substring(0, 1)
        : getUserDataDetails?.name.substring(0, 1);
    return (
      <>
        <View
          style={[
            styles.boxGreen,
            {
              width:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.9 : DeviceWidth * 0.82,
              height:
                DeviceHeigth >= 1024 ? DeviceHeigth * 0.1 : DeviceHeigth * 0.1,
            },
          ]}>
          {getUserDataDetails?.image_path == null ? (
            <View style={styles.textImage}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: DeviceHeigth >= 1024 ? 32 : 16,
                  // lineHeight: 40,
                  position: 'relative',
                  top: DeviceWidth * 0.025,
                  color: AppColor.WHITE,
                  textTransform: 'uppercase',
                }}>
                {text}
              </Text>
              <Medal rank={rank} text={true} image={image} />
            </View>
          ) : (
            <ImageBackground
              source={{uri: getUserDataDetails?.image_path}}
              imageStyle={{
                width: DeviceWidth * 0.07,
                height: DeviceWidth * 0.07,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: '#3333334D',
              }}>
              <Medal rank={rank} text={false} image={image} />
            </ImageBackground>
          )}
          <Text
            style={{
              left: DeviceHeigth >= 1024 ? '45%' : '25%',
              color: AppColor.BLACK,
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
              fontSize: 12,
              lineHeight: 16,
            }}>
            TO
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              right:
                getUserDataDetails?.image_path == null ? DeviceWidth * 0.05 : 0,
            }}>
            <Image
              source={localImage.FitCoin}
              style={{width: 30, height: 30}}
            />
            <FitText
              type="SubHeading"
              value={
                '+' +
                (referralData?.event_register?.fit_coins -
                  referralData?.current_rank?.fit_coins)
              }
              marginHorizontal={5}
            />
            {getUserDataDetails?.image_path == null ? (
              <View style={styles.textImage}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    fontSize: DeviceHeigth >= 1024 ? 32 : 16,
                    // lineHeight: 40,
                    position: 'relative',
                    top: DeviceWidth * 0.025,
                    color: AppColor.WHITE,
                    textTransform: 'uppercase',
                  }}>
                  {text}
                </Text>
                <Medal rank={rank} text={true} image={image} />
              </View>
            ) : (
              <ImageBackground
                source={{uri: getUserDataDetails?.image_path}}
                imageStyle={{
                  width: DeviceWidth * 0.07,
                  height: DeviceWidth * 0.07,
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: '#3333334D',
                }}>
                <Medal rank={rank2} text={false} image={localImage.Bronze} />
              </ImageBackground>
            )}
          </View>
        </View>
      </>
    );
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
        style={{flex: 1, marginHorizontal: 15}}>
        <Image
          source={localImage.Refer_banner}
          resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
          style={{
            width:
              DeviceHeigth >= 1024 ? DeviceWidth * 0.98 : DeviceWidth * 0.9,
            height: DeviceHeigth * 0.3,
            alignSelf: 'center',
          }}
        />
        <FitText
          type="SubHeading"
          value="Understand how referral works"
          fontSize={20}
          lineHeight={30}
          color={AppColor.BLACK}
          fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
        />
        <FitText
          type="SubHeading"
          value="Your rank"
          fontSize={20}
          lineHeight={30}
          marginVertical={10}
          color={AppColor.BLACK}
          fontFamily={Fonts.MONTSERRAT_MEDIUM}
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
              DeviceHeigth >= 1024 ? DeviceHeigth * 0.2 : DeviceHeigth * 0.2,
            width:
              DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingBottom: 15,
          }}>
          {getUserDataDetails?.image_path == null ? (
            <View
              style={[
                styles.textImage,
                {
                  width: DeviceWidth * 0.15,
                  height: DeviceWidth * 0.15,
                  backgroundColor: AppColor.WHITE,
                },
              ]}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: 32,
                  lineHeight: 40,
                  position: 'relative',
                  // top: PLATFORM_IOS ? DeviceWidth * 0.01 : DeviceWidth * 0.01,
                  color: AppColor.RED,
                  textTransform: 'uppercase',
                }}>
                {getUserDataDetails?.name.split(' ') &&
                getUserDataDetails.name.split(' ').length > 1
                  ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
                    getUserDataDetails?.name.split(' ')[1].substring(0, 1)
                  : getUserDataDetails?.name.substring(0, 1)}
              </Text>
            </View>
          ) : (
            <Image
              source={{uri: getUserDataDetails?.image_path}}
              style={{
                width: DeviceWidth * 0.15,
                height: DeviceWidth * 0.15,
                borderRadius: 100,
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
              value={'Your Rank is '}
              color={AppColor.WHITE}
              fontFamily={Fonts.MONTSERRAT_REGULAR}
              fontWeight="500">
              <FitText
                type="normal"
                value={referralData?.current_rank?.rank}
                color={AppColor.WHITE}
                fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                fontWeight="700"
              />
            </FitText>
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

        {/* <FitText
          type="SubHeading"
          color={AppColor.HEADERTEXTCOLOR}
          value="Note"
          fontSize={20}
          fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
          marginVertical={10}
        />
        <View
          style={[
            styles.boxGreen,
            {
              width:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
              height:
                DeviceHeigth >= 1024 ? DeviceHeigth * 0.1 : DeviceHeigth * 0.1,
            },
          ]}></View> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
          <View>
            <View
              style={{
                borderRadius: 20,
                width: 10,
                height: 10,
                backgroundColor: '#D9DBDC',
                marginTop:
                  DeviceHeigth >= 1024 ? (DeviceHeigth * 0.1) / 2.5 : 0,
              }}
            />
            {Array.from({
              length: DeviceHeigth >= 1024 ? 12 : DeviceHeigth <= 640 ? 8 : 9,
            }).map(() => {
              return <Text style={{color: '#D9DBDC', marginLeft: 3}}>|</Text>;
            })}
            <View
              style={{
                borderRadius: 20,
                width: 10,
                height: 10,
                backgroundColor: '#D9DBDC',
                // marginTop: DeviceHeigth >= 1024 ? (DeviceHeigth * 0.1) / 2 : 0,
              }}
            />
          </View>
          <View>
            <View
              style={{
                left: DeviceHeigth >= 1024 ? 0 : DeviceHeigth <= 640 ? -5 : 10,
                marginTop: DeviceHeigth >= 1024 ? 30 : -5,
              }}>
              <View
                style={{
                  width:
                    DeviceHeigth >= 1024
                      ? DeviceWidth * 0.9
                      : DeviceWidth * 0.9,
                  marginBottom: 10,
                }}>
                <FitText
                  type="SubHeading"
                  color={AppColor.HEADERTEXTCOLOR}
                  value="Only Register"
                  fontSize={20}
                  fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                />
                <Text style={styles.line}>
                  {'When your friend register only then you can earn ' +
                    (referralData?.register_rank?.fit_coins -
                      referralData?.current_rank?.fit_coins) +
                    ' '}
                  <Image
                    source={localImage.FitCoin}
                    style={{width: 20, height: 20, marginLeft: 5}}
                    resizeMode="contain"
                  />
                </Text>
              </View>
              <UserImage
                image={localImage.Silver}
                rank={referralData?.current_rank?.rank}
                rank2={referralData?.register_rank?.rank}
              />
            </View>
            <View
              style={{
                left: DeviceHeigth >= 1024 ? 0 : DeviceHeigth <= 640 ? -5 : 10,
                marginTop: DeviceHeigth >= 1024 ? 40 : 0,
              }}>
              <View
                style={{
                  width:
                    DeviceHeigth >= 1024
                      ? DeviceWidth * 0.9
                      : DeviceWidth * 0.9,
                  marginBottom: 10,
                }}>
                <FitText
                  type="SubHeading"
                  color={AppColor.HEADERTEXTCOLOR}
                  value="Join Event"
                  fontSize={20}
                  fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
                />
                <Text style={styles.line}>
                  {'When friend register and join you’ll earn ' +
                    (referralData?.event_register?.fit_coins -
                      referralData?.current_rank?.fit_coins) +
                    ' '}
                  <Image
                    source={localImage.FitCoin}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                </Text>
              </View>
              <UserImage
                image={localImage.Silver}
                rank={referralData?.current_rank?.rank}
                rank2={referralData?.event_register?.rank}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <TouchableOpacity style={styles.whatsapp} onPress={shareWhatsApp}>
            <FitIcon
              name="whatsapp"
              type="MaterialCommunityIcons"
              size={20}
              color={AppColor.WHITE}
            />
            <FitText
              type="SubHeading"
              value={` Refer Via WhatsApp`}
              color={AppColor.WHITE}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.share} onPress={share}>
            <FitIcon
              name="share-variant-outline"
              type="MaterialCommunityIcons"
              size={20}
              color={AppColor.RED}
            />
          </TouchableOpacity>
        </View>
        <FitText
          type="Heading"
          color={AppColor.HEADERTEXTCOLOR}
          value="Share you invite link"
          fontSize={20}
          fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
          marginVertical={5}
          marginHorizontal={10}
        />
        <FitText
          type="SubHeading"
          color="#333333B2"
          value="Referral Code"
          // fontSize={20}
          fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
          marginVertical={5}
          marginHorizontal={10}
        />
        <View
          style={[
            styles.refBox,
            {
              width:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
              paddingVertical: DeviceHeigth >= 1024 ? 20 : 10,
            },
          ]}>
          <FitText
            type="SubHeading"
            color={AppColor.BLACK}
            value={referralCode}
            textTransform="uppercase"
          />
          <FitIcon
            name="link"
            type="AntDesign"
            size={20}
            color={AppColor.BLACK}
            onPress={clipboard}
          />
        </View>
      </ScrollView>
      <ActivityLoader visible={loader} />
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
  boxGreen: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    paddingTop: 0,
    top: -10,
  },
  line: {
    color: '#333333B2',
    fontSize: 14,
    lineHeight: 25,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
  },
  refBox: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#D9D9D933',
    borderStyle: 'dashed',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: DeviceHeigth * 0.1,
  },
  share: {
    borderColor: AppColor.RED,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
  },
  whatsapp: {
    backgroundColor: '#128C7E',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  textImage: {
    backgroundColor: AppColor.RED,
    width: DeviceWidth * 0.07,
    height: DeviceWidth * 0.07,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
