import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import {DeviceHeigth, DeviceWidth} from '../Component/Config';
  import {useNavigation} from '@react-navigation/native';
  import {HeaderStyleInterpolators} from '@react-navigation/stack';
  import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { localImage } from './Image';
const HeaderWithoutSearch= ({Header}) => {
    const navigation = useNavigation();
  return (
    <>
    <ImageBackground
      source={localImage.color_image}
      style={{
        width: DeviceWidth,
        height: (DeviceHeigth * 7) / 100,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
     
      <TouchableOpacity
        style={styles.leftIcon}
        onPress={() => {
          navigation.goBack();
        }}>
        <Icons name={"arrow-left"} size={25} color={'white'}/>
      </TouchableOpacity>
      <View style={{width:DeviceWidth*75/100,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color: 'white', fontSize: 20, fontFamily: 'serif',}}>
        {Header}
      </Text></View></ImageBackground></>
  )
}
const styles=StyleSheet.create({
    leftIcon:{
      width: (DeviceHeigth * 6) / 100,
      height: (DeviceHeigth * 5) / 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      paddingRight: 7,
    }
  })
export default HeaderWithoutSearch