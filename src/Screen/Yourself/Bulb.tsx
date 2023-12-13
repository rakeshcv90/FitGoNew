import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceWidth} from '../../Component/Config';

const Bulb = ({screen,header}: any) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Text
        style={{
          color: 'black',
          fontSize: 20,
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          lineHeight: 30,
        }}>
        {screen}
       
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          //justifyContent: 'space-between',
          width: DeviceWidth * 0.9,
          backgroundColor: '#f5f5f5',
          padding: 15,
          borderRadius: 30,
          marginTop: 25,
        }}>
        <Image source={localImage.BULB} />
        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            fontWeight: '400',
            fontFamily: 'Verdana',
            lineHeight: 16,
           paddingLeft: 10,
            paddingRight: 10,
            color: '#505050',
          }}>
         {header}
        </Text>
      </View>
    </View>
  );
};

export default Bulb;

const styles = StyleSheet.create({});
