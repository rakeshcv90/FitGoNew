import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import MarqueeText from '../../Component/Utilities/MarqueeText';
import {navigate} from '../../Component/Utilities/NavigationUtil';
import {AppColor, Fonts} from '../../Component/Color';
import FitIcon from '../../Component/Utilities/FitIcon';

const OfferAnimation = () => {
  return (
    <ImageBackground
      source={require('../../Icon/Images/NewHome/Banner.png')}
      resizeMode="stretch"
      style={{
        width: DeviceWidth * 0.95,
        height: DeviceHeigth * 0.05,
        alignSelf: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '10%',
          height: '100%',
          justifyContent: 'center',

          marginLeft: 10,
        }}>
        <Image
          source={require('../../Icon/Images/NewHome/gift.png')}
          style={{height: '90%', width: '100%'}}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          width: DeviceHeigth >= 1024 ? '70%' : '60%',
        }}>
        <MarqueeText text="Explore Special Offers to Win Exciting Prizes! Check Out the Upcoming Challenges!" />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigate('OfferPage');
        }}
        style={{
          width: DeviceHeigth >= 1024 ? '16%' : '25%',
          height: '60%',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 8,
          paddingLeft: 10,
        }}>
        <Text
          style={{
            fontFamily: Fonts.HELVETICA_REGULAR,
            fontSize: 14,
            lineHeight: 25,

            color: AppColor.RED,
          }}>
          EXPLORE
        </Text>
        <FitIcon
          type="MaterialCommunityIcons"
          name={'chevron-right'}
          size={20}
          color={AppColor.RED}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default OfferAnimation;

const styles = StyleSheet.create({
  shimmerWrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  shimmer: {
    width: '20%',
    height: '100%',
  },
});
