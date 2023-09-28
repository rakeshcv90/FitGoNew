import {View, Text, Image} from 'react-native';
import React from 'react';
import { localImage } from './Image';
import { DeviceHeigth, DeviceWidth } from './Config';

export const Logo = () => {
  const drawerWidth = (DeviceWidth * 65) / 100;
  const drawerHeight = DeviceHeigth;
  return (
    <>
      <View
        style={{
          height: (drawerHeight * 30) / 100,
          width: drawerWidth,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={localImage.logo}
          style={{
            height: (drawerHeight * 30) / 100,
            width: (drawerWidth * 65) / 100,
            justifyContent: 'center',
            resizeMode: 'contain',
          }}
        />
      </View>
    </>
  );
};
