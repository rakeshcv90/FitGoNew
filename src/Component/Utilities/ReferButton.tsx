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
          padding: 3,
          paddingRight: 10,
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
            width: 30,
            height: 30,
          }}
        />
        <FitText
          type="SubHeading"
          value={`Refer &\nEarn`}
          color={AppColor.WHITE}
          fontSize={11}
          lineHeight={16}
        />
      </TouchableOpacity>
    );
  };

export default ReferButton
