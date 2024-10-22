import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../Config';
import {AppColor, Fonts} from '../Color';
import { useNavigation } from '@react-navigation/native';

const InviteFriends = () => {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.box}
        resizeMode="stretch"
        source={require('../../Icon/Images/NewHome/background1.png')}>
        <Text
          style={{
            fontFamily: Fonts.HELVETICA_BOLD,
            fontSize: 16,
            lineHeight: 24,
            color: AppColor.WHITE,
          }}>
          Refer & Win Amazing Prizes
        </Text>
        <Text
          style={{
            //fontFamily: Fonts.HELVETICA_REGULAR,
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '300',
            color: AppColor.WHITE,
            marginTop: 10,
          }}>
          Invite your friends to earn {'\n'}more Fitcoins.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: DeviceHeigth * 0.02,
            alignItems: 'center',
          }}>
        </View>
        <TouchableOpacity
        onPress={()=>{
          navigation.navigate('Referral')
        }}
          style={{
            width: 80,
            height: 35,
            backgroundColor: AppColor.WHITE,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text
            style={{
              // fontFamily: Fonts.HELVETICA_REGULAR,
              fontWeight: '500',
              fontSize: 14,
              lineHeight: 20,
              color: AppColor.RED,
              textAlign: 'center',
            }}>
            Invite
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    backgroundColor: AppColor.WHITE,
    marginVertical: 15,
  },
  box: {
    width: DeviceWidth,
    paddingVertical: DeviceHeigth * 0.04,
    paddingHorizontal: DeviceWidth * 0.04,
  },
});
export default InviteFriends;
