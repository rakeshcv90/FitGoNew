import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DeviceHeigth, DeviceWidth} from '../../Component/Config';
import {AppColor} from '../../Component/Color';

const ProgressBar = ({screen}: any) => {
  console.log(screen);
  return (
    <View
      style={{
        //   flex: 1,
        alignSelf: 'flex-start',
        alignItems: 'center',
        width: DeviceWidth * 0.9,
        marginBottom: DeviceHeigth * 0.05,
      }}>
      <View style={{flexDirection: 'row-reverse', alignSelf: 'flex-end'}}>
        <Text
          style={{
            color: '#83898C',
            fontFamily: 'Poppins',
            fontWeight: '400',
          }}>
          <Text style={{color: AppColor.RED}}>{`Step  ${screen} `}</Text>
          of 10
        </Text>
      </View>
      <View
        style={{
          width: DeviceWidth * 0.8,
          backgroundColor: '#E2E6F9',
          height: 5,
          borderRadius: 5,
          marginLeft: 40,
          marginTop: 5,
        }}>
        <View
          style={{
            width: screen == 0 ? '10%' : `${10 * screen}%`,
            backgroundColor: AppColor.RED,
            height: 5,
            borderRadius: 5,
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
