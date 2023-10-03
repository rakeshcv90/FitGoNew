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
      setTime(1);
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
        source={time == 0 ? localImage.splash2 : localImage.splash}
        style={time == 0 ? styels.iconStyle : styels.logo}></Image>
    </View>
  );
};
const styels = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f39c1f',
    justifyContent: 'center',
  },
  logo: {
    width: DeviceWidth,
    height: DeviceHeigth,
  },
  iconStyle: {
    width: (DeviceWidth * 30) / 100,
    height: (DeviceHeigth * 30) / 100,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default SplaceScreen;
