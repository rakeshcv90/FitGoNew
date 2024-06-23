import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';

import {AppColor, Fonts} from '../../Component/Color';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {CircularProgressWithChild} from 'react-native-circular-progress-indicator';
import FitIcon from '../../Component/Utilities/FitIcon';
import {localImage} from '../../Component/Image';
import { useDispatch } from 'react-redux';
import { setShowIntro } from '../../Component/ThemeRedux/Actions';
import AnimatedLottieView from 'lottie-react-native';

const IntroductionScreen3 = ({navigation}) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f2c4c4'} />
      <View
        style={{
          width: '100%',
          height: '50%',
          backgroundColor: '#f2c4c4',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
         <View
          style={{
            height: 30,
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            zIndex: 1,
            top: Platform.OS == 'ios' && DeviceHeigth <= 1024 ? 30 : 0,
          }}>
          <View
        
            >
            {/* <Text
              style={{
                textDecorationLine: 'underline',
                color: '#A93737',
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 20,
                fontSize: 14,
              }}>
              Skip
            </Text> */}
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',

              zIndex: 1,
              overflow: 'hidden',
              width: DeviceWidth * 0.08,
              height: DeviceHeigth * 0.05,
            }}
            onPress={() => {
              navigation.navigate('IntroVideo',{type:'intro'});
            }}>
            <AnimatedLottieView
              source={localImage.RewardInfo}
              speed={1}
              autoPlay
              loop
              resizeMode={DeviceHeigth >= 1024 ? 'contain' : 'cover'}
              style={{
                width: DeviceWidth * 0.08,
                height: DeviceHeigth * 0.05,

                // top: Platform.OS == 'ios' && DeviceHeigth <= 1024 ? 40 : 0,
              }}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={localImage.Intro3}
          resizeMode="contain"
          style={{width: '90%', height: '90%'}}></Image>
      </View>
      <View
        style={{
          width: '100%',
          height: '40%',
          backgroundColor: '#fff',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 30,
        }}>
        <Text
          style={{
           fontFamily: Fonts.MONTSERRAT_BOLD,
            fontSize: 25,
            lineHeight: 33,
            fontWeight: '700',
            color: '#000',
          }}>
          Weekly Rewards
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
          Complete the challenge by the end of the week and receive exciting
          rewards. Whether you’re a beginner or a fitness legend, our
          challenges are designed to keep you motivated and rewarded. Don’t miss
          out! Every Monday, a new challenge begins.
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',

          height: '10%',
          backgroundColor: '#fff',
          paddingRight: 20,
          paddingLeft: 20,
          flexDirection: 'row',
        }}>
        <CircularProgressWithChild
          value={100}
          activeStrokeColor={AppColor.RED}
          radius={DeviceHeigth>=1024?40:28}
          initialValue={100}
          maxValue={100}
          clockwise={false}
          inActiveStrokeColor={AppColor.WHITE}
          activeStrokeWidth={3}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              // backgroundColor: AppColor.BLACK,
              // backgroundColor: '#A93737',
              width:DeviceHeigth>=1024? DeviceWidth * 0.08: DeviceWidth * 0.1,
              height: DeviceHeigth>=1024? DeviceWidth * 0.08: DeviceWidth * 0.1,
              borderRadius: 100,
              margin: 5,

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FitIcon
              name="arrowleft"
              size={25}
              type="AntDesign"
              color="#A93737"
            />
          </TouchableOpacity>
        </CircularProgressWithChild>
        <CircularProgressWithChild
          value={100}
          activeStrokeColor={AppColor.RED}
          radius={DeviceHeigth>=1024?40:28}
          initialValue={70}
          maxValue={100}
          clockwise={false}
          inActiveStrokeColor={AppColor.WHITE}
          activeStrokeWidth={3}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
             dispatch(setShowIntro(true));
              navigation.navigate('LogSignUp', {screen: 'Log In'});
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
    backgroundColor: AppColor.WHITE,
  },
});
export default IntroductionScreen3;
