import { View, Text, SafeAreaView, StyleSheet, Switch,StatusBar } from 'react-native'
import React, { useState } from 'react'
import { setTheme } from '../Component/ThemeRedux/Actions'
import { useSelector, useDispatch } from 'react-redux'
import HeaderWithoutSearch from '../Component/HeaderWithoutSearch'
import CustomStatusBar from '../Component/CustomStatusBar'
const Settings = () => {
    const Dispatch = useDispatch()
    const { defaultTheme } = useSelector((state) => state)
    const [isEnabled, setIsEnabled] = useState(defaultTheme);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    // console.log("Tefdfdfgfd",defaultTheme)

    const changeTHEME = () => {
        if (!defaultTheme) {
            Dispatch(setTheme(true))
        } else {
            Dispatch(setTheme(false))
        }
    }
    return (
        <View style={[styels.container, { backgroundColor: defaultTheme == true ? "#000" : "#fff" }]}>
            {Platform.OS == 'android' ? <><StatusBar barStyle={defaultTheme ? 'light-content' : 'dark-content'} backgroundColor={'#941000'} /></> : <><CustomStatusBar /></>}
            <HeaderWithoutSearch Header={"Settings"} />
            <View style={{ borderBottomWidth: 1, marginVertical: 15, borderBottomColor: '#adadad', padding: 5, backgroundColor: defaultTheme == true ? "#000" : "#fff" }}>
                <Text style={{ fontSize: 18, color: defaultTheme == true ? "#fff" : "#000", marginHorizontal: 20 }}>Theme</Text>
            </View>
            <View style={styels.container1}>
                <Text style={{ color: defaultTheme == true ? "#fff" : "#000", marginHorizontal: 20 }}>Dark Mode</Text>
                <Switch trackColor={{ false: 'lightgrey', true: "orange" }}
                    thumbColor={isEnabled ? "#941000" : 'grey'}
                    onValueChange={() => {
                        toggleSwitch();
                        changeTHEME();
                    }}
                    value={isEnabled}
                />
            </View>
        </View>
    )
}
const styels = StyleSheet.create({
    container: {
        flex: 1
    },
    container1: {
        flexDirection: "row",
        justifyContent: 'space-between',
        margin: 10
    }
})
export default Settings