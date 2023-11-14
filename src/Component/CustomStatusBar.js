import { View, Text ,Platform,StatusBar, SafeAreaView} from 'react-native'
import React from 'react'
import { DeviceWidth } from './Config';
import { useSelector } from 'react-redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const CustomStatusBar = () => {
    const StatusBar_Bar_Height=Platform.OS==='ios'?getStatusBarHeight():0;
    const { defaultTheme } = useSelector(state => state)
  return (
    <SafeAreaView style={{
        width: DeviceWidth,
        height: StatusBar_Bar_Height,
        backgroundColor:'#C8170D'
    }}>
        <StatusBar
            barStyle={defaultTheme?'light-content':'dark-content'}
        />
    </SafeAreaView>
);
}

export default CustomStatusBar