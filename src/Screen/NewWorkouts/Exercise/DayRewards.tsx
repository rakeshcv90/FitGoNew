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
import {AppColor} from '../../../Component/Color';
import GradientText from '../../../Component/GradientText';
import {DeviceHeigth, DeviceWidth, NewAppapi} from '../../../Component/Config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {localImage} from '../../../Component/Image';
import GradientButton from '../../../Component/GradientButton';
import {StatusBar} from 'react-native';

const DayRewards = ({navigation, route}: any) => {
  const {data, day} = route?.params;
  const {allWorkoutData, getUserDataDetails, getCount} = useSelector(
    (state: any) => state,
  );
  const [days, setDays] = useState<Array<any>>([]);
  useEffect(() => {
    getCurrentDayAPI();
  }, []);
  const getCurrentDayAPI = async () => {
    try {
      const payload = new FormData();
      payload.append('id', getUserDataDetails?.id);
      payload.append('workout_id', data?.workout_id);
      //   console.log(data, 'das');
      const res = await axios({
        url: NewAppapi.CURRENT_DAY_EXERCISE_DETAILS,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('GET API TRACKER', res.data);
      if (res.data?.msg != 'No data found') {
        // if(res.data?.user_details)
        analyzeExerciseData(res.data?.user_details);
      } else {
        // setSelected(0);
        // console.log('first', res.data);
      }
    } catch (error) {
      console.error(error, 'DAPIERror');
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
  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <GradientText
        text="Congratulations!"
        fontSize={32}
        width={Platform.OS == 'ios' ? DeviceWidth * 0.9 : DeviceWidth * 0.7}
        y={'70'}
        x={'10%'}
        height={100}
      />
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: DeviceWidth * 0.9,
            marginTop: 10,
          }}>
          {[1, 2, 3, 4, 5, 6, 7].map((item: any, index: number) => {
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
        <GradientButton
          onPress={() => navigation.navigate('BottomTab')}
          text="Collect Rewards"
          bR={50}
          h={70}
          position="absolute"
          bottm={10}
          alignSelf
        />
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
