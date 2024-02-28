import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth} from '../../Component/Config';
import Button from '../../Component/Button';
import analytics from '@react-native-firebase/analytics';
import {useFocusEffect, useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {MyInterstitialAd} from '../../Component/BannerAdd';
import {setFitmeAdsCount} from '../../Component/ThemeRedux/Actions';
import moment from 'moment';
const Trainer = ({navigation}) => {
  const navigation1 = useNavigation();
  const dispatch = useDispatch();
  const {getFitmeAdsCount,getPurchaseHistory} = useSelector(state => state);
  let data1 = useIsFocused();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (data1) {
  //       if (getFitmeAdsCount < 3) {
  //         console.log('Ad Count Incremented:', getFitmeAdsCount);
  //         dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
  //       } else {
  //         MyInterstitialAd(resetFitmeCount).load();
        
  //       }
  //     }
  //   }, [data1]),
  // );
  useFocusEffect(
    React.useCallback(() => {
      if (data1) {
        if (getPurchaseHistory.length > 0) {
          if (
            getPurchaseHistory[0]?.plan_end_date >=
            moment().format('YYYY-MM-DD')
          ) {
            dispatch(setFitmeAdsCount(0));
          } else {
            if (getFitmeAdsCount < 5) {
              console.log('Ad Count Incremented:', getFitmeAdsCount);
              dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
            } else {
              MyInterstitialAd(resetFitmeCount).load();
            }
          }
        } else {
          if (getFitmeAdsCount < 5) {
            console.log('Ad Count Incremented:', getFitmeAdsCount);
            dispatch(setFitmeAdsCount(getFitmeAdsCount + 1));
          } else {
            MyInterstitialAd(resetFitmeCount).load();
          }
        }
      }
    }, [data1]),
  );
  const resetFitmeCount = async () => {
    console.log('Reset Count');
    dispatch(setFitmeAdsCount(0));
  };
  console.log('Fitme Count', getFitmeAdsCount);
  return (
    <View style={styles.container}>
      <NewHeader header={'  Fitness Coach'} />

      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/ChatBoot.json')}
          speed={3}
          autoPlay
          loop
          style={{
            width: 300,
            height: 300,
            top: -70,
          }}
        />
      </View>
      <View
        style={{
          width: 300,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',

          top: -40,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: 12,
            lineHeight: 15,
            textAlign: 'center',
            color: AppColor.LITELTEXTCOLOR,
          }}>
          Welcome to your personalized fitness journey! I'm here to be your
          trusty fitness companion, guiding you through workouts, providing
          tips, and keeping you motivated every step of the way.
        </Text>
      </View>
      <View
        style={{
          marginTop: DeviceHeigth * 0.15,
          bottom: 10,
          position: 'absolute',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Button
          buttonText={'Start Now'}
          onPresh={() => {
            analytics().logEvent('CV_FITME_TALKED_TO_FITNESS_COACH');
            navigation.navigate('AITrainer');
          }}
        />
      </View>
    </View>
  );
};
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.WHITE,
  },
});
export default Trainer;
