import {
  Image,
  ImageBackground,
  Platform,
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
import Share, {ShareOptions, ShareSingleOptions} from 'react-native-share';
import VersionNumber from 'react-native-version-number';
import FitIcon from '../../Component/Utilities/FitIcon';
import ActivityLoader from '../../Component/ActivityLoader';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import NewHeader from '../../Component/Headers/NewHeader';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import NewHeader1 from '../../Component/Headers/NewHeader1';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          setReferralCode(res?.data?.code?.toUpperCase());
          setReferralLink(res.data?.link);
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
        message: `Win amazing voucher rewards every week
        1. Just download the Fitme app from here: ${referralLink}
        2. Use my referral code to register: ${referralCode}
        3. Take part in the fitness challenge and win amazing weekly voucher rewards.`,
        // url: referralLink,
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
        message: `Win amazing voucher rewards every week
          1. Just download the Fitme app from here: ${referralLink}
          2.Use my referral code to register: ${referralCode}
          3. Take part in the fitness challenge and win amazing weekly voucher rewards.`,
        // url: referralLink,
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
    Clipboard.setString(referralCode);

    showMessage({
      message: 'Copy to Clipboard',
      type: 'success',
      animationDuration: 500,

      floating: true,
      icon: {icon: 'auto', position: 'left'},
    });
  };

  const Medal = ({rank, text, image, position}: any) => (
    <ImageBackground
      source={image}
      style={{
        left: text ? DeviceWidth * 0.02 : DeviceWidth * 0.04,
        top: text ? DeviceWidth * 0.01 : DeviceWidth * 0.04,
        width: DeviceWidth * 0.05,
        height: DeviceWidth * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        position: position ?? 'relative',
        zIndex: 10,
      }}
      resizeMode="contain">
      <Text
        style={{
          top: DeviceHeigth >= 1024 ? DeviceWidth * 0.01 : -2,
          fontSize: DeviceHeigth >= 1024 ? 12 : 10,
          fontWeight: '700',
          fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
          color: AppColor.BLACK
        }}>
        {rank}
        {/* {referralData?.current_rank?.rank} */}
      </Text>
    </ImageBackground>
  );
  const ProgressCard = ({rank, image, rank2}) => {
    const text =
      getUserDataDetails?.name.split(' ') &&
      getUserDataDetails.name.split(' ').length > 1
        ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
          getUserDataDetails?.name.split(' ')[1].substring(0, 1)
        : getUserDataDetails?.name.substring(0, 1);
    return (
      <View
        style={[
          styles.cardView,
          {
            height:
              DeviceHeigth >= 1024 ? DeviceHeigth * 0.11 : DeviceHeigth * 0.1,
          },
        ]}>
        <View style={{top: DeviceHeigth >= 1024 ? -5 : -5}}>
          {getUserDataDetails?.image_path == null ? (
            <View style={styles.textImage}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: DeviceHeigth >= 1024 ? 32 : 16,
                  position: 'relative',
                  top: DeviceWidth * 0.025,
                  color: AppColor.WHITE,
                  textTransform: 'uppercase',
                }}>
                {text}
              </Text>
              <Medal rank={rank?.rank} text={true} image={image} />
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
              <Medal rank={rank?.rank} text={false} image={image} />
            </ImageBackground>
          )}
        </View>
        <Text
          style={{
            color: AppColor.BLACK,
            fontFamily: 'Helvetica',
            marginLeft: DeviceWidth * 0.07,
            fontSize: 13,
          }}>
          TO
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={localImage.FitCoin}
            style={{width: DeviceWidth * 0.09, height: DeviceWidth * 0.09}}
          />
          {rank2?.fit_coins ? (
            <FitText
              type="SubHeading"
              value={'+' + (rank2?.fit_coins - rank?.fit_coins)}
              marginHorizontal={5}
            />
          ):<FitText
          type="SubHeading"
          value={'+0' }
          marginHorizontal={5}
        />}
          {getUserDataDetails?.image_path == null ? (
            <View style={styles.textImage}>
              <Text
                style={{
                  fontFamily: Fonts.MONTSERRAT_MEDIUM,
                  fontSize: DeviceHeigth >= 1024 ? 32 : 16,
                  position: 'relative',
                  top: DeviceWidth * 0.025,
                  color: AppColor.WHITE,
                  textTransform: 'uppercase',
                }}>
                {text}
              </Text>
              <Medal rank={rank2?.rank} text={true} image={image} />
            </View>
          ) : (
            <View>
              <ImageBackground
                source={{uri: getUserDataDetails?.image_path}}
                style={[
                  styles.textImage,
                  {borderRadius: 100, overflow: 'hidden'},
                ]}></ImageBackground>
              <Medal
                rank={rank2?.rank}
                text={false}
                image={localImage.Bronze}
                position={'absolute'}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar
      translucent
      backgroundColor={'transparent'}
      barStyle={'dark-content'}
    />
      {loader ? <ActivityLoader /> : null}
     <Wrapper styles={{backgroundColor:AppColor.WHITE}}>
     <NewHeader1 backButton header={'Refer & Earn'} />
     <ScrollView>
        <View style={styles.imgView}>
          <Image
            source={localImage.Refer_banner}
            resizeMode="stretch"
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <Text style={styles.txt1}>Understand How Referral Works</Text>
        <Text style={[styles.txt1, {fontSize: 15}]}>Your Rank</Text>
        <ImageBackground
          source={localImage.Referral_Coin_Banner}
          resizeMode="stretch"
          style={[
            styles.imgView1,
            {
              height:
                DeviceHeigth >= 1024
                  ? DeviceHeigth * 0.2
                  : DeviceHeigth <= 640
                  ? DeviceHeigth * 0.15
                  : DeviceHeigth * 0.12,
            },
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {getUserDataDetails?.image_path == null ? (
              <View
                style={[
                  styles.textImage,
                  {
                    width: DeviceWidth * 0.13,
                    height: DeviceWidth * 0.13,
                    backgroundColor: AppColor.WHITE,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: Fonts.MONTSERRAT_MEDIUM,
                    fontSize: 25,
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
                  width: DeviceWidth * 0.13,
                  height: DeviceWidth * 0.13,
                  borderRadius: 100,
                }}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: DeviceWidth * 0.05,
              }}>
              <ImageBackground
                source={localImage.Silver}
                style={{
                  height: DeviceHeigth * 0.09,
                  width: DeviceWidth * 0.09,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                resizeMode="contain">
                <Text style={{marginBottom: 10}}>
                  {referralData?.current_rank?.rank ?? 0}
                </Text>
              </ImageBackground>
              <View style={{marginLeft: 20}}>
                <FitText
                  type="SubHeading"
                  value={getUserDataDetails?.name?.split(' ')[0]}
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
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <Image
              source={localImage.FitCoin}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
            <FitText
              type="SubHeading"
              value={referralData?.current_rank?.fit_coins}
              color={AppColor.WHITE}
            />
          </View>
        </ImageBackground>
        <View
          style={{
            borderWidth: 1.5,
            borderRadius: 10,
            padding: 10,
            marginBottom: DeviceHeigth >= 1024 ? 20 : 24,
            borderColor: AppColor.GRAY1,
            backgroundColor: AppColor.GRAY,
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            // marginTop:-10
          }}>
          <Text
            style={{
              color: 'grey',
              fontFamily: Fonts.MONTSERRAT_MEDIUM,
            }}>
            <Text
              style={{
                fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
                fontSize: 15,
                color: '#333333B2',
              }}>
              Note:{' '}
            </Text>{' '}
            You must be in the current event to receive referral benefits. New event starts every Monday and ends on Friday.
          </Text>
        </View>
        <View
          style={{
            width: DeviceWidth * 0.95,
            alignSelf: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}>
          {/* <View
            style={{
              borderRadius: 20,
              width: 10,
              height: 10,
              backgroundColor: '#D9DBDC',
              marginRight: 10,
            }}
          /> */}
          <View
            style={{
              width: DeviceWidth * 0.95,
              alignSelf: 'center',
            }}>
            <View>
              <Text
                style={[
                  styles.txt1,
                  {
                    top: DeviceHeigth >= 1024 ? -10 : -20,
                    marginBottom: DeviceHeigth < 1024 ? -DeviceWidth * 0.03 : 0,
                    // marginLeft: 20,
                  },
                ]}>
                {' '}
                Register
              </Text>
              <Text style={[styles.line, {marginLeft: 12}]}>
                When your friend registers for the event only then you can
                <Text
                  style={{color: AppColor.RED, fontFamily: 'Helvetica-Bold'}}>
                  {' '}
                  {referralData?.register_rank?.fit_coins -
                    referralData?.current_rank?.fit_coins}{' '}
                  Fitcoins
                </Text>
              </Text>
              {/* <Image
                  source={localImage.FitCoin}
                  style={{width: 20, height: 20}}
                  // resizeMode="contain"
                /> */}
            </View>
            <ProgressCard
              image={localImage.Silver}
              rank={referralData?.current_rank}
              rank2={referralData?.register_rank}
            />
            <Text style={[styles.txt1, {}]}>Join Event</Text>
          </View>

          {/* <View
            style={{
              borderRadius: 20,
              width: 10,
              height: 10,
              backgroundColor: '#D9DBDC',
            }}
          /> */}
          <Text style={[styles.line, {marginLeft: 5}]}>
            When your friend registers and join the event then you’ll earn
            <Text style={{color: AppColor.RED, fontFamily: 'Helvetica-Bold'}}>
              {' '}
              {referralData?.event_register?.fit_coins -
                referralData?.current_rank?.fit_coins}{' '}
              Fitcoins
            </Text>
            {/* <Image
              source={localImage.FitCoin}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            /> */}
          </Text>
          <ProgressCard
            image={localImage.Silver}
            rank={referralData?.current_rank}
            rank2={referralData?.event_register}
          />
        </View>
        <Text style={[styles.txt1, {marginVertical: 14}]}>
          Share your invite link
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: DeviceWidth * 0.93,
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            style={[
              styles.whatsapp,
              {
                width:
                  DeviceHeigth >= 1024 ? DeviceWidth * 0.8 : DeviceWidth * 0.75,
              },
            ]}
            onPress={share}>
            <FitText
              type="SubHeading"
              color={AppColor.BLACK}
              value={referralCode}
              textTransform="uppercase"
              marginHorizontal={10}
            />
            <FitIcon
              name="link"
              type="AntDesign"
              size={20}
              color={AppColor.BLACK}
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
        {/* <Text
          style={[
            styles.txt1,
            {fontFamily: 'Helvetica', color: AppColor.Gray5},
          ]}>
          Referral code
        </Text>
        <View
          style={[
            styles.refBox,
            {
              width:
                DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.95,
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
        </View> */}
      </ScrollView>
     </Wrapper>
    </SafeAreaView>
  );
};

export default Referral;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
  imgView: {
    height: DeviceHeigth * 0.22,
    width: DeviceWidth * 0.95,
    alignSelf: 'center',
    marginBottom: DeviceHeigth * 0.03,
  },
  imgView1: {
    width: DeviceWidth * 0.95,
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: DeviceHeigth * 0.03,
  },
  cardView: {
    width: DeviceWidth * 0.95,
    height: 100,
    backgroundColor: AppColor.GRAY,
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    // marginLeft: 14,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  txt1: {
    color: AppColor.BLACK,
    fontFamily: 'Helvetica-Bold',
    fontSize: 17,
    width: DeviceWidth * 0.93,
    alignSelf: 'center',
    marginBottom: DeviceWidth * 0.03,
  },
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
    // padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    // paddingTop: 0,
    // top: -10,
  },
  line: {
    color: '#333333B2',
    fontSize: 14,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    lineHeight: 20,
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
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#D9D9D933',
    borderStyle: 'dashed',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    width: DeviceWidth * 0.75,
  },
  textImage: {
    backgroundColor: AppColor.RED,
    width: DeviceWidth * 0.07,
    height: DeviceWidth * 0.07,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
