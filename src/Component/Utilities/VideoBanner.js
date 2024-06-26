import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import {DeviceWidth} from '../Config';
import LinearGradient from 'react-native-linear-gradient';
import {AppColor, Fonts} from '../Color';
import {localImage} from '../Image';
import {useNavigation} from '@react-navigation/native';

const VideoBanner = () => {
  const navigation = useNavigation();
  return (
    <View style={{top: -10}}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.4}
        onPress={() => {
          navigation.navigate('IntroVideo', {type: 'home'});
        }}>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#770753', '#2D0050']}
          style={styles.button}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.txt}>
              {'How to join the\n'}
              <Text style={{fontSize: 20, fontFamily: Fonts.MONTSERRAT_BOLD}}>
                Challenge and Earn
              </Text>
            </Text>
            <Image
              source={localImage.VideoLogo}
              style={{height: 60, width: 85, marginRight: 16}}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    width: DeviceWidth * 0.95,
    borderRadius: 20,
    paddingVertical: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: AppColor.WHITE,
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_SEMIBOLD,
    marginHorizontal: 16,
  },
});
export default VideoBanner;
