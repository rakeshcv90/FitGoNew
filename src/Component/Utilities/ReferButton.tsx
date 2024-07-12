import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { navigationRef } from '../../../App';
import FitText from './FitText';
import { AppColor } from '../Color';
import AnimatedLottieView from 'lottie-react-native';

const ReferButton = () => {
    return (
      <TouchableOpacity
        onPress={() => navigationRef?.navigate('Referral')}
        style={{
          backgroundColor: AppColor.RED,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        //   padding: 5,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AnimatedLottieView
          source={require('../../Icon/Images/InAppRewards/ReferButton.json')}
          speed={1}
          autoPlay
          loop
          resizeMode="contain"
          style={{
            width: 50,
            height: 50,
          }}
        />
        <FitText
          type="SubHeading"
          value={`Refer & \nEarn`}
          color={AppColor.WHITE}
        //   lineHeight={20}
        />
      </TouchableOpacity>
    );
  };

export default ReferButton
