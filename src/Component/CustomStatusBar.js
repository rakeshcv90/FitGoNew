import { View, Text ,Platform,StatusBar} from 'react-native'
import React from 'react'
import { DeviceWidth } from './Config';
import { useSelector } from 'react-redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const CustomStatusBar = () => {
    const StatusBar_Bar_Height=Platform.OS==='ios'?getStatusBarHeight():0;
    const { defaultTheme } = useSelector(state => state)
    // console.log(getStatusBarHeight(),Platform.OS)
  return (
    <View style={{
        width: DeviceWidth,
        height: StatusBar_Bar_Height,
        backgroundColor:'#f39c1f'
    }}>
        <StatusBar
            barStyle={defaultTheme?'light-content':'dark-content'}
        />
    </View>
);
}

export default CustomStatusBar