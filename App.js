import 'react-native-gesture-handler';
import { View, Text, SafeAreaView, Alert } from 'react-native'
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
import { setupNetworkListner } from './src/Component/NetworkUtils';
// import { sendConnectionNotification } from './src/Component/Notification';
const App = () => {
  // useEffect(()=>{
  //   Notification();
  //   },[])
  const [isLogged, setIsLogged] = useState()
  const [update, setUpdate] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isConnected,setConnected]=useState(false)
  // const thresoldTime=5000;
  // const Notification=()=>{
  //   setupNetworkListner(Disconnected=>{
  //     if(Disconnected){
  //       showMessage({
  //         message: 'No internet Connection',
  //                 type: 'danger',
  //                 icon: { icon: 'none', position: 'left'},
  //       })
  //       setConnected(false)
  //       console.log("dis",Disconnected,isConnected)
  //     }else {
  //       showMessage({
  //         message: 'Back to Online',
  //                 type: 'success',
  //                 icon: { icon: 'none', position: 'left'},
  //       })
  //       // Alert.alert("back")
  //       setConnected(true)
  //       console.log("misss",Disconnected,isConnected)
  //     }
  //   })
  // }
  useEffect(() => {
      UserAuth();
  }, [update])
  const UserAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('Data')
      const data = (JSON.parse(userData))
      if (!!data) {
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
  if (isLoaded && isLogged )  {
    return (
      <>
        <NavigationContainer ref={navigationRef}>
          <Router />
        </NavigationContainer>
        <FlashMessage position="top" />
      </>
    )
  }
  else if (isLoaded && !isLogged ) {
    return (
      <>
        <NavigationContainer ref={navigationRef}>
          <LoginStack />
        </NavigationContainer>
        <FlashMessage position="top" />
      </>
    )
  }
  else {
    return(
      
      <Loader/>
    )
  }
}

export default App