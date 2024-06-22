import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';
import {DeviceWidth, DeviceHeigth} from '../../Component/Config';
import {AppColor, Fonts} from '../../Component/Color';

import {CircularProgressWithChild} from 'react-native-circular-progress-indicator';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import {setShowIntro} from '../../Component/ThemeRedux/Actions';
import {useDispatch} from 'react-redux';
const IntroductionScreen1 = ({navigation}) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f2c4c4'} />
      <View
        style={{
          width: '100%',
          height: '55%',
          opacity:1,
          backgroundColor: '#f2c4c4',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      
        <TouchableOpacity
          onPress={() => {
            dispatch(setShowIntro(true));
            navigation.navigate('LogSignUp', {screen: 'Log In'});
          }}
          style={{
            justifyContent: 'flex-end',
            width: 50,
            height: 30,
            alignSelf: 'flex-end',
          }}>
          <Text
            style={{
              textDecorationLine: 'underline',
              color: '#A93737',
              textAlign: 'center',
              fontWeight: '600',
              lineHeight: 20,
              fontSize: 14,
              top:Platform.OS=='ios'&&DeviceHeigth<=1024?30:0
            }}>
            Skip
          </Text>
        </TouchableOpacity>

        <Image
          source={localImage.Intro1}
          resizeMode="contain"
          style={{width: '90%', height: '90%'}}></Image>
      </View>
      <View
        style={{
          height: '35%',
          backgroundColor: '#fff',
          paddingLeft: 10,
          paddingTop: 24,
          paddingRight: 10,
        }}>
        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 25,
            lineHeight: 33,
            fontWeight: '700',
            color: '#000',
          }}>
          Get Healthy, Get Wealthy
        </Text>

        <Text
          style={{
            fontFamily: Fonts.MONTSERRAT_REGULAR,
            fontSize: 16,
            lineHeight: 25,
            fontWeight: '500',
            color: '#000',
            opacity:0.8,
            marginTop: 16,
          }}>
          Why just get fit when you can also earn rewards? Participate in our
          fitness challenge, stay committed, and watch as your hard work turns
          into amazing rewards. It's time to make your pocket as healthy as
          your body!
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: '10%',
          backgroundColor: '#fff',
          paddingRight: 20,
        }}>
        <CircularProgressWithChild
          value={33}
          activeStrokeColor={AppColor.RED}
          radius={DeviceHeigth>=1024?40:28}
          initialValue={33}
          maxValue={100}
          clockwise={false}
          inActiveStrokeColor={AppColor.WHITE}
          activeStrokeWidth={3}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              dispatch(setShowIntro(true));
              navigation.navigate('IntroductionScreen2');
            }}
            style={{
              backgroundColor: '#A93737',
              width:DeviceHeigth>=1024? DeviceWidth * 0.08: DeviceWidth * 0.1,
              height: DeviceHeigth>=1024? DeviceWidth * 0.08: DeviceWidth * 0.1,
              borderRadius: 100,
              margin: 5,

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FitIcon
              name="arrowright"
              size={25}
              type="AntDesign"
              color="white"
            />
          </TouchableOpacity>
        </CircularProgressWithChild>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
export default IntroductionScreen1;
