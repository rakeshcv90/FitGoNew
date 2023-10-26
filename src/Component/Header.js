import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import React from 'react';
import { localImage } from './Image';
import { DeviceHeigth, DeviceWidth } from './Config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ header, iconName }) => {
  const navigation = useNavigation();
  return (
    <>
      <ImageBackground
        source={localImage.color_image}
        translucent={true}
        style={{
          width: DeviceWidth,
          height:Platform.OS=='ios'?DeviceHeigth*8/100:DeviceHeigth*6/100,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center', paddingBottom: DeviceHeigth * 0.5 / 100, justifyContent: 'space-between', width: DeviceWidth
        }}>
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icons name={'arrow-left'} size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 20, fontFamily: 'serif' }}>
            {header}
          </Text>
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => {
              navigation.navigate('Search');
            }}>
            <Icons name={iconName} size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};
const styles = StyleSheet.create({
  rightIcon: {
    width: (DeviceHeigth * 6) / 100,
    height: (DeviceHeigth * 5) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingRight: 7,
  },
  leftIcon: {
    width: (DeviceHeigth * 6) / 100,
    height: (DeviceHeigth * 5) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingRight: 7,
  },
});

export default Header;
