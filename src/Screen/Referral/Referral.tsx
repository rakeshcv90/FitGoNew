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
import NewHeader from '../../Component/Headers/NewHeader';

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
          console.log('refe--->', res?.data);
        }
      },
    );
  };

  const share = async () => {
    try {
      const options: ShareOptions = {
        message: `Here's your chance to earn ₹1000 every week.
        1. Just download the Fitme app from here: ${referralLink}
        2. Use my referral code to register: ${referralCode}
        3. Take part in the fitness challenge and earn cash rewards of up to ₹1000 every week.`,
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
        message: `Here's your chance to earn ₹1000 every week.
          1. Just download the Fitme app from here: ${referralLink}
          2.Use my referral code to register: ${referralCode}
          3. Take part in the fitness challenge and earn cash rewards of up to ₹1000 every week.`,
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
        position: position ?? 'relative',
        zIndex: 10,
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
        <View style={{top: DeviceHeigth >= 1024 ? -5 : 0}}>
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
          {rank2?.fit_coins && rank?.fit_coins ? (
            <FitText
              type="SubHeading"
              value={'+' + (rank2?.fit_coins - rank?.fit_coins)}
              marginHorizontal={5}
            />
          ) : (
            <FitText type="SubHeading" value={'+0'} marginHorizontal={5} />
          )}
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
  // const UserImage = ({rank, image, rank2}: any) => {
  //   const text =
  //     getUserDataDetails?.name.split(' ') &&
  //     getUserDataDetails.name.split(' ').length > 1
  //       ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
  //         getUserDataDetails?.name.split(' ')[1].substring(0, 1)
  //       : getUserDataDetails?.name.substring(0, 1);
  //   return (
  //     <>
  //       <View
  //         style={[
  //           styles.boxGreen,
  //           {
  //             width: DeviceHeigth >= 1024 ? DeviceWidth * 0.9 : '92%',
  //             // paddingHorizontal: 18,
  //             paddingVertical: DeviceHeigth>=1024?DeviceHeigth * 0.05:DeviceHeigth * 0.03,
  //             paddingRight:DeviceWidth*0.08,
  //             paddingLeft:20
  //           },
  //         ]}>
  //         {getUserDataDetails?.image_path == null ? (
  //           <View style={styles.textImage}>
  //             <Text
  //               style={{
  //                 fontFamily: Fonts.MONTSERRAT_MEDIUM,
  //                 fontSize: DeviceHeigth >= 1024 ? 32 : 16,
  //                 // lineHeight: 40,
  //                 position: 'relative',
  //                 top: DeviceWidth * 0.025,
  //                 color: AppColor.WHITE,
  //                 textTransform: 'uppercase',
  //               }}>
  //               {text}
  //             </Text>
  //             <Medal rank={rank?.rank} text={true} image={image} />
  //           </View>
  //         ) : (
  //           <ImageBackground
  //             source={{uri: getUserDataDetails?.image_path}}
  //             imageStyle={{
  //               width: DeviceWidth * 0.07,
  //               height: DeviceWidth * 0.07,
  //               borderRadius: 40,
  //               borderWidth: 1,
  //               borderColor: '#3333334D',
  //             }}>
  //             <Medal rank={rank?.rank} text={false} image={image} />
  //           </ImageBackground>
  //         )}
  //         <Text
  //           style={{
  //             left: DeviceHeigth >= 1024 ? '45%' : '25%',
  //             color: AppColor.BLACK,
  //             fontFamily: Fonts.MONTSERRAT_MEDIUM,
  //             fontSize: 12,
  //             lineHeight: 16,
  //           }}>
  //           TO
  //         </Text>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             right:
  //               getUserDataDetails?.image_path == null ? DeviceWidth * 0.05 : 0,
  //           }}>
  //           <Image
  //             source={localImage.FitCoin}
  //             style={{width: 30, height: 30}}
  //           />
  //           <FitText
  //             type="SubHeading"
  //             value={'+' + (rank2?.fit_coins - rank?.fit_coins)}
  //             marginHorizontal={5}
  //           />
  //           {getUserDataDetails?.image_path == null ? (
  //             <View style={styles.textImage}>
  //               <Text
  //                 style={{
  //                   fontFamily: Fonts.MONTSERRAT_MEDIUM,
  //                   fontSize: DeviceHeigth >= 1024 ? 32 : 16,
  //                   // lineHeight: 40,
  //                   position: 'relative',
  //                   top: DeviceWidth * 0.025,
  //                   color: AppColor.WHITE,
  //                   textTransform: 'uppercase',
  //                 }}>
  //                 {text}
  //               </Text>
  //               <Medal rank={rank2?.rank} text={true} image={image} />
  //             </View>
  //           ) : (
  //             <ImageBackground
  //               source={{uri: getUserDataDetails?.image_path}}
  //               imageStyle={{
  //                 width: DeviceWidth * 0.07,
  //                 height: DeviceWidth * 0.07,
  //                 borderRadius: 40,
  //                 borderWidth: 1,
  //                 borderColor: '#3333334D',
  //               }}>
  //               <Medal
  //                 rank={rank2?.rank}
  //                 text={false}
  //                 image={localImage.Bronze}
  //               />
  //             </ImageBackground>
  //           )}
  //         </View>
  //       </View>
  //     </>
  //   );
  // };

  return (
    // <SafeAreaView
    //   style={{
    //     backgroundColor: AppColor.WHITE,
    //     flex: 1,
    //   }}>
    //   <DietPlanHeader
    //     h={
    //       Platform.OS == 'ios'
    //         ? (DeviceHeigth * 10) / 100
    //         : (DeviceHeigth * 7) / 100
    //     }
    //     header="Refer & Earn"
    //     shadow
    //   />
    //   <ScrollView
    //     showsVerticalScrollIndicator={false}
    //     refreshControl={
    //       <RefreshControl refreshing={refresh} onRefresh={getReferralRank} />
    //     }
    //     style={{flex: 1}}>
    //     <View style={{width: '95%', alignSelf: 'center'}}>
    //       <Image
    //         source={localImage.Refer_banner}
    //         resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
    //         style={{
    //           width: '100%',
    //           borderRadius: 10,
    //           height: DeviceHeigth * 0.2,
    //           alignSelf: 'center',
    //           marginVertical: 10,
    //         }}
    //       />
    //       <FitText
    //         type="SubHeading"
    //         value="Understand how referral works"
    //         fontSize={16}
    //         lineHeight={20}
    //         marginTop={20}
    //         color={AppColor.BLACK}
    //         fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //       />
    //       <Text
    //         style={{
    //           color: AppColor.BLACK,
    //           fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    //           fontSize: 16,
    //           marginVertical: DeviceHeigth >= 1024 ? 18 : 10,

    //         }}>
    //         Your rank
    //       </Text>
    //       <ImageBackground
    //         source={localImage.Referral_Coin_Banner}
    //         resizeMode={DeviceHeigth >= 1024 ? 'stretch' : 'contain'}
    //         style={{
    //           height: DeviceHeigth * 0.2,

    //           width:
    //             DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.95,
    //           flexDirection: 'row',
    //           justifyContent: 'space-between',
    //           alignItems: 'center',
    //           paddingHorizontal: 10,
    //           paddingBottom: 15,
    //           marginBottom: 20,
    //           alignSelf: 'center',
    //           overflow: 'hidden',
    //           // backgroundColor: 'green',
    //         }}>
    //         {getUserDataDetails?.image_path == null ? (
    //           <View
    //             style={[
    //               styles.textImage,
    //               {
    //                 width: DeviceWidth * 0.13,
    //                 height: DeviceWidth * 0.13,
    //                 backgroundColor: AppColor.WHITE,
    //               },
    //             ]}>
    //             <Text
    //               style={{
    //                 fontFamily: Fonts.MONTSERRAT_MEDIUM,
    //                 fontSize: 32,
    //                 lineHeight: 40,
    //                 position: 'relative',
    //                 // top: PLATFORM_IOS ? DeviceWidth * 0.01 : DeviceWidth * 0.01,
    //                 color: AppColor.RED,
    //                 textTransform: 'uppercase',
    //               }}>
    //               {getUserDataDetails?.name.split(' ') &&
    //               getUserDataDetails.name.split(' ').length > 1
    //                 ? getUserDataDetails?.name.split(' ')[0].substring(0, 1) +
    //                   getUserDataDetails?.name.split(' ')[1].substring(0, 1)
    //                 : getUserDataDetails?.name.substring(0, 1)}
    //             </Text>
    //           </View>
    //         ) : (
    //           <Image
    //             source={{uri: getUserDataDetails?.image_path}}
    //             style={{
    //               width: DeviceWidth * 0.13,
    //               height: DeviceWidth * 0.13,
    //               borderRadius: 100,
    //             }}
    //           />
    //         )}
    //         <ImageBackground
    //           source={localImage.Silver}
    //           imageStyle={
    //             {
    //               // width: 70,
    //               // height: 20,
    //             }
    //           }
    //           style={{
    //             marginLeft:
    //               DeviceHeigth <= 640 ? -DeviceWidth * 0.1 : -DeviceWidth * 0.2,
    //             width: DeviceWidth * 0.1,
    //             height: DeviceWidth * 0.1,
    //             alignItems: 'center',
    //           }}
    //           resizeMode="contain">
    //           <Text
    //             style={{
    //               top:
    //                 DeviceHeigth >= 1024
    //                   ? DeviceWidth * 0.03
    //                   : DeviceHeigth <= 640
    //                   ? 2
    //                   : 4,
    //               fontSize: DeviceHeigth >= 1024 ? 20 : 15,
    //               fontWeight: '700',
    //               fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    //               color: '#5F5F5F',
    //             }}>
    //             {referralData?.current_rank?.rank}
    //           </Text>
    //         </ImageBackground>
    //         <View
    //           style={{
    //             marginLeft:
    //               DeviceHeigth <= 640 ? -DeviceWidth * 0.1 : -DeviceWidth * 0.2,
    //           }}>
    //           <FitText
    //             type="SubHeading"
    //             value={getUserDataDetails?.name?.split(' ')[0]}
    //             color={AppColor.WHITE}
    //             fontFamily={Fonts.MONTSERRAT_SEMIBOLD}

    //           />
    //           <FitText
    //             type="normal"
    //             value={'Your Rank is '}
    //             color={AppColor.WHITE}
    //             fontFamily={Fonts.MONTSERRAT_REGULAR}
    //             fontWeight="500">
    //             <FitText
    //               type="normal"
    //               value={referralData?.current_rank?.rank}
    //               color={AppColor.WHITE}
    //               fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //               fontWeight="700"
    //             />
    //           </FitText>
    //         </View>
    //         <View style={{alignItems: 'center'}}>
    //           <Image
    //             source={localImage.FitCoin}
    //             style={{width: 30, height: 30}}
    //             resizeMode="contain"
    //           />
    //           <FitText
    //             type="SubHeading"
    //             value={referralData?.current_rank?.fit_coins}
    //             color={AppColor.WHITE}
    //           />
    //         </View>
    //       </ImageBackground>
    //       <View
    //         style={{
    //           borderWidth: 1.5,
    //           borderRadius: 10,
    //           padding: 10,
    //           marginBottom: DeviceHeigth >= 1024 ? 20 : 24,
    //           borderColor: AppColor.GRAY1,
    //           backgroundColor: AppColor.GRAY,
    //           // marginTop:-10

    //         }}>
    //         <Text
    //           style={{
    //             color: AppColor.BLACK,
    //             fontFamily: Fonts.MONTSERRAT_MEDIUM,
    //           }}>
    //           <Text
    //             style={{fontFamily: Fonts.MONTSERRAT_SEMIBOLD, fontSize: 15}}>
    //             Note:{' '}
    //           </Text>{' '}
    //           You must be in the current event to receive referral benefits. New
    //           events start every Monday and end on Friday.
    //         </Text>
    //       </View>
    //       {/* <FitText
    //       type="SubHeading"
    //       color={AppColor.HEADERTEXTCOLOR}
    //       value="Note"
    //       fontSize={20}
    //       fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //       marginVertical={10}
    //     />
    //     <View
    //       style={[
    //         styles.boxGreen,
    //         {
    //           width:
    //             DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
    //           height:
    //             DeviceHeigth >= 1024 ? DeviceHeigth * 0.1 : DeviceHeigth * 0.1,
    //         },
    //       ]}></View> */}
    //       {/* <View
    //         style={{
    //           flexDirection: 'row',
    //           justifyContent: 'space-between',
    //           // alignItems: 'center',
    //         }}>
    //         <View>
    //           <View
    //             style={{
    //               borderRadius: 20,
    //               width: 10,
    //               height: 10,
    //               backgroundColor: '#D9DBDC',
    //               marginTop:
    //                 DeviceHeigth >= 1024 ? (DeviceHeigth * 0.1) / 2.5 : 0,
    //             }}
    //           />
    //           {Array.from({
    //             length: DeviceHeigth >= 1024 ? 12 : DeviceHeigth <= 640 ? 8 : 9,
    //           }).map(() => {
    //             return <Text style={{color: '#D9DBDC', marginLeft: 3}}>|</Text>;
    //           })}
    //           <View
    //             style={{
    //               borderRadius: 20,
    //               width: 10,
    //               height: 10,
    //               backgroundColor: '#D9DBDC',
    //               // marginTop: DeviceHeigth >= 1024 ? (DeviceHeigth * 0.1) / 2 : 0,
    //             }}
    //           />
    //         </View>
    //         <View>
    //           <View
    //             style={{
    //               left:
    //                 DeviceHeigth >= 1024 ? 0 : DeviceHeigth <= 640 ? -5 : 10,
    //               marginTop: DeviceHeigth >= 1024 ? 30 : -5,
    //             }}>
    //             <View
    //               style={{
    //                 width:
    //                   DeviceHeigth >= 1024
    //                     ? DeviceWidth * 0.9
    //                     : DeviceWidth * 0.9,
    //                 marginBottom: 10,
    //               }}>
    //               <FitText
    //                 type="SubHeading"
    //                 color={AppColor.HEADERTEXTCOLOR}
    //                 value="Only Register"
    //                 fontSize={20}
    //                 fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //               />
    //               <View style={{flexDirection: 'row'}}>
    //                 <Text style={styles.line}>
    //                   {'When your friend register only then you can earn ' +
    //                     (referralData?.register_rank?.fit_coins -
    //                       referralData?.current_rank?.fit_coins) +
    //                     ' '}
    //                 </Text>
    //                 <Image
    //                   source={localImage.FitCoin}
    //                   style={{width: 20, height: 20, marginLeft: 5}}
    //                   resizeMode="contain"
    //                 />
    //               </View>
    //             </View>
    //             <UserImage
    //               image={localImage.Silver}
    //               rank={referralData?.current_rank}
    //               rank2={referralData?.register_rank}
    //             />
    //           </View>
    //           <View
    //             style={{
    //               left:
    //                 DeviceHeigth >= 1024 ? 0 : DeviceHeigth <= 640 ? -5 : 10,
    //               marginTop: DeviceHeigth >= 1024 ? 40 : 0,
    //             }}>
    //             <View
    //               style={{
    //                 width:
    //                   DeviceHeigth >= 1024
    //                     ? DeviceWidth * 0.9
    //                     : DeviceWidth * 0.9,
    //                 marginBottom: 10,
    //               }}>
    //               <FitText
    //                 type="SubHeading"
    //                 color={AppColor.HEADERTEXTCOLOR}
    //                 value="Join Event"
    //                 fontSize={20}
    //                 fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //               />
    //               <Text style={styles.line}>
    //                 {'When friend register and join you’ll earn ' +
    //                   (referralData?.event_register?.fit_coins -
    //                     referralData?.current_rank?.fit_coins) +
    //                   ' '}
    //                 <Image
    //                   source={localImage.FitCoin}
    //                   style={{width: 20, height: 20}}
    //                   resizeMode="contain"
    //                 />
    //               </Text>
    //             </View>
    //             <UserImage
    //               image={localImage.Silver}
    //               rank={referralData?.current_rank}
    //               rank2={referralData?.event_register}
    //             />
    //           </View>
    //         </View>
    //       </View> */}
    //       <View
    //         style={{
    //           flexDirection: 'row',
    //           width: DeviceWidth * 0.95,
    //           alignSelf: 'center',
    //           marginVertical: 16,
    //         }}>
    //         <View>
    //           <View
    //             style={{
    //               borderRadius: 20,
    //               width: 10,
    //               height: 10,
    //               backgroundColor: '#D9DBDC',
    //               marginRight: 10,
    //               marginTop:
    //                 DeviceHeigth >= 1024 ? (DeviceHeigth * 0.1) / 2.5 : 0,
    //             }}
    //           />
    //           {Array.from({
    //             length: DeviceHeigth >= 1024 ? 12 : DeviceHeigth <= 640 ? 8 : 9,
    //           }).map(() => {
    //             return <Text style={{color: '#D9DBDC', marginLeft: 3}}>|</Text>;
    //           })}
    //           <View
    //             style={{
    //               borderRadius: 20,
    //               width: 10,
    //               height: 10,
    //               backgroundColor: '#D9DBDC',
    //               // marginTop: DeviceHeigth >= 1024 ? (DeviceHeigth * 0.1) / 2 : 0,
    //             }}
    //           />
    //         </View>
    //         <View style={{width: '100%'}}>
    //           <FitText
    //             type="normal"
    //             color={AppColor.HEADERTEXTCOLOR}
    //             value="Only Register"
    //             fontSize={16}
    //             fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //             marginTop={-15}
    //           />
    //           <View style={{}}>
    //             <Text style={styles.line}>
    //               {'When your friend register only then you can earn ' +
    //                 (referralData?.register_rank?.fit_coins -
    //                   referralData?.current_rank?.fit_coins) +
    //                 ' '}
    //               <Image
    //                 source={localImage.FitCoin}
    //                 style={{width: 20, height: 20}}
    //                 resizeMode="contain"
    //               />
    //             </Text>
    //             <UserImage
    //               image={localImage.Silver}
    //               rank={referralData?.current_rank}
    //               rank2={referralData?.register_rank}
    //             />
    //             <View style={{marginVertical: DeviceHeigth * 0.02}}>
    //               <FitText
    //                 type="SubHeading"
    //                 color={AppColor.HEADERTEXTCOLOR}
    //                 value="Join Event"
    //                 fontSize={16}
    //                 fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //               />

    //               <Text style={styles.line}>
    //                 {'When friend register and join you’ll earn ' +
    //                   (referralData?.event_register?.fit_coins -
    //                     referralData?.current_rank?.fit_coins) +
    //                   ' '}
    //                 <Image
    //                   source={localImage.FitCoin}
    //                   style={{width: 20, height: 20}}
    //                   resizeMode="contain"
    //                 />
    //               </Text>
    //               <UserImage
    //                 image={localImage.Silver}
    //                 rank={referralData?.current_rank}
    //                 rank2={referralData?.event_register}
    //               />
    //             </View>
    //           </View>
    //         </View>
    //       </View>
    //       <View
    //         style={{
    //           flexDirection: 'row',
    //           marginVertical: 10,
    //           alignItems: 'center',
    //           alignSelf: 'center',
    //         }}>
    //         <TouchableOpacity style={styles.whatsapp} onPress={shareWhatsApp}>
    //           <FitIcon
    //             name="whatsapp"
    //             type="MaterialCommunityIcons"
    //             size={20}
    //             color={AppColor.WHITE}
    //           />
    //           <FitText
    //             type="SubHeading"
    //             value={` Refer Via WhatsApp`}
    //             color={AppColor.WHITE}
    //           />
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.share} onPress={share}>
    //           <FitIcon
    //             name="share-variant-outline"
    //             type="MaterialCommunityIcons"
    //             size={20}
    //             color={AppColor.RED}
    //           />
    //         </TouchableOpacity>
    //       </View>
    //       <FitText
    //         type="Heading"
    //         color={AppColor.HEADERTEXTCOLOR}
    //         value="Share you invite link"
    //         fontSize={16}
    //         fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //         marginVertical={5}
    //         marginHorizontal={10}
    //       />
    //       <FitText
    //         type="SubHeading"
    //         color="#333333B2"
    //         value="Referral Code"
    //         // fontSize={20}
    //         fontFamily={Fonts.MONTSERRAT_SEMIBOLD}
    //         marginVertical={5}
    //         marginHorizontal={10}
    //       />
    //       <View
    //         style={[
    //           styles.refBox,
    //           {
    //             width:
    //               DeviceHeigth >= 1024 ? DeviceWidth * 0.95 : DeviceWidth * 0.9,
    //             paddingVertical: DeviceHeigth >= 1024 ? 20 : 10,
    //           },
    //         ]}>
    //         <FitText
    //           type="SubHeading"
    //           color={AppColor.BLACK}
    //           value={referralCode}
    //           textTransform="uppercase"
    //         />
    //         <FitIcon
    //           name="link"
    //           type="AntDesign"
    //           size={20}
    //           color={AppColor.BLACK}
    //           onPress={clipboard}
    //         />
    //       </View>
    //     </View>
    //   </ScrollView>
    //   <ActivityLoader visible={loader} />
    // </SafeAreaView>
    <View style={styles.container}>
      <NewHeader backButton header={'Refer & Earn'} />
      <ScrollView>
        <View style={styles.imgView}>
          <Image
            source={localImage.Refer_banner}
            resizeMode="stretch"
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <Text style={styles.txt1}>Understand how referral works</Text>
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
            You must be in the current event to receive referral benefits. New
            events start every Monday and end on Friday.
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
              // borderLeftWidth: 1.5,
              // borderStyle: 'dashed',
              // borderColor: '#D9DBDC',
              // backgroundColor: '#D9DBDC',
            }}>
            <View>
              <Text
                style={[
                  styles.txt1,
                  {
                    top: DeviceHeigth >= 1024 ? -10 : -20,
                    marginBottom: DeviceHeigth < 1024 ? -DeviceWidth * 0.04 : 0,
                    // marginLeft: 20,
                  },
                ]}>
                {' '}
                Register
              </Text>
              <Text style={[styles.line, {marginLeft: 12}]}>
                When your friend register only then you can earn
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
            <Text style={[styles.txt1, {marginLeft: 0, marginBottom: 0}]}>
              Join Event
            </Text>
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
            When your friend register and join event you’ll earn
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
            marginBottom: 10,
          }}>
          <TouchableOpacity
            style={[
              styles.whatsapp,
              {
                width:
                  DeviceHeigth >= 1024 ? DeviceWidth * 0.8 : DeviceWidth * 0.75,
              },
            ]}
            onPress={shareWhatsApp}>
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
        <Text
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
    </View>
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
    backgroundColor: '#128C7E',
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
