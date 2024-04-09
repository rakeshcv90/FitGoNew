import {View, Text, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewHeader from '../../Component/Headers/NewHeader';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {AppColor} from '../../Component/Color';
import AnimatedLottieView from 'lottie-react-native';
import {DeviceHeigth} from '../../Component/Config';
import Button from '../../Component/Button';
import analytics from '@react-native-firebase/analytics';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setFitmeAdsCount} from '../../Component/ThemeRedux/Actions';
import moment from 'moment';
const Trainer = ({navigation}) => {
  const navigation1 = useNavigation();
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <NewHeader header={'  Fitness Coach'} />

      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/NewImage/ChatBoot.json')}
          speed={3}
          autoPlay
          loop
          resizeMode='cover'
          style={{
            width: 400,
            height: 400,
            top: -70,
    
          }}
        />
      </View>
      <View
        style={{
          width: 350,
         // height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingHorizontal: 10,
          top: -150,
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            fontWeight: '500',
            fontSize: 15,
            lineHeight: 20,
            // textAlign: 'center',
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
          // Platform.OS == 'android'
          //   ? DeviceHeigth * 0.09
          //   : DeviceHeigth * 0.095,
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
