import 'react-native-gesture-handler';
import { View, Text, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import Router, { LoginStack } from './src/Navigation/Router';
import FlashMessage, { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const navigationRef = createNavigationContainerRef();
import Loader from './src/Component/Loader';
import NetInfo from '@react-native-community/netinfo'
import { useSelector } from 'react-redux';
import { DeviceHeigth, DeviceWidth } from './src/Component/Config';
import RNRestart from 'react-native-restart'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BootSplash from "react-native-bootsplash"
// import { sendConnectionNotification } from './src/Component/Notification';
const App = () => {
  const [isLogged, setIsLogged] = useState()
  const [update, setUpdate] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isConnected, setConnected] = useState(true)
  const {defaultTheme}=useSelector(state=>state)
  // Checking if the App is Connected to the internet or not 
  useEffect(() => {
    const subscription = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // showMessage({
        //   message:"Online",
        //   animationDuration:500,
        //   statusBarHeight:getStatusBarHeight(),
        //   floating:true,
        //   type: 'success',
        //   icon: { icon: 'none', position: 'left' },
        // });
        setConnected(true)
      }
      else {
        // showMessage({
        //   message:"No Internet Connection",
        //   animationDuration:750,
        //   statusBarHeight:getStatusBarHeight(),
        //   floating:true,
        //   type: 'danger',
        //   icon: { icon: 'none', position: 'left' },
        // });
        setConnected(false)
      }
    })
    return () => {
      subscription();
    }
  }, [])

  useEffect(() => {
    UserAuth();
  }, [update])
  // Checking if User is Already Login or not
  const UserAuth = async () => { 
    try {
      const userData = await AsyncStorage.getItem('Data')
      const data = (JSON.parse(userData))
      if (data) {
        setIsLogged(true)
        setUpdate(update + 1)
        setIsLoaded(true)
      } else {
        setIsLogged(false)
        setUpdate(update + 1)
        setIsLoaded(true)
      }
    } catch (error) {
      setIsLogged(false)
      // setUpdate(update + 1)
      setIsLoaded(false)
    }
  }
  if (isLoaded && isLogged && isConnected) {
    return (
      <>
        <NavigationContainer ref={navigationRef} onReady={()=>BootSplash.hide({duration:2000})}>
          <Router />
        </NavigationContainer>
        <FlashMessage position='top' />
      </>
    )
  }
  else if (isLoaded && !isLogged && isConnected) {
    return (
      <>
        <NavigationContainer ref={navigationRef} onReady={()=>BootSplash.hide({duration:2000})}>
          <LoginStack />
        </NavigationContainer>
        <FlashMessage position='top' />
      </>
    )
  }
  // Will Visible When Internet is Disconnected
  else if (isConnected==false &&isLoaded) {
    return (
      <View style={[styles.View,{backgroundColor:defaultTheme?"#000":"#fff"}]}>
        <Text style={{ color: 'red' ,fontSize:20}}>No Internet Connection</Text>
        <Text style={{color:defaultTheme?"#fff":"#000"}}> Make sure you have connected to the Internet</Text>
        <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={()=>RNRestart.restart()}>
          <Text style={{color:"#fff" ,fontSize:16, fontFamily:'sans-serif',fontWeight:'bold'}}> Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }
  else {
    return (
      <Loader />
    )
  }
}
const styles=StyleSheet.create({
  View:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    marginVertical:DeviceHeigth*2/100,
    width:DeviceWidth*40/100,
    height:DeviceHeigth*4/100,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:100
  }
})
export default App