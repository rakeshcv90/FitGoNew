import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {localImage} from '../../Component/Image';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
const Bulb = ({screen, header}: any) => {
  return (
    <View style={{alignItems: 'center', width: DeviceWidth * 0.9}}>
      <Text
        style={{
          color: 'black',
          fontSize: 24,
          fontFamily: 'Montserrat-Bold',
          fontWeight: 'bold',
          lineHeight: 30,
          textAlign: 'center',
        }}>
        {screen}
      </Text>

      {header ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: DeviceWidth * 0.9,
            backgroundColor: '#f5f5f5',
            padding: 15,
            borderRadius: 30,
            marginTop: 25,
          }}>
          <Image source={localImage.BULB} style={{marginLeft: 10}} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              fontFamily: 'Poppins',
              lineHeight: 16,
              paddingLeft: 10,
              paddingRight: 10,
              color: '#505050',
              // marginHorizontal: 10,
            }}>
            {header}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default Bulb;

const styles = StyleSheet.create({});
