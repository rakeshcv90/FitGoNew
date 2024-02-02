import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import { AppColor } from './Color';
const Loader = () => {
  return (
    <View
      style={{
        marginVertical: 60,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <ActivityIndicator
        color={AppColor.RED}
        size={50}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          height: 80,
        }}
      />
    </View>
  );
};
export default Loader;
