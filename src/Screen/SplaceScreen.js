import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DeviceHeigth, DeviceWidth } from '../Component/Config';
import { localImage } from '../Component/Image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplaceScreen = ({ navigation }) => {
  const [time, setTime] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      UserAuth();

    }, 2000)
  }, [])
  const UserAuth = async () => {

    try {
      const userData = await AsyncStorage.getItem('Data')
      const data = (JSON.parse(userData))
      if (!!data) {
        navigation.navigate('DrawerNavigation')
      } else {
        navigation.navigate('Login')
      }
    } catch (error) {
      console.log("error", error)
      navigation.navigate('Login')
    }
  }
  // if(!isLoaded){
  //   return(
  //     <View>
  //       <CustomLoader/>
  //     </View>
  //   )
  // }else{
  return (
    <View style={styels.container}>
      <Image
        source={localImage.splash}
        style={styels.logo}></Image>
    </View>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: DeviceWidth,
    height: DeviceHeigth,
    resizeMode: 'stretch'
  }
});
export default SplaceScreen;
