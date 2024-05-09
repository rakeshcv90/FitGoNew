import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppColor, Fonts} from '../../../Component/Color';
import GradientText from '../../../Component/GradientText';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../../Component/Image';
import GradientButton from '../../../Component/GradientButton';
import {StatusBar} from 'react-native';
import moment from 'moment';
import {BannerAdd} from '../../../Component/BannerAdd';
import {bannerAdId} from '../../../Component/AdsId';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const WeekArray = Array(7)
  .fill(0)
  .map(
    (item, index) =>
      (item = moment()
        .add(index, 'days')
        .subtract(moment().isoWeekday() - 1, 'days')
        .format('dddd')),
  );
const numberArray = [1, 2, 3, 4, 5, 6, 7];
const DayRewards = ({navigation, route}: any) => {
  const {data, day} = route?.params;
  const getUserDataDetails = useSelector(
    (state: any) => state.getUserDataDetails,
  );
  const getPurchaseHistory = useSelector(
    (state: any) => state.getPurchaseHistory,
  );
  const avatarRef = React.createRef();
  const [days, setDays] = useState<Array<any>>([]);
  const [weekly, setWeekly] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getCurrentDayAPI();
  }, []);
  const getCurrentDayAPI = async () => {
    setLoader(true);
    try {
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      payload.append('workout_id', data?.workout_id);

      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE_DETAILS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.msg != 'No data found') {
        analyzeExerciseData(res.data?.user_details);
        setWeekly(false);
      } else {
        WeeklyStatusAPI();
        setWeekly(true);
      }
      setLoader(false);
    } catch (error) {
      console.error(error, 'DAPIERror');
      setLoader(false);
    }
  };

  function analyzeExerciseData(exerciseData: []) {
    const daysCompletedAll = new Set();

    exerciseData.forEach((entry: any) => {
      const userDay = entry['user_day'];
      if (entry['final_status'] == 'allcompleted')
        daysCompletedAll.add(parseInt(userDay));
    });
    setDays(Array.from(daysCompletedAll));
  }

  const WeeklyStatusAPI = async () => {
    try {
      const res = await axios({
        url: NewAppapi.WEEKLY_STATUS + '?user_id=' + getUserDataDetails.id,
      });
      if (res.data?.msg != 'No data found.') {
        const days = new Set(); // Use a Set to store unique days
        res.data?.forEach((item: any) => {
          days.add(item.user_day);
        });
        console.log('DAYS', days);
        setDays([...days]);
      } else {
        setDays([]);
      }
    } catch (error) {
      console.error(error, 'WEEKLYSTATUS ERRR');
    }
  };
  const bannerAdsDisplay = () => {
    if (getPurchaseHistory.length > 0) {
      if (
        getPurchaseHistory[0]?.plan_end_date >= moment().format('YYYY-MM-DD')
      ) {
        return null;
      } else {
        return <BannerAdd bannerAdId={bannerAdId} />;
      }
    } else {
      return <BannerAdd bannerAdId={bannerAdId} />;
    }
  };
  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginVertical: DeviceHeigth * 0.05,
        }}>
        <Text
          style={{
            color: AppColor.RED1,
            fontSize: 28,
            lineHeight: 40,
            fontWeight: '600',
            fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
          }}>
          Congratulations!
        </Text>
      </View>
      <AnimatedLottieView
        // source={{
        //   uri: 'https://assets7.lottiefiles.com/packages/lf20_qgq2nqsy.json',
        // }} // Replace with your animation file
        source={require('../../../Icon/Images/NewImage/DayReward.json')}
        speed={2}
        autoPlay
        loop
        style={{
          width: DeviceWidth * 0.5,
          height: DeviceHeigth * 0.2,
          right: 10,
          alignSelf: 'center',
        }}
      />
      <View
        style={{
          marginTop: 10,
          alignItems: 'center',
          width: DeviceWidth,
          flex: 1,
          padding: 10,
          // backgroundColor: 'red',
        }}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'Poppins',
            lineHeight: 40,
            color: '#1e1e1e',
            fontWeight: '700',
          }}>
          You’re Doing Great
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins',
            lineHeight: 30,
            color: '#1e1e1e',
            fontWeight: '600',
            marginTop: 15,
          }}>
          Weekly Achievement
        </Text>
        {loader ? (
          <View
            style={{
              width: DeviceWidth * 0.9,
              height: 50,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              marginTop: 10,
            }}>
            <ShimmerPlaceholder
              style={{height: '100%', width: '100%'}}
              ref={avatarRef}
              autoRun
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: DeviceWidth * 0.9,
              marginTop: 10,
            }}>
            {weekly
              ? WeekArray.map((item: any, index: number) => {
                  return (
                    <View style={{alignItems: 'center'}}>
                      {days.includes(item) ? (
                        <Image
                          source={localImage.RedCircle}
                          style={{height: 40, width: 40}}
                        />
                      ) : (
                        <View
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 50,
                            backgroundColor: '#EDF1F4',
                          }}
                        />
                      )}
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Poppins',
                          lineHeight: 30,
                          color: '#505050',
                          fontWeight: '500',
                        }}>
                        {item?.substring(0, 1)}
                      </Text>
                    </View>
                  );
                })
              : numberArray.map((item: any, index: number) => {
                  return (
                    <View style={{alignItems: 'center'}}>
                      {days.includes(item) ? (
                        <Image
                          source={localImage.RedCircle}
                          style={{height: 40, width: 40}}
                        />
                      ) : (
                        <View
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 50,
                            backgroundColor: '#EDF1F4',
                          }}
                        />
                      )}
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Poppins',
                          lineHeight: 30,
                          color: '#505050',
                          fontWeight: '500',
                        }}>
                        {item}
                      </Text>
                    </View>
                  );
                })}
          </View>
        )}
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins',
            lineHeight: 30,
            color: '#1e1e1e',
            fontWeight: '500',
            marginTop: 15,
            textAlign: 'center',
            width: DeviceWidth * 0.9,
          }}>
          Workout everyday and achieve your daily reward!
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins',
            lineHeight: 30,
            color: '#1e1e1e',
            fontWeight: '500',
          }}>
          Good Luck
        </Text>
        <View
          style={{
            marginBottom: DeviceHeigth * 0.002,
            top: DeviceHeigth * 0.14,
          }}>
          <GradientButton
            onPress={() =>
              weekly
                ? navigation.navigate('BottomTab')
                : navigation.navigate('WorkoutDays', {data: data})
            }
            text="Collect Rewards"
            bR={50}
            h={70}
            position="absolute"
            bottm={10}
            alignSelf
          />
        </View>
      </View>
      <View style={{position: 'absolute', bottom: 0}}>
        {bannerAdsDisplay()}
      </View>
    </SafeAreaView>
    // <ScrollView
    //   style={{flex: 1, backgroundColor: AppColor.WHITE,}}>
    //   <GradientText
    //     text="Congratulations!"
    //     fontSize={32}
    //     width={Platform.OS == 'ios' ? DeviceWidth * 0.9 : DeviceWidth * 0.7}
    //     y={'70'}
    //     x={'10%'}
    //     height={100}
    //   />
    //   <AnimatedLottieView
    //     // source={{
    //     //   uri: 'https://assets7.lottiefiles.com/packages/lf20_qgq2nqsy.json',
    //     // }} // Replace with your animation file
    //     source={require('../../../Icon/Images/NewImage/DayReward.json')}
    //     speed={2}
    //     autoPlay
    //     loop
    //     style={{
    //       width: DeviceWidth * 0.5,
    //       height: DeviceHeigth * 0.2,
    //       right: 10,
    //       alignSelf:'center'
    //     }}
    //   />
    //   <View
    //     style={{
    //       marginTop: 10,
    //       alignItems: 'center',
    //       width: DeviceWidth,
    //       flex: 1,
    //       padding: 10,
    //       backgroundColor:'red'
    //     }}>
    //     <Text
    //       style={{
    //         fontSize: 32,
    //         fontFamily: 'Poppins',
    //         lineHeight: 40,
    //         color: '#1e1e1e',
    //         fontWeight: '700',
    //       }}>
    //       You’re Doing Great
    //     </Text>
    //     <Text
    //       style={{
    //         fontSize: 20,
    //         fontFamily: 'Poppins',
    //         lineHeight: 30,
    //         color: '#1e1e1e',
    //         fontWeight: '600',
    //         marginTop: 15,
    //       }}>
    //       Weekly Achievement
    //     </Text>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //         width: DeviceWidth * 0.9,
    //         marginTop: 10,
    //       }}>
    //       {[1, 2, 3, 4, 5, 6, 7].map((item: any, index: number) => {
    //         return (
    //           <View style={{alignItems: 'center'}}>
    //             {days.includes(item) ? (
    //               <Image
    //                 source={localImage.RedCircle}
    //                 style={{height: 40, width: 40}}
    //               />
    //             ) : (
    //               <View
    //                 style={{
    //                   height: 40,
    //                   width: 40,
    //                   borderRadius: 50,
    //                   backgroundColor: '#EDF1F4',
    //                 }}
    //               />
    //             )}
    //             <Text
    //               style={{
    //                 fontSize: 16,
    //                 fontFamily: 'Poppins',
    //                 lineHeight: 30,
    //                 color: '#505050',
    //                 fontWeight: '500',
    //               }}>
    //               {item}
    //             </Text>
    //           </View>
    //         );
    //       })}
    //     </View>
    //     <Text
    //       style={{
    //         fontSize: 16,
    //         fontFamily: 'Poppins',
    //         lineHeight: 30,
    //         color: '#1e1e1e',
    //         fontWeight: '500',
    //         marginTop: 15,
    //         textAlign: 'center',
    //       }}>
    //       Workout everyday and achieve your daily reward!
    //     </Text>
    //     <Text
    //       style={{
    //         fontSize: 16,
    //         fontFamily: 'Poppins',
    //         lineHeight: 30,
    //         color: '#1e1e1e',
    //         fontWeight: '500',
    //       }}>
    //       Good Luck
    //     </Text>
    //     <GradientButton
    //       onPress={() => navigation.navigate('BottomTab')}
    //       text="Collect Rewards"
    //       bR={50}
    //       h={70}
    //       //flex={0.5}
    //      // mB={-DeviceHeigth * 0.3}
    //       style={{bottom: 10, position: 'absolute'}}
    //       alignSelf
    //     />
    //   </View>

    // </ScrollView>
  );
};

export default DayRewards;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
