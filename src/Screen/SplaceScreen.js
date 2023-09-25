import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DeviceHeigth, DeviceWidth} from '../Component/Config';
import {localImage} from '../Component/Image';

const SplaceScreen = ({navigation}) => {
  const [time, setTime] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
     UserAuth()
    changeSplace();
  }, []);
  const UserAuth=async()=>{
    setTimeout(()=>{
      // navigation.navigate("Login")
      // if(isLoggedIn){
      //   navigation.navigate('HomeDrawer')
      // }
      // else{
        navigation.navigate('Login')
      // }
  },3000)
    // try {
    //   const userData=await AsyncStorage.getItem('Data')
    //   const data=(JSON.parse(userData))
    //   console.log(data[0].email)
    //  if(data[0].email!=null){
    //    setIsLoggedIn(true)
    //  }
    //  else{
    //   setIsLoggedIn(false)
    //  }

    // } catch (error) {

    // }
  }

  const changeSplace = () => {
    setTimeout(() => {
      setTime(1);
    }, 1000);
  };
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
